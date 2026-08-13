import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Facility } from '../models/facility';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  uri = 'http://localhost:4000/users';

  private http = inject(HttpClient)

  private user: User = new User()
  private loggedIn: Boolean = false
  previousPath: String = ""

  setUser(u:User){
    localStorage.setItem('user', JSON.stringify(u));
  }

  getUser(){
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  getLoggedIn(){
    return localStorage.getItem('user') !== null
  }

  removeUser(){
    localStorage.removeItem('user');
  }

  getPreviousPath(){
    return this.previousPath
  }

  setPreviousPath(path: string) {
    setTimeout(() => {
      this.previousPath = path;
    });
  }

  logIntoSystem(u: String, p: String) {
    const data = {
      username: u,
      password: p,
    };
    return this.http.post<User>(`${this.uri}/login`, data);
  }

  requestPasswordReset(c: String){
    const data = {
      credential: c
    };
    return this.http.post<String>(`${this.uri}/requestPasswordReset`, data);
  }

  resetPassword(t: String, p: String){
    const data = {
      token: t,
      password: p
    };
    return this.http.post<String>(`${this.uri}/resetPassword`, data);
  }

  getAvailableSports(){
    return this.http.get<String[]>(`${this.uri}/getAvailableSports`);
  }

  registerUser(data: FormData){
    return this.http.post<String>(`${this.uri}/registerUser`, data);
  }

  getAllUsers(){
    return this.http.get<User[]>(`${this.uri}/getAllUsers`);
  }

  getPendingUsers(){
    return this.http.get<User[]>(`${this.uri}/getPendingUsers`);
  }

  deleteUser(u: User){
    return this.http.post<User>(`${this.uri}/deleteUser`, u);
  }

  updateUser(u: User | null){
    return this.http.post<User>(`${this.uri}/updateUser`, u);
  }

  updateUserProfile(formData: FormData) {
    return this.http.post<User>(`${this.uri}/updateUser`, formData);
}

  updateUserStatus(u: User, status: String){
    u.status = status
    return this.http.post<User>(`${this.uri}/updateUserStatus`, u);
  }

  addSport(s: String){
    const data = {
      name: s
    }
    return this.http.post<String>(`${this.uri}/addSport`, data);
  }

  deleteSport(s: String){
    const data = {
      name: s
    }
    return this.http.post<String>(`${this.uri}/deleteSport`, data);
  }

  getEmployedFacilities(username: String){
    return this.http.post<Facility[]>(`${this.uri}/getEmployedFacilities`, {username: username});
  }
}
