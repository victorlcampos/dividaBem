export class PaymentItem {
  private type = "PaymentItem";

  constructor(
    public name: string,
    public value: number,
    public number: number
  ) {
  }
}
