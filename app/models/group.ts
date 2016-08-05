import {Model} from './model'

export class Group extends Model {
  private type = "Group";

  constructor(
    public _id: string,
    public _rev: string,
    public name: string
  ) {
    super(_id, _rev);
  }
}
