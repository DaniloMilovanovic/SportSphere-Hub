import express from "express";
import multer from "multer";
import path from "path";
import { TrainerController } from "../controllers/trainer.controller";

const TrainerRouter = express.Router();

TrainerRouter
  .route("/getAllTrainers")
  .get((req, res) => new TrainerController().getAllTrainers(req, res));

TrainerRouter
  .route("/updateTrainerStatus")
  .post((req, res) => new TrainerController().updateTrainerStatus(req, res));

TrainerRouter
  .route("/searchTrainers")
  .post((req, res) => new TrainerController().searchTrainers(req, res));
  
export default TrainerRouter;
