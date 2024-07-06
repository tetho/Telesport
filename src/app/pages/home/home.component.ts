import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, of } from 'rxjs';
import { Country } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  countries: Country[] = [];
  numberOfCountries: number = 0;
  medalsByCountry: any[] = [];

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
  
  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    
    this.olympicService.getNumberOfCountries().subscribe((countries: number) => {
      this.numberOfCountries = countries;
    });

    this.olympicService.getMedalsByCountry().subscribe((data) => {
      this.medalsByCountry = data;
    });
    
  }
}
