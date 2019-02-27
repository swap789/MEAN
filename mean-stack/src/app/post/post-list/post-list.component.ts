import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostModel } from "../post.model";
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { BroadcasterService } from '../broadcast.service';
import { ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: PostModel[] = [];
  postsSubscriber: Subscription;
  constructor(public postService: PostsService, private eventBus: BroadcasterService) { }

  ngOnInit() {
    this.getPosts();
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.eventBus.on('postData').subscribe((post: PostModel) => {
      this.posts = [...this.posts, post];
      console.log(this.posts);
      //this.posts.push(post);
    })
  }

  ngOnDestroy() {
    this.postsSubscriber.unsubscribe();
  }

  getPosts() {
    // this.posts = this.postService.getPosts();
    this.postsSubscriber = this.postService.getPosts()
      .subscribe((postData) => {
        console.log(postData);
        //console.log(response);
        this.posts = postData.posts;
        this.postService.post = this.posts;
      })
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(data => {
      const updatedPosts = this.posts.filter(post => post.id !== data.id);
      this.posts = updatedPosts;
      console.log(data);
    })
  }
}
