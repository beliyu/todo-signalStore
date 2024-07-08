import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderToken, Signal, signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ClientsComponent } from './clients.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { CLIENTS } from './client.model';
import { ClientsStore } from './client.store';
import { fake, SinonSpy } from 'sinon';

type UnwrapProvider<T> = T extends ProviderToken<infer U> ? U : never;

function asSinonSpy<
  TArgs extends readonly any[] = any[],
  TReturnValue = any,
>(fn: (...x: TArgs) => TReturnValue): SinonSpy<TArgs, TReturnValue> {
  return fn as unknown as SinonSpy<TArgs, TReturnValue>;
}

function asWritableSignal<T>(s: Signal<T>): WritableSignal<T> {
  return s as WritableSignal<T>;
}

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;
  let fakeDialog: MatDialog;
  let loader: HarnessLoader;
  let store: UnwrapProvider<typeof ClientsStore>;

  class fakeClientStore {
    filteredClients = signal(CLIENTS);
    page = {
      pageSize: signal(5),
      pageIndex: signal(0)
    };
    loadAll = fake();
    setFilter = fake();
    setPage = fake();
    delClients = fake()
  }

  beforeEach(async () => {
    fakeDialog = jasmine.createSpyObj(
      'Dialog',
      {
        open: of(true),
      }
    );

    await TestBed.configureTestingModule({
      imports: [ClientsComponent,],
      providers: [provideAnimationsAsync(),
      {
        provide: MatDialog,
        useValue: fakeDialog
      },
      ]
    })
      .overrideComponent(ClientsComponent, {
        set: {
          providers: [
            {
              provide: ClientsStore,
              useClass: fakeClientStore
            },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsComponent);
    store = fixture.debugElement.injector.get(ClientsStore);
    asSinonSpy(store.setFilter).resetHistory();
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to delete', async () => {
    let btn = fixture.debugElement.query(By.css('[data-testid="delete"]')).nativeElement;
    btn.click();
    fixture.detectChanges();

    expect(fakeDialog.open).toHaveBeenCalled();
  });

  it('should be able to edit', async () => {
    let btn = fixture.debugElement.query(By.css('[data-testid="edit"]')).nativeElement;
    btn.click();
    fixture.detectChanges();

    expect(fakeDialog.open).toHaveBeenCalled();
  });

  it('should be able to set filter', async () => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);

    let btn = fixture.debugElement.query(By.css('.form-control')).nativeElement.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    expect(asSinonSpy(store.setFilter).callCount).toBe(1);
    expect(asSinonSpy(store.setFilter).lastCall.args).toEqual([{
      name: '', email: '', role: ''
    }]);
  });

  it('When the user selects a page', () => {
    const matPaginationComponent = fixture.debugElement.query(
      By.css('mat-paginator')).nativeElement;
    asSinonSpy(store.setPage).resetHistory();

    matPaginationComponent.dispatchEvent(new CustomEvent("page", { detail: 2 }));
    fixture.detectChanges();

    expect(asSinonSpy(store.setPage).callCount).toBe(1);
  });
});
