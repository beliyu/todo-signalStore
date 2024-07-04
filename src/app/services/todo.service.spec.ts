import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TODOS } from '../model/todo.model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ErrorHandlingService } from './error-handling.service';


describe('Todo service', () => {
    let service: TodoService;
    let errorService: ErrorHandlingService;
    let httpTesting: HttpTestingController;

    beforeEach( () => {
        TestBed.configureTestingModule({
            providers: [TodoService, provideHttpClient(), provideHttpClientTesting(), ErrorHandlingService]
        });
        httpTesting = TestBed.inject(HttpTestingController);
        service = TestBed.inject(TodoService);
        errorService = TestBed.inject(ErrorHandlingService);
    });

    it('should get todos', async () => {
        const todos$ = service.getTodos();
        const todosPromise = firstValueFrom(todos$);
        const req = httpTesting.expectOne('/api/todos');
        expect(req.request.method).toBe('GET');

        req.flush(TODOS);
        expect(await todosPromise).toEqual(TODOS);
    });

    it('should add todo', async () => {
        const todos$ = service.addTodo(TODOS[0]);
        const todosPromise = firstValueFrom(todos$);
        const req = httpTesting.expectOne('/api/todos');
        expect(req.request.method).toBe('POST');

        req.flush(TODOS[0]);
        expect(await todosPromise).toEqual(TODOS[0]);
    });

    it('should del todo', async () => {
        const todos$ = service.delTodo('1');
        const todosPromise = firstValueFrom(todos$);
        const req = httpTesting.expectOne('/api/todos/1');
        expect(req.request.method).toBe('DELETE');

        req.flush(TODOS[0]);
        expect(await todosPromise).toEqual(TODOS[0]);
    });

    it('should update todo', async () => {
        const todos$ = service.updateTodo('1', true);
        const todosPromise = firstValueFrom(todos$);
        const req = httpTesting.expectOne('/api/todos/1');
        expect(req.request.method).toBe('PATCH');

        req.flush(TODOS[0]);
        expect(await todosPromise).toEqual(TODOS[0]);
    });

    it('should handle backend error todo', async () => {
        const mySpy = spyOn(errorService , 'handleError');
        const todos$ = service.delTodo('1');
        const todosPromise = firstValueFrom(todos$);
        const req = httpTesting.expectOne('/api/todos/1');
        expect(req.request.method).toBe('DELETE');

        req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});
        expect(mySpy).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        httpTesting.verify();
    });
});