import { AuthService } from './../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorProvider implements HttpInterceptor {

  constructor(
    public http: HttpClient,
    private authService: AuthService
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getToken()).pipe(mergeMap((token) => {
      const changedReq = request.clone({
          setHeaders: {
              Authorization: `Bearer ${token}`
          }
      });

      return next.handle(changedReq);
    }));
  }
}

