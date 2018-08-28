<template>
	<div id="forward" class="page">
		<group class="input-box">
	      	<!-- <x-input :readonly="true" :value="cardNum" title="提现账号" class="tx-num">
	      	</x-input> -->
	      	<x-input title="提现金额" class="tx-account" placeholder="请输入提现金额(元)" v-model="applyCash">
	      	</x-input>
	    </group>
	    <p class="msg">本次可提现{{txAccount}}元</p>
	    <p class="error-msg">{{errorTipState ? errorMsg : ''}}</p>
	    <div class="tx-box-button">
			<x-button @click.native="txEvt" class="tx-btn":class="{'confirm': txState}" type="warn">确定提现</x-button>
	    </div>
	    <toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
        <div v-transfer-dom>
          <loading :show="submitStatus" text="" position="middle"></loading>
        </div>
	</div>
</template>
<script>
	import {XInput, Group, XButton, Loading} from 'vux';
	export default {
		name: 'forward',
		components: {XInput, Group, XButton, Loading},
		data () {
			return {
				submitStatus: false,
				toastStatus: false,
				toastTip: '',
				cardNum: '微信',
				txAccount: 0,
				errorMsg: '超出可提现金额',
				applyCash: '',
				txState: false,
				errorTipState: false
			}
		},
		mounted () {
			this.shield();
			this.txAccount = Number(localStorage.getItem('commission'));
		},
		watch: {
			applyCash() {
				var reg = /^\d+(?=\.{0,1}\d+$|$)/;
				if(!reg.test(this.applyCash) || !Number(this.applyCash)) {
					this.txState = false;
					this.errorTipState = false;
				}else {
					if(this.applyCash <= this.txAccount) {
						this.txState = true;
						this.errorTipState = false;
					}else{
						this.txState = false;
						this.errorTipState = true;
					}
				}
			}
		},
		methods: {
			txEvt() {
				if(!this.txState) return;
				let d = {
                    'seller_id': localStorage.getItem('seller_id'),
                    'apply_cash': this.applyCash
                }
                this.submitStatus = true;
                this.$http.post(this.apiUrl+'/member/applyCash', this.mergeInfo('member','applyCash',d)).then(res=>{
                    var r = this.resolve(res.data);
                    this.submitStatus = false;
                    this.toastStatus = true;
                    if(r.code == 1) {
                        this.toastTip = '提现申请已提交';
                        setTimeout(res=>{
                        	this.$router.push({path: '/fxCenter'});
                        }, 1500) 
                    }else{
                        this.toastTip = r.msg;
                    }
                }).catch(res=>{
                    this.submitStatus = false;
                    console.log(res)
                })
			}
		}
	}
</script>
<style lang="less">
#forward {
	.input-box {
		.weui-cells {
			margin-top: 0;
			padding-top: 10px;
			background-color: transparent;
			&:after, &:before {
				display: none;
			}
			.weui-cell {
				height: 50px;
				line-height: 50px;
				padding: 0 14px;
				background-color: #fff;
				font-size: 13px;
				color: #000;
				&:before {
					display: none;
				}
				.weui-input {
					text-align: right;
				}
				&:last-child {
					/*margin-top: 10px;*/
				}
			}
		}
	}
	>p.msg {
		padding: 0 14px;
		margin-top: 10px;
		font-size: 13px;
		color: #9b9b9b;
		box-sizing: border-box;
		line-height: 20px;
	}
	>p.error-msg {
		padding: 0 14px;
		margin-top: 6px;
		font-size: 13px;
		color: #FF9900;
		box-sizing: border-box;
		line-height: 20px;
		height: 20px;
		margin-bottom: 24px;
	}
	.tx-box-button {
		padding: 5px 14px;
		box-sizing: border-box;
		background-color: #fff;
		button.weui-btn {
			background-color: #C8C8C8;
			border-color: #C8C8C8;
			color: #fff;
			border-radius: 4px;
			font-size: 13px;
			height: 40px;
			line-height: 40px;
			&.confirm {
				border-color: #E23535;
				background-color: #E23535;
			}
		}
	}
}
</style>