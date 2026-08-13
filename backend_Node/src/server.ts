import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import path from "path";
import facilityRouter from "./routers/facility.router";
import TrainerRouter from "./routers/trainer.router";
import ReservationRouter from "./routers/reservation.router";
import ShopRouter from "./routers/shop.router";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/sportsphere_hub");
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("db connection ok");
});

const router = express.Router();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

router.use("/users", userRouter);
router.use("/facilities", facilityRouter);
router.use("/trainers", TrainerRouter);
router.use("/reservations", ReservationRouter);
router.use("/shop", ShopRouter);

app.use("/", router);

app.listen(4000, () => console.log(`Express server running on port 4000`));
