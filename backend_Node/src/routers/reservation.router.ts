import express from "express";
import multer from "multer";
import path from "path";
import { ReservationController } from "../controllers/reservation.controller";

const ReservationRouter = express.Router();

ReservationRouter
  .route("/getAllReservations")
  .get((req, res) => new ReservationController().getAllReservations(req, res));

ReservationRouter
  .route("/getUserReservations")
  .post((req, res) => new ReservationController().getUserReservations(req, res));

ReservationRouter
  .route("/updateReservationStatus")
  .post((req, res) => new ReservationController().updateReservationStatus(req, res));

ReservationRouter
  .route("/getBookedSlotsForWeek")
  .post((req, res) => new ReservationController().getBookedSlotsForWeek(req, res));

ReservationRouter
  .route("/bookReservation")
  .post((req, res) => new ReservationController().bookReservation(req, res));
  
ReservationRouter
  .route("/createAdvertisement")
  .post((req, res) => new ReservationController().createAdvertisement(req, res));
  
ReservationRouter
  .route("/getUserAdvertisements")
  .post((req, res) => new ReservationController().getUserAdvertisements(req, res));

ReservationRouter
  .route("/getAllAdvertisements")
  .get((req, res) => new ReservationController().getAllAdvertisements(req, res));

ReservationRouter
  .route("/getAdvertisementRequests")
  .post((req, res) => new ReservationController().getAdvertisementRequests(req, res));

ReservationRouter
  .route("/sendJoinRequest")
  .post((req, res) => new ReservationController().sendJoinRequest(req, res));

ReservationRouter
  .route("/disableAdvertisement")
  .post((req, res) => new ReservationController().disableAdvertisement(req, res));
  
ReservationRouter
  .route("/changeRequestStatus")
  .post((req, res) => new ReservationController().changeRequestStatus(req, res));

ReservationRouter
  .route("/scheduleTraining")
  .post((req, res) => new ReservationController().scheduleTraining(req, res));

ReservationRouter
  .route("/getUserTrainings")
  .post((req, res) => new ReservationController().getUserTrainings(req, res));

ReservationRouter
  .route("/getFacilityReviews")
  .post((req, res) => new ReservationController().getFacilityReviews(req, res));

ReservationRouter
  .route("/getConfirmedReservationsForUser")
  .post((req, res) => new ReservationController().getConfirmedReservationsForUser(req, res));
  
ReservationRouter
  .route("/getUserReviews")
  .post((req, res) => new ReservationController().getUserReviews(req, res));

ReservationRouter
  .route("/addReview")
  .post((req, res) => new ReservationController().addReview(req, res));
  
ReservationRouter
  .route("/getCommentableFacilities")
  .post((req, res) => new ReservationController().getCommentableFacilities(req, res));
  
ReservationRouter
  .route("/getEmployedFacilityReservations")
  .post((req, res) => new ReservationController().getEmployedFacilityReservations(req, res));
  
ReservationRouter
  .route("/getEmployedFacilityTrainings")
  .post((req, res) => new ReservationController().getEmployedFacilityTrainings(req, res));
  
ReservationRouter
  .route("/updateTrainingSessionStatus")
  .post((req, res) => new ReservationController().updateTrainingSessionStatus(req, res));
  
ReservationRouter
  .route("/getTrainingSessionsForWeek")
  .post((req, res) => new ReservationController().getTrainingSessionsForWeek(req, res));

ReservationRouter
  .route("/getUserSports")
  .post((req, res) => new ReservationController().getUserSports(req, res));

ReservationRouter
  .route("/getMonthlyActivity")
  .post((req, res) => new ReservationController().getMonthlyActivity(req, res));
  
  
export default ReservationRouter;
