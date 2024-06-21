import { Routes } from '@angular/router';
import { TodosListComponent } from './todos-list/todos-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todos', pathMatch: 'full' }, //default route
  { path: 'todos', component: TodosListComponent },
  {
    path: 'clients',
    loadComponent: () => 
        import('./clients/clients.component')
            .then(m => m.ClientsComponent)
},
];
