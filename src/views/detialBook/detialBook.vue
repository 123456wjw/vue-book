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
				<span class='collect' @click='collect'>
					<div>
						<img src="./collect.png" v-if='isCollect'>
						<img src="./collect_default.png" v-else>
					</div>
					<span>{{book.collect}}</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				book: {},
				isCollect: false
			}
		},
		created() {
			this.setLoading(true);
			this.getDetail();
		},
		computed: {
			...mapState('loginState',[
				'user',
				'token'
			]),
			...mapState('loading',[
				'loading'
			])
		},
		watch: {
			token(val) {
				if(val) {
					this.getDetail();
				}
			}
		},
		methods: {
			...mapMutations('loading',[
				'setLoading'
			]),
			goBack() {
				this.$router.go(-1);
			},
			getDetail() {
				let params = {id: this.$route.query.id};
				if(this.token) {
					params.userid = this.user.id;
				}
				this.$post('getDetail',params).then(res => {
					console.log('getDetail',res);
					this.setLoading(false);
					this.book = res.book[0];
					this.isCollect = res.iscollect;
				})
			},
			collect() {
				if(!this.token) {
					Dialog.confirm({
					  message: '请先登录',
					}).then(() => {
						this.$router.push({name: 'login'});
					}).catch(() => {
						
					})
				} else {
					this.$post('collectBook',{id: this.$route.query.id,userid: this.user.id,iscollect: this.isCollect}).then(res => {
						if(res.code == 0) {
							this.book.collect = this.isCollect ? --this.book.collect : ++this.book.collect;
							this.isCollect = !this.isCollect;
						}
					});
				}
			}
		},
		beforeRouteEnter(to,from,next) {
			next(vm => {
				console.log('beforeRouteEnter','vm.$el.scrollTop ',vm.$el.scrollTop,'vm.scrollTop',vm.scrollTop);
				vm.$el.scrollTop = vm.scrollTop
			})
		},
		beforeRouteLeave(to,from,next) {
			console.log('beforeRouteLeave','this.$el.scrollTop',this.$el.scrollTop);
			this.scrollTop = this.$el.scrollTop;
			next()
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	@keyframes collect {
		0% {
			transform: scale3d(1,1,0);
		}
		30% {
			transform: scale3d(0.7,0.7,0);
		}
		90% {
			transform: scale3d(1.3,1.3,0);
		}
		100% {
			transform: scale3d(1,1,0);
		}
	}
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
				.collect {
					display: flex;
					align-items: center;
					height: 60px;
					line-height: 60px;
					@include ft-size(14);
					flex-direction: row;
					>div {
						width: 48px;
						height: 48px;
						position: relative;
						>img {
							width: 100%;
							height: 100%;
							vertical-align: baseline;
						}
					}
					
				}
			}
		}
	}
</style>
