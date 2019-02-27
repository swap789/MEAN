import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';

const routes: Routes = [
    {
        path: 'create',
        component: PostCreateComponent
    },
    {
        path: 'list',
        component: PostListComponent
    },
    {
        path: 'edit/:postId',
        component: PostCreateComponent
    },
    {
        path: '',
        redirectTo: '/list',
        pathMatch: "full"
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    declarations: [],
})
export class AppRoutingModule { }