import { Pipe, PipeTransform } from '@angular/core';
import { LearningMode } from '../models/course';


@Pipe({
  name: 'learningModeIcon',
  standalone: true
})
export class LearningModeIconPipe implements PipeTransform {
  transform(mode: LearningMode): string {
    switch (mode) {
      case LearningMode.Frontal:
        return 'fas fa-chalkboard-teacher';
      case LearningMode.Zoom:
        return 'fas fa-laptop-house';
      default:
        return 'fas fa-question';
    }
  }
}



