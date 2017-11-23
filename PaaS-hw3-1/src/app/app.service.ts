import { Injectable, Inject } from '@angular/core';

import { SimpleProduct } from './simpleProduct';
import { ChangeRecord } from './changeRecord';
import * as firebase from 'firebase';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class AppService {

    private productsPath = "PaaS-hw31\src\app\simpleProduct";
    private recordsPath = "PaaS-hw31\src\app\changeRecord";

    constructor(public angularFireDatabase: AngularFireDatabase) { }

    getProducts(): FirebaseListObservable<SimpleProduct[]> {

        return this.angularFireDatabase.list(this.productsPath, {
            query: {
                orderByChild: 'productId',
            }
        });
    }

    createProduct(product: SimpleProduct) {
        return this.angularFireDatabase.list(this.productsPath).push(product);
    }

    updateProduct(key: string, product: SimpleProduct) {
        return this.angularFireDatabase.list(this.productsPath).update(key, {
            price: product.price,
        });
    }
   
    deleteProduct(key: string) {
        return this.angularFireDatabase.list(this.productsPath).remove(key);
    }

    getRecordsByKey(key: string): FirebaseListObservable<ChangeRecord[]> {
        return this.angularFireDatabase.list(this.recordsPath, {
            query: {
                orderByChild: 'productId',
                equalTo: key
            }
        });
    }

    createRecord(record: ChangeRecord) {
        return this.angularFireDatabase.list(this.recordsPath).push(record);
    }
}