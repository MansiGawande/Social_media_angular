import { Component, OnInit } from '@angular/core';
import { PostserviceService } from '../postservice.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// capture the post_id from the URL using ActivatedRoute. from app.route

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
})
export class CommentsComponent implements OnInit {
  post_id!: number; // holds the id from route
  comment: string = ''; // hold commnet text
  comments: any[] = []; // store prev comments
  profile: any = {};
  currentUser: any;

  constructor(
    private postService: PostserviceService,
    private route: ActivatedRoute, private router: Router,
  ) { }
  //Inject ActivatedRoute to access the route parameters.

  // ngOnInit lifecycle hook is used for initialization tasks in com is called once after the component’s

  ngOnInit(): void {
    // Retrieve post_id from the route parameters and convert it to a number using the +' sign

    this.post_id = +this.route.snapshot.paramMap.get('post_id')!;

    if (isNaN(this.post_id)) {
      console.log('Invalid Post ID. Please try again.');
      Swal.fire({
        title: 'Error!',
        text: 'Invalid Post. Please try again.',
        icon: 'error',
      });
      return;
    }
    // alert(`Received post_id: , ${this.post_id}`);

    this.loadComments(this.post_id);
  }
  loadComments(post_id: number): void {
    console.log(`Loading comments for post with ID: ${post_id}`);

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

    if (!this.post_id) {
      console.log('Post ID Or Post not exist');
      Swal.fire({
        title: 'Error!',
        text: 'Post not Available',
        icon: 'error',
      });
      return;
    }
    this.postService.fetchComment(user_id, post_id).subscribe({
      next: (response) => {
        console.log('Fetching Comments: ', response.comments);
        this.comments = response.comments;

        if (response.comments.length > 0 && response.comments[0].profile) {
          this.profile = response.comments[0].profile;
          // console.log(response.comments[0].profile.profileImg_URL);

          console.log('Profile Image URL:', this.getProfileImageUrl(this.profile.profileImg_URL));

        }
      },
      error: (error) => {
        console.log('Error in fetching comments: ', error);
        Swal.fire({
          text: 'No comments On this post please write something.',
          icon: 'info',
        });
      },
    });
  }
  submitComment(): void {
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

    if (!this.post_id) {
      Swal.fire({
        title: 'Error!',
        text: 'Post ID is not available.',
        icon: 'error',
      });
      return;
    }

    if (this.comment.trim() === '') {
      console.log('Comment cannot be empty.');
      Swal.fire({
        title: 'Warning!',
        text: 'Comment cannot be empty.',
        icon: 'warning',
      });
      return;
    }
    this.postService.comment(user_id, this.post_id, this.comment).subscribe({
      next: (response) => {
        console.log('Posted Comment: ', response.data);
        const profileData = response.profile;
        if (profileData) {
          this.currentUser = profileData;
          // current profile img
        }

        Swal.fire({
          title: 'Success!',
          text: 'Your comment has been posted.',
          icon: 'success',
        });
        this.comment = '';
        this.loadComments(this.post_id);
      },
      error: (error) => {
        console.log('Error in Posting Comment: ', error);
        const status = error.status;
        if (status === 401) {
          Swal.fire({
            text: 'Create the Profile for put the Comment on  post',
            icon: 'info',
            confirmButtonText: 'OK',
          });
          this.router.navigate(['/cpro']);

        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to post comment. Please try again later.',
            icon: 'error',
          });
        }
      },
    });
  }
  getProfileImageUrl(imageFilename: string): string {
    console.log('Profile Image Filename:', imageFilename);
    return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
  }

}


// (ngSubmit)="submitComment()" can we userDefine variable in place of ngSubmit
// <textarea [(ngModel)]="commentText" name="comment"  required></textarea>
// yha kya ho rhai kya user commnet ko bind karne ke liye ngModel use kiya hai ya iski jagah kuch aur bhi use kar skte hai
