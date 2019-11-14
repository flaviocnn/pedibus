import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }


    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log(req);

        const idToken = localStorage.getItem('id_token');
        let reqWithCredentials = req;
        if (idToken) {
            reqWithCredentials = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + idToken)
            });
        }
        return next.handle(reqWithCredentials).pipe(
            catchError(error => {
                if (error.status === 401 || error.status === 403) {
                    console.log('401 o 403');
                    this.router.navigate(['/login']);
                }
                return throwError(error);
            })
        );
    }
}
