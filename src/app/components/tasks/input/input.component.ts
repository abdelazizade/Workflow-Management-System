import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  formBuilder = new FormBuilder();
  taskService = inject(TaskService);

  formTask = this.initFormTask();

  initFormTask() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      task: ['', Validators.required]
    });
  };

  
  submitForm() {
    const task = this.formTask.value;
    this.taskService.setTask(task);
    this.formTask.reset();
  };
}
