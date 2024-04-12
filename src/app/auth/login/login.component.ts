import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  submitted: boolean = false;
  firebaseErrorMessage: string = '';

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(60),
        ],
      ],
    });
  }

  submit(): void {
    const { email, password } = this.form.getRawValue();
    this.submitted = true;

    if (this.form.valid) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.error(error);
          switch (error.code) {
            case 'auth/invalid-credential':
              this.firebaseErrorMessage = 'Identifiants invalides';
              break;

            default:
              this.firebaseErrorMessage =
                'Une erreur est survenue lors de la connexion';
              console.error(error);
              break;
          }
        },
      });
    }
  }
}
