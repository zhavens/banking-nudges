import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '@app/components/login/login.component';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { AdminGuard } from './guard/admin.guard';
import { LoggedInGuard } from './guard/logged-in.guard';
import { AccountsPage } from './pages/accounts/accounts.page';
import { AdminPage } from './pages/admin/admin.page';
import { HomePage } from './pages/home/home.page';
import { PaymentsPage } from './pages/payments/payments.page';
import { ServicesPage } from './pages/services/services.page';
import { SplashPage } from './pages/splash/splash.page';
import { TransferPage } from './pages/transfer/transfer.page';

const routes: Routes = [
    // { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: '', component: SplashPage, title: "Welcome - Bank of Bank" },
    { path: 'login', component: LoginComponent, title: "Login - Bank of Bank" },

    { path: 'home', component: HomePage, title: "Home - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'accounts', component: AccountsPage, title: "Accounts - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'transfer', component: TransferPage, title: "Transfer - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'payments', component: PaymentsPage, title: "Payments - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'services', component: ServicesPage, title: "Services - Bank of Bank", canActivate: [LoggedInGuard] },

    { path: 'admin', component: AdminPage, title: "Admin - Bank of Bank", canActivate: [AdminGuard] },
    { path: 'register', component: RegisterComponent, title: "Register User" },

    // otherwise redirect to 404 page
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingModule = RouterModule.forRoot(routes);