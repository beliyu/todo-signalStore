import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  handleError(error: HttpErrorResponse) { console.log('------ ', error)
    if (error.error && error.error.errors) {
      const errors = error.error.errors;
      let errorValue: string;
      Object.values(errors).forEach(entry => {
        errorValue = errors[0];
      });
      return throwError(() => errorValue);
    } else if (error.error) {
      return throwError(() => error.error);
    } else {
      return throwError(() => 'Unknown error');
    }
  }

  handleMe(error: HttpErrorResponse){
    return throwError(() => error.error)
  }
  
  handleCreateUserError(error: HttpErrorResponse) {
    if (error.error) {
      const errors = error.error.errors;
      return throwError(() => errors);
    } else {
      return throwError(() => 'Unknown error');
    }
  }
}