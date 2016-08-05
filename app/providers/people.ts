import {Injectable} from '@angular/core';

import {Person} from '../models/person';
import {Purchase} from '../models/purchase';
import {Group} from '../models/group';

import {Provider} from './provider';

import {PurchasesProvider} from './purchases';


@Injectable()
export class PeopleProvider extends Provider<Person> {
  private _people: {[key: string]: Array<Person>};

  constructor(private purchasesProvider: PurchasesProvider) {
    super();
    this._people = {};
  }

  public deserialize(doc) {
    return new Person(doc._id, doc._rev, doc.name, doc.group_id);
  }

  public getType() {
    return "Person";
  }

  public list(group: Group) {
    function myMapFunction(doc, emit) {
      if (doc.type === 'Person') {
        emit(doc.group_id);
      }
    }

    return new Promise((resolve, reject) => {
      this.purchasesProvider.list(group).then((purchases: Array<Purchase>) => {
        if (this._people[group._id]) {
          this._people[group._id].forEach((person) => {
            person.balance = person.totalPaid(purchases) - person.totalSpend(purchases);
          });

          resolve(this._people[group._id]);
        } else {
          this.storage.query(myMapFunction, {key: group._id, include_docs : true}).then(docs => {
            this._people[group._id] = docs.rows.map(row => {
              let person = this.deserialize(row.doc);
              person.balance = person.totalPaid(purchases) - person.totalSpend(purchases);
              return person;
            });

            this.storage.changes({ live: true, since: 'now', include_docs: true}).on('change', this.onDatabaseChange);

            resolve(this._people[group._id]);
          }, (error) => {
            reject(error);
          });
        }
      });
    });
  }

  public getCache(key: string) {
    return this._people[key];
  }

  protected onDatabaseChange = (change) => {
    if (change.doc.type == this.getType()) {
      this.updateCache(this.getCache(change.doc.group_id), change);
    }
  }
}
