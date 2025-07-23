export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
  
  export function formatPercentage(value) {
    return `${(value * 100).toFixed(2)}%`;
  }