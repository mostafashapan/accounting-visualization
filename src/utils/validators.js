export function validateAccountingData(data) {
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format: expected an array');
    }
    
    // Check for required fields
    data.forEach(item => {
      if (!item.id || !item.name || typeof item.value !== 'number') {
        throw new Error('Each account must have id, name, and value properties');
      }
    });
    
    return true;
  }