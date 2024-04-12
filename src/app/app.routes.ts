import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { TasksComponent } from './tasks/tasks.component';
import { NewTaskComponent } from './new-task/new-task.component';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'register',
    component: RegisterComponent,
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: '',
    component: TasksComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'new-tasks',
    component: NewTaskComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
];
