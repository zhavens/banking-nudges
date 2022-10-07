import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AlertComponent } from '@/components/alert/alert.component';
import { LoginComponent } from '@/components/login/login.component';
import { NavbarComponent } from '@/components/navbar/navbar.component';
import { RegisterComponent } from '@/components/register/register.component';
import { SidebarComponent } from '@/components/sidebar/sidebar.component';
import { AppComponent } from './app.component';


import { appRoutingModule } from './app.routing';

import { fakeBackendProvider } from '@/helpers/fake-backend';
import { AccountsComponent } from './components/accounts/accounts.component';
import { AdminComponent } from './components/admin/admin.component';

import { PageNotFoundComponent } from '@/components/page-not-found/page-not-found.component';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CcComponent } from './components/cc/cc.component';
import { PayeesComponent } from './components/payees/payees.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { AccountsPage } from './pages/accounts/accounts.page';
import { HomePage } from './pages/home/home.page';
import { PaymentsPage } from './pages/payments/payments.page';
import { TransferPage } from './pages/transfer/transfer.page';
import { PaymentsComponent } from './components/payments/payments.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    appRoutingModule,
    NgChartsModule
  ],
  declarations: [
    // Pages
    HomePage,
    AccountsPage,
    TransferPage,
    PaymentsPage,
    // Components
    AppComponent,
    LoginComponent,
    AlertComponent,
    RegisterComponent,
    SidebarComponent,
    AdminComponent,
    NavbarComponent,
    AccountsComponent,
    PageNotFoundComponent,
    ProfileComponent,
    TransferComponent,
    PayeesComponent,
    CcComponent,
    PaymentsComponent,
    TasksComponent,
  ],
  providers: [
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { };