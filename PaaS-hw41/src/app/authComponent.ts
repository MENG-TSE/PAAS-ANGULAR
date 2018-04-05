import { Component, OnInit } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { AccountService } from './services/accountService';
import { Observable } from 'rxjs/Observable';
import { Account } from './model/account';

import * as firebase from 'firebase';

@Component({
    selector: 'authentication',
    templateUrl: './views/authComponent.html',
    styleUrls: ['./views/app.component.css']
})
export class AuthComponent implements OnInit {
    
    authUser: Observable<firebase.User>;
    account: Observable<Account>;
    isLogged: boolean = false;

    constructor(private auth: AngularFireAuth,
        private accountService: AccountService) {

        this.authUser = this.auth.authState;
        this.authUser.subscribe(user => {
            if (user) {
                this.isLogged = true;
                this.account = this.accountService.getAccount(user.uid);
            } else {
                this.isLogged = false;
                this.account = null;
            }
        }, error => console.log("Get User Error", error));
    }

    ngOnInit() {

    }

    singOut() {
        this.auth.auth.signOut()
            .catch(error => console.log("Sign Out Error", error));
    }

}
