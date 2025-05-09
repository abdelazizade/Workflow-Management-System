import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, Task } from '../../services/call-api/api.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';

@Component({
  selector: 'app-call-api',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './call-api.component.html',
  styleUrl: './call-api.component.scss'
})
export class CallApiComponent {
  taskService = inject(TaskService);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);

  task$ = this.taskService.task$;
  userId: any;
  tasks: any;
  editingId: any;

  taskForm = this.fb.group({
    name: [''],
    email: [''],
    task: ['']
  });
  
  async saveToAPI() {
    let userData : any;
    this.authService.login$.subscribe({
      next: (res) => {
        userData = res;
      }
    });
    let task =  {};
    this.task$.subscribe(data => task = data);
    let id = Date.now();
    console.log(id);
    let addId = {...task, id: id, userId: userData?.email}
        
    await this.apiService.saveTask(addId);
    
  }
  

  async ngOnInit() {
    this.task$.subscribe(task => {
      if (task) {
        this.taskForm.patchValue(task);
      }
    });
  }
  
  async deleteTask(task: Task) {
    await this.apiService.deleteTask(task.id);
    this.tasks = await this.apiService.getTasksByUser(this.userId);
  }
  
}
