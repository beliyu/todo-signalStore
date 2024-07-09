import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderToken, signal, Signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TodosListComponent } from './todos-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { fake, SinonSpy } from 'sinon';
import { TodosStore } from './todo.store';
import { TODOS } from './todo.model';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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

describe('TodosListComponent', () => {
  let component: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;
  let loader: HarnessLoader;
  let store: UnwrapProvider<typeof TodosStore>;

  class fakesTodoStore {
    delTodo = fake();
    addTodo = fake();
    updateTodo = fake();
    updateFilter = fake();
    filteredTodos = signal(TODOS);
    todosFilter = signal('all');
  }

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TodosListComponent],
      providers: [provideAnimationsAsync(),]
    })
      .overrideComponent(TodosListComponent, {
        set: {
          providers: [
            {
              provide: TodosStore,
              useClass: fakesTodoStore
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TodosListComponent);
    store = fixture.debugElement.injector.get(TodosStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add Todo', async () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement
    input.value = 'asd ...';
    input.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'Enter' }))

    fixture.detectChanges();

    expect(asSinonSpy(store.addTodo).callCount).toBe(1);
    expect(asSinonSpy(store.addTodo).lastCall.args).toEqual(['asd ...']);
  });

  it('should delete Todo', async () => {
    const btn = fixture.debugElement.query(By.css('[data-testid="delete"]')).nativeElement
    btn.click();

    fixture.detectChanges();

    expect(asSinonSpy(store.delTodo).callCount).toBe(1);
    expect(asSinonSpy(store.delTodo).lastCall.args).toEqual(['1']);
  });

  it('should toggle Todo', async () => {
    const btn = fixture.debugElement.query(By.css('[data-testid="toggle"]')).nativeElement
    btn.click();

    fixture.detectChanges();

    expect(asSinonSpy(store.updateTodo).callCount).toBe(1);
    expect(asSinonSpy(store.updateTodo).lastCall.args).toEqual(['1', true]);
  });

  it('should filter Todo', async () => {
    const toggButtons = fixture.nativeElement.querySelectorAll('.mat-button-toggle-button');
    toggButtons[1].click()

    fixture.detectChanges();

    expect(asSinonSpy(store.updateFilter).callCount).toBe(1);
  });

});
