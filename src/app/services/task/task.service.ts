import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  taskSubject = new BehaviorSubject<any>(null);
  
  apiTask = new BehaviorSubject<any>(null);
  commentSubject = new BehaviorSubject<any>(null);

  task$ = this.taskSubject.asObservable();

  comment$ = this.commentSubject.asObservable();

  setTask(task: any) {
    this.taskSubject.next(task);
  };



  setcomment(comment: any) {
    console.log(comment);
    this.commentSubject.next(comment);
  };

  deleteTask() {
    this.taskSubject.next(null);
  }


  updateTask(task: any): Observable<any>{
    return of([])
  }
  constructor() { }
}
