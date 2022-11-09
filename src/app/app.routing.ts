import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '@app/components/admin/admin.component';
import { LoginComponent } from '@app/components/login/login.component';
import { PageNotFoundComponent } from '@app/components/page-not-found/page-not-found.component';
import { ProfileComponent } from '@app/components/profile/profile.component';
import { RegisterComponent } from '@app/components/register/register.component';
import { AdminGuard } from './guard/admin.guard';
import { LoggedInGuard } from './guard/logged-in.guard';
import { AccountsPage } from './pages/accounts/accounts.page';
import { HomePage } from './pages/home/home.page';
import { PaymentsPage } from './pages/payments/payments.page';
import { ServicesPage } from './pages/services/services.page';
import { TransferPage } from './pages/transfer/transfer.page';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'login', component: LoginComponent, title: "Login - Bank of Bank" },

    { path: 'home', component: HomePage, title: "Home - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'profile', component: ProfileComponent, title: "Edit Profile - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'accounts', component: AccountsPage, title: "Accounts - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'transfer', component: TransferPage, title: "Transfer - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'payments', component: PaymentsPage, title: "Payments - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'services', component: ServicesPage, title: "Services - Bank of Bank", canActivate: [LoggedInGuard] },

    { path: 'admin', component: AdminComponent, title: "Administration - Bank of Bank", canActivate: [AdminGuard] },
    { path: 'register', component: RegisterComponent, title: "Register User" },

    // otherwise redirect to 404 page
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingModule = RouterModule.forRoot(routes);