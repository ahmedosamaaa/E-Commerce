import slugify from "slugify";
import { categoryModel } from "../../../DB/Models/CategoryModel.js";
import { subCategoryModel } from "../../../DB/Models/SubCategoryModel.js";
import cloudinary from "../../Utils/CloudinaryConfig.js";
import { customAlphabet } from "nanoid";
import { brandModel } from "../../../DB/Models/BrandModel.js";
import { productModel } from "../../../DB/Models/ProductModel.js";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5);

//=================createSubCategory=================
export const createSubCategory = async (req, res, next) => {
  const { id } = req.authUser
  const { categoryId } = req.params;
  const { name } = req.body;
  const categories = await categoryModel.findById(categoryId);
  if (!categories) {
    return next(new Error("invalid categoryID", { cause: 400 }));
  }

  if (await subCategoryModel.findOne({ name })) {
    //name
    return next(
      new Error("please enter different subCategory name", { cause: 400 })
    );
  }

  const slug = slugify(name, "_");
  //image
  if (!req.file) {
    return next(new Error("please insert photo", { cause: 400 }));
  }

  const customId = nanoid();

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${categories.customId}/subCategories/${customId}`,
    }
  );
  //save DB
  const subCategoryObject = {
    name,
    slug,
    customId,
    image: { secure_url, public_id },
    categoryId,
    createdBy:id
  };

  const subCategory = await subCategoryModel.create(subCategoryObject);
  if (!subCategory) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("please try again"), { cause: 400 });
  }
  res.status(200).json({ message: "success", subCategory });
};

// ============= get all subCategories with category Data ====================
export const getAllSubCategories = async (req, res, next) => {
  const subCategories = await subCategoryModel.find().populate([
    {
      path: "categoryId",
    },
  ]);
  res.status(200).json({ message: "Done", subCategories });
};

//======================== updateSubCategory =========================
export const updateSubCategory = async (req, res, next) => {
  const { id } = req.authUser;
  const { categoryId, subCategoryId } = req.query;
  const { name } = req.body;
  if (!subCategoryId || !categoryId) {
    return next(
      new Error("Please Enter Category & SubCategory IDs", { cause: 400 })
      );
    }
    const categoryExist = await categoryModel.findById(categoryId);
    const subCategory = await subCategoryModel.findById(subCategoryId);
    if (!subCategory) {
      return next(new Error("Enter Valid SubCategory ID", { cause: 400 }));
    }
    //==name==
  if (name) {
    //checkNameNotAsOld
    if (subCategory.name == name.toLowerCase()) {
      return next(new Error("Enter New Name", { cause: 400 }));
    }
    //checkNameIsUnique
    if (await subCategoryModel.findOne({ name })) {
      return next(new Error("please enter diffrent name ,dublicated"), {
        cause: 400,
      });
    }
  }
  //saveDB
  subCategory.name = name;
  subCategory.slug = slugify(name, "_");
  //==image==
  if (req.file) {
    //deleteOldImage
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    //insertNewImage
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}`,
      }
    );
    subCategory.image = { public_id, secure_url };
  }

  subCategory.categoryId = categoryId
  subCategory.updatedBy = id;
  //DB
  await subCategory.save();
  res.status(200).json({ message: "Updated Done", subCategory });
};

//======================== deleteSubCategory =========================
export const deleteSubCategory = async (req, res, next) => {
  const { categoryId, subCategoryId } = req.query;
  if (!categoryId || !subCategoryId) {
    return next(
      new Error("Please Enter Category & SubCategory IDs", { cause: 400 })
    );
  }
  const categoryExist = await categoryModel.findById(categoryId);
  const subCategory = await subCategoryModel.findById(subCategoryId);
  if (!categoryExist || !subCategory) {
    return next(
      new Error("Invalid Category & SubCategory IDs", { cause: 400 })
    );
  }
  //deleteSubCategory
  const deletedBrand = await subCategoryModel.deleteOne({ _id: subCategoryId });
  if (!deletedBrand.deletedCount) {
    return next(new Error("delete faild"));
  }
  //deleteImages
  //deleteFiles
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}`
  );
  //deleteFolder
  await cloudinary.api.delete_folder(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}`
  );
  //deleteBrands
  const deletedBrands = await brandModel.deleteMany({ subCategoryId });
  //deleteProducts
  const deletedProducts = await productModel.deleteMany({ subCategoryId })
  if (!deletedBrands.deletedCount) {
    return res.status(200).json({ message: "Deleted Done ,No Related Brands" });
  }
  if (!deletedProducts.deletedCount) {
    return res.status(200).json({ message: "Deleted Done ,No Related Products" });
  }
  res.status(200).json({ message: "Deleted Done" });
};
