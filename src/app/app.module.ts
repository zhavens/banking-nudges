
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from '@app/app.component';
import { appRoutingModule } from '@app/app.routing';
import { AccountsComponent } from '@app/components/accounts/accounts.component';
import { AlertComponent } from '@app/components/alert/alert.component';
import { CcComponent } from '@app/components/cc/cc.component';
import { ConfirmDialogComponent, NotificationDialogComponent } from '@app/components/dialog/dialog.component';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { PayeesComponent } from '@app/components/payees/payees.component';
import { PaymentsComponent } from '@app/components/payments/payments.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TasksComponent } from '@app/components/tasks/tasks.component';
import { TransferComponent } from '@app/components/transfer/transfer.component';
import { AccountsPage } from '@app/pages/accounts/accounts.page';
import { AdminPage } from '@app/pages/admin/admin.page';
import { HomePage } from '@app/pages/home/home.page';
import { PaymentsPage } from '@app/pages/payments/payments.page';
import { ServicesPage } from '@app/pages/services/services.page';
import { TransferPage } from '@app/pages/transfer/transfer.page';
import { AddCoComponent } from './components/add-co/add-co.component';
import { LoginPage } from './pages/login/login.page';
import { SplashPage } from './pages/splash/splash.page';


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
    AdminPage,
    LoginPage,
    TransferPage,
    PaymentsPage,
    ServicesPage,
    SplashPage,
    // Components
    AppComponent,
    AlertComponent,
    RegisterComponent,
    SidebarComponent,
    NavbarComponent,
    AccountsComponent,
    PageNotFoundComponent,
    TransferComponent,
    PayeesComponent,
    CcComponent,
    PaymentsComponent,
    TasksComponent,
    ConfirmDialogComponent,
    NotificationDialogComponent,
    AddCoComponent,
  ],
  providers: [
    // provider used to create static backend when in static mode
    // staticBackendProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { };