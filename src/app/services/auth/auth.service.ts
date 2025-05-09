import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  authUrl = 'http://localhost:3000/register';

  constructor(@Inject(PLATFORM_ID) private platFrom_id : object){
    
  }

  userLogin = new BehaviorSubject<any>(null);
  login$ = this.userLogin.asObservable();

  setLogin(userData: any) {
    this.userLogin.next(userData);
    this.login$.subscribe(console.log
    );

    console.log(userData);
    
    if(!userData){
      if(isPlatformBrowser(this.platFrom_id)){
        const userD = JSON.parse(localStorage.getItem('userData') || '');
        console.log(userD);
        
        this.userLogin.next(userD);
      }
    }
  };

  getUser(){
    return this.http.get(this.authUrl);
  }
}
