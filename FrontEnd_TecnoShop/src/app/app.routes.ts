import { Routes } from '@angular/router';

// Importar el Guard (Asegúrate que la ruta sea correcta)
import { AuthGuard } from './Service/auth.guard';

// Paginas Sin Loguear
import { LoginComponent } from './Pages/login/login.component';
import { RegistrarComponent } from './Pages/registrar/registrar.component';
import { HomeComponent } from './Pages/home/home.component';

// Paginas Con Logueado
import { CatalogoComponent } from './PagesLogeado/catalogo/catalogo.component';
import { DashboardComponent } from './PagesAdmin/dashboard/dashboard.component';
import { CarritoComponent } from './PagesLogeado/carrito/carrito.component';
import { PerfilComponent } from './PagesLogeado/perfil/perfil.component';
import { AdminProductosComponent } from './PagesAdmin/admin-productos/admin-productos.component';
import { AdminPerfilComponent } from './PagesAdmin/admin-perfil/admin-perfil.component';
import { DetalleProductoComponent } from './PagesLogeado/detalle-producto/detalle-producto.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        title: 'TecnoShop - Inicio'
    },
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
    
    // --- RUTAS PROTEGIDAS ---
    {
        // Ruta para CLIENTES (Rol 2)
        path: 'catalogo',
        component: CatalogoComponent,
        title: 'TecnoShop - Catalogo',
        canActivate: [AuthGuard],
        data: { roles: [2, 1] }
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        title: 'TecnoShop - Mi Perfil',
        canActivate: [AuthGuard],
        data: { roles: [2] }
    },
    {
        path: 'carrito',
        component: CarritoComponent,
        title: 'TecnoShop - Carrito',
        canActivate: [AuthGuard],
        data: { roles: [2] }
    },
    {
        path: 'detalle/:id',
        component: DetalleProductoComponent,
        title: 'TecnoShop - Detalle del Producto',
        canActivate: [AuthGuard],
        data: { roles: [2, 1] }
    },

    {
        // Ruta para ADMINISTRADORES (Rol 1)
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Admin - Dashboard',
        canActivate: [AuthGuard],
        data: { roles: [1] }
    },
    {
        path: 'admin-productos',
        component: AdminProductosComponent,
        title: 'Admin - Productos',
        canActivate: [AuthGuard],
        data: { roles: [1] }
    },
    {
        path: 'admin-perfil',
        component: AdminPerfilComponent,
        title: 'Admin - Perfil',
        canActivate: [AuthGuard],
        data: { roles: [1] }
    },

    // --- REDIRECCIONES ---
    { 
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    { 
        path: '**',
        redirectTo: '#'
    }
];