export class OrderItem{
    equipmentName: String = "";
    quantity: Number = -1;
    price: Number = -1;
}

export class Order{
    _id?: String;
    username: String = "";
    items: OrderItem[] = [];
    totalAmount: Number = -1;
    status: String = "";
    createdAt?: Date;
}