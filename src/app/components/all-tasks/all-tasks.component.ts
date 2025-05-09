import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../../services/call-api/api.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-all-tasks',
  imports: [CommonModule],
  templateUrl: './all-tasks.component.html',
  styleUrl: './all-tasks.component.scss'
})
export class AllTasksComponent {
  tasks = inject(ApiService);
  authService = inject(AuthService);
  alltasks: any[] = [];
  constructor(@Inject(PLATFORM_ID) private platFrom_id : object){}

  ngOnInit(){
    let userData : any;
    this.authService.login$.subscribe({
      next: (res) => {
        userData = res
      }
    });

    if(isPlatformBrowser(this.platFrom_id)){
      const userD = JSON.parse(localStorage.getItem('userData') || '');
      console.log(userD);
      userData = userD
      this.authService.setLogin(userD);
    }
    
    this.getAllTasks(userData?.email)
  }
  
  async getAllTasks(email: any){
    this.alltasks = await this.tasks.getTasksByUser(email);
  }

  deleteTask(id: any){
    console.log(id);
    this.tasks.deleteTask(id);
    this.alltasks = this.alltasks.filter(item => item.id !== id);
  }
}
