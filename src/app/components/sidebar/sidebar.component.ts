import { Component, Input, OnInit } from '@angular/core';

import { SidebarLocation, SidebarType } from '@/models/sidebar';
import { AuthenticationService } from '@/services';
import { LoggingService } from '@/services/logging.service';
import { SidebarService } from '@/services/sidebar.service';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-sidebar',
  styleUrls: ['sidebar.component.css'],
  templateUrl: 'sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  SidebarType = SidebarType;
  SidebarLocation = SidebarLocation;

  public barChartOptions: ChartConfiguration['options'] = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    responsive: true,
    resizeDelay: 500,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (context) {
            return '';
          },
          label: function (context) {
            let label = '';
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      xAxes: {
        ticks: {
          callback: function (value: any, index: any, values: any) {
            if (parseInt(value) >= 1000) {
              return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } else {
              return '$' + value;
            }
          }
        }
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        label: 'Transactions',
        data: [65.25, 59.13, 180.60, 81.81, 56.22, 55.35, 140.67],
        backgroundColor: [
          '#ffec99',
          '#bac8ff',
          '#ffc9c9',
          '#ffec99',
          '#bac8ff',
          '#ffc9c9',
          '#ffec99',
        ],
      },
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (context) {
            return '';
          },
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ": "
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(context.parsed.valueOf());
            }
            return label;
          }
        }
      }
    }
  }
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Groceries', 'Utilities', 'Personal Care', 'Other'],
    datasets: [
      {
        data: [124.38, 262.41, 111.57, 140.67]
      },
    ],
  }

  @Input('type') sidebarType!: SidebarType;

  constructor(private sidebarService: SidebarService,
    public auth: AuthenticationService,
    private logging: LoggingService) { }

  ngOnInit() {
    if (this.sidebarType == SidebarType.CONSEQUENCES) {
      this.logging.info(`Showing consequences nudge.`);
    }
  }
}