import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../../interface/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth: Auth = inject(Auth);
  user = user(this.firebaseAuth);
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);
  currentUser$ = authState(this.firebaseAuth);

  register(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {});
    return from(promise);
  }

  logout(): Observable<void> {
    return from(this.firebaseAuth.signOut());
  }
}
