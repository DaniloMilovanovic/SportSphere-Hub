import express from "express";
import { UserController } from "../controllers/user.controller";
import multer from "multer";
import path from "path";

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

userRouter
  .route("/login")
  .post((req, res) => new UserController().login(req, res));

userRouter
  .route("/getUser")
  .post((req, res) => new UserController().getUser(req, res));

userRouter
  .route("/requestPasswordReset")
  .post((req, res) => new UserController().requestPasswordReset(req, res));
  
userRouter
  .route("/resetPassword")
  .post((req, res) => new UserController().resetPassword(req, res));
  
userRouter
  .route("/getAvailableSports")
  .get((req, res) => new UserController().getAvailableSports(req, res));
  
userRouter
  .route("/registerUser")
  .post(upload.single('profileImage'), (req, res) => new UserController().registerUser(req, res));

userRouter
  .route("/getAllUsers")
  .get((req, res) => new UserController().getAllUsers(req, res));
  
userRouter
  .route("/deleteUser")
  .post((req, res) => new UserController().deleteUser(req, res));
  
userRouter
  .route("/updateUser")
  .post(upload.single('profileImage'), (req, res) => new UserController().updateUser(req, res));

userRouter
  .route("/updateUserStatus")
  .post((req, res) => new UserController().updateUserStatus(req, res));

userRouter
  .route("/getPendingUsers")
  .get((req, res) => new UserController().getPendingUsers(req, res));
  
userRouter
  .route("/addSport")
  .post((req, res) => new UserController().addSport(req, res));
  
userRouter
  .route("/deleteSport")
  .post((req, res) => new UserController().deleteSport(req, res));
  
userRouter
  .route("/getEmployedFacilities")
  .post((req, res) => new UserController().getEmployedFacilities(req, res));

export default userRouter;
