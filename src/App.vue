<template>
	<div id="app">
		<div class='main'>
			<transition :name="transitionName" v-on:after-enter="afterEnter">
				<keep-alive :include="keepAliveRoute">
					<router-view ref='rv' />
				</keep-alive>
			</transition>
		</div>
		<transition :name="transitionName">
			<tab-bar v-show='$route.meta.isShowTarBar'></tab-bar>
		</transition>
	</div>
</template>

<script>
	import tabBar from './components/tabBar/tabBar.vue'
	export default {
		data() {
			return {
				transitionName: 'slide-right',
				keepAliveRoute: ['index','findBook','personal']
			}
		},
		components: {
			tabBar
		},
		watch: {
			'$route'(to,from) {
				if(to.meta.index > from.meta.index) {
					this.transitionName = 'slide-left';
				} else {
					this.transitionName = to.meta.index < from.meta.index ? 'slide-right' : ''
				}
			}
		},
		methods: {
			afterEnter() {
				if(this.$refs.rv.searchTop !== undefined) {
					this.$refs.rv.searchTop = '';
					this.$refs.rv.sortTop = '';
				}
			},
		}
	}
</script>

<style lang="scss">
	@import 'assets/scss/transition';
	@import 'assets/scss/flexCenter';
	@import 'assets/scss/mixin';
	@import 'assets/scss/baseColor';
	@import 'assets/scss/clipper';
	#app {
		height: 100%;
		display: flex;
		flex-direction: column;
		>.main {
			flex: auto;
			height: 0;
		}
	}
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		display: none;
	}
	
	//下拉刷新样式
	.van-pull-refresh__head {
		background-color: $base-bg-color;
		>img {
			width: 64px;
			height: 64px;
		}
	}
	.van-pull-refresh__head {
		@include flexCenter();
	}
	
	//上拉加载样式
	.van-list__loading {
		background-color: $base-bg-color;
		.van-loading__spinner.van-loading__spinner--circular {
			width: 32px!important;
			height: 32px!important;
			>.van-loading__circular {
				color: $base-font-color;
			}
		}
		.van-loading__text {
			@include ft-size(14);
			color: $base-font-color;
		}
		>img {
			width: 64px;
			height: 64px;
		}
	}
	.van-list__finished-text {
		@include ft-size(14);
		color: $base-font-color;
	}
	
	// 重写dialog样式
	div.van-dialog {
		width: 480px;
		.van-dialog__message {
			text-align: center;
			line-height: normal;
			padding: 48px 0;
		}
		.van-dialog__footer {
			padding: 20px 0;
			.van-dialog__confirm {
				color: $base-color;
			}
		}
		.van-dialog__message,
		.van-button__text {
			@include ft-size(14);
		}
	}
	
	.van-loading {
		text-align: center;
		>span {
			width: 50px;
			height: 50px;
		}
	}
	
	//重写toast样式
	div.van-toast {
		min-width: 200px;
		max-width: 70%;
		padding: 20px;
		.van-toast__icon {
			@include ft-size(20);
			margin-top: 20px;
		}
		.van-toast__text {
			@include ft-size(14);
			margin: 20px 0;
		}
	}
</style>
