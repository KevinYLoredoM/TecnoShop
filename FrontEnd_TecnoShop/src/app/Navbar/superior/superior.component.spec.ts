import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperiorComponent } from './superior.component';

describe('SuperiorComponent', () => {
  let component: SuperiorComponent;
  let fixture: ComponentFixture<SuperiorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperiorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuperiorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
