import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from 'src/app/core/services/user.service';
import { RequestType } from 'src/app/core/services/request.service';

@Component({
  selector: 'app-transfer-dialog',
  template: `
    <h2 mat-dialog-title>Chuyển giao/Tạo đề nghị</h2>
    <mat-dialog-content [formGroup]="form">
      <p>Chọn đơn vị/người nhận để gửi khí tài.</p>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Đơn vị nhận</mat-label>
        <mat-select formControlName="toUserId">
          <mat-option *ngFor="let user of users" [value]="user.id">
            {{user.fullName}} ({{user.username}})
          </mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Loại đề nghị</mat-label>
        <mat-select formControlName="requestType">
          <mat-option [value]="0">Mượn</mat-option>
          <mat-option [value]="1">Sửa chữa</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Lý do</mat-label>
        <textarea matInput formControlName="reason" rows="3"></textarea>
      </mat-form-field>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Hủy</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Gửi đề nghị</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 8px; }
  `]
})
export class TransferDialogComponent {
  form: FormGroup;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<TransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      toUserId: ['', Validators.required],
      requestType: [0, Validators.required],
      reason: ['', Validators.required]
    });

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(users => {
      // Exclude current owner (data.ownerId)
      this.users = users.filter(u => u.id !== this.data.ownerId);
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
