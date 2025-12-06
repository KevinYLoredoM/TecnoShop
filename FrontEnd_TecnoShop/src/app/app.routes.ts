import { Routes } from '@angular/router';
// Paginas Sin Loguear
import { LoginComponent } from './Pages/login/login.component';
import { RegistrarComponent } from './Pages/registrar/registrar.component';
import { HomeComponent } from './Pages/home/home.component';

// Paginas Con Logueado
import { CatalogoComponent } from './PagesLogeado/catalogo/catalogo.component';
import { DashboardComponent } from './PagesAdmin/dashboard/dashboard.component';

// Importar el Guard (Asegúrate que la ruta sea correcta)
import { AuthGuard } from './Service/auth.guard';

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
    
    // --- RUTAS PROTEGIDAS ---
    {
        // Ruta para CLIENTES (Rol 2)
        path: 'catalogo',  // Cambiado a minúsculas por convención
        component: CatalogoComponent,
        title: 'TecnoShop - Catalogo',
        canActivate: [AuthGuard], // <--- Bloquea acceso si no está logueado
        data: { roles: [2] }      // <--- Solo permite Rol 2
    },
    {
        // Ruta para ADMINISTRADORES (Rol 1)
        path: 'dashboard', // Cambiado a minúsculas
        component: DashboardComponent,
        title: 'Admin - Dashboard',
        canActivate: [AuthGuard], // <--- Bloquea acceso si no está logueado
        data: { roles: [1] }      // <--- Solo permite Rol 1
    },

    // --- REDIRECCIONES ---
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