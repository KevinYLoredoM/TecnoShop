import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';
import { Usuario } from '../../Models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SuperiorComponent, InferiorComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const { correo, contrasena } = this.loginForm.value;

    this.authService.login(correo, contrasena).subscribe({
      next: (usuarioRecibido: Usuario) => { 
        // 1. Guardar sesión
        this.authService.guardarSesion(usuarioRecibido); 

        // 2. Lógica de Redirección
        // NOTA: Las rutas aquí deben coincidir con las definidas en app.routes.ts
        if (usuarioRecibido.rol === 1) {
          // Rol 1: Administrador
          this.router.navigate(['/admin']); 
        } else if (usuarioRecibido.rol === 2) {
          // Rol 2: Cliente -> Redirige al Catálogo
          this.router.navigate(['/catalogo']); 
        } else {
          // Rol desconocido o default
          this.router.navigate(['/home']);
        }

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error de login', err);
        this.mensajeError = 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}