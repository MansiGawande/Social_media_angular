import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-createpost',
  standalone: true,
  imports: [FormsModule,NgOptimizedImage],
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {
  userFullName: string = '';
  userNickname: string = '';
  userYearStart: string = '';
  userYearEnd: string = '';

  ngOnInit() {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://images.unsplash.com';
    document.head.appendChild(link);
  }
}
