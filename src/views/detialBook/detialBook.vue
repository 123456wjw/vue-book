<template>
	<div class="detial-book">
		<div class="title">
			<img @click='goBack' src="../../assets/img/back.png">
			<span>{{book.title}}</span>
		</div>
		<van-loading type="spinner" v-show='loading' color="#000000" />
		<div class="detailmsg" v-show='!loading'>
			<div class="pciture">
				<img :src="book.src">
			</div>
			<div class="msg">
				<p>{{book.msg}}</p>
				<div style='display: flex;align-items: center;'>
					<span>收藏数: {{book.collect}}</span>
					<div class='like' :class='{like_click: isClick, liked: isCollect}' @click='collect' />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		Dialog
	} from 'vant';
	export default {
		data() {
			return {
				book: {},
				isClick: false,
				isCollect: false
			}
		},
		created() {
			this.setLoading(true);
			this.getDetail();
		},
		computed: {
			...mapState('loginState', [
				'user',
				'token'
			]),
			...mapState('loading', [
				'loading'
			])
		},
		watch: {
			token(val) {
				if (val) {
					this.getDetail();
				}
			}
		},
		methods: {
			...mapMutations('loading', [
				'setLoading'
			]),
			goBack() {
				this.$router.go(-1);
			},
			getDetail() {
				let params = {
					id: this.$route.query.id
				};
				if (this.token) {
					params.userid = this.user.id;
				}
				this.$post('getDetail', params).then(res => {
					console.log('getDetail', res);
					this.setLoading(false);
					this.isCollect = res.iscollect;
					this.book = res.book[0];
				})
			},
			collect() {
				if (!this.token) {
					Dialog.confirm({
						message: '请先登录',
					}).then(() => {
						this.$router.push({
							name: 'login'
						});
					}).catch(() => {

					})
				} else {
					this.$post('collectBook', {
						id: this.$route.query.id,
						userid: this.user.id,
						iscollect: this.isCollect
					}).then(res => {
						if (res.code == 0) {
							this.isClick = !this.isCollect;
							this.book.collect = this.isCollect ? --this.book.collect : ++this.book.collect;
							this.isCollect = !this.isCollect;
						}
					});
				}
			}
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				console.log('beforeRouteEnter', 'vm.$el.scrollTop ', vm.$el.scrollTop, 'vm.scrollTop', vm.scrollTop);
				vm.$el.scrollTop = vm.scrollTop
			})
		},
		beforeRouteLeave(to, from, next) {
			console.log('beforeRouteLeave', 'this.$el.scrollTop', this.$el.scrollTop);
			this.scrollTop = this.$el.scrollTop;
			next()
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';



	.detial-book {
		height: 100%;
		width: 100%;

		.title {
			display: flex;
			padding: 20px;
			align-items: center;

			>img {
				width: 32px;
				height: 32px;
			}

			>span {
				width: 0;
				flex-grow: 1;
				text-align: center;
				font-weight: 700;
				@include ft-size(16);
			}
		}

		.detailmsg {
			display: flex;

			.pciture {
				>img {
					width: 200px;
					height: 250px;
				}
			}

			.msg {
				padding: 20px;

				>p {
					@include ft-size(16);
					margin-bottom: 20px;
				}

				>div {
					>span {
						@include ft-size(14)
					}
				}

				.like,
				.liked {
					display: inline-block;
					background: url('./like.png');
					background-position: left;
					background-size: 2900%;
					width: 80px;
					height: 80px;
				}

				.liked {
					background-position: right;
				}

				.like_click {
					animation-name: heartBlast;
					animation-duration: .8s;
					animation-timing-function: steps(28);
				}

				@keyframes heartBlast {
					0% {
						background-position: left;
					}

					100% {
						background-position: right;
					}
				}
			}
		}
	}
</style>
