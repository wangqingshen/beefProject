<template>
	<div id="my" class="page">
		<div class="my-header">
			<img :src="avatar" alt="微信头像">
			<span class="wx-name">{{nickName}}</span>
		</div>
		<group class="cell-box">
			<cell title="我的手机号" is-link :value="mob" :link="{path: '/changePhone'}"></cell>
			<cell title="我的收货地址" is-link :link="{path: '/address', query: {t: 1}}"></cell>
			<cell :title="fxTitle" is-link :value="fxTip" class="fxClass" @click.native="fxOptEvt"></cell>
		</group>
		<div v-transfer-dom>
	      	<x-dialog v-model="dialogStatus" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
	        	<div class="dialog-box">
	        		 <span class="dialog-close"  @click="dialogStatus=false"><img src="../../static/images/ic_close.svg" alt=""></span>
	        		<div class="dialog-box-header" v-if="status == 0">
	        			<img src="../../static/images/ic_ask.svg" alt="" class="ic-ask">
	        			<p>确认要成为分销商吗</p>
	        		</div>
	        		<div class="dialog-box-header" v-if="status == 1">
	        			<img src="../../static/images/examine_ing.png" alt="" class="ic-examine">
	        			<p>您的申请正在审核中 请耐心等待结果</p>
	        		</div>
	        		<div class="dialog-box-header" v-if="status == 2">
	        			<img src="../../static/images/examine_fail.png" alt="" class="ic-examine-fail">
	        			<p>理由：{{examineFailMsg}}</p>
	        		</div>
	        		<div class="dialog-box-button">
	        			<flexbox v-if="status == 0" style="margin-top: 52px">
					        <flexbox-item>
					          	<x-button class="cancel-btn" type="primary" plain @click.native="dialogStatus=false">再想想</x-button>
					        </flexbox-item>
					        <flexbox-item>
					          	<x-button class="confirm-btn" type="warn" @click.native="becomeFxConfirm">确定</x-button>
					        </flexbox-item>
					    </flexbox>
					    <flexbox v-if="status == 1" style="margin-top: 21px;">
					        <flexbox-item>
					          	<x-button class="confirm-btn" type="warn" @click.native="dialogStatus=false">确定</x-button>
					        </flexbox-item>
					    </flexbox>
					    <flexbox v-if="status == 2" style="margin-top: 21px">
					        <flexbox-item>
					          	<x-button class="confirm-btn" type="warn" @click.native="becomeFxConfirm">重新申请</x-button>
					        </flexbox-item>
					    </flexbox>
	        		</div>
	        	</div>
	      	</x-dialog>
	    </div>
	    <toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
        <div v-transfer-dom>
          <loading :show="submitStatus" text="" position="middle"></loading>
        </div>
		<FooterComponent></FooterComponent>
	</div>
</template>
<script>
	import FooterComponent from '../components/Footer'
	import {Cell, XDialog, Group, XButton, Loading} from 'vux'
	export default {
		name: 'my',
		components: {FooterComponent, Cell, XDialog, Group, XButton, Loading},
		data () {
			return {
				openId: '',
				dialogStatus: false,
				avatar: '../../static/images/user_logo.png',
				nickName: '微信昵称',
				mob: '',
				fxTitle: '',
				fxTip: '',
				status: 0,
				examineFailMsg: '用户已申请，不能重复操作',
				toastStatus: false,
				submitStatus: false,
				toastTip: '',
				sellerStatus: ''
			}
		},
		mounted () {
			this.openId = localStorage.getItem('openid');
			this.shield();
			this.getUserInfo();
		},
		methods: {
			init() {
				var mob = localStorage.getItem('member_mobile'),
					avatar = localStorage.getItem('member_avatar'),
					nickName = localStorage.getItem('member_nick_name'),
					fxStatus = localStorage.getItem('fxStatus');
	            if(mob != undefined) {
	                this.mob = mob
	            }
	            if(fxStatus == 'true') {
	            	this.fxTitle = '分销商中心';
	            	this.fxTip = '';
	            }else{
	            	this.fxTitle = '申请成为分销商';
	            	console.log(localStorage.getItem('seller_status'))
	            	var seller_status = this.sellerStatus;
	            	if(seller_status === '') {
	            		this.fxTip = '';
	            		this.status = 0;
	            	}else if(seller_status === 0) {//审核中
	            		this.fxTip = '审核中';
	            		this.status = 1;
	            	}else if(seller_status == 2) {//审核不通过
	            		this.fxTip = '审核不通过';
	            		this.status = 2;
	            	}else if(seller_status == 3) {//禁用
	            		this.fxTip = '已禁用';
	            		this.status = 3;
	            	}
	            }
	            this.avatar = avatar;
	            this.nickName = nickName;
			},
			becomeFxConfirm () {
				this.submitStatus = true;
				let d = {'mini_openid': this.openId}
				this.$http.post(this.apiUrl+'/member/toBeDistributor', this.mergeInfo('member','toBeDistributor', d)).then(res=>{
					var r = this.resolve(res.data);
					this.submitStatus = false;
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '申请提交成功';
						this.dialogStatus = false;
						this.getUserInfo();
					}else{
						this.toastTip = r.msg;
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res);
				})
			},

			fxOptEvt() {
				var fxStatus = localStorage.getItem('fxStatus');
				if(fxStatus == 'true') {
					this.$router.push({path: '/fxCenter'})
				}else{
					this.dialogStatus = true;
				}
			},

			getUserInfo() {
		    	let d = {
		    		'mini_openid': this.openId
		    	}
		    	this.$http.post(this.apiUrl+'/member/getMemberInfo', this.mergeInfo('member','getMemberInfo',d)).then(res=>{
		    		var r = this.resolve(res.data);
		    		console.log(r)
		    		if(r.code == 1 && r.data) {
		    			var fxStatus = '';
		    			if(r.data.seller_info.seller_id) {
		    				localStorage.setItem('seller_id', r.data.seller_info.seller_id);
		    				localStorage.setItem('seller_status', r.data.seller_info.seller_status);
		    				localStorage.setItem('seller_remark', r.data.seller_info.remark);
		    				this.examineFailMsg = r.data.seller_info.remark;
		    				this.sellerStatus = r.data.seller_info.seller_status;
		    				if(r.data.seller_info.seller_status == 1) {
		    					fxStatus = 'true';
		    				}else{
		    					fxStatus = 'false';
		    				}
		    			}else{
		    				fxStatus = 'false';
		    			}
		    			localStorage.setItem('fxStatus', fxStatus);
		    			this.init();
		    		}
		    	}).catch(res=>{
		    		console.log(res)
		    	})
		    }
		}
	}
</script>
<style lang="less">
#my {
	.my-header {
		width: 100%;
		height: 170px;
		padding-top: 27px;
		box-sizing: border-box;
		background-image: linear-gradient(to right, #CD4040, #9F1E1E);
		>img {
			display: block;
			width: 74px;
			height: 74px;
			margin: 0 auto 16px;
			border-radius: 50%;
		}
		>span.wx-name {
			display: block;
			color: #fff;
			font-size: 15px;
			text-align: center;
			line-height: 22px; 
		}
	}
	.cell-box {
		background-color: #fff;
		.weui-cells {
			margin-top: 0;
		}
		.weui-cell {
			padding: 0 14px;
			height: 50px;
			line-height: 50px;
			font-size: 15px;
			color: #4A4A4A;
			&:before {
				left: 0;
				border-color: #EDEDED;
			}
			.weui-cell__ft {
				color: #9b9b9b;
				padding-right: 16px;
				&:after{
					border-color:#4A4A4A;
				}
			}
			&.fxClass {
				.weui-cell__ft {
					font-size: 13px;
					color: #E23535;
				}
			}
		}
	}
}
</style>