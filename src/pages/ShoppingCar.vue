<template>
	<div id="shoppingCar" class="page" style="height: 100%;">
		<div v-if="list.length && show" class="car-list">
			<swipeout class="vux-1px-tb">
		      	<swipeout-item transition-mode="follow" v-for="(item, index) in list" :key="index">
		        	<div slot="right-menu">
		          		<swipeout-button type="warn" @click.native="delEvt(item.cart_id)">删除</swipeout-button>
		        	</div>
		        	<div slot="content" class="swipeContent">
		        		<check-icon :value.sync="item.isChecked"  @click.native="checkedOne(item.cart_id)"></check-icon>
		        		<a href="javascript:void(0)" class="weui-media-box weui-media-box_appmsg">
            				<div class="weui-media-box__hd">
              					<img class="weui-media-box__thumb" v-lazy="item.goods_img" alt="">
            				</div>
            				<div class="weui-media-box__bd">
              					<h4 class="weui-media-box__title" v-html="item.goods_name"></h4>
              					<div class="weui-media-box__desc">
              						<span class="weui-price"><img src="../../static/images/ic_unit.svg" alt=""> {{item.goods_price}}</span>
              						<div class="calculate-opt">
              							<a href="javascript:void(0)" @click="sub(index, item.goods_num)" class="number-selector":class="{'number-disabled': item.goods_num <= min}">
              								<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          										<!-- Generator: Sketch 51 (57462) - http://www.bohemiancoding.com/sketch -->
										        <title>减号灰</title>
										        <desc>Created with Sketch.</desc>
										        <defs></defs>
										        <g id="购物车" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
										           	<g id="购物车-默认状态" class="strokeClass" transform="translate(-290.000000, -153.000000)" stroke="#808080">
										               	<g id="减号灰" transform="translate(291.000000, 154.000000)">
										                   <rect id="Rectangle-6" stroke-linejoin="round" x="0" y="0" width="22" height="22"></rect>
										                   <path d="M5,11.25 L17,11.25" id="Path-5-Copy-2"></path>
										               	</g>
										           	</g>
										        </g>
										    </svg>
              							</a>
              							<input v-model.number="item.goods_num" class="number-input" readonly="readonly" pattern="[0-9]*" type="number"/>
              							<a href="javascript:void(0)" @click="add(index, item.goods_num)" class="number-selector":class="{'number-disabled': item.goods_num >= item.goods_stock}">
              								<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
										        <!-- Generator: Sketch 51 (57462) - http://www.bohemiancoding.com/sketch -->
										        <title>Group 6</title>
										        <desc>Created with Sketch.</desc>
										        <defs></defs>
										        <g id="购物车" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
										            <g id="购物车-默认状态" class="strokeClass" transform="translate(-342.000000, -273.000000)" stroke="#808080">
										                <g id="Group-6" transform="translate(343.000000, 274.000000)">
										                    <rect id="Rectangle-6-Copy-3" stroke-linejoin="round" x="0" y="0" width="22" height="22"></rect>
										                    <path d="M5,11 L17,11" id="Path-5-Copy-3"></path>
										                    <path d="M11,5 L11,17" id="Path-5-Copy-5"></path>
										                </g>
										            </g>
										        </g>
										    </svg>
										</a>
              						</div>
              					</div>
            				</div>
          				</a>
		        	</div>
		      	</swipeout-item>
		    </swipeout>
		    <footer>
		    	<div class="footer-l">
		    		<check-icon :value.sync="isChecked" @click.native="checkedAll()">全选</check-icon>
		    		<div class="total">
		    			<span>合计：</span><img src="../../static/images/ic_unit.svg" alt="">{{totalAmount}}
		    		</div>
		    	</div>
		    	<div class="footer-r":class="{'disabled': !checkedArr.length}" @click="settlement()">
		    		结算({{totalNum}})
		    	</div>
		    </footer>
		</div>
		<div v-if="!list.length && show" class="no-data">
			<p class="msg1">购物车空空T.T</p>
			<p class="msg2">快给我挑点宝贝</p>
			<x-button mini plain @click.native="goShopping">去逛逛</x-button>
		</div>
		<div v-transfer-dom>
	      <loading :show="submitStatus" text=""></loading>
	    </div>
	    <toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
	    <FooterComponent></FooterComponent>
	</div>
</template>
<script>
	import FooterComponent from '../components/Footer'
	import {XButton, Swipeout, SwipeoutItem, SwipeoutButton, CheckIcon, Loading} from 'vux'
	export default {
		name: 'ShoppingCar',
		components: {FooterComponent, XButton, Swipeout, SwipeoutItem, SwipeoutButton, CheckIcon, Loading},
		data () {
			return {
				show: false,
				list: [],
				isCheckedAll: false,
				isChecked: false,
				checkedArr: [],
				totalAmount: 0,
				totalNum: 0,
				min: 1,
				submitStatus: false,
				toastStatus: false,
				toastTip: '',
				memberId: ''
			}
		},
		mounted () {
			this.shield();
			this.memberId = localStorage.getItem('member_id');
			this.getList();
		},
		methods: {
			goShopping() {
				this.$router.push({path: '/'})
			},

			checkedAll() {
				this.isCheckedAll = !this.isCheckedAll;
				this.isChecked = this.isCheckedAll;
				this.checkedArr = [];
				this.list.forEach(function (item) {
			        item.isChecked = this.isCheckedAll;
			        if(this.isCheckedAll) {
			        	this.checkedArr.push(item.cart_id)
			        }
			    }, this)
			    this.sum();
			},

			checkedOne(id) {
				let idIndex = this.checkedArr.indexOf(id)
		        if (idIndex >= 0) {
		          // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
		          this.checkedArr.splice(idIndex, 1)

		        } else {
		          // 选中该checkbox
		          this.checkedArr.push(id)
		        }
		        if(this.checkedArr.length == this.list.length) {
		        	this.isChecked = true;
		        }else{
		        	this.isChecked = false;
		        }
		        this.isCheckedAll = this.isChecked;
		        this.sum();
			},

			getList() {
				let d = {'member_id': this.memberId},
					_this = this;
				this.$http.post(this.apiUrl+'/order/cartList', this.mergeInfo('order','cartList',d)).then(res=>{
					this.show = true;
					var r = this.resolve(res.data);
					if(r.code == 1) {
						console.log(r.data)
						r.data.forEach(function (item) {
							item.isChecked = false
							if(_this.checkedArr.indexOf(item.cart_id)>= 0) {
								item.isChecked = true
							}
						})	
						this.list = r.data;
						if(this.checkedArr.length == r.data.length) {
				        	this.isChecked = true;
				        }else{
				        	this.isChecked = false;
				        }
						this.sum();
					}
				}).catch(res=>{
					console.log(res);
				})
			},

			delEvt(id) {
				let d = {'cart_id': id}
				this.submitStatus = true;
				this.$http.post(this.apiUrl+'/order/deleteCart', this.mergeInfo('order','deleteCart',d)).then(res=>{
					this.submitStatus = false;
					var r = this.resolve(res.data);
					if(r.code == 1) {
						let idIndex = this.checkedArr.indexOf(id)
				        if (idIndex >= 0) {
				          this.checkedArr.splice(idIndex, 1)
				        }
				        this.getList()
					}else{
						this.toastStatus = true;
						this.toastTip = r.msg;
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res);
				})
			},

			settlement() {
				if(!this.checkedArr.length) return;
				this.submitStatus = true;
				let d = {'member_id': this.memberId,'cart_ids': this.checkedArr.join(',')}
				localStorage.setItem('orderConfirmInfo', JSON.stringify(d));
				localStorage.setItem('orderConfirmType', 2);
				this.$router.push({path: '/confirmOrder'})	
			},

			changeGoodsNum(id, num) {
				console.log(id, num)
				let d = {cart_id: id, goods_num: num}
				this.$http.post(this.apiUrl+'/order/changeGoodsNum', this.mergeInfo('order','changeGoodsNum',d)).then(res=>{
					var r = this.resolve(res.data);
					console.log(r);
					if(r.code == 1) {
						this.sum();
					}
				}).catch(res=>{
					console.log(res);
				})
			},

			sub(index, num) {
				if(num > this.min) {
					this.list[index].goods_num--;
					this.changeGoodsNum(this.list[index].cart_id, this.list[index].goods_num);	
				}
			},

			add(index, num) {
				if(num < this.list[index].goods_stock) {
					this.list[index].goods_num++;
					this.changeGoodsNum(this.list[index].cart_id, this.list[index].goods_num);
				}
			},

			sum() {
				this.totalAmount = 0;
				this.totalNum = 0;
				for(var i = 0; i < this.list.length; i++) {
					if(this.list[i].isChecked) {
						this.totalAmount += this.list[i].goods_price * this.list[i].goods_num
						this.totalNum += this.list[i].goods_num;
					}
				}
			}
		}
	}
</script>
<style lang="less">
	#shoppingCar {
		
		.no-data {
			width: 100%;
			height: 100%;
			background-color: #fff;
			padding-top: 50px;
			padding-bottom: 48px;
			box-sizing: border-box;
			.msg1 {
				font-size: 15px;
				color: #4a4a4a;
				text-align: center;
			} 
			.msg2 {
				font-size:13px;
				color: #b0b0b0;
				text-align: center;
				margin-top: 2px;
			}
			button {
				display: block;
				border: 1px solid #DE3737;
				border-radius: 4px;
				color: #DE3737;
				font-size: 13px;
				margin: 30px auto;
			}
		}
		.car-list {
			height: auto;
			padding-bottom: 98px;
			box-sizing: border-box;
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
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 10px;
					box-sizing: border-box;
					.vux-check-icon {
						flex: 1;
					}
					a.weui-media-box {
						flex: 11;
						.weui-media-box__hd {
							width: 100px;
							height: 100px;
							margin: 0 10px 0 5px;
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
								display: flex !important;
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
								.calculate-opt {
									flex: 1;
									display: flex;
									justify-content: flex-end;
									.number-selector {
										border: 0;
										width: 22px;
										height: 22px;
										margin: 0;
										padding: 0;
										.strokeClass {
											stroke: #808080;
										}
										&.number-disabled  {
											.strokeClass {
												stroke: #D3D3D3;
											}
										}
										svg{
											width:22px;
											height: 22px;
											top: 0;
										}
									}
									.number-input{
										color: #808080;
										font-size: 14px;
										height: 22px;
										width: 40px !important;
										padding: 0;
										border: 0;
										text-align: center;
									}
								}
							}
						}
					}
				}
			}
			.vux-check-icon {
				.weui-icon-circle {
					color: rgb(208,208,208);
				}
				.weui-icon-success-circle, .weui-icon-circle, .weui-icon-success {
					font-size: 20px;
				}
				.weui-icon-success, .weui-icon-success-circle, .weui-icon-success:before, .weui-icon-success-circle:before{
					color: rgb(222,55,55);
				}
				[class^="weui-icon-"]:before, [class*=" weui-icon-"]:before {
					margin: 0;
				}
			}
			footer {
				display: flex;
				position: fixed;
				left: 0;
				bottom: 48px;
				width: 100%;
				height: 50px;
				line-height: 50px;
				background-color: #fff;
				border-top: 1px solid #ddd;
				box-sizing: border-box;
				.footer-l {
					display: flex;
					flex: 8;
					padding: 0 10px;
					.vux-check-icon {
						flex: 1;
						>span {
							font-size: 13px;
							color: #4A4A4A;
						}
					}
					.total {
						flex: 1;
						text-align: right;
						color: #E23535;
						font-size: 13px;
						>span {
							color: #4A4A4A;
						}
						>img {
							width: 8px;
							height: 11px;
							margin-right: 3px;
						}
					}
				}
				.footer-r {
					flex: 3;
					border-left: 1px solid #ddd;
					background-color: #DE3737;
					font-size: 13px;
					color: #fff;
					text-align: center;
					&.disabled {
						background-color: #ddd;
						color: #4a4a4a;
					}

				}
			}
		}
	}
</style>