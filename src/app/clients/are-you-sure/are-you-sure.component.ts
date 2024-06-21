import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-are-you-sure',
  standalone: true,
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.scss'],
  imports: [ MatIconModule, MatButtonModule],
})
export class AreYouSureComponent {
  readonly dialogRef = inject(MatDialogRef<AreYouSureComponent>);
  readonly data = inject<boolean>(MAT_DIALOG_DATA);

  constructor() { }

  confirm() {
    this.dialogRef.close(true);
  }
  
  reject() {
    this.dialogRef.close(false);
  }
}
