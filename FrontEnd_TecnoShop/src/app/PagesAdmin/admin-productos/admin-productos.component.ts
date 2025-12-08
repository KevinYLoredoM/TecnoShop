import { Component } from '@angular/core';
import { SuperiorComponent } from "../../Navbar/superior/superior.component";
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';

@Component({
  selector: 'app-admin-productos',
  imports: [SuperiorComponent, InferiorComponent],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.scss'
})
export class AdminProductosComponent {

}
