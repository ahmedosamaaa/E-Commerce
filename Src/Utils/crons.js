import { scheduleJob } from "node-schedule";
import { couponModel } from "../../DB/Models/CouponModel.js";
import moment from "moment-timezone";

export const changeCouponStatusCron = () => {
    scheduleJob('* * * * * *', async function(){
        const validCoupons = await couponModel.find({couponStatus: "Valid"})
        // console.log(validCoupons);
        for (const coupon of validCoupons) {
            if(moment(new Date(coupon.toDate)).tz('Africa/Cairo').isBefore(moment().tz('Africa/Cairo'))){
                coupon.couponStatus = 'Expired';
            }
            await coupon.save();
        }
    });
}