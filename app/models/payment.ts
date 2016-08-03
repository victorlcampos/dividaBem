import {PaymentItem} from './payment-item';

export class Payment {
  public tip: number;
  public paymentItems: Array<PaymentItem>;

  constructor(
    public id: number,
    public value: number,
    public purchase_id: number,
    public person_id: number
  ) {
    this.tip = 10;
    this.paymentItems = new Array<PaymentItem>();
  }

  public total() {
    return this.paymentItems.reduce((acc, item) => {
      return acc + (item.value * item.number);
    }, 0);
  }

  public totalWithTip() {
    return this.total() * ((this.tip/100) + 1);
  }
}
