// TypeScript Code (chat.component.ts)
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
    name: string;
    role: string;
    image:string
}

interface FileAttachment {
    name: string;
    url: string;
}

interface Message {
    text: string;
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
    searchTerm: string = '';
    activeTab: 'open' | 'closed' = 'open';
    openUsers: User[] = [
        { name: 'Mehedi Hasan', role: 'Front End Developer',image:"https://mehedihtml.com/chatbox/assets/img/user.png" },
        { name: 'Another User', role: 'Back End Developer',image:"https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" },
    ];
    closedUsers: User[] = [
        { name: 'Tumpa Moni', role: 'Front End Developer',image:"" },
        { name: 'Hasan Ali', role: 'Front End Developer' ,image:""},
        { name: 'Mehedi Hasan', role: 'Front End Developer' ,image:""},
    ];
    activeUser: User | null = null;
    messages: Message[] = [];
    newMessage: string = '';
    selectedFile: File | null = null;
    // newMessage: string = '';
    emojis: string[] = [
      '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', 
      '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗',
      '🤩', '🤔', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', 
      '😱', '😳', '😵', '😠', '😡', '😷', '🤒', '🤕', '🤢', '🤧',
      '😇', '🥳', '🥺', '😬', '🤥', '😈', '👿', '💀', '☠️', '👻', 
      // ... Add more emojis as needed
    ];
    showEmojiPicker: boolean = false;
  
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker; 
    }
  
    addEmoji(emoji: string) {
      this.newMessage += emoji; // Append selected emoji to the message
      this.showEmojiPicker = false; // Hide the emoji picker after selecting an emoji
    }
  
    selectTab(tab: 'open' | 'closed') {
        this.activeTab = tab;
        this.activeUser = null; // Reset active user when switching tabs
        this.messages = []; // Clear messages on tab change
    }

    selectUser(user: User) {
        this.activeUser = user;
        this.messages = [
            { text: 'Hey, Are you there?', time: '10:06 am', type: 'reply' }, // Received messages should be 'reply'
            { text: 'yes!', time: '10:20 am', type: 'sender' }, // Sent messages should be 'sender'
            { text: 'How are you?', time: '10:35 am', type: 'reply' },
        ]; // Example messages for the selected user
    }

    sendMessage(event: Event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get the current time
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Create a message object if text is present
        let message: Message | null = null;

        // Only create a message if there is text or a file
        if (this.newMessage.trim() || this.selectedFile) {
            message = {
                text: this.newMessage.trim() || '', // Use an empty string if there is no text
                time: currentTime,
                type: 'sender', // Mark as sender message
            };

            // Handle file attachment if it exists
            if (this.selectedFile) {
                // Create a URL for the file
                const fileURL = URL.createObjectURL(this.selectedFile);
                message.file = { name: this.selectedFile.name, url: fileURL }; // Assign the file info
            }

            // Add the message to the messages array
            this.messages.push(message);
        }

        // Clear the input fields
        this.newMessage = ''; // Clear the text input
        this.selectedFile = null; // Reset the selected file
    }

    onFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0]; // Store the selected file
        } else {
            this.selectedFile = null; // Reset if no file is selected
        }
    }
}
