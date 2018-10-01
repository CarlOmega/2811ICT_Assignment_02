import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private api:string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) { }

  imgupload(formData) {
    return this.http.post(this.api + 'upload', formData);
  }
}
