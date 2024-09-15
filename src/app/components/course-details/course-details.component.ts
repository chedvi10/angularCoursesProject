import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { Course, LearningMode } from '../../models/course';
import { LearningModeIconPipe } from '../../pipes/learning-mode-icon.pipe';
import { Lecturer } from '../../models/lecturer';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CATEGORIES } from '../../models/category';


@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterModule, LearningModeIconPipe],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  lecturer: Lecturer | null = null;
  course: Course | null = null;
  isLecturerOfCourse: boolean = false;
  LearningMode = LearningMode;
  categoryName: string = "";
  categoryIcon: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationRouter: Router,
    private courseService: CourseService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const courseId = this.activatedRoute.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourse(+courseId).subscribe(
        course => {
          this.course = course;
          this.checkIfLecturer();
          this.getCategoryIcon(course.categoryId);
        }
      );

    }
    this.getLecturerDetails();
  }

  getCategoryIcon(categoryId: any) {
    const id = Number(categoryId);
    const selectedCategory = CATEGORIES.find(cat => cat.id === id);
    if (selectedCategory) {
      this.categoryName = selectedCategory.name;
      this.categoryIcon = selectedCategory.iconPath;
    }
  }

  setCategoryDetails() {
    if (this.course && this.course.categoryId) {
      const selectedCategory = CATEGORIES.find(cat => cat.id === this.course!.categoryId);
      if (selectedCategory) {
        this.categoryName = selectedCategory.name;
        this.categoryIcon = selectedCategory.iconPath;
      }
    }
  }

  checkIfLecturer(): boolean {
    const currentUser = this.userService.getCurrentUser();
    if (this.course && currentUser) {
      return this.course.lecturerId === currentUser.id;
    }
    return false;
  }

  isStartingSoon(): boolean {
    if (this.course) {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const currentDate = new Date();
      const courseStartDate = new Date(this.course.startDate);
      const timeDifference = courseStartDate.getTime() - currentDate.getTime();

      return timeDifference > 0 && timeDifference <= oneWeek;
    }
    return false;
  }

  getLecturerDetails(): Observable<string> {
    if (this.course && this.course.lecturerId) {
      return this.userService.getUserById(this.course.lecturerId).pipe(
        map((lecturer: Lecturer) => lecturer.name),
        catchError(() => of('לא נמצא מרצה'))
      );
    }
    return of('לא נמצא מרצה');
  }

  getCategoryName(categoryId: number): string {
    // יש להחליף זאת בקריאה אמיתית לשירות הקטגוריות
    return 'שם הקטגוריה';
  }

  learningModeIcon(mode: LearningMode): string {
    return new LearningModeIconPipe().transform(mode);
  }

  editCourse() {
    if (this.course) {
      this.navigationRouter.navigate(['/edit-course', this.course.id], { state: { course: this.course } });
    }
  }
}


