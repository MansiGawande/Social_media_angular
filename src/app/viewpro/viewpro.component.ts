// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-viewpro',
//   standalone: true,
//   imports: [],
//   templateUrl: './viewpro.component.html',
//   styleUrl: './viewpro.component.css'
// })
// export class ViewproComponent {
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-viewpro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viewpro.component.html',
  styleUrls: ['./viewpro.component.css']
})
export class ViewproComponent {
  isEditing = false;
  user = {
    name: 'Maria Elliott',
    location: 'Albany, New York',
    email: 'maria@example.com',
    bio: 'Fashion enthusiast and blogger.'
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this.toggleEdit();
    alert("Changes saved!");
  }
}

