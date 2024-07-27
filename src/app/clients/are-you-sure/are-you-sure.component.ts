import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-are-you-sure',
  standalone: true,
  templateUrl: './are-you-sure.component.html',
  styleUrls: ['./are-you-sure.component.scss'],
  imports: [MatIconModule, MatButtonModule],
})
export class AreYouSureComponent {
  readonly dialogRef = inject(MatDialogRef<AreYouSureComponent>);

  confirm() {
    this.dialogRef.close(true);
  }

  reject() {
    this.dialogRef.close(false);
  }
}
