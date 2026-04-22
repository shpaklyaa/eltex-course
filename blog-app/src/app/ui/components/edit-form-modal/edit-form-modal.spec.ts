import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFormModal } from './edit-form-modal';

describe('EditFormModal', () => {
  let component: EditFormModal;
  let fixture: ComponentFixture<EditFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
