import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Product } from './product';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ProductService {

    private databasePath: string = "homework/hw3-2/Products";
    constructor(private database: AngularFireDatabase) { }

    getProducts(): Observable<Product[]> {
        return this.database.list(this.databasePath, ref => ref.orderByChild("pid")).valueChanges();
    }

    getProductsByKey(key: string, value: any): Promise<firebase.database.DataSnapshot> {
        return this.database.list(this.databasePath).query.orderByChild(key).equalTo(value).once("value");
    }

    create(product: Product): Promise<any> {
        product.productId = this.database.createPushId();
        return this.database.list(this.databasePath).set(product.productId, product);
    }

    update(product: Product): Promise<any> {
        return this.database.list(this.databasePath).update(product.productId, {
            score: product.score,
            price: product.price
        });
    }

    delete(product: Product): Promise<any> {
        return this.database.list(this.databasePath).remove(product.productId);
    }
}