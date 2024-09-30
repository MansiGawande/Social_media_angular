import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostserviceService {
  private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient) {}
  
//create post
uploadpost(postData :any):Observable<any>{
  return this.http.post(`${this.apiUrl}/post/uploadps`,postData);
}
//upload post lhs 
viewProfile(user_id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/viewPro?user_id=${user_id}`);
}

}
