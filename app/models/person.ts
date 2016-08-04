export class Person {
  public balance: Number;
  private type: string

  constructor(
    public _id: number,
    public _rev: string,
    public name: string,
    public group_id: number
  ) {
    this.balance = 0;
    this.type = "people";
  }
}
