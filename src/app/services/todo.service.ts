import { Injectable, inject } from "@angular/core";
import { Todo } from "../model/todo.model";
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs";
import { ErrorHandlingService } from "./error-handling.service";

@Injectable({ providedIn: 'root' })

export class TodoService {
    http = inject(HttpClient)
    errorService = inject(ErrorHandlingService)


    getTodos() {
        return this.http.get<Todo[]>(`/api/todos`).pipe(
            catchError(this.errorService.handleError))
    }

    addTodo(todo: Partial<Todo>) {
        return this.http.post<Todo>('/api/todos', todo).pipe(
            catchError(this.errorService.handleError))
    }

    delTodo(id: string) {
        return this.http.delete<Todo>(`/api/todos/${id}`).pipe(
            catchError(this.errorService.handleError))
    }

    updateTodo(id: string, completed: boolean) {
        return this.http.patch<Todo>(`/api/todos/${id}`, { "completed": completed }).pipe(
            catchError(this.errorService.handleError))
    }
}
