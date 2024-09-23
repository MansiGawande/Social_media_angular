import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreventDuplicateRouteGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    const currentRoute = state.url;

    // Logic to check if the current route is the same as the target route
    if (this.router.url === currentRoute) {
      // If the user is trying to navigate to the same route, return false
      return false;
    }

    // Allow navigation
    return true;
  }
}
