<template>
	<div id="address" class="page">
		<div class="address-content">
			<div class="btn-box">
				<x-button plain @click.native="addNewAddress('')">新增</x-button>
			</div>
			<div class="loading-wrapper" v-if="inlineLoadingStatus">
				<inline-loading></inline-loading><span>数据加载中</span>
			</div>
			<div class="hasData" v-if="list.length">
				<div class="address-box">
					<div class="address-item" v-for="(item, index) in list" :key="index" @click="selectEvt(index)">
						<div class="address-header">
							<span class="address-name">{{item.true_name}}</span>
							<span class="address-mob">{{item.mobile}}</span>
						</div>
						<div class="address-content">
							{{item.address}}
						</div>
						<div class="address-bottom">
							<check-icon :value.sync="item.is_default == 1"  @click.stop.native="setDefaultEvt(item.address_id)">设为默认地址</check-icon>
							<div class="opt-box">
								<div class="opt-item">
									<img src="../../static/images/ic_edit.svg" alt="">
									<span @click.stop="addNewAddress(item)">编辑</span>
								</div>
								<div class="opt-item">
									<img src="../../static/images/ic_del.svg" alt="" >
									<span @click.stop="del(item.address_id)">删除</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="nodata" v-if="!list.length">
				{{nodata}}
			</div>
		</div>
		<div v-transfer-dom>
	      	<x-dialog v-model="delDialogStatus" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
	        	<div class="dialog-box">
			        <span class="dialog-close"  @click="delDialogStatus=false"><img src="../../static/images/ic_close.svg" alt=""></span>
	        		<div class="dialog-box-header">
	        			<img src="../../static/images/ic_del.svg" alt="" class="ic-delete">
	        			<p>确定要删除此联系方式吗?</p>
	        		</div>
	        		<div class="dialog-box-button" style="margin-top: 60px;">
	        			<flexbox>
					        <flexbox-item>
					          	<x-button class="cancel-btn" type="primary" plain @click.native="delDialogStatus=false">再想想</x-button>
					        </flexbox-item>
					        <flexbox-item>
					          	<x-button class="confirm-btn" type="warn" @click.native="delConfirm">确定</x-button>
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
	</div>
</template>
<script>
	import {XInput, Group, XButton, CheckIcon, XDialog, Loading, InlineLoading} from 'vux';
	export default {
		name: 'addressList',
		components: {XInput, Group, XButton, CheckIcon, XDialog, Loading, InlineLoading},
		data () {
			return {
				type: '',
				memberId: '',
				list: [],
				addressId: '',
				nodata: '',
				delDialogStatus: false,
				toastTip: '',
				toastStatus: false,
				submitStatus: false,
				inlineLoadingStatus: false,
			}
		},
		mounted () {
			this.shield();
			this.memberId = localStorage.getItem('member_id');
			this.type = this.$route.query.t;
			this.inlineLoadingStatus = true;
			this.getAddressList()
		},
		methods: {
			addNewAddress (info) {
				if(info != '') info = JSON.stringify(info);
				this.$router.push({path: '/addAddress', query:{info:info, t: this.type}})
			},

			selectEvt(_index) {
				if(this.type == 1) return;
				this.setDefaultEvt(this.list[_index].address_id)
			},

			del (id) {
				this.addressId = id;
				this.delDialogStatus = true;
			},

			setDefaultEvt(id) {
				this.submitStatus = true;
				let d = {'address_id': id, 'member_id': this.memberId}
				this.$http.post(this.apiUrl+'/member/changeDefaultAddress', this.mergeInfo('member','changeDefaultAddress', d)).then(res=>{
					var r = this.resolve(res.data);
					this.submitStatus = false;
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '设置默认地址成功';
						if(this.type == 1) {
							this.getAddressList();
						}else if(this.type == 2) {
							this.$router.push({path: '/confirmOrder'})
						}
						
					}else{
						this.toastTip = r.msg;
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res)
				})
			},

			getAddressList () {
				let d = {'member_id': this.memberId}
				this.$http.post(this.apiUrl+'/member/addressList', this.mergeInfo('member','addressList', d)).then(res=>{
					var r = this.resolve(res.data);
					console.log(r);
					this.inlineLoadingStatus = false;
					if(r.code == 1) {
						this.list = r.data;
						if(!r.data.length) this.nodata = '暂无地址，赶快去添加一个吧~';
					}else{
						this.list = [];
						this.nodata = '暂无地址，赶快去添加一个吧~';
					}
				}).catch(res=>{
					this.inlineLoadingStatus = false;
					this.list = [];
					this.nodata = '暂无地址，赶快去添加一个吧~';
					console.log(res);
				})
			},

			delConfirm() {
				let d = {'address_id': this.addressId}
				this.submitStatus = true;
				this.$http.post(this.apiUrl+'/member/deleteAddress', this.mergeInfo('member','deleteAddress', d)).then(res=>{
					var r = this.resolve(res.data);
					this.submitStatus = false;
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '删除成功';
						this.delDialogStatus = false;
						this.getAddressList();
					}else{
						this.toastTip = r.msg;
					}
				}).catch(res=>{
					this.submitStatus = false;
					console.log(res);
				})
			}
		}
	}
</script>
<style lang="less">
#address {
	.address-content {
		.btn-box {
			position: relative;
			padding: 5px 14px;
			box-sizing: border-box;
			background-color: #fff;
			&:after {
				content: " ";
			    position: absolute;
			    left: 0;
			    bottom: 0;
			    right: 0;
			    height: 1px;
			    border-top: 1px solid #EDEDED;
			    color: #EDEDED;
			    -webkit-transform-origin: 0 0;
			    transform-origin: 0 0;
			    -webkit-transform: scaleY(0.5);
			    transform: scaleY(0.5);
			}
			button.weui-btn {
				border-color: #E23535;
				color: #E23535;
				border-radius: 4px;
				font-size: 13px;
				height: 40px;
				line-height: 40px;
			}
		}
		.hasData {
			.address-box {
				.address-item {
					background-color: #fff;
					position: relative;
					padding-top: 14px;
					box-sizing: border-box;
					color: #515151;
					font-size: 14px;
					margin-bottom: 4px;
					.address-header {
						padding: 0 14px;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						line-height: 20px;
						margin-bottom: 8px;
						.address-name {
							flex: 1;
						}
					}
					.address-content {
						position: relative;
						font-size: 13px;
						line-height: 20px;
						overflow: hidden;
				      	text-overflow: ellipsis;
					    white-space: nowrap;
					    padding: 0 14px 14px;
					    &:after {
							content: " ";
						    position: absolute;
						    left: 0;
						    bottom: 0;
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
					.address-bottom {
						display: flex;
						justify-content: flex-end;
						align-items: center;
						padding: 8px 14px;
						.vux-check-icon {
							flex: 1;
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
							>span {
								font-size: 13px;
								color: #4a4a4a;
							}
						}
						.opt-box {
							display: flex;
							justify-content: space-around;
							align-items: center;
							.opt-item {
								display: flex;
								justify-content: space-around;
								align-items: center;
								margin-left: 10px;
								>img {
									width: 14px;
									height: 14px;
									margin-right: 6px;
								}
								>span {
									font-size: 13px;
								}
							}
						}
					}
					.address-status {
						font-size: 13px;
						line-height: 20px;
						margin-top: 5px;
						color: #FE6D4C;
					}
				}
			}
		}
		.nodata {
			text-align: center;
			font-size: 13px;
			color: #b1b1b1;
			padding: 20px;
		}
	}
}
</style>