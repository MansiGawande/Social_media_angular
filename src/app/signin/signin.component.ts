import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ngForm directive use
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  // constructor(private http: HttpClient) { } // encapsulate the api url using HttpClient in service
  constructor(private userService: UserService, private router: Router) {}

  async onsignIn(username: string, password: string) {
        // apply validation before api calling

        const errors: { [key: string]: string } = {};
        const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        let isValid = true;
        if (!usernameRegex.test(username)) {
          errors['username'] = 'Invalid username format.';
          isValid = false;
        }
    
        if (!passwordRegex.test(password) || password.length < 8) {
          errors ['password'] = 'Incorrect password. Please try again.';
          isValid = false;
        }

        if (!isValid) {
          const errorMessage = Object.values(errors).join('\n');
          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
          });
          return;
        }

        this.userService.signIn(username,password).subscribe({
          next:(response)=>{
            console.log('User signed in successfully:', response);
            Swal.fire({
              // title: 'Success!',
              text: 'You have successfully signed In.',
              icon: 'success',
              confirmButtonText: 'OK'
            })
            const loginId = response.data.user_id;
            const token = response.token;
            // alert(`User ID: ${loginId}`);
            //  alert(`token: ${token}`);

            sessionStorage.setItem("loginId", loginId);
            sessionStorage.setItem('authToken', token);
            this.router.navigate(['udashboard']); 
        },
        error:(error)=>{
          console.error('Sign in failed:', error);
          const status = error.status;
          if(status === 401){
            Swal.fire({
              title: 'Error!',
              text: 'Unauthorized User',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Please login after ragistration',
              icon: 'error',
              confirmButtonText: 'OK',
            });
            this.router.navigate(['signup']); 
            }
          }
        })
      }
}
