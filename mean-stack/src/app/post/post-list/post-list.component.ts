import { Component, OnInit, OnDestroy } from "@angular/core";
import { PostModel } from "../post.model";
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";
import { BroadcasterService } from "../broadcast.service";
import { ParamMap } from "@angular/router";
import { PageEvent } from "@angular/material";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: PostModel[] = [];
  postsSubscriber: Subscription;
  totalPost: number = 0;
  currentPage: number = 1;
  postPerPage: number = 2;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(
    public postService: PostsService,
    private eventBus: BroadcasterService
  ) {}

  ngOnInit() {
    this.getPosts();
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.eventBus.on("postData").subscribe((post: PostModel) => {
      this.posts = [...this.posts, post];
    });
  }

  ngOnDestroy() {
    this.postsSubscriber.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.getPosts();
  }

  getPosts() {
    this.postsSubscriber = this.postService
      .getPosts(this.postPerPage, this.currentPage)
      .subscribe(postData => {
        this.totalPost = postData.maxPosts;
        this.posts = postData.posts;
      });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(data => {
      this.getPosts();
     // const updatedPosts = this.posts.filter(post => post.id !== data.id);
     // this.posts = updatedPosts;
    });
  }
}
