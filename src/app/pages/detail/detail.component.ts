import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, of } from 'rxjs';
import { Country } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public olympics$: Observable<any> = of(null);

  country!: Country;
  numberOfEntries: number = 0;
  numberOfMedals: number = 0;
  numberOfAthletes: number = 0;
  medalsByParticipationChartData: any[] = [];

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
      this.getCountry(id)
      this.getTotalNumberOfMedalsByCountry(id);
      this.getTotalNumberOfAthletesByCountry(id);
    });
  }

  getCountry(id: number): any {
    this.olympicService.getCountryById(id).subscribe(data => {
      this.country = data;

      this.numberOfEntries = data.participations.length;

      const medalsCount = data.participations.map(x => x.medalsCount);
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
    })
  }

  getTotalNumberOfMedalsByCountry(id: number): any {
    this.olympicService.getTotalNumberOfMedalsByCountry(id).subscribe((data) => {
      this.numberOfMedals = data;
    })
  }

  getTotalNumberOfAthletesByCountry(id: number): any {
    this.olympicService.getTotalNumberOfAthletesByCountry(id).subscribe((data: number) => {
      this.numberOfAthletes = data;
    })
  }

  onReturnToHomePage(): void {
    this.router.navigate(['/']);
  }
}
