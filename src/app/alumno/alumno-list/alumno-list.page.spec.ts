import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnoListPage } from './alumno-list.page';

describe('AlumnoListPage', () => {
  let component: AlumnoListPage;
  let fixture: ComponentFixture<AlumnoListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
