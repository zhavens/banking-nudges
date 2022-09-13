import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AlertComponent } from '@/components/alert/alert.component';
import { HomeComponent } from '@/components/home/home.component';
import { LoginComponent } from '@/components/login/login.component';
import { NavbarComponent } from '@/components/navbar/navbar.component';
import { RegisterComponent } from '@/components/register/register.component';
import { SidebarComponent } from '@/components/sidebar/sidebar.component';
import { AppComponent } from './app.component';


import { appRoutingModule } from './app.routing';

import { fakeBackendProvider } from '@/helpers/fake-backend';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AdminComponent } from './components/admin/admin.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    appRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AlertComponent,
    RegisterComponent,
    SidebarComponent,
    AdminComponent,
    NavbarComponent,
    AccountsComponent,
  ],
  providers: [
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

};