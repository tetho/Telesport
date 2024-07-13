import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Country } from '../models/Olympic';
import { Participation } from '../models/Participation';

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
      map(x => x.length)
    );
  }

  getMedalsByCountry(): Observable<any[]> {
    return this.getCountries().pipe(
      map(countries => {
        return countries.map(x => ({
          name: x.country,
          value: x.participations.reduce((total, participation) => total += participation.medalsCount, 0),
          id: x.id
        }));
      })
    );
  }

  getCountryById(countryId: number): Observable<Country> {
    return this.getCountries().pipe(
      map(countries => countries.find(x => x.id === countryId)),
      filter(country => !!country)
    ) as Observable<Country>;
  }

  getTotalNumberOfMedalsByCountry(countryId: number): Observable<number> {
    return this.getCountries().pipe(
      map(countries => {
        const country = countries.find(x => x.id === countryId);
        if (country) {
          return country.participations.reduce((total, participation) => total + participation.medalsCount, 0);
        } else {
          return 0;
        }
      })
    )
  }

   getTotalNumberOfAthletesByCountry(countryId: number): Observable<number> {
    return this.getCountries().pipe(
      map(countries => {
        const country = countries.find(x => x.id === countryId);
        if (country) {
          return country.participations.reduce((total, participation) => total + participation.athleteCount, 0);
        } else {
          return 0;
        }
      })
    )
   }
}
