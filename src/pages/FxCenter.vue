<template>
	<div id="fxCenter" class="page">
		<div class="my-header">
			<p style="padding-top: 34px;">当前店铺累计收益(元)</p>
			<countup :end-val="Number(account)" :duration="3" :decimals="2" class="fx-account"></countup>
			<p>包含待结算{{settledMoney}}</p>
		</div>
		<section class="content">
			<group class="cell-box">
				<cell :title="commission" is-link value="立即提现" :link="{path: '/balance'}"></cell>
			</group>
			<div class="fx-content">
				<div class="fx-item">
					<countup :end-val="bindingNum" :duration="3" :decimals="0" class="fx-account"></countup>
					<!-- <p><router-link :to="{path: 'bindCustomer'}">绑定客户</router-link></p> -->
					<p>绑定客户</p>
				</div>
				<div class="fx-item">
					<countup :end-val="tgNum" :duration="3" :decimals="0" class="fx-account"></countup>
					<!-- <p><router-link :to="{path: 'extension'}">推广订单</router-link></p> -->
					<p>推广订单</p>
				</div>
			</div>
		</section>
		<FooterComponent></FooterComponent>
	</div>
</template>
<script>
	import {Countup, Group, Cell} from 'vux'
	import FooterComponent from '../components/Footer';
	export default {
		name: 'fxCenter',
		components: {FooterComponent, Countup, Group, Cell},
		data () {
			return {
				settledMoney: '', //待结算
				account: '', //收益
				commission: '', //可提现
				bindingNum: 0, //绑定人数
				tgNum: 0, //推广订单
				sellerId: ''
			}
		},
		mounted () {
			this.shield();
			this.sellerId = localStorage.getItem('seller_id');
			this.getSellerInfo();
		},
		methods: {
			getSellerInfo() {
				let d = {seller_id: this.sellerId}
				this.$http.post(this.apiUrl+'/member/getSellerInfo', this.mergeInfo('member','getSellerInfo', d)).then(res=>{
					var r = this.resolve(res.data);
					if(r.code == 1) {
						var data = r.data;
						this.settledMoney = data.unfinished_order_commission;
						this.commission = '可提现佣金'+data.can_apply_cash+'元';
						this.account = data.total_commission;
						this.bindingNum = data.bind_number;
						this.tgNum = data.order_number;
						localStorage.setItem('commission', data.can_apply_cash);
					}
				}).catch(res=>{
					console.log(res);
				})
			}
		}
	}
</script>
<style lang="less">
#fxCenter{
	.my-header {
		width: 100%;
		height: 180px;
		background-image: linear-gradient(to right, #CD4040, #9F1E1E);
		color: #fff;
		text-align: center;
		>p {
			font-size: 13px;
			line-height: 20px;
		}
		.fx-account {
			display: block;
			font-size: 40px;
			line-height: 56px;
			margin: 10px 0 20px;
		}
	}
	section.content {
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
				font-size: 15px;
				.vux-label {
					color: #4a4a4a;
				}
				.weui-cell__ft {
					color: #9b9b9b;
					padding-right: 16px;
					&:after{
						border-color:#4A4A4A;
					}
				}
			}
		}
		.fx-content {
			display: flex;
			background-color: #fff;
			margin-top: 4px;
			height: 100px;
			.fx-item {
				flex: 1;
				text-align: center;
				.fx-account {
					display: block;
					font-size: 26px;
					line-height: 37px;
					color: #E23535;
					margin: 17px 0 10px;
				}
				p,p>a{
					font-size: 14px;
					color: #4a4a4a;
					line-height: 20px;
				}
				
			}
		}
	}
}
</style>