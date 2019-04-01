import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/signup/sign-up.component';
import { AuthGuardService } from './auth/auth-guard.service';

const routes: Routes = [
    {
        path: 'create',
        component: PostCreateComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'list',
        component: PostListComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignUpComponent
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
    providers: [AuthGuardService],
    declarations: [],
})
export class AppRoutingModule { }