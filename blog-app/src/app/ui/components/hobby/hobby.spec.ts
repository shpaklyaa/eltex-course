import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hobby } from './hobby';

describe('Hobby', () => {
  let component: Hobby;
  let fixture: ComponentFixture<Hobby>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hobby],
    }).compileComponents();

    fixture = TestBed.createComponent(Hobby);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
