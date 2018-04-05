import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { LoginComponent } from './loginComponent';
import { AuthComponent } from './authComponent';
import { ProductsComponent } from './productsComponent';
import { QrcodeComponent } from './qrcodeComponent';
import { AccountsComponent } from './accountsComponent';

import { ProductService } from './services/productService';
import { AccountService } from './services/accountService';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthMethods, AuthProvider, FirebaseUIAuthConfig, FirebaseUIModule, AuthProviderWithCustomConfig } from 'firebaseui-angular';

import { environment } from '../environments/environment';

const phoneCustomConfig: AuthProviderWithCustomConfig = {
    provider: AuthProvider.Phone,
    customConfig: {
        defaultCountry: "TW"
    }
};

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
    providers: [
        AuthProvider.Google,
        AuthProvider.Password,
        phoneCustomConfig
    ],
    method: AuthMethods.Redirect,
    tos: "https://paas-01-taipeitech.firebaseapp.com/hw4-3/"
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        AuthComponent,
        ProductsComponent,
        QrcodeComponent,
        AccountsComponent        
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        FirebaseUIModule.forRoot(firebaseUiAuthConfig)
    ],
    providers: [ProductService, AccountService],
    bootstrap: [AppComponent, AuthComponent]
})
export class AppModule { }
