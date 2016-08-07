import {PaymentItem} from './payment-item';

export class Payment {
  public tip = 10;
  public paymentItems: Array<PaymentItem>;

  constructor(
    public value: number,
    public person_id: string
  ) {
    this.paymentItems = new Array<PaymentItem>();
  }

  deserialize(json) {
    this.tip = parseFloat(json.tip);

    this.paymentItems = json.paymentItems.map((data) => {
      let paymentItem = new PaymentItem(data.name, parseFloat(data.value), parseInt(data.number));
      paymentItem.person_id = this.person_id;
      return paymentItem;
    });

    return this;
  }

  public total() {
    return this.paymentItems.reduce((acc, item) => {
      return acc + (item.value * item.number);
    }, 0);
  }

  public totalWithTip() {
    return Math.round((this.total() * ((this.tip/100) + 1)) * 100)/100;
  }
}
