import * as express from "express";
import OrderModel from "../models/order";
import EquipmentModel from "../models/equipment"

const PDFDocument = require('pdfkit');

export class ShopController {

  getEquipment = (req: express.Request, res: express.Response) => {

    EquipmentModel.find({})
      .then((equipment) => {
        res.json(equipment);
      })
      .catch((err) => console.log(err));
  };

  getEquipmentForSports = (req: express.Request, res: express.Response) => {
    EquipmentModel.find({category: {$in: req.body.sports}})
      .then((equipment) => {
        res.json(equipment);
      })
      .catch((err) => console.log(err));
  };

  createOrder = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    let items = req.body.items;
    let price = req.body.price;
    let status = "ordered"

    OrderModel.insertMany([{username: username, items: items, totalAmount: price, status: status}])
      .then((response) => {
        res.json(true);
      })
      .catch((err) => console.log(err));
  };

  getAllOrders = (req: express.Request, res: express.Response) => {
    OrderModel.find()
      .sort({createdAt: -1})
      .then((orders) => {
        res.json(orders);
      })
      .catch((err) => console.log(err));
  };

  getUserOrders = (req: express.Request, res: express.Response) => {
    let username = req.body.username;
    OrderModel.find({username: username})
      .sort({createdAt: -1})
      .then((orders) => {
        res.json(orders);
      })
      .catch((err) => console.log(err));
  };

  updateOrder = (req: express.Request, res: express.Response) => {
    let order = req.body.order;
    let status = req.body.status;
    OrderModel.findOneAndUpdate({_id: order._id}, {status: status})
      .then((response) => {
        res.json("Uspešno je ažurirana porudžbina!");
      })
      .catch((err) => console.log(err));
  };

  updateEquipment = (req: express.Request, res: express.Response) => {
    let equipment = req.body.equipment;
    EquipmentModel.findOneAndReplace({_id: equipment._id}, equipment)
      .then(() => res.json("Oprema ažurirana!"))
      .catch(err => console.log(err));
  };

  addEquipment = async (req: any, res: express.Response) => {
    const image = req.file ? req.file.filename : '';
    const equipment = new EquipmentModel({ ...req.body, image });
    await equipment.save();
    res.json("Oprema dodata!");
  };

  getTotalEquipmentSpending = async (req: express.Request, res: express.Response) => {
    const orders = await OrderModel.find({
      status: { $in: ["ordered", "picked_up"] }
    });

    const spending: any = {};
    let totalSpending: any = 0;

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        totalSpending += (item.quantity * item.price);
        spending[item.equipmentName] = 
          (spending[item.equipmentName] || 0) + (item.quantity * item.price);
      });
    });

    spending["Ukupno"] = totalSpending;

    res.json(spending);
  };


  getEquipmentSalesReport = async (req: express.Request, res: express.Response) => {
    const {username, year, month} = req.body;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const orders = await OrderModel.find({
      createdAt: {$gte: startDate, $lte: endDate},
      status: {$ne: 'cancelled'}
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=promet_opreme_${month}_${year}.pdf`);
    doc.pipe(res);

    doc.fontSize(16).text('Izveštaj o prometu opreme', {align: 'center'});
    doc.fontSize(12).text(`Period: ${month}.${year}`, {align: 'center'});
    doc.moveDown(2);

    const sales: any = {};
    let totalRevenue = 0;
    let totalItems = 0;

    orders.forEach(order => {
      order.items.forEach((item: any) => {
        if(!sales[item.equipmentName]){
          sales[item.equipmentName] = {quantity: 0, revenue: 0};
        }
        sales[item.equipmentName].quantity += item.quantity;
        sales[item.equipmentName].revenue += item.quantity * item.price;
        totalRevenue += item.quantity * item.price;
        totalItems += item.quantity;
      });
    });

    for(const [name, data] of Object.entries(sales)){
      const s = data as any;
      doc.fontSize(11).text(`${name}`);
      doc.text(`  Prodato: ${s.quantity} komada`);
      doc.text(`  Prihod: ${s.revenue} RSD`);
      doc.moveDown(0.3);
    }

    doc.moveDown();
    doc.fontSize(12).text(`Ukupno prodatih artikala: ${totalItems}`, {bold: true});
    doc.text(`Ukupan prihod: ${totalRevenue} RSD`, {bold: true});
    doc.text(`Broj porudžbina: ${orders.length}`, {bold: true});

    doc.end();
  };
}
