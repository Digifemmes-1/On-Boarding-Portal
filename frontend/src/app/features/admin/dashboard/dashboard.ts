import { Component } from '@angular/core';
import { PaginatedTable } from '../../../core/components/paginated-table/paginated-table';
import { PageQueryFn } from '../../../core/types/pagination';
import { Registration } from '../../../core/types/registration';
import { OnBoardingService } from '../../../core/services/onboarding.service';
import { ColumnConfig } from '../../../core/types/column-config';
import { Toolbar } from "../../../core/components/toolbar/toolbar";
import { FilterConfig } from '../../../core/types/table-filter';
import { RegistrationStatus } from '../../../core/types/registration-status';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../core/components/confirm-dialog/confirm-dialog';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-dashboard',
  imports: [PaginatedTable, Toolbar, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  constructor(
    private onBoardingService: OnBoardingService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly notificationService: NotificationService
  ) { }
  readonly columns: ColumnConfig[] = [
    {
      key: 'email',
      label: 'Adresse e-mail',
      type: 'text',
    },
    {
      key: 'status',
      label: 'Statut actuel',
      type: 'text',
      uppercase: true,
      getValue: (row) => ({"submitted":"Soumis","under_review":"En cours d'examen","action_required":"Action requise","active":"Actif","rejected":"Rejeté"})[row.status as string] || row.status.split("_").join(" ")
    },
    {
      key: 'createdAt',
      label: "Date d'inscription",
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm'
    },
    {
      key: 'updatedAt',
      label: 'Dernière mise à jour',
      type: 'date',
      dateFormat: 'dd/MM/yyyy HH:mm:ss'
    },
    {
      key: 'files',
      label: '# Files',
      type: 'number',
      getValue: (row) => row.files ? row.files?.length : 0
    },
    {
      key: 'delete',
      label: '',
      type: 'action',
      icon: 'delete',
      action: (row: Registration, reload) => {
        this.dialog.open(ConfirmDialog, {
          data: { title: "Supprimer l'inscription", message: `Êtes-vous sûr de vouloir supprimer l'inscription pour ${row.email} ? Cette action est irréversible.` }
        }).afterClosed().subscribe(confirmed => {
          if (confirmed) {
            this.onBoardingService.deleteAdminRegistration(row.id).subscribe({
              next: () => {
                this.notificationService.info('Inscription supprimée avec succès'),
                  reload()
              },
              error: (error) => {
                console.error("Error deleting registration", error);
                this.notificationService.error("Échec de la suppression de l'inscription");
              }
            });
          }
        });
      }
    }
  ];
  readonly filters: FilterConfig[] = [{
    key: 'status',
    label: 'Statut',
    type: 'enum',
    multiple: true,
    options: Object.keys(RegistrationStatus).map(key => ({
      label: ({"SUBMITTED":"SOUMIS","UNDER_REVIEW":"EN COURS D'EXAMEN","ACTION_REQUIRED":"ACTION REQUISE","ACTIVE":"ACTIF","REJECTED":"REJETÉ"})[key] || key.split("_").join(" "),
      value: String(RegistrationStatus[key as keyof typeof RegistrationStatus])
    }))
  }];

  fetchRegistrations: PageQueryFn<Registration> = (page: number, limit: number, filter: { [key: string]: any }) => {
    const { status } = filter
    return this.onBoardingService.getAdminRegistrations({ page, limit, status: status });
  };

  goToReview(event: Registration) {
    this.router.navigate([`/admin/${event.id}`])
  }
}
