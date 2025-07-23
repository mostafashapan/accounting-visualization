import { formatCurrency } from '../../utils/formatters';

export default class AccountTable {
  constructor(containerId, data = []) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.data = data;
    
    if (!this.container) {
      throw new Error(`Container element not found for ID: ${containerId}`);
    }
    
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    try {
      // Clear existing content
      this.container.innerHTML = '';
      
      const table = this.createTable();
      const thead = this.createTableHeader();
      const tbody = this.createTableBody();
      
      table.appendChild(thead);
      table.appendChild(tbody);
      this.container.appendChild(table);
    } catch (error) {
      console.error('Error rendering account table:', error);
      this.renderErrorState();
    }
  }

  createTable() {
    const table = document.createElement('table');
    table.className = 'account-table';
    return table;
  }

  createTableHeader() {
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['Account', 'Balance', 'Type'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    return thead;
  }

  createTableBody() {
    const tbody = document.createElement('tbody');
    
    if (!this.data || !Array.isArray(this.data) || this.data.length === 0) {
      this.renderEmptyState(tbody);
      return tbody;
    }
    
    this.data.forEach(account => {
      const row = this.createTableRow(account);
      tbody.appendChild(row);
    });
    
    return tbody;
  }

  createTableRow(account) {
    const tr = document.createElement('tr');
    
    // Account name cell
    const nameCell = document.createElement('td');
    nameCell.style.paddingLeft = `${account.level * 20}px`;
    nameCell.textContent = `${account.level > 0 ? '↳ ' : ''}${account.name || 'Unnamed Account'}`;
    tr.appendChild(nameCell);
    
    // Balance cell
    const balanceCell = document.createElement('td');
    balanceCell.textContent = formatCurrency(account.value || 0);
    tr.appendChild(balanceCell);
    
    // Type cell
    const typeCell = document.createElement('td');
    typeCell.textContent = account.isLeaf ? 'Detail' : 'Group';
    tr.appendChild(typeCell);
    
    return tr;
  }

  renderEmptyState(tbody) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.textContent = 'No data available';
    cell.className = 'empty-state';
    row.appendChild(cell);
    tbody.appendChild(row);
  }

  renderErrorState() {
    this.container.innerHTML = '<div class="error-state">Failed to render table</div>';
  }

  update(newData = []) {
    this.data = newData;
    this.render();
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.container = null;
    this.data = [];
  }
}