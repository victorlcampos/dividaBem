import {Payment} from './payment';
import {Person} from './person';

export class Purchase {
  public payments: Array<Payment>;

  constructor(
    public id: number,
    public name: string,
    public group_id: number
  ) {
    this.payments = Array<Payment>();
  }

  public paymentFor(person: Person) {
    let payment = this.payments.find((payment) => {
      return payment.person_id == person._id;
    });

    if (!payment) {
      payment = new Payment(null, 0, this.id, person._id);
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
