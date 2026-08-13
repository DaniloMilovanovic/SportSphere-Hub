export class Promotion {
  _id?: String;
  facilityName: String = "";
  name: String = "";
  description: String = "";
  discountType: String = "";
  discountValue: Number = 0;
  sports: String[] = [];
  validFrom: Date = new Date();
  validTo: Date = new Date();
  status: String = "";

  constructor(init?: Partial<Promotion>) {
    Object.assign(this, init);
  }
}