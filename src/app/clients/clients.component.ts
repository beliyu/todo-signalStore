import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsStore } from './client.store';
import { MatTableModule } from '@angular/material/table';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AreYouSureComponent } from './are-you-sure/are-you-sure.component';
import { MatButtonModule } from '@angular/material/button';
import { Dialog1 } from './dialog-1/dialog-1.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule, DatePipe,
    ReactiveFormsModule, MatInputModule, MatTooltipModule, MatButtonModule, MatPaginatorModule,],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  dialog = inject(MatDialog);
  store = inject(ClientsStore);

  filterGroup: FormGroup;
  docLen = 0;
  pageSize = 5;
  pageIndex = 0;

  data = computed(() => {
    const start = this.store.page.pageSize() * this.store.page.pageIndex()
    return this.store.filteredClients().slice(start, start + this.store.page.pageSize())
  })
  displayedColumns: string[] = [
    'name',
    'surname',
    'email',
    'role',
    'lastSeen',
    'actions',
  ];

  constructor() {
    this.filterGroup = new FormGroup({
      name: new FormControl('',),
      email: new FormControl('',),
      role: new FormControl('',),
    });
  }

  ngOnInit(): void {
    this.store.loadAll();
  }

  deleteCms(id: string) {
    console.groupCollapsed('delete client ', id)
    const dialogRef = this.dialog.open(AreYouSureComponent, {
      panelClass: ['are-you-sure-modal']
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.store.delClients(id);
      }
    })
  }

  openDialogCms1(m: string, el: any): void {
    const dialogRef = this.dialog.open(Dialog1, {
      width: '500px',
      data: {
        "meth": m,
        "el": el
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog 1 was closed - ', result);
      }
    });
  }


  filterDS() {
    const fil = {
      name: this.filterGroup.controls['name'].value.toLowerCase(),
      email: this.filterGroup.controls['email'].value.toLowerCase(),
      role: this.filterGroup.controls['role'].value,
    };
    this.store.setFilter(fil);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.store.setPage({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    })
  }
}
