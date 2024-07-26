import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, of, Subscription } from 'rxjs';
import { Country } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
  public olympics$: Observable<any> = of(null);

  country!: Country;
  numberOfEntries: number = 0;
  numberOfMedals: number = 0;
  numberOfAthletes: number = 0;
  medalsByParticipationChartData: any[] = [];
  private subscriptions: Subscription = new Subscription();
  errorMessage: string = '';

  view!: [number, number]; 
  showLegend: boolean = false;
  showLabels: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = false;
  xAxisLabel: string = "Dates";
  yAxisLabel: string = "";
  animations: boolean = true;
  tooltipDisabled: boolean = true;
  yScaleMin: number = 0;
  yScaleMax: number = 0;
  colorScheme: Color = {
    domain: ['#956065', '#89A1DB', '#9780A1', '#BFE0F1', '#B8CBE7', '#956065'],
    name: 'custom-style',
    selectable: true,
    group: ScaleType.Ordinal
  };

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;

      this.subscriptions.add(this.getCountry(id));
      
      this.subscriptions.add(this.getTotalNumberOfMedalsByCountry(id));
      
      this.subscriptions.add(this.getTotalNumberOfAthletesByCountry(id));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Gets the details of a country
   * @param id 
   */
  getCountry(id: number): Subscription  {
    return this.olympicService.getCountryById(id).subscribe(data => {
      this.country = data;

      this.numberOfEntries = data.participations.length;

      const medalsCount = data.participations.map(participation => participation.medalsCount);
      this.yScaleMin = Math.min(...medalsCount);
      this.yScaleMax = Math.max(...medalsCount);
      this.medalsByParticipationChartData = [
        {
          "name": data.country,
          "series": data.participations.map(participation => ({
            "name": participation.year.toString(),
            "value": participation.medalsCount
          }))
        }
      ]
    },
    (error) => {
      this.errorMessage = 'Error fetching country data: ' + error.message;
      this.router.navigate(['/not-found']);
    }
    )
  }

  /**
   * Gets the total number of medals by country
   * @param id 
   */
  getTotalNumberOfMedalsByCountry(id: number): Subscription  {
    return this.olympicService.getTotalNumberOfMedalsByCountry(id).subscribe((data) => {
      this.numberOfMedals = data;
    },
    (error) => {
      this.errorMessage = 'Error fetching medals data: ' + error.message;
    })
  }

  /**
   * Gets the total number of athletes by country
   * @param id 
   */
  getTotalNumberOfAthletesByCountry(id: number): Subscription  {
    return this.olympicService.getTotalNumberOfAthletesByCountry(id).subscribe((data: number) => {
      this.numberOfAthletes = data;
    },
    error => {
      this.errorMessage = 'Error fetching athletes data: ' + error.message;
    })
  }

  /**
   * Redirect to home page
   */
  onReturnToHomePage(): void {
    this.router.navigate(['/']);
  }
}
