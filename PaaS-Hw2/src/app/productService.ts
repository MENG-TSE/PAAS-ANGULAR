import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { Product } from './product';

@Injectable()
export class ProductService {

    private headers = new Headers({
        "Content-Type": "application/json"
    });
    private productsUrl = "api/products";
    constructor(private http: Http) { }



    getProducts(): Promise<Product[]> {
        return this.http.get(this.productsUrl)
            .toPromise()
            .then(res => res.json().data as Product[])
            .catch(this.handleError);
    }

    getProductByKey(key: string, value: any): Promise<Product[]> {
        const url = `${this.productsUrl}/?${key}=${value}`;
        return this.http
            .get(url)
            .toPromise()
            .then(res => res.json().data as Product[])
            .catch(this.handleError);
    }

    create(product: Product): Promise<Product> {
        return this.http
            .post(this.productsUrl, JSON.stringify(product), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data as Product)
            .catch(this.handleError);
    }

    update(product: Product): Promise<Product> {
        const url = `${this.productsUrl}/${product.id}`;
        return this.http
            .put(url, JSON.stringify(product), { headers: this.headers })
            .toPromise()
            .then(() => product)
            .catch(this.handleError);
    }
    
    delete(product: Product): Promise<Product> {
        const url = `${this.productsUrl}/${product.id}`;
        return this.http
            .delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}