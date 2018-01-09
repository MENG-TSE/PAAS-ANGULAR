import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productService';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'products',
    templateUrl: './productsComponent.html',
    styleUrls: ['./app.component.css']
})
export class ProductsComponent implements OnInit {
    products: Observable<Product[]>;

    @ViewChild("productsFile") productsFile;

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.getProducts();
    }

    updateProduct(product: Product): void {
        product.score = (Math.round(parseInt(product.pid) * 0.1 * 100) / 100).toString();
        product.price = (Math.round(parseFloat(product.score) * 500)).toString();
        this.productService.update(product)
            .catch(err => console.log(err));
    }

    removeProduct(product: Product): void {
        this.productService.delete(product)
            .catch(err => console.log(err));
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
                    (function (product) {
                        return new Promise((resolve, reject) => {
                            self.productService.getProductsByKey("imageUrl", product.imageUrl)
                                .then(products => {
                                    if (!products.exists()) {
                                        self.productService.create(product)
                                            .then(() => resolve(product))
                                            .catch(error => reject(error));
                                    } else {
                                        resolve(null);
                                    }
                                })
                                .catch(error => reject(error));
                        });
                    })(object.products[i])
                );
            }
            Promise.all(productPromises).catch(err => console.log(err));
        };
        fileReader.readAsText(productFile);
        this.productsFile.nativeElement.value = "";
    }



    getProducts(): void {
        this.products = this.productService.getProducts();
    }


}

