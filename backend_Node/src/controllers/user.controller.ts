import * as express from "express";
import UserModel from "../models/user";
import SportModel from "../models/sport";
import FacilityModel from "../models/facility"
import bcrypt from 'bcrypt';

export class UserController {

  login = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let password = req.body.password;
    const user = await UserModel.findOne({ username: username, status: "active" });
    if(!user){
      res.json(null);
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    
    if(validPassword){
      res.json(user);
    }
    else{
      res.json(null);
    }
  };

  getUser = (req: express.Request, res: express.Response) => {
    let username = req.body.username;

    UserModel.findOne({ username: username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
  };

  requestPasswordReset = async (req: express.Request, res: express.Response) => {
    let credential = req.body.credential;
    let t = ""
    let resetLink = ""
    
    const user = await UserModel.findOne({$or: [{ username: credential , status: "active"}, {mail: credential, status: "active"}]})

    if(!user){
    res.json("Pogrešni kredencijali!")
    }
    else{
        t = Math.floor(Math.random() * 101).toString();

        user.resetToken = t;
        user.resetTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

        await user.save();

        resetLink = `http://localhost:4200/reset-password/${t}`

        res.json(resetLink);
    }
  };

  resetPassword = async (req: express.Request, res: express.Response) => {
    let token = req.body.token;
    let password = req.body.password;

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() }
    });

    if(!user){
      res.json("Prosleđeni token je nevažeći!")
    }
    else{
      user.resetToken = null;
      user.resetTokenExpires = null;
      user.password = hashedPassword;
      await user.save();
      res.json("Lozinka je uspešno promenjena!")
    }
  };


  getAvailableSports = (req: express.Request, res: express.Response) => {
    SportModel.find({})
      .then((sports) => {
        let sportNames = sports.map(s => s.name);
        res.json(sportNames);
      })
      .catch((err) => console.log(err));
  };

  registerUser = async (req: any, res: express.Response) => {
    try {
      let {username, password, firstName, lastName, email, phone, role, favoriteSports, facilityName, 
        facilityAddress, registrationNumber, pib
      } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let sportsArray = favoriteSports ? JSON.parse(favoriteSports) : [];

      let existingUsername = await UserModel.findOne({ username });
      if(existingUsername){
        res.json("Korisničko ime već postoji.");
        return;
      }

      let existingEmail = await UserModel.findOne({ email });
      if(existingEmail){
        res.json("Email adresa već postoji.");
        return;
      }

      
      if(role === 'zaposleni'){
        const existingRegNum = await UserModel.findOne({ 'employeeInfo.registrationNumber': registrationNumber });
        if(existingRegNum){
          res.json("Matični broj već postoji u sistemu.");
          return;
        }

        const employeeCount = await UserModel.countDocuments({
          role: 'zaposleni',
          'employeeInfo.facilityName': facilityName,
          status: { $ne: 'rejected' }
        });

        if (employeeCount >= 2) {
          res.json("Ovaj objekat već ima maksimalan broj zaposlenih (2).");
          return;
        }
      }

      let profileImage = req.file ? req.file.filename : 'default-avatar.png';

      let newUser = new UserModel({
        username,
        password: hashedPassword,
        email,
        firstName,
        lastName,
        phone,
        profileImage,
        role,
        favoriteSports: sportsArray,
        status: 'pending',
        employeeInfo: role === 'zaposleni' ? {
          facilityName,
          facilityAddress,
          registrationNumber,
          pib
        } : undefined
      });

      await newUser.save();

      res.json("Zahtev za registraciju je uspešno poslat. Sačekajte odobrenje administratora.");

    } catch (error) {
      console.log(error);
      res.json("Greška na serveru prilikom registracije.");
    }
  };

  getAllUsers = (req: express.Request, res: express.Response) => {

    UserModel.find({})
      .then((users) => {
        res.json(users);
      })
      .catch((err) => console.log(err));
  };

  getPendingUsers = (req: express.Request, res: express.Response) => {

    UserModel.find({status: "pending"})
      .then((users) => {
        res.json(users);
      })
      .catch((err) => console.log(err));
  };

  deleteUser = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    
    let response = await UserModel.findOneAndDelete({username:username})

    if(response){
      res.json("Obrisan korisnik!")
    }
    else{
      res.json("Nije obrisan korisnik!")
    }
  };

  updateUser = async (req: express.Request, res: express.Response) => {let username = req.body.username;
    let updates: any = {};

    if(req.body.firstName)
      updates.firstName = req.body.firstName;
    if(req.body.lastName)
      updates.lastName = req.body.lastName;
    if(req.body.email)
      updates.email = req.body.email;
    if(req.body.phone)
      updates.phone = req.body.phone;
    if(req.body.favoriteSports){
      updates.favoriteSports = Array.isArray(req.body.favoriteSports) 
        ? req.body.favoriteSports 
        : JSON.parse(req.body.favoriteSports);
    }
    if(req.file)
      updates.profileImage = req.file.filename;
    
    if(req.body.employeeInfo){
      updates.employeeInfo = {
        facilityName: req.body.employeeInfo.facilityName,
        facilityAddress: req.body.employeeInfo.facilityAddress,
        registrationNumber: req.body.employeeInfo.registrationNumber,
        pib: req.body.employeeInfo.pib
      };
    }

    let response = await UserModel.findOneAndUpdate(
      { username: username },
      { $set: updates },
      { new: true }
    );

    res.json(response);
  };

  updateUserStatus = async (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let status = req.body.status;

    let user = await UserModel.findOne({username: username});

    if(status == "active" && user &&  user.role == "zaposleni" && user.employeeInfo?.facilityName){
      const facility = await FacilityModel.findOne({ name: user.employeeInfo.facilityName });

      if(facility){
          const employeeCount = facility.employees.length;
          
          if(employeeCount < 2){
            await FacilityModel.findOneAndUpdate(
              {name: user.employeeInfo.facilityName},
              {$addToSet: {employees: username}}
            );
          }
          else{
            res.json("Objekat već sadrži 2 zaposlene osobe!");
            return;
          }
      }
      else{
        res.json("Objekat nije pronađen!");
        return;
      }
    }

    let response = await UserModel.findOneAndUpdate(
      {username: username},
      {$set: {status: status}}
    );

    if(response)
      res.json("Status ažuriran!");
    else
      res.json("Korisnik nije pronađen!");
  };

  addSport = async (req: express.Request, res: express.Response) => {
    let name = req.body.name

    try {
      await SportModel.insertMany([{ name: name }]);
      res.json("Dodat sport!");
    } catch (error) {
      res.json("Nije dodat sport! Moguće da već postoji.");
    }

  };

  deleteSport = async (req: express.Request, res: express.Response) => {
    let name = req.body.name
    let response = await SportModel.findOneAndDelete({name: name})
    if(response)
      res.json("Uklonjen sport!")
    else
      res.json("Nije uklonjen sport!")

  };

  getEmployedFacilities = (req: express.Request, res: express.Response) => {
    FacilityModel.find({employees: req.body.username, status: "active"})
      .then(facilities => res.json(facilities));
  };

}
