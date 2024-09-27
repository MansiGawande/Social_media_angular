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

// // View Profile Method
// viewProfile(user_id: string): Observable<any> {
//   return this.http.get(`${this.apiUrl}/profile/viewPro/${user_id}`);
// }
viewProfile(user_id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/viewPro?user_id=${user_id}`);
}

// Update Profile Method
updateProfile(userId: string, profileData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/user/updateProfile/${userId}`, profileData);

}
}
