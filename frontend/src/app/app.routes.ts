import { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
    { path: 'about-us', component: AboutUsComponent },
    { path: 'admin-dashboard', component: AdminDashboard },
    { path: '**', component: NotFound }, // siempre al final
];