import * as express from "express";
import ReservationModel from "../models/reservation";
import AdvertisementModel from "../models/advertisement";
import TrainingSessionModel from "../models/TrainingSession";
import ReviewModel from "../models/review"
import FacilityModel from "../models/facility"
import UserModel from "../models/user"
import TrainingSession from "../models/TrainingSession";
export class ReservationController {

  getAllReservations = (req: express.Request, res: express.Response) => {

    ReservationModel.find({})
      .then((reservations) => {
        res.json(reservations);
      })
      .catch((err) => console.log(err));
  };

  getUserReservations = (req: express.Request, res: express.Response) => {
    let username = req.body.username

    ReservationModel.find({username: username})
      .then((reservations) => {
        res.json(reservations);
      })
      .catch((err) => console.log(err));
  };

  updateReservationStatus = async (req: express.Request, res: express.Response) => {
    
    let response = await ReservationModel.findByIdAndUpdate(req.body._id,{$set: {status: req.body.status}});

    if(!response){
      res.json("Neuspešna operacija!")
      return;
    }

    if(req.body.status == "no_show"){
      let facility = await FacilityModel.findOne({name: req.body.facilityName});
      let user = await UserModel.findOne({username: req.body.username});

      if(user && facility){
        let block = user.facilityBlocks.find((b: any) => b.facilityName == req.body.facilityName);
        if(block){
          block.noShowCount++;
        }else{
          user.facilityBlocks.push({
            facilityName: req.body.facilityName,
            noShowCount: 1
          });
        }
        await user.save();
      }
    }
    res.json("Uspešno izmenjen status!")
  };

  getBookedSlotsForWeek = async (req: express.Request, res: express.Response) => {
    const { facilityName, courtName, startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const reservations = await ReservationModel.find({
        facilityName,
        courtName,
        date: { $gte: start, $lte: end },
        status: { $in: ["pending", "confirmed"] }
    });

    res.json(reservations);
  };

  bookReservation = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let facilityName = req.body.facilityName;
    let city = req.body.city;
    let courtName = req.body.courtName;
    let sport = req.body.sport;
    let date = req.body.date;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    let user = await UserModel.findOne({username: username});
    let facility = await FacilityModel.findOne({name: facilityName})
    if(user){
      let block = user.facilityBlocks.find((b: any) => b.facilityName === facilityName);
      if(block)
        console.log(block.noShowCount)
      else
        console.log("OVDE123");
      if(block && facility && block.noShowCount >= facility?.maxNoShowsBeforeBlock){
        res.json("Blokirani ste u ovom objektu!")
        return;
      }
    }

    const existingReservation = await ReservationModel.findOne({
      facilityName,
      courtName,
      date: new Date(date),
      status: {$in: ["pending", "confirmed"]},
      $or: [{startTime: {$lt: endTime}, endTime: {$gt: startTime}}]
    });

    if(existingReservation){
      res.json("Termin je već rezervisan!");
      return;
    }

    
    const existingTraining = await TrainingSessionModel.findOne({
      facilityName,
      courtName,
      date: new Date(date),
      status: {$in: ["scheduled", "completed"]},
      $or: [{startTime: {$lt: endTime}, endTime: {$gt: startTime}}]
    });

    if(existingTraining){
      res.json("Termin je već zauzet treningom!");
      return;
    }

    let newReservation = new ReservationModel({
      username, facilityName, city, courtName, sport, date, startTime, endTime, status: "pending"
    })
    await newReservation.save();
    res.json("Rezervacija uspešna!");
  };

  createAdvertisement = async (req: express.Request, res: express.Response) => {
    const { authorUsername, sport, city, date, startTime, endTime, missingPlayers } = req.body;

    let result = await AdvertisementModel.insertMany([{
        authorUsername, sport, city, date, startTime, endTime, missingPlayers, status: "active", requests:[], createdAt: new Date()
    }])
    if(result)
        res.json(true);
    else
        res.json(false);
  };

  getUserAdvertisements = (req: express.Request, res: express.Response) => {
    
    AdvertisementModel.find({authorUsername: req.body.user})
      .then((advertisements) => {
        res.json(advertisements);
      })
      .catch((err) => console.log(err));
  };

  getAllAdvertisements = (req: express.Request, res: express.Response) => {
    
    AdvertisementModel.find({status: "active"})
      .then((advertisements) => {
        res.json(advertisements);
      })
      .catch((err) => console.log(err));
  };

  getAdvertisementRequests = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;

    const advertisements = await AdvertisementModel.find({
      authorUsername: username,
      status: "active",
      requests: {$elemMatch: {status: "pending"}}
    });
        
    res.json(advertisements);
  };

  sendJoinRequest = async (req: express.Request, res: express.Response) => {
    const { adId, username } = req.body;
    
    
    const advertisement = await AdvertisementModel.findById(adId);
    
    if (!advertisement) {
        return res.json({ success: false, message: "Oglas nije pronađen." });
    }
    
    const existingRequest = advertisement.requests.find(r => r.username == username);
    if(existingRequest){
        return res.json({ success: false, message: "Već ste poslali zahtev." });
    }

    advertisement.requests.push({
        username: username,
        status: "pending",
        requestDate: new Date()
    });
    
    await advertisement.save();
    res.json({ success: true, message: "Zahtev poslat!" });
    
  };

  disableAdvertisement = async (req: express.Request, res: express.Response) => {
    const advertisement = await AdvertisementModel.findById(req.body.adId);
    if(!advertisement)
      return res.json("Nema oglasa!");

    advertisement.status = "closed";
    await advertisement.save();
    res.json("Oglas zatvoren!");
    
  };

  changeRequestStatus = async (req: express.Request, res: express.Response) => {

    const advertisement = await AdvertisementModel.findById(req.body.adId);
    if(!advertisement)
      return res.json("Nema oglasa!");

    const request = advertisement.requests.find(r => r.username == req.body.username);

    if(!request){
      return res.json("Nema oglasa!");
    }

    request.status = req.body.status;

    if(req.body.status == "approved"){
      const currentMissing = advertisement.missingPlayers as number;
      advertisement.missingPlayers = currentMissing - 1;
    
    
      if(advertisement.missingPlayers <= 0){
        advertisement.missingPlayers = 0;
        advertisement.status = "closed";
      }
    }

    await advertisement.save();
    res.json("Oglas zatvoren!");
    
  };

  scheduleTraining = async (req: express.Request, res: express.Response) => {
    const {athleteUsername, trainerId, trainerFirstName, trainerLastName, sport, facilityName, city,
        courtName, date, startTime, endTime, pricePerHour, totalPrice} = req.body;

    const user = await UserModel.findOne({username: athleteUsername});
    if(user){
      let block = user.facilityBlocks.find((b: any) => b.facilityName === facilityName);
      const facility = await FacilityModel.findOne({name: facilityName});

      if(block && facility && block.noShowCount >= facility.maxNoShowsBeforeBlock){
        res.json("Blokirani ste u ovom objektu!");
        return;
      }
    }

  const existingReservation = await ReservationModel.findOne({
    facilityName,
    courtName,
    date: new Date(date + "T00:00:00.000Z"),
    status: {$in: ["pending", "confirmed"]},
    $or: [{startTime: {$lt: endTime}, endTime: {$gt: startTime}}]
  });

    if(existingReservation){
      res.json("Termin je već rezervisan!");
      return;
    }

    const existingTraining = await TrainingSessionModel.findOne({
      facilityName,
      courtName,
      date: new Date(date + "T00:00:00.000Z"),
      status: {$in: ["scheduled", "completed"]},
      $or: [{startTime: {$lt: endTime}, endTime: {$gt: startTime}}]
    });

    if(existingTraining){
      res.json("Termin je već zauzet treningom!");
      return;
    }

    const newTraining = new TrainingSessionModel({
      athleteUsername, trainerId, trainerFirstName, trainerLastName, sport, facilityName, city, courtName,
      date: new Date(date + "T00:00:00.000Z"), startTime, endTime, pricePerHour, totalPrice, status: "scheduled"
    });

    await newTraining.save();
    res.json("Trening uspešno zakazan!");
  };

  getUserTrainings = (req: express.Request, res: express.Response) => {
    
    TrainingSessionModel.find({status: {$in:["completed", "scheduled"]}, athleteUsername: req.body.user})
      .then((trainingSessions) => {
        res.json(trainingSessions);
      })
      .catch((err) => console.log(err));
  };


  getFacilityReviews = (req: express.Request, res: express.Response) => {
      let facilityName = req.body.facilityName;
      ReviewModel.find({ 
        facilityName: facilityName,
        comment: {$ne: ""}
      })
      .sort({createdAt: -1})
      .limit(5)
      .then(reviews =>{
        res.json(reviews)
      })
        
  };

  getConfirmedReservationsForUser = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    ReservationModel
      .find({username: username, status: "confirmed"})
      .then(reservations =>{
        res.json(reservations)
      })
  }

  getUserReviews = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    ReviewModel.find({username: username, comment: {$ne: ""}})
    .then(reviews =>{
      res.json(reviews)
    })
  };

  getCommentableFacilities = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;

    let reviews = await ReviewModel.find({username: username});

    let reservations = await ReservationModel.find({username: username, status: "confirmed"})

    let trainings = await TrainingSessionModel.find({athleteUsername: username, status: "completed"});

    let reservationCount: any = {};
    let reviewCount: any = {};

    reservations.forEach(r => {
      if(r.facilityName)
        reservationCount[r.facilityName] = (reservationCount[r.facilityName] || 0) + 1;
    })
    reviews.forEach(r => {
      
      if(r.facilityName){
        reviewCount[r.facilityName] = (reviewCount[r.facilityName] || 0) + 1;
      }
    })

    trainings.forEach(t => {
    if(t.facilityName)
      reservationCount[t.facilityName] = (reservationCount[t.facilityName] || 0) + 1;
  });

    let commentableNames: string[] = [];

    for(let facilityName in reservationCount){
      const resCount = reservationCount[facilityName];
      const revCount = reviewCount[facilityName] || 0;

      if(resCount > revCount && !commentableNames.includes(facilityName)){
        commentableNames.push(facilityName);
      }
    }

    let facilities = await FacilityModel.find({name: {$in: commentableNames}});

    res.json(facilities);
  }

  addReview = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let facilityName = req.body.facilityName;
    let type = req.body.type;
    let comment = req.body.comment;
    if(type == "like" || type == "dislike"){
      const facility = await FacilityModel.findOne({ name: facilityName });
      if(!facility){
        return res.json(false);
      }

      if(type == "like"){
        facility.likes = (facility.likes || 0) + 1;
      }else if (type == "dislike"){
        facility.dislikes = (facility.dislikes || 0) + 1;
      }

      await facility.save();
    }

    ReviewModel.insertMany([{username: username, facilityName: facilityName, type: type, comment: comment, createdAt: new Date()}]).then(r =>{
      res.json(true)
    })
  }

  getEmployedFacilityReservations = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let facilities = await FacilityModel.find({employees: username}).select("name");
    let facilityNames = facilities.map(f => f.name);

    ReservationModel.find({facilityName: {$in: facilityNames}})
    .then(reservations => res.json(reservations));
  };

  getEmployedFacilityTrainings = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let facilities = await FacilityModel.find({employees: username}).select("name");
    let facilityNames = facilities.map(f => f.name);

    TrainingSessionModel.find({facilityName: {$in: facilityNames}})
    .then(trainingSessions => res.json(trainingSessions));
  };

  updateTrainingSessionStatus = async (req: express.Request, res: express.Response) => {
    let response = await TrainingSessionModel.findByIdAndUpdate(
        req.body._id,
        { $set: { status: req.body.status } }
    );

    if(!response){
      res.json("Neuspešna operacija!");
      return;
    }

    
    if(req.body.status == "no_show"){
      let facility = await FacilityModel.findOne({name: req.body.facilityName});
      let user = await UserModel.findOne({username: req.body.athleteUsername});

      if(user && facility){
        let block = user.facilityBlocks.find((b: any) => b.facilityName == req.body.facilityName);
        if(block){
          block.noShowCount++;
        }else{
          user.facilityBlocks.push({
            facilityName: req.body.facilityName,
            noShowCount: 1
          });
        }
        await user.save();
      }
    }
    res.json("Status treninga ažuriran!");
  }

  getTrainingSessionsForWeek = (req: express.Request, res: express.Response) => {
    let facilityName = req.body.facilityName;
    let courtName = req.body.courtName;
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    TrainingSessionModel.find({
      facilityName, 
      courtName, 
      date: {$gte: new Date(startDate), $lte: new Date(endDate)}, 
      status: {$in: ["scheduled", "completed"]}
    })
    .then(trainings =>{
      res.json(trainings)
    })
  }

  getUserSports = async (req: express.Request, res: express.Response) => {
    let username = req.body.username

    const reservations = await ReservationModel.find({username: username, status: {$in: ["pending", "confirmed"]}})

    const trainings = await TrainingSessionModel.find({athleteUsername: username, status: {$in: ["scheduled", "completed"]}})

    let sportCounts: any = {}

    reservations.forEach(reservation => {
      if(reservation.sport)
        sportCounts[reservation.sport] = (sportCounts[reservation.sport] || 0) + 1;
    })

    trainings.forEach(training => {
      if(training.sport)
        sportCounts[training.sport] = (sportCounts[training.sport] || 0) + 1;
    })

    res.json(sportCounts)

  };

  getMonthlyActivity = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let year = req.body.year;

    let startDate = new Date(year, 0, 1);
    let endDate = new Date(year, 11, 31, 23, 59, 59);

    let reservations = await ReservationModel.find({
      username: username,
      status: {$in: ["pending", "confirmed"]},
      date: {$gte: startDate, $lte: endDate}
    });

    const trainings = await TrainingSessionModel.find({
      athleteUsername: username,
      status: {$in: ["scheduled", "completed"]},
      date: {$gte: startDate, $lte: endDate}
    });

    const monthlyActivity: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    reservations.forEach(reservation => {
      if(reservation.date){
        const month = new Date(reservation.date).getMonth();
        monthlyActivity[month]++;
      }
    });

    trainings.forEach(training => {
      if(training.date){
        const month = new Date(training.date).getMonth();
        monthlyActivity[month]++;
      }
    });

    res.json(monthlyActivity);
  };

}