import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

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
      next: (usuarioRecibido) => {
        // Login exitoso
        console.log('Usuario logueado:', usuarioRecibido);
        this.authService.guardarSesion(usuarioRecibido); // Guardar en localStorage
        this.cargando = false;
        this.router.navigate(['/src/app/PagesLogeado/catalogo/']); // Redirigir al inicio
      },
      error: (err) => {
        // Error de credenciales (401)
        console.error('Error de login', err);
        this.mensajeError = 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }
}