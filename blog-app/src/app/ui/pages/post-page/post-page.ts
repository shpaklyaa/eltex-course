import { Component, Inject, DestroyRef, inject, computed, signal, effect } from '@angular/core';
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
import { HttpPostInteractionsServiceImpl } from '../../../services/comments/http.post-interactions.service';

@Component({
  selector: 'app-post-page',
  imports: [CommentsForm,
    Comment ],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  providers: [
    // { provide: POST_INTERACTIONS_SERVICE, useClass: HttpPostInteractionsServiceImpl }
    { provide: POST_INTERACTIONS_SERVICE, useClass: PostInteractionsServiceImpl }
  ],
})
export class PostPage {
  private destroyRef = inject(DestroyRef);
  private commentsSignal = signal<Coment[]>([]);

  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: ArticlesService,
    @Inject(POST_INTERACTIONS_SERVICE) private postInteractionsService: PostInteractionsService,
    private route: ActivatedRoute,
    private comsStore: PostInteractionsStoreService
  ) {

    }

  article = signal<Article | undefined>(undefined);
  
  comments = this.commentsSignal;
  
  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';

    this.articlesService.getById(postId).subscribe({
      next: (data) => {
        this.article.set(data);
      }
    });

    this.postInteractionsService.getCommentsForArticle(postId).subscribe({
      next: (comments: Coment[]) => {
        this.comsStore.updateComments(comments);
        this.commentsSignal.set(comments.filter(c => c.articleId === postId));
      },
      error: (err) => {
        console.error('Failed to load comments', err);
      }
    });
  }

  protected saveComment(commentData: Partial<Coment>): void {
    if ('id' in commentData && commentData.id != null) {
      const fullComment: Coment = {
        id: commentData.id!,
        articleId: commentData.articleId!,
        username: commentData.username || 'Аноним',
        content: commentData.content || 'Без текста',
        rating: commentData.rating,
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
        username: commentData.username || 'Аноним',
        content: commentData.content || 'Без текста',
        rating: commentData.rating,
      };
      this.postInteractionsService.create(newComment).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (created) => {
          console.log('Комментарий добавлен:', created);
          this.commentsSignal.update(comments => [...comments, created]);
        },
      });
    }
  }

  get articleId(): string {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  protected deleteComment(id: string, articleId: string): void {
    this.postInteractionsService.delete(id, articleId).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      console.log('Удалено:', id);
    });
  }

  averageRating = computed(() => {
    const stats = this.comsStore.getRatingForArticle(this.articleId);
    return stats.average;
  });

  ratingCount = computed(() => {
    const stats = this.comsStore.getRatingForArticle(this.articleId);
    return stats.count;
  });

  getratingDisplay(): string {
    return this.ratingCount() > 0
      ? `⭐ ${this.averageRating()} (${this.ratingCount()})`
      : 'Без оценок';
  }

}
