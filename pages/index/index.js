// index.js
Page({
  data: {
    value: '',
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
    console.log(this.data.value);
  },
  onSearch() {
    Toast('搜索' + this.data.value);
  },
  onClick() {
    Toast('搜索' + this.data.value);
  },
});
