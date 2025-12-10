import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResenaService } from '../../Service/resena.service';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { Resena } from '../../Models/models';
import { AuthService } from '../../Service/auth.service';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

@Component({
  selector: 'app-admin-resenas',
  standalone: true,
  imports: [CommonModule, FormsModule, SuperiorComponent, InferiorComponent],
  templateUrl: './admin-resenas.component.html',
  styleUrls: ['./admin-resenas.component.scss']
})

export class AdminResenasComponent implements OnInit {
  
  private authService = inject(AuthService); // <--- Inyección
  private resenaService = inject(ResenaService);
  // ... resto de inyecciones
  listaResenas: Resena[] = [];
  cargando: boolean = true;
  
  // Variables para el Modal
  mostrarModal: boolean = false;
  resenaSeleccionada: Resena | null = null;
  textoRespuesta: string = '';
  enviando: boolean = false;

  ngOnInit(): void {
    this.cargarResenas();
  }

  cargarResenas() {
    this.cargando = true;
    this.resenaService.getTodasLasResenas().subscribe({
      next: (data) => {
        this.listaResenas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  abrirResponder(resena: Resena) {
    this.resenaSeleccionada = resena;
    // Si ya tiene respuesta, la mostramos para editar, si no, vacío
    this.textoRespuesta = resena.respuesta || ''; 
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.resenaSeleccionada = null;
    this.textoRespuesta = '';
  }

  enviarRespuesta() {
    if (!this.resenaSeleccionada || !this.textoRespuesta.trim()) return;

    // 1. Validar que tengamos un admin logueado
    const admin = this.authService.usuarioActual;
    if (!admin || !admin.id) {
      alert('Error: No se identifica al administrador.');
      return;
    }

    this.enviando = true;


    // 2. Enviamos ID Reseña, Texto y ID Admin
    this.resenaService.responderResena(
        this.resenaSeleccionada.idResena!, 
        this.textoRespuesta, 
        admin.id // <--- El cambio importante
      )
      .subscribe({
        next: () => {
          alert('Respuesta enviada correctamente');
          this.cerrarModal();
          this.cargarResenas();
          this.enviando = false;
        },
        error: () => {
          alert('Error al responder');
          this.enviando = false;
        }
      });
  }
}