import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Route, Router } from '@angular/router';
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
  // profiles: any;
  profiles: any[] = [];
  profileImageUrls: string[] = [];

  constructor(private userService: UserService ,private router:Router) {}
  ngOnInit(): void {
    this.loadUserProfile();
  }
  loadUserProfile(): void {
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
      next: (response) => {
        console.log("All Profiles: ", response.profile);
        this.profiles = response.profile;
        // console.log("Profile image URL: ", this.getProfileImageUrl(this.profiles[0].profileImg_URL));
      },
      error: (error) => {
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
    // console.log('-----------------------pro', imageFilename)
    return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
  }
  addFollow(imageURl: any): void {
    // alert(`ImageUrl: ,${imageURl.profile_id}`)

    const user_id = sessionStorage.getItem('loginId');
    // alert(`User_id:${user_id}`);

    if (!user_id) {
      console.log('User ID not found. Please sign in');
      Swal.fire({
        title: 'Error!',
        text: 'Please sign in. for view the Profile',
        icon: 'error',
      });
      return;
    }

    if (isNaN(imageURl.profile_id)) {
      console.log('Invalid Post ID. Please try again.');
      return;
    }

    this.userService.addFollow(user_id, imageURl.profile_id).subscribe({
      next: (response) => {
        console.log("Follow data: ", response.data);
        Swal.fire({
          title: 'Success!',
          text: 'Follow Uploaded successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        console.log("this.profiles 1: ",this.profiles)

        // Remove the followed profile from the suggestions
      this.profiles = this.profiles.filter(profile => profile.profile_id !== imageURl.profile_id);
        console.log("this.profiles 2: ",this.profiles)
        
        this.router.navigate(['udashboard','suggest']);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 409) {
          Swal.fire({
            text: "You are already following this profile.",
            icon:'info',
            confirmButtonText: "OK",
          })
        } else {
          console.error('Error upload post:', error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while following others.",
            icon: "error",
          });
        }
      }
    })
  }
}

