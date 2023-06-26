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
    },
    toast(title, duration=2000) {//toast 提示
        wx.showToast({
            title,
            icon: 'none',
            mask: true,
            duration
        })
    },
})