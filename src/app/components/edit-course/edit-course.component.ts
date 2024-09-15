import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningMode } from '../../models/course';
import { CATEGORIES } from '../../models/category';
import { Category } from '../../models/category';


@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent implements OnInit {
  course: Course | null = null;
  LearningMode = LearningMode;
  availableImages: string[] = ['image1.jpg', 'image2.jpg', 'image3.jpg','image4.jpg','image5.jpg','image6.jpg','image7.jpg','image8.jpg','image9.jpg','image10.jpg'];
  categories: Category[] = CATEGORIES;
  selectedCategoryIcon?: string;
  learningModes = Object.values(LearningMode);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
  ) { }

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourse(+courseId).subscribe(
        course => {
          this.course = course;
        }
      );
    }
  }

  onImageSelect(image: string) {
    if (this.course) {
      this.course.imagePath = `assets/course-images/${image}`;
    }
  }

  onSubmit() {
    if (!this.isDateValid()) {
      alert('התאריך שנבחר כבר עבר. אנא בחר תאריך עתידי.');
      return;
    }
    if (this.course) {
      this.courseService.updateCourse(this.course).subscribe(
        () => {
          alert('הקורס עודכן בהצלחה');
          this.router.navigate(['/courses']);
        },
        error => {
          console.error('שגיאה בעדכון הקורס:', error);
        }
      );
    }
  }

  addSyllabusItem() {
    if (this.course && this.course.syllabus) {
      this.course.syllabus.push('');
    }
  }

  removeSyllabusItem(index: number) {
    if (this.course && this.course.syllabus) {
      this.course.syllabus.splice(index, 1);
    }
  }

  onCancel() {
    this.router.navigate(['/courses', this.course?.id]);
  }

  onCategoryChange(categoryId: number) {
    const selectedCategory = this.categories.find(cat => cat.id === categoryId);
    if (selectedCategory) {
      this.selectedCategoryIcon = selectedCategory.iconPath;
    }
  }

  isDateValid(): boolean {
    const currentDate = new Date();
    const courseStartDate = new Date(this.course!.startDate);
    return courseStartDate > currentDate;
  }

}

