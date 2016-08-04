import {Payment} from './payment';
import {Person} from './person';

export class Purchase {
  public payments: Array<Payment>;
  private type = "Purchase";

  constructor(
    public _id: string,
    public _rev: string,
    public name: string,
    public group_id: string
  ) {
    this.payments = Array<Payment>();
  }

  deserialize(json) {
    this.payments = json.payments.map((data) => {
      let payment = new Payment(parseFloat(data.value), data.person_id);
      return payment.deserialize(data);
    });

    return this;
  }

  public paymentFor(person: Person) {
    let payment = this.payments.find((payment) => {
      return payment.person_id == person._id;
    });

    if (!payment) {
      payment = new Payment(0, person._id);
      this.payments.push(payment);
    }

    return payment;
  }

  public paymentItemsFor(person: Person) {
    return this.paymentFor(person).paymentItems;
  }

  public total() {
    let total = this.payments.reduce((acc, payment) => {
      return acc + payment.totalWithTip();
    }, 0);
    return total;
  }

  public totalPaid() {
    let totalPaid = this.payments.reduce((acc, payment) => {
      return acc + payment.value;
    }, 0);
    return totalPaid;
  }

  public totalFor(person: Person) {
    return this.paymentFor(person).total();
  }

  public totalWithTipFor(person: Person) {
    return this.paymentFor(person).totalWithTip();
  }
}
