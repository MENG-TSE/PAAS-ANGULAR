import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { User } from './user';

@Injectable()
export class UserService {

    private headers = new Headers({
        "Content-Type": "application/json"
    });
    private usersUrl = "api/users";
    constructor(private http: Http) { }



    getUsers(): Promise<User[]> {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then(res => res.json().data as User[])
            .catch(this.handleError);
    }

    getUserByKey(key: string, value: any): Promise<User[]> {
        const url = `${this.usersUrl}/?${key}=${value}`;
        return this.http
            .get(url)
            .toPromise()
            .then(res => res.json().data as User[])
            .catch(this.handleError);
    }

    create(user: User): Promise<User> {
        return this.http
            .post(this.usersUrl, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data as User)
            .catch(this.handleError);
    }

    update(user: User): Promise<User> {
        const url = `${this.usersUrl}/${user.id}`;
        return this.http
            .put(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(() => user)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }


}