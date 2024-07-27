import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { AreYouSureComponent } from "./are-you-sure.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ClientsStore } from '../client.store';
import { provideHttpClient } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatInputHarness } from "@angular/material/input/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";

describe('AreYouSureComponent Component', () => {
    let component: AreYouSureComponent;
    let fixture: ComponentFixture<AreYouSureComponent>;
    let loader: HarnessLoader;
    let fakeMatDialogRef: any

    beforeEach(waitForAsync(() => {
        fakeMatDialogRef = jasmine.createSpyObj(
            'MatDialogRef',
            {
                close: of(true),
            }
        );

        TestBed.configureTestingModule({
            imports: [AreYouSureComponent,],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: fakeMatDialogRef
                },
                provideAnimationsAsync()]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AreYouSureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to confirm', async () => {
        const btn = fixture.debugElement.query(By.css('[data-testid="da"]')).nativeElement;
        btn.click();
        fixture.detectChanges();

        expect(fakeMatDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should be able to reject', async () => {
        const btn = fixture.debugElement.query(By.css('[data-testid="ne"]')).nativeElement;
        btn.click();
        fixture.detectChanges();

        expect(fakeMatDialogRef.close).toHaveBeenCalledWith(false);
    });
});
