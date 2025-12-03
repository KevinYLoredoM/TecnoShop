import { Routes } from '@angular/router';
//Paginas Sin Loguear
import { LoginComponent } from './Pages/login/login.component';
import { RegistrarComponent } from './Pages/registrar/registrar.component';
import { HomeComponent } from './Pages/home/home.component';
//Paginas Con Logueado

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        title: 'TecnoShop - Iniciar Sesión'
    },
    {
        path: 'registrar',
        component: RegistrarComponent,
        title: 'TecnoShop - Crear Cuenta'
    },
    {
        path: 'home',
        component: HomeComponent,
        title: 'TecnoShop - Inicio'
    },
    { 
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    { 
        path: '**',
        redirectTo: 'home'
    }
];
