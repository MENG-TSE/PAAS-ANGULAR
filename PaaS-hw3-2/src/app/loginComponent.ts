import { Component, Input } from '@angular/core';
import { User } from './user';
import { UserService } from './userService';

@Component({
    selector: 'login',
    templateUrl: './loginComponent.html',
    styleUrls: ['./app.component.css']
})
export class LoginComponent {
    user: User;
    logged: boolean;

    @Input() sid: string;
    @Input() password: string;

    constructor(private userService: UserService) { }

    login(): void {
        this.userService.getUserByKey("sid", this.sid).then(snapshot => {
            if (snapshot.exists()) {
                var key = Object.keys(snapshot.val())[0];
                if (snapshot.val()[key].phone == this.password) {
                    this.user = snapshot.val()[key];
                    this.logged = true;
                }
            }
        });
    }

    logout(): void {
        this.logged = false;
        this.user = undefined;
    }

}