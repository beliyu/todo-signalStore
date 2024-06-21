import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { ClientsStore } from '../client.store';
// import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'dialog-1',
  standalone: true,
  templateUrl: './dialog-1.component.html',
  styleUrls: ['./dialog-1.component.scss'],
  imports: [MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule,
    ReactiveFormsModule, MatInputModule, MatButtonModule],
})
export class Dialog1 {
  readonly dialogRef = inject(MatDialogRef<Dialog1>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  readonly store = inject(ClientsStore);

  createPar = this.createForm();

  constructor() { }

  onNoClick(): void {
    this.dialogRef.close('');
  }

  save() {
    if (this.data.meth == 'Add') {
      this.store.addClient(this.createPar.value);
      this.dialogRef.close(true)
    } else {
          this.store.updateClient(this.data.el.id, this.createPar.value)
            this.dialogRef.close( true )
    }
  }

  createForm() {
    if (this.data.meth == 'Add') {
      return new UntypedFormGroup({
        name: new UntypedFormControl('', Validators.required),
        surname: new UntypedFormControl('', [Validators.required]),
        email: new UntypedFormControl('', [Validators.email, Validators.required]),
        password: new UntypedFormControl('', [Validators.minLength(5), Validators.required]),
        role: new UntypedFormControl('', [Validators.required]),
      });
    } else {
      return new UntypedFormGroup({
        name: new UntypedFormControl(this.data.el.name, Validators.required),
        surname: new UntypedFormControl(this.data.el.surname, [Validators.required]),
        email: new UntypedFormControl(this.data.el.email, [Validators.email, Validators.required]),
        password: new UntypedFormControl('', [Validators.minLength(5),Validators.required]),
        role: new UntypedFormControl(this.data.el.role, [Validators.required]),
      });
    }
  }

  getMet(m: string) {
    if (m == 'Add') {
      return 'Dodaj'
    } else {
      return 'Izmeni'
    }
  }

}