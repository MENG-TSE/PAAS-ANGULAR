import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Account } from '../model/account';
import { Product } from '../model/product';
import { PriceRecord } from '../model/priceRecord';
import { SaleRecord } from '../model/saleRecord';

@Injectable()
export class ProductService {

    private productCollection: AngularFirestoreCollection<Product>;

    constructor(private database: AngularFirestore) {
        this.productCollection = database.collection("products", ref => ref.orderBy("id"));
    }

    getProducts(): Observable<Product[]> {
        return this.productCollection.snapshotChanges().map(actions => {
            return actions.map(item => {
                const data = item.payload.doc.data() as Product;
                const $key = item.payload.doc.id;
                return { $key, ...data };
            });
        });
    }

    getProduct(product: Product): Observable<any> {
        return this.productCollection.doc(product["$key"]).valueChanges();
    }

    createProduct(product: Product): Promise<any> {
        return this.productCollection.add(product);
    }

    updateProduct(product: Product): Promise<any> {
        return this.productCollection.doc(product["$key"]).update({ price: product.price });
    }

    deleteProduct(product: Product): Promise<any> {
        return this.productCollection.doc(product["$key"]).delete();
    }

    getPriceRecords(product: Product): Observable<PriceRecord[]> {
        var recordCollection = this.productCollection.doc(product["$key"]).collection<PriceRecord>("priceRecords", ref => ref.orderBy("timeStamp", "desc").limit(10));
        return recordCollection.snapshotChanges().map(actions => {
            return actions.map(item => {
                const data = item.payload.doc.data() as PriceRecord;
                const $key = item.payload.doc.id;
                return { $key, ...data };
            });
        });
    }

    createPriceRecord(product: Product, priceRecord: PriceRecord): Promise<any> {
        var priceRecordCollection = this.productCollection.doc(product["$key"]).collection("priceRecords");
        return priceRecordCollection.add(priceRecord);
    }

    deletePriceRecord(product: Product, priceRecord: PriceRecord): Promise<any> {
        var priceRecordCollection = this.productCollection.doc(product["$key"]).collection<PriceRecord>("priceRecords");
        return priceRecordCollection.doc(priceRecord["$key"]).delete();
    }

    getSaleRecords(product: Product): Observable<SaleRecord[]> {
        var saleRecordCollection = this.productCollection.doc(product["$key"]).collection<SaleRecord>("saleRecords", ref => ref.orderBy("timeStamp", "desc"));
        return saleRecordCollection.snapshotChanges().map(actions => {
            return actions.map(item => {
                const data = item.payload.doc.data() as SaleRecord;
                const $key = item.payload.doc.id;
                return { $key, ...data };
            });
        });
    }

    createSaleRecord(product: Product, saleRecord: SaleRecord): Promise<any> {
        var recordCollection = this.productCollection.doc(product["$key"]).collection("saleRecords");
        return recordCollection.add(saleRecord);
    }

    deleteSaleRecord(product: Product, saleRecord: SaleRecord): Promise<any> {
        var saleRecordCollection = this.productCollection.doc(product["$key"]).collection<SaleRecord>("saleRecords");
        return saleRecordCollection.doc(saleRecord["$key"]).delete();
    }
}