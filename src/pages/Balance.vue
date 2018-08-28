<template>
	<div id="balance" class="page">
		<div class="balance-header">
			<p>余额(元)</p>
			<div>
				<span>{{balance}}</span>
				<x-button type="primary" mini @click.native="goForward">提现</x-button>
			</div>
		</div>
		<div class="balance-content">
			<div v-if="list.length">
				<h1>余额明细</h1>
				<div class="balance-list">
					<div class="balance-item" v-for="(item, index) in list" :key="index">
						<span class="balance-desc">{{item.type}}<span>{{item.create_time}}</span></span>
						<span :class="{'balance-money': true, 'red': item.type == '佣金收入', 'green': item.type == '提现' }">{{item.type == '佣金收入' ? '+' : '-'}}{{item.type == '佣金收入'? item.commission : item.apply_cash}}元</span>
					</div>
				</div>
				<!-- <div class="see-more">
					<span>查看更多</span>
				</div> -->
			</div>
			<div class="no-data" v-if="!list.length">
				{{nodata}}
			</div>
		</div>
	</div>
</template>
<script>
	import {XButton} from 'vux';
	export default {
		name: 'balance',
		components: {XButton},
		data () {
			return {
				nodata: '暂无余额明细~',
				sellerId: '',
				balance: 0,
				list: []
			}
		},
		mounted () {
			this.shield();
			this.sellerId = localStorage.getItem('seller_id');
			this.balance = localStorage.getItem('commission');
			this.getCommissionList();
		},
		methods: {
			goForward() {
				this.$router.push({path: '/forward'})
			},

			getCommissionList() {
				let d = {seller_id: this.sellerId}
				this.$http.post(this.apiUrl+'/member/commissionList', this.mergeInfo('member','commissionList', d)).then(res=>{
					var r = this.resolve(res.data);
					if(r.code == 1) {
						this.list = r.data;
					}
				}).catch(res=>{
					console.log(res)
				})
			}
		}
	}
</script>
<style lang="less">
#balance {
	.balance-header {
		width: 100%;
		height: 140px;
		background-image: linear-gradient(to right, #CD4040, #9F1E1E);
		padding: 0 14px;
		box-sizing: border-box;
		color: #fff;
		>p {
			font-size: 13px;
			line-height: 20px;
			padding-top: 30px;
			margin: 0 0 4px;
		}
		>div {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			>span {
				flex: 1;
				font-size: 40px;
				font-weight: 600;
				line-height: 56px;
			}
			>button {
				width: 100px;
				height: 40px;
				line-height: 40px;
				border-color: #fff;
				border-radius: 4px;
				font-size: 13px;
				color: #fff;
				background-color: rgba(255,255,255,0);
				&:after {
					border-color: #fff;
				}
			}
		}
	}
	.balance-content {
		background-color: #fff;
		h1 {
			height: 50px;
			line-height: 50px;
			color: #000;
			font-size: 16px;
			font-weight: normal;
			padding: 0 14px;
			box-sizing: border-box;
		}
		.balance-list {
			.balance-item {
				position:relative;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				height: 50px;
				line-height: 50px;
				padding: 0 14px;
				box-sizing: border-box;
				font-size: 14px;
				.balance-desc {
					flex: 1;
					color: #000;
					line-height: 20px;
					>span {
						display: block;
						color: #9B9B9B;
						font-size: 12px;
					}
				}
				.balance-money {
					&.red {
						color: #E23535;
					}
					&.green {
						color: #53911C;
					}
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
		.see-more {
			position: relative;
			height: 50px;
			line-height: 50px;
			font-size: 14px;
			color: #000;
			text-align: center;
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
		.no-data {
			padding: 30px 0;
			font-size: 13px;
			color: #515151;
			text-align: center;
		}
	}
}
</style>