import { Component, effect, inject, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleChange, MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { TodosStore } from '../store/todo.store';
import { MatListModule } from '@angular/material/list'
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-todos-list',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonToggleModule, MatListModule, NgStyle],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.scss'
})
export class TodosListComponent {
  store = inject(TodosStore)
  filter = viewChild.required(MatButtonToggleGroup)

  constructor() {
    effect(() => {
      const filter = this.filter();
      filter.value = this.store.todosFilter();
    })
  }

  async onAddTodo(title: string) {
    await this.store.addTodo(title)
  }

  async onDelete(id: string, event: MouseEvent) {
    event.stopPropagation();
    await this.store.delTodo(id);
  }

  async onTodoToggle(id: string, completed: boolean) {
    this.store.updateTodo(id, completed);
  }

  onFilterChange(event: MatButtonToggleChange) {
    const filter = event.value
    this.store.updateFilter(filter)
  }
}
