import express from "express";
import multer from "multer";
import path from "path";
import { TrainerController } from "../controllers/trainer.controller";
import { ShopController } from "../controllers/shop.controller";

const ShopRouter = express.Router();

const equipmentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/equipment/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const equipmentUpload = multer({ storage: equipmentStorage });

ShopRouter
  .route("/getEquipment")
  .get((req, res) => new ShopController().getEquipment(req, res));

ShopRouter
  .route("/getEquipmentForSports")
  .post((req, res) => new ShopController().getEquipmentForSports(req, res));

ShopRouter
  .route("/createOrder")
  .post((req, res) => new ShopController().createOrder(req, res));
  
ShopRouter
  .route("/getAllOrders")
  .get((req, res) => new ShopController().getAllOrders(req, res));

ShopRouter
  .route("/getUserOrders")
  .post((req, res) => new ShopController().getUserOrders(req, res));

ShopRouter
  .route("/updateOrder")
  .post((req, res) => new ShopController().updateOrder(req, res));
  
ShopRouter
  .route("/updateEquipment")
  .post((req, res) => new ShopController().updateEquipment(req, res));
  
ShopRouter
  .route("/addEquipment")
  .post(equipmentUpload.single('image'), (req, res) => new ShopController().addEquipment(req, res));

ShopRouter
  .route("/getTotalEquipmentSpending")
  .get((req, res) => new ShopController().getTotalEquipmentSpending(req, res));

ShopRouter
  .route("/getEquipmentSalesReport")
  .post((req, res) => new ShopController().getEquipmentSalesReport(req, res));

export default ShopRouter;