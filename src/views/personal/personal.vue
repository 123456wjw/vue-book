<template>
	<div class="personal">
		<div class="personal-top">
			<div class="login" @click='!token && gotoLogin()'>
				<div class='loginImg'>
					<input class='chooseImg' type="file" v-show='token' accept='image/gif,image/jpeg,image/jpg,image/png,image/svg' @change="change($event)">
					<img id='photoImg' :src='user.photosrc || require("./default.png")' v-if='token'>
					<img src="./default.1.png" v-if='!token'>
				</div>
				<div class='loginTitle' v-if='!token'>
					请登录
				</div>
				<div class='userMsg' v-else>
					<span class='username'>{{user.phone}}</span><br>
					<span class='personalized'>{{user.personalized || '个性签名'}}</span>
				</div>
			</div>
		</div>
		<ul class='personal-main'>
			<li @click='goInto("setPersonal")'>
				<img src="./personal.png">
				<span>个人资料</span>
			</li>
			<li @click='goInto("collect")'>
				<img src="./collect.png">
				<span>我的收藏</span>
			</li>
			<li @click='logout' v-if='token'>
				<img src="./logout.png">
				<span>退出登录</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import { Dialog } from 'vant';
	import { mapState,mapMutations } from 'vuex';
	import { clearLoginState } from 'assets/js/utils'
	export default {
		name: 'personal',
		data() {
			return {
				
			}
		},
		computed: {
			...mapState('loginState',[
				'token',
				'user'
			]),
		},
		methods: {
			...mapMutations('loginState',[
				'setToken',
				'setUser'
			]),
			logout() {
				Dialog.confirm({
				  message: '确定要退出登录吗',
				}).then(() => {
					clearLoginState()
					//掉接口登出
				}).catch(() => {
					
				})
				
			},
			change( event ) {
			    let image = document.getElementById('photoImg'); //预览对象
			    this.clip(event , {
			      resultObj : image,
			      aspectRatio : 1
			    })
			},
			gotoLogin() {
				this.$router.push({name: 'login'});
			},
			goInto(name) {
				if(this.token) {
					this.$router.push({name: name});
				} else {
					Dialog.confirm({
					  message: '请先登录',
					}).then(() => {
						this.$router.push({name: 'login'});
					}).catch(() => {
						
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	.personal {
		width: 100%;
		height: 100%;
	}
	.personal-top {
		background-color: $base-color;
		height: 250px;
		position: relative;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		>.login {
			width: calc(100% - 40px);
			height: 200px;
			background-color: white;
			border-radius: 10px;
			box-shadow: 6px 6px 14px 0 rgba(26,26,26,.06);
			position: absolute;
			bottom: -100px;
			display: flex;
			align-items: center;
			padding-left: 40px;
			box-sizing: border-box;
			>.loginImg {
				position: relative;
				border-radius: 50%;
				overflow: hidden;
				width: 100px;
				height: 100px;
				margin-right: 40px;
				>.chooseImg {
					height: 100%;
					width: 100%;
					position: absolute;
					opacity: 0;
				}
				>img {
					width: 100%;
					height: 100%;
				}
			}
			.loginTitle {
				@include ft-size(16);
				font-weight: 700;
			}
			.userMsg {
				.username {
					@include ft-size(16);
					font-weight: 700;
					padding: 10px 0;
					color: black;
				}
				.personalized {
					@include ft-size(14);
					color: $base-font-color;
				}
			}
		}
	}
	.personal-main {
		width: calc(100% - 40px);
		margin-top: 120px;
		margin: 120px auto 0;
		>li {
			background: url(./arrow.png) right center/48px 48px no-repeat;
			padding: 20px;
			border-bottom: 1PX solid #ccc;
			>img {
				width: 80px;
				height: 80px;
				margin-right: 20px;
			}
			>span {
				@include ft-size(16);
			}
		}
	}
</style>
