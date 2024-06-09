import { Injectable } from "@angular/core";
import { TODOS } from "../model/todo.model";

@Injectable({providedIn: 'root'})

export class TodoService {
    async getTodos() {
        await sleep(1000);
        return TODOS;
    }



}

async function  sleep (ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms))
};