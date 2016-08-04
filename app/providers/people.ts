import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Person} from '../models/person';
import {Purchase} from '../models/purchase';
import {Group} from '../models/group';

import {PurchasesProvider} from './purchases';

declare function require(a);
var PouchDB = require("pouchdb");


@Injectable()
export class PeopleProvider {
  private storage;

  constructor(private purchasesProvider: PurchasesProvider) {
    this.storage = new PouchDB('dividaBem', { adapter: 'websql' });
  }

  public list(group: Group) {
    function myMapFunction(doc, emit) {
      if (doc.type === 'Person') {
        emit(doc.group_id);
      }
    }

    return new Promise((resolve, reject) => {
      this.purchasesProvider.list(group).then((purchases: Array<Purchase>) => {
        this.storage.query(myMapFunction, {key: group._id, include_docs : true}).then(docs => {
          resolve(docs.rows.map(row => {
            let person = new Person(row.doc._id, row.doc._rev, row.doc.name, row.doc.group_id)
            person.balance = person.totalPaid(purchases) - person.totalSpend(purchases);
            return person;
          }));
        }, (error) => {
          reject(error);
        });
      });
    });
  }

  public save(person: Person) {
    if (person._id) {
      return this.edit(person);
    } else {
      return this.create(person);
    }
  }

  public create(person: Person) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.post(person))
    });
  }

  public edit(person: Person) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.put(person))
    });
  }

  public delete(person: Person) {
    return this.storage.remove(person);
  }
}
