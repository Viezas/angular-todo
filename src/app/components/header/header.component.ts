import { Component } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      if (user) {
        this.authService.currentUserSignal.set({
          email: user.email!,
          id: user.uid,
        });
      } else {
        this.authService.currentUserSignal.set(null);
      }
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
