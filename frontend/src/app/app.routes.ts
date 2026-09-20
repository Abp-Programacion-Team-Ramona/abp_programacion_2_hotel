import { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';
import { ReservartionForm } from './pages/reservartion-form/reservartion-form';
import { UserDashboard } from './pages/user-dashboard/user-dashboard';

export const routes: Routes = [
    { path: 'about-us', component: AboutUsComponent },
    { path: 'admin-dashboard', component: AdminDashboard },
    { path: '', component: Home },
    { path: 'reservation-form', component: ReservartionForm },
    { path: 'user-dashboard', component: UserDashboard },
    { path: '**', component: NotFound },
];
