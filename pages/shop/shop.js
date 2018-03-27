// open.js
var appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null
  },

  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (e.detail.value.name.length == 0 || e.detail.value.desc.length == 0 || !e.detail.value.phone) {
      wx.showToast({
        title: '内容不完整，请补充',
        mask: true,
        icon: 'none'
      })
    } else {
      wx.request({
        url: appInstance.globalData.serverHost + '/shop/add',
        data: {
          session: appInstance.globalData.userData.session,
          name: e.detail.value.name,
          desc: e.detail.value.desc,
          phone: e.detail.value.phone
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(res.data);
          if (res.data.data > 0) {
            wx.switchTab({
              url: '../config/config'
            });
          } else {
            wx.showToast({
              title: '开店失败',
            });
          }
        }
      })
    }
  },

  getPhoneNumber: function (e) {
    if (!e.detail.iv) {
      wx.showToast({
        title: '手机号码为必填信息，请授权',
        mask: true,
        icon: 'none'
      })
    } else {
      var page = this;
      wx.request({
        url: appInstance.globalData.serverHost + '/open/phone',
        data: {
          'session': appInstance.globalData.userData.session,
          'iv': e.detail.iv,
          'encryptedData': e.detail.encryptedData
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          page.setData({
            phone: res.data.data
          });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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