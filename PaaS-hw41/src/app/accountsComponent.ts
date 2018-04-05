import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

import { ProductService } from './services/productService';
import { AccountService } from './services/accountService';

import { Account } from './model/account';
import { BuyRecord } from './model/buyRecord';

import * as firebase from 'firebase';

@Component({
    selector: 'accounts',
    templateUrl: './views/accountsComponent.html',
    styleUrls: ['./views/app.component.css']
})

export class AccountsComponent implements OnInit {

    authUser: Observable<firebase.User>;
    account: Account = null;

    accounts: Observable<Account[]>;

    selectedAccount: Account = null;
    detailVisible: boolean = false;
    @Input() accountDetail: Account;

    buyRecords: Observable<BuyRecord[]>;
    buyRecordVisible: boolean = false;
    buyRecordsCount: number = 0;
    buyRecordSum: number = 0;


    constructor(private router: Router,
        private auth: AngularFireAuth,
        private productService: ProductService,
        private accountService: AccountService) {

        this.authUser = this.auth.authState;
        this.authUser.subscribe(user => {
            if (user) {
                this.accountService.getAccount(user.uid).subscribe(account => {
                    this.account = account;
                    this.getAccounts();
                });
            } else {
                this.account = null;
                this.router.navigate(["/products"]);
            }
        }, error => console.log("Get User Error", error));

    }

    ngOnInit(): void {

    }

    getAccounts(): void {
        this.accounts = this.accountService.getAccounts().map(accounts => {
            return accounts.filter(account => {
                if (account.firebaseId == this.account.firebaseId)
                    return true;
                if (this.account.role == "manager")
                    return true;
                else if (this.account.role == "staff")
                    return account.role != "manager";
            }).sort((a: Account, b: Account) => this.sortFunction(a, b))
        });
    }

    getAccountDetail(account: Account): void {
        this.hideBuyRecords();
        this.accountDetail = {
            firebaseId: account.firebaseId,
            name: account.name,
            role: account.role,
            balance: account.balance,
            phone: account.phone,
            email: account.email
        };
        this.detailVisible = true;
    }

    hideDetail(): void {
        this.accountDetail = null;
        this.detailVisible = false;
    }

    updateAccount(account: Account): void {
        this.accountService.updateAccount(account)
            .then(() => {
                this.authUser.subscribe(user => {
                    if (user.uid == account.firebaseId) {
                        user.updateEmail(account.email);
                        user.updateProfile({ displayName: account.name, photoURL: ""});
                    }
                });
                this.hideDetail();
            })
            .catch(error => console.log("Update Account Error", error));
    }

    showBuyRecords(account: Account): void {
        this.hideDetail();
        this.selectedAccount = account;
        this.buyRecordVisible = true;
        this.buyRecords = this.accountService.getBuyRecords(account).map(buyRecords => {
            this.buyRecordSum = 0;
            this.buyRecordsCount = buyRecords.length;
            buyRecords.forEach(buyRecord => this.buyRecordSum += buyRecord.productPrice);
            return buyRecords.slice(0, 10);
        });

        this.accountService.getAccount(account.firebaseId).subscribe(account => {
            if (!account)
                this.hideBuyRecords();
        });
    }

    hideBuyRecords(): void {
        this.selectedAccount = null;
        this.buyRecords = null;
        this.buyRecordVisible = false;
    }

    deleteAccount(): void {
        this.accountService.getBuyRecords(this.account).subscribe(actions => {
            actions.forEach(buyRecord => this.accountService.deleteBuyRecord(this.account, buyRecord));
        });

        this.accountService.deleteAccount(this.account).then(() => {
            this.auth.auth.currentUser.delete().catch(error => console.log("Delete User Error: ", error));
        }).catch(error => console.log("Delete Account Error: ", error));
    }

    private sortFunction(a: Account, b: Account): number {
        if (a.role == "manager") return -1;
        else if (a.role == "staff") {
            if (b.role == "manager") return 1;
            else return -1;
        } else {
            if (b.role == "customer") return -1;
            else return 1;
        }
    }

}