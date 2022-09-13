import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '@/components/admin/admin.component';
import { HomeComponent } from '@/components/home/home.component';
import { LoginComponent } from '@/components/login/login.component';
import { RegisterComponent } from '@/components/register/register.component';
import { AccountsComponent } from './components/accounts/accounts.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'accounts', component: AccountsComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },


    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);