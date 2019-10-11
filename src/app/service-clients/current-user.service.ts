import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { User } from '../../../api/models/User';

const DATABASE_VERSION = 1;
const DATABASE_NAME = 'monkeys_local_db';
@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  db: NgxIndexedDB;
  usersCollection: string = 'users';

  constructor() {
    this.db = new NgxIndexedDB(DATABASE_NAME, DATABASE_VERSION);

    this.db.openDatabase(DATABASE_VERSION, evt => {
      console.log("database is opened!");
      evt.currentTarget.result.createObjectStore(this.usersCollection, { keyPath: '_id' });
    });
  }

  public createCurrentUser(user: User) {
    this.db.add(this.usersCollection, user).then(
      () => {
        // Do something after the value was added
        console.log("User created successful")
      },
      error => {
        console.log(error);
      }
    );
  }

  public getCurrentUser(callback) {
    console.log("looking for a current user");
    this.db.openDatabase(DATABASE_VERSION).then(() => {
      this.db.getAll(this.usersCollection).then(
        users => {
          console.log("users", users);
          if (users.length > 0) {
            callback(users[0]);
          } else {
            callback(null);
          }
        },
        error => {
          console.log("users error", error);
          callback(null)
        }
      );
    });
  }

  public clearData(callback) {
    this.db.clear(this.usersCollection).then(
      () => {
        console.log("User removed!")
        callback(true);
      },
      error => {
        console.log(error);
        callback(false);
      }
    );
  }

}