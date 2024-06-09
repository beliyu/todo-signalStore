import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosStore } from './store/todo.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  store = inject(TodosStore);

  ngOnInit(): void {
    this.loadTodos().then(() => {console.log('Evo ga ...')})
  }

  async loadTodos () {
    await this.store.loadAll()
  }
}
