import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
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
  participations: Participation[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    
    this.olympicService.getNumberOfCountries().subscribe((countries: number) => {
      this.numberOfCountries = countries;
    });
  }
}
