import Dashboard from './views/dashboard/Dashboard';
import DataService from './data/dataService';

export default class App {
  constructor() {
    this.dataService = new DataService();
    this.dashboard = null;
    this.init();
  }

  async init() {
    try {
      const accountingData = await this.dataService.getAccountingData();
      const flattenedData = accountingData.getFlattenedTree();
      
      this.dashboard = new Dashboard(flattenedData);
      
      // For demo purposes - simulate data updates
      setInterval(async () => {
        const updatedData = await this.dataService.getAccountingData();
        const updatedFlattened = updatedData.getFlattenedTree();
        this.dashboard.update(updatedFlattened);
      }, 5000);
      
    } catch (error) {
      console.error('Error initializing application:', error);
      document.getElementById('app').innerHTML = `
        <div class="error">
          <h2>Failed to load accounting data</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}