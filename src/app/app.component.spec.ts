import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router, provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent,],
      providers: [provideRouter(routes), provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular coding exercises');
  });

  it('should render matNavList of 2 item', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('mat-list-item').length).toBe(2);
  });

  it('should navigate towards correct url on click', fakeAsync(() => {
    const link0 = fixture.debugElement.query(By.css('.link')).nativeElement;
    link0.click();
    fixture.detectChanges();
    expect(location.path()).toBe('/todos');
  }));

});
