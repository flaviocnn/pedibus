import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  canGo = false;

  constructor(private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    next.data.role.forEach(el => {
      if (user.roles.includes(el)) {
        this.canGo = true;
      }
    });

    if(!this.canGo){
        // navigate to not found page
      this._router.navigate(['/404']);
      return false;
    }
    else{
      return true;
    }
    
  }
}
