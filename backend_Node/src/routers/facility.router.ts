import express from "express";
import { FacilityController } from "../controllers/facility.controller";
import multer from "multer";
import path from "path";

const facilityRouter = express.Router()

facilityRouter
  .route("/getActiveFacilityCount")
  .get((req, res) => new FacilityController().getActiveFacilityCount(req, res));

facilityRouter
  .route("/getTopFacilities")
  .post((req, res) => new FacilityController().getTopFacilities(req, res));

facilityRouter
  .route("/getNPromotions")
  .post((req, res) => new FacilityController().getNPromotions(req, res));

facilityRouter
  .route("/getCitiesWithFacilities")
  .get((req, res) => new FacilityController().getCitiesWithFacilities(req, res));

facilityRouter
  .route("/findFacilities")
  .post((req, res) => new FacilityController().findFacilities(req, res));
  
facilityRouter
  .route("/findFacilitiesAvailableToday")
  .post((req, res) => new FacilityController().findFacilitiesAvailableToday(req, res));
  
facilityRouter
  .route("/getPendingFacilities")
  .get((req, res) => new FacilityController().getPendingFacilities(req, res));
  
facilityRouter
  .route("/updateFacilityStatus")
  .post((req, res) => new FacilityController().updateFacilityStatus(req, res));
  
facilityRouter
  .route("/getActiveFacilities")
  .get((req, res) => new FacilityController().getActiveFacilities(req, res));

facilityRouter
  .route("/findUserFacilities")
  .post((req, res) => new FacilityController().findUserFacilities(req, res));
  
facilityRouter
  .route("/getFacilityPromotions")
  .post((req, res) => new FacilityController().getFacilityPromotions(req, res));
  
facilityRouter
  .route("/createPromotion")
  .post((req, res) => new FacilityController().createPromotion(req, res));
  
facilityRouter
  .route("/updatePromotion")
  .post((req, res) => new FacilityController().updatePromotion(req, res));

facilityRouter
  .route("/createFacility")
  .post((req, res) => new FacilityController().createFacility(req, res));

facilityRouter
  .route("/updateFacility")
  .post((req, res) => new FacilityController().updateFacility(req, res));

facilityRouter
  .route("/getOccupancyReport")
  .post((req, res) => new FacilityController().getOccupancyReport(req, res));
  
export default facilityRouter;
