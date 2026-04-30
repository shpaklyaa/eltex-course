import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsHome } from './posts-home';

describe('PostsHome', () => {
  let component: PostsHome;
  let fixture: ComponentFixture<PostsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsHome],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
