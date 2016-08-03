import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

import {Purchase} from '../models/purchase';
import {Group} from '../models/group';


@Injectable()
export class PurchasesProvider {
  storage: Storage = null;

  constructor() {
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS purchases (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, group_id INTEGER)");
  }

  public list(group: Group) {
    return new Promise((resolve, reject) => {
      this.storage.query("SELECT * FROM purchases where group_id = ?", [group._id]).then((data) => {
        let purchases = new Array<Purchase>();
        let rows = data.res.rows;
        if(rows.length > 0) {
          for(let i = 0; i < rows.length; i++) {
            purchases.push(new Purchase(rows.item(i).id, rows.item(i).name, rows.item(i).group_id));
          }
        }
        resolve(purchases);
      }, (error) => {
        reject(error);
      });
    });
  }

  public save(group: Group, purchase: Purchase) {
    if (purchase.id) {
      return this.edit(purchase);
    } else {
      return this.create(group, purchase);
    }
  }

  public create(group: Group, purchase: Purchase) {
    let sql = 'INSERT INTO purchases (name, group_id) VALUES (?, ?)';

    return new Promise((resolve, reject) => {
      this.storage.query(sql, [purchase.name, group._id]).then((data) => {
        purchase.id = data.res["insertId"];
        purchase.group_id = group._id;
        resolve(purchase);
      }, (error) => {
        reject(error);
      });
    });
  }

  public edit(purchase: Purchase) {
    let sql = 'UPDATE purchases set name=? where id = ?';

    return new Promise((resolve, reject) => {
      this.storage.query(sql, [purchase.name, purchase.id]).then((data) => {
        resolve(purchase);
      }, (error) => {
        reject(error);
      });
    });
  }

  public delete(purchase: Purchase) {
    let sql = 'DELETE from purchases where id = ?';

    return this.storage.query(sql, [purchase.id]);
  }
}
