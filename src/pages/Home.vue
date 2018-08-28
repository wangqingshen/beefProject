<template>
	<div id="home" class="page">
		<HeaderComponent v-on:indexValue="indexValue" :list="navList"></HeaderComponent>
		
		<div id="productList" >
			<div class="loading-wrapper" v-if="inlineLoadingStatus">
				<inline-loading></inline-loading><span>数据加载中</span>
			</div>
			<div v-if="productList.length">
				<scroller height="-97" lock-x scrollbar-y use-pullup use-pulldown @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller" class="scrollerWrap">
				<div class="product-box">
					<card v-for="(item, index) in productList" :key="index">
						<div slot="header" class="img-loading" @click="detailEvt(item.spu_id)">
							<!-- <span>{{imgLoading}}</span> -->
							<img v-lazy="item.goods_img" alt="" />
							<!-- <x-img slot="header" :src="item.goods_img" @on-success="imgLoadingSuccess" @on-error="imgLoadingError" v-if="render" :scroller="$refs.scroller" style="display: block; width:100%;"></x-img> -->
						</div>
				      	<div slot="content" class="card-padding">
				      		<div class="product-info" @click="detailEvt(item.spu_id)">
				      			{{item.goods_name}}
				      		</div>
				      		<div class="product-price">
				      			<span ><img src="../../static/images/ic_unit.svg" alt="">{{item.goods_price}}</span>
				      			<x-button mini plain @click.native="buyPopupEvt(index)">立即购买</x-button>
				      		</div>
				      	</div>
		    		</card>
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
			<div class="nodata" v-if="!productList.length">{{nodata}}</div>
		</div>
    	<div v-transfer-dom class="fxWrapper" @click="fxDialogEvt" v-if="fxStatus == 'true'">
    		<div class="fxInner">
    			<img src="../../static/images/fx_img.png" alt="" />
    		</div>
    	</div>
		<FooterComponent></FooterComponent>
		<div v-transfer-dom>
      		<popup v-model="fxPopup" class="fxPopup">
        		<div class="content">
        			<div class="inner">
        				<span class="dialog-close"  @click="fxPopup=false"><img src="../../static/images/ic_close.svg" alt=""></span>
        				<h1>立即分享给好友</h1>
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
    	<popup v-model="buyPopup" class="buyPopup">
    		<div class="content">
    			<div class="inner">
    				 <span class="popup-close"  @click="buyPopup=false"><img src="../../static/images/ic_close.svg" alt=""></span>
    				<div class="buyHeader">
    					<img :src="buyImgSrc" />
    					<div class="buyRight" style="width: calc(100% - 95px);">
    						<p class="pname">{{buyName}}</p>
    						<p class="pinfo"><span>￥{{buyPrice}}</span><span>库存：{{buyStock}}</span></p>
    					</div>
    				</div>
    				<div class="buyMiddle">
    					<span>购买数量</span>
    					<inline-x-number v-model="buyNum" style="display:block;" :min="1" width="50px" button-style="round" :max="Number(buyStock)"></inline-x-number>
    				</div>
    				<div class="buyBottom">
    					<flexbox v-if="btnState == 1">
					        <flexbox-item>
					          	<x-button class="cart-btn" type="primary" plain @click.native="addToCar">加入购物车</x-button>
					        </flexbox-item>
					        <flexbox-item>
					          	<x-button class="pay-btn" type="warn" @click.native="buy">立即购买</x-button>
					        </flexbox-item>
					    </flexbox>
					    <flexbox v-if="btnState == 2">
					        <flexbox-item>
					          	<x-button class="nostock-btn" type="primary" plain>商品库存不足</x-button>
					        </flexbox-item>
					    </flexbox>
    				</div>
    			</div>
    		</div>
    	</popup>
    	<div v-transfer-dom>
	      	<x-dialog v-model="qrDialog" class="qrDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
	        	<div class="dialog-box">
			       	<span class="dialog-close"  @click="qrDialog=false"><img src="../../static/images/ic_close.svg" alt=""></span>
			       	<div id="inviteBox">
        				<qrcode :value="shareUrl" type="img" class="qrcode-img"></qrcode>
        				<p>发现一些好货，邀你一起看看</p>
        				<p>长按识别二维码</p>
        			</div>
        			<div id="shareBox"></div>
	        	</div>
	      	</x-dialog>
	    </div>

    	<div class="share-tip-wrapper" v-show="shareStatus" @click="shareStatus=false">
    		<div class="share-content">
    			<img src="../../static/images/ic_share.svg" alt="">
    			<p>立即推广好友吧<br/>点击屏幕右上角将本页分享好友</p>
    		</div>
    	</div>
    	<div v-transfer-dom>
	      <loading :show="submitStatus" text="" position="middle"></loading>
	    </div>
    	<toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
	</div>
</template>

<script>
import { Scroller, Loading, XButton, Popup, Qrcode, InlineLoading, XDialog, InlineXNumber} from 'vux'
import HeaderComponent from '../components/Header';
import FooterComponent from '../components/Footer';
export default {
	name: 'Home',
	components: {HeaderComponent, FooterComponent, Scroller, Loading, XButton, Popup, Qrcode, InlineLoading, XDialog, InlineXNumber},
	data() {
		return {
			imgLoading: '图片加载中...',
			nodata: '',
			navList: [],
			productList: [],
			pagesize:10,
			currentPage: 1,
			curGcId: '',
			pullupEnabled: true,
			status: {
				pullupStatus: 'default',
				pulldownStatus: 'default'
			},
			render: false,
			fxPopup: false,
			qrDialog: false,
			shareStatus: false,
			toastStatus: false,
			inlineLoadingStatus: false,
			toastTip: '',
			shareUrl: '',
			fxStatus: 'false',
			buyNum: '',
			buyImgSrc: '',
			buyName: '',
			buyPrice: '',
			buyStock: '',
			spuId: '',
			skuId: '',
			buyPopup: false,
			submitStatus: false,
			memberId: '',
			openid: '',
			pullupTip: '',
			btnState: '', // 1、有库存 2、无库存
		}
	},
	mounted () {
		this.openShield();
		if(localStorage.getItem('openid') == undefined) {
			let openid = this.$route.query.openid;
			localStorage.setItem('openid', openid);
			this.openid = openid;
		}else{
			this.memberId = localStorage.getItem('member_id');
	    	this.fxStatus = localStorage.getItem('fxStatus');
	    	this.openid = localStorage.getItem('openid');
		}
		this.getMemberInfo();
	    this.getGoodType();
  	},
	methods: {
		getMemberInfo () {
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
			    	this.shareUrl = 'http://mongolia.manyouku.com/wechatshopadmin/wechatauth?member_id='+this.memberId;
			    	this.wxbase('内蒙特色微商城', '', this.shareUrl, '发现一个精选商城，里面有大量内蒙特色商品')
				}
			}).catch(res=>{
				console.log(res)
			})
		},
		// 下拉刷新
	    refresh () {
	      	this.currentPage = 1;
	      	this.getGoodList();
	      	setTimeout(() => {
        		this.$nextTick(() => {
          			setTimeout(() => {
            			this.$refs.scroller.donePulldown()
            			this.pullupEnabled && this.$refs.scroller.enablePullup()
          			}, 10)
        		})
      		}, 500)
	    },
	    // 加载更多
	    loadMore () {
	      	this.currentPage++;
	      	this.getGoodList();
	      	setTimeout(() => {
		        setTimeout(() => {
		          this.$refs.scroller.donePullup()
		        }, 10)
		    }, 500)
	      	
	    },
	    indexValue (val) {
	    	this.inlineLoadingStatus = true;
	    	this.curGcId = val;
	    	this.currentPage = 1;
	    	this.productList = [];
	    	this.nodata = '';
	    	this.getGoodList();
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
	    fxDialogEvt () {
	    	this.fxPopup = true;
	    },
	    detailEvt (id) {
	    	this.$router.push({ path: '/productDetail', query:{id: id} })
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
	    getGoodType: function() {
	    	this.$http.post(this.apiUrl+'/goods/categoryList', this.mergeInfo('goods', 'categoryList', '')).then(res=>{
	    		var r = this.resolve(res.data);
		    	if(r.code == 1) {
		    		this.navList = r.data;
		    		this.currentPage = 1;
		    		var labelIndex = localStorage.getItem('curIndex');
		    		if(labelIndex !== null) {
		    			this.curGcId = r.data[labelIndex].gc_id;
		    		}else{
		    			this.curGcId = r.data[0].gc_id;
		    			localStorage.setItem('curIndex', 0);
		    		}
		    		this.inlineLoadingStatus = true;
		    		this.getGoodList();
		    	}else{
		    		this.toastStatus = true;
		      		this.toastTip = r.msg;
		    	}
	    	}).catch(res=>{
	    		console.log(res);
	    	})
	    },

	    getGoodList: function() {
	    	let d = {
	    		page: this.currentPage,
	    		pagesize: this.pagesize,
	    		gc_id: this.curGcId
	    	}
	    	this.$http.post(this.apiUrl+'/goods/goodsList', this.mergeInfo('goods', 'goodsList', d)).then(res=>{
	    		this.inlineLoadingStatus = false;
	    		var r = this.resolve(res.data);
	    		console.log(r)
	    		if(r.code == 1) {
	    			if(this.currentPage == 1) {
	    				this.productList = r.data;
	    				r.data.length ? this.nodata = '':this.nodata='暂无该类商品';
	    			}else{
	    				r.data.forEach((item) => {
                        	this.productList.push(item)
                    	});
	    			}
	    			if(r.data.length) {
	    				// this.$nextTick(() => {
					    //   	this.$refs.scroller.reset()
					    //   	this.render = true
					    // });
					    if(r.data.length < this.pagesize && this.currentPage == 1) {
					    	this.pullupTip = '';
					    }else{
					    	r.data.length == this.pagesize ? this.pullupTip = '上拉加载更多' : this.pullupTip ='已到达底部了~';
					    } 
	    			}else{
	    				this.pullupTip = '已到达底部了~';
	    			}
	    		}else{
	    			this.nodata='暂无该类商品';
		    		this.toastStatus = true;
		      		this.toastTip = r.msg;
		    	}
	    	}).catch(res=>{
	    		this.nodata='暂无该类商品';
	    		this.inlineLoadingStatus = false;
	    		console.log(res)
	    	})
	    },

	    buyPopupEvt(_index) {
	    	var item = this.productList[_index];
	    	this.buyImgSrc = item.goods_img;
	    	this.buyNum = 1;
	    	this.buyName = item.goods_name;
	    	this.buyPrice = item.goods_price;
	    	this.buyStock = item.goods_stock;
	    	this.spuId = item.spu_id;
	    	this.skuId = item.sku_id;
	    	if(item.goods_stock == 0) {
	    		this.btnState = 2;
	    	}else{
	    		this.btnState = 1;
	    	}
	    	this.buyPopup = true;
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
				if(r.code == 1) {
					this.toastStatus = true;
					this.toastTip = '成功加入购物车';
					this.buyPopup = false;
					// this.$router.push({path: '/shoppingCar'})
				}else{
					this.toastStatus = true;
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
	    }
	}
}
</script>
<style lang="less">
	#productList {
		width:100%;
		height: 100%;
		box-sizing: border-box;
		padding-top: 49px;
		padding-bottom: 48px;
		overflow: auto;
		.weui-panel {
			-moz-box-shadow: 0px 4px 0px rgba(105,105,104,0.05);
      		box-shadow: 0px 4px 0px rgba(105,105,104,0.05); 
		}
		.img-loading {
			position: relative;
			>span {
				position: absolute;
				width: 100%;
				height: 100%; 
				background-color: rgba(0,0,0,.1);
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 15px;
				color: #fff;
			}
			>img {
				display: block;
				width: 100%;
			}
		}
		.card-padding {
			padding: 0 10px;
			padding-bottom: 10px;
			.product-info {
				font-weight: 600;
				font-size: 15px;
				color: #222222;
				line-height: 15px;
				padding: 6px 0 10px;
				overflow: hidden;
		      	text-overflow: ellipsis;
			    white-space: nowrap;
			}
			.product-price {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				>span {
					flex: 1;
					font-size: 17px;
					line-height: 17px;
					color: #E23535;
					>img {
						margin-right: 2px;
					}
				}
				>button {
					width: 60px;
					height: 25px;
					line-height: 20px;
					border-color: #E23535;
					border-radius: 4px;
					color: #E23535;
					padding: 0;
					font-size: 12px;
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
		#shareBox > img {
			width: 100%;
			border-radius: 14px;
		}
		.qrcode-img {
			padding-top: 30px;
			margin-bottom: 10px;
			>img {
				width: 171px !important;
				height: 173px !important;
			}
		}
		p {
			font-size: 15px;
			line-height: 22px;
			color: #4a4a4a;
			&:last-child {
				color: #539AE9;
				margin-top: 10px;
				padding-bottom: 30px;
			}
		}
	}
</style>