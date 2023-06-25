var app = getApp();

Page({
    data: {
        isShow: false
    },
    onLoad: function() {
        wx.getLocation({
            type: 'String',
            success: function(res) {
            },
            fail: () => {
            }
        })
    },
    goback: function() {
        wx.redirectTo({
            url: '/pages/index'
        })
    },
    onShow: function() {
    }
})