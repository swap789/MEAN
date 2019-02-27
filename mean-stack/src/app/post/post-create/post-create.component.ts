import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from "@angular/forms";
import { PostModel } from "../post.model";
import { PostsService } from '../posts.service';
import { BroadcasterService } from '../broadcast.service';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  mode: string;
  postId: string;
  post: PostModel;

  constructor(public postService: PostsService,
    public eventBus: BroadcasterService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.activateRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.post = this.getPost();
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    })
  }

  onSave(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const post = {
      title: form.value.title,
      content: form.value.content
    }
    this.postService.addPosts(post.title, post.content)
      .subscribe((response: any) => {
        console.log(response);
        this.setPost(response.post);
      });
    form.resetForm();
  }

  setPost(post) {
    let newPost: PostModel = {};// = new Object();
    newPost['id'] = post._id;
    newPost['title'] = post.title;
    newPost['content'] = post.content;
    this.eventBus.broadcast('postData', newPost);
  }

  getPost() {
    const posts = this.postService.post;
    return posts.find(post => post.id === this.postId);
  }
}
