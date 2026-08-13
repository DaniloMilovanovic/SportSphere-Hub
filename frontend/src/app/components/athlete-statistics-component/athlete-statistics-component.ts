import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop-service';
import { UserService } from '../../services/user-service';
import { ReservationService } from '../../services/reservation-service';
import { User } from '../../models/user';
import { Chart, registerables } from 'chart.js';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-athlete-statistics-component',
  imports: [FormsModule, DatePipe],
  templateUrl: './athlete-statistics-component.html',
  styleUrl: './athlete-statistics-component.css',
})
export class AthleteStatisticsComponent {
  
  private router = inject(Router)
  private userService = inject(UserService)
  private reservationService = inject(ReservationService)
  private shopService = inject(ShopService)
  
  user: User = new User()
  allSports: String[] = []
  sportCounts: any = {}
  chartSport: any = null;

  months: String[] = ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"]
  monthlyActivity: Number[] = []
  monthlyTrends: Number[] = []
  selectedYear: Date = new Date();
  chartActivity: any = null;

  chartEquipment: any = null;

  ngOnInit(){
    this.user = this.userService.getUser();
    this.userService.setPreviousPath("");
    this.loadStats();
  }

  ngOnDestroy(){
    if(this.chartSport){
      this.chartSport.destroy();
      this.chartSport = null;
    }
    if(this.chartActivity){
      this.chartActivity.destroy();
      this.chartActivity = null;
    }
    if(this.chartEquipment){
      this.chartEquipment.destroy();
      this.chartEquipment = null;
    }
  }

  loadStats(){
    this.loadSports()
    this.loadMonthlyActivity()
    this.loadEquipmentSpending()
  }

  loadSports(){
    this.reservationService.getUserSports(this.user.username).subscribe(data =>{
      this.sportCounts = data
      if(this.chartSport){
        this.chartSport.destroy();
      }
      this.chartSport = new Chart('sports', {
        type: 'bar',
        data: {
          labels: Object.keys(this.sportCounts),
          datasets: [{
            label: '',
            data: Object.values(this.sportCounts),
            backgroundColor: '#1a5276',
            borderRadius: 5,
            borderSkipped: false,
            maxBarThickness: 60,
            barPercentage: 0.8,
            categoryPercentage: 0.9
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    })
  }

  loadMonthlyActivity(){
    this.reservationService.getMonthlyActivity(this.selectedYear, this.user.username).subscribe(data =>{
      this.monthlyActivity = data;
      this.monthlyTrends = this.calculateTrends(this.monthlyActivity);
      if(this.chartActivity){
        this.chartActivity.destroy();
      }

      this.chartActivity = new Chart("monthlyChart", {
        type: 'line',
        data: {
          labels: this.months,
          datasets: [{
            label: 'Mesečna aktivnost',
            data: this.monthlyActivity,
            borderColor: '#2dbeef',
            tension: 0.3,
            pointRadius: 0
          },
          {
            label: 'Linearni Trend',
            data: this.monthlyTrends,
            borderColor: '#b42222',
            borderDash: [5, 5],
            fill: false,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });

    })
  }

  loadEquipmentSpending(){
    this.shopService.getTotalEquipmentSpending().subscribe(data => {
      if(this.chartEquipment){
        this.chartEquipment.destroy()
      }
      this.chartEquipment = new Chart('equipmentChart', {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Ukupna potrošnja (RSD)',
            data: Object.values(data),
            backgroundColor: '#0c8f35'
          }]
        }
      });
    });
  }

  calculateTrends(monthlyActivity: Number[]): number[] {
    const n = monthlyActivity.length;
    if(n === 0) return [];

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += monthlyActivity[i].valueOf();
      sumXY += i * monthlyActivity[i].valueOf();
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const trend: number[] = [];
    for(let i = 0; i < n; i++){
      trend.push(intercept + slope * i);
    }
    return trend;
}

  previousYear(){
    const currentYear = this.selectedYear.getFullYear();
    this.selectedYear = new Date(currentYear - 1, 0, 1);
    this.loadMonthlyActivity()
  }

  nextYear(){
    const currentYear = new Date().getFullYear();
    const nextYear = this.selectedYear.getFullYear() + 1;
    if(nextYear <= currentYear)
      this.selectedYear = new Date(nextYear, 0, 1);
    this.loadMonthlyActivity()
  }

}
