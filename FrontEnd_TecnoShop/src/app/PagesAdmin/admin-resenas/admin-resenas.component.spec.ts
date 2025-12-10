import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResenasComponent } from './admin-resenas.component';

describe('AdminResenasComponent', () => {
  let component: AdminResenasComponent;
  let fixture: ComponentFixture<AdminResenasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResenasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminResenasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
