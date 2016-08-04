import {PaymentItem} from './payment-item';

export class Payment {
  public tip: number;
  public paymentItems: Array<PaymentItem>;

  constructor(
    public value: number,
    public person_id: string
  ) {
    this.tip = 10;
    this.paymentItems = new Array<PaymentItem>();
  }

  deserialize(json) {
    this.paymentItems = json.paymentItems.map((data) => {
      let paymentItem = new PaymentItem(data.name, parseFloat(data.value), parseInt(data.number));
      return paymentItem;
    })
    return this;
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
