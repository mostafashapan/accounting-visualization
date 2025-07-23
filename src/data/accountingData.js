import AccountingTree from '../models/AccountingTree';

export function getSampleData() {
  const tree = new AccountingTree();
  
  // Assets
  tree.addNode(1, "Assets");
  tree.addNode(2, "Current Assets", 1);
  tree.addNode(3, "Fixed Assets", 1);
  tree.addNode(4, "Cash", 2, 15000);
  tree.addNode(5, "Accounts Receivable", 2, 8500);
  tree.addNode(6, "Inventory", 2, 22000);
  tree.addNode(7, "Equipment", 3, 45000);
  tree.addNode(8, "Buildings", 3, 120000);
  
  // Liabilities
  tree.addNode(9, "Liabilities");
  tree.addNode(10, "Current Liabilities", 9);
  tree.addNode(11, "Long-term Liabilities", 9);
  tree.addNode(12, "Accounts Payable", 10, 18000);
  tree.addNode(13, "Short-term Loans", 10, 12000);
  tree.addNode(14, "Mortgage", 11, 90000);
  
  // Equity
  tree.addNode(15, "Equity");
  tree.addNode(16, "Common Stock", 15, 50000);
  tree.addNode(17, "Retained Earnings", 15, 68500);
  
  return tree;
}