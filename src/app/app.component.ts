import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, MatToolbarModule],
  template: `
  <mat-toolbar color="primary">
    <span>קורסים אונליין</span>
  </mat-toolbar>
  <app-navbar></app-navbar>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
`,
  styles: [`
    .container {
      padding-top: 20px;
    }
      span{
      font-size: 35px;
      }
  `]
})

export class AppComponent {
  title = 'angular-course-project';
  userService: any;
  ngOnInit() {
  }
}

