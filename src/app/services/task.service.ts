import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private api = 'https://jsonplaceholder.typicode.com/todos';

  private tasks$ = new BehaviorSubject<Task[]>([]);

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}
  private save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks$.value));
  }

  load() {
    const local = localStorage.getItem('tasks');
    if (local) {
      this.tasks$.next(JSON.parse(local));
    } else {
      this.http.get<Task[]>(this.api).subscribe((data) => {
        this.tasks$.next(data.slice(0, 10));
        this.save();
      });
    }
  }

  getTasks() {
    return this.tasks$.asObservable();
  }

  addTask(task: Task) {
    const current = this.tasks$.value;
    const newTask = { ...task, id: Date.now() };
    this.tasks$.next([newTask, ...current]);
  }

  updateTask(task: Task) {
    const updated = this.tasks$.value.map((t) =>
      t.id === task.id ? { ...t, ...task } : t,
    );
    this.tasks$.next(updated);
  }

  deleteTask(id: number) {
    const filtered = this.tasks$.value.filter((t) => t.id !== id);
    this.tasks$.next(filtered);
    this.snackBar.open('Tarefa excluída!', 'Fechar', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
