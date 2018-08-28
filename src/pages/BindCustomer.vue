<template>
	<div id="bindCustomer" class="page">
		<div class="bindList" v-if="list.length" >
			<swipeout class="vux-1px-tb">
		      	<swipeout-item :disabled="true" transition-mode="follow" v-for="(item, index) in list" :key="index">
		        	<div slot="content" class="swipeContent">
		        		<a href="javascript:void(0)" class="weui-media-box weui-media-box_appmsg">
            				<div class="weui-media-box__hd">
              					<img class="weui-media-box__thumb" :src="item.src" alt="">
            				</div>
            				<div class="weui-media-box__bd">
              					<p class="bindName">{{item.name}}</p>
              					<p>成交金额: <span class="bindAccount"><img src="../../static/images/ic_unit.svg" alt="">{{item.account}}</span></p>
              					<p>订单: <span class="bindNum">{{item.ordernum}}</span></p>
              					<p>绑定时间: <span class="bindTime">{{item.date}}</span></p>
            				</div>
          				</a>
		        	</div>
		      	</swipeout-item>
		    </swipeout>
		</div>
		<div class="noData" v-if="!list.length">
			<img src="../../static/images/no_user.png" alt="">
			<p>暂无绑定客户</p>
		</div>
	</div>
</template>
<script>
	import {Swipeout, SwipeoutItem} from 'vux';
	export default {
		name: 'bindCustomer',
		components: {Swipeout, SwipeoutItem},
		data () {
			return {
				bindCustomer: '120.00',
				list: [
					{id: 1, src: '../../static/images/product_1.png', name: '吉祥如意', account: '450.00', ordernum: 12, date: '2016-09-12'},
					{id: 2, src: '../../static/images/product_2.png', name: '王小圆', account: '120.00', ordernum: 50, date: '2017-08-23'},
					{id: 3, src: '../../static/images/product_3.png', name: '朱雀的爱豆', account: '3700.00', ordernum: 76, date: '2015-01-23'},
				],
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
#bindCustomer {
	.bindList {
		.vux-swipeout-item {
			&:after {
				content: " ";
			    position: absolute;
			    left: 0;
			    bottom: -1px;
			    right: 0;
			    height: 1px;
			    border-top: 1px solid #D9D9D9;
			    color: #D9D9D9;
			    -webkit-transform-origin: 0 0;
			    transform-origin: 0 0;
			    -webkit-transform: scaleY(0.5);
			    transform: scaleY(0.5);
			}
			.swipeContent {
				height: 110px;
				padding: 10px 14px;
				box-sizing: border-box;
				.weui-media-box_appmsg {
					/*justify-content: */
					.weui-media-box__hd {
						width: 90px; 
						height: 90px;
						margin-right: 10px;
						>img {
							height: 100%;
						}
					}
					.weui-media-box__bd {
						p {
							font-size: 13px;
							line-height: 20px;
							margin-top: 3px;
							color: #9b9b9b;
							&.bindName {
								color: #4a4a4a;
							}
							span {
								color: #4a4a4a;
								margin-left: 5px;
								&.bindAccount {
									color: #E23535;
									img {
										width: 8px;
										height: 11px;
									}
								}
							}
						}
					}
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