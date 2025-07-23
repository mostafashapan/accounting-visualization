import AccountingNode from './AccountingNode';

export default class AccountingTree {
  constructor() {
    this.nodes = [];
    this.rootNodes = [];
  }

  addNode(id, name, parentId = null, value = 0) {
    const node = new AccountingNode(id, name, parentId, value);
    this.nodes.push(node);
    
    if (parentId === null) {
      this.rootNodes.push(node);
    } else {
      const parent = this.nodes.find(n => n.id === parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
    
    return node;
  }

  buildTree(nodes = this.rootNodes, level = 0) {
    let tree = [];
    
    for (const node of nodes) {
      const newNode = {
        id: node.id,
        name: node.name,
        value: node.value,
        level: level,
        children: this.buildTree(node.children, level + 1)
      };
      
      if (newNode.children.length > 0) {
        newNode.value = newNode.children.reduce((sum, child) => sum + child.value, 0);
        node.value = newNode.value;
      }
      
      tree.push(newNode);
    }
    
    return tree;
  }

  getFlattenedTree() {
    const tree = this.buildTree();
    const result = [];
    
    function flatten(node) {
      result.push({
        id: node.id,
        name: node.name,
        value: node.value,
        level: node.level,
        isLeaf: node.children.length === 0
      });
      
      node.children.forEach(flatten);
    }
    
    tree.forEach(flatten);
    return result;
  }

  findNode(id) {
    return this.nodes.find(node => node.id === id);
  }

  getDescendants(parentId) {
    const parent = this.findNode(parentId);
    if (!parent) return [];
    
    let descendants = [];
    
    function collectChildren(node) {
      descendants.push(node);
      node.children.forEach(collectChildren);
    }
    
    collectChildren(parent);
    return descendants;
  }

  getPath(nodeId) {
    const path = [];
    let currentNode = this.findNode(nodeId);
    
    while (currentNode) {
      path.unshift(currentNode);
      currentNode = currentNode.parentId ? this.findNode(currentNode.parentId) : null;
    }
    
    return path;
  }
}