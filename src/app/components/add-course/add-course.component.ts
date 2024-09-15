import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course, LearningMode } from '../../models/course';
import { Category } from '../../models/category';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CATEGORIES } from '../../models/category';


@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})

export class AddCourseComponent implements OnInit {
  availableImages: string[] = ['image1.jpg', 'image2.jpg', 'image3.jpg','image4.jpg','image5.jpg','image6.jpg','image7.jpg','image8.jpg','image9.jpg','image10.jpg'];
  course: Course = new Course(0, '', 0, 0, new Date(), [""], LearningMode.Frontal, 0, "", "");
  syllabusItems: string[] = [""];
  LearningMode = LearningMode;
  currentUser!: User;
  categories: Category[] = CATEGORIES;
  selectedCategoryIcon?: string;
  showAddCourseForm: boolean = false;

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }


  toggleAddCourseForm() {
    this.showAddCourseForm = !this.showAddCourseForm;
  }

  ngOnInit() {
    const user = this.userService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      if (this.currentUser && this.currentUser.id) {
        this.course.lecturerId = this.currentUser.id;
      }
    }
    if (this.categories.length != 0) {
      this.courseService.getCategories().subscribe(
        categories => this.categories = categories
      )
    };
    if (this.syllabusItems.length === 0) {
      this.syllabusItems = [""];
    }
  }

  isDateValid(): boolean {
    const currentDate = new Date();
    const courseStartDate = new Date(this.course.startDate);
    return courseStartDate > currentDate;
  }

  onImageSelect(image: string) {
    if (this.course) {
      this.course.imagePath = `assets/course-images/${image}`;
    }
  }

  updateSyllabusItem(index: number) {
    this.syllabusItems = [...this.syllabusItems];
    this.changeDetectorRef.detectChanges();
  }

  addSyllabusItem() {
    this.syllabusItems.push('');
  }

  removeSyllabusItem(index: number) {
    this.syllabusItems.splice(index, 1);
  }

  onCategoryChange(categoryId: number) {
    const selectedCategory = this.categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      this.selectedCategoryIcon = selectedCategory.iconPath;
    }
  }

  onSubmit() {
    if (!this.isDateValid()) {
      alert('התאריך שנבחר כבר עבר. אנא בחר תאריך עתידי.');
      return;
    }

    this.course.syllabus = [...this.syllabusItems];
    this.courseService.addCourse(this.course).subscribe(
      () => {
        alert('הקורס נוסף בהצלחה');
        this.router.navigate(['/courses']);
      },
      error => console.error('Error adding course:', error)
    );
  }
}



