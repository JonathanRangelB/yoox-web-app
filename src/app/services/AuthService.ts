import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { shareReplay } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(userId: string, password: string) {
    return this.http.post<User>('https://pcii32quc8.execute-api.us-east-2.amazonaws.com/v1/login', { userId, password }).pipe(shareReplay());
  }
}
