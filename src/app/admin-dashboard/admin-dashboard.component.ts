import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  activeMenuLink: string | null = null;
  activeMainHeaderLink: string | null = null;
  activeDropdown: string | null = null;
  isHeaderWide: boolean = false;
  isOverlayActive: boolean = false;
  isOverlayAppActive: boolean = false;
  isPopUpVisible: boolean = false;
  isLightMode: boolean = false;

  // Method to set active menu link
  setActiveMenu(link: string): void {
    this.activeMenuLink = link;
  }

  // Method to set active main header link
  setActiveHeader(link: string): void {
    this.activeMainHeaderLink = link;
  }

  // Method to toggle dropdown visibility
  toggleDropdown(dropdown: string): void {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  // Method to handle search input focus
  onSearchFocus(): void {
    this.isHeaderWide = true;
  }

  // Method to handle search input blur
  onSearchBlur(): void {
    this.isHeaderWide = false;
  }

  // Method to toggle overlay
  toggleOverlay(): void {
    this.isOverlayActive = !this.isOverlayActive;
  }

  // Method to toggle overlay app
  toggleOverlayApp(): void {
    this.isOverlayAppActive = !this.isOverlayAppActive;
  }

  // Method to toggle pop-up visibility
  togglePopUp(): void {
    this.isPopUpVisible = !this.isPopUpVisible;
  }

  // Method to toggle light mode
  toggleLightMode(): void {
    this.isLightMode = !this.isLightMode;
    document.body.classList.toggle('light-mode', this.isLightMode);
  }

  // HostListener to handle clicks outside specific elements
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Close dropdowns if clicked outside
    if (!target.closest('.dropdown')) {
      this.activeDropdown = null;
    }

    // Close overlay if clicked outside the status button
    if (!target.closest('.status-button') && this.isOverlayAppActive) {
      this.isOverlayAppActive = false;
    }

    // Close pop-up if clicked outside
    if (!target.closest('.pop-up') && this.isPopUpVisible) {
      this.isPopUpVisible = false;
    }

    // Close overlay on content wrapper click
    if (!target.closest('.content-wrapper') && this.isOverlayActive) {
      this.isOverlayActive = false;
    }
  }
}
