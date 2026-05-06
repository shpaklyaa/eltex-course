import { Routes } from '@angular/router';
import { Home } from './ui/pages/home/home';
import { Blog } from './ui/pages/blog/blog';
import { PostPage } from './ui/pages/post-page/post-page';

export const routes: Routes = [
    {path: '', component: Home, title: 'Главная'},
    { path: 'blog', component: Blog, title: 'Блог' },
    { path: 'blog/post/:id', component: PostPage, title: 'Публикация' }
    // {
    //     path: 'blog', 
    //     component: Blog, 
    //     title: 'Блог',
    //     children: [
    //         {
    //             path: 'post/:id',
    //             component: PostPage,
    //             title: 'Публицация'
    //         }
    //     ]}
];