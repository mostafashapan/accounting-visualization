import BarChart from '../charts/BarChart.js';
import PieChart from '../charts/PieChart.js';
import TreeChart from '../charts/TreeChart.js';
import TimeSeriesChart from '../charts/TimeSeriesChart.js';
import AccountTable from '../tables/AccountTable.js';
import DataService from '../../data/dataService.js';

export default class Dashboard {
  constructor(data) {
    this.data = data || [];
    this.charts = {};
    this.accountTable = null;
    this.dataService = new DataService();
    this.isInitializing = false;
    
    this.init();
  }

  init() {
    console.log('Dashboard init called');
    this.render();
    this.loadData();
  }

  async loadData() {
    if (this.isInitializing) {
      console.log('Already initializing, skipping...');
      return;
    }
    
    this.isInitializing = true;
    
    try {
      console.log('Loading accounting data...');
      const accountingTree = await this.dataService.getAccountingData();
      this.data = accountingTree.getFlattenedTree();
      this.treeData = accountingTree.buildTree();
      
      console.log('Data loaded successfully');
      this.initCharts();
    } catch (error) {
      console.error('Failed to load accounting ', error);
      this.isInitializing = false;
    }
  }

  render() {
    console.log('Rendering dashboard...');
    document.getElementById('app').innerHTML = `
      <div class="dashboard">
        <h1>Accounting Data Visualization</h1>
        
        <div class="chart-container">
          <div class="chart-row">
            <div class="chart-col">
              <div class="chart-wrapper">
                <canvas id="barChart"></canvas>
              </div>
            </div>
            <div class="chart-col">
              <div class="chart-wrapper">
                <canvas id="pieChart"></canvas>
              </div>
            </div>
          </div>
             
          <div class="chart-row">
            <div class="chart-col full-width">
              <div class="chart-wrapper">
                <canvas id="timeSeriesCanvasId"></canvas>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-container">
          <h2>Account Details</h2>
          <div id="accountTable"></div>
        </div>
      </div>
    `;
    console.log('Dashboard rendered');
  }

  initCharts() {
    console.log('initCharts called');
    
    // Destroy existing charts first
    this.destroyCharts();

    requestAnimationFrame(() => {
      
        
        const topLevelAccounts = this.data.filter(account => account.level === 0);
        const leafAccounts = this.data.filter(account => account.isLeaf);

        // Create all charts
        this.createBarChart(document.getElementById('barChart'), topLevelAccounts);
        this.createPieChart(document.getElementById('pieChart'), leafAccounts);
        this.createTreeChart(document.getElementById('treeChart'));
        this.createAccountTable(document.getElementById('accountTable'));
        this.createTimeSeriesChart(document.getElementById('timeSeriesCanvasId'));

        
        
     
})};

  createBarChart(canvas, data) {
    if (canvas && data && data.length > 0) {
      try {
        if (typeof BarChart === 'function') {
          this.charts.barChart = new BarChart('barChart', data, 'Top Level Accounts');
          console.log('BarChart created successfully');
        } else {
          console.error('BarChart is not a constructor');
        }
      } catch (error) {
        console.error('Failed to create BarChart:', error);
      }
    }
  }

  createPieChart(canvas, data) {
    if (canvas && data && data.length > 0) {
      try {
        if (typeof PieChart === 'function') {
          this.charts.pieChart = new PieChart('pieChart', data, 'Account Distribution');
          console.log('PieChart created successfully');
        } else {
          console.error('PieChart is not a constructor');
        }
      } catch (error) {
        console.error('Failed to create PieChart:', error);
      }
    }
  }

  createTreeChart(canvas) {
    if (canvas) {
      try {
        console.log('TreeChart type:', typeof TreeChart);
        console.log('TreeChart:', TreeChart);
        
        if (typeof TreeChart === 'function') {
          this.charts.treeChart = new TreeChart('treeChart', this.treeData || this.data, 'Account Hierarchy');
          console.log('TreeChart created successfully');
        } else {
          console.error('TreeChart is not a constructor');
          // Try dynamic import as fallback
          this.tryDynamicTreeChartImport(canvas);
        }
      } catch (error) {
        console.error('Failed to create TreeChart:', error);
        // Try dynamic import as fallback
        this.tryDynamicTreeChartImport(canvas);
      }
    }
  }

  async tryDynamicTreeChartImport(canvas) {
    try {
      console.log('Attempting dynamic import of TreeChart...');
      const TreeChartModule = await import('../charts/TreeChart.js');
      const DynamicTreeChart = TreeChartModule.default;
      
      if (typeof DynamicTreeChart === 'function') {
        this.charts.treeChart = new DynamicTreeChart('treeChart', this.treeData || this.data, 'Account Hierarchy');
        console.log('TreeChart created successfully via dynamic import');
      } else {
        console.error('Dynamic TreeChart is not a constructor');
      }
    } catch (error) {
      console.error('Failed to dynamically import TreeChart:', error);
    }
  }

  createAccountTable(container) {
    if (container && this.data && this.data.length > 0) {
      try {
        if (typeof AccountTable === 'function') {
          this.accountTable = new AccountTable('accountTable', this.data);
          console.log('AccountTable created successfully');
          
          console.error('AccountTable is not a constructor');
        }
      } catch (error) {
        console.error('Failed to create AccountTable:', error);
      }
    }
  }

  createTimeSeriesChart(canvas) {
    if (canvas) {
      try {
        if (typeof TimeSeriesChart === 'function') {
          this.charts.timeSeriesChart = new TimeSeriesChart('timeSeriesCanvasId', {
            dates: [],
            accounts: {}
          }, 'Account Trends Over Time');
          console.log('TimeSeriesChart created successfully');
          this.loadTimeSeriesData();
        } else {
          console.error('TimeSeriesChart is not a constructor');
        }
      } catch (error) {
        console.error('Failed to create TimeSeriesChart:', error);
      }
    }
  }

  destroyCharts() {
    Object.keys(this.charts).forEach(key => {
      if (this.charts[key] && typeof this.charts[key].destroy === 'function') {
        try {
          this.charts[key].destroy();
        } catch (error) {
          console.warn(`Failed to destroy chart ${key}:`, error);
        }
      }
    });

    if (this.accountTable && typeof this.accountTable.destroy === 'function') {
      try {
        this.accountTable.destroy();
      } catch (error) {
        console.warn('Failed to destroy account table:', error);
      }
    }

    this.charts = {};
    this.accountTable = null;
  }

  async loadTimeSeriesData() {
    try {
      const timeSeriesData = await this.dataService.getTimeSeriesData();
      if (this.charts.timeSeriesChart) {
        this.charts.timeSeriesChart.update(timeSeriesData);
      }
    } catch (error) {
      console.error('Failed to load time series ', error);
    }
  }

  update(newData) {
    this.data = newData;
    const topLevelAccounts = this.data.filter(account => account.level === 0);
    const leafAccounts = this.data.filter(account => account.isLeaf);

    if (this.charts.barChart) this.charts.barChart.update(topLevelAccounts);
    if (this.charts.pieChart) this.charts.pieChart.update(leafAccounts);
    if (this.charts.treeChart) this.charts.treeChart.update(this.data);
    if (this.accountTable) this.accountTable.update(this.data);
  }

  destroy() {
    this.destroyCharts();
  }
}