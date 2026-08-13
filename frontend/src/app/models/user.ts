export class FacilityBlock {
  facilityId: String = "";
  noShowCount: Number = 0;
  blockedUntil: Date | null = null;
}

export class EmployeeInfo {
  facilityName: String = "";
  facilityAddress: String = "";
  registrationNumber: String = "";
  pib: String = "";
}

export class User {
  _id?: String;
  username: String = "";
  password: String = "";
  email: String = "";
  firstName: String = "";
  lastName: String = "";
  phone: String = "";
  profileImage: String = "default-avatar.png";
  role: String = "";
  favoriteSports: String[] = [];
  status: String = "";
  employeeInfo?: EmployeeInfo;
  resetToken?: String;
  resetTokenExpires?: Date;
  facilityBlocks: FacilityBlock[] = [];
  createdAt?: Date;
  updatedAt?: Date;

}