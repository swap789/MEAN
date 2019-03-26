import { Injectable } from "@angular/core";
import { PostModel } from "./post.model";
import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PostsService {
  private posts: PostModel[] = [];
  private postUpdated = new Subject<PostModel[]>();

  constructor(private http: HttpClient) {}

  getPosts(postPerPage: number, currentPage: number): Observable<any> {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            message: postData.message,
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      );
  }

  onChangePage() {}

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    return this.http.post("http://localhost:3000/api/posts", postData);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: PostModel | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    //  const post: PostModel = { id: id, title: title, content: content };
    return this.http.put("http://localhost:3000/api/posts/" + id, postData);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }

  getPost(id: string): Observable<any> {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>("http://localhost:3000/api/posts/" + id);
  }
}
