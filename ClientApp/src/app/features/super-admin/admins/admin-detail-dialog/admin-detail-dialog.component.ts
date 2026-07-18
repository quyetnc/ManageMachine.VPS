import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserRole } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-detail-dialog',
  templateUrl: './admin-detail-dialog.component.html',
  styleUrls: ['./admin-detail-dialog.component.scss']
})
export class AdminDetailDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<AdminDetailDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      username: [data?.username || '', Validators.required],
      fullName: [data?.fullName || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]
      ],
      role: [UserRole.Admin] // Enforce Admin role
    });

    if (this.isEditMode) {
      this.form.get('username')?.disable(); // Can't change username
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const formValue = this.form.getRawValue();

    // If edit mode and password is empty, don't send it (managed by separate reset)
    // Actually, update endpoint might normally not handle password. 
    // Let's assume UpdateUserDto handles basic info.

    if (this.isEditMode && this.data) {
      this.userService.update(this.data.id, formValue).subscribe({
        next: () => {
          this.snackBar.open('Admin updated', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Error: ' + err.error, 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.userService.create(formValue).subscribe({
        next: () => {
          this.snackBar.open('Admin created', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.snackBar.open('Error: ' + err.error, 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
