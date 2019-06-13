import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {
  id: number;
  photoInfo:any;
  tags;
  sub;
  userIcon;
  aboutUser;
  text;
  page;
  comments;

  toggleLoading = true;

  constructor(private route: ActivatedRoute,
  private photoService: PhotoService,
   private router: Router,
   private sanitizer:DomSanitizer) {
     
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
       this.id = +params['id'];

       this.toggleLoading = true;
       this.getPhotoInfo(this.id);
    });
    this.route.queryParams.subscribe(params => {
       this.text = params['text'];
       this.page = +params['page'];
    });
  }

  getPhotoInfo(id){
    this.photoService.getPhotoInfo(id).subscribe(
        (result:any)=> {
          console.log(result)
          this.photoInfo = result;
          this.tags = this.photoInfo.tags.tag;
          this.photoInfo.dates.lastupdate = this.convertUnixtoDate(this.photoInfo.dates.lastupdate);
          this.photoInfo.dates.posted = this.convertUnixtoDate(this.photoInfo.dates.posted);
          this.photoInfo.dateuploaded = this.convertUnixtoDate(this.photoInfo.dateuploaded);
          this.photoInfo.description._content = this.sanitizer.bypassSecurityTrustHtml(this.photoInfo.description._content);

          this.getUserIcon(this.photoInfo.owner.nsid);
          this.getComments(this.photoInfo.id);
              
        },
        error =>{
          console.log(error)
        },
        ()=>{
          this.toggleLoading = false;
        },
      )
  }

  getUserIcon(id){
    this.photoService.searchUser(id).subscribe(val=> {
      this.userIcon = val.userPhotoLink;
    });
  }

  goBack() {
    this.router.navigate(['/search'], { queryParams: { text: this.text, page: this.page } });
  }

  getComments(id){
    this.photoService.getComments(id).subscribe(val=> {
      this.comments = val;
      console.log('comments',this.comments)
    });
  }

  convertUnixtoDate(unix){
    const date = new Date(unix*1000);
    return date.getMonth()+"/"+date.getDate()+"/"+date.getFullYear();
  }

}