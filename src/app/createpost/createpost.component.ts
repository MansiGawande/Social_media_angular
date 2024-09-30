import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { PostserviceService } from '../postservice.service';
import Swal from 'sweetalert2';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-createpost',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage],
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent {
  profileData:any;
  postData: any;
  media_url: string | ArrayBuffer | null = null;
  mediaType: string = '';
  description: string = '';
  photo: File | null = null;

  constructor(private postService: PostserviceService) { }

  ngOnInit(): void {
    // alert("Function called")
    this.loadUserProfile();
  }
  loadUserProfile ():void {
    const user_id = sessionStorage.getItem("loginId");
    // alert(`user_id: ${user_id}`);

    if(!user_id){
      console.log("User id not found in session storage.");
      console.log("Profile not found. Please create a profile to upload posts.")
      Swal.fire({
        title: "Error!",
        text: "Please sign in for Upload the Post",
        icon: "error",
      });
      return;
    }
    this.postService.viewProfile(user_id).subscribe({
      next:(response)=>{
        console.log("Profile data ", response.profile);
        this.profileData = response.profile; 
        // this means refer to the current response object 

    // const profile_name = this.profileData.name;
    // alert(`Profile name: ${profile_name}`);

    // console.log("Profile image URL: ", this.getProfileImageUrl(this.profileData.profileImg_URL));
   },
      error:(error) =>{
        console.error("Error fetching profile data:", error);
        Swal.fire({
          title: "Error!",
          text: "Unable to load profile data.",
          icon: "error",
        });
      }
    })
  }

  displayProfilePic(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result !== undefined) {
          this.media_url = result as string | ArrayBuffer;
        }
      };
      this.photo = input.files[0]; // store select file
      reader.readAsDataURL(this.photo)
    }
  }
  submitForm(): void {
    const user_id = sessionStorage.getItem("loginId");
    

    if (!user_id) {
      console.log("Profile not found. Please create a profile to upload posts.")
      Swal.fire({
        title: "Error!",
        text: "User ID not found. Please sign in.",
        icon: "error",
      });
      return;
    }
    // alert(`user_id: ${user_id}`);
    const postData = new FormData();

    postData.append('mediaType', this.mediaType);
    postData.append('description', this.description);
    postData.append('user_id', user_id);

    if (this.photo) {
      console.log('Appending file:', this.photo);
      postData.append('media_url', this.photo);
    }
    this.postService.uploadpost(postData).subscribe({
      next: (response) => {
        console.log("Post Upload Successfully:", response);
        Swal.fire({
          title: 'Success!',
          text: 'Post Uploaded successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        this.postData = response.postlhsView;
        // console.log("Profile image URL: ", this.getProfileImageUrl(this.postData.profileImg_URL));

        console.log("Profile image: ", response.postlhsView.profileImg_URL);
      },
      error: (error) => {
        console.log("Error in Post Upload:", error);
        const status = error.status;
        if (status === 404) {
          Swal.fire({
            title: "Error!",
            text: "Profile not found. Please create a profile to upload posts.",
            confirmButtonText: "OK",
          })
        } else {
          console.error('Error upload post:', error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while creating the profile.",
            icon: "error",
          });
        }
      }
    })
  }
  getProfileImageUrl(imageFilename: string): string {
    console.log('-----------------------', imageFilename)
    return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
  }
  //   ngOnInit() {
  //     const link = document.createElement('link');
  //     link.rel = 'preconnect';
  //     link.href = 'https://images.unsplash.com';
  //     document.head.appendChild(link);
  //   }
}
