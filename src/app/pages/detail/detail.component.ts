import { Component, OnInit } from '@angular/core';
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
  countryId: number = 2;
  numberOfEntries: number = 0;
  numberOfMedals: number = 0;
  numberOfAthletes: number = 0;
  medalsByParticipation: any[] = [];

  view!: [number, number]; 
  showLegend: boolean = false;
  showLabels: boolean = true;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = false;
  xAxisLabel: string = "";
  yAxisLabel: string = "Dates";
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

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    
    this.olympicService.getCountryById(this.countryId).subscribe(data => {
      this.country = data;

      this.numberOfEntries = data.participations.length;

      const medalsCount = data.participations.map(x => x.medalsCount);
      this.yScaleMin = Math.min(...medalsCount);
      this.yScaleMax = Math.max(...medalsCount);
      this.medalsByParticipation = [
        {
          "name": data.country,
          "series": data.participations.map(participation => ({
            "name": participation.year.toString(),
            "value": participation.medalsCount
          }))
        }
      ]
    })

    this.olympicService.getTotalNumberOfMedalsByCountry(this.countryId).subscribe((data) => {
      this.numberOfMedals = data;
    })

    this.olympicService.getTotalNumberOfAthletesByCountry(this.countryId).subscribe((data: number) => {
      this.numberOfAthletes = data;
    })
  }
}
