import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Route } from '@angular/router';
import Swal from 'sweetalert2';
import { response } from 'express';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.css'
})
export class RecommendationComponent {
  profiles:any;
  profileImageUrls: string[] = [];

constructor(private userService: UserService) {}
ngOnInit(): void {
  this.loadUserProfile();
}
loadUserProfile():void {
  const user_id = sessionStorage.getItem("loginId")
    if (!user_id) {
      console.log("User ID not found. Please sign in")
      Swal.fire({
        title: "Error!",
        text: "Please sign in. for view the Profile",
        icon: "error",
      });
      return;
    }

    this.userService.suggest(user_id).subscribe({
      next:(response)=>{
        console.log("All Profiles: ",response.profile);
        this. profiles = response.profile;
        console.log("Profile image URL: ", this.getProfileImageUrl(this.profiles[0].profileImg_URL));
 },
      error:(error)=>{
        if (error.status === 404) {
          Swal.fire({
            text: 'Sign in to View the profiles',
            icon: 'info',
            confirmButtonText: 'OK',
          });
        }      
      }
    })
}
getProfileImageUrl(imageFilename: string): string {
  console.log('-----------------------pro', imageFilename)
  return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
}
}

