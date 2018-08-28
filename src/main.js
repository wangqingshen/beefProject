// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import { WechatPlugin } from 'vux'
import VueClipboard from 'vue-clipboard2'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import axios from 'axios'
import {TransferDom} from 'vux'
import '../static/less/style.less'
import {
	base64,
	dateFormat,
	md5,
	numberComma,
	numberPad,
	numberRandom,
	querystring,
	trim
} from 'vux'
import {
	Tab,
	TabItem,
	Card,
	Flexbox,
	FlexboxItem,
	XImg,
	Toast
} from 'vux'
import Home from './pages/Home'
import ShoppingCar from './pages/ShoppingCar'
import Order from './pages/Order'
import My from './pages/My'
import ProductDetail from './pages/ProductDetail'
import ChangePhone from './pages/ChangePhone'
import Address from './pages/Address'
import AddAddress from './pages/AddAddress'
import OrderDetail from './pages/OrderDetail'
import ConfirmOrder from './pages/ConfirmOrder'
import FxCenter from './pages/FxCenter'
import Balance from './pages/Balance'
import BindCustomer from './pages/BindCustomer'
import Forward from './pages/Forward'
import Extension from './pages/Extension'

Vue.directive('transfer-dom', TransferDom)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('card', Card)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('x-img', XImg)
Vue.component('toast', Toast)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.use(WechatPlugin)
Vue.use(VueLazyLoad,{
    error:'./static/images/lazy_img.jpg',
    loading:'./static/images/lazy_img.jpg'
})
Vue.prototype.$http = axios;
axios.defaults.withCredentials = false;


const routes = [{
	path: '/',
	component: Home,
	name: 'home',
	meta: {
		title: '内蒙特色微商城'
	}
}, {
	path: '/shoppingCar',
	component: ShoppingCar,
	name: 'shoppingCar',
	meta: {
		title: '购物车'
	}
}, {
	path: '/order',
	component: Order,
	name: 'order',
	meta: {
		title: '我的订单'
	}
}, {
	path: '/my',
	component: My,
	name: 'my',
	meta: {
		title: '我的'
	}
}, {
	path: '/productDetail',
	component: ProductDetail,
	name: 'productDetail',
	meta: {
		title: '商品详情'
	}
}, {
	path: '/changePhone',
	component: ChangePhone,
	name: 'changePhone',
	meta: {
		title: '修改手机号码'
	}
}, {
	path: '/address',
	component: Address,
	name: 'address',
	meta: {
		title: '收货地址'
	}
}, {
	path: '/addAddress',
	component: AddAddress,
	name: 'addAddress',
	meta: {
		title: '收货地址'
	}
}, {
	path: '/orderDetail',
	component: OrderDetail,
	name: 'orderDetail',
	meta: {
		title: '订单详情'
	}
}, {
	path: '/confirmOrder',
	component: ConfirmOrder,
	name: 'confirmOrder',
	meta: {
		title: '确认订单'
	}
}, {
	path: '/fxCenter',
	component: FxCenter,
	name: 'fxCenter',
	meta: {
		title: '我的分销中心'
	}
}, {
	path: '/balance',
	component: Balance,
	name: 'balance',
	meta: {
		title: '我的余额'
	}
}, {
	path: '/bindCustomer',
	component: BindCustomer,
	name: 'bindCustomer',
	meta: {
		title: '绑定客户'
	}
}, {
	path: '/forward',
	component: Forward,
	name: 'forward',
	meta: {
		title: '提现'
	}
}, {
	path: '/extension',
	component: Extension,
	name: 'extension',
	meta: {
		title: '推广订单'
	}
}]

const router = new VueRouter({
	// routes
	base: '/vue/mongolia/',
	mode: 'history',
	routes: routes
})

const store = new Vuex.Store({})

store.registerModule('vux', { 
  state: {
  	url: '',
    isLoading: false
  },
  mutations: {
  	setUrl(state, url) {
  		state.url = url
  	},
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
})

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.prototype.resolve = function(d) {
	return JSON.parse(base64.decode(JSON.parse(base64.decode(d))[0]))
}

Vue.prototype.apiUrl = 'http://api.manyouku.com/wechatShop'
// Vue.prototype.apiUrl = 'api'

Vue.prototype.mergeInfo = function(type, name, d) {
	function getRandStr(n) {
		let str = '';
		for (let i = 0; i < n; i++) {
			str += Math.floor(Math.random() * 10).toString();
		}
		return str;
	}

	function getCurTime() {
		let date = new Date(),
			y = date.getFullYear().toString().substr(2),
			m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString(),
			d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString(),
			h = date.getHours() % 12 < 10 ? '0' + date.getHours() % 12 : (date.getHours() % 12).toString(),
			i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString(),
			s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString();
		return (y + m + d + h + i + s);
	}

	var appId = 'wechatShop',
		randStr = getRandStr(5),
		date = getCurTime(),
		// timestamp = new Date().getTime(),
		signature = hex_sha1(hex_sha1(date + randStr) + appId),
		info = {
			"header": {
				"timestamp": date,
				"nonce": randStr,
				"signature": signature
			},
			"cmd": {},
			"data": d
		};
	info['cmd'][type] = name;
	info = base64.encode(JSON.stringify(info));
	var arr = [];
	arr.push(info);
	arr.push(appId);
	info = base64.encode(JSON.stringify(arr));
	return info;
}

Vue.prototype.wxbase = function(title, img, link, content){
	// var url = ''
 //    // 判断是否是ios微信浏览器
 //    if (window.__wxjs_is_wkwebview === true) {
 //    	url = this.$store.state.url.split('#')[0]
 //    } else {
 //    	url = window.location.href.split('#')[0]
 //    }
	var timestamp = Date.parse(new Date()).toString(),
		nonceStr = '123456',
		url = window.location.href,
		d = {
			'nonce_str': nonceStr,
			'timestamp': timestamp,
			'url': url
		};
	this.$http.post(this.apiUrl+'/member/getWechatSignature', this.mergeInfo('member','getWechatSignature',d)).then(res=>{
		var r = this.resolve(res.data);
		if(r.code == 1) {
			var signature = r.data.signature,
				appid = r.data.appid;
			Vue.wechat.config({  
			    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。  
			   	appId: appid, // 必填，公众号的唯一标识  
			    timestamp: timestamp, // 必填，生成签名的时间戳  
			    nonceStr: nonceStr, // 必填，生成签名的随机串  
			    signature: signature,// 必填，签名，见附录1  
			    jsApiList: [
		            'onMenuShareAppMessage','onMenuShareTimeline',
		            'onMenuShareQQ','onMenuShareQZone'
		        ]
			}); 
			Vue.wechat.error(function (res) {
	          	console.log(res);
	        });
			Vue.wechat.ready(function(){
				//分享到朋友圈
          		Vue.wechat.onMenuShareTimeline({
            		title: title, // 分享标题
            		desc: content,
            		link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            		imgUrl: img, // 分享图标
            		success: function (res) {
              			// 用户确认分享后执行的回调函数
              			logUtil.printLog("分享到朋友圈成功返回的信息为:",res);
            		},
            		cancel: function (res) {
              			// 用户取消分享后执行的回调函数
              			logUtil.printLog("取消分享到朋友圈返回的信息为:",res);
            		}
          		});
          		//分享给朋友
          		Vue.wechat.onMenuShareAppMessage({
	            	title: title, // 分享标题
	            	desc: content, // 分享描述
	            	link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
	            	imgUrl: img, // 分享图标
	            	type: '', // 分享类型,music、video或link，不填默认为link
	            	dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
	            	success: function (res) {
	              		logUtil.printLog("分享给朋友成功返回的信息为:",res);
	            	},
	            	cancel: function (res) {
	              		// 用户取消分享后执行的回调函数
	              		logUtil.printLog("取消分享给朋友返回的信息为:",res);
	            	}
	          	});
				//分享到QQ
				Vue.wechat.onMenuShareQQ({
					title: title, // 分享标题
					desc: content, // 分享描述
					link: link, // 分享链接
					imgUrl: img, // 分享图标
					success: function(res) {
						// 用户确认分享后执行的回调函数
						logUtil.printLog("分享到QQ好友成功返回的信息为:", res);
					},
					cancel: function(res) {
						// 用户取消分享后执行的回调函数
						logUtil.printLog("取消分享给QQ好友返回的信息为:", res);
					}
				});

				//分享到QQ空间
				Vue.wechat.onMenuShareQZone({
					title: title, // 分享标题
					desc: content, // 分享描述
					link: link, // 分享链接
					imgUrl: img, // 分享图标
					success: function(res) {
						// 用户确认分享后执行的回调函数
						logUtil.printLog("分享到QQ空间成功返回的信息为:", res);
					},
					cancel: function(res) {
						// 用户取消分享后执行的回调函数
						logUtil.printLog("取消分享到QQ空间返回的信息为:", res);
					}
				});
			})
		}
	}).catch(res=>{
		console.log(res)
	})
}

Vue.prototype.shield = function() {
	function onBridgeReady() { 
    	WeixinJSBridge.call('hideOptionMenu'); 
	}  
	if (typeof WeixinJSBridge == "undefined") { 
	    if (document.addEventListener) { 
	        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false); 
	    } else if (document.attachEvent) { 
	        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady); 
	    } 
	} else { 
	    onBridgeReady(); 
	}
}

Vue.prototype.openShield = function() {
	function onBridgeReady() { 
    	WeixinJSBridge.call('showOptionMenu'); 
	}  
	if (typeof WeixinJSBridge == "undefined") { 
	    if (document.addEventListener) { 
	        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false); 
	    } else if (document.attachEvent) { 
	        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady); 
	    } 
	} else { 
	    onBridgeReady(); 
	}
}

Vue.prototype.splitUrl = function() {
	let url = window.location.href;
	return url.split('?')[0]
}

router.beforeEach(async (to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (!store.state.url) {
    store.commit('setUrl', document.URL)
  }
  // store.commit('updateLoadingStatus', {isLoading: true})
  
  next()
})

router.afterEach(function (to) {
	// setTimeout(res=>{
	// 	store.commit('updateLoadingStatus', {isLoading: false})
	// }, 500)
})

/* eslint-disable no-new */
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app-box')