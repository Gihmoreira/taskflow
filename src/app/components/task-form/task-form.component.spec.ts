import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockDrawer: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  mockDrawer = {
    opened: true,
    close: jasmine.createSpy('close'),
    toggle: jasmine.createSpy('toggle'),
  };
  describe('toggleForm with drawer', () => {
    it('should toggle showForm when toggleForm is called without drawer', () => {
      component.showForm = false;
      component.toggleForm();
      expect(component.showForm).toBeTrue();
      component.toggleForm();
      expect(component.showForm).toBeFalse();
    });
    it('should close drawer if opened when toggleForm is called with drawer', () => {
      component.showForm = false;
      component.toggleForm(mockDrawer);
      expect(mockDrawer.close).toHaveBeenCalled();
      expect(component.showForm).toBeTrue();
    });
    it('should toggle drawer and reset showForm when toggleDrawer is called', () => {
      component.showForm = true;
      component.toggleDrawer(mockDrawer);
      expect(component.showForm).toBeFalse();
      expect(mockDrawer.toggle).toHaveBeenCalled();
    });
  });
  it('should toggle drawer even if showForm is false', () => {
    component.showForm = false;
    component.toggleDrawer(mockDrawer);
    expect(mockDrawer.toggle).toHaveBeenCalled();
    expect(component.showForm).toBeFalse();
  });
});
