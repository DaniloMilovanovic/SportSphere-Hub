export class TrainingSession {
    _id?: String = "";
    athleteUsername: String = "";
    trainerId: String = "";
    trainerFirstName: String = "";
    trainerLastName: String = "";
    sport: String = "";
    facilityName: String = "";
    city: String = "";
    courtName: String = "";
    date: Date = new Date();
    startTime: String = "";
    endTime: String = "";
    pricePerHour: Number = 0;
    totalPrice: Number = 0;
    status: String = "";
}