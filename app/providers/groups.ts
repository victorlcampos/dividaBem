import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import {Group} from '../models/group';

declare function require(a);
var PouchDB = require("pouchdb")

/*
Generated class for the Groups provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GroupsProvider {
  private storage;

  constructor() {
    this.storage = new PouchDB('dividaBem', { adapter: 'websql' });
  }

  public list() {
    return new Promise((resolve, reject) => {
      this.storage.query(function (doc, emit) {
        emit(doc.type);
      }, {key: 'groups', include_docs : true}).then(docs => {
        resolve(docs.rows.map(row => {
          return new Group(row.doc._id, row.doc._rev, row.doc.name);
        }));
      }, (error) => {
        reject(error);
      });
    });
  }

  public save(group: Group) {
    if (group._id) {
      return this.edit(group);
    } else {
      return this.create(group);
    }
  }

  public create(group: Group) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.post(group))
    });
  }

  public edit(group: Group) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.put(group))
    });
  }

  public delete(group: Group) {
    return this.storage.remove(group);
  }
}
