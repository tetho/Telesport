import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, of, Subscription } from 'rxjs';
import { MedalsByCountry } from 'src/app/core/models/MedalsByCountry';
import { Country } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<any> = of(null);
  countries: Country[] = [];
  numberOfCountries: number = 0;
  medalsByCountryChartData: MedalsByCountry[] = [];
  private subscriptions: Subscription = new Subscription();
  errorMessage: string = '';

  view!: [number, number]; 
  showLegend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  colorScheme: Color = {
    domain: ['#956065', '#89A1DB', '#9780A1', '#BFE0F1', '#B8CBE7', '#956065'],
    name: 'custom-style',
    selectable: true,
    group: ScaleType.Ordinal
  };
  
  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.subscriptions.add(this.getNumberOfCountries());

    this.subscriptions.add(this.getMedalsByCountry());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Gets the number of countries
   */
  getNumberOfCountries(): Subscription {
    return this.olympicService.getNumberOfCountries().subscribe((countries: number) => {
      this.numberOfCountries = countries;
    },
    (error) => {
      this.errorMessage = 'Error fetching number of countries: ' + error.message;
    });
  }

  /**
   * Gets the number of medals by country
   */
  getMedalsByCountry(): Subscription {
    return this.olympicService.getMedalsByCountry().subscribe((data) => {
      this.medalsByCountryChartData = data;
    },
    (error) => {
      this.errorMessage = 'Error fetching medals by country: ' + error.message;
    });
  }

  /**
   * Select a country
   * @param event 
   */
  onSelect(event: any): void {
    const selectedCountry = this.medalsByCountryChartData.find(data => data.name === event.name);
    if (selectedCountry) {
      this.router.navigate(['/detail', selectedCountry.id]);
    }
  }
}
