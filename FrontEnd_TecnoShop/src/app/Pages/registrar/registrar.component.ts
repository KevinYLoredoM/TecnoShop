import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { Usuario } from '../../Models/models';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SuperiorComponent, InferiorComponent],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent {
  
  registroForm: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;

  // Inyección de dependencias moderna (Angular 16+)
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.registroForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10)]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para confirmar contraseña
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contrasena');
    const confirmPassword = form.get('confirmarContrasena');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null : { mismatch: true };
  }

  // Método para obtener errores de un campo
  getFieldError(fieldName: string): string {
    const field = this.registroForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} debe tener al menos ${field.getError('minlength').requiredLength} caracteres`;
    }
    if (field?.hasError('email')) {
      return 'Correo inválido';
    }
    if (field?.hasError('pattern')) {
      return 'Solo se permiten números';
    }
    return '';
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    // Mapeamos los datos del formulario al modelo Usuario
    const nuevoUsuario: Usuario = {
      nombres: this.registroForm.value.nombres,
      apellidos: this.registroForm.value.apellidos,
      correo: this.registroForm.value.correo,
      telefono: this.registroForm.value.telefono,
      contrasena: this.registroForm.value.contrasena,
      rol: 2 // Asignamos rol 2 por defecto (ej. Cliente), ya que el backend lo requiere
    };

    this.authService.registrarUsuario(nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario registrado con éxito');
        this.cargando = false;
        this.router.navigate(['/login']); // Redirigir al login después del registro
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        this.mensajeError = 'Hubo un error al intentar registrar el usuario. Intente nuevamente.';
        this.cargando = false;
      }
    });
  }
}