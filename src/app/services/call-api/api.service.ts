import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http: HttpClient = inject(HttpClient);

  urlApi: string = "http://localhost:3000/";
  

  gatData(endPoint: string){
    return this.http.get(this.urlApi + endPoint);
  }

  postData(endPoint: string, body: {}){
    return this.http.post(this.urlApi + endPoint, body);
  }
}
