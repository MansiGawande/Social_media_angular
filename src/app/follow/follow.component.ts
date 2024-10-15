import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-follow',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './follow.component.html',
  styleUrl: './follow.component.css'
})
export class FollowComponent {
followers: any[] = [];
profile_id!: number; // holds the id from route
profile: any = {};

constructor(private userService:UserService,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.profile_id = +this.route.snapshot.paramMap.get('profile_id')!;
    if(isNaN(this.profile_id)){
      console.log("Invalid Post ID. Please try again.");
      Swal.fire({
        title: 'Error!',
        text: 'Invalid Post. Please try again.',
        icon: 'error',
      });
      return;
    }
    this.loadFollowers(this.profile_id);
  }
  loadFollowers(profile_id: number) : void {
    const user_id = sessionStorage.getItem("loginId")
    if(!user_id){
      console.log("User ID not found. Please sign in")
      Swal.fire({
        title: "Error!",
        text: "Please sign in. for view the Profile",
        icon: "error",
      });
      return;
    }
    if (!this.profile_id) {
      console.log('profile not found Or Post not exist');
      Swal.fire({
        title: 'Error!',
        text: 'Profile not Available',
        icon: 'error',
      });
      return;
    }
    this.userService.followers(user_id,profile_id).subscribe({
      next:(response)=>{
    // alert(`Inside follow: ${this.profile_id}`);
    console.log("All follower data: ",response.followers);
    // console.log("All follower data: ",response.followers[0].profile);

    this.followers = response.followers;
    console.log("=============================",this.followers) //all
    if(response.followers.length > 0 && response.followers[0].profile){
      this.profile = response.followers[0].profile
      console.log('Profile Image URL:', this.getProfileImageUrl(this.profile.profileImg_URL));

    }
    
  } ,error:(error)=>{
    console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Internal server problem.',
          icon: 'error',
        });
  }
})
}
getProfileImageUrl(imageFilename: string): string {
  console.log('Profile Image Filename:', imageFilename);
  return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
}
}
