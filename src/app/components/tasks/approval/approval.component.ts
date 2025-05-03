import { Component, inject } from '@angular/core';
import { TaskService } from '../../../services/task/task.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approval',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.scss'
})
export class ApprovalComponent {
  formBuilder = inject(FormBuilder);
  taskService = inject(TaskService);
  toastr = inject(ToastrService);

  comment$ = this.taskService.comment$;
  task$ = this.taskService.task$;

  commentForm = this.initCommentTask();

  comment: string = '';

  initCommentTask() {
    return this.formBuilder.group({
      comment: [''],
    });
  }

  submitComment() {
    console.log(this.commentForm.value.comment);
    this.taskService.setcomment(this.commentForm.value.comment);
    this.commentForm.reset();
  };

  approveTask(task: any) { 
    task.status = 'Approved';
    task.comment = this.commentForm.value.comment;
    this.submitComment();
    console.log(task);

    // this.apiService.postData('tasks', task).subscribe(console.log)

    this.toastr.success(`${this.comment}`, 'Task Approved!');
  };


  rejectTask() {
    this.submitComment();
    this.toastr.error(`${this.comment}`, 'Task Rejected!');
    
  };
}
