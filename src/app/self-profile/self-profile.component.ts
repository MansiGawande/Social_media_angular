import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { PostserviceService } from '../postservice.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-self-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './self-profile.component.html',
  styleUrls: ['./self-profile.component.css']
})
export class SelfProfileComponent {
  profileData: any;
  postData: any[] = [];
  // postImageUrls: string[] = []; //  to store the image urls

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute
  ) { }

    // ngOnInit lifecycle hook is used for initialization tasks in com is called once after the component’s
  //  data-bound properties have been initialized such as fetching data, setting default values, or configuring services. 
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

    this.userService.self_Profile(user_id).subscribe({
      next: (response) => {
        console.log("Profile data ", response.profile);
        this.profileData = response.profile;
        console.log(this.profileData);

        // console.log("Profile image URL: ", this.getProfileImageUrl(this.profileData.profileImg_URL));
        // console.log("ProfileImg_Url: ",this.profileData.profileImg_URL)

        console.log("Post data: ", response.data);
        this.postData = response.data;
        console.log("Post data2: ", this.postData[0].media_url);

        // this.postImageUrls = this.postData.map(post => this.getPostImageUrl(post.media_url));
        // console.log("Post image URLs: ", this.postImageUrls); // proper give images url
      },
      error: (error) => {
        console.error("Error fetching profile: ", error);
        Swal.fire({
          text: "Profile not exist Please create profile .",
          icon: "info",
        });
        this.router.navigate(['cpro']);


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
  goToComments(post_id: number) {
    // console.log("Post_id: ",post_id)
    this.router.navigate(['/comments', post_id]);
  }

}
