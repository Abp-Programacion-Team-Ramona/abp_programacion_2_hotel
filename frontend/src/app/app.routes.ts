import { Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';

export const routes: Routes = [
    { path: 'about-us', component: AboutUsComponent },
    { path: 'admin-dashboard', component: AdminDashboard },
];
