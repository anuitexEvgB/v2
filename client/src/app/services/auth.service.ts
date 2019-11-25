import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

import { UserResponse, User, GoogleFB } from 'src/app/models';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.api;
  constructor(
    private http: HttpClient,
    private storage: Storage,
    ) { }


  public register(user: User): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.api}/users/register`, user);
  }

  public socialLogin(user: GoogleFB): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.api}/users/socialLogin`, user).pipe(
      tap(async (res: UserResponse) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.accessToken));
          await this.storage.set('USER_ID', res.userId);
        }
      })
    );
  }

  public login(user: User): Observable<UserResponse> {
    return this.http.post(`${this.api}/users/login`, user).pipe(
      tap(async (res: UserResponse) => {
        if (res) {
          await this.storage.set('ACCESS_TOKEN', JSON.stringify(res.accessToken));
          await this.storage.set('USER_ID', res.userId);
        }
      })
    );
  }

  public async logout() {
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.remove('USER_ID');
  }

  public async getToken() {
    return await this.storage.get('ACCESS_TOKEN').then(token => {
      return JSON.parse(token);
    });
  }

  public async getUserId() {
    return await this.storage.get('USER_ID').then(user => {
      return user;
    });
  }
}
