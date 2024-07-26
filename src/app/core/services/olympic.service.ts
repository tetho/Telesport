import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Country } from '../models/Olympic';
import { MedalsByCountry } from '../models/MedalsByCountry';

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
    return this.olympics$.asObservable().pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gets the list of countries
   * @returns 
   */
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gets the number of countries
   * @returns 
   */
  getNumberOfCountries(): Observable<number> {
    return this.getCountries().pipe(
      map(countries => countries.length),
      catchError(this.handleError)
    );
  }

  /**
   * Gets the number of medals by country
   * @returns 
   */
  getMedalsByCountry(): Observable<MedalsByCountry[]> {
    return this.getCountries().pipe(
      map(countries => {
        return countries.map(country => ({
          name: country.country,
          value: country.participations.reduce((total, participation) => total += participation.medalsCount, 0),
          id: country.id
        }));
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gets the details of a country
   * @param countryId 
   * @returns 
   */
  getCountryById(countryId: number): Observable<Country> {
    return this.getCountries().pipe(
      mergeMap(countries => {
        const country = countries.find(country => country.id === countryId);
        if (country) {
          return of(country);
        } else {
          return throwError(() => new Error('Country not found'));
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gets the total number of medals by country
   * @param countryId 
   * @returns 
   */
  getTotalNumberOfMedalsByCountry(countryId: number): Observable<number> {
    return this.getCountries().pipe(
      map(countries => {
        const country = countries.find(country => country.id === countryId);
        if (country) {
          return country.participations.reduce((total, participation) => total + participation.medalsCount, 0);
        } else {
          return 0;
        }
      }),
      catchError(this.handleError)
    )
  }

  /**
   * Gets the total number of athletes by country
   * @param countryId 
   * @returns 
   */
  getTotalNumberOfAthletesByCountry(countryId: number): Observable<number> {
    return this.getCountries().pipe(
      map(countries => {
        const country = countries.find(country => country.id === countryId);
        if (country) {
          return country.participations.reduce((total, participation) => total + participation.athleteCount, 0);
        } else {
          return 0;
        }
      }),
      catchError(this.handleError)
    )
   }

   /**
    * Handles error
    * @param error 
    * @returns 
    */
   private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      if (!navigator.onLine) {
        errorMessage = 'No Internet Connection';
      } else {
        errorMessage = `An error occurred: ${error.error.message}`;
      }
    } else {
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
