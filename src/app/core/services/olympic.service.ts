import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Participation } from '../models/Participation';
import { Country } from '../models/Olympic';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<any>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl);
  }

  getNumberOfCountries(): Observable<number> {
    return this.getCountries().pipe(
      map(countries => countries.length)
    );
  }

  getParicipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(this.olympicUrl);
  }
}
