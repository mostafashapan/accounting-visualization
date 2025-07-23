import { getSampleData } from './accountingData';

export default class DataService {
  async getAccountingData() {
    // In a real app, this would fetch from an API
    return getSampleData();
  }

  async getTimeSeriesData() {
    // Provide mocked time series data:
    return {
      dates: ['2023-01-01', '2023-02-01', '2023-03-01'],
      accounts: {
        'Cash': [14000, 14500, 15000],
        'Accounts Receivable': [8000, 8250, 8500],
        'Inventory': [21000, 21500, 22000],
        'Equipment': [44000, 44500, 45000],
        'Buildings': [118000, 119000, 120000],
        // add more accounts as needed
      }
    };
  }
}
