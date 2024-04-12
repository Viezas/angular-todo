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
import Validation from '../../utils/validations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
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
    confirmPassword: new FormControl(''),
  });

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(60),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }

  submit(): void {
    const { email, password } = this.form.getRawValue();
    this.submitted = true;

    if (this.form.valid) {
      this.authService.register(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.firebaseErrorMessage = 'Adresse e-mail non valide';
              break;

            default:
              this.firebaseErrorMessage =
                "Une erreur est survenue lors de l'inscription";
              console.error(error);
              break;
          }
        },
      });
    }
  }
}
