import slugify from "slugify";
import { categoryModel } from "../../../DB/Models/CategoryModel.js";
import { subCategoryModel } from "../../../DB/Models/SubCategoryModel.js";
import { customAlphabet } from "nanoid";
import cloudinary from "../../Utils/CloudinaryConfig.js";
import { brandModel } from "../../../DB/Models/BrandModel.js";
import { productModel } from "../../../DB/Models/ProductModel.js";
import { ApiFeatures } from "../../Utils/apiFeatures.js";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5);

// ==============createBrand=============
export const createBrand = async (req, res, next) => {
  const { id } = req.authUser
  const { categoryId, subCategoryId } = req.query;
  const { name } = req.body;
  // checkCategories
  const categories = await categoryModel.findById(categoryId);
  const subCategories = await subCategoryModel.findById(subCategoryId);
  if(categories._id.toString()!=subCategories.categoryId){
    return next (new Error("category and subCategory doesn't related to each other"))
  }
  if (!categories || !subCategories) {
    return next(new Error("invalid Categories ID", { cause: 400 }));
  }
  // createSlug
  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });
  // createCustomID
  const customId = nanoid();
  // uploadBranLogo
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.PROJECT_FOLDER}/Categories/${categories.customId}/subCategories/${subCategories.customId}/brandLogos/${customId}`,
    }
  );

  //saveDB
  const brandObject = {
    name,
    slug,
    customId,
    logo: { secure_url, public_id },
    categoryId,
    subCategoryId,
    createdBy: id,
  };
  const brand = await brandModel.create(brandObject);
  if (!brand) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("Try Again", { cause: 400 }));
  }
  console.log(brand);
  res.status(200).json({ message: "success", brand });
};
//==============updateBrand==============
export const updateBrand = async (req, res, next) => {
  const { id } = req.authUser
  const { categoryId, subCategoryId, brandId } = req.query;
  const { name } = req.body;

  if (!categoryId || !subCategoryId || !brandId) {
    return next(
      new Error("Please Enter SubCategory & Brand IDs", { cause: 400 })
    );
  }
  const brand = await brandModel.findById(brandId);
  if (!brand) {
    return next(new Error("Enter Valid Brand ID", { cause: 400 }));
  }
  const categories = await categoryModel.findById(categoryId);
  if (!categories) {
    return next(new Error("Enter Valid Category ID", { cause: 400 }));
  }
  const subCategories = await subCategoryModel.findOne({ _id:subCategoryId, categoryId});
  if (!subCategories) {
    return next(new Error("Enter Valid subCategory ID or no relation with category", { cause: 400 }));
  }
  brand.subCategoryId = subCategoryId;


  //name
  if (!name) {
    new Error("Please Enter Brand Name", { cause: 400 });
  }
  //checkNameNotSame
  if (brand.name == name.toLowerCase()) {
    return next(new Error("Enter New Name", { cause: 400 }));
  }
  //checkNameUnique
  if (await brandModel.findOne({ name })) {
    return next(new Error("please enter diffrent name ,dublicated"), {
      cause: 400,
    });
  }
  // changeName
  brand.name = name;
  brand.slug = slugify(name, "_");

  //image
  if (req.file) {
    console.log(brand.logo.public_id);
    //deleteOldImage
    await cloudinary.uploader.destroy(brand.logo.public_id);
    //insertNewImage
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${categories.customId}/subCategories/${subCategories.customId}/brandLogos/${brand.customId}`,
      }
    );
    brand.logo = { public_id, secure_url };
  }
  brand.updatedBy = id;
  //DB
  await brand.save();
  res.status(200).json({ message: "Updated Done", brand });
};

//================= deleteBrand ============
export const deleteBrand = async (req, res, next) => {
  const {categoryId ,subCategoryId, brandId } = req.query;
  if (!subCategoryId || !brandId) {
    return next(
      new Error("Please Enter  SubCategory & Brand IDs", { cause: 400 })
    );
  }
  const subCategory = await subCategoryModel.findById(subCategoryId);
  const brand = await brandModel.findOne({ _id:brandId,subCategoryId });
  if (!subCategory || !brand) {
    return next(new Error("Invalid subCategory & brand IDs", { cause: 400 }));
  }
  const categoryExist = await categoryModel.findById(brand.categoryId);
  //deleteBrand
  const deletedBrand = await brandModel.deleteOne({ _id: brandId });
  if (!deletedBrand.deletedCount) {
    return next(new Error("delete faild"));
  }
  //deleteImages
  //deleteFiles
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}/brandLogos/${brand.customId}`
  );
  //deleteFolder
  await cloudinary.api.delete_folder(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategory.customId}/brandLogos/${brand.customId}`
  );
  //deleteProduct
  const deletedProducts = await productModel.deleteMany ({ brandId })
  if (!deletedProducts.deletedCount) {
    return res.status(200).json({ message: "Deleted Done ,No Related Products" });
  }
  res.status(200).json({ message: "Deleted Done" });
};

//============ getBrands ========
export const getBrands = async (req,res,next) => {
  const apiFeaturesInstance = new ApiFeatures(brandModel.find(),req.query)
      .pagination()
      .sort()
      .select()
      .filter();
  const data = await apiFeaturesInstance.mongooseQuery;
  const page = apiFeaturesInstance.page
  res.status(200).json({ message: "done",page, data });
}