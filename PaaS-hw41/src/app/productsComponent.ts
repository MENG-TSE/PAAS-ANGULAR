import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth } from 'angularfire2/auth';

import { ProductService } from './services/productService';
import { AccountService } from './services/accountService';

import { Account } from './model/account';
import { Product } from './model/product';
import { PriceRecord } from './model/priceRecord';
import { SaleRecord } from './model/saleRecord';
import { BuyRecord } from './model/buyRecord';

import * as firebase from 'firebase';

@Component({
    selector: 'products',
    templateUrl: './views/productsComponent.html',
    styleUrls: ['./views/app.component.css']
})

export class ProductsComponent implements OnInit {

    authUser: Observable<firebase.User>;
    account: Account = null;

    products: Observable<Product[]>;

    @Input() newProduct: Product = { id: null, category: null, name: null, price: null };
    selectedProduct: Product = null;

    priceRecords: Observable<PriceRecord[]>;
    priceRecordVisible: boolean = false;

    saleRecords: Observable<SaleRecord[]>;
    saleRecordVisible: boolean = false;
    saleRecordsCount: number = 0;
    saleRecordSum: number = 0;

    buyRecords: Observable<BuyRecord[]>;
    buyRecordVisible: boolean = false;
    buyRecordsCount: number = 0;
    buyRecordSum: number = 0;

    private changeAmount: number = 5;

    constructor(private auth: AngularFireAuth,
        private accountService: AccountService,
        private productService: ProductService) {

        this.authUser = this.auth.authState;
        this.authUser.subscribe(user => {
            if (user) {
                this.accountService.getAccount(user.uid).subscribe(account => {
                    this.account = account;
                });
            } else {
                this.account = null;
            }
        }, error => console.log("Get User Error", error));
    }

    ngOnInit(): void {
        this.getProducts();
    }

    getProducts(): void {
        this.products = this.productService.getProducts();
    }

    addProduct(): void {
        this.newProduct.price = this.newProduct.id * 10;
        this.productService.createProduct(this.newProduct)
            .catch(error => console.log("Add Product Error", error));
        this.newProduct = { id: null, category: null, name: null, price: null };
    }

    increasePrice(product: Product): void {
        this.updatePrice(product, this.changeAmount);
        this.showRecords(product);
    }

    decreasePrice(product: Product): void {
        this.updatePrice(product, -this.changeAmount);
        this.showRecords(product);
    }

    private updatePrice(product: Product, changeAmount: number): void {
        var priceRecord: PriceRecord = {
            oldPrice: product.price,
            changeAmount: changeAmount,
            newPrice: product.price += changeAmount,
            timeStamp: new Date().getTime()
        };

        this.productService.createPriceRecord(product, priceRecord)
            .catch(error => console.log("Create Record Error", error));
        this.productService.updateProduct(product)
            .catch(error => console.log("Update Product Error", error));
    }

    removeProduct(product: Product): void {
        this.productService.getPriceRecords(product).subscribe(actions => {
            actions.forEach(priceRecord => this.productService.deletePriceRecord(product, priceRecord));
        });
        this.productService.getSaleRecords(product).subscribe(actions => {
            actions.forEach(saleRecord => this.productService.deleteSaleRecord(product, saleRecord));
        });

        this.productService.deleteProduct(product)
            .catch(error => console.log("Remoce Product Error", error));
    }

    buy(product: Product): void {
        var now: Date = new Date();
        var saleRecord: SaleRecord = {
            timeStamp: now,
            accountName: this.account.name,
            productPrice: product.price
        };

        var buyRecord: BuyRecord = {
            timeStamp: now,
            productName: product.name,
            productPrice: product.price
        };

        this.productService.createSaleRecord(product, saleRecord)
            .catch(error => console.log("Create SalesRecord Error", error));
        this.accountService.createBuyRecord(this.account, buyRecord)
            .catch(error => console.log("Create SalesRecord Error", error));

        this.showBuyRecords();
    }

    showRecords(product: Product): void {
        this.hideSaleRecords();
        this.priceRecordVisible = true;
        this.selectedProduct = product;
        this.priceRecords = this.productService.getPriceRecords(product);

        this.productService.getProduct(this.selectedProduct).subscribe(item => {
            if (item)
                this.selectedProduct = item;
            else {
                this.selectedProduct = null;
                this.hideRecords();
            }
        });
    }

    showSaleRecords(product: Product): void {
        this.hideRecords();
        this.saleRecordVisible = true;
        this.selectedProduct = product;

        this.saleRecords = this.productService.getSaleRecords(product).map(records => {
            this.saleRecordSum = 0;
            this.saleRecordsCount = records.length;
            records.forEach(record => this.saleRecordSum += record.productPrice);
            return records.slice(0, 10);
        });

        this.productService.getProduct(this.selectedProduct).subscribe(item => {
            if (!item)
                this.hideSaleRecords();
        });
    }

    showBuyRecords(): void {
        this.buyRecordVisible = true;
        this.buyRecords = this.accountService.getBuyRecords(this.account).map(records => {
            this.buyRecordSum = 0;
            this.buyRecordsCount = records.length;
            records.forEach(record => this.buyRecordSum += record.productPrice);
            return records.slice(0, 10);
        });
    }

    hideRecords(): void {
        this.selectedProduct = null;
        this.priceRecords = null;
        this.priceRecordVisible = false;
    }

    hideSaleRecords(): void {
        this.selectedProduct = null;
        this.saleRecords = null;
        this.saleRecordVisible = false;
    }
}