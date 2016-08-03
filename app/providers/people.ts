import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Person} from '../models/person';
import {Group} from '../models/group';

@Injectable()
export class PeopleProvider {
  storage: Storage = null;

  constructor() {
    this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, group_id INTEGER)");
  }

  public list(group: Group) {
    return new Promise((resolve, reject) => {
      this.storage.query("SELECT * FROM people where group_id = ?", [group.id]).then((data) => {
        let people = new Array<Person>();
        let rows = data.res.rows;
        if(rows.length > 0) {
          for(let i = 0; i < rows.length; i++) {
            people.push(new Person(rows.item(i).id, rows.item(i).name, rows.item(i).group_id));
          }
        }
        resolve(people);
      }, (error) => {
        reject(error);
      });
    });
  }

  public save(group: Group, person: Person) {
    if (person.id) {
      return this.edit(person);
    } else {
      return this.create(group, person);
    }
  }

  public create(group: Group, person: Person) {
    let sql = 'INSERT INTO people (name, group_id) VALUES (?, ?)';

    return new Promise((resolve, reject) => {
      this.storage.query(sql, [person.name, group.id]).then((data) => {
        person.id = data.res["insertId"];
        person.group_id = group.id;
        resolve(person);
      }, (error) => {
        reject(error);
      });
    });
  }

  public edit(person: Person) {
    let sql = 'UPDATE people set name=? where id = ?';

    return new Promise((resolve, reject) => {
      this.storage.query(sql, [person.name, person.id]).then((data) => {
        resolve(person);
      }, (error) => {
        reject(error);
      });
    });
  }

  public delete(person: Person) {
    let sql = 'DELETE from people where id = ?';

    return this.storage.query(sql, [person.id]);
  }
}
