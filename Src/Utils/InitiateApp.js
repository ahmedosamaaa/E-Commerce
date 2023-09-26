import { connectionDB } from "../../DB/Connection.js";
import { globalResponse } from "./ErrorHandling.js";
import * as routers from "../Modules/IndexRoutes.js";
import { changeCouponStatusCron } from "./crons.js";
import cors from 'cors'

export const initiateApp = (app, express) => {
  const port = process.env.PORT || 500;
  app.use(express.json());
  connectionDB();
  app.use(cors()); //allow anyOne
  app.get("/", (req, res, next) => {
    res.json({ message: "Hello Osama" });
  });

  app.use("/category", routers.categoryRouter);
  app.use("/subCategory", routers.subCategoryRouter);
  app.use("/brand", routers.BrandsRouter);
  app.use("/product", routers.productRouter);
  app.use("/coupon",routers.couponRouter);
  app.use("/user",routers.userRouter);
  app.use("/auth",routers.authRouter);
  app.use("/cart",routers.cartRouter);
  app.use("/order",routers.orderRouter);
  app.use("/review",routers.reviewRouter);


  app.all("*", (req, res, next) => {
    res.json({ message: "404 Not Found URL" });
  });

  app.use(globalResponse);
  changeCouponStatusCron();
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
};
