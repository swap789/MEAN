import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { PostModel } from "../post.model";
import { PostsService } from "../posts.service";
import { BroadcasterService } from "../broadcast.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  mode: string;
  postId: string;
  post: PostModel;
  isLoadling: boolean = false;
  form: FormGroup;
  imagePreview: string;

  constructor(
    public postService: PostsService,
    public eventBus: BroadcasterService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.createNewForm();
    this.getParams();
  }

  createNewForm() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  getParams() {
    this.activateRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.getPost();
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === "create") {
      this.addPost();
    } else {
      this.updatePost();
    }
  }

  setPost(postData) {
    console.log(postData);
    let newPost: PostModel = {}; // = new Object();
    newPost["id"] = postData.id;
    newPost["title"] = postData.title;
    newPost["content"] = postData.content;
    newPost["imagePath"] = postData.imagePath;
    this.eventBus.broadcast("postData", newPost);
  }

  addPost() {
    const post = {
      title: this.form.value.title,
      content: this.form.value.content
    };
    if (this.isLoadling) {
      return;
    }
    this.isLoadling = true;

    this.postService
      .addPosts(post.title, post.content, this.form.value.image)
      .subscribe((response: any) => {
        // this.isLoadling = false;
        // this.setPost(response.post);
        // this.form.reset();
        this.router.navigate(["/list"]);
      });
  }
  updatePost() {
    if (this.isLoadling) {
      return;
    }
    this.isLoadling = true;
    this.postService
      .updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
      .subscribe(result => {
        // this.isLoadling = false;
        // this.form.reset();
        this.router.navigate(["/list"]);
      });
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe(postData => {
      this.setUpdate(postData);
    });
  }

  setUpdate(postData) {
    const post = {
      id: postData._id,
      title: postData.title,
      content: postData.content,
      imagePath: postData.imagePath
    };
    this.post = post;
    this.form.setValue({
      title: post.title,
      content: post.content,
      image: postData.imagePath
    });
  }
}
