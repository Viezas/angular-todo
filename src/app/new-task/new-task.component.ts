import { Component } from '@angular/core';
import { CardComponent } from '../components/card/card.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../service/task/task.service';
import { AuthService } from '../service/auth/auth.service';
import { collection, getDocs, onSnapshot } from '@angular/fire/firestore';
import { TaskInterface } from '../interface/task';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CardComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  submitted: boolean = false;
  tasks: any[] = [];

  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  async ngOnInit() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: ['', [Validators.nullValidator]],
    });

    this.authService.user.subscribe(async (user) => {
      if (user) {
        await onSnapshot(
          collection(this.taskService.firestore, 'users', user.uid, 'notes'),
          (doc) => {
            this.tasks = [];
            doc.forEach((doc) => {
              const task = { ...doc.data(), id: doc.id, is_editing: false };
              this.tasks.push(task);
            });
            this.tasks = this.tasks.sort((a: any, b: any) => a.isDon - b.isDon);
          }
        );
      }
    });
  }

  addTask() {
    const { title, description } = this.form.getRawValue();
    this.submitted = true;

    if (this.form.valid) {
      this.taskService.add(title, description);
      this.resetForm();
      this.submitted = false;
    }
  }

  toggleStatus(task: any) {
    task.isDon = !task.isDon;
    this.taskService.update(task);
  }

  editTask(task: any) {
    const openedTasks = this.tasks.filter((task) => task.is_editing);
    openedTasks.forEach((task) => {
      task.is_editing = false;
    });
    task.is_editing = true;
  }

  updateTask(task: any) {
    if (task.is_editing) {
      this.taskService.update(task);
    }
  }

  deleteTask(task: any) {
    if (
      confirm(
        `Vous êtes sur le point de supprimer la tâche : "${task.title}". Êtes-vous sûre ?`
      )
    ) {
      this.taskService.delete(task);
    }
  }

  resetForm() {
    this.form.get('title')?.setValue('');
    this.form.get('description')?.setValue('');
  }
}
