import { TestBed } from '@angular/core/testing';

import { ArticleMapper } from './article-mapper';

describe('ArticleMapper', () => {
  let service: ArticleMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleMapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
