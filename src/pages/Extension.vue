<template>
	<div id="extension" class="page">
		<section class="content" v-if="orderList.length">
			<div class="order-item-box">
				<div class="order-item-header">
					<span class="order-id">订单编号：{{orderid}}</span>
					<span :class="{'order-status': true, 'red': orderStatus == '0', 'green': orderStatus == '1'}">{{orderStatus == '0' ? '代付款' : (orderStatus == '1' ? '待收货':'已完成')}}</span>
				</div>
				<swipeout class="vux-1px-tb">
				    <swipeout-item :disabled="true" transition-mode="follow" v-for="(citem, i) in orderList" :key="i">
				    	<div slot="content" class="swipeContent">
				    		<a href="javascript:void(0)" class="weui-media-box weui-media-box_appmsg">
		            			<div class="weui-media-box__hd">
		            				<img class="weui-media-box__thumb" :src="citem.src" alt="">
		            			</div>
		            			<div class="weui-media-box__bd">
		            				<h4 class="weui-media-box__title" v-html="citem.title"></h4>
		            				<p class="weui-media-box__desc">
		            					<span class="weui-price">￥{{citem.price}}</span>
		            					<span class="weui-num">x {{citem.num}}</span>
		            				</p>
		            				<p class="weui-media-box__bottom">
		            					佣金: <span>￥{{citem.yj}}</span>
		            				</p>
		            			</div>
		          			</a>
				    	</div>
				    </swipeout-item>
				</swipeout>
			</div>
			<div class="wx-box">
				<div class="wx-logo">
					<img :src="wxlogo" alt="">
				</div>
				<div class="wx-info">
					<p>微信昵称:  {{nickname}}</p>
					<p>订单时间:  {{ordertime}}</p>
					<p>订单金额:  ￥{{orderaccount}}</p>
					<p>佣金总额:  ￥{{yjaccount}}</p>
				</div>
			</div>	
		</section>
		<div class="noData" v-if="!orderList.length">
			<img src="../../static/images/no_order.png" alt="">
			<p>暂无推广订单</p>
		</div>
	</div>
	
</template>
<script>
	import { Swipeout, SwipeoutItem } from 'vux';
	export default {
		name: 'extension',
		components: { Swipeout, SwipeoutItem },
		data () {
			return {
				orderid: 'CH19265656569899',
				orderStatus: '1',
				orderList: [{id: 1, src: '../../static/images/product_1.png', title: '高山牦牛肉秘制酱汁牛肉干高山牦牛肉秘制酱', num: 1, price: 145, yj: '1.00'},
					{id: 2, src: '../../static/images/product_2.png', title: '高山嫩牛肉', num: 1, price: 74, yj: '2.50'},
					{id: 3, src: '../../static/images/product_3.png', title: '高山牦牛肉秘制酱汁牛肉干高山牦牛肉秘制酱高山牦牛肉秘制酱汁牛肉干高山牦牛肉秘制酱', num: 1, price: 180, yj: '1.00'}],
				wxlogo: '../../static/images/prduct_detail.png',
				nickname: '小红帽',
				ordertime: '2018-08-01 19:22:54',
				orderaccount: '120.00',
				yjaccount: '2.00'
			}
		},
		mounted () {
			this.shield();
		},
		methods: {

		}
	}
</script>
<style lang="less">
#extension {
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
							margin-top: 10px;
							.weui-price {
								flex: 1;
								font-size: 13px;
								color: #888;
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
						.weui-media-box__bottom {
							width: 100%;
							position: absolute;
							left: 0;
							bottom: 0;
							font-size: 12px;
							color: #515151;
							>span {
								color: #E23535;
								margin-left: 3px;
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
		.wx-box {
			display: flex;
			justify-content: flex-end;
			background-color: #fff;
			padding: 10px 14px;
			box-sizing: border-box;
			.wx-logo {
				flex: 1;
				img {
					width: 40px;
					height: 40px;
				}
			}
			.wx-info {
				text-align: right;
				p {
					font-size: 12px;
					color: #515151;
					line-height: 17px;
					margin-top: 3px;
				}
			}
		}
	}
	.noData {
		>img {
			display: block;
			width: 75px;
			height: 75px;
			padding-top: 65px;
			margin: 0 auto 20px;
		}
		>p {
			font-size: 14px;
			color: #4a4a4a;
			line-height: 20px;
			text-align: center;
		}
	}
}
</style>