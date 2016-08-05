import { Injectable } from '@angular/core';

import {Purchase} from '../models/purchase';
import {Group} from '../models/group';

import {Provider} from './provider';

@Injectable()
export class PurchasesProvider extends Provider<Purchase> {
  private _purchase: {[key: string]: Array<Purchase>};

  constructor() {
    super();
    this._purchase = {};
  }

  public getCache(key: string) {
    return this._purchase[key];
  }

  public deserialize(doc) {
    let purchase = new Purchase(doc._id, doc._rev, doc.name, doc.group_id);
    return purchase.deserialize(doc);
  }

  protected onDatabaseChange = (change) => {
    if (change.doc.type == this.getType()) {
      this.updateCache(this.getCache(change.doc.group_id), change);
    }
  }

  public getType() {
    return "Purchase";
  }

  public list(group: Group) {
    function myMapFunction(doc, emit) {
      if (doc.type === 'Purchase') {
        emit(doc.group_id);
      }
    }

    return new Promise((resolve, reject) => {
      if (this._purchase[group._id]) {
        resolve(this._purchase[group._id]);
      } else {
        this.storage.query(myMapFunction, {key: group._id, include_docs : true}).then(docs => {
          this._purchase[group._id] = docs.rows.map(row => {
            return this.deserialize(row.doc)
          })

          this.storage.changes({ live: true, since: 'now', include_docs: true}).on('change', this.onDatabaseChange);

          resolve(this._purchase[group._id]);
        }, (error) => {
          reject(error);
        });
      }
    });
  }

  public save(purchase: Purchase) {
    purchase.payments.forEach((p) => {
      p.value = parseFloat(p.value.toString());
    });

    return super.save(purchase);
  }
}
