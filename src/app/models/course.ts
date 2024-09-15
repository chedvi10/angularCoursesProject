export enum LearningMode {
  Frontal = 'Frontal',
  Zoom = 'Zoom'
}

export class Course {
  constructor(
    public id: number,
    public name: string,
    public categoryId: number,
    public lessonsCount: number,
    public startDate: Date,
    public syllabus: string[],
    public learningMode: LearningMode,
    public lecturerId: number,
    public imagePath: string,
    public description: string,
  ) { }
}
