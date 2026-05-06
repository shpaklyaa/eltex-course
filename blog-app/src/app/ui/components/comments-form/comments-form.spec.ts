import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsForm } from './comments-form';

describe('CommentsForm', () => {
  let component: CommentsForm;
  let fixture: ComponentFixture<CommentsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
