import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { error, log } from 'console';
import { response } from 'express';

interface User {
  profile_id: number;
  name: string;
  bio: string;
  profileImg_URL?: string;
}

interface FileAttachment {
  name: string;
  media_url: string;
}

interface Message {
  content: string;
  time: string;
  type: 'sender' | 'reply'; // Type 'sender' for sent messages, 'reply' for received messages
  file?: FileAttachment; // Optional file attachment
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class ChatComponent {
  User: User[] = [];
  profile: any = {};

  searchTerm: string = '';
  activeTab: 'open' | 'closed' = 'open';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loadFollowers();
  }
  loadFollowers(): void {
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
    this.userService.chatFollow(user_id).subscribe({
      next: (response) => {
        // alert(`Inside follow: ${this.profile_id}`);
        console.log('All follower data: ', response.followers);
        // console.log("All follower data: ",response.followers[0].profile);
        this.User = response.followers;
        this.User = response.followers.map((follower: any) => follower.profile); // Extract profiles directly

        console.log('=============================', this.User); //all
        if (response.followers.length > 0 && response.User[0].profile) {
          this.profile = response.followers[0].profile;
          console.log(
            'Profile Image URL:',
            this.getProfileImageUrl(this.profile.profileImg_URL)
          );
        }
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Internal server problem.',
          icon: 'error',
        });
      },
    });
  }
  getProfileImageUrl(imageFilename: string): string {
    // console.log('Profile Image Filename:', imageFilename);
    return `http://localhost:3001/ProfileImage/image/${imageFilename}`;
  }
  activeUser: User | null = null;
  messages: Message[] = [];
  content: string = ''; // newmessage
  selectedFile : File | null = null;
  name:File|null = null;
  emojis: string[] = [
    '😀',
    '😁',
    '😂',
    '🤣',
    '😃',
    '😄',
    '😅',
    '😆',
    '😉',
    '😊',
    '😋',
    '😎',
    '😍',
    '😘',
    '🥰',
    '😗',
    '😙',
    '😚',
    '🙂',
    '🤗',
    '🤩',
    '🤔',
    '😐',
    '😑',
    '😶',
    '🙄',
    '😏',
    '😣',
    '😥',
    '😮',
    '😱',
    '😳',
    '😵',
    '😠',
    '😡',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤧',
    '😇',
    '🥳',
    '🥺',
    '😬',
    '🤥',
    '😈',
    '👿',
    '💀',
    '☠️',
    '👻',
  ];
  showEmojiPicker: boolean = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(emoji: string) {
    this.content += emoji; // Append selected emoji to the message
    this.showEmojiPicker = false; // Hide the emoji picker after selecting an emoji
  }

  selectTab(tab: 'open' | 'closed') {
    this.activeTab = tab;
    this.activeUser = null; // Reset active user when switching tabs
    this.messages = []; // Clear messages on tab change
  }

  selectUser(user: User) {
    console.log('Active User in chat: ', user); // current choose user reciever
    alert(`Reciever User in chat: ${user.profile_id}`);
    this.activeUser = user;
    //    this.messages = [
    //     { text: 'Hey, Are you there?', time: '10:06 am', type: 'reply' }, // Received messages should be 'reply'
    //     { text: 'yes!', time: '10:20 am', type: 'sender' }, // Sent messages should be 'sender'
    //     { text: 'How are you?', time: '10:35 am', type: 'reply' },
    // ]
    const user_id = sessionStorage.getItem('loginId');
    
    if (!user_id) {
      console.log('User ID not found. Please sign in');
      Swal.fire({ title: 'Error!', text: 'Please sign in to view the Profile', icon: 'error' });
      return;
    }
     
    if (!this.activeUser) {
        Swal.fire({ title: 'Error!', text: 'Please select a user to send a message.', icon: 'error' });
        return;
      }
      console.log(this.activeUser.profile_id)
      this.userService.chatByPro(user_id,this.activeUser.profile_id).subscribe({
        next:(response)=>{
            console.log(response.data);
            this.messages = response.data
        },error:(error)=>{
            console.log(error);
        }
      })

  }
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile  = input.files[0]; // Store the selected file
    } else {
      this.selectedFile  = null; // Reset if no file is selected
    }
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const user_id = sessionStorage.getItem('loginId');
    
    if (!user_id) {
      console.log('User ID not found. Please sign in');
      Swal.fire({ title: 'Error!', text: 'Please sign in to view the Profile', icon: 'error' });
      return;
    }
    
    if (!this.activeUser) {
      Swal.fire({ title: 'Error!', text: 'Please select a user to send a message.', icon: 'error' });
      return;
    }
    
    if (this.content.trim()) {
      const formData: FormData = new FormData(); 
      formData.append('user_id', user_id);
      formData.append('reciever_id', this.activeUser.profile_id.toString());
      formData.append('content', this.content.trim());
      
      if (this.selectedFile) {
        formData.append('media_url', this.selectedFile);
        console.log("Selected File: ", this.selectedFile);
      }
  
      this.userService.addChat(formData).subscribe({
        next: (response) => {
          if (this.content.trim() || this.selectedFile) {
            const message: Message = {
            content: response.data.content.trim(),
              time: currentTime,
              type: 'sender',
            };
            if (this.selectedFile) { 
              message.file = { 
                name: this.selectedFile.name,
                media_url: response.data.media_url,
              };
            }
  
            if (!Array.isArray(this.messages)) {
              this.messages = [];
            }
            this.messages.push(message);
            this.content = '';
            this.selectedFile = null; // Reset the selected file
        }
        },
        error: (error) => {
          console.log("Error Response:", error);
        },
      });
    }
  }
  

  closedUsers: User[] = [
    {
      profile_id: 0,
      name: 'Tumpa Moni',
      bio: 'Front End Developer',
      profileImg_URL: '',
    },
    {
      profile_id: 0,
      name: 'Hasan Ali',
      bio: 'Front End Developer',
      profileImg_URL: '',
    },
    {
      profile_id: 0,
      name: 'Mehedi Hasan',
      bio: 'Front End Developer',
      profileImg_URL: '',
    },
  ];
}
//========================================================================================
// openUsers: User[] = [
//     { name: 'Mehedi Hasan', role: 'Front End Developer',image:"https://mehedihtml.com/chatbox/assets/img/user.png" },
//     { name: 'Another User', role: 'Back End Developer',image:"https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" },
// ];
// closedUsers: User[] = [
//     { profile_id:0, name: 'Tumpa Moni', bio: 'Front End Developer', profileImg_URL: '' },
//     {profile_id:0, name: 'Hasan Ali', bio: 'Front End Developer', profileImg_URL: '' },
//     {profile_id:0, name: 'Mehedi Hasan', bio: 'Front End Developer', profileImg_URL: '' },
// ];
// activeUser: User | null = null;
// messages: Message[] = [];
// newMessage: string = '';
// selectedFile: File | null = null;
// newMessage: string = '';
// emojis: string[] = [
//   '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
//   '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗',
//   '🤩', '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮',
//   '😱', '😳', '😵', '😠', '😡', '😷', '🤒', '🤕', '🤢', '🤧',
//   '😇', '🥳', '🥺', '😬', '🤥', '😈', '👿', '💀', '☠️', '👻',
// ];
// showEmojiPicker: boolean = false;

// toggleEmojiPicker() {
//   this.showEmojiPicker = !this.showEmojiPicker;
// }

// addEmoji(emoji: string) {
//   this.newMessage += emoji; // Append selected emoji to the message
//   this.showEmojiPicker = false; // Hide the emoji picker after selecting an emoji
// }

// selectTab(tab: 'open' | 'closed') {
//     this.activeTab = tab;
//     this.activeUser = null; // Reset active user when switching tabs
//     this.messages = []; // Clear messages on tab change
// }

// // selectUser(user: User) {
// //     console.log("Active User in chat: ",user); // current choose user
// //     this.activeUser = user;
// //     this.messages = [
// //         { text: 'Hey, Are you there?', time: '10:06 am', type: 'reply' }, // Received messages should be 'reply'
// //         { text: 'yes!', time: '10:20 am', type: 'sender' }, // Sent messages should be 'sender'
// //         { text: 'How are you?', time: '10:35 am', type: 'reply' },
// //     ]; // Example messages for the selected user
// // }

// sendMessage(event: Event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     // Get the current time
//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     // Create a message object if text is present
//     let message: Message | null = null;

//     // Only create a message if there is text or a file
//     if (this.newMessage.trim() || this.selectedFile) {
//         message = {
//             text: this.newMessage.trim() || '', // Use an empty string if there is no text
//             time: currentTime,
//             type: 'sender', // Mark as sender message
//         };

//         // Handle file attachment if it exists
//         if (this.selectedFile) {
//             // Create a URL for the file
//             const fileURL = URL.createObjectURL(this.selectedFile);
//             message.file = { name: this.selectedFile.name, url: fileURL }; // Assign the file info
//         }

//         // Add the message to the messages array
//         this.messages.push(message);
//     }

//     // Clear the input fields
//     this.newMessage = ''; // Clear the text input
//     this.selectedFile = null; // Reset the selected file
// }

// onFileChange(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//         this.selectedFile = input.files[0]; // Store the selected file
//     } else {
//         this.selectedFile = null; // Reset if no file is selected
//     }
// }
// }
