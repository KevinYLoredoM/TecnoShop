import { Component } from '@angular/core';
import { SuperiorComponent } from "../../Navbar/superior/superior.component";
import { InferiorComponent } from "../../Navbar/inferior/inferior.component";

@Component({
  selector: 'app-perfil',
  imports: [SuperiorComponent, InferiorComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

}
