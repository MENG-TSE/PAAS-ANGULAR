import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { SimpleProduct } from './simpleProduct';
import { ChangeRecord } from './changeRecord';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  products: FirebaseListObservable<SimpleProduct[]>;
  product:SimpleProduct = new SimpleProduct;
  selectedProduct: SimpleProduct = null;
  records:FirebaseListObservable<ChangeRecord[]>;
  record:ChangeRecord = new ChangeRecord;
  changeAmount: number = 5;

  inputProductId: string = "";
  inputName: string = "";
  inputPrice: number = 0;

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
      this.getProducts();
  }

  getProducts(): void {
      this.products = this.appService.getProducts();
  }

  addProduct() : void {
      this.product.productId = this.product.productId;
      this.product.name = this.product.name;
      this.product.price = this.product.price;
      this.appService.createProduct(this.product);
      this.product = new SimpleProduct;
  }

  increasePrice(key: string, product: SimpleProduct): void {
      this.updatePrice(key, product, this.changeAmount);
  }

  redeucePrice(key: string, product: SimpleProduct): void {
    this.updatePrice(key, product, -this.changeAmount);
  }

  updatePrice(key: string, product: SimpleProduct, changeAmount: number): void {
      var oldPrice = product.price;
      product.price = String(parseInt(product.price) + changeAmount ) ;

      this.appService.updateProduct(key, product);
      this.record.recordId = product.productId + "-" + product.price;
      this.record.productId = product.productId;
      this.record.oldPrice = oldPrice;
      this.record.changeAmount = String(changeAmount);
      this.record.newPrice = product.price;
      var date = new Date();
      this.record.timeStamp = date.toLocaleDateString() + " " + date.toLocaleTimeString();

      this.appService.createRecord(this.record);
  }

  showRecords(product: SimpleProduct): void {
    this.selectedProduct = product;
    this.records = this.appService.getRecordsByKey(product.productId);
  }

  hideRecords(): void {
    this.selectedProduct = null;
  }

  removeProduct(key: string, product: SimpleProduct): void {
    this.appService.deleteProduct(key);
    if ( this.selectedProduct != null && product.productId == this.selectedProduct.productId ) {
        this.selectedProduct = null;
    } // if
  }
 
}