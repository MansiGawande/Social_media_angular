// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-profile',
//   standalone: true,
//   imports: [],
//   templateUrl: './create-profile.component.html',
//   styleUrl: './create-profile.component.css'
// })
// export class CreateProfileComponent {}



// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms'; 
// import { UserService } from '../user.service';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-create-profile',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './create-profile.component.html',
//   styleUrls: ['./create-profile.component.css']
// })
// export class CreateProfileComponent {
//   photoSrc: string | ArrayBuffer | null = null;

//   displayProfilePic(event: Event): void {
//     const input = event.target as HTMLInputElement;

//     if (input.files && input.files[0]) {
//       const reader = new FileReader();

//       reader.onload = (e) => {
//         const result = e.target?.result;
//         if (result !== undefined) {
//           this.photoSrc = result as string | ArrayBuffer;
//         }
//       };

//       reader.readAsDataURL(input.files[0]);
//     }
//   }

//   submitForm(): void {
//     console.log("Form submitted");
//  }
// }

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {
  profileImg_URL:string|ArrayBuffer|null = null;
  name:string = '';
  email:string = '';
  bio:string = '';
  photo:File | null = null;

  nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/; 
  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  constructor(private userService :UserService,
    //  private router: Route
    ) {}

    displayProfilePic(event:Event):void{
    const input = event.target as HTMLInputElement;

    if(input.files && input.files[0]){
      const reader = new FileReader();
      reader.onload = (e)=>{
        const result = e.target?.result;
        if(result !== undefined){
          this.profileImg_URL = result as string |ArrayBuffer;
        }
     };
     this.photo = input.files[0]; // store select file
     reader.readAsDataURL(this.photo)
    }
  }
  submitForm():void{
    const errors:{[key :string]:string} = {};
    let isValid = true;

    if (!this.nameRegex.test(this.name)) {
      errors['name'] = "Please enter both Name and Surname";
      isValid = false;
    }
    if (!this.emailRegex.test(this.email)) {
      errors['email'] = "Invalid Email format"; 
      isValid = false;
    }

    if(!isValid){
      const errorMessage = Object.values(errors).join('\n');
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
      return;
    }

    // Create FormData for submission
    // console.log('Name:', this.name);
    // console.log('Email:', this.email);
    // console.log('Bio:', this.bio);
    // console.log('Photo:', this.photo);
    const  user_id = sessionStorage.getItem("loginId")
    if (!user_id) {
      console.log("User ID not found. Please sign in")
      Swal.fire({
        title: "Error!",
        text: "Please sign in for Create the profile",
        icon: "error",
      });
      return;
    }
      alert(`User ID: ${user_id}`);

        const profileData = new FormData();

      profileData.append('name', this.name);
      profileData.append('email', this.email);
    profileData.append('bio', this.bio);
    profileData.append('user_id',user_id);

    if (this.photo) {
      console.log('Appending file:', this.photo); 
      profileData.append('profileImg_URL', this.photo);
    }

    this.userService.createProfile(profileData).subscribe({
      next:(response) =>{
        console.log('Profile created successfully:', response);
        Swal.fire({
          title: 'Success!',
          text: 'Profile created successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        .then(() => {
      // this.router.navigate(['/some-success-route']);
    });
 
      },
      error: (error) => {
        console.error('Error creating profile:', error);
        const status = error.status;
        if(status === 409){
          Swal.fire({
            title: "Error!",
            text: "Profile already exist you can update profile.",
            confirmButtonText: "OK",
          })
        } else {
          console.error('Error creating profile:', error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while creating the profile.",
          icon: "error",
        });
        }
      }
    })
}
}
