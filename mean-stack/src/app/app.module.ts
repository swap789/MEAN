import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { PostListComponent } from './post/post-list/post-list.component';
import { DemoMaterialModule } from './material.module';
import { HeaderComponent } from './header/header.component';
import { PostsService } from './post/posts.service';
import { HttpClientModule } from '@angular/common/http';
import { BroadcasterService } from './post/broadcast.service';
import { AppRoutingModule } from './app-routing.module';
//import { PostCreateComponent } from "./post/post-create/post-create.component";

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    PostListComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    DemoMaterialModule, FormsModule, HttpClientModule, AppRoutingModule
  ],
  providers: [PostsService, BroadcasterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
