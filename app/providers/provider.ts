import {Storage, SqlStorage} from 'ionic-angular';
import {Model} from '../models/model'

declare function require(a);
var PouchDB = require("pouchdb")

export abstract class Provider<T extends Model> {
  protected storage;

  constructor() {
    this.storage = new PouchDB('dividaBem', { adapter: 'websql' });
    this.storage.info().then(console.log.bind(console));
  }

  abstract getType() : string;
  abstract deserialize(doc) : T;


  protected updateCache(cache: Array<T>, change) {
    var index = this.findIndex(cache, change.id);
    var resource = cache[index];

    var doc = this.deserialize(change.doc);

    if (change.deleted) {
      if (resource) {
        cache.splice(index, 1); // delete
      }
    } else {
      if (resource && resource._id === change.id) {
        cache[index] = doc; // update
      } else {
        cache.splice(index, 0, doc) // insert
      }
    }
  }

  protected findIndex(array: Array<any>, id) {
    var low = 0, high = array.length, mid;
    while (low < high) {
      mid = (low + high) >>> 1;
      array[mid]._id < id ? low = mid + 1 : high = mid
    }
    return low;
  }

  public save(resource: T) {
    if (resource._id) {
      return this.edit(resource);
    } else {
      return this.create(resource);
    }
  }

  public create(resource: T) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.post(resource))
    });
  }

  public edit(resource: T) {
    return new Promise((resolve, reject) => {
      resolve(this.storage.put(resource))
    });
  }

  public delete(resource: T) {
    return this.storage.remove(resource);
  }
}
