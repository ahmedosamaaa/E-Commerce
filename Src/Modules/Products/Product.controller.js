import slugify from "slugify";
import { brandModel } from "../../../DB/Models/BrandModel.js";
import { categoryModel } from "../../../DB/Models/CategoryModel.js";
import { subCategoryModel } from "../../../DB/Models/SubCategoryModel.js";
import cloudinary from "../../Utils/CloudinaryConfig.js";
import { customAlphabet } from "nanoid";
import { productModel } from "../../../DB/Models/ProductModel.js";
import { paginationFunction } from "../../Utils/Pagination.js";
import { ApiFeatures } from "../../Utils/apiFeatures.js";
const nanoid = customAlphabet("123456_=!ascbhdtel", 5);

// =============createProduct============
export const createProduct = async (req, res, next) => {
  const{ id } = req.authUser;
  const { categoryId, subCategoryId, brandId } = req.query;
  const { title, desc, colors, sizes, price, appliedDiscount, stock } =
    req.body;
  const categoryExist = await categoryModel.findOne({ _id: categoryId });
  if (!categoryExist) {
    return next(new Error("invalid categories", { cause: 400 }));
  }
  const subCategoryExist = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (!subCategoryExist) {
    return next(new Error("invalid subCategories", { cause: 400 }));
  }
  const brandExist = await brandModel.findOne({
    _id: brandId,
    subCategoryId,
    categoryId,
  });
  if (!brandExist) {
    return next(new Error("invalid brands", { cause: 400 }));
  }

  // console.log(brandExist.categoryId);
  // console.log(subCategoryExist.categoryId);
  // if (
  //   categoryExist._id.toString() != subCategoryExist.categoryId.toString() ||
  //   subCategoryExist._id.toString() != brandExist.subCategoryId.toString()
  // ) {
  //   return next(new Error("product doesnt match this IDs"));
  // }
  // if (!subCategoryExist || !categoryExist || !brandExist) {
  //   return next(new Error("invalid categories", { cause: 400 }));
  // }

  //createSlug
  const slug = slugify(title, "_");
  //discount
  const priceAfterDiscount = price - price * ((appliedDiscount || 0) / 100);
  //images
  if (!req.files) {
    return next(new Error("please upload pictures", { cause: 400 }));
  }
  const customId = nanoid();
  const images = [];
  const publicIds = [];
  for (const file of req.files) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brandLogos/${brandExist.customId}/products/${customId}`,
      }
    );
    images.push({ secure_url, public_id });
    publicIds.push(public_id);
  }
  req.imagePath = `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brandLogos/${brandExist.customId}/products/${customId}`;
  const productObject = {
    title,
    slug,
    desc,
    price,
    appliedDiscount,
    priceAfterDiscount,
    colors,
    sizes,
    stock,
    categoryId,
    subCategoryId,
    brandId,
    images: images,
    customId,
    createdBy:id,
  };

  const product = await productModel.create(productObject);
  if (!product) {
    await cloudinary.api.delete_resources(publicIds);
    return next(new Error("try again later", { cause: 400 }));
  }
  res.status(200).json({ message: "Done", product });
};

// ======================updateProduct=========================
export const updateProduct = async (req, res, next) => {
  const{ id } = req.authUser;
  const { categoryId, subCategoryId, brandId, productId } = req.query;
  const { title, desc, colors, sizes, price, appliedDiscount, stock } =
    req.body;

  const productExist = await productModel.findById(productId);
  if (!productExist) {
    return next(new Error("Product is not found"), { cause: 400 });
  }

  //category
  const categoryExist = await categoryModel.findById(
    categoryId || productExist.categoryId
  );
  if (categoryId) {
    if (!categoryExist) {
      return next(new Error("invalid categories", { cause: 400 }));
    }
    productExist.categoryId = categoryId;
  }
  //subCategory
  const subCategoryExist = await subCategoryModel.findById(
    subCategoryId || productExist.subCategoryId
  );
  if (subCategoryId) {
    if (!subCategoryExist) {
      return next(new Error("invalid subCategories", { cause: 400 }));
    }
    productExist.subCategoryId = subCategoryId;
  }
  //brand
  const brandExist = await brandModel.findById(brandId || productExist.brandId);
  if (brandId) {
    if (!brandExist) {
      return next(new Error("invalid Brand", { cause: 400 }));
    }
    productExist.brandId = brandId;
  }
  //check if they related to each other
  if (
    categoryExist._id.toString() != subCategoryExist.categoryId.toString() ||
    subCategoryExist._id.toString() != brandExist.subCategoryId.toString()
  ) {
    return next(
      new Error(
        "this product category, subcategory and brand doesn't realated to each other"
      )
    );
  }
  //updatePrice
  if (price && appliedDiscount) {
    const priceAfterDiscount = price - price * ((appliedDiscount || 0) / 100);
    productExist.price = price;
    productExist.appliedDiscount = appliedDiscount;
    productExist.priceAfterDiscount = priceAfterDiscount;
  } else if (price) {
    const priceAfterDiscount =
      price - price * ((productExist.appliedDiscount || 0) / 100);
    productExist.price = price;
    productExist.priceAfterDiscount = priceAfterDiscount;
  } else if (appliedDiscount) {
    const priceAfterDiscount =
      productExist.price - productExist.price * ((appliedDiscount || 0) / 100);
    productExist.appliedDiscount = appliedDiscount;
    productExist.priceAfterDiscount = priceAfterDiscount;
  }
  //updateImage
  if (req.files?.length) {
    //deleteOldImages
    let publicIds = [];
    for (const images of productExist.images) {
      publicIds.push(images.public_id);
    }
    await cloudinary.api.delete_resources(publicIds);
    //updateImage
    let images = [];
    for (const file of req.files) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brandLogos/${brandExist.customId}/products/${productExist.customId}`,
        }
      );
      images.push({ public_id, secure_url });
    }
    productExist.images = images;
  }
  if (title) {
    productExist.title = title;
    productExist.slug = slugify(title, "-");
  }
  if (desc) productExist.desc = desc;
  if (colors) productExist.colors = colors;
  if (sizes) productExist.sizes = sizes;
  if (stock) productExist.stock = stock;

  productExist.updatedBy = id;
  await productExist.save();
  res.status(200).json({ message: "Done", productExist });
};

// ======================deleteProduct=========================
export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { categoryId, subCategoryId, brandId } = req.query;
  //category
  const categoryExist = await categoryModel.findById(categoryId);
  if (!categoryId) {
    return next(
      new Error("please enter product's category id", { cause: 400 })
    );
  }
  if (!categoryExist) {
    return next(new Error("invalid categories", { cause: 400 }));
  }
  //subCategory
  const subCategoryExist = await subCategoryModel.findById(subCategoryId);
  if (!subCategoryId) {
    return next(
      new Error("please enter product's subCategory id", { cause: 400 })
    );
  }
  if (!subCategoryExist) {
    return next(new Error("invalid subCategories", { cause: 400 }));
  }
  //brand
  const brandExist = await brandModel.findById(brandId);
  if (!brandId) {
    return next(new Error("please enter product's brand id", { cause: 400 }));
  }
  if (!brandExist) {
    return next(new Error("invalid brand", { cause: 400 }));
  }
  //check if they related to each other
  if (
    categoryExist._id.toString() != subCategoryExist.categoryId.toString() ||
    subCategoryExist._id.toString() != brandExist.subCategoryId.toString()
  ) {
    return next(
      new Error(
        "the Product's Category, Subcategory and Brand doesn't realated to each other"
      )
    );
  }
  const productExist = await productModel.findByIdAndDelete(productId);
  if (!productExist) {
    return next(new Error("Product is not found"), { cause: 400 });
  }
  //deleteFiles
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brandLogos/${brandExist.customId}/products/${productExist.customId}`
  );
  //deleteFolder
  await cloudinary.api.delete_folder(
    `${process.env.PROJECT_FOLDER}/Categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/brandLogos/${brandExist.customId}/products/${productExist.customId}`
  );
  res.status(200).json({ message: "Deleted Done" });
};

// // ======================getProductsPaginated==================
// export const listProduct = async (req, res, next) => {
//   const { pageNumber, size } = req.query;
//   const { limit, skip, page } = paginationFunction(pageNumber, size);
//   const products = await productModel.find().limit(limit).skip(skip);
//   res.status(200).json({ message: "done", page, products });
// };

//====================searchProduct=========================
export const searchProduct = async (req, res, next) => {
  const { keyword, page, size } = req.query;
  const { limit, skip } = paginationFunction({ page, size });
  const product = await productModel
    .find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { desc: { $regex: keyword, $options: "i" } },
      ],
    })
    .limit(limit)
    .skip(skip);
  res.status(200).json({ message: "Done", product });
};

// =====================getProducts======================
export const getProducts = async (req, res, next) => {
  const apiFeaturesInstance = new ApiFeatures(productModel.find(),req.query).pagination().sort().select().filter();
  const data = await apiFeaturesInstance.mongooseQuery;
  const page = apiFeaturesInstance.page
  res.status(200).json({ message: "done",page, data });
};


// =====================getProductsWithReviews======================
export const getProductsWithReviews = async (req, res, next) => {
  const apiFeaturesInstance = new ApiFeatures(productModel.find(),req.query).pagination().sort().select().filter();
  const data = await apiFeaturesInstance.mongooseQuery.populate(
    [
      {
        path:'Reviews'
      }
    ]);
  const page = apiFeaturesInstance.page
  res.status(200).json({ message: "done",page, data });
};
