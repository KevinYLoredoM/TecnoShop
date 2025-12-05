import { Routes } from '@angular/router';
//Paginas Sin Loguear
import { LoginComponent } from './Pages/login/login.component';
import { RegistrarComponent } from './Pages/registrar/registrar.component';
import { HomeComponent } from './Pages/home/home.component';
import { CatalogoComponent } from './PagesLogeado/catalogo/catalogo.component';
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
        path: 'Catalogo',
        component: CatalogoComponent,
        title: 'TecnoShop - Catalogo'
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
