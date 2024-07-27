import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandlingService } from "./error-handling.service";
import { take } from "rxjs";

describe('Error-handling Service', () => {
  let ehService: ErrorHandlingService;

  beforeEach(() => {
    ehService = new ErrorHandlingService();
  });

  /* eslint-disable @typescript-eslint/no-empty-function */
  it('throwError error', () => {
    const errorText = "Not found!"
    const e = new HttpErrorResponse({ error: errorText, status: 404, });
    ehService.handleError(e).pipe(take(1)).subscribe({
      next: () => { },
      error: (error) => { expect(error).toMatch(errorText); }
    });
  });

  it('throwError Unknown error', () => { 

    const errorText = 'Unknown error'
    const e = new HttpErrorResponse({ status: 404, });
    ehService.handleError(e).pipe(take(1)).subscribe({
      next: () => { },
      error: (error) => { expect(error).toMatch(errorText); }
    });
   });
  /* eslint-enable @typescript-eslint/no-empty-function */
});