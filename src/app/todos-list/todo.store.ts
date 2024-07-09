import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Todo } from "../todos-list/todo.model";
import { TodoService } from "../services/todo.service";
import { computed, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";

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
                const todos = await firstValueFrom(todosService.getTodos())
                patchState(store, { todos, loading: false })
            },
            async addTodo(title: string) {
                const todo = await firstValueFrom(todosService.addTodo({
                    title,
                    completed: false
                }));
                patchState(store, (state) => ({
                    todos: [...state.todos, todo]
                }))
            },
            async delTodo(id: string) {
                const delTodo = await firstValueFrom(todosService.delTodo(id));
                if (delTodo) {
                    patchState(store, (state) => ({
                        todos: state.todos.filter((todo) => todo.id !== id)
                    }))
                }
            },
            async updateTodo(id: string, completed: boolean) {
                const updTodo = await firstValueFrom( todosService.updateTodo(id, completed));
                if (updTodo) {
                    patchState(store, (state) => ({
                        todos: state.todos.map((todo) =>
                            todo.id == id ? { ...todo, completed } : todo)
                    })
                    )
                }
            },

            updateFilter(filter: TodosFilter) {
                patchState(store, { todosFilter: filter })
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
                    return todos.filter((todo) => todo.completed)
                case 'pending':
                    return todos.filter((todo) => !todo.completed)
            }
        }),

    }))

);