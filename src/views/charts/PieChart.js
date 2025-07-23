import Chart from 'chart.js/auto';
import { formatCurrency } from '../../utils/formatters';

export default class PieChart {
  constructor(canvasId, data, title = 'Account Distribution') {
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
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: this.title
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
              }
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