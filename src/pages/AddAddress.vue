<template>
	<div id="address" class="page">
		<div class="add-address-content">
			<group>
		      	<x-input placeholder="收货人" title="" class="weui-name" v-model="addressName">
		      	</x-input>
		        <x-input type="tel" :max="11" placeholder="手机号码" title="" class="weui-mob"  v-model="addressMob">	
		      	</x-input>
		      	<div class="address-info-box">
		      		<x-textarea v-model="addressInfo" name="description" placeholder="收货地址：如xx省xx市xx区、道路、门牌号、小区、楼栋号、单元室等" :rows="2"></x-textarea>
		      	</div>
		      	<div class="address-btn-box">
			    	<x-button plain @click.native="saveAddress">保存</x-button>
			    </div>
		    </group>
		</div>
		<toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
        <div v-transfer-dom>
          <loading :show="submitStatus" text="" position="middle"></loading>
        </div>
	</div>
</template>
<script>
	import {XInput, Group, XButton, CheckIcon, XDialog, Loading, XTextarea} from 'vux';
	export default {
		name: 'addAddress',
		components: {XInput, Group, XButton, CheckIcon, XDialog, Loading, XTextarea },
		data () {
			return {
				type: '',
				memberId: '',
				addressId: '',
				addressName: '',
				addressMob: '',
				addressInfo: '',
				toastTip: '',
				toastStatus: false,
				submitStatus: false
			}
		},
		mounted () {
			this.shield();
			this.memberId = localStorage.getItem('member_id');
			this.type = this.$route.query.t;
			let info = this.$route.query.info;
			if(info) {
				info = JSON.parse(info);
				this.addressId = info.address_id;
				this.addressName = info.true_name;
				this.addressMob = info.mobile;
				this.addressInfo = info.address;
			}
		},
		methods: {
			saveAddress () {
				if(this.addressName == '') {
					this.toastStatus = true;
					this.toastTip = '收货人不能为空';
					return;
				}
				if(this.addressMob == '') {
					this.toastStatus = true;
					this.toastTip = '手机号码不能为空';
					return;
				}else{
					var reg=/^1[3456789]\d{9}$/;
	                if(!reg.test(this.addressMob)) {
	                    this.toastStatus = true;
	                    this.toastTip = '手机号码格式错误';
	                    return;
	                }
				}
				if(this.addressInfo == '') {
					this.toastStatus = true;
					this.toastTip = '收货地址不能为空';
					return;
				}
				let d = {
					'member_id': this.memberId,
					'true_name': this.addressName,
					'mobile': this.addressMob,
					'address': this.addressInfo
				}
				console.log(this.addressId);
				if(this.addressId) d.address_id = this.addressId;
				this.submitStatus = true;
				this.$http.post(this.apiUrl+'/member/editAddress', this.mergeInfo('member','editAddress', d)).then(res=>{
					var r = this.resolve(res.data);
					console.log(r.data)
					this.submitStatus = false;
					this.toastStatus = true;
					if(r.code == 1) {
						this.toastTip = '保存成功';
						this.$router.push({path: '/address', query: {t: this.type}});
					}else{
						this.toastTip = d.msg;
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
	.add-address-content {
		.weui-cells {
			margin-top: 0;
			&:before, &:after {
				display: none;
			}
			.weui-cell {
				padding: 0 14px;
				height: 50px;
				line-height: 50px;
				box-sizing: border-box;
				color: #9B9B9B;
				font-size: 13px;
				&:before {
					border-color:#EDEDED;
					color: #EDEDED;
					left: 0;
				}
				.weui-input {
					color: #4a4a4a;
				}
			}
			.address-info-box {
				position: relative;
				>p {
					/*font-size: 13px;
					line-height: 20px;
					color: #9B9B9B;
					padding: 16px 14px 0;*/
				}
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
				>.weui-cell {
					height: auto;
					line-height: 20px;
					padding-top: 16px;
					padding-bottom: 26px;
					&:before {
						display:none;
					}
					.weui-textarea {
						color: #4a4a4a;
					}
				}
			}

		}
		.address-btn-box {
			position: relative;
			padding: 5px 14px;
			box-sizing: border-box;
			background-color: #fff;
			button.weui-btn {
				border-color: #E23535;
				color: #E23535;
				border-radius: 4px;
				font-size: 13px;
				height: 40px;
				line-height: 40px;
			}
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
</style>