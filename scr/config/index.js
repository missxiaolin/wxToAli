// 目录
const DIR = "/Users/xiaolin/web/monster-client-app"

// js函数名的替换
const JSmethod = [
    "request--->httpRequest",
	'login--->getAuthCode',
	'showModal--->confirm',
	'getUserInfo--->getAuthUserInfo',
	'requestPayment--->tradePay',
	'saveImageToPhotosAlbum--->saveImage',
	'setNavigationBarTitle--->setNavigationBar', // 导航栏标题
	'setNavigationBarColor--->setNavigationBar', // 导航栏颜色
	'getClipboardData--->getClipboard', // 粘贴板
	'setClipboardData--->setClipboard', // 粘贴板
	'canvasToTempFilePath--->toTempFilePath', // 1.1.3 当前画布的内容导出生成图片
	'scanCode--->scan',
	'closeBLEConnection--->disconnectBLEDevice'
]

// js中的函数参数的替换
const JS = [
    'getStorageSync\(\s*(\S+)\s*\)--->getStorageSync({key:$1})',
	'setStorageSync\(\s*(\S+)\s*\,\s*(\S+)\s*\)--->setStorageSync({key:$1,data:$2})',
	'removeStorageSync\(\s*(\S+)\s*\)--->removeStorageSync({key:$1})',
	'vibrateLong\(\s*?\{[\w\W]*?\}\s*?\)--->vibrate()',
	'vibrateShort\(\s*?\{[\w\W]*?\}\s*?\)--->vibrate()',
	'(\S+)\s*:\s*function--->$1 #es6的对象方法样式',
]

// axml中的内容替换
const AXML = [
    '(^||\s+)wx:--->$1a:',
	'(^||\s+)bindtap(\W+)--->$1onTap$2',
	'(^||\s+)bindlongTap(\W+)--->$1onLongTap$2',
	'(^||\s+)bindinput(\W+)--->$1onInput$2',
	'(^||\s+)bindchange(\W+)--->$1onChange$2',
	'(^||\s+)bindinput(\W+)--->$1onInput$2',
	'(^||\s+)bindfocus(\W+)--->$1onFocus$2',
	'(^||\s+)bindblur(\W+)--->$1onBlur$2',
	'(^||\s+)bindconfirm(\W+)--->$1onConfirm$2',
	'(^||\s+)bindsubmit(\W+)--->$1onSubmit$2',
	'(^||\s+)bindreset(\W+)--->$1onReset$2',
	'(^||\s+)bindtouchstart(\W+)--->$1onTouchStart$2',
	'(^||\s+)bindtouchmove(\W+)--->$1onTouchMove$2',
	'(^||\s+)bindtouchend(\W+)--->$1onTouchEnd$2',
	'(^||\s+)bindtouchcancel(\W+)--->$1onTouchCancel$2',
	'(^||\s+)bindlongtap(\W+)--->$1onLongTap$2',
	'(^||\s+)bindmarkertap(\W+)--->$1onMarkerTap$2',
	'(^||\s+)bindcallouttap(\W+)--->$1onCalloutTap$2',
	'(^||\s+)bindcontroltap(\W+)--->$1onControlTap$2',
	'(^||\s+)bindregionchange(\W+)--->$1onRegionChange$2',
	'(^||\s+)canvas-id(\W+)--->$1id$2',
	'(^||\s+)bind(\w+)(\W+)--->$1on$2$3'
]

// json中的内容替换
const JSON = [
    '(^||\s+\W)navigationBarTextStyle(\W)--->$1titleBarColor$2',
	'(^||\s+\W)navigationBarTitleText(\W)--->$1defaultTitle$2',
	'(^||\s+\W)enablePullDownRefresh(\W)--->$1pullRefresh$2',
	'(^||\s+\W)disableScroll(\W)--->$1allowsBounceVertical$2',
	'(^||\s+\W)color(\W)--->$1textColor$2',
	'(^||\s+\W)list(\W)--->$1items$2',
	'(^||\s+\W)text(\W)--->$1name$2',
	'(^||\s+\W)iconPath(\W)--->$1icon$2',
	'(^||\s+\W)iconPath(\W)--->$1icon$2',
	'(^||\s+\W)selectedIconPath(\W)--->$1activeIcon$2'
]

export {
    DIR,
    JSmethod,
    JS,
    AXML,
    JSON
}