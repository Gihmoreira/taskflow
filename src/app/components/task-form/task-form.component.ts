import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent {
  title = '';
  showForm = false;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
  ) {}

  add() {
    const trimmed = this.title.trim();
    if (!trimmed) return;

    this.taskService.addTask({
      id: Date.now(),
      title: trimmed,
      completed: false,
    });

    this.title = '';
    this.showForm = false;
    this.snackBar.open('Tarefa adicionada com sucesso!', 'Fechar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }
  toggleForm(drawer?: any) {
    if (drawer && drawer.opened) {
      drawer.close();
    }
    this.showForm = !this.showForm;
  }

  toggleDrawer(drawer: any) {
    if (this.showForm) {
      this.showForm = false;
    }
    drawer.toggle();
  }
}
