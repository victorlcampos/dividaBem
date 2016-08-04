import {Purchase} from './purchase';


export class Person {
  public balance: Number;
  private type = "Person";

  constructor(
    public _id: string,
    public _rev: string,
    public name: string,
    public group_id: string
  ) {
    this.balance = 0;
  }

  public totalSpend(purchases: Array<Purchase>) {
    let total = purchases.reduce((acc, purchase) => {
      return acc + purchase.totalWithTipFor(this);
    }, 0);
    return total;
  }

  public totalPaid(purchases: Array<Purchase>) {
    let total = purchases.reduce((acc, purchase) => {
      return acc + purchase.paymentFor(this).value;
    }, 0);
    return total;
  }
}
