import * as express from "express";
import TrainerModel from "../models/trainer";

export class TrainerController {

  getAllTrainers = (req: express.Request, res: express.Response) => {

    TrainerModel.find({})
      .then((trainers) => {
        res.json(trainers);
      })
      .catch((err) => console.log(err));
  };

  updateTrainerStatus = async (req: express.Request, res: express.Response) => {

    let response = await TrainerModel.findByIdAndUpdate(req.body._id,{$set: {status: req.body.status}});
    
    if(response)
        res.json("Uspešno izmenjen status!")
    else
        res.json("Neuspešna operacija!")
  };

  searchTrainers = (req: express.Request, res: express.Response) => {

    TrainerModel.find({facilityName: req.body.facilityName, specialization: req.body.sport})
      .then((trainers) => {
        res.json(trainers);
      })
      .catch((err) => console.log(err));
  };

}
