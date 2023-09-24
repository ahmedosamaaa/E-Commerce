import { cartModel } from "../../../DB/Models/CartModel.js";
import { productModel } from "../../../DB/Models/ProductModel.js"


//========Add to card ===============
export const addToCart = async(req,res,next)=>{
    const { id } = req.authUser;
    const { productId, quantity  } = req.body
    const product = await productModel.findOne({
        _id: productId , stock: { $gte:quantity }
    })
    if(!product){
        return next (new Error("invalid id", { cause: 400 }))
    }

    const userCart = await cartModel.findOne({ userId: id }).lean()
    if(userCart){
        //update quantity
        let productExist = false ;
        for (const product of userCart.products) {
            if( productId == product.productId ){
                productExist = true
                product.quantity = quantity
            }
        }
        //push new product
        if(!productExist){
            userCart.products.push({ productId, quantity })
        }
        //subTotal
        let subTotal = 0
        for (const product of userCart.products) {
            const productExist = await productModel.findById(product.productId)
            subTotal += (productExist.priceAfterDiscount * product.quantity) || 0
        }
        const newCart = await cartModel.findOneAndUpdate({ userId: id },{
            subTotal,
            products: userCart.products,
        },
        {
            new:true
        })
        return res.status(200).json({message: 'Done', newCart })
    }
    
    const cardObject={
        userId: id,
        products: [{ productId, quantity }],
        subTotal : product.priceAfterDiscount * quantity,
    }

    const cardDB = await cartModel.create(cardObject)
    res.status(200).json({message: 'Done', cardDB })
}

// =============deleteFromCart===========
export const deleteFromCart =async (req,res,next)=>{
    const { id } = req.authUser;
    const { productId } = req.body
    const product = await productModel.findOne({ _id: productId })
    if(!product){
        return next (new Error("invalid product id", { cause: 400 }))
    }
    const userCart = await cartModel.findOne({userId:id,"products.productId":productId})
    if(!userCart){
        return next (new Error("no product id in card", { cause: 400 }))
    }
    userCart.products.forEach((ele)=>{
        if(ele.productId == productId){
            userCart.products.splice( userCart.products.indexOf(ele), 1 )
        }
    })
    await userCart.save()
    res.status(200).json({message: 'Done', userCart})
}

//===============deleteCart=============
export const deleteCart =async (req,res,next)=>{
    const { id } = req.authUser;
    const { cartId } = req.query;
    const cart = await cartModel.findById(cartId)
    if(!cart){
        return next (new Error("invalid cart id", { cause: 400 }))
    }
    const deletedcart = await cartModel.deleteOne(cart)
    if (!deletedcart.deletedCount) {
        return next(new Error("delete faild"));
    }
    res.status(200).json({message: 'Done' })
}