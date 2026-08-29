import { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { NotFound } from './pages/not-found/not-found';
import { Home } from './pages/home/home';
import { ReservartionForm } from './pages/reservartion-form/reservartion-form';

export const routes: Routes = [
    { path: 'about-us', component: AboutUsComponent },
    { path: 'admin-dashboard', component: AdminDashboard },
    { path: '', component: Home },
    { path: 'reservation-form', component: ReservartionForm },
    { path: '**', component: NotFound },
];
