export class Group {
  private type: string

  constructor(
    public _id: number,
    public _rev: string,
    public name: string
  ) {
    this.type = "groups"
  }
}
