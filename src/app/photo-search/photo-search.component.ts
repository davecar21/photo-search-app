import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-search',
  templateUrl: './photo-search.component.html',
  styleUrls: ['./photo-search.component.css']
})
export class PhotoSearchComponent implements OnInit {
  searchForm = new FormGroup({
    textField: new FormControl('')
  });

  curentText;
  curPage = 1;
  page;
  numPage = [];
  lastPage;
  text: string;
  photoData;
  toggleLoading = false;
  noPhotoFound = false;
  searchBtnText = "SEARCH";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private photoService: PhotoService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.text = params['text'];
      if (this.text) this.searchForm.patchValue({ 'textField': this.text });
      if (params['page']) this.page = +params['page'];
      this.curPage = this.page;

      this.router.navigate(['/search'], { queryParams: { text: this.text, page: this.page } });
      if (this.page) {
        if(this.text) this.searchBtnText = "Searching...";
        this.searchText(this.page);
      } else {
        this.searchText();
      }

    });
  }

  formSubmit() {
    this.curentText = this.searchForm.value.textField;
    this.router.navigate(['/search'], { queryParams: { text: this.curentText, page: 1 } });
    this.curentText = "";
    if (this.page != 1) {
      this.numPage = [];
    }
  }

  searchText(page = 1) {
    this.curPage = page;
    this.toggleLoading = true;
    if (this.text) {
      this.photoService.searchPhoto(this.text, page).subscribe(
        result => {
          this.page = result.page;
          this.photoData = result.photo;
          this.lastPage = result.pages;
          if (result.total == "0") {
            this.noPhotoFound = true;
          } else {
            this.noPhotoFound = false;
          }
          if (this.lastPage < page) {
            this.curPage = 1;
            this.page = 1;
            this.router.navigate(['/search'], { queryParams: { text: this.text, page: this.curPage } });
          }
          this.initializePage(page);
        },
        error => {

          console.log('GetPhotosError:', error)
        },
        () => {
          this.toggleLoading = false;
          this.searchBtnText = "SEARCH";
        },
      );
    }
  }

  goToBtnPage(id) {
    this.router.navigate(['/search'], { queryParams: { text: this.text, page: id } });
  }

  goToNextPage() {
    this.curPage += 1;
    this.router.navigate(['/search'], { queryParams: { text: this.text, page: this.curPage } });
  }

  goToPrevPage() {
    if (this.curPage != 1) {
      this.curPage -= 1;
      this.router.navigate(['/search'], { queryParams: { text: this.text, page: this.curPage } });
    }
  }


  initializePage(page) {
    if (this.lastPage < page) {
      this.curPage = 1;
    }
    if (this.numPage.length == 0) {
      this.createPage();
    } else {
      if (
        this.curPage < this.numPage[0] ||
        this.numPage[0] == this.curPage ||
        this.numPage[this.numPage.length -1] == page ||
        (this.numPage[0] - 1) == this.curPage
      ) {
        this.numPage = [];
        this.createPage();
      }
    }
  }

  createPage() {
    for (let p = 0; p < 10; p++) {
      this.numPage.push(this.curPage + p);
    }
  }

  showInfo(id) {
    this.router.navigate(['/info', id], { queryParams: { text: this.text, page: this.page } });
  }


}