<template>
	<header>
		<tab class="home-header" bar-active-color="transparent">
	  		<tab-item @on-item-click="handler(item.gc_id, index)" :selected="curNav == index" v-for="(item, index) in list" :key="index">
	  			{{item.gc_name}}
	  		</tab-item>
		</tab>
	</header>
	
</template>

<script>

export default {
  	name: 'Header',
  	data () {
	    return {
	     	curNav: 0
	    }
  	},
  	props: {
  		list: {
  			type: Array,
  			required: true
  		}
  	},
  	mounted(){
  		var labelIndex = localStorage.getItem('curIndex');
		if(labelIndex !== null) {
			this.curNav = labelIndex;
		}
  	},
  	methods: {
  		handler(id, index) {
  			if(index == this.curNav) return;
  			this.curNav = index;
  			localStorage.setItem('curIndex', index);
  			this.$emit('indexValue', id);
  		}
  	}
}
</script>

<style lang="less">
	header {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		z-index: 100;
		overflow: hidden;
	}
	.home-header {
		padding-top: 50px !important;
		.vux-tab-container {
			height: 50px;
			.vux-tab {
				height: 100%;
				background-color: #E23535;
				.vux-tab-item {
					background: none;
					background-color: #E23535;
					line-height: 50px;
					color: #fff;
					transition:all 0.5s;
					-moz-transition:all 0.5s; /* Firefox 4 */
					-webkit-transition:all 0.5s; /* Safari and Chrome */
					-o-transition:all 0.5s; /* Opera */
					&.vux-tab-selected {
						background-color: #9F1E1E;
					}
				}
			}
		}
	}
</style>