import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import getRandomInt from '../../utils/miscellaneaous';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(public firestore: Firestore, private authService: AuthService) {}

  add(title: string, description: string | undefined): void {
    this.authService.user.subscribe(async (user) => {
      if (user) {
        try {
          const time = moment().format('hh:mm');

          const taskRef = await addDoc(
            collection(this.firestore, `users/${user.uid}/notes`),
            {
              title: title,
              subtitle: description,
              isDon: false,
              image: getRandomInt(7),
              time: time,
            }
          );

          await updateDoc(taskRef, {
            id: taskRef.id,
          });
        } catch (error) {
          throw error;
        }
      }
    });
  }

  update(task: any) {
    this.authService.user.subscribe(async (user) => {
      if (user) {
        try {
          delete task.is_editing;

          await updateDoc(
            doc(this.firestore, `users/${user.uid}/notes/${task.id}`),
            task
          );
        } catch (error) {
          throw error;
        }
      }
    });
  }

  delete(task: any) {
    this.authService.user.subscribe(async (user) => {
      if (user) {
        try {
          await deleteDoc(
            doc(this.firestore, `users/${user.uid}/notes/${task.id}`)
          );
        } catch (error) {
          throw error;
        }
      }
    });
  }
}
