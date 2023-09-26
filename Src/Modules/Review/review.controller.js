import { orderModel } from "../../../DB/Models/OrderModel.js";
import { productModel } from "../../../DB/Models/ProductModel.js";
import { reviewModel } from "../../../DB/Models/ReviewModel.js";


//==============addReview===========
export const addReview = async(req,res,next) =>{
    const userId = req.authUser._id;
    const{ productId } = req.query;
    const isProductValidToBeReviewed = await orderModel.findOne({
        userId,
        'products.productId':productId,
    })
    if(!isProductValidToBeReviewed){
        return next (new Error('you should buy the product first',{cause: 400}));
    }
    const{ reviewRate, reviewComment } = req.body;
    const reviewObject = {
        userId,
        productId,
        reviewRate,
        reviewComment,
    }
    const reviewDB = await reviewModel.create(reviewObject)
    if(!reviewDB){
        return next (new Error('fail to add review',{cause: 400}));
    }
    //====== calc rate of review in productModel ======
    const product = await productModel.findById(productId);
    const reviews = await reviewModel.find({ productId });
    let sumOfRates = 0;
    for (const review of reviews) {
        sumOfRates += review.reviewRate
    }
    product.rate = Number( sumOfRates / reviews.length ).toFixed(2)
    await product.save();
    res.status(201).json({Message:'Done', reviewDB ,product})
}

