import { RouterModule, Routes } from '@angular/router';

import { AccountsComponent } from '@/components/accounts/accounts.component';
import { AdminComponent } from '@/components/admin/admin.component';
import { HomeComponent } from '@/components/home/home.component';
import { LoginComponent } from '@/components/login/login.component';
import { PageNotFoundComponent } from '@/components/page-not-found/page-not-found.component';
import { ProfileComponent } from '@/components/profile/profile.component';
import { RegisterComponent } from '@/components/register/register.component';
import { AdminGuard } from './guard/admin.guard';
import { LoggedInGuard } from './guard/logged-in.guard';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'login', component: LoginComponent, title: "Login - Bank of Bank" },
    { path: 'home', component: HomeComponent, title: "Home - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'accounts', component: AccountsComponent, title: "Accounts - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'profile', component: ProfileComponent, title: "Edit Profile - Bank of Bank", canActivate: [LoggedInGuard] },
    { path: 'admin', component: AdminComponent, title: "Admin Panel", canActivate: [AdminGuard] },
    { path: 'register', component: RegisterComponent, title: "Register User" },

    // otherwise redirect to 404 page
    { path: '**', component: PageNotFoundComponent }
];

export const appRoutingModule = RouterModule.forRoot(routes);