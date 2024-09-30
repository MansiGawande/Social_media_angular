import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { PostserviceService } from '../postservice.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})
export class ProfileComponent implements OnInit {
  profileData: any;
  postData: any[] = [];
  postImageUrls: string[] = []; // Add this line to store the image URLs

constructor(private userService :UserService) {}
// const errors:{[key :string]:string} = {};
// let isValid = true;

ngOnInit(): void {
  this.loadUserProfile();
}
loadUserProfile ():void {

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
    this.userService.profile_Post(user_id).subscribe({
      next:(response)=>{
        console.log("Profile data ", response.profile);
        this.profileData = response.profile; 
        console.log(this.profileData);
        
        // console.log("Profile image URL: ", this.getProfileImageUrl(this.profileData.profileImg_URL));
        // console.log("ProfileImg_Url: ",this.profileData.profileImg_URL)
      
        console.log("Post data: ",response.data);
        this.postData = response.data; 
        console.log("Post data2: ",this.postData[0].media_url); 

        this.postImageUrls = this.postData.map(post => this.getPostImageUrl(post.media_url));
        console.log("Post image URLs: ", this.postImageUrls); // proper give images url
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
  getPostImageUrl(imageFilename: string): string {
    console.log('********************', imageFilename)
    return `http://localhost:3001/PostData/data/${imageFilename}`;
  }
}
