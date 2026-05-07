import { Component, Inject, DestroyRef, inject, computed } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../../services/articles/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { Article } from '../../.././types/article';
import { Coment } from '../../.././types/coment';
import { Comment } from '../../components/comment/comment';
import { CommentsForm } from '../../components/comments-form/comments-form';
import { PostInteractionsStoreService } from '../../../services/comments/post-interactions-store.service';
import { PostInteractionsServiceImpl } from '../../../services/comments/post-interactions.service';
import { PostInteractionsService } from '../../../services/comments/post-interactions.interface';
import { POST_INTERACTIONS_SERVICE } from '../../../services/comments/post-interactions.token';

@Component({
  selector: 'app-post-page',
  imports: [CommentsForm,
    Comment ],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  providers: [
    { provide: ARTICLES_SERVICE, useClass: ArticlesServiceImpl },
    { provide: POST_INTERACTIONS_SERVICE, useClass: PostInteractionsServiceImpl }
  ],
})
export class PostPage {
  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    @Inject(POST_INTERACTIONS_SERVICE) private postInteractionsService: PostInteractionsService,
    private route: ActivatedRoute,
    private store: ArticlesStoreService,
    private comsStore: PostInteractionsStoreService
  ) {}

  private destroyRef = inject(DestroyRef);

  article?: Article;
  comment?: Coment;

  comments = computed(() => {
    const articleId = this.route.snapshot.paramMap.get('id') || '';
    return this.comsStore._comments().filter(c => c.articleId === articleId);
  });

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';
    this.articlesService.getById(postId).subscribe((data) => {
      this.article = data;
    })
  }

  protected saveComment(commentData: Partial<Coment>): void {
    if ('id' in commentData && commentData.id != null) {
      const fullComment: Coment = {
        id: commentData.id!,
        articleId: commentData.articleId!,
        userName: commentData.userName ?? '',
        content: commentData.content ?? ''
      };
      this.postInteractionsService.update(fullComment).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          console.log('Обновлено');
        }
      });
    } else {
      const articleID = this.route.snapshot.paramMap.get('id') || '';
      const newComment = {
        articleId: articleID,
        userName: commentData.userName ?? '',
        content: commentData.content ?? ''
      };
      this.postInteractionsService.create(newComment).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          console.log('Комментарий добавлена:');
        },
      });
    }
  }

  protected deleteComment(id: string, articleId: string): void {
    this.postInteractionsService.delete(id, articleId).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      console.log('Удалено:', id);
    });
  }
}
