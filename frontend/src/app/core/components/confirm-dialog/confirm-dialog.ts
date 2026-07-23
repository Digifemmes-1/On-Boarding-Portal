import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  readonly title = this.data.title ?? 'Supprimer le fichier';
  readonly message = this.data.message ?? 'Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.';
  readonly confirmText = this.data.confirmText ?? 'Supprimer';
  readonly cancelText = this.data.cancelText ?? 'Annuler';

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
