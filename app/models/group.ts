export class Group {
  private type = "Group";

  constructor(
    public _id: string,
    public _rev: string,
    public name: string
  ) {
  }
}
