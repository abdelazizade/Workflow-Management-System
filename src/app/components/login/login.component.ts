import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb: FormBuilder = inject(FormBuilder); 
  authService = inject(AuthService); 
  toastr = inject(ToastrService);
  route = inject(Router);

  constructor(@Inject(PLATFORM_ID) private platFrom_id : object){}

  allUsers: any;
  loginForm: FormGroup = this.initForm();
  
  initForm(): FormGroup{
    return this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }


  ngOnInit(){
    this.authService.getUser().subscribe({
      next: (res) => {
        this.allUsers = res;
      } 
    })
  }

  submit(){
    if(this.loginForm.invalid) return;
    console.log(this.loginForm.value);

    const isAuthenticated = this.allUsers.some((user: any) =>
      user.email === this.loginForm.value.email && user.password === this.loginForm.value.password
    );

    if(isAuthenticated){
      this.toastr.success(`login successfully`);

      if(isPlatformBrowser(this.platFrom_id)){
        const userDate = JSON.stringify(this.loginForm.value)
        localStorage.setItem('userData', userDate);
      }

      this.route.navigate(['/task']);
    } else {
      this.toastr.error(`login filed`);
    }
    
    // this.authService.setLogin(this.loginForm.value); 
  }
}
