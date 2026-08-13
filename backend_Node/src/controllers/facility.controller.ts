import * as express from "express";
import FacilityModel from "../models/facility";
import PromotionModel from "../models/promotion";
import ReservationModel from "../models/reservation";
import TrainingSessionModel from "../models/TrainingSession"

const PDFDocument = require('pdfkit');

export class FacilityController {

  getActiveFacilityCount = (req: express.Request, res: express.Response) => {

    FacilityModel.find({status: "active"})
      .then((facility) => {
        res.json(facility.length);
      })
      .catch((err) => console.log(err));
  };

  getTopFacilities = (req: express.Request, res: express.Response) => {
    let cnt = req.body.number

    FacilityModel.find({status: "active"})
      .sort({likes: -1})
      .limit(cnt)
      .then((facilities) => {
        res.json(facilities);
      })
      .catch((err) => console.log(err));
  };

  getNPromotions = (req: express.Request, res: express.Response) => {
    let cnt = req.body.number
    let now = new Date();

    PromotionModel.find({status: "active" , validFrom: {$lte: now}, validTo: {$gte: now}})
      .limit(cnt)
      .then((promotions) => {
        res.json(promotions);
      })
      .catch((err) => console.log(err));
  };

  getCitiesWithFacilities = (req: express.Request, res: express.Response) => {

    FacilityModel.distinct("city", {status: "active"})
      .then((cities) => {
        res.json(cities);
      })
      .catch((err) => console.log(err));
  };

  findFacilities = (req: express.Request, res: express.Response) => {
    let cities = req.body.cities;
    let sports = req.body.sports;
    let type = req.body.type;

    let query: any = {status: "active"};

    if(cities && cities.length > 0){
      query.city = {$in: cities};
    }

    if(sports && sports.length > 0){
      query.sports = {$in: sports};
    }

    if(type == "zatvoreni"){
      query["courts.type"] = {$in: ["zatvorena_hala", "dvorana"]};
    }
    else if(type == "otvoreni"){
      query["courts.type"] = {$in: ["otvoreni_teren"]};
    }

    FacilityModel.find(query)
      .then((facilities) => {
        res.json(facilities);
      })
      .catch((err) => console.log(err));
  };

  findFacilitiesAvailableToday = async (req: express.Request, res: express.Response) => {
    let cities = req.body.cities;
    let sports = req.body.sports;
    let type = req.body.type;

    let query: any = {status: "active"};

    if(cities && cities.length > 0){
      query.city = {$in: cities};
    }

    if(sports && sports.length > 0){
      query.sports = {$in: sports};
    }

    if(type){
      query["courts.type"] = type;
    }

    let facilities = await FacilityModel.find(query);

    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reservations = await ReservationModel.find({
      date: {$gte: today, $lt: tomorrow},
      status: {$in: ["pending", "confirmed"]}
    });

    facilities = facilities.filter(facility => {
      return facility.courts.some(court => {
        const bookedCount = reservations.filter(r =>
          r.facilityName == facility.name && r.courtName == court.name
        ).length;

        const openHour = parseInt(facility.workingHours?.open?.split(':')[0] || '8');
        const closeHour = parseInt(facility.workingHours?.close?.split(':')[0] || '22');
        const maxSlots = closeHour - openHour;

        return bookedCount < maxSlots;
      });
    });

    res.json(facilities);
  };

  getPendingFacilities = (req: express.Request, res: express.Response) => {

    FacilityModel.find({ status: "pending" })
      .then((facilities) => {
        res.json(facilities);
      })
      .catch((err) => console.log(err));
  };

  updateFacilityStatus = async (req: express.Request, res: express.Response) => {

    let response = await FacilityModel.findOneAndUpdate({ name: req.body.name },
      {$set: {status: req.body.status}}
    )

    if(response)
      res.json("Uspešno izmenjen status!")
    else
      res.json("Greška!")
  };

  getActiveFacilities = (req: express.Request, res: express.Response) => {

    FacilityModel.find({ status: "active" })
      .then((facilities) => {
        res.json(facilities);
      })
      .catch((err) => console.log(err));
  };

  findUserFacilities = (req: express.Request, res: express.Response) => {

    FacilityModel.find({employees: req.body.username, status: "active"})
      .then((facilities) => {
        res.json(facilities);
      })
      .catch((err) => console.log(err));
  };


  getFacilityPromotions = (req: express.Request, res: express.Response) => {
    let facilities = req.body.facilities
    let facilityNames = facilities.map((f: any) => f.name);

    PromotionModel.find({facilityName: {$in: facilityNames}})
      .then((promotions) => {
        res.json(promotions);
      })
      .catch((err) => console.log(err));
  };

  createPromotion = (req: express.Request, res: express.Response) => {

    PromotionModel.insertMany([req.body.promotion])
      .then((response) => {
        res.json("Promocija je uspešno dodata!");
      })
      .catch((err) => console.log(err));
  };

  updatePromotion = (req: express.Request, res: express.Response) => {

    PromotionModel.findOneAndReplace({name: req.body.promotion.name}, req.body.promotion)
      .then((response) => {
        res.json("Promocija je uspešno ažurirana!");
      })
      .catch((err) => console.log(err));
  };

  createFacility = async (req: express.Request, res: express.Response) => {

    const existing = await FacilityModel.findOne({ name: req.body.facility.name });
    if(existing){
      res.json("Objekat sa ovim nazivom već postoji!");
      return;
    }

    FacilityModel.insertMany([req.body.facility])
      .then((response) => {
        res.json("Objekat je uspešno dodat i čeka odobrenje administratora!");
      })
      .catch((err) => console.log(err));
  };

  updateFacility = async (req: express.Request, res: express.Response) => {

    FacilityModel.findOneAndReplace({ name: req.body.facility.name }, req.body.facility)
      .then((response) => {
        res.json("Objekat je uspešno ažuriran!");
      })
      .catch((err) => console.log(err));
  };


  getOccupancyReport = async (req: express.Request, res: express.Response) => {
    const { facilityName, year, month } = req.body;

    const facility = await FacilityModel.findOne({ name: facilityName });
    if(!facility){
      res.json("Objekat nije pronađen!");
      return;
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const daysInMonth = new Date(year, month, 0).getDate();

    const reservations = await ReservationModel.find({
      facilityName,
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ["confirmed", "pending"] }
    });

    const trainings = await TrainingSessionModel.find({
        facilityName,
        date: { $gte: startDate, $lte: endDate },
        status: { $in: ["scheduled", "completed"] }
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=izvestaj_popunjenost_${month}_${year}.pdf`);
    doc.pipe(res);

    doc.fontSize(16).text('Izveštaj o popunjenosti terena', { align: 'center' });
    doc.fontSize(12).text(`Objekat: ${facilityName}`, { align: 'center' });
    doc.text(`Period: ${month}.${year}`, { align: 'center' });
    doc.moveDown(2);

    let totalAllHours = 0;
    let totalMaxAllHours = 0;

    for(const court of facility.courts){
      const courtReservations = reservations.filter(r => r.courtName === court.name);
      const courtTrainings = trainings.filter(t => t.courtName === court.name);

      let totalHours = 0;
      courtReservations.forEach(r => {
        totalHours += (parseInt(r.endTime || '0') || 0) - (parseInt(r.startTime || '0') || 0);
      });
      courtTrainings.forEach(t => {
        totalHours += (parseInt(t.endTime || '0') || 0) - (parseInt(t.startTime || '0') || 0);
      });

      const openHour = parseInt(facility.workingHours?.open?.split(':')[0] || '8');
      const closeHour = parseInt(facility.workingHours?.close?.split(':')[0] || '22');
      const maxHours = (closeHour - openHour) * daysInMonth;
      const occupancy = maxHours > 0 ? ((totalHours / maxHours) * 100).toFixed(1) : 0;

      totalAllHours += totalHours;
      totalMaxAllHours += maxHours;

      doc.fontSize(11).text(`${court.name} (${court.type})`);
      doc.text(`  Zauzeto: ${totalHours}/${maxHours} sati`);
      doc.text(`  Popunjenost: ${occupancy}%`);
      doc.moveDown(0.5);
    }

    const totalOccupancy = totalMaxAllHours > 0 ? ((totalAllHours / totalMaxAllHours) * 100).toFixed(1) : 0;

    doc.moveDown();
    doc.fontSize(12).text(`Ukupna popunjenost: ${totalOccupancy}%`, { bold: true });

    doc.end();
  };

}
