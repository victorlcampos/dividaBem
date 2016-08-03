export class Person {
  public balance: Number;

  constructor(
    public id: number,
    public name: string,
    public group_id: number
  ) {
    this.balance = 0;
  }
}
