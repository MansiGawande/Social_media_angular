// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-content',
//   standalone: true,
//   imports: [],
//   templateUrl: './content.component.html',
//   styleUrl: './content.component.css'
// })
// export class ContentComponent {

// }

import { Component } from '@angular/core';
import { PostserviceService } from '../postservice.service';
import Swal from 'sweetalert2';
import { response } from 'express';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  postwithProfile: any[] = [];
  postImageUrls: string[] = [];
  profileImageUrls: string[] = [];
  profilename: string[] = [];
  createdAt :string[] = []

  constructor(private postService: PostserviceService) { }

  // ngOnInit lifecycle hook is used for initialization tasks in com is called once after the component’s load
  //  data-bound properties have been initialized such as fetching data, configuring services. 

  ngOnInit(): void {
    this.loadContent();
  }
  loadContent(): void {
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

    this.postService.content(user_id).subscribe({
      next: (response) => {
        console.log("Post data: ", response.data);
        this.postwithProfile = response.data;

        console.log("this.postwithProfile :", this.postwithProfile[0]);
        console.log("this.Profile image.......... :", this.postwithProfile[0].profile.profileImg_URL);
        // this.profileImageUrls = this.postwithProfile[0].profile;
        // console.log("postwithProfile profile object: ",this.profileImageUrls);

        //=======================================================================================
        // console.log(this.postwithProfile[0].createdAt) 
      this.createdAt = this.postwithProfile.map(post => {
        return this.formatDate(post.createdAt); 
      });
       console.log("Formatted Post Dates: ", this.createdAt);


        this.postImageUrls = this.postwithProfile.map(post => this.getPostImageUrl(post.media_url));
         console.log("Post image URLs: ", this.postImageUrls); // get exact url
        //=================================================================================

        this.profileImageUrls = this.postwithProfile.map(post => {
          console.log("Current post object: ", post);

          if (post.profile) {
            const profileImgURL = post.profile.profileImg_URL;
            console.log(`Profile Image URL))))))))))))))))))))))): ${profileImgURL}`);
             return profileImgURL;
          }
        });

        this.profilename = this.postwithProfile.map(post => {
          if (post.profile) {
            const profileName = post.profile.name;
            console.log(`Profile Name: ${profileName}`);
            return profileName;
          }
          return '';
        }).filter(name => name !== ''); // no name no error

        console.log("Profile image URLs: ", this.profileImageUrls);
        console.log("Profile Names: ", this.profilename);
      },
      error: (error) => {
        console.error("Error fetching profile: ", error);
        Swal.fire({
          title: "Error!",
          text: "Profile not exist Please create profile .",
          icon: "error",
        });
      }
    })
  }
  getPostImageUrl(imageFilename: string): string {
    console.log('********************', imageFilename);
    return `http://localhost:3001/PostData/data/${imageFilename}`;

  }
  getProfileImage(imageFilename: string): string {
    console.log('********************', imageFilename);
    return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
  }

  // getPostDate(createdAt:string):any{
  //   console.log("Post Date: ", this.createdAt);
  //   }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  }

}

