import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Product } from './product';
import { ProductService } from './productService';

@Component({
    selector: 'products',
    templateUrl: './productsComponent.html',
    styleUrls: ['./app.component.css']
})
export class ProductsComponent implements OnInit {
    products: Product[] = [];

    @ViewChild("productsFile") productsFile;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.getProducts();
    }

    updateProduct(product: Product): void {
        product.score = Math.round(product.pid * 0.1 * 100) / 100;
        product.price = Math.round(product.score * 500);

        this.productService.update(product).then(() => this.getProducts());
    }

    removeProduct(product: Product): void {
        this.productService.delete(product).then(() => this.getProducts());
    }

    selectProductsFile(): void {
        this.productsFile.nativeElement.click();
    }

    pushProductsByFile(event): void {
        var self = this;
        var fileReader: FileReader = new FileReader();
        var productFile: File = event.target.files[0];
        fileReader.onload = function (e) {
            var object = JSON.parse(fileReader.result);

            var productPromises = [];
            for (var i in object.products) {
                productPromises.push(
                    (function(product) {
                        return new Promise((resolve, reject) => {
                            self.productService.getProductByKey("imageUrl", product.imageUrl).then((result) => {
                                if (result.length == 0) {
                                    self.productService.create(product)
                                        .then(newProduct => resolve(newProduct))
                                        .catch(err => reject(err));
                                } else 
                                    resolve(null);
                            }).catch(err => reject(err));
                        });
                    })(object.products[i])
                );                
            }
            Promise.all(productPromises).then(() => self.getProducts());
        };
        fileReader.readAsText(productFile);
        this.productsFile.nativeElement.value = "";
    }



    getProducts(): void {
        this.productService.getProducts().then(products => {
            this.products = products;
        });
    }


}

