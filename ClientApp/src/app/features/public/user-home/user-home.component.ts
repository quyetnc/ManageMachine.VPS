import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineService, MachineType } from 'src/app/core/services/machine.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
    types: MachineType[] = [];
    loading = false;
    searchCode = '';
    isSearching = false;

    constructor(
        private machineService: MachineService,
        private router: Router,
        private authService: AuthService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.machineService.getMachineTypes().subscribe({
            next: (data) => {
                this.types = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load types', err);
                this.loading = false;
            }
        });
    }

    openType(typeId: number) {
        this.router.navigate(['/public/types', typeId]);
    }

    openScanner() {
        this.router.navigate(['/public/scan']);
    }

    openMyMachines() {
        this.router.navigate(['/public/my-machines']);
    }

    logout() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Confirm Logout',
                message: 'Are you sure you want to log out?',
                confirmText: 'Logout',
                cancelText: 'Cancel'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authService.logout();
            }
        });
    }

    openProfile() {
        this.router.navigate(['/public/profile']);
    }

    searchMachine() {
        if (!this.searchCode.trim()) return;

        this.isSearching = true;
        this.machineService.getMachineByCode(this.searchCode.trim()).subscribe({
            next: (machine) => {
                this.isSearching = false;
                this.router.navigate(['/public/machines', machine.id]);
            },
            error: (err) => {
                this.isSearching = false;
                // Ideally show a snackbar here, but alert is fine for now or handle in UI
                alert('Machine code not found!');
            }
        });
    }
}
