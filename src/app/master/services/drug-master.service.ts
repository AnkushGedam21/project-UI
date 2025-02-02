import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DrugMaster } from '../model/DrugMaster';

@Injectable({
  providedIn: 'root',
})
export class DrugMasterService {
  constructor(private http: HttpClient) {}

  baseUrl: string = 'http://localhost:8083'; //usr api

  getDrugs() {
    return this.http.get<any>(this.baseUrl + `/drug/master/drugs`);
  }

  addNewDrug(newDrug: DrugMaster) {
    this.http
      .post(this.baseUrl + `/drug/master/save`, newDrug)
      .subscribe((data) => {
        console.log('data saved!');

        console.log(data);
      });
  }
}
