// add.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tempImgFiles: [],
    tempVedioFile: null,
    chooseImgFlag: false
  },

  formSubmit: function (e) {
    var that = this;
    var imgs = this.data.tempImgFiles;
    var params = e.detail.value;
    var uploadImgFlag = false;
    var uploadVedioFlag = false;

    if (params.name.length == 0 || params.price.length == 0 || params.desc.length == 0 || params.express.length == 0 || this.data.tempImgFiles.length == 0) {
      wx.showToast({
        title: '商品信息不完整，请补充',
        mask: true,
        icon: 'none'
      });
      return;
    }

    if (parseFloat(params.salary) > parseFloat(params.price)) {
      wx.showToast({
        title: '佣金不能大于商品价格',
        mask: true,
        icon: 'none'
      });
      return ;
    }

    wx.request({
      url: app.globalData.serverHost + '/product/add',
      data: {
        'uid': app.globalData.userData.uid,
        'img_list': that.data.tempImgFiles,
        'vedio': that.data.tempVedioFile,
        'name': e.detail.value.name,
        'price': e.detail.value.price,
        'salary': e.detail.value.salary,
        'desc': e.detail.value.desc,
        'express': e.detail.value.express
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.data > 0) {
          wx.showModal({
            title: '提示',
            content: '添加成功，继续添加商品',
            success: function (res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../index/index',
                });
              }
            }
          });
        } else {
          wx.showToast({
            title: '添加失败，请联系客服',
            mask: true,
            icon: 'none'
          });
        }
      }
    });
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  chooseImage: function() {
    var that = this
    var severImgFiles = [];

    // 显示重选图片
    if (!this.data.chooseImgFlag) {
      this.setData({
        chooseImgFlag: true
      });
    }

    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      success: function(res) {
        // TODO
        wx.showLoading({
          title: '上传图片中',
        });

        for (var i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: app.globalData.serverHost + '/open/upload/' + app.globalData.userData.uid,
            filePath: res.tempFilePaths[i],
            name: 'img_' + i,
            success: function (res) {
              wx.hideLoading();

              var data = res.data;
              data = JSON.parse(data);
              if (data.data) {
                severImgFiles.push(app.globalData.serverHost + "/files/" + data.data[0].file_name);
                that.setData({
                  tempImgFiles: severImgFiles
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

  chooseVedio: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 15,
      success: function (res) {
        wx.showLoading({
          title: '上传视频中',
        });

        wx.uploadFile({
          url: app.globalData.serverHost + '/open/upload/' + app.globalData.userData.uid,
          filePath: res.tempFilePath,
          name: 'vedio',
          success: function (res) {
            wx.hideLoading();

            var data = res.data;
            data = JSON.parse(data);
            if (data.data) {
              that.setData({
                tempVedioFile: app.globalData.serverHost + "/files/" + data.data[0].file_name
              });
            }
          }
        });
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发布商品'
    });
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