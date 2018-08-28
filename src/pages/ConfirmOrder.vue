<template>
	<div id="confirmOrder" class="page">
		<group class="order-address-box">
			<cell-box is-link :link="{path: '/address', query: {t: 2}}">
	        	<img width="18" class="ic-address" src="../../static/images/ic_address.svg">
				<div v-if="!addressState">
					{{selectAddress}}
				</div>
				<div v-if="addressState" style="padding-right: 21px;width: 100%;">
					<div class="address-header">
						<span class="address-name">收货人：{{addressInfo.true_name}}</span>
						<span class="address-mob">{{addressInfo.mobile}}</span>
					</div>
					<div class="address-content">
						收货地址：{{addressInfo.address}}
					</div>
				</div>
	      	</cell-box>
	      	<div class="order-line"></div>
		</group>
		<section class="content">
			<swipeout class="vux-1px-tb">
			    <swipeout-item :disabled="true" transition-mode="follow" v-for="(citem, i) in orderList" :key="i">
			    	<div slot="content" class="swipeContent">
			    		<a href="javascript:void(0)" class="weui-media-box weui-media-box_appmsg">
		        			<div class="weui-media-box__hd">
		        				<img class="weui-media-box__thumb" v-lazy="citem.goods_img" alt="">
		        			</div>
		        			<div class="weui-media-box__bd">
		        				<h4 class="weui-media-box__title" v-html="citem.goods_name"></h4>
		        				<p class="weui-media-box__desc">
		        					<span class="weui-price"><img src="../../static/images/ic_unit.svg" alt=""> {{citem.goods_price}}</span>
		        					<!-- <inline-x-number style="display:block;" :min="0" width="50px" button-style="round">{{citem.num}}</inline-x-number> -->
		        					<span class="weui-num">x {{citem.goods_num}}</span>
		        				</p>
		        			</div>
		      			</a>
			    	</div>
			    </swipeout-item>
			</swipeout>
			<div class="order-price-box">
				<p><span class="price-text">商品总价：</span><span class="price-value">￥ {{total}}</span></p>
				<p><span class="price-text">运费：</span><span class="price-value">￥ {{fare}}</span></p>
				<div class="order-price-item">
					<span>订单金额：</span><img src="../../static/images/ic_unit.svg" alt=""> {{total.toFixed(2)}}</span>
				</div>
			</div>
		</section>
		<footer>
		    <flexbox>
		    	<flexbox-item>
		          	<x-button class="pay-btn":class="{'confirm': addressState}" type="warn" @click.native="createOrder"><img width="20" class="ic-address" src="../../static/images/ic_wechat.svg">微信支付</x-button>
		        </flexbox-item>
		    </flexbox>
		</footer>
		<div v-transfer-dom>
	      <loading :show="submitStatus" text=""></loading>
	    </div>
	    <toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
	</div>
</template>
<script>
	import {XButton, Cell, CellBox, Swipeout, SwipeoutItem, InlineXNumber, Group, Loading} from 'vux';
	export default {
		name: 'confirmOrder',
		components: {XButton, Cell, CellBox, Swipeout, SwipeoutItem, InlineXNumber, Group, Loading},
		data () {
			return {
				addressId: '',
				info: '',
				type: '',
				selectAddress: '请选择您的收货地址',
				addressInfo: '',
				orderList: [],
				total: 0,
				fare: 0, //运费
				addressState: false,
				submitStatus: false,
				toastStatus: false,
				toastTip: '',
			}
		},
		mounted () {
			this.shield();
			this.info = localStorage.getItem('orderConfirmInfo');
			this.type = localStorage.getItem('orderConfirmType');
			this.getInfo();
		},
		methods: {
			getInfo() {
				let d = JSON.parse(this.info),
					url = '',
					mergeInfo = '';
				if(this.type == 1) {
					url = this.apiUrl+'/order/buynow';
					mergeInfo = this.mergeInfo('order','buynow',d);
				}else if(this.type == 2) {
					url = this.apiUrl+'/order/settlement';
					mergeInfo = this.mergeInfo('order','settlement',d);
				}
				this.$http.post(url, mergeInfo).then(res=>{
					var r = this.resolve(res.data);
					console.log(r.data)
					if(r.code == 1) {
						if(r.data.address.address_id != undefined) {
							this.addressState = true;
							this.addressInfo = r.data.address;
							this.addressId = r.data.address.address_id;
						}else{
							this.addressState = false;
							this.addressInfo = '';
							this.addressId = '';
						}
						this.orderList = r.data.goods_list;
						this.fare = r.data.shipping_fee;
						this.total = r.data.order_amount;
					}else{
						this.toastStatus = true;
						this.toastTip = r.msg
					}
				}).catch(res=>{
					console.log(res);
				})
			},

			createOrder() {
				if(!this.addressState) return;
				this.submitStatus = true;
				var d = {};
				d.order_goods = {};
				this.orderList.forEach(function(item){
					d.order_goods[item.sku_id] = item.goods_num;
				})
				d.member_id = localStorage.getItem('member_id');
				d.address_id = this.addressId;
				this.$http.post(this.apiUrl+'/order/createOrder', this.mergeInfo('order','createOrder',d)).then(res=>{
					var r = this.resolve(res.data);
					if(r.code == 1) {
						this.wxPay(r.data)
					}else{
						this.submitStatus = false;
						this.toastStatus = true;
						this.toastTip = r.msg
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res);
				})
			},

			wxPay(order_sn) {
				let d = {
					openid: localStorage.getItem('openid'),
					order_sn: order_sn
				}
				console.log(d)
				this.$http.post(this.apiUrl+'/order/wxpay', this.mergeInfo('order','wxpay',d)).then(res=>{
					var r = this.resolve(res.data);
					console.log(r)
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
							_this.$router.push({path: '/order'})
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
			}
		}
	}
</script>
<style lang="less">
#confirmOrder {
	.order-address-box {
		.weui-cells {
			width: 100%;
			margin-top: 0;
			font-size:15px;
			color: #4A4A4A;
			line-height: 17px;
			justify-content: center;
			align-items: center;
			&:before, &:after {
				display: none;
			}
			.weui-cell {
				height: 100px;
				padding: 0 14px;
				box-sizing: border-box;
				img {
					margin-right: 12px;
				}
				.weui-cell__ft {
					color: #9b9b9b;
					padding-right: 16px;
				}
				.address-header {
					font-size: 15px;
					line-height: 16px;
					margin-bottom: 10px;
					overflow: hidden;
					clear: both;
					.address-mob {
						float: right;
					}
				}
				.address-content {
					font-size: 13px;
					line-height: 20px;
					overflow:hidden; 
					text-overflow:ellipsis;
					display:-webkit-box; 
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
				    padding: 0;
				}
				&:after{
					border-color:#4A4A4A;
				}
			}
		}
		.order-line {
			width: 100%;
			height: 4px;
			background-image: url('../../static/images/line.png');
			background-repeat: no-repeat;
			background-size: cover;
		}
	}
	section.content {
		margin: 4px 0;
		.vux-swipeout-item {
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
							.vux-inline-x-number {
								flex: 1;
								>div {
									display: flex;
									justify-content: flex-end;
								}
								.vux-number-selector {
									border: 0;
									height: 22px;
									padding: 0;
									.strokeClass {
										stroke: #808080;
									}
									&.vux-number-disabled  {
										.strokeClass {
											stroke: #D3D3D3;
										}
									}
									svg{
										width:22px;
										height: 22px;
									}
								}
								.vux-number-input{
									color: #808080;
									font-size: 14px;
									height: 22px;
									width: 40px !important;
									padding: 0;
								}
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
	}
	footer {
		padding: 5px 14px;
		background-color: #fff;
		.vux-flexbox-item {
			&:last-child {
				margin-left: 5px !important;
			}
			button {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 40px;
				font-size: 13px;
				border-radius: 4px;
				>img {
					margin-right: 3px;
				}
			}
			.pay-btn {
				background-color: #C8C8C8;
				color: #fff;
				&:after {
					border: none;
				}
				&.confirm {
					background-color: #E23535;
				}
			}
		}
	}
}
</style>