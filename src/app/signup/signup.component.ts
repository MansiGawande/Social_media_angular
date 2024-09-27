import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms'; // ngForm directive use
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  // constructor(private http: HttpClient) { } // encapsulate the api url using HttpClient in service
  constructor(private userService: UserService, private router: Router) {}

  async onsignUp(name: string, username: string, password: string) {
    // apply validation before api calling

    const errors: { [key: string]: string } = {};
      const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/; 
      const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  
      let isValid = true;
  
      if (!nameRegex.test(name)) {
        errors['name'] = "Please enter both Name and Surname";
        isValid = false;
      }
      if (!usernameRegex.test(username)) {
        errors['username'] = "Invalid Email format"; 
        isValid = false;
      }
      if (!passwordRegex.test(password)) {
        errors['password'] = "Password must be at least 8 characters long and include both letters and numbers"; // Changed here
        isValid = false;
      }
      // if (password !== confirmPassword) {
      //   errors['confirmPassword'] = "Passwords do not match"; 
      //   isValid = false;
      // }

      if (!isValid) {
        const errorMessage = Object.values(errors).join('\n');
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
        return;
      }

   this.userService.signUp(name,username,password).subscribe({
      next:(response)=>{
        console.log('User signed up successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'You have successfully signed up.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        .then(() => {
          this.router.navigate(['/']); 
        });
      },
       error: (error) => {
        console.error('Sign up failed:', error);
        const status = error.status;
        if (status === 400) {
          // Swal.fire({
          //   title: "Error!",
          //   text: "Account already exists. Please sign in.",
          //   confirmButtonText: "OK",
          // })
          // .then(() => {
            this.router.navigate(['/']); 
          // })
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'There was an issue signing up. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    })
  }
}
  
  