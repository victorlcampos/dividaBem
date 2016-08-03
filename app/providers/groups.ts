import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Group} from '../models/group';

/*
Generated class for the Groups provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GroupsProvider {
  storage: Storage = null;

  constructor() {
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
  }

  public list() {
    return new Promise((resolve, reject) => {
      this.storage.query("SELECT * FROM groups", []).then((data) => {
        let groups = new Array<Group>();
        let rows = data.res.rows;
        if(rows.length > 0) {
          for(let i = 0; i < rows.length; i++) {
            groups.push(new Group(rows.item(i).id, rows.item(i).name));
          }
        }
        resolve(groups);
      }, (error) => {
        reject(error);
      });
    });
  }

  public save(group: Group) {
    if (group.id) {
      return this.edit(group);
    } else {
      return this.create(group);
    }
  }

  public create(group: Group) {
    let sql = 'INSERT INTO groups (name) VALUES (?)';

    return new Promise((resolve, reject) => {
      this.storage.query(sql, [group.name]).then((data) => {
        group.id = data.res["insertId"];
        resolve(group);
      }, (error) => {
        reject(error);
      });
    });
  }

  public edit(group: Group) {
    let sql = 'UPDATE groups set name=? where id = ?';

    return new Promise((resolve, reject) => {
      this.storage.query(sql, [group.name, group.id]).then((data) => {
        resolve(group);
      }, (error) => {
        reject(error);
      });
    });
  }

  public delete(group: Group) {
    let sql = 'DELETE from groups where id = ?';

    return this.storage.query(sql, [group.id]);
  }
}
