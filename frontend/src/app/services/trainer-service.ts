import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Trainer } from '../models/trainer';
import { Facility } from '../models/facility';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  uri = 'http://localhost:4000/trainers';

  private http = inject(HttpClient)
  
  getAllTrainers() {
    return this.http.get<Trainer[]>(`${this.uri}/getAllTrainers`);
  }

  updateTrainerStatus(t:Trainer){
    return this.http.post<String>(`${this.uri}/updateTrainerStatus`, t);
  }

  searchTrainers(fName: String, sport: String){
    const data = {
      facilityName: fName,
      sport: sport
    }
    console.log(fName)
    console.log(sport)
    return this.http.post<Trainer[]>(`${this.uri}/searchTrainers`, data);

  }

}
