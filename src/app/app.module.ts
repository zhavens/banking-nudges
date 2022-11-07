import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from '@app/app.component';
import { appRoutingModule } from '@app/app.routing';
import { AccountsComponent } from '@app/components/accounts/accounts.component';
import { AdminComponent } from '@app/components/admin/admin.component';
import { AlertComponent } from '@app/components/alert/alert.component';
import { CcComponent } from '@app/components/cc/cc.component';
import { ConfirmDialogComponent, NotificationDialogComponent } from '@app/components/dialog/dialog.component';
import { LoginComponent } from '@app/components/login/login.component';
import { NavbarComponent } from '@app/components/navbar/navbar.component';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { PayeesComponent } from '@app/components/payees/payees.component';
import { PaymentsComponent } from '@app/components/payments/payments.component';
import { ProfileComponent } from '@app/components/profile/profile.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { TasksComponent } from '@app/components/tasks/tasks.component';
import { TransferComponent } from '@app/components/transfer/transfer.component';
import { fakeBackendProvider } from '@app/helpers/fake-backend';
import { AccountsPage } from '@app/pages/accounts/accounts.page';
import { HomePage } from '@app/pages/home/home.page';
import { PaymentsPage } from '@app/pages/payments/payments.page';
import { TransferPage } from '@app/pages/transfer/transfer.page';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
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
    ConfirmDialogComponent,
    NotificationDialogComponent,
  ],
  providers: [
    // provider used to create fake backend
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { };