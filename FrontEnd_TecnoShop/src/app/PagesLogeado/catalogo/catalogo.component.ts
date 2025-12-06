import { Component } from '@angular/core';
import { SuperiorComponent } from '../../Navbar/superior/superior.component';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';
import { SuperiorlogueadoComponent } from '../../Navbar/superiorlogueado/superiorlogueado.component';

@Component({
  selector: 'app-catalogo',
  imports: [SuperiorlogueadoComponent, InferiorComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent {

}
