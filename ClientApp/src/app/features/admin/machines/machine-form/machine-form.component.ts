import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MachineService, MachineType } from 'src/app/core/services/machine.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.scss']
})
export class MachineFormComponent implements OnInit {
  machineForm: FormGroup;
  isEditMode = false;
  machineId: number | null = null;
  machineTypes: MachineType[] = [];
  users: User[] = [];
  loading = false;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private machineService: MachineService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.machineForm = this.fb.group({
      serialNumber: [''],
      name: ['', Validators.required],
      description: [''],
      imageUrl: [''],
      machineTypeId: ['', Validators.required],
      dateIssued: [new Date()], // Default to today
      userId: [null], // Owner
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loading = true;
      this.machineService.uploadImage(file).subscribe({
        next: (res) => {
          this.machineForm.patchValue({ imageUrl: res.url });
          this.imagePreview = res.url;
          this.loading = false;
        },
        error: (err) => {
          this.handleError('Failed to upload image', err);
          this.loading = false;
        }
      });
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.machineId = +id;
    }

    this.loadMasterData();
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Failed to load users', err)
    });
  }

  loadMasterData() {
    this.loading = true;
    this.machineService.getMachineTypes().subscribe({
      next: (types) => {
        this.machineTypes = types;
        if (this.isEditMode && this.machineId) {
          this.loadMachine(this.machineId);
        } else {
          this.loading = false;
        }
      },
      error: (err) => this.handleError('Failed to load machine types', err)
    });
  }

  loadMachine(id: number) {
    this.machineService.getMachine(id).subscribe({
      next: (machine) => {
        this.machineForm.patchValue({
          serialNumber: machine.serialNumber,
          name: machine.name,
          description: machine.description,
          imageUrl: machine.imageUrl,
          machineTypeId: machine.machineTypeId,
          dateIssued: machine.dateIssued,
          userId: machine.userId
        });

        this.imagePreview = machine.imageUrl;
        this.loading = false;
      },
      error: (err) => this.handleError('Failed to load machine details', err)
    });
  }

  onSubmit() {
    if (this.machineForm.invalid) return;

    this.loading = true;
    const formValue = this.machineForm.value;

    if (this.isEditMode && this.machineId) {
      this.machineService.updateMachine(this.machineId, formValue).subscribe({
        next: () => this.onSuccess('Machine updated successfully'),
        error: (err) => this.handleError('Failed to update machine', err)
      });
    } else {
      this.machineService.createMachine(formValue).subscribe({
        next: () => this.onSuccess('Machine created successfully'),
        error: (err) => this.handleError('Failed to create machine', err)
      });
    }
  }

  onSuccess(message: string) {
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.router.navigate(['/machines']);
  }

  handleError(message: string, err: any) {
    console.error(err);
    if (err.error && typeof err.error === 'string') {
      message = err.error;
    } else if (err.error && err.error.message) {
      message = err.error.message;
    }
    this.snackBar.open(message, 'Close', { duration: 5000 });
    this.loading = false;
  }
}
