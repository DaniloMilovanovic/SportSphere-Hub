

export class WorkingHours {
  open: string = '08:00';
  close: string = '22:00';
}

export class Location {
  type: string = 'Point';
  coordinates: number[] = [0, 0];
}

export class Court {
  name: string = '';
  type: string = '';
  capacity: number = 0;
  sport: string = '';
  equipmentDescription: string = '';
  status: string = 'active';
}


export class Facility {
  _id?: String;
  name: String = '';
  city: String = '';
  address: String = '';
  description: String = '';
  sports: String[] = [];
  pricePerHour: Number = 0;
  images: String[] = [];
  likes: Number = 0;
  dislikes: Number = 0;
  status: String = "";
  courts: Court[] = [];
  location: Location = new Location();
  maxNoShowsBeforeBlock: Number = 3;
  workingHours: WorkingHours = new WorkingHours();
  employees: String[] = [];
  trainers: String[] = [];
}