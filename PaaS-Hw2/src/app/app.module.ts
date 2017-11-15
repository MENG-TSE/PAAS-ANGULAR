import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './inMemoryDataService';

import { AppComponent } from './app.component';
import { LoginComponent } from './loginComponent';
import { ProductsComponent } from './productsComponent';
import { QrcodeComponent } from './QrcodeComponent';
import { UsersComponent } from './usersComponent';
import { ProductService } from './productService';
import { UserService } from './userService';

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
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService)
  ],
  providers: [ProductService, UserService],
  bootstrap: [AppComponent, LoginComponent]
})
export class AppModule { }
