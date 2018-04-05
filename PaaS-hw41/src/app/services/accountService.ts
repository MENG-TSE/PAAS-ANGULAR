import { Injectable, Inject } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';

import { Account } from '../model/account';
import { SaleRecord } from '../model/saleRecord';
import { BuyRecord } from '../model/buyRecord';

@Injectable()
export class AccountService {

    private accountCollection: AngularFirestoreCollection<Account>;

    constructor(private database: AngularFirestore) {
        this.accountCollection = database.collection<Account>("accounts", ref => ref.orderBy("firebaseId"));
    }

    getAccounts(): Observable<Account[]> {
        return this.accountCollection.snapshotChanges().map(actions => {
            return actions.map(item => {
                const data = item.payload.doc.data() as Account;
                const $key = item.payload.doc.id;
                return { $key, ...data };
            });
        });
    }

    getAccount(firebaseId: string): Observable<any> {
        return this.accountCollection.doc(firebaseId).valueChanges();
    }

    createAccount(account: Account): Promise<any> {
        return this.accountCollection.doc(account.firebaseId).set(account);
    }

    updateAccount(account: Account): Promise<any> {
        return this.accountCollection.doc(account.firebaseId).update(account);
    }

    deleteAccount(account: Account): Promise<any> {
        return this.accountCollection.doc(account.firebaseId).delete();
    }

    getBuyRecords(account: Account): Observable<BuyRecord[]> {
        var saleRecordCollection = this.accountCollection.doc(account.firebaseId).collection<BuyRecord>("buyRecords", ref => ref.orderBy("timeStamp", "desc"));
        return saleRecordCollection.snapshotChanges().map(actions => {
            return actions.map(item => {
                const data = item.payload.doc.data() as BuyRecord;
                const $key = item.payload.doc.id;
                return { $key, ...data };
            });
        });
    }

    createBuyRecord(account: Account, buyRecord: BuyRecord): Promise<any> {
        var saleRecordCollection = this.accountCollection.doc(account.firebaseId).collection("buyRecords");
        return saleRecordCollection.add(buyRecord);
    }

    deleteBuyRecord(account: Account, buyRecord: BuyRecord): Promise<any> {
        var buyRecordCollection = this.accountCollection.doc(account.firebaseId).collection<BuyRecord>("buyRecords");
        return buyRecordCollection.doc(buyRecord["$key"]).delete();
    }
}