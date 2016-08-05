import { Injectable } from '@angular/core';
import {Group} from '../models/group';
import {Provider} from './provider';
/*
Generated class for the Groups provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GroupsProvider extends Provider<Group> {
  private _groups: Array<Group>;

  public getCache() {
    return this._groups;
  }

  public deserialize(doc) {
    return new Group(doc._id, doc._rev, doc.name);
  }

  protected onDatabaseChange = (change) => {
    if (change.doc.type == this.getType()) {
      this.updateCache(this.getCache(), change);
    }
  }

  public getType() {
    return "Group";
  }

  public list() {
    return new Promise((resolve, reject) => {
      if (this._groups) {
        resolve(this._groups);
      } else {
        this.storage.query(function (doc, emit) {
          emit(doc.type);
        }, {key: this.getType(), include_docs : true}).then(docs => {

          this._groups = docs.rows.map(row => {
            return this.deserialize(row.doc);;
          });

          this.storage.changes({ live: true, since: 'now', include_docs: true}) .on('change', this.onDatabaseChange);

          resolve(this._groups);
        }, (error) => {
          reject(error);
        });
      }
    });
  }
}
