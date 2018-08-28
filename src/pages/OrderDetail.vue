<template>
	<div id="orderDetail" class="page" v-if="show">
		<div v-if="orderStatus == 1 && timeShow" class="clock-content">
			<img src="../../static/images/ic_clock.svg" class="clock-img" />
			<span>还剩{{time}}自动取消订单</span>
		</div>
		<section class="content">
			<div class="order-item-box">
				<div class="order-item-header">
					<span class="order-id">订单编号：{{order_sn}}</span>
					<span :class="{'order-status': true, 'red': orderStatus == '1', 'green': (orderStatus == '2' || orderStatus == '3')}">{{orderStatus == '1' ? '待付款' : (orderStatus == '2' ? '待发货' : (orderStatus == '3' ? '待收货': (orderStatus == '5' ? '已取消':'已完成')))}}</span>
				</div>
				<swipeout class="vux-1px-tb">
				    <swipeout-item :disabled="true" transition-mode="follow" v-for="(citem, i) in orderList" :key="i">
				    	<div slot="content" class="swipeContent">
				    		<a href="javascript:void(0)" class="weui-media-box weui-media-box_appmsg">
		            			<div class="weui-media-box__hd">
		            				<img class="weui-media-box__thumb" v-lazy="citem.goods_img" alt="">
		            			</div>
		            			<div class="weui-media-box__bd">
		            				<h4 class="weui-media-box__title" v-html="citem.spu_name"></h4>
		            				<p class="weui-media-box__desc">
		            					<span class="weui-price"><img src="../../static/images/ic_unit.svg" alt=""> {{citem.goods_price}}</span>
		            					<span class="weui-num">x {{citem.goods_num}}</span>
		            				</p>
		            			</div>
		          			</a>
				    	</div>
				    </swipeout-item>
				</swipeout>
			</div>
			<div class="order-price-box">
				<p><span class="price-text">商品总价：</span><span class="price-value">￥ {{total}}</span></p>
				<p><span class="price-text">运费：</span><span class="price-value">￥ {{fare}}</span></p>
				<div class="order-price-item">
					<span>订单金额：</span><img src="../../static/images/ic_unit.svg" alt=""> {{Number(total).toFixed(2)}}</span>
				</div>
			</div>
			<div class="order-address-box" v-if="orderStatus != 1">
				<div class="order-address-item">
					<span style="margin-right: 40px;">收货人：{{addressInfo.true_name}}</span>
					<span>{{addressInfo.mobile}}</span>
				</div>
				<div class="order-address-item">
					<span>收货地址：{{addressInfo.address}}</span>
				</div>
			</div>
			<div class="order-time-box">
				<p class="order-xd order-time-item">下单时间： {{orderDate}}</p>
				<p class="order-fk order-time-item" v-if="orderStatus != 1 && orderStatus != 5">付款时间： {{paymentDate}}</p>
				<p class="order-fh order-time-item" v-if="orderStatus != 1 && orderStatus != 2 && orderStatus != 5">发货时间： {{deliveryDate}}</p>
			</div>
		</section>
		<footer>
			<flexbox v-if="orderStatus == 1">
		        <flexbox-item>
		          	<x-button class="cancel-btn" type="primary" plain @click.native="open(1)">取消订单</x-button>
		        </flexbox-item>
		        <flexbox-item>
		          	<x-button class="pay-btn" type="warn" @click.native="wxPay">去支付</x-button>
		        </flexbox-item>
		    </flexbox>
		    <flexbox v-if="orderStatus == 3">
		    	<flexbox-item>
		          	<x-button class="pay-btn" type="warn" @click.native="open(2)">确认收货</x-button>
		        </flexbox-item>
		    </flexbox>
		</footer>
		<toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
		<div v-transfer-dom>
	      <loading :show="submitStatus" text="" position="middle"></loading>
	    </div>
	    <div v-transfer-dom>
	      	<x-dialog v-model="dialogStatus" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
	        	<div class="dialog-box">
			        <span class="dialog-close"  @click="dialogStatus=false"><img src="../../static/images/ic_close.svg" alt=""></span>
	        		<div class="dialog-box-header">
	        			<p>{{dialogTips}}</p>
	        		</div>
	        		<div class="dialog-box-button" style="margin-top: 60px;">
	        			<flexbox>
					        <flexbox-item>
					          	<x-button class="cancel-btn" type="primary" plain @click.native="dialogStatus=false">再想想</x-button>
					        </flexbox-item>
					        <flexbox-item>
					          	<x-button class="confirm-btn" type="warn" @click.native="confirmEvt">确定</x-button>
					        </flexbox-item>
					    </flexbox>
	        		</div>
	        	</div>
	      	</x-dialog>
	    </div>
	</div>
</template>
<script>
	import {XButton, Swipeout, SwipeoutItem, Loading, XDialog} from 'vux';
	export default {
		name: 'orderDetail',
		components: {XButton, Swipeout, SwipeoutItem, Loading, XDialog},
		data () {
			return {
				id: '',
				order_sn: '',
				orderStatus: '',
				orderList: [],
				total: 0,
				fare: 0, //运费
				orderDate: '',
				paymentDate: '',
				deliveryDate: '',
				timeShow: false,
				time: '',
				leftTime: '',
				addressInfo: '',
				flag: false,
				show: false,
				submitStatus: false,
				toastStatus: false,
				toastTip: '',
				interval: '',
				dialogStatus: false,
				dialogTips: '',
				dialogType: ''
			}
		},
		mounted () {
			this.shield();
			this.id = this.$route.query.id;
			this.getInfo();
		},
		beforeRouteLeave (to, from, next) {
		    clearInterval(this.interval);
		    next();
		},
		methods: {
			cancelOrder() {
				this.submitStatus = true;
				let d = {'order_id': this.id}
				this.$http.post(this.apiUrl+'/order/cancelOrder', this.mergeInfo('order','cancelOrder',d)).then(res=>{
					var r = this.resolve(res.data);
					this.submitStatus = false;
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '订单已取消';
						this.dialogStatus = false;
						this.getInfo();
					}else{
						this.toastTip = r.msg;
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res)
				})
			},

			getInfo() {
				let d = {'order_id': this.id}
				this.$http.post(this.apiUrl+'/order/orderDetail', this.mergeInfo('order','orderDetail',d)).then(res=>{
					var r = this.resolve(res.data);
					if(r.code == 1) {
						this.order_sn = r.data.order_sn;
						this.orderList = r.data.order_goods;
						this.total = r.data.order_amount;
						this.fare = r.data.shipping_fee;
						this.orderStatus = r.data.order_state;
						this.addressInfo = r.data.reciver_info;
						this.orderDate = r.data.create_time;
						this.paymentDate = r.data.pay_time;
						this.deliveryDate = r.data.shipping_time;
						if(r.data.order_state == 1) {
							this.leftTime = Number(r.data.time_limit);
							let n = 1;
							this.interval = setInterval(()=>{
				               	if(this.flag == true){
				               		this.cancelOrder();
				                   	clearInterval(this.interval)
				                   	return;
				               	}
				               	this.timeDown(n);
				               	n++;
				           	},1000)
						}
					}
					this.show = true;
				}).catch(res=>{
					console.log(res)
				})
			},

			confirmOrder() {
				this.submitStatus = true;
				let d = {'order_id': this.id}
				this.$http.post(this.apiUrl+'/order/comfirmOrder', this.mergeInfo('order','comfirmOrder',d)).then(res=>{
					var r = this.resolve(res.data);
					this.submitStatus = false;
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '订单确认成功';
						this.dialogStatus = false;
						this.getInfo();
					}else{
						this.toastTip = r.msg
					}
				}).catch(res=>{
					this.submitStatus = false
					console.log(res)
				})
			},

			confirmEvt() {
				if(this.dialogType == 1) {
					this.cancelOrder()
				}else if(this.dialogType == 2) {
					this.confirmOrder()
				}
			},
			
			open(type) {
				this.dialogStatus = true;
				this.dialogType = type;
				if(type == 1) {
					this.dialogTips = '确定要取消该笔订单吗？'
				}else if(type == 2) {
					this.dialogTips = '确定已经收到货了吗？'
				}
			},

			wxPay() {
				this.submitStatus = true;
				let d = {
					openid: localStorage.getItem('openid'),
					order_sn: this.order_sn
				}
				this.$http.post(this.apiUrl+'/order/wxpay', this.mergeInfo('order','wxpay',d)).then(res=>{
					var r = this.resolve(res.data);
					this.submitStatus = false;
					if(r.code == 1) {
						this.callPay(r.data)
					}else{
						this.toastStatus = true;
						this.toastTip = r.msg
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res);
				})
			},

			jsApiCall(d) {
				let _this = this;
				let wechat_pay_parameters = JSON.parse(d);
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest',
					wechat_pay_parameters,
					function(res){
						WeixinJSBridge.log(res.err_msg);
						if(res.err_msg == 'get_brand_wcpay_request:ok') {
							_this.$router.push({path: '/order'})
						}else{
							// _this.$router.push({path: '/order'})
						}
					}
				);
			},

			callPay(d) {
				if (typeof WeixinJSBridge == "undefined"){
				    if( document.addEventListener ){
				        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(d), false);
				    }else if (document.attachEvent){
				        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall(d)); 
				        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall(d));
				    }
				}else{
				    this.jsApiCall(d);
				}
			},

			timeDown(n) {
				this.timeShow = true
				let leftT = this.leftTime - n;
               	let m = this.formate(parseInt(leftT/60%60))
               	let s = this.formate(parseInt(leftT%60))
               	if(leftT <= 0){
                   this.flag = true
                   return;
               	}
               	this.time = m+'分'+s+'秒'
			},

			formate(time) {
               	if(time>=10){
                   return time
               	}else{
                   return '0'+time
               	}
           	}

		}
	}
</script>
<style lang="less">
#orderDetail {
	.clock-content {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 50px;
		padding: 0 14px;
		box-sizing: border-box;
		background-color: #F66262;
		font-size: 14px;
		color: #fff;
		>img {
			width: 16px;
			height: 16px;
			margin-right: 20px;
		}
	}
	section.content {
		.order-item-box {
			background-color: #fff;
			/*margin-bottom: 4px;*/
			.order-item-header {
				position: relative;
				display: flex;
				justify-content: space-between;
				font-size: 13px;
				height: 44px;
				line-height: 44px;
				padding: 0 15px;
				&:after {
					content: " ";
				    position: absolute;
				    left: 0;
				    bottom: -1px;
				    right: 0;
				    height: 1px;
				    border-top: 1px solid #EDEDED;
				    color: #EDEDED;
				    -webkit-transform-origin: 0 0;
				    transform-origin: 0 0;
				    -webkit-transform: scaleY(0.5);
				    transform: scaleY(0.5);
				}
				.order-id {
					color: #515151;
				}
				.order-status {
					color: #4A4A4A;
					&.red {
						color: #E23535;
					}
					&.green {
						color: #65B30B;
					}
				}
			}
			.swipeContent {
				position:relative;
				padding: 10px 14px;
				box-sizing: border-box;
				a.weui-media-box {
					.weui-media-box__hd {
						width: 100px;
						height: 100px;
						margin-right: 10px;
						line-height: 100px;
						>img.weui-media-box__thumb {
							height: 100%;
						}
					}
					.weui-media-box__bd {
						position: relative;
						height: 100px;
						.weui-media-box__title {
							color: #4A4A4A;
							font-size: 13px;
							font-weight: 600;
							overflow: hidden;
						    text-overflow: ellipsis;
						    display: -webkit-box;
						    -webkit-box-orient: vertical;
						    -webkit-line-clamp: 2;
						    line-height: 18px;
						    margin-top: -2px;
						}
						.weui-media-box__desc {
							width: 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							position: absolute;
							left: 0;
							bottom: 0;

							.weui-price {
								flex: 1;
								font-size: 16px;
								color: #E23535;
								letter-spacing: -1px;
								>img {
									width: 8px;
									height: 11px;

								}
							}
							.weui-num {
								color: #888;
							}
		
						}
					}
				}
				&:after {
					content: " ";
				    position: absolute;
				    left: 0;
				    bottom: -1px;
				    right: 0;
				    height: 1px;
				    border-top: 1px solid #EDEDED;
				    color: #EDEDED;
				    -webkit-transform-origin: 0 0;
				    transform-origin: 0 0;
				    -webkit-transform: scaleY(0.5);
				    transform: scaleY(0.5);
				}
			}
		}
		.order-price-box {
			background-color: #fff;
			font-size: 13px;
			p {
				display: flex;
				justify-content: space-between;
				line-height: 20px;
				padding: 0 14px;
				.price-text {
					color: #4A4A4A;
				}
				.price-value {
					color: #515151;
				}
				&:first-child {
					padding-top: 14px;
					margin-bottom: 8px;
				}
				&:nth-child(2) {
					padding-bottom: 14px;
				}
			}
			.order-price-item {
				position: relative;
				height: 50px;
				line-height: 50px;
				text-align: right;
				padding: 0 14px;
				color: #FE6D4C;
				font-size: 15px;
				&:before {
					content: " ";
				    position: absolute;
				    left: 0;
				    top: 0px;
				    right: 0;
				    height: 1px;
				    border-top: 1px solid #EDEDED;
				    color: #EDEDED;
				    -webkit-transform-origin: 0 0;
				    transform-origin: 0 0;
				    -webkit-transform: scaleY(0.5);
				    transform: scaleY(0.5);
				}
				>span {
					font-size: 14px;
					color: #515151;
					font-weight: 600;
				}
				>img {
					width: 10px;
					height: 12px;
					margin-right: -4px;
				}
			}
		}
		.order-address-box {
			background-color: #fff;
			margin-top: 4px;
			padding: 20px 14px;
			box-sizing: border-box;
			div.order-address-item {
				font-size: 13px;
				color: #4A4A4A;
				line-height: 20px;
				&:first-child {
					margin-bottom:10px;
				}
			}
		}
		.order-time-box {
			background-color: #fff;
			margin: 4px 0;
			p.order-time-item {
				position: relative;
				height: 44px;
				line-height: 44px;
				font-size: 13px;
				color: #515151;
				padding: 0 14px;
				&:not(:first-child) {
					&:before {
					content: " ";
				    position: absolute;
				    left: 0;
				    top: 0;
				    right: 0;
				    height: 1px;
				    border-top: 1px solid #EDEDED;
				    color: #EDEDED;
				    -webkit-transform-origin: 0 0;
				    transform-origin: 0 0;
				    -webkit-transform: scaleY(0.5);
				    transform: scaleY(0.5);
				}
				}
			}
		}
	}
	footer {
		background-color: #fff;
		.vux-flex-row {
			box-sizing: border-box;
			padding: 5px 14px;
		}
		.vux-flexbox-item {
			&:last-child {
				margin-left: 5px !important;
			}
			button {
				height: 40px;
				font-size: 13px;
				border-radius: 4px;
			}
			.cancel-btn {
				border-color: #E23535;
				color: #E23535
			}
			.pay-btn {
				background-color: #E23535;
				color: #fff;
			}
		}
	}
}
</style>