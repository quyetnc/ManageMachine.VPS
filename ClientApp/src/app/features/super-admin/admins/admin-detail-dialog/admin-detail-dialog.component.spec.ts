import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailDialogComponent } from './admin-detail-dialog.component';

describe('AdminDetailDialogComponent', () => {
  let component: AdminDetailDialogComponent;
  let fixture: ComponentFixture<AdminDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDetailDialogComponent]
    });
    fixture = TestBed.createComponent(AdminDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
