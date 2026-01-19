import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Parameter, MachineService } from 'src/app/core/services/machine.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'unit', 'description', 'actions'];
  dataSource: MatTableDataSource<Parameter>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private machineService: MachineService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.loadParameters();
  }

  loadParameters() {
    this.machineService.getParameters().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load parameters', 'Close', { duration: 3000 });
      }
    });
  }

  deleteParameter(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Parameter',
        message: 'Are you sure? This might affect machines using this parameter.',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.machineService.deleteParameter(id).subscribe({
          next: () => {
            this.snackBar.open('Parameter deleted', 'Close', { duration: 3000 });
            this.loadParameters();
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Failed to delete parameter.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
