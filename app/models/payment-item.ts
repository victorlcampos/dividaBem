export class PaymentItem {
  constructor(
    public id: number,
    public name: string,
    public value: number,
    public number: number,
    public payment_id: number
  ) {
  }
}
