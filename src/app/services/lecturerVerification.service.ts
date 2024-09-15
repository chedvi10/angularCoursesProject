import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LecturerVerificationService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  verifyLecturerCode(code: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verify-lecturer`, { code });
  }
}
