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
// http://localhost:3001/post/postContent?user_id=2 CONTENT ALL
content(user_id:string):Observable<any>{
return this.http.get(`${this.apiUrl}/post/postContent?user_id=${user_id}`);
}
//post comment
comment(user_id:string,post_id:number,comment:string):Observable<any> {
  return this.http.post(`${this.apiUrl}/comment/addcom`, { user_id, post_id, comment });
}
//fetch privious comments
fetchComment(user_id: string,post_id:number): Observable<any> {
  return this.http.get(`${this.apiUrl}/comment/prevCom?post_id=${post_id}&user_id=${user_id}`);
  //http://localhost:3001/comment/prevCom?post_id=4&user_id=3
}



}