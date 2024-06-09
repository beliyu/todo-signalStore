import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Todo } from "../model/todo.model";
import { TodoService } from "../services/todo.service";
import { inject } from "@angular/core";

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
    {providedIn: 'root'},
    withState(inicialState),
    withMethods( 
        (store, todosService = inject(TodoService)) => ({
            async loadAll () {
                patchState(store, {loading: true});
                const todos = await todosService.getTodos();
                patchState(store, {todos, loading:false});
            }   
                
        }) 
    )

);