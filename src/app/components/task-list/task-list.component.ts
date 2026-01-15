import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filter: 'all' | 'pending' | 'completed' = 'all';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.taskService.load();
  }

  toggle(task: Task) {
    this.taskService.updateTask({ ...task, completed: !task.completed });
  }

  delete(id: number) {
    this.taskService.deleteTask(id);
  }
  get filteredTasks() {
    if (this.filter === 'completed')
      return this.tasks.filter((t) => t.completed);
    if (this.filter === 'pending')
      return this.tasks.filter((t) => !t.completed);
    return this.tasks;
  }
  setFilter(value: 'all' | 'pending' | 'completed') {
    this.filter = value;
  }
}
