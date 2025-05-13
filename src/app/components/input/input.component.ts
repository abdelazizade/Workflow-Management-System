import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task/task.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  formBuilder = new FormBuilder();
  taskService = inject(TaskService);
  authService = inject(AuthService);

  formTask = this.initFormTask();

  initFormTask() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      password: [''],
      task: ['', Validators.required]
    });
  };

  
  submitForm() {
    let userData :any;
    this.authService.login$.subscribe({
    next: (res) => {
      userData = res;
    }
  });

    let task = this.formTask.value;
    task = {
      ...task,
      email: userData?.email,
      password: userData?.password,
    };
    console.log("input ", task);
    
    this.taskService.setTask(task);
    this.formTask.reset();
  };
}
