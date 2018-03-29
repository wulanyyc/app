//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开微店，自动代理，赚快钱',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phone: null,
    logo: null
  },

  uploadLogo: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        // TODO
        wx.showLoading({
          title: '上传图片中',
        });

        for (var i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.serverHost + '/user/upload/logo',
            filePath: res.tempFilePaths[i],
            name: 'img_' + i,
            header: {
              'TOKEN': app.globalData.userData.session
            },
            success: function (res) {
              wx.hideLoading();
              var data = res.data;
              data = JSON.parse(data);
              console.log(data);
              if (data.data) {
                that.setData({
                  logo: app.globalData.serverHost + "/files/" + data.data[0].file_name
                });
              }
            }
          });
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
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
        url: app.globalData.serverHost + '/user/phone',
        data: {
          'session': app.globalData.userData.session,
          'iv': e.detail.iv,
          'encryptedData': e.detail.encryptedData
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'TOKEN': app.globalData.userData.session
        },
        success: function (res) {
          // console.log(res.data);
          page.setData({
            phone: res.data.data
          });
        }
      });
    }
  },

  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    if (e.detail.value.name.length == 0 || !e.detail.value.phone || e.detail.value.desc.length == 0) {
      wx.showToast({
        title: '信息不完整，请补充',
        mask: true,
        icon: 'none'
      })
    } else {
      wx.request({
        url: app.globalData.serverHost + '/user/add',
        data: {
          session: app.globalData.userData.session,
          name: e.detail.value.name,
          phone: e.detail.value.phone,
          desc: e.detail.value.desc,
          logo: that.data.logo
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'TOKEN': app.globalData.userData.session
        },
        success: function (res) {
          if (res.data.data > 0) {
            wx.setStorageSync("uid", res.data.data);
            wx.switchTab({
              url: '../index/index'
            });
          } else {
            wx.showModal({
              title: '开通失败',
              content: '该店名已存在，请修改',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      })
    }
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        logo: app.globalData.userInfo.avatarUrl
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          logo: res.userInfo.avatarUrl
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            logo: res.userInfo.avatarUrl
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      logo: e.detail.userInfo.avatarUrl
    })
  }
})
