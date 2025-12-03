import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperiorlogueadoComponent } from './superiorlogueado.component';

describe('SuperiorlogueadoComponent', () => {
  let component: SuperiorlogueadoComponent;
  let fixture: ComponentFixture<SuperiorlogueadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperiorlogueadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperiorlogueadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
