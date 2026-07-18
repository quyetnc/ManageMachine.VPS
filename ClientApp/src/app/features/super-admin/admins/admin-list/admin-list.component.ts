import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { AdminSummary } from 'src/app/core/models/admin-summary.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDetailDialogComponent } from '../admin-detail-dialog/admin-detail-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  admins: AdminSummary[] = [];
  displayedColumns: string[] = ['id', 'username', 'fullName', 'email', 'userCount', 'machineCount', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins() {
    this.userService.getAdmins().subscribe({
      next: (data: AdminSummary[]) => this.admins = data,
      error: (err: any) => {
        console.error(err);
        this.snackBar.open('Failed to load admins', 'Close', { duration: 3000 });
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(AdminDetailDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadAdmins();
      }
    });
  }

  openEditDialog(admin: AdminSummary) {
    const dialogRef = this.dialog.open(AdminDetailDialogComponent, {
      width: '500px',
      data: admin
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadAdmins();
      }
    });
  }

  deleteAdmin(admin: AdminSummary) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Admin',
        message: `Are you sure you want to delete Admin "${admin.username}"? This may delete all their data.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.delete(admin.id).subscribe({
          next: () => {
            this.snackBar.open('Admin deleted', 'Close', { duration: 3000 });
            this.loadAdmins();
          },
          error: (err: any) => {
            this.snackBar.open('Failed to delete admin: ' + (err.error?.message || err.message), 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
