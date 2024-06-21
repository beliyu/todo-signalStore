import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    snackbar = inject(MatSnackBar)

    constructor(    ) { }

    showSnackbar(message: string, action: boolean, duration: number) {
        const actionButtonLabel = 'Close';
        action = true;
        duration = duration >= 500 ? duration : 1000;
        this.snackbar.open(message, action ? actionButtonLabel : undefined,
            {
                duration,
                horizontalPosition: 'center',
                panelClass: ['custom-snackbar']
            });
    }

}