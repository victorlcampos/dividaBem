import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

import {Purchase} from '../models/purchase';
import {Group} from '../models/group';

declare function require(a);
var PouchDB = require("pouchdb");

@Injectable()
export class PurchasesProvider {
  private storage;

  constructor() {
    this.storage = new PouchDB('dividaBem', { adapter: 'websql' });
  }

  public list(group: Group) {
    function myMapFunction(doc, emit) {
      if (doc.type === 'Purchase') {
        emit(doc.group_id);
      }
    }

    return new Promise((resolve, reject) => {
      this.storage.query(myMapFunction, {key: group._id, include_docs : true}).then(docs => {
        resolve(docs.rows.map(row => {
          let purchase = new Purchase(row.doc._id, row.doc._rev, row.doc.name, row.doc.group_id);
          return purchase.deserialize(row.doc);
        }));
      }, (error) => {
        reject(error);
      });
    });
  }

  public save(purchase: Purchase) {
    purchase.payments.forEach((p) => {
      p.value = parseFloat(p.value.toString());
    });


    if (purchase._id) {
      return this.edit(purchase);
    } else {
      return this.create(purchase);
    }
  }

  public create(purchase: Purchase) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.post(purchase))
    });
  }

  public edit(purchase: Purchase) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.put(purchase))
    });
  }

  public delete(purchase: Purchase) {
    return this.storage.remove(purchase);
  }
}
