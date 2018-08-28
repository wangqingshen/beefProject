<template>
	<div id="changePhone" class="page">
		<group>
	      	<x-input type="tel" v-model="mob" placeholder="输入您的新手机号码" title="" class="weui-phone" :max="11" keyboard="number" :required="false">
	        	<x-button slot="right" type="primary" mini plain :class="{'save': mob.length == 11}" @click.native="editMobile">保存</x-button>
	      	</x-input>
	    </group>
        <toast v-model="toastStatus" type="text" :time="800" :text="toastTip" position="middle"></toast>
        <div v-transfer-dom>
          <loading :show="submitStatus" text="" position="middle"></loading>
        </div>
	</div>
</template>
<script>
	import {XInput, Group, XButton, Loading} from 'vux';
	export default {
		name: 'changePhone',
		components: {XInput, Group, XButton, Loading},
		data () {
			return {
                mob: '',
                toastStatus: false,
                toastTip: '',
                memberId: '',
                submitStatus: false
			}
		},
		mounted () {
            this.shield();
            this.memberId = localStorage.getItem('member_id');
            var mob = localStorage.getItem('member_mobile');
            if(mob != undefined) {
                this.mob = mob
            }
		},
		methods: {
            editMobile() {
                if(this.mob.length != 11) return;
                var reg=/^1[3456789]\d{9}$/;
                if(!reg.test(this.mob)) {
                    this.toastStatus = true;
                    this.toastTip = '手机号码格式错误';
                    return;
                }
                let d = {
                    'member_id': this.memberId,
                    'member_mobile': this.mob
                }
                this.submitStatus = true;
                this.$http.post(this.apiUrl+'/member/editMobile', this.mergeInfo('member','editMobile',d)).then(res=>{
                    var r = this.resolve(res.data);
                    this.submitStatus = false;
                    this.toastStatus = true;
                    if(r.code == 1) {
                        localStorage.setItem('member_mobile', this.mob);
                        this.toastTip = '编辑成功';
                        this.$router.push({path: '/my'});
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
#changePhone {
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
			button {
				border: 0;
				padding: 0;
				font-size: 13px;
				color: #9B9B9B;
                &.save {
                    color: #E23535;
                }
			}
		}
	}
}
</style>