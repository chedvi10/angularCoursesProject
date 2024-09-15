import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = {
    name: '',
    email: '',
    password: '',
    address: '',
    isLecturer: false
  };
  isLecturer: boolean = false;
  showPassword: boolean = false;
  errorMessage: string = '';
  showLecturerCodeInput: boolean = false;
  lecturerCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['username']) {
        this.user.name = params['username'];
      }
      this.isLecturer = params['type'] === 'lecturer';
    });
  }
  onSubmit() {
    if (!this.validatePassword(this.user.password)) {
      alert('הסיסמה חייבת להכיל 6 תווים בדיוק, אותיות או ספרות בלבד.');
      return;
    }

    const newUser: User & { isLecturer: boolean } = {
      ...this.user,
      isLecturer: this.isLecturer
    };


    this.userService.register(newUser).subscribe(
      success => {
        if (success) {
          {
            this.router.navigate(['/courses']);
          }
        } else {
          this.errorMessage = 'ההרשמה נכשלה';
        }
      },
      error => {
        if (error.status === 400) {
          alert("שם המרצה קיים כבר");
        }
        if (error.status === 401) {
          alert("שם משתמש קיים כבר");
        }
      }
    );
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openLecturerCodeInput(event: Event) {
    event.preventDefault(); // מונע את ברירת המחדל של הטופס
    this.showLecturerCodeInput = true;
  }


  verifyLecturerCode(event: Event) {
    event.preventDefault();
    this.userService.verifyLecturerCode(this.lecturerCode).subscribe(
      isValid => {
        if (isValid) {
          alert("מצוין! הינך מועבר למלאות את טופס ההרשמה.");// פתיחת טופס הרשמה למרצה
          this.showLecturerRegistrationForm();
        } else {
          alert('קוד לא תקין. נסה שנית.');
        }
      },
      error => {
        console.error('שגיאה באימות הקוד:', error);
        alert('אירעה שגיאה. אנא נסה שוב מאוחר יותר.');
      }
    );
  }

  showLecturerRegistrationForm() {
    this.isLecturer = true;
    this.showLecturerCodeInput = false;
    this.user.address = '';
    this.user.name = '';
    this.user.email = '';
    this.user.password = '';
    this.user.isLecturer = true;
  }

  validatePassword(password: string): boolean {
    return password.length === 6 && /^[a-zA-Z0-9]+$/.test(password);
  }

}



