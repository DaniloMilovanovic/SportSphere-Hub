export class UserRequest{
    username: String = ""
    status: String = ""
    requestDate: Date = new Date()
};

export class Advertisement{
    _id: String = ""
    authorUsername: String = ""
    sport: String = ""
    city: String = ""
    date: Date = new Date()
    startTime: String = ""
    endTime: String = ""
    missingPlayers: Number = -1
    status: String = ""
    requests: UserRequest[] = []
    createdAt: Date = new Date()
}
