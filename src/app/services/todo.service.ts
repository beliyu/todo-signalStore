import { Injectable } from "@angular/core";
import { TODOS, Todo } from "../model/todo.model";

@Injectable({providedIn: 'root'})

export class TodoService {
    async getTodos() {
        await sleep(500);
        return TODOS;
    }
    async addTodo(todo: Partial<Todo>) {
        await sleep(500)
        return {
            id: Math.random().toString().substring(2, 5),
            ... todo
        } as Todo
    }
    async delTodo(id:string) {
        await sleep(500)
    }
    async updateTodo(id: string, completed: boolean) {
        await sleep(500)
    }
}

async function  sleep (ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms))
};