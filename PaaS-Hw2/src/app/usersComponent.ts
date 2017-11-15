import { Component, OnInit, ViewChild } from '@angular/core';

import { User } from './user';
import { UserService } from './userService';

import { Md5 } from 'ts-md5/dist/md5';

@Component({
    selector: 'users',
    templateUrl: './usersComponent.html',
    styleUrls: ['./app.component.css']
})
export class UsersComponent implements OnInit {
    users: User[] = [];
    @ViewChild("usersFile") usersFile;

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.getUsers();
    }

    getUsers(): void {
        this.userService.getUsers().then(users => {
            this.users = users;
        });
    }

    selectUsersFile(): void {

        this.usersFile.nativeElement.click();
    }

    pushUsersByFile(event): void {
        var self = this;
        var fileReader: FileReader = new FileReader();
        var userFile: File = event.target.files[0];

        fileReader.onload = function (e) {
            var object: String = fileReader.result;
            var lines: String[] = object.split("\r\n");

            var users: User[] = [];
            var userPromises = [];
            var updatePromises = [];

            self.userService.getUsers().then((users) => {
                for (var i in users) {
                    updatePromises.push(
                        (function (user) {
                            return new Promise((resolve, reject) => {
                                user.visible = false;
                                self.userService.update(user).then(result => resolve(result)).catch(err => reject(err));
                            });
                        })(users[i])
                    )
                }
                Promise.all(updatePromises).then(() => {
                    for (var i = 1; i < lines.length; i++) {
                        if (lines[i] != "") {
                            var cols = lines[i].split(",");

                            var user: User = {
                                id: i,
                                userId: String(i - 1),
                                cid: parseInt(cols[0]),
                                sid: cols[2],
                                name: cols[1],
                                phone: cols[4],
                                email: cols[3],
                                lineId: '',
                                wechatId: '',
                                role: cols[5],
                                visible: true
                            }


                            userPromises.push(
                                (function (user) {
                                    return new Promise((resolve, reject) => {
                                        self.userService.getUserByKey("phone", user.phone).then((result) => {
                                            if (result.length == 0) {
                                                self.userService.create(user)
                                                    .then(newUser => resolve(newUser))
                                                    .catch(err => reject(err));
                                            } else {
                                                result[0].visible = true;
                                                self.userService.update(result[0])
                                                    .then(result => resolve(result))
                                                    .catch(err => reject(err));
                                            }
                                        }).catch(err => reject(err));
                                    });
                                })(user)
                            );
                        }
                    }


                    Promise.all(userPromises)
                        .then(() => self.getUsers())
                        .catch(err => console.log(err));
                }).catch((err) => {
                    console.log(err)
                });
            }).catch((err) => {
                console.log(err)
            })

        };

        fileReader.readAsText(userFile);
        this.usersFile.nativeElement.value = "";
    }

    follow(user): void {
        user.lineId = Md5.hashStr(user.email);
        user.wechatId = Md5.hashStr(user.sid);
        this.userService.update(user);
    }

    cancelFollow(user): void {
        user.lineId = "";
        user.wechatId = "";
        this.userService.update(user);
    }
}

