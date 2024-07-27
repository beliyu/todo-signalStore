import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  handleError(error: HttpErrorResponse) { 
    if (error.error) {
      return throwError(() => new Error(error.error));
    } else {
      return throwError(() => new Error('Unknown error'));
      
    }
  }

  // handleMe(error: HttpErrorResponse){
  //   return throwError(() => error.error)
  // }
  
  // handleCreateUserError(error: HttpErrorResponse) {
  //   if (error.error) {
  //     const errors = error.error.errors;
  //     return throwError(() => errors);
  //   } else {
  //     return throwError(() => 'Unknown error');
  //   }
  // }
}