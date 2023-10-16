import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs';
import { User } from '../models/user';
import { UserData } from '../models/userData';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login({ userId, password }: User) {
    return this.http.post<UserData>('https://pcii32quc8.execute-api.us-east-2.amazonaws.com/v1/login', { userId, password }).pipe(shareReplay())
  }
}
