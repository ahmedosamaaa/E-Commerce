import { nanoid } from "nanoid"
import { cartModel } from "../../../DB/Models/CartModel.js"
import { couponModel } from "../../../DB/Models/CouponModel.js"
import { orderModel } from "../../../DB/Models/OrderModel.js"
import { productModel } from "../../../DB/Models/ProductModel.js"
import { isCouponValid } from "../../Utils/couponValidation.js"
import createInvoice from "../../Utils/pdfkit.js"
import { sendEmailService } from "../../Services/SendEmailService.js"
import { qrCodeResult } from "../../Utils/qrCode.js"


// ============createOrder===========
export const createOrder = async(req,res,next) => {
    const userId = req.authUser._id
    const {
        productId,
        quantity,
        address,
        phoneNumbers,
        paymentMethod,
        couponCode,
    } =req.body

//====== coupon check =====
    if(couponCode){
        const coupon = await couponModel
            .findOne({ couponCode })
            .select(' isPercentage isFixedAmount couponAmount couponAssginedToUsers ')
        const isCouponValidResult = await isCouponValid({ couponCode, userId, next })
        if(isCouponValidResult !== true){
            return next (new Error(isCouponValidResult.msg, { cause: 400 }));
        }
        req.coupon = coupon;
    }

//======== products =====
    let products = []
    const isProductValid = await productModel.findOne({ _id:productId, stock: { $gte: quantity }})
    if(!isProductValid){
        return next (new Error ('invalid product, check your quantity ',{ cause: 400 }) )
    }
    const productObject = {
        productId,
        quantity,
        title: isProductValid.title,
        price:isProductValid.priceAfterDiscount,
        finalPrice:isProductValid.priceAfterDiscount * quantity,
    }
    products.push(productObject)
    //subTotal
    let subTotal = productObject.finalPrice; 
    //paidAmount
    let paidAmount = 0;
    //percent
    if(req.coupon?.isPercentage){
        paidAmount = subTotal * ( 1 - (req.coupon.couponAmount || 0 ) / 100);
    }
    //fixed
    else if (req.coupon?.isFixedAmount){
        paidAmount = subTotal - req.coupon.couponAmount;
    }else{
        paidAmount = subTotal;
    }

    //orderStatus
    let orderStatus;
    paymentMethod == 'cash' ? (orderStatus = 'confirmed') : (orderStatus = 'pending') ;

    //DB
    const orderObject = {
        userId,
        products,
        subTotal,
        address,
        paidAmount,
        phoneNumbers,
        couponId: req.coupon?._id,
        orderStatus,
        paymentMethod,
    };
    const orderDB = await orderModel.create(orderObject);
    //increase usageCount
    if(!orderDB){
        return next(new Error('Fail to create order',{ cause: 400  }))
    }
    //increase usageCount
    if(req.coupon){
        for (const user of req.coupon.couponAssginedToUsers) {
            if(userId.toString() == user.userId.toString()){
                user.usageCount += 1
            }
        }
    await req.coupon.save()
    }
    //decrease productStock
    await productModel.findOneAndUpdate({ _id: productId },{
        $inc:{ stock : -parseInt(quantity) }
    })
    //remove product from card if exist
    const cart = await cartModel.findOne({userId:userId})
    cart.products.forEach((ele)=>{
        if(ele.productId == productId){
            cart.products.splice( cart.products.indexOf(ele), 1 )
            cart.subTotal = cart.subTotal - (isProductValid.price * quantity)
        }
    })
    await cart.save();
    //==================== invice ==================
    const orderCode = `${req.authUser.userName}_${nanoid(3)}`
    const orderInvice = {
        orderCode,
        shipping: {
            name: req.authUser.userName,
            address: orderDB.address ,
            city: "Cairo",
            state: "Cairo",
            country: "Cairo",
        },
        date: orderDB.createdAt,
        items: orderDB.products,
        subTotal: orderDB.subTotal,
        paidAmount: orderDB.paidAmount,
    }
    await createInvoice(orderInvice,`${orderCode}.pdf`)
    await sendEmailService({
        to: req.authUser.email,
        subject: 'Order Invice',
        message: 'Please Take Look On Your Invice',
        attachments: [
            {
                path: `./Files/${orderCode}.pdf`
            }
        ]
    })
    const orderQr = await qrCodeResult({data:{orderId:orderDB._id , products:orderDB.products}})
    return res.status(200).json({ Message: "Done", orderDB,orderQr });

} 

//==========changeCartToOrder==================
export const cartToOrder = async (req,res,next) => {
    const userId = req.authUser._id
    const { cartId } = req.query
    const {
        address,
        phoneNumbers,
        paymentMethod,
        couponCode,
    } =req.body

    const cart = await cartModel.findById(cartId)
    if(!cart || !cart.products.length){
        return next (new Error('please fill your cartt first',{cause:400}))
    }

    //====== coupon check =====
    if(couponCode){
        const coupon = await couponModel
            .findOne({ couponCode })
            .select(' isPercentage isFixedAmount couponAmount couponAssginedToUsers ')
        const isCouponValidResult = await isCouponValid({ couponCode, userId, next })
        if(isCouponValidResult !== true){
            return next (new Error(isCouponValidResult.msg, { cause: 400 }));
        }
        req.coupon = coupon;
    }
    let subTotal = cart.subTotal

    //paidAmount
    let paidAmount = 0;
    //percent
    if(req.coupon?.isPercentage){
        paidAmount = subTotal * ( 1 - (req.coupon.couponAmount || 0 ) / 100);
    }
    //fixed
    else if (req.coupon?.isFixedAmount){
        paidAmount = subTotal - req.coupon.couponAmount;
    }else{
        paidAmount = subTotal;
    }

    //orderStatus
    let orderStatus;
    paymentMethod == 'cash' ? (orderStatus = 'confirmed') : (orderStatus = 'pending') ;

    //products
    let productsArr = []
    for (const product of cart.products) {
        const productExist = await productModel.findById(product.productId)
        productsArr.push({
            productId: product.productId,
            quantity: product.quantity,
            title: productExist.title,
            price: productExist.price,
            finalPrice: productExist.priceAfterDiscount * product.quantity,
        })
    }


    const orderObject = {
        userId,
        products:productsArr,
        subTotal,
        address,
        paidAmount,
        phoneNumbers,
        couponId: req.coupon?._id,
        orderStatus,
        paymentMethod,
    };
    const orderDB = await orderModel.create(orderObject);
    //increase usageCount
    if(!orderDB){
        return next(new Error('Fail to create order',{ cause: 400  }))
    }
    //increase usageCount
    if(req.coupon){
        for (const user of req.coupon.couponAssginedToUsers) {
            if(userId.toString() == user.userId.toString()){
                user.usageCount += 1
            }
        }
    await req.coupon.save()
    }
    //decrease productStock
    for (const product of cart.products) {
        
        await productModel.findOneAndUpdate({ _id: product.productId },
            {
                $inc:{ stock : -parseInt(product.quantity) }
            })
    }
    //remove product from card if exist
    cart.products = [];
    await cart.save();
    //================ QRCode ===================
    const orderQr = await qrCodeResult({data:{orderId:orderDB._id , products:orderDB.products}})
    //==================== invice ==================
    const orderCode = `${req.authUser.userName}_${nanoid(3)}`
    const orderInvice = {
        orderCode,
        shipping: {
            name: req.authUser.userName,
            address: orderDB.address ,
            city: "Cairo",
            state: "Cairo",
            country: "Cairo",
        },
        date: orderDB.createdAt,
        items: orderDB.products,
        subTotal: orderDB.subTotal,
        paidAmount: orderDB.paidAmount,
    }
    await createInvoice(orderInvice,`${orderCode}.pdf`)
    return res.status(200).json({ Message: "Done", orderDB, orderQr });
}