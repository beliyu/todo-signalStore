import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('SnackbarService', () => {
  
  beforeEach(() => TestBed.configureTestingModule({
     imports: [MatSnackBarModule],
     providers: [ SnackbarService, ],
  }));

  beforeEach(() => {
    TestBed.get(MatSnackBar);
  });

  it('should be created', () => {
    const service: SnackbarService = TestBed.inject(SnackbarService);
    expect(service).toBeTruthy();
  });

  it('should call open()', () => {
    const sb : MatSnackBar = TestBed.inject(MatSnackBar)
    const service: SnackbarService = TestBed.inject(SnackbarService);
    const spy = spyOn(sb, 'open');
    service.showSnackbar('Hello', true, 1000);
    expect(spy).toHaveBeenCalled();
  })

});