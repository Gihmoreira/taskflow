import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService, { provide: MatSnackBar, useValue: spy }],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load tasks from localStorage if available', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Local Task', completed: false },
    ];
    localStorage.setItem('tasks', JSON.stringify(mockTasks));

    service.load();
    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });
  });

  it('should fetch tasks from API if localStorage is empty', () => {
    const mockApiTasks: Task[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i + 1,
      title: `Task ${i + 1}`,
      completed: false,
    }));

    service.load();

    const req = httpMock.expectOne(
      'https://jsonplaceholder.typicode.com/todos',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockApiTasks);

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(10);
    });

    const saved = JSON.parse(localStorage.getItem('tasks')!);
    expect(saved.length).toBe(10);
  });

  it('should add a task', () => {
    const task: Task = { id: 0, title: 'Nova tarefa', completed: false };
    service.addTask(task);

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Nova tarefa');
      expect(tasks[0].id).not.toBe(0);
    });
  });

  it('should update a task', () => {
    const original: Task = { id: 1, title: 'Antiga', completed: false };
    service['tasks$'].next([original]);

    const updated: Task = { id: 1, title: 'Atualizada', completed: true };
    service.updateTask(updated);

    service.getTasks().subscribe((tasks) => {
      expect(tasks[0].title).toBe('Atualizada');
      expect(tasks[0].completed).toBeTrue();
    });
  });

  it('should delete a task and show snackbar', () => {
    const t1: Task = { id: 1, title: 'Tarefa 1', completed: false };
    const t2: Task = { id: 2, title: 'Tarefa 2', completed: true };
    service['tasks$'].next([t1, t2]);

    service.deleteTask(1);

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe(2);
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Tarefa excluída!',
      'Fechar',
      jasmine.objectContaining({
        duration: 3000,
        panelClass: ['error-snackbar'],
      }),
    );
  });
});
