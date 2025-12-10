import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Componentes UI
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

// Servicios y Modelos
import { AuthService } from '../../Service/auth.service';
import { Usuario } from '../../Models/models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SuperiorComponent, InferiorComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  perfilForm: FormGroup;
  usuario: Usuario | null = null;
  cargando: boolean = false;
  mensaje: { texto: string, tipo: 'exito' | 'error' } | null = null;

  constructor() {
    this.perfilForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      // La contraseña es opcional. Solo si escribe algo validamos.
      contrasena: [''], 
      confirmarContrasena: ['']
    });
  }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    this.usuario = this.authService.usuarioActual;
    
    if (this.usuario) {
      // Llenamos el formulario con los datos actuales
      this.perfilForm.patchValue({
        nombres: this.usuario.nombres,
        apellidos: this.usuario.apellidos,
        correo: this.usuario.correo,
        telefono: this.usuario.telefono,
        contrasena: '', // Contraseña vacía por seguridad
        confirmarContrasena: ''
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    // Validación de contraseñas iguales (si escribió alguna)
    const { contrasena, confirmarContrasena } = this.perfilForm.value;
    if (contrasena && contrasena !== confirmarContrasena) {
      this.mensaje = { texto: 'Las contraseñas nuevas no coinciden.', tipo: 'error' };
      return;
    }

    this.cargando = true;
    this.mensaje = null;

    // Preparamos el objeto a enviar
    // Usamos los valores del formulario + el ID y Rol que no cambian
    const usuarioActualizado: Usuario = {
      ...this.usuario!, // Mantiene ID y Rol
      nombres: this.perfilForm.value.nombres,
      apellidos: this.perfilForm.value.apellidos,
      correo: this.perfilForm.value.correo,
      telefono: this.perfilForm.value.telefono,
      // Si la contraseña está vacía, enviamos la cadena vacía o la misma (depende de tu backend)
      contrasena: contrasena ? contrasena : this.usuario?.contrasena || ''
    };

    this.authService.actualizarUsuario(usuarioActualizado).subscribe({
      next: (res) => {
        // 1. Actualizar localStorage para que se refleje en toda la app
        this.authService.actualizarSesionLocal(usuarioActualizado);
        
        // 2. Feedback visual
        this.mensaje = { texto: '¡Datos actualizados correctamente!', tipo: 'exito' };
        this.cargando = false;
        
        // Opcional: Recargar la página o limpiar campos de contraseña
        this.perfilForm.patchValue({ contrasena: '', confirmarContrasena: '' });
      },
      error: (err) => {
        console.error(err);
        this.mensaje = { texto: 'Error al actualizar. Intenta más tarde.', tipo: 'error' };
        this.cargando = false;
      }
    });
  }
}