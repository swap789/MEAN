import { Injectable } from '@angular/core';
import { PostModel } from './post.model';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PostsService {

    private posts: PostModel[] = [];
    private postUpdated = new Subject<PostModel[]>();

    constructor(private http: HttpClient) { }

    get post() {
        return this.posts;
    }

    set post(posts: PostModel[]) {
        this.posts = posts;
    }
    getPosts(): Observable<any> {
        return this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
            .pipe(map((postData) => {
                return {
                    message: postData.message,
                    posts: postData.posts.map(post => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id
                        }
                    })
                }
            }));
    }

    addPosts(title: string, content: string) {
        const post: any = { title: title, content: content }
        return this.http.post('http://localhost:3000/api/posts', post);
        //  this.posts.push(post);
        //this.postUpdated.next([...this.posts]);
    }

    deletePost(postId: string): Observable<any> {
        return this.http.delete('http://localhost:3000/api/posts/' + postId);
    }

    getPost(id: string) {
        return
    }
}