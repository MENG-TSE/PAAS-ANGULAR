import { Component, Input, OnInit } from '@angular/core';

import { User } from './user';
import { UserService } from './userService';

import 'rxjs/add/operator/switchMap';

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

  ngOnInit(): void {
    this.logged = false;
    this.userService.getUsers().then(result => console.log(result));
  }

  login(): void {
    this.userService.getUserByKey("sid", this.sid).then((result) => {
      if (result.length > 0) {
        if (result[0].phone == this.password) {
          this.user = result[0];
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