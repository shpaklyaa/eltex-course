import { Routes } from '@angular/router';
import { Home } from './ui/pages/home/home';
import { Blog } from './ui/pages/blog/blog';

export const routes: Routes = [
    {path: '', component: Home, title: 'Главная'},
    {path: 'blog', component: Blog, title: 'Блог'}
];