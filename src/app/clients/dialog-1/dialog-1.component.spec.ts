import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Dialog1 } from "./dialog-1.component";
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


describe('Dialog1 Component', () => {
    let component: Dialog1;
    let fixture: ComponentFixture<Dialog1>;
    let loader: HarnessLoader;
    let fakeClientsStore: any

    beforeEach(waitForAsync(() => {
        fakeClientsStore = jasmine.createSpyObj(
            'ClientsStore',
            {
                addClient: of(true),
            }
        );

        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, Dialog1,],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: []
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        meth: 'Add',
                        el: {
                            email: "aleks2@gmail.com",
                            id: "4aa",
                            lastSeen: "",
                            name: "Aleksa 2",
                            password: "125po",
                            role: "Commercialist",
                            surname: "Jovanovic"
                        }
                    }
                },
                {
                    provide: ClientsStore,
                    useValue: fakeClientsStore
                },
                provideHttpClient(), provideAnimationsAsync()]
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(Dialog1);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be able to load 5 formFields', async () => {
        const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
        expect(formFields.length).toBe(5);
    });

    it('should change visibility on click', (() => {
        let icon = fixture.debugElement.query(By.css('[data-testid="visi"]')).nativeElement;
        expect(icon.innerText).toEqual('visibility_off');

        icon.click();
        fixture.detectChanges();
        expect(icon.innerText).toEqual('visibility');
    }));

    it('should be able to get error messages', async () => {
        const formField = await loader.getAllHarnesses(MatFormFieldHarness);
        expect(await formField[0].getTextErrors()).toEqual([]);

        fixture.componentInstance.createPar.get('name')?.setValue('');
        await ((await formField[0].getControl()) as MatInputHarness)?.blur();
        expect(await formField[0].getTextErrors()).toEqual(['Molimo unesite ime!']);
    });

    it('should be able to get hints', async () => {
        const formField = await loader.getAllHarnesses(MatFormFieldHarness);
        expect(await formField[3].getTextHints()).toEqual(['Min 5 characters']);
    });

    it('should be able to save()', async () => {
        let btn = fixture.debugElement.query(By.css('[data-testid="save"]')).nativeElement;
        const formFields = await loader.getAllHarnesses(MatFormFieldHarness);

        fixture.componentInstance.createPar.get('name')?.setValue('Alex');
        fixture.componentInstance.createPar.get('surname')?.setValue('Alexic');
        fixture.componentInstance.createPar.get('email')?.setValue('Alex@asd.kl');
        fixture.componentInstance.createPar.get('password')?.setValue('Alex78');
        fixture.componentInstance.createPar.get('role')?.setValue('Admin');

        await ((await formFields[4].getControl()) as MatInputHarness)?.blur();
        btn.click();
        fixture.detectChanges();

        expect(formFields.length).toBe(5);
        expect(fakeClientsStore.addClient).toHaveBeenCalledWith({
            name: 'Alex', surname: 'Alexic', email: 'Alex@asd.kl', password: 'Alex78', role: 'Admin'
        });
    });

});

describe('Dialog1 Component data2', () => {
    let component: Dialog1;
    let fixture: ComponentFixture<Dialog1>;
    let loader: HarnessLoader;
    let fakeClientsStore: any

    beforeEach(waitForAsync(() => {
        fakeClientsStore = jasmine.createSpyObj(
            'ClientsStore',
            {
                updateClient: of(true),
            }
        );

        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, Dialog1,],
            providers: [{
                provide: MatDialogRef,
                useValue: []
            },
            {
                provide: MAT_DIALOG_DATA,
                useValue: {
                    meth: 'Edit',
                    el: {
                        email: "aleks2@gmail.com",
                        id: "4aa",
                        lastSeen: "",
                        name: "Aleksa 2",
                        password: "125po",
                        role: "Commercialist",
                        surname: "Jovanovic"
                    }
                }
            },
            {
                provide: ClientsStore,
                useValue: fakeClientsStore
            },
            provideHttpClient(), provideAnimationsAsync()]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Dialog1);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    })


    it('should be able to edit()', async () => {
        let btn = fixture.debugElement.query(By.css('[data-testid="save"]')).nativeElement;
        const formFields = await loader.getAllHarnesses(MatFormFieldHarness);

        fixture.componentInstance.createPar.get('name')?.setValue('Alex');
        fixture.componentInstance.createPar.get('surname')?.setValue('Alexic');
        fixture.componentInstance.createPar.get('email')?.setValue('Alex@asd.kl');
        fixture.componentInstance.createPar.get('password')?.setValue('Alex78');
        fixture.componentInstance.createPar.get('role')?.setValue('Admin');

        await ((await formFields[4].getControl()) as MatInputHarness)?.blur();
        btn.click();
        fixture.detectChanges();

        expect(formFields.length).toBe(5);
        expect(fakeClientsStore.updateClient).toHaveBeenCalledWith('4aa', {
            name: 'Alex', surname: 'Alexic', email: 'Alex@asd.kl', password: 'Alex78', role: 'Admin'
        });
    });
});
