import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('currentUser'));
  
    if (user.roles.includes(next.data.role)) {
      return true;
    }

    // navigate to not found page
    this._router.navigate(['/404']);
    return false;
  }
}
