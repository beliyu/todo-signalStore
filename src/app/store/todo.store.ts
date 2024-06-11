import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Todo } from "../model/todo.model";
import { TodoService } from "../services/todo.service";
import { computed, inject } from "@angular/core";

export type TodosFilter = "all" | "completed" | "pending"

type TodosState = {
    todos: Todo[];
    loading: boolean;
    todosFilter: TodosFilter
}

const inicialState: TodosState = {
    todos: [],
    loading: true,
    todosFilter: "all"
}

export const TodosStore = signalStore(
    { providedIn: 'root' },
    withState(inicialState),

    withMethods(
        (store, todosService = inject(TodoService)) => ({
            async loadAll() {
                patchState(store, { loading: true });
                const todos = await todosService.getTodos();
                patchState(store, { todos, loading: false });
            },
            async addTodo(title: string) {
                const todo = await todosService.addTodo({
                    title,
                    completed: false
                })
                patchState(store, (state) => ({
                    todos: [...state.todos, todo]
                }))
            },
            async delTodo(id: string) {
                await todosService.delTodo(id);
                patchState(store, (state) => ({
                    todos: state.todos.filter((todo) => todo.id !== id)
                }))
            },
            async updateTodo(id: string, completed: boolean) {
                await todosService.updateTodo(id, completed);
                patchState(store, (state) => ({
                    todos: state.todos.map((todo) => 
                        todo.id == id ? { ...todo, completed } : todo)
                    })
                )
            },
            updateFilter (filter: TodosFilter) { 
                patchState(store, {todosFilter: filter})
            },

        })
    ),

    withComputed((state) => ({
        filteredTodos: computed(() => {
            const todos = state.todos()
            switch (state.todosFilter()) {
                case 'all':
                    return todos;
                case 'completed':
                    return todos.filter((todo) => todo.completed )
                case 'pending':
                    return todos.filter((todo) => !todo.completed)    
            }
        }),

    }))

);