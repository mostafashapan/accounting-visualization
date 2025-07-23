import Chart from 'chart.js/auto';
import { formatCurrency } from '../../utils/formatters';

export default class TimeSeriesChart {
  constructor(canvasId, data, title = 'Account Trends') {
    this.ctx = document.getElementById(canvasId).getContext('2d');
    this.data = data;
    this.title = title;
    this.chart = null;
    this.init();
  }

  init() {
    // Assuming data is in format { dates: [], accounts: { name: [values] } }
    const dates = this.data.dates;
    const datasets = Object.keys(this.data.accounts).map((account, idx) => ({
      label: account,
      data: this.data.accounts[account],
      borderColor: `hsl(${idx * 360 / Object.keys(this.data.accounts).length}, 70%, 50%)`,
      backgroundColor: `hsla(${idx * 360 / Object.keys(this.data.accounts).length}, 70%, 50%, 0.1)`,
      tension: 0.1,
      fill: true
    }));

    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: datasets
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
                return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: value => formatCurrency(value)
            }
          }
        }
      }
    });
  }

  update(newData) {
    this.data = newData;
  
    // Update labels (dates)
    this.chart.data.labels = newData.dates;
  
    const accountNames = Object.keys(newData.accounts);
  
    // Update or add datasets
    accountNames.forEach((account, idx) => {
      if (this.chart.data.datasets[idx]) {
        this.chart.data.datasets[idx].label = account;
        this.chart.data.datasets[idx].data = newData.accounts[account];
        this.chart.data.datasets[idx].borderColor = `hsl(${idx * 360 / accountNames.length}, 70%, 50%)`;
        this.chart.data.datasets[idx].backgroundColor = `hsla(${idx * 360 / accountNames.length}, 70%, 50%, 0.1)`;
      } else {
        this.chart.data.datasets.push({
          label: account,
          data: newData.accounts[account],
          borderColor: `hsl(${idx * 360 / accountNames.length}, 70%, 50%)`,
          backgroundColor: `hsla(${idx * 360 / accountNames.length}, 70%, 50%, 0.1)`,
          tension: 0.1,
          fill: true
        });
      }
    });
  
    // Remove excess datasets if any
    if (this.chart.data.datasets.length > accountNames.length) {
      this.chart.data.datasets.splice(accountNames.length);
    }
  
    // Optional: Update the title if it might change
    if (this.chart.options.plugins.title.text !== this.title) {
      this.chart.options.plugins.title.text = this.title;
    }
  
    this.chart.update();
  }
  

  destroy() {
    this.chart?.destroy();
  }
}