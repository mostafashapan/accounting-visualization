export default class AccountingNode {
    constructor(id, name, parentId = null, value = 0) {
      this.id = id;
      this.name = name;
      this.parentId = parentId;
      this.value = value;
      this.children = [];
    }
  }