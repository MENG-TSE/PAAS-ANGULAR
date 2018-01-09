import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './loginComponent';
import { ProductsComponent } from './productsComponent';
import { QrcodeComponent } from './QrcodeComponent';
import { UsersComponent } from './usersComponent';
import { ProductService } from './productService';
import { UserService } from './userService';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ProductsComponent,
        QrcodeComponent,
        UsersComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule
    ],
    providers: [ProductService, UserService],
    bootstrap: [AppComponent, LoginComponent]
})
export class AppModule { }
