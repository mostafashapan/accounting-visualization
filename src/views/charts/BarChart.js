import Chart from 'chart.js/auto';
import { formatCurrency } from '../../utils/formatters';

export default class BarChart {
  constructor(canvasId, data, title = 'Account Balances') {
    this.ctx = document.getElementById(canvasId).getContext('2d');
    this.data = data;
    this.title = title;
    this.chart = null;
    this.init();
  }

  init() {
    const labels = this.data.map(item => item.name);
    const values = this.data.map(item => item.value);

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.title,
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => formatCurrency(value)
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => formatCurrency(context.parsed.y)
            }
          }
        }
      }
    });
  }

  update(newData) {
    this.data = newData;
    this.chart.data.labels = newData.map(item => item.name);
    this.chart.data.datasets[0].data = newData.map(item => item.value);
    this.chart.update();
  }

  destroy() {
    this.chart?.destroy();
  }
}