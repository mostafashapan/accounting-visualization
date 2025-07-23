import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import Chart from 'chart.js/auto';
import { formatCurrency } from '../../utils/formatters';

// Register the treemap controller globally
Chart.register(TreemapController, TreemapElement);

export default class TreeChart {
  constructor(canvasId, data, title = 'Account Hierarchy') {
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
      throw new Error('Chart.js is not loaded');
    }

    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    
    if (!this.canvas) {
      console.error(`Canvas element with ID "${canvasId}" not found`);
      // Retry after a short delay in case DOM isn't ready
      setTimeout(() => {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
          this.initialize(data, title);
        } else {
          console.error(`Canvas still not found after retry`);
        }
      }, 100);
      return;
    }

    this.initialize(data, title);
  }

  initialize(data, title) {
    try {
      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error('Could not get canvas context');
      }

      // Destroy any existing chart first
      const existingChart = Chart.getChart(this.canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      this.data = this.prepareTreeData(data);
      this.title = title;
      this.chart = null;
      
      this.init();
    } catch (error) {
      console.error('TreeChart initialization failed:', error);
    }
  }

  /**
   * Convert flat accounting data into hierarchical structure for treemap
   * @param {Array} accounts - Flat list of accounting nodes
   * @returns {Object} Hierarchical tree data
   */
  prepareTreeData(accounts) {
    if (!accounts || !Array.isArray(accounts)) {
      console.error('Invalid accounts data:', accounts);
      return {
        name: 'Empty Data',
        value: 0,
        children: []
      };
    }

    // Create root node
    const root = {
      name: 'All Accounts',
      value: accounts.reduce((sum, acc) => sum + (acc.value || 0), 0),
      children: []
    };

    // Helper to find or create group nodes
    const getOrCreateGroup = (parent, name, value = 0) => {
      let group = parent.children.find(child => child.name === name);
      if (!group) {
        group = { name, value, children: [] };
        parent.children.push(group);
      }
      return group;
    };

    // Organize accounts by their hierarchy path
    accounts.forEach(account => {
      const path = this.getAccountPath(account, accounts);
      let currentLevel = root;

      // Traverse or create the hierarchy
      path.forEach((node, index) => {
        const isLeaf = index === path.length - 1;
        currentLevel = getOrCreateGroup(
          currentLevel,
          node.name,
          isLeaf ? node.value : 0
        );
        
        if (isLeaf) {
          currentLevel.value = node.value;
        }
      });
    });

    // Calculate parent group values as sum of children
    this.calculateGroupValues(root);

    return root;
  }

  /**
   * Get the full path from root to an account
   * @param {Object} account - Target account
   * @param {Array} allAccounts - All accounts in the tree
   * @returns {Array} Path from root to account
   */
  getAccountPath(account, allAccounts) {
    const path = [account];
    let current = account;
    
    while (current.parentId) {
      const parent = allAccounts.find(a => a.id === current.parentId);
      if (parent) {
        path.unshift(parent);
        current = parent;
      } else {
        break;
      }
    }
    
    return path;
  }

  /**
   * Calculate group values as sum of children
   * @param {Object} node - Current node in the tree
   */
  calculateGroupValues(node) {
    if (node.children && node.children.length > 0) {
      node.value = 0;
      node.children.forEach(child => {
        this.calculateGroupValues(child);
        node.value += child.value;
      });
    }
  }

  /**
   * Initialize the treemap chart
   */
  init() {
    try {
      this.chart = new Chart(this.ctx, {
        type: 'treemap',
        data: {
          datasets: [{
            tree: this.data,
            key: 'value',
            groups: ['name'],
            spacing: 1,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)',
            captions: {
              display: true,
              color: 'white',
              font: {
                size: 12,
                weight: 'bold'
              },
              formatter: (ctx) => ctx.raw?.name || 'Unnamed'
            },
            labels: {
              display: true,
              formatter: (ctx) => formatCurrency(ctx.raw?.value || 0),
              color: 'white',
              font: {
                size: 10
              }
            },
            backgroundColor: (ctx) => {
              const depth = ctx.raw?.depth || 0;
              const hue = 200 + depth * 30;
              return `hsla(${hue}, 70%, 50%, 0.7)`;
            },
            hoverBackgroundColor: (ctx) => {
              const depth = ctx.raw?.depth || 0;
              const hue = 200 + depth * 30;
              return `hsla(${hue}, 70%, 60%, 0.9)`;
            }
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: this.title,
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                title: (items) => {
                  const item = items[0];
                  return item.raw?.name || 'Account';
                },
                label: (item) => {
                  return `Value: ${formatCurrency(item.raw?.value || 0)}`;
                },
                afterLabel: (item) => {
                  const total = this.data?.value || 1;
                  const percentage = ((item.raw?.value || 0) / total * 100).toFixed(2);
                  return `Percentage: ${percentage}%`;
                }
              }
            },
            legend: {
              display: false
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize treemap chart:', error);
      // Fallback to error display
      this.displayError();
    }
  }

  displayError() {
    this.ctx.fillStyle = 'red';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Chart failed to load', 10, 30);
  }

  /**
   * Update chart with new data
   * @param {Array} newData - New accounting data
   */
  update(newData) {
    this.data = this.prepareTreeData(newData);
    if (this.chart) {
      this.chart.data.datasets[0].tree = this.data;
      this.chart.update();
    }
  }

  /**
   * Destroy the chart instance
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    // Clear the canvas
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}