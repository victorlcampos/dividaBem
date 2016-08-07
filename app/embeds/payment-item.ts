export class PaymentItem {
  private type = "PaymentItem";
  public person_id: string;

  constructor(
    public name: string,
    public value: number,
    public number: number
  ) {
  }
}
