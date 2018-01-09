import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

import { User } from './user';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class UserService {

    private databasePath: string = "homework/hw3-2/Users";
    constructor(private database: AngularFireDatabase) { }

    getUsers(): Observable<User[]> {
        return this.database.list(this.databasePath, ref => ref.orderByChild("cid")).valueChanges();
    }

    getAllUsers(): Promise<firebase.database.DataSnapshot> {
        return this.database.list(this.databasePath).query.once("value");
    }

    getUserByKey(key: string, value: any): Promise<firebase.database.DataSnapshot> {
        // return this.database.list(this.databasePath, ref => ref.orderByChild(key).equalTo(value)).valueChanges();
        return this.database.list(this.databasePath).query.orderByChild(key).equalTo(value).once("value");
    }

    create(user: User): Promise<any> {
        user.userId = this.database.createPushId();
        return this.database.list(this.databasePath).set(user.userId, user);

    }

    update(user: User): Promise<any> {
        return this.database.list(this.databasePath).update(user.userId, {
            lineId: user.lineId,
            wechatId: user.wechatId,
            visible: user.visible
        });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


}