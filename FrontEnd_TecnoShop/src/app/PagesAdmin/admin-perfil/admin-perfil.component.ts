import { Component } from '@angular/core';
import { SuperiorComponent } from "../../Navbar/superior/superior.component";
import { InferiorComponent } from "../../Navbar/inferior/inferior.component";

@Component({
  selector: 'app-admin-perfil',
  imports: [SuperiorComponent, InferiorComponent],
  templateUrl: './admin-perfil.component.html',
  styleUrl: './admin-perfil.component.scss'
})
export class AdminPerfilComponent {

}
