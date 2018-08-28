<template>
	<div id="order" class="page">
		<header>
			<tab class="order-header" bar-active-color="transparent">
		  		<tab-item :selected="curNav == item.id" 
		  		v-for="(item, index) in nav" @on-item-click="handler(item.id)" :key="index">
		  			<span>{{item.name}}</span>
		  		</tab-item>
			</tab>
		</header>
		<section class="order-content">
			<div class="loading-wrapper" v-if="inlineLoadingStatus">
				<inline-loading></inline-loading><span>数据加载中</span>
			</div>
			<div v-if="orderList.length">
				<scroller height="-88" lock-x scrollbar-y use-pullup use-pulldown @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller" class="scrollerWrap">
				<div class="order-box">
					<div class="order-item-box" v-for="(item, index) in orderList" @click="orderDetailEvt(item.order_id)" :key="index">
						<div class="order-item-header">
							<span class="order-id">订单编号：{{item.order_sn}}</span>
							<span :class="{'order-status': true, 'red': item.order_state == '1', 'green': (item.order_state == '2' || item.order_state == '3')}">{{item.order_state == '1' ? '待付款' : item.order_state == '2' ? '待发货': item.order_state == '3' ? '待收货' : item.order_state == '5' ? '已取消' : '已完成'}}</span>
						</div>
						<swipeout class="vux-1px-tb">
					      	<swipeout-item :disabled="true" transition-mode="follow" v-for="(citem, i) in item.order_goods" :key="i">
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
					    <div class="order-item-footer">
					    	<span>总金额：</span>
					    	<img src="../../static/images/ic_unit.svg" alt=""> {{item.order_amount}}
					    	<span class="order-item-num">(共{{item.total_num}}件商品)</span>
					    </div>
					</div>
				</div>
			
				<div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
			        <span v-show="status.pulldownStatus === 'default'"></span>
			        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}" style="font-size: 13px;color: #7c7c7c;position: relative;padding-left: 23px;"><img src="../../static/images/ico_down.png" class="loading"/>下拉可以刷新</span>
			        <span v-show="status.pulldownStatus === 'loading'" style="font-size: 13px;color: #7c7c7c;position: relative;padding-left: 23px;"><img src="../../static/images/loading.gif" class="loading"/>刷新中...</span>
			    </div>
			    <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
			        <span v-show="status.pullupStatus === 'default'"></span>
			        <span class="pullup-arrow" v-show="status.pullupStatus === 'default' || status.pullupStatus === 'up' || status.pullupStatus === 'down'" :class="{'rotate': status.pullupStatus === 'down'}" style="font-size: 13px;color: #7c7c7c;">{{pullupTip}}</span>
			        <span v-show="status.pullupStatus === 'loading'" style="font-size: 13px;color: #7c7c7c;position: relative;padding-left: 23px;"><img src="../../static/images/loading.gif" class="loading" />加载中...</span>
			    </div>
			</scroller>
			</div>
			
			<div class="nodata" v-if="!orderList.length">{{nodata}}</div>
		</section>
		
		<FooterComponent></FooterComponent>
	</div>
</template>
<script>
	import FooterComponent from '../components/Footer'
	import {Swipeout, SwipeoutItem, Scroller, Loading, InlineLoading} from 'vux';
	export default {
		name: 'order',
		components: {Swipeout, SwipeoutItem, FooterComponent, Scroller, Loading, InlineLoading},
		data () {
			return {
				memberId: '',
				nav: [{id: 0, name: '全部'}, {id: 1, name: '待付款'}, {id: 3, name:'待收货'}],
				curNav: 0,
				orderList: [],
				nodata: '',
				pagesize:5,
				currentPage: 1,
				pullupEnabled: true,
				type: 0,
				toastStatus: false,
				toastTip: '',
				status: {
					pullupStatus: 'default',
					pulldownStatus: 'default'
				},
				inlineLoadingStatus: false,
				pullupTip: ''
			}
		},
		mounted () {
			this.shield();
			this.inlineLoadingStatus = true;
			this.memberId = localStorage.getItem('member_id');
			if(localStorage.getItem('orderCurIndex') !== null) {
				this.curNav = localStorage.getItem('orderCurIndex');
  				this.type = localStorage.getItem('orderCurIndex');
			}
			this.getOrderList();
		},
		methods: {
			handler(index) {
				if(index == this.curNav) return;
  				this.curNav = index;
  				this.type = index;
  				localStorage.setItem('orderCurIndex', index);
  				this.inlineLoadingStatus = true;
  				this.currentPage = 1;
		    	this.orderList = [];
		    	this.nodata = '';
		    	this.getOrderList();
			},
			// 下拉刷新
		    refresh () {
		      	this.currentPage = 1;
		      	this.getOrderList();
		      	setTimeout(() => {
	        		this.$nextTick(() => {
	          			setTimeout(() => {
	            			this.$refs.scroller.donePulldown()
	            			this.pullupEnabled && this.$refs.scroller.enablePullup()
	          			}, 10)
	        		})
	      		}, 2000)
		    },
		    // 加载更多
		    loadMore () {
		      	this.currentPage++;
		      	this.getOrderList();
		      	setTimeout(() => {
			        setTimeout(() => {
			          this.$refs.scroller.donePullup()
			        }, 10)
			    }, 2000)	
		    },
		    getOrderList: function() {
		    	let d = {
		    		member_id: this.memberId,
		    		page: this.currentPage,
		    		pagesize: this.pagesize,
		    		order_state: this.type
		    	}
		    	console.log(d)
		    	this.$http.post(this.apiUrl+'/order/orderList', this.mergeInfo('order', 'orderList', d)).then(res=>{
		    		this.inlineLoadingStatus = false;
		    		var r = this.resolve(res.data);
		    		console.log(r)
		    		if(r.code == 1) {
		    			if(this.currentPage == 1) {
		    				this.orderList = r.data;
		    				r.data.length ? this.nodata = '':this.nodata='暂无订单信息';
		    			}else{
		    				r.data.forEach((item) => {
	                        	this.orderList.push(item)
	                    	});
		    			}
		    			if(r.data.length) {
		    				// this.$nextTick(() => {
						    //   	this.$refs.scroller.reset()
						    //   	this.render = true
						    // });
						    if(r.data.length < this.pagesize && this.currentPage == 1) {
						    	this.pullupTip = '';
						    }else
						 	r.data.length == this.pagesize ? this.pullupTip = '上拉加载更多' : this.pullupTip ='已到达底部了~';
		    			}else{
		    				this.pullupTip = '已到达底部了~';
		    			}
		    		}else{
						this.nodata='暂无订单信息'
			    		this.toastStatus = true;
			      		this.toastTip = r.msg;
			    	}
		    	}).catch(res=>{
		    		this.nodata='暂无订单信息'
		    		this.inlineLoadingStatus = false;
		    		console.log(res)
		    	})
		    },

		    orderDetailEvt(id) {
		    	this.$router.push({path: '/orderDetail', query: {id: id}})
		    }
		}
	}
</script>
<style lang="less">
#order {
	header {
		position: relative;
		width: 100%;
		z-index: 100;
		.order-header {
			padding-top: 40px !important;
			-moz-box-shadow: 0px 1px 0px #EDEDED;
      		box-shadow: 0px 1px 0px #EDEDED; 
			.vux-tab-container {
				height: 40px;
				.vux-tab {
					height: 100%;
					.vux-tab-item {
						background: none;
						background-color: #E23535;
						line-height: 40px;
						color: #fff;
						>span {
							display: block;
							background-color: #E23535;
							margin: auto 14px;
							transition:all 0.5s;
							-moz-transition:all 0.5s; /* Firefox 4 */
							-webkit-transition:all 0.5s; /* Safari and Chrome */
							-o-transition:all 0.5s; /* Opera */
						}
						&.vux-tab-selected {
							>span {
								background-color: #9F1E1E;
							}
							
						}
					}
				}
			}
		}
	}
	.order-content {
		width:100%;
		height: 100%;
		box-sizing: border-box;
		/*padding-top: 40px;*/
		padding-bottom: 48px;
		overflow: auto;
		.order-item-box {
			background-color: #fff;
			margin-bottom: 4px;
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
					color: #474A45;
					font-weight: 600;
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
		.loading {
	  		position: absolute;
	  		left: 0;
	  		top: 0;
	  		width: 18px;
		}
		.nodata {
			padding: 20px;
			text-align: center;
			font-size: 14px;
			color: #b1b1b1;
		}
	}	
	.order-item-footer {
		height: 50px;
		line-height: 50px;
		padding: 0 14px;
		text-align: right;
		font-size: 15px;
		color: #E23535;
		>span {
			color: #1D1D1D;
			font-size: 13px;
			&.order-item-num {
				font-size:12px;
			}
		}
		>img {
			width: 8px;
			height: 11px;
		}
	}
}

</style>