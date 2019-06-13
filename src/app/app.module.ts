import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { PhotoService } from './photo.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { PhotoSearchComponent } from './photo-search/photo-search.component';

const appRoutes: Routes = [
  { path: 'info/:id', component: PhotoDetailComponent },
  { path: 'search', component: PhotoSearchComponent },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  declarations: [AppComponent, PageNotFoundComponent, PhotoDetailComponent, PhotoSearchComponent],
  bootstrap: [AppComponent],
  providers: [PhotoService]
})
export class AppModule { }
