import { Component } from '@angular/core';
import { InferiorComponent } from '../../Navbar/inferior/inferior.component';
import { SuperiorComponent } from "../../Navbar/superior/superior.component";

@Component({
  selector: 'app-dashboard',
  imports: [InferiorComponent, SuperiorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
