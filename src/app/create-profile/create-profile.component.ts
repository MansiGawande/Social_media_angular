// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-create-profile',
//   standalone: true,
//   imports: [],
//   templateUrl: './create-profile.component.html',
//   styleUrl: './create-profile.component.css'
// })
// export class CreateProfileComponent {}



import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [FormsModule], // Include FormsModule here
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})
export class CreateProfileComponent {
  photoSrc: string | ArrayBuffer | null = null;

  displayProfilePic(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (result !== undefined) {
          this.photoSrc = result as string | ArrayBuffer;
        }
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  submitForm(): void {
    console.log("Form submitted");
    // Add further processing logic here
  }
}
