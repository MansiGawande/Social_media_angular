import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { response } from 'express';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { PostserviceService } from '../postservice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile_id!: number; // holds the id from route
  profileData: any;
  postData: any[] = [];
  // postImageUrls: string[] = []; //  to store the image urls

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute
  ) { }
  // const errors:{[key :string]:string} = {};
  // let isValid = true;

  // ngOnInit lifecycle hook is used for initialization tasks in com is called once after the component’s
  //  data-bound properties have been initialized such as fetching data, setting default values, or configuring services. 
  ngOnInit(): void {
    // Retrieve post_id from the route parameters and convert it to a number using the +' sign

    this.profile_id = +this.route.snapshot.paramMap.get('profile_id')!;
    // alert(`Received profile from content: , ${this.profile_id}`);

    if (isNaN(this.profile_id)) {
      console.log('Invalid Profile_id. Please try again.');
      Swal.fire({
        title: 'Error!',
        text: 'Profile not Exist.Please try again.',
        icon: 'error',
      });
      return;
    }
    // alert(`Received post_id: , ${this.post_id}`);
    this.loadUserProfile(this.profile_id);
  }
  loadUserProfile(profile_id: number): void {
    console.log(`Loading comments for post with ID: ${profile_id}`);

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

    // alert(`Received profile from content: , ${this.profile_id}`);
    this.userService.profile_Post(user_id, profile_id).subscribe({
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
          title: "Error!",
          text: "Profile not exist Please create profile .",
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
  goToComments(post_id: number) {
    // console.log("Post_id: ",post_id)
    this.router.navigate(['/comments', post_id]);
  }

  //========================================================================================================

  LikePost(post: any): void {
    // alert(`Post_id: ${post.post_id}`);
    const user_id = sessionStorage.getItem('loginId');
    if (!user_id) {
      console.log('User ID not found. Please sign in');
      Swal.fire({
        title: 'Error!',
        text: 'Please sign in. for view the Profile',
        icon: 'error',
      });
      return;
    }
    // alert(`User_id: ${user_id}`)
    post.isLiked = !post.isLiked;

    if (isNaN(post.post_id)) {
      console.log('Invalid Post ID. Please try again.');
      return;
    }
    if (isNaN(post.likeCount) || post.likeCount < 0) {
      post.likeCount = 0; 
    }
    
    if (post.isLiked) {
      post.likeCount++; 
      this.userService.addLike(user_id, post.post_id).subscribe({
        next: (response) => {
          // Swal.fire({
          //   title: 'Success!',
          //   text: 'Post has been Liked.',
          //   icon: 'success',
          // });
        },
        error: (error) => {
          console.error('Error liking post:', error);
          post.isLiked = false; // Revert liked state if an error occurs
          post.likeCount--; // Decrement count if an error occurs

          const status = error.status;
          if (status === 401) {
            Swal.fire({
              text: 'Create the Profile for put the Comment on  post',
              icon: 'info',
              confirmButtonText: 'OK',
            });
            this.router.navigate(['/cpro']);
          }
          else {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to like the post. Please try again later.',
              icon: 'error',
            });
          }
        }
      });
    } else { // If the post is unliked
      post.likeCount--; // Decrement like count
      this.userService.removeLike(user_id, post.post_id).subscribe({
        next: () => {
          // Swal.fire({
          //   title: 'Success!',
          //   text: 'Post has been unliked.',
          //   icon: 'success',
          // });
        },
        error: (error) => {
          console.error('Error unliking post:', error);
          post.isLiked = true; // Revert liked state if an error occurs
          post.likeCount++; // Increment count if an error occurs

          Swal.fire({
            title: 'Error!',
            text: 'Failed to unlike the post. Please try again later.',
            icon: 'error',
          });
        }
      });
    }
  }
}
