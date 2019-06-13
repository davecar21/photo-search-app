import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment as env } from './environment';

@Injectable()
export class PhotoService {



  constructor( private http: HttpClient) {
  }

  searchPhoto(textData, page){
    return this.http.get(`${env.API_LINK}method=flickr.photos.search&api_key=${env.API_KEY}&text=${textData}&page=${page}&per_page=15&${env.JSONFormat}`).pipe(
      map((val:any) =>{
        val.photos.photo.map(val => val.photoLink = `https://farm${val.farm}.staticflickr.com/${val.server}/${val.id}_${val.secret}.jpg`);
        return val.photos;
      })
    );
  }

  getPhotoInfo(id){
    return this.http.get(`${env.API_LINK}method=flickr.photos.getInfo&api_key=${env.API_KEY}&photo_id=${id}&${env.JSONFormat}`).pipe(
      map((val:any) =>{
        val.photo.photoLink = `https://farm${val.photo.farm}.staticflickr.com/${val.photo.server}/${val.photo.id}_${val.photo.secret}.jpg`; 
        return val.photo;
      })
    );
  }

  searchUser(id){
    return this.http.get(`${env.API_LINK}method=flickr.people.getInfo&api_key=${env.API_KEY}&user_id=${id}&${env.JSONFormat}`).pipe(
      map((val:any) =>{
        val.person.userPhotoLink = `https://flickr.com/buddyicons/${val.person.nsid}.jpg`;
        return val.person;
      })
    );
  }

  getComments(id){
    return this.http.get(`${env.API_LINK}method=flickr.photos.comments.getList&api_key=${env.API_KEY}&photo_id=${id}&${env.JSONFormat}`).pipe(
      map((val:any) =>{
        return val.comments.comment;
      })
    );
  }

}