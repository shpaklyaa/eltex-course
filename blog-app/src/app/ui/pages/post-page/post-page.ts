import { Component, Inject, DestroyRef, inject, computed, signal, effect } from '@angular/core';
import { filter } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { IArticlesService } from '../../../services/articles/articles-service.interface';
import { ArticlesStoreService } from '../../../services/articles/articles-store.service';
import { ArticlesServiceImpl } from '../../../services/articles/articles.service';
import { ARTICLES_SERVICE } from '../../../services/articles/articles-service.token';
import { Article } from '../../.././types/article';
import { Coment } from '../../.././types/coment';
import { Comment } from '../../components/comment/comment';
import { CommentsForm } from '../../components/comments-form/comments-form';
import { PostInteractionsStoreService } from '../../../services/comments/post-interactions-store.service';
import { PostInteractionsServiceImpl } from '../../../services/comments/post-interactions.service';
import { IPostInteractionsService } from '../../../services/comments/post-interactions.interface';
import { POST_INTERACTIONS_SERVICE } from '../../../services/comments/post-interactions.token';
import { HttpPostInteractionsServiceImpl } from '../../../services/comments/http.post-interactions.service';
import { GqlService } from '../../../services/comments/graphql.service'
import { WebSocketIoService } from '../../../services/websocket/websocket.io.service';
import { HasRoleDirective } from '../../../directives/has-role.directive';
import { WEB_SOCKET_SERVICE } from '../../../services/websocket/websocket.token';
import { MockWsService} from '../../../services/websocket/websocket.Lc.service';
import { IWebsocketConnectService } from '../../../services/websocket/websocket-connect.service.interface';
import { environment } from '../../../../environments/environment.development';
import { AUTH_SERVICE } from '../../../services/auth/auth-service.token';
import { IAuthService } from '../../../services/auth/auth.service.interface';

@Component({
  selector: 'app-post-page',
  imports: [CommentsForm,
    Comment, HasRoleDirective ],
  templateUrl: './post-page.html',
  styleUrl: './post-page.scss',
  providers: [
    { provide: POST_INTERACTIONS_SERVICE, useClass: environment.useLcService ? PostInteractionsServiceImpl : GqlService },
    { provide: WEB_SOCKET_SERVICE, useClass: environment.useLcService ? MockWsService : WebSocketIoService },
  ],
})
export class PostPage {
  private destroyRef = inject(DestroyRef);
  private commentsSignal = signal<Coment[]>([]);
  private isLocalCreate = false;
  isLoggedIn = signal(false);
  
  constructor(
    @Inject(ARTICLES_SERVICE) private articlesService: IArticlesService,
    @Inject(POST_INTERACTIONS_SERVICE) private postInteractionsService: IPostInteractionsService,
    @Inject(WEB_SOCKET_SERVICE) private ws: IWebsocketConnectService,
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    private route: ActivatedRoute,
    private comsStore: PostInteractionsStoreService,
  ) {
      effect(() => {
        this.isLoggedIn.set(this.authService.isLoggedIn());
      });
    }

  article = signal<Article | undefined>(undefined);
  
  comments = this.commentsSignal;
  
  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';
    console.log('[PostPage] INIT', this.articleId, 'instance:', this);
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

    this.ws.subscribeToArticle(postId);

    this.ws.getCommentCreated()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (!data || typeof data !== 'object') {
          console.warn('[PostPage] Пропущен некорректный комментарий:', data);
          return;
        }

        const raw = data as any;
        const id = raw.id || raw.commentId || raw._id;

        if (!id) {
          console.warn('[PostPage] Комментарий без идентификатора — пропущен:', data);
          return;
        }

        const normalized: Coment = {
          id: String(id),
          username: raw.username ?? 'Аноним',
          content: raw.content ?? '',
          articleId: raw.articleId ?? '',
          rating: raw.rating ?? undefined,
        };

        if (!this.commentsSignal().some(c => c.id === normalized.id)) {
          this.commentsSignal.update(comments => [...comments, normalized]);
          console.log('[PostPage] Добавлен комментарий:', normalized);
        }
    });

    this.ws.getCommentRatingChanged()
      .pipe(
        filter(data => data?.articleId === this.articleId),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        this.commentsSignal.update(comments =>
          comments.map(c =>
            c.id === data.commentId ? { ...c, rating: data.rating } : c
          )
        );
      });

    this.ws.getArticleRatingChanged()
      .pipe(
        filter(data => data?.articleId === this.articleId),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        this.article.update(article => {
          if (!article) return article;
          return { ...article, rating: data.rating };
        });
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
      this.isLocalCreate = true;
      this.postInteractionsService.create(newComment).pipe(
      takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (created) => {
          if (!this.commentsSignal().some(c => c.id === created.id)) {
            this.commentsSignal.update(comments => [...comments, created]);
            console.log('Комментарий добавлен:', created);
          }
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
      : '0⭐';
  }

  onArticleRatingChange(delta: 1 | -1): void {
    const method = delta === 1 
      ? this.postInteractionsService.updateArticleRatingUp(this.articleId)
      : this.postInteractionsService.updateArticleRatingDown(this.articleId);

    method.subscribe({
      next: (updated) => {
        this.article.set(updated);
      },
      error: (err) => {
        console.error('Ошибка изменения рейтинга статьи', err);
      }
    });
  }


  ngOnDestroy(): void {
    const postId = this.route.snapshot.paramMap.get('id') || '';
    this.ws.unsubscribeFromArticle(postId);
    console.log('[PostPage] DESTROY', this.articleId);
  }
}
