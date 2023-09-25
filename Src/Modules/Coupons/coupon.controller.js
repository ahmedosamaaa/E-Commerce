import { couponModel } from "../../../DB/Models/CouponModel.js"
import { userModel } from "../../../DB/Models/UserModel.js"
import { ApiFeatures } from "../../Utils/apiFeatures.js"


//============createCoupon=============
export const createCoupon = async (req,res,next) => {
    const {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        couponAssginedToUsers,
    } = req.body

    //check if couponCode is dublicate
    const isCouponCodeDuplicate = await couponModel.findOne({ couponCode })
    if(isCouponCodeDuplicate){
        return next (new Error('duplicate couponCode', { cause: 400 }))
    }
    //must choose one fixed or percentage
    if( (!isPercentage && !isFixedAmount) || (isPercentage && isFixedAmount) ){
        return next(
            new Error('select if the coupon is percentage or fixedAmount', {cause: 400,}),
        )
    }
    //assign to users
    if(couponAssginedToUsers){
        let userIds = [];
        for (const user of couponAssginedToUsers) {
            userIds.push(user.userId);
        }
        const userCheck = await userModel.find({
            _id: { $in: userIds }
        })
        if(userCheck.length != userIds.length){
            return next(
                new Error('invalid users ids', {cause: 400,}),
            )
        }
    }
    const couponObject = {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        couponAssginedToUsers,
        createdBy: req.authUser.id
    }
    const couponDb = await couponModel.create(couponObject)
    if (!couponDb) {
        return next(new Error('fail to add coupon', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', couponDb })
}

// ===============updateCoupon=================
export const updateCoupon = async (req,res,next) => {
    const { couponId } = req.params;
    const {
        couponCode,
        couponAmount,
        fromDate,
        toDate,
        isPercentage,
        isFixedAmount,
        couponStatus,
    } = req.body;

    //ifCouponExist
    const isCouponExist = await couponModel.findById( couponId )
    if( !isCouponExist ){
        return next (new Error('coupon is not exist', { cause: 400 }))
    }

    //======couponCode=======
    if(couponCode){
        //codeAsOld
        if(isCouponExist.couponCode === couponCode){
            return next (new Error('please enter new couponCode', { cause: 400 }))
        }
    
        //isCouponCodeUnique
        if( await couponModel.findOne({couponCode}) === couponCode ) {
            return next (new Error('couponCode must be unique', { cause: 400 }))
        }
    
        isCouponExist.couponCode=couponCode;
    }

    //======couponAmount=======
    if(couponAmount){
        //amountAsOld
        if(isCouponExist.couponAmount === couponAmount){
            return next (new Error('please enter new couponAmount', { cause: 400 }))
        }
        isCouponExist.couponAmount=couponAmount;
    }

    //======fromDate=======
    if(fromDate){
        //fromDateAsOld
        if(isCouponExist.fromDate === fromDate){
            return next (new Error('please enter new fromDate', { cause: 400 }))
        }
        isCouponExist.fromDate = fromDate
    }
    //======toDate=======
    if(toDate){
        //toDateAsOld
        if(isCouponExist.toDate === toDate){
            return next (new Error('please enter new toDate', { cause: 400 }))
        }
        isCouponExist.fromDate = fromDate
    }

    //======isPercentage=======
    if(isPercentage){
        //isPercentageAsOld
        if(isCouponExist.isPercentage === isPercentage){
            return next (new Error('please enter new isPercentage', { cause: 400 }))
        }
        isCouponExist.isPercentage = isPercentage;
    }

    //======isFixedAmount=======
    if(isFixedAmount){
        //isFixedAmountAsOld
        if(isCouponExist.isFixedAmount === isFixedAmount){
            return next (new Error('please enter new isFixedAmount', { cause: 400 }))
        }
        isCouponExist.isFixedAmount = isFixedAmount;
    }
    
    //======couponStatus=======
    if(couponStatus){
        //couponStatusAsOld
        if(isCouponExist.couponStatus === couponStatus){
            return next (new Error('please enter new couponStatus', { cause: 400 }))
        }
        isCouponExist.couponStatus = couponStatus;
    }
    
    isCouponExist.updatedBy = req.authUser.id

    //DB
    await isCouponExist.save();
    res.status(200).json({ message: 'Done', isCouponExist })


}

//=============getCoupons===========
export const getCoupons = async (req,res,next) => {
    const apiFeaturesInstance = new ApiFeatures(couponModel.find(),req.query)
        .pagination()
        .sort()
        .select()
        .filter();
    const data = await apiFeaturesInstance.mongooseQuery;
    const page = apiFeaturesInstance.page
    res.status(200).json({ message: "done",page, data });
}

//===========deleteCoupon==========
export const deleteCoupon = async (req,res,next) => {
    const { couponId } = req.params
    //couponExist
    const couponExist = await couponModel.findById(couponId)
    if(!couponExist){
        return next (new Error('inValid couponID', { cause: 400 }))
    }
    await couponModel.deleteOne(couponExist)
    res.status(200).json({ message: "done" });
}