import slugify from "slugify";
import cloudinary from "../../Utils/CloudinaryConfig.js";
import { categoryModel } from "../../../DB/Models/CategoryModel.js";
import { customAlphabet } from "nanoid";
import { subCategoryModel } from "../../../DB/Models/SubCategoryModel.js";
import { brandModel } from "../../../DB/Models/BrandModel.js";
import { productModel } from "../../../DB/Models/ProductModel.js";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5);

//=============== createCategory ================//
export const createCategory = async (req, res, next) => {
  const { id } = req.authUser
  const { name } = req.body;
  const slug = slugify(name, "_");
  // check name is unique
  if (await categoryModel.findOne({ name })) {
    return next(
      new Error("please enter different category name", { cause: 400 })
    );
  }

  // insertPhoto
  if (!req.file) {
    return next(new Error("please insert photo", { cause: 400 }));
  }

  const customId = nanoid();

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${customId}`,
    }
  );

  // save in DB
  const categoryObject = {
    name,
    slug,
    image: {
      secure_url,
      public_id,
    },
    customId,
    createdBy: id,
  };

  const category = await categoryModel.create(categoryObject);

  // if category not found
  if (!category) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("please try agin"), { cause: 400 });
  }
  res.status(200).json({ message: "success", category });
};

//==================== updateCategory ==========================

export const updateCategory = async (req, res, next) => {
  const { id } = req.authUser
  const { categoryId } = req.params;
  const { name } = req.body;
  console.log(id);
  const category = await categoryModel.findOne({_id: categoryId, createdBy: id });
  console.log(category);
  if (!category) {
    return next(new Error("invalid category id", { cause: 400 }));
  }

  //name
  if (name) {
    //different from old name
    if (category.name == name.toLowerCase()) {
      return next(new Error("please enter diffrent name"), { cause: 400 });
    }
    //unique
    if (await categoryModel.findOne({ name })) {
      return next(new Error("please enter diffrent name ,dublicated"), {
        cause: 400,
      });
    }
    category.name = name;
    category.slug = slugify(name, "_");
  }

  //image
  if (req.file) {
    //delete old photo
    await cloudinary.uploader.destroy(category.image.public_id);
    //upload new photo
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${category.customId}`,
      }
    );
    //db
    category.image = { public_id, secure_url };
    category.updatedBy = id;
  }
  await category.save();
  res.status(200).json({ message: "Updated Done", category });
};
// ========================= deleteCategory ========================
export const deleteCategory = async (req, res, next) => {
  const { id } = req.authUser
  const { categoryId } = req.query;
  // checkOnId
  if (!categoryId) {
    return next(new Error("Please Enter Category ID", { cause: 400 }));
  }
  // checkOnCategory
  const categoryExist = await categoryModel.findOne({ _id:categoryId, createdBy:id });
  if (!categoryExist) {
    return next(new Error("Invalid Category ID", { cause: 400 }));
  }
  //deleteCategory
  const isDeleted = await categoryModel.deleteOne(categoryExist)
  if(!isDeleted.deletedCount){
    return next(new Error("Deleted Fail", { cause: 400 }));
  }
  // delete files from cloudinary
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}`
  );
  // delete folders from cloudinary
  await cloudinary.api.delete_folder(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}`
  );
  // deleteSubCategory
  const deleteSubCategory = await subCategoryModel.deleteMany({ categoryId });
  // deleteBrands
  const deleteBrands = await brandModel.deleteMany({ categoryId });
  //deleteProducts
  const deleteProducts =await productModel.deleteMany({categoryId})
  res.status(200).json({ message: "Deleted Done" });
};

//=============== get all categories ======================
export const getAllCategories = async (req, res, next) => {
  const Categories = await categoryModel.find();
  res.status(200).json({ message: "Done", Categories });
};

//================== get all categories with subCategory ======================
//========================== with normal for loop =============================

// export const getCategoriesWithSub = async (req, res, next) => {
//   const Categories = await categoryModel.find();

//   let categoryArr = [];
//   for (const category of Categories) {
//     const subCategories = await subCategoryModel.find({
//       categoryId: category._id,
//     });
//     const objectCat = category.toObject();
//     objectCat.subCategories = subCategories;
//     categoryArr.push(objectCat);
//   }
//   res.status(200).json({ message: "Updated Done", categoryArr });
// };

//=============== get all categories with subCategories virtuals ======================
export const getCategoriesWithSub = async (req, res, next) => {
  const Categories = await categoryModel.find().populate([
    {
      path: "subCategory",
      select: "name",
      populate: [
        {
          path: "Brands",
          select: "name",
        },
      ],
    },
  ]);
  res.status(200).json({ message: "Updated Done", Categories });
};
