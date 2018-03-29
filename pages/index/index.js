//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    saleStatus: true,
    auditStatus: false,
    unsaleStatus: false,
    showProduct: []
  },

  edit: function(e) {
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '../product/edit?id=' + id,
    });
  },

  addProduct: function(e) {
    wx.navigateTo({
      url: '../product/edit',
    });
  },

  clickSale: function(e) {
    var that = this;
    console.log(that.data);
    this.setData({
      saleStatus: true,
      auditStatus: false,
      unsaleStatus: false,
      showProduct: that.data.userInfo.productCategory[1] ? that.data.userInfo.productCategory[1] : []
    });
  },

  clickAudit: function (e) {
    var that = this;
    this.setData({
      saleStatus: false,
      auditStatus: true,
      unsaleStatus: false,
      showProduct: that.data.userInfo.productCategory[0] ? that.data.userInfo.productCategory[0] : []
    });

    console.log(that.data);
  },

  clickUnsale: function (e) {
    var that = this;
    this.setData({
      saleStatus: false,
      auditStatus: false,
      unsaleStatus: true,
      showProduct: that.data.userInfo.productCategory[2] ? that.data.userInfo.productCategory[2] : []
    });
  },

  init: function() {
    var that = this;
    wx.request({
      url: app.globalData.serverHost + '/shop/info/' + app.globalData.userData.uid,
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'TOKEN': app.globalData.userData.session
      },
      success: function (res) {
        wx.hideLoading();   
        if (res.data.data.productCategory[1]) {
          that.setData({
            userInfo: res.data.data,
            showProduct: res.data.data.productCategory[1]
          })
        } else {
          that.setData({
            userInfo: res.data.data
          })
        }
      }
    });
  },

  onLoad: function () {
    var that = this;
    if (app.globalData.userData.uid) {
      wx.showLoading({
        title: '加载中'
      });
      that.init();
    } else {
      wx.showLoading({
        title: '加载中',
        success: function() {
          // 登录
          wx.login({
            success: res => {
              var code = res.code;
              if (code) {
                wx.request({
                  url: app.globalData.serverHost + '/open/session',
                  data: {
                    'code': code
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    app.globalData.userData = res.data.data;
                    that.init();  
                  }
                });
              }
            }
          });
        }
      });
    }
  },
  /**
    * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
