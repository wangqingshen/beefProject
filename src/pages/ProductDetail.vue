<template>
	<div id="detail" class="page" v-if="show">
		<div class="detail-part">
			<swiper loop auto :aspect-ratio="1" @on-index-change="changImg" :show-dots="showDots">
				<swiper-item class="swiper-demo-img" v-for="(item, index) in loopImgList" :key="index">
					<img v-lazy="item">
				</swiper-item>
				<div class="dots-wrapper">
					<div class="dots-inner">
						{{imgIndex + 1}}/{{loopImgList.length}}
					</div>
				</div>
			</swiper>
			<div class="detail-info">
				<card>
				  	<div slot="content" class="card-padding">
				  		<div class="product-info">
				  			<span class="product-name">{{pname}}</span>
				  		</div>
				  		<div class="product-price">
				  			<img src="../../static/images/ic_unit.svg" alt="">{{price}}
				  		</div>
				  	</div>
				</card>
				<cell :title="stock" :value="saleNum"></cell>
				<div class="detail-basic">
					<h1>商品详情</h1>
					<div class="detail-basic-content" v-if="basicContentStatus">
						<img v-for="(item, index) in product_desc_img" v-lazy="item" alt="商品详情图" :key="index">
					</div>
				</div>
			</div>
		</div>
		<div v-transfer-dom class="fxWrapper" @click="fxDialogEvt" v-if="fxStatus == 'true'">
    		<div class="fxInner">
    			<img src="../../static/images/fx_img.png" alt="分销icon" />
    		</div>
    	</div>
		<tabbar class="detail-footer">
	      	<tabbar-item v-for="(item, index) in footerlist" :key="index" :show-dot="dotsStatus" @click.native="optionEvt(index)" v-if="btnState == 1">
	      		<img slot="icon" src="../../static/images/ic_detail_car.svg" v-if="item.icon">
	        	<span slot="label">{{item.name}}</span>
	      	</tabbar-item>
	      	<tabbar-item v-for="(item, index) in nofooterlist" :key="index" :show-dot="dotsStatus" @click.native="optionEvt(index)" v-if="btnState == 2" class="nostock">
	      		<img slot="icon" src="../../static/images/ic_detail_car.svg" v-if="item.icon">
	        	<span slot="label">{{item.name}}</span>
	      	</tabbar-item>
	    </tabbar>
	    <toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
	    <div v-transfer-dom>
      		<popup v-model="fxPopup" class="fxPopup">
        		<div class="content">
        			<div class="inner">
        				<span class="dialog-close"  @click="fxPopup=false"><img src="../../static/images/ic_close.svg" alt=""></span>
        				<h1>分享后预计可最高赚取佣金<span style="font-size: 100%;color:#E23535;">￥{{yjAmount}}</span></h1>
        				<p>朋友通过你分销的页面成功购买后，你可获得相应的佣金。</p>
        				<p>佣金可在“我的分销中心”里查看</p>
        				<div class="fx-share">
        					<div class="fx-share-item" @click="shareEvt()">
        						<img src="../../static/images/ic_wx_share.svg" alt="">
        						<span>微信</span>
        					</div>
        					<div class="fx-share-item" v-clipboard:copy="shareUrl"
							      v-clipboard:success="onCopy"
							      v-clipboard:error="onError">
        						<img src="../../static/images/ic_copy.svg" alt="">
        						<span>复制链接</span>
        					</div>
        					<div class="fx-share-item" @click="qrcodeEvt()">
        						<img src="../../static/images/ic_dec_code.svg" alt="">
        						<span>图文二维码</span>
        					</div>
        				</div>
        				<div class="fx-b">
        					<router-link to="/fxCenter">我的分销中心</router-link>
        				</div>
        			</div>
        		</div>
      		</popup>
    	</div>
    	<div v-transfer-dom>
	      	<x-dialog v-model="qrDialog" class="qrDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
	        	<div class="dialog-box">
			       	<span class="dialog-close"  @click="qrDialog=false"><img src="../../static/images/ic_close.svg" alt=""></span>
			       	<div id="inviteBox">
			       		<div class="qr-pimg">
				       		<img :src="loopImgList[0]" alt="">
				       		<span>￥{{price}}</span>
				       	</div>
				      	<p>{{pname}}</p>
	        			<qrcode :value="shareUrl" type="img" class="qrcode-img"></qrcode>
			       	</div> 	
			       	<div id="shareBox"></div>
			       	<div class="qr-tip">
	        			<img src="../../static/images/ic_cursor.svg" alt="">
	        			<span>长按图片保存至相册</span>
	        		</div>
	        	</div>
	      	</x-dialog>
	    </div>
	    <popup v-model="buyPopup" class="buyPopup">
    		<div class="content">
    			<div class="inner">
    				 <span class="popup-close"  @click="buyPopup=false"><img src="../../static/images/ic_close.svg" alt=""></span>
    				<div class="buyHeader">
    					<img :src="loopImgList[0]" />
    					<div class="buyRight" style="width: calc(100% - 95px);">
    						<p class="pname">{{pname}}</p>
    						<p class="pinfo"><span>￥{{price}}</span><span>{{stock}}</span></p>
    					</div>
    				</div>
    				<div class="buyMiddle">
    					<span>购买数量</span>
    					<inline-x-number v-model="buyNum" style="display:block;" :min="1" width="50px" button-style="round" :max="Number(maxNum)"></inline-x-number>
    				</div>
    				<div class="buyBottom">
    					<flexbox>
					        <flexbox-item>
					          	<x-button class="cart-btn" type="primary" plain @click.native="nextEvt">下一步</x-button>
					        </flexbox-item>
					    </flexbox>
    				</div>
    			</div>
    		</div>
    	</popup>
    	
	    <div class="share-tip-wrapper" v-show="shareStatus" @click="shareStatus=false">
    		<div class="share-content">
    			<img src="../../static/images/ic_share.svg" alt="">
    			<p>立即推广好友吧<br/>点击屏幕右上角将本页分享好友</p>
    		</div>
    	</div>
    	<div v-transfer-dom>
	      <loading :show="submitStatus" text="" position="middle"></loading>
	    </div>
	</div>
</template>
<script>
	import {Swiper, SwiperItem, Cell, Tabbar, TabbarItem, Qrcode, Popup, XDialog, InlineXNumber, XButton, Loading} from 'vux';
	export default {
		name: 'detail',
		components: {Swiper,SwiperItem, Cell, Tabbar, TabbarItem, Qrcode, Popup, XDialog, InlineXNumber, XButton, Loading},
		data () {
			return {
				show: false,
				memberId: '',
				loopImgList: [],
				imgIndex: 0,
				showDots: false,
				pname: '',
				price: '',
				stock: '剩余库存：0',
				maxNum: '',
				saleNum: '已出售: 0',
				product_desc_img: [],
				footerlist: [
	  				{name: '购物车', icon: 'ic_detail_car.svg', path: '/shoppingCar'},
	  				{name: '加入购物车', icon: '', path: ''},
	  				{name: '立即购买', icon: '', path: '/confirmOrder'},
	  			],
	  			nofooterlist: [
	  				{name: '购物车', icon: 'ic_detail_car.svg', path: '/shoppingCar'},
	  				{name: '商品库存不足', icon: '', path: ''},
	  			],
	  			dotsStatus: false,
	  			basicContentStatus: false,
	  			spuId: '',
	  			apiArr: [],
	  			toastStatus: false,
	  			toastTip: '',
	  			fxStatus: 'false',
	  			yjAmount: '',
	  			fxPopup: false,
	  			qrDialog: false,
	  			shareStatus: false,
	  			buyPopup: false,
	  			shareUrl: '',
	  			buyNum: 1,
	  			skuId: '',
	  			submitStatus: false,
	  			nextType: '',
	  			openid: '',
	  			btnState: '', // 1、有库存 2、无库存
			}
		},
		mounted () {
			this.openShield();
			if(this.$route.query.openid) {
				this.spuId = this.$route.query.spuid;
				this.openid = this.$route.query.openid;
			}else{
				this.spuId = this.$route.query.id;
				this.memberId = localStorage.getItem('member_id');
				this.fxStatus = localStorage.getItem('fxStatus');
				this.openid = localStorage.getItem('openid');
			}	
			this.getMemberInfo();
		},
		methods: {
			getMemberInfo(openid) {
				let d = {
					'mini_openid': this.openid
				}
				this.$http.post(this.apiUrl+'/member/getMemberInfo', this.mergeInfo('member','getMemberInfo',d)).then(res=>{
					var r = this.resolve(res.data);
					if(r.code == 1 && r.data) { 		
						var member_info = r.data.member_info;
						localStorage.setItem('member_id', member_info.member_id);
						localStorage.setItem('member_nick_name', member_info.member_nick_name);
						localStorage.setItem('member_avatar', member_info.member_avatar);
						localStorage.setItem('member_sex', member_info.member_sex);
						localStorage.setItem('member_mobile', member_info.member_mobile);
						var fxStatus = '';
						if(r.data.seller_info.seller_id != undefined) {
							localStorage.setItem('seller_id', r.data.seller_info.seller_id);
							localStorage.setItem('seller_status', r.data.seller_info.seller_status);
							localStorage.setItem('seller_remark', r.data.seller_info.remark);
							if(r.data.seller_info.seller_status == 1) {
								fxStatus = 'true';
							}else{
								fxStatus = 'false';
							}
						}else{
							fxStatus = 'false';
						}
						localStorage.setItem('fxStatus', fxStatus);
						this.memberId = member_info.member_id;
				    	this.fxStatus = fxStatus;
				    	this.shareUrl = 'http://mongolia.manyouku.com/wechatshopadmin/wechatauth?id='+this.spuId+'&member_id='+this.memberId;
				    	this.getInfo();	
						this.checkCarDots();
					}
				}).catch(res=>{
					console.log(res)
				})
			},

			changImg(index) {
				this.imgIndex = index
			},

			createCanvas() {
				let inviteBox = document.getElementById("inviteBox")
				let shareBox = document.getElementById("shareBox")
				let canvas = document.createElement("canvas")
				canvas.width = 560    // 最终图片宽度280px的2倍，以px为单位
				canvas.height = 630   // 最终图片高度315px的2倍，以px为单位
				let opts = {
				   canvas: canvas,                       // 将自定义canvas作为配置项
				   useCORS: true,                        // 允许图片跨域
		
				}
				shareBox.innerHTML = '';
				inviteBox.style.display = 'block';
		    	html2canvas(inviteBox, opts).then((canvas) => {
				    let base64ImgSrc = canvas.toDataURL("image/png")
				    /* 如果只是显示,可用以下代码 */
				    let img = document.createElement("img")
				    img.src = base64ImgSrc 
				    inviteBox.style.display = 'none'
				    shareBox.appendChild(img)
				})
		    },

			getInfo: function() {
				let d = {'spu_id': this.spuId}
				this.$http.post(this.apiUrl+'/goods/goodsDetail', this.mergeInfo('goods','goodsDetail',d)).then(res=>{
					var r = this.resolve(res.data);
					console.log(r)
		    		if(r.code == 1) {
		    			this.show = true;
		    			this.loopImgList = r.data.goods_img;
		    			this.pname = r.data.goods_name;
		    			this.price = r.data.min_price;
		    			this.stock = "剩余库存：" + r.data.goods_num;
		    			this.maxNum = r.data.goods_num;
		    			this.saleNum = "已出售: "+r.data.sale_num;
		    			this.skuId = r.data.sku[0].sku_id;
		    			this.yjAmount = r.data.max_commission;
		    			r.data.goods_num == 0 ? this.btnState = 2 : this.btnState = 1;
		    			if(r.data.goods_body_img.length) {
		    				this.basicContentStatus = true
		    				this.product_desc_img = r.data.goods_body_img
		    			}else{
		    				this.basicContentStatus = false
		    			}
		    			var url = 'http://mongolia.manyouku.com/wechatshopadmin/wechatauth?id='+this.spuId+'&member_id='+this.memberId;
		    			this.wxbase(r.data.goods_name, r.data.goods_img[0], url, '发现一个正宗内蒙特色商品，超值购买');
		    		}
				}).catch(res=>{
					console.log(res);
				})
			},

			checkCarDots: function() {
				let d = {'member_id': this.memberId}
				this.$http.post(this.apiUrl+'/order/cartList', this.mergeInfo('order','cartList',d)).then(res=>{
					var r = this.resolve(res.data);
					console.log(r)
					if(r.code == 1) {
						r.data.length ? this.dotsStatus = true : this.dotsStatus = false;
					}
				}).catch(res=>{
					console.log(res);
				})
			},

			fxDialogEvt () {
		    	this.fxPopup = true;
		    },

		    onCopy: function (e) {
		      	this.toastStatus = true;
		      	this.toastTip = '复制成功'
		    },
		    onError: function (e) {
		      	this.toastStatus = true;
		      	this.toastTip = '复制失败'
		    },
		    shareEvt: function() {
		    	this.fxPopup = false;
		    	this.shareStatus = true;
		    },
		    qrcodeEvt: function() {
		    	this.fxPopup = false;
		    	this.qrDialog = true;
		    	setTimeout(res=>{
		    		this.createCanvas()
		    	}, 500)
		    },

		    buyPopupEvt(type) {
		    	this.buyNum = 1;
		    	this.nextType = type;
		    	this.buyPopup = true;
		    },

		    nextEvt() {
		    	this.nextType == 1 ? this.addToCar() : this.buy()
		    },

			addToCar() {
		    	this.submitStatus = true;
		    	let d = {
					sku_id: this.skuId,
					goods_num: this.buyNum,
					member_id: this.memberId
				}
				this.$http.post(this.apiUrl+'/order/addToCart', this.mergeInfo('order','addToCart',d)).then(res=>{
					this.submitStatus = false
					var r = this.resolve(res.data);
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '成功加入购物车'
						this.buyPopup = false
						this.checkCarDots()
						// this.$router.push({path: '/shoppingCar'})
					}else{
						this.toastTip = r.msg
					}
				}).catch(res=>{
					this.submitStatus = false
					console.log(res);
				})
		    },

		    buy() {
		    	this.submitStatus = true;
		    	let d = {
					sku_id: this.skuId,
					goods_num: this.buyNum,
					member_id: this.memberId
				}
				localStorage.setItem('orderConfirmInfo', JSON.stringify(d));
				localStorage.setItem('orderConfirmType', 1);
				this.$router.push({path: '/confirmOrder'})
		    },

			optionEvt (_index) {
				if(_index == 0) {
					this.$router.push({path: this.footerlist[_index].path})
				}else{
					if(this.btnState == 1) {
						this.buyPopupEvt(_index)
					}
				}
			}
		}
	}
</script>
<style lang="less">
	.vux-slider > .vux-swiper > .vux-swiper-item img {
		width: 100%;
		height: 100%;
	}
	.dots-wrapper {
		position: absolute;
	    bottom: -8px;
	    right: -13px;
	    z-index: 10;
	    .dots-inner {
	    	background: rgba(0,0,0,0.6);
		    color: rgba(255,255,255,0.6);
		    padding: 0px 10px;
		    font-size: 20px;
		    -webkit-transform: scale(0.5);
		    transform: scale(0.5);
	    }
	}
	#detail {
		position: relative;
		.detail-part {
			width: 100%;
			/*height: 100%;*/
			/*overflow: auto;*/
			padding-bottom: 50px;
			box-sizing: border-box;
			overflow-x: hidden;
			.detail-info {
				background-color: #fff;
				.weui-panel {
					margin-top: 0;
					&:before, &:after{
						border: none;
					}
					.card-padding {
						padding: 6px 20px 8px;
						.product-info {
							line-height: 20px;
							.product-name{
								font-weight: 600;
								font-size: 15px;
								color: #4a4a4a;
								overflow: hidden;
							    text-overflow: ellipsis;
							    display: -webkit-box;
							    -webkit-box-orient: vertical;
							    -webkit-line-clamp: 2;
							}
						}
						.product-price {
							font-size: 17px;
							line-height: 17px;
							color: #E23535;
							padding: 5px 0;
							>img {
								margin-right: 3px;
							}
						}
					}
				}
				.weui-cell {
					padding: 12px 20px;
					font-size: 13px;
					color: #9b9b9b;
					&:before {
						left: 0;
					}
					&:after {
						content: " ";
					    position: absolute;
					    left: 0;
					    bottom: 0;
					    right: 0;
					    height: 1px;
					    border-top: 1px solid #D9D9D9;
					    color: #D9D9D9;
					    -webkit-transform-origin: 0 0;
					    transform-origin: 0 0;
					    -webkit-transform: scaleY(0.5);
					    transform: scaleY(0.5);
					}
					.weui-cell__ft {
						color: #9b9b9b;
					}
				}
				.detail-basic {
					>h1 {
						font-size: 15px;
						font-weight: 400;
						color: #4a4a4a;
						text-align: center;
						padding: 10px 0;
					}
					.detail-basic-content {
						position: relative;
						padding: 10px 10px 25px;
						&:before {
							content: " ";
						    position: absolute;
						    left: 0;
						    top: 0;
						    right: 0;
						    height: 1px;
						    border-top: 1px solid #D9D9D9;
						    color: #D9D9D9;
						    -webkit-transform-origin: 0 0;
						    transform-origin: 0 0;
						    -webkit-transform: scaleY(0.5);
						    transform: scaleY(0.5);
						}
						>img {
							width: 100%;
						}
					}
				}
			}
		}
		
		.detail-footer {
			position: fixed;
			background-color: #fff;
			justify-content: center;
			align-items: center;
			&:before {
				content: " ";
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				height: 1px;
				border-top: 1px solid #D9D9D9;
				color: #D9D9D9;
				-webkit-transform-origin: 0 0;
				transform-origin: 0 0;
				-webkit-transform: scaleY(0.5);
				transform: scaleY(0.5);
			}
			.weui-tabbar__item {
				flex: 3;
				.weui-tabbar__label {
					font-size: 16px;
					color: #fff;
				}
				&:first-child {
					flex: 1;
					padding: 0 14px;
					.weui-tabbar__icon {
						width: 18px;
						height: 16px;
						margin-top: 5px;
					}
					.weui-tabbar__label {
						color: #7F8388;
						font-size: 13px;
						-webkit-transform: scale(0.8);
						transform: scale(0.8);
					}
				}
				&:nth-child(2) {
					background-color: #DE3737;
				}
				&:last-child {
					background-color: #9F1E1E;
					&.nostock {
						background-color: #ccc;
					}
					
				}
			}
		}
		.vux-reddot:after, .vux-reddot-border:after, .vux-reddot-s:after {
			width: 7px;
			height: 7px;
			background-color: #DE3737;
			top: -1px;
		}
	}
	.fxWrapper {
		position: fixed;
		right: 0;
		bottom: 70px;
		img{
			display: block;
			width: 80px;
			height: 80px;
		}
	}
	.fxPopup {
		background-color: #fff !important;
		.content {
			position: relative;
			text-align: center;
			.inner {
				padding-top: 26px;
				box-sizing: border-box;
			}
			.dialog-close {
				position: absolute;
				width: 23px;
				height: 23px;
				right: 6px;
				top: 6px;
			}
			h1 {
				font-size: 18px;
				color: #4a4a4a;
				line-height: 25px;
				font-weight: 400;
				margin-bottom: 10px;
			}
			p {
				font-size: 12px;
				color: #989898;
				line-height: 17px;
			}
			.fx-share {
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 30px 0 29px;
				.fx-share-item {
					flex: 1;
					>img {
						display: block;
						width: 58px;
						height: 58px;
						margin: 0 auto 6px;
					}
					>span {
						font-size: 12px;
						color: #989898;
						line-height: 17px;
					}
				}
			}
			.fx-b {
				margin-bottom: 30px;
				>a {
					color: #EA1919;
					font-size: 15px;
					line-height: 18px;
				}
			}
		}	
	}
	.share-tip-wrapper {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,0.6);
		z-index: 1000;
		.share-content {
			position: relative;
			text-align: right;
			>img {
				margin-right: 51px;
			}
			p {
				position: absolute;
				right: 30px;
				width: 197px;
				text-align: center;
				font-size: 14px;
				color: #fff;
				line-height: 20px;
			}
		}	
	}
	.qrDialog {
		.weui-dialog {
			overflow: auto;
		}
		.dialog-box {
			padding: 25px;
			box-sizing: border-box;
			#shareBox > img {
				width: 100%;
				/*height: 314px;*/
				border-radius: 14px;
			}
			.qr-pimg {
				position: relative;
				width: 100%;
				height: 200px;
				>img {
					width: 100%;
					height: 100%;
				}
				>span {
					position: absolute;
				    bottom: 0;
				    right: 0;
				    background: #E23535;
				    font-size: 14px;
				    color: #fff;
				    border-bottom-left-radius: 15px;
				    border-top-left-radius: 15px;
				    line-height: 21px;
				    padding: 0 5px;
				}
			}
			.qrcode-img {
				padding-top: 15px;
				margin-bottom: 0;
				>img {
					width: 105px !important;
					height: 105px !important;
				}
			}
			p {
				width: 100%;
				font-size: 15px;
				line-height: 22px;
				color: #4a4a4a;
				margin-top: 10px;
				overflow: hidden;
			    text-overflow: ellipsis;
			    white-space: nowrap;
			}
			.qr-tip {
				position: absolute;
				width: 100%;
			    left: 0;
			    bottom: -25px;
			    font-size: 13px;
			    color: #fff;
			    display: flex;
			    justify-content: center;
			    align-items: center;
			    >img {
			    	margin-right: 5px;
			    }
			}
		}
		
	}
</style>