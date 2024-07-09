import { TestBed } from "@angular/core/testing";
import { TodosStore } from "./todo.store";
import { TODOS } from "../todos-list/todo.model";
import { of } from "rxjs";
import { TodoService } from "../services/todo.service";

describe('TodoStore', () => {
    let todoStore: any;

    beforeEach(async () => {
        const fakeTodosService = jasmine.createSpyObj(
            'TodoService',
            {
                getTodos: of(TODOS),
                addTodo: of(TODOS[0]),
                delTodo: of(TODOS[0]),
                updateTodo: of({ ...TODOS[0], completed: true })
            }
        );

        await TestBed.configureTestingModule({
            providers: [TodosStore,
                {
                    provide: TodoService,
                    useValue: fakeTodosService
                },]
        }).compileComponents();

        todoStore = TestBed.inject(TodosStore);
    });

    it('inicial store is corect', () => {

        expect(todoStore.todos()).toEqual([]);
        expect(todoStore.loading()).toEqual(true);
        expect(todoStore.todosFilter()).toEqual('all');

        expect(todoStore.filteredTodos()).toEqual([]);
    });

    it('loadAll() ', async () => {
        await todoStore.loadAll();

        expect(await todoStore.todos()).toEqual(TODOS);
        expect(await todoStore.todos().length).toEqual(6);
    });

    it('addTodo() ', async () => {
        await todoStore.loadAll();
        expect(await todoStore.todos().length).toEqual(6);
        await todoStore.addTodo(TODOS[0])
        expect(await todoStore.todos().length).toEqual(7);
    });

    it('delTodo() ', async () => {
        await todoStore.loadAll();
        expect(await todoStore.todos().length).toEqual(6);
        await todoStore.delTodo('1')
        expect(await todoStore.todos().length).toEqual(5);
    });

    it('updateTodo() ', async () => {
        await todoStore.loadAll();
        await todoStore.updateTodo('1', true)

        expect(await todoStore.todos()[0].completed).toEqual(true);
    });

    it('updateFilter() & filteredTodos() ', async () => {
        await todoStore.loadAll();
        expect(await todoStore.todos().length).toEqual(6);
        expect(await todoStore.filteredTodos().length).toEqual(6);

        await todoStore.updateFilter('pending');
        expect(await todoStore.todosFilter()).toEqual('pending');
        expect(await todoStore.filteredTodos().length).toEqual(5);

        await todoStore.updateFilter('completed');
        expect(await todoStore.todosFilter()).toEqual('completed');
        expect(await todoStore.filteredTodos().length).toEqual(1);
    });
})