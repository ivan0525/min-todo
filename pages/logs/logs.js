Page({
  data: {
    logs: []
  },
  load() {
    let logs = wx.getStorageSync('log_list');

    if (!!logs) {
      this.setData({
        logs: logs.reverse()
      })
    }
  },
  onLoad() {
    this.load();
  },
  onShow() {
    this.load();
  }
})