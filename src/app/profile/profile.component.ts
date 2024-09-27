import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})
export class ProfileComponent implements OnInit {
  profileData: any;
constructor(private userService :UserService) {}

// const errors:{[key :string]:string} = {};
// let isValid = true;

ngOnInit(): void {
let  user_id = sessionStorage.getItem("loginId")
    if (!user_id) {
      console.log("User ID not found. Please sign in")
      Swal.fire({
        title: "Error!",
        text: "User ID not found. Please sign in.",
        icon: "error",
      });
      return;
    }
    this.userService.viewProfile(user_id).subscribe({
      next:(response)=>{
        console.log("Profile data ", response.profile);
        this.profileData = response.profile; 
        // console.log("Profile image URL: ", this.getProfileImageUrl(this.profileData.profileImg_URL));
        // console.log("ProfileImg_Url: ",this.profileData.profileImg_URL)
      },
      error: (error) => {
        console.error("Error fetching profile: ", error);
        Swal.fire({
          title: "Error!",
          text: "Please login to view the profile.",
          icon: "error",
        });
      }
    })
  }
  
  getProfileImageUrl(imageFilename: string): string {
    console.log('-----------------------', imageFilename)
    return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
  }
  
}
