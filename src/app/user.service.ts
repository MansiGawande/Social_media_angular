import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { } // encapsulate the api url using HttpClient

// Sign Up Method
signUp(name: string, username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/user/signup`, { name, username, password });
}

// Sign In Method
signIn(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/user/signin`, { username, password });
}

// Create Profile Method
createProfile(profileData: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/profile/createPro`, profileData);
}

// Update Profile Method
updateProfile(userId: string, profileData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/user/updateProfile/${userId}`, profileData);
}

//Profile posts for others
profile_Post(user_id: string,profile_id:number): Observable<any> {
  return this.http.get(`${this.apiUrl}/post/profileposts?user_id=${user_id}&profile_id=${profile_id}`);
//http://localhost:3001/post/profileposts?user_id=4&profile_id=3
}

// profile & post only for self view
self_Profile(user_id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/selfProfile?user_id=${user_id}`);
  // http://localhost:3001/profile/selfProfile?user_id=1
}

addLike(user_id:string,post_id:number):Observable<any> {
  return this.http.post(`${this.apiUrl}/likes/addlikes`, { user_id, post_id });
}

suggest(user_id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/suggest?user_id=${user_id}`);
  // http://localhost:3001/profile/suggest?user_id=10
}

// removeLike(user_id:string,post_id:number):Observable<any>{
//   return this.http.delete(`${this.apiUrl}/likes/removeLike`, {user_id, post_id });
// }

removeLike(user_id: string, post_id: number): Observable<any> {
    const body = { user_id, post_id }; 
    return this.http.delete(`${this.apiUrl}/likes/removeLike`, { body });
}

addFollow(user_id:string,followed_id:number):Observable<any> {
  return this.http.post(`${this.apiUrl}/follow/addFollow`,{ user_id, followed_id });
  //http://localhost:3001/follow/addFollow
}

followers(user_id:string,profile_id:number):Observable<any>{
  return this.http.get(`${this.apiUrl}/follow/following?user_id=${user_id}&profile_id=${profile_id}`)
  // http://localhost:3001/follow/following?user_id=5&profile_id=8}

}
chatFollow(user_id:string):Observable<any>{
  return this.http.get(`${this.apiUrl}/follow/chatFollow?user_id=${user_id}`)
}
addChat(user_id:string,reciever_id:number,content:string):Observable<any>{
  return this.http.post(`${this.apiUrl}/chat/addchat`,{user_id,reciever_id,content});
}

}