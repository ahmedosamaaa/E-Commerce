import moment from "moment"
import { couponModel } from "../../DB/Models/CouponModel.js"

export const isCouponValid = async ({ couponCode, userId, next } = {} ) =>{
    const coupon = await couponModel.findOne({ couponCode })
    //couponExist
    if(!coupon) {
        return{
            msg: 'Please Enter A Valid Coupon Code'
        }
    }
    //expire
    if(coupon.couponStatus == 'Expired' || moment(new Date(coupon.toDate)).isBefore(moment()) ){
        return{
            msg: 'Coupon Expired'
        }
    }
    // ===========================
    if(coupon.couponStatus == 'Valid' &&  moment().isBefore(moment(new Date(coupon.fromDate))) ){
        return{
            msg: 'Coupon Doesnot Started Yet'
        }
    }
    //=====
    if(coupon.couponAssginedToUsers.length){
        let assginedUsers = [];
        let exceedUsage = false
        for (const user of coupon.couponAssginedToUsers) {
            //assgined to user?
            assginedUsers.push(user.userId.toString())
            //exceed the max usage
            if(userId.toString() == user.userId.toString()){
                if( user.maxUsage <= user.usageCount ){
                    exceedUsage=true;
                }
            }
        }
        //assgined to user?
        if(!assginedUsers.includes(userId.toString())){
            console.log(assginedUsers);
            return{
                msg: 'this user is not assigned to this coupon'
            }
        }
        //exceed the max usage
        if(exceedUsage){
            return{
                msg: 'exceed the max usage for this coupon'
            }
        }
    }
    return true

}