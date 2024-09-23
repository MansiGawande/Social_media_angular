// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-udashboard',
//   standalone: true,
//   imports: [],
//   templateUrl: './udashboard.component.html',
//   styleUrl: './udashboard.component.css'
// })
// export class UdashboardComponent {

// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-udashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './udashboard.component.html',
  styleUrls: ['./udashboard.component.css'] 
})
export class UdashboardComponent {
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen; 
  }
}
