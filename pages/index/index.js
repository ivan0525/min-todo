Page({
  data: {
    input: '',
    todos: [],
    leftCount: 0,
    allCompleted: false,
    logs: []
  },
  load() {
    let todos = wx.getStorageSync('todo_list');
    if (!!todos) {
      this.setData({todos: todos});
    }

    let logs = wx.getStorageSync('log_list');

    if (!!logs) {
      this.setData({logs: logs});
    }

    this.setData({allCompleted: this.isAllComplete()})
    this.setData({leftCount: this.handleCountLeft()});

  },
  save(key, value) {
    wx.setStorageSync('todo_list', this.data.todos);
    wx.setStorageSync('log_list', this.data.logs)
  },
  onLoad() {
    this.load();
  },
  handleInputChange(e) {
    this.setData({ input: e.detail.value });
  },
  handleAddTodo(e) {
    if (!this.data.input || !this.data.input.trim()) return;
    let todos = this.data.todos,
        logs = this.data.logs;
    todos.push({title: this.data.input, completed: false});
    logs.push({timestamp: this.getNow(), actions: 'Add', title: this.data.input});
    this.setData({
      input: '',
      todos: todos,
      leftCount: this.handleCountLeft(),
      logs: logs
    });
    this.save();
  },
  toggleTodoStatus(e) {
    let index = e.currentTarget.dataset.index;
    let todos = this.data.todos;
    todos[index].completed = !todos[index].completed;
    let logs = this.data.logs;
    logs.push({
      timestamp: this.getNow(),
      actions: todos[index].completed ? 'Finish' : 'Restart'
    })
    this.setData({
      todos: todos,
      leftCount: this.handleCountLeft(),
      allCompleted: this.isAllComplete(),
      logs: logs
    });
    this.save();
  },
  handleToggleAll() {
    this.data.allCompleted = !this.data.allCompleted
    let allCompleted = this.data.allCompleted;
    let todos = this.data.todos;
    let logs = this.data.logs;
    this.data.todos.forEach((item, index) => {
      item.completed = this.data.allCompleted;
    });
    logs.push({
      timestamp: this.getNow(),
      actions: this.data.allCompleted ? 'Finish' : 'Restart',
      title: 'All todos'
    });
    this.setData({
      todos: todos,
      leftCount: this.handleCountLeft(),
      logs: logs
    });
    this.save();
  },
  delTodo(e) {
    let todos = this.data.todos;
    let logs = this.data.logs;
    let index = e.currentTarget.dataset.index;
    let remove = todos.splice(index, 1)[0];
    logs.push({
      timestamp: this.getNow(),
      actions: 'Remove',
      title: remove.title
    })
    this.setData({
      todos: todos,
      logs: logs
    });
    this.save();
  },
  handleCountLeft() {
    let todos = this.data.todos;
    return todos.filter(item => !item.completed).length;
  },
  handleClearCompleted() {
    let todos = this.data.todos;
    let logs = this.data.logs;
    todos = todos.filter(item => !item.completed);
    logs.push({
      timestamp: this.getNow(),
      actions: 'Clear',
      title: 'Complete Todo'
    });
    this.setData({
      todos: todos,
      logs: logs,
      leftCount: this.handleCountLeft(),
    })
    this.save();
  },
  getNow() {
    return (new Date()).toLocaleString()
  },
  isAllComplete() {
    let todos = this.data.todos;
    let completedCount = todos.reduce((total, todo) => total + (todo.completed ? 1 : 0), 0);
    return todos.length === completedCount;
  }
})