import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(): boolean | UrlTree {
        if (this.authService.isAdmin) {
            return true;
        }

        // Redirect to user portal if logged in but not admin
        if (this.authService.isLoggedIn()) {
            return this.router.createUrlTree(['/public']);
        }

        // Otherwise back to login
        return this.router.createUrlTree(['/auth/login']);
    }
}
