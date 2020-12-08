<template>
	<div class="login">
		<ul class="loginBox">
			<h3>欢迎登录</h3>
			<li>
				<input maxlength="13" type="text" placeholder="请输入手机号" v-model='phone' @input='checkPhone'>
			</li>
			<li>
				<input maxlength="6" ref='identifyInp' type="text" placeholder='请输入验证码' v-model='identify'>
				<button v-show='isPass' class='btn' @click='!countDown && getIdentify()'>{{countDown ? countDown : "获取验证码"}}</button>
			</li>
			<div class='loginBtnBox'>
				<button class='btn' @click='login'>登录</button>
				<button class='btn' @click='$router.go(-1)'>返回</button>
			</div>
		</ul>
	</div>
</template>

<script>
	import throttle from 'assets/js/throttle';
	import { Dialog } from 'vant';
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				phone: '',
				identify: '',
				countDown: 0,
				isPass: false,
				dxIdentify: ''
			}
		},
		methods: {
			...mapMutations('loginState',[
				'setToken',
				'setUser'
			]),
			getIdentify: throttle(function() {
				this.countDown = 60;
				let timer = setInterval(() => {
					this.countDown--
					if(this.countDown == 0) {
						clearInterval(timer)
					}
				},1000)
				this.$post('users/getIdentify',{phone: this.phone}).then(res => {
					console.log('getIdentify',res);
					this.dxIdentify = res.identify;
					Dialog.alert({
					  message: res.identify,
					})
				})
			}),
			login() {
				this.$post('users/login',{phone: this.phone,identify: this.identify}).then(res => {
					console.log('users/login',res);
					if(res.code == 0) {
						this.$router.go(-1);
						this.setToken('Bearer ' + res.token); //jwt token验证需要在前面加Bearer
						this.setUser(res.user);
						window.localStorage.setItem('token','Bearer ' + res.token);
						window.localStorage.setItem('user',JSON.stringify(res.user));
					} else {
						Dialog.alert({
						  message: res.msg,
						})
					}
				})
			},
			checkPhone() {
				if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
					this.isPass = false;
					return false;
				}
				this.isPass = true;
				this.$refs.identifyInp.focus();
			}
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/flexCenter';
	@import '../../assets/scss/mixin';

	.login {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		@include bg-image("../../assets/img/book");
		background-size: 248px 128px;
		background-position: center 130px;
		background-color: $base-color;

		.loginBox {
			width: calc(100% - 40px);
			margin: 0 auto;
			padding: 40px;
			box-sizing: border-box;
			border: 1PX solid #ccc;
			background-color: white;
			box-shadow: 0 0 14px 3px rgba(26, 26, 26, .06);
			border-radius: 10px;

			>h3 {
				text-align: center;
				color: $base-font-color;
				@include ft-size(18);
			}

			>li {
				border-bottom: 1PX solid #ccc;
				padding-left: 50px;
				margin: 80px 0;
				height: 80px;
				box-sizing: border-box;
				background: url(./phone.png) left center/32px 32px no-repeat;

				&:nth-of-type(2) {
					background-image: url(./identify.png);
					display: flex;
					justify-content: space-between;
				}

				>input {
					@include ft-size(16);
					color: $base-font-color;
					line-height: 80px;
					height: 80px;
				}
			}

			>.loginBtnBox {
				>.btn {
					width: 100%;
					margin: 20px 0;
					&:nth-child(2) {
						background-color: #efefef;
						color: $base-font-color;
					}
				}
			}

			.btn {
				@include ft-size(16);
				background-color: $base-color;
				color: white;
				padding: 10px;
				width: 200px;
				height: 80px;
				line-height: 60px;
				box-sizing: border-box;
			}
		}
	}
</style>
