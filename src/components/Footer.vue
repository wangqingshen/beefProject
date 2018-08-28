<template>
	<tabbar id="footer">
      	<tabbar-item :link="{path: item.path}" v-for="(item, index) in footerlist" :key="index">
      		<img slot="icon" src="'../../static/images/ic_home.svg" v-if="item.icon">
        	<span slot="label">{{item.name}}</span>
      	</tabbar-item>
    </tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
	name: 'Footer',
  	components: {
	    Tabbar,
	    TabbarItem
  	},
  	data() {
  		return {
  			footerlist: [
  				{name: '', icon: 'ic_home.svg', path: '/'},
  				{name: '购物车', icon: '', path: '/shoppingCar'},
  				{name: '订单', icon: '', path: '/order'},
  				{name: '我的', icon: '', path: '/my'},
  			]
  		}
  	},

  	methods: {

  	}
}
</script>

<style lang="less">
	#footer {
		position: fixed;
		height: 48px;
		background-color: #FAFAFA !important;
		&:before {
			border-top: 1px solid #E1E1E1;
		}
		.weui-tabbar__item {
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 3;
			border-right: 1px solid #E1E1E1;
			font-size: 14px;
			color: #4b4b4b;
			padding: 0 15px;
			box-sizing: border-box;
			&:first-child {
				flex: 1;
				.weui-tabbar__icon {
					width: 18px;
					height: 18px;
				}
			}
			&:nth-child(2) {
				.weui-tabbar__icon {
					width:14px;
					height: 16px;
				}
			}
			&:nth-child(3) {
				.weui-tabbar__icon {
					width: 13px;
					height: 16px;
				}
			}
			&:last-child {
				.weui-tabbar__icon {
					width: 16px;
					height: 16px;
				}
			}
			&:not(:first-child) {
				.weui-tabbar__label {
					color: #4b4b4b;
					font-size: 14px;
					/*margin-left: 6px;*/
				}
			}

		}
	}
</style>