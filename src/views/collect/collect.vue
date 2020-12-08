<template>
	<div class="collect">
		<div class="title">
			<img @click='goBack' src="../../assets/img/back.png">
			<span>我的收藏</span>
		</div>
		<van-loading type="spinner" v-show='loading' color="#000000" />
		<div class="collectList" v-show='!loading'>
			<ul class='collectListBox' v-if='collectList.length'>
				<van-swipe-cell :name='collect.id' v-for='collect in collectList' :key='collect.id' :before-close="beforeClose">
					<li class='oneCollect'>
						<div class='collectPhoto'>  
							<img :src="collect.src">
						</div>
						<div class='collectMsg'>
							<p>{{collect.title}}</p>
							<span>{{collect.msg}}</span>
						</div>
					</li>
					<template #right>
						<van-button square text="删除" type="danger" class="delete-button" />
					</template>
				</van-swipe-cell>
			</ul>
			<div class='nocollect' v-else>
				<img src="./nocollect.png">
				<span>暂无收藏</span>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				collectList: []
			}
		},
		computed: {
			...mapState('loginState', [
				'user'
			]),
			...mapState('loading',[
				'loading'
			])
		},
		created() {
			this.setLoading(true);
			this.getCollect();
		},
		methods: {
			...mapMutations('loading',[
				'setLoading'
			]),
			// position 为关闭时点击的位置
			// instance 为对应的 SwipeCell 实例
			beforeClose({name,position,instance}) {
				console.log('name',name);
				switch (position) {
					case 'left':
					case 'cell':
					case 'outside':
						instance.close();
						break;
					case 'right':
						Dialog.confirm({
							message: '确定删除吗？',
						}).then(() => {
							this.$post('collectBook',{id: name,userid: this.user.id,iscollect: true}).then(res => {
								if(res.code == 0) {
									this.collectList.splice(this.collectList.findIndex(item => item.id == name),1); 
									instance.close();
								}
							})
						});
						break;
				}
			},
			getCollect() {
				this.$post('users/getCollect', {
					id: this.user.id
				}).then(res => {
					console.log('users/getCollect', res);
					this.setLoading(false);
					if (res.code == 0) {
						this.collectList = res.collectList;
					}
				}).catch(err => {
					console.log('err',err);
					this.setLoading(false);
					Dialog.alert({
					  message: err.message,
					})
				})
			},
			goBack() {
				this.$router.go(-1);
			},
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	@import '../../assets/scss/flexCenter';

	.collect {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;

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

		.collectList {
			background-color: $base-bg-color;
			height: 0;
			flex-grow: 1;
			padding: 20px;
			.collectListBox {
				height: 100%;
				.oneCollect {
					margin: 20px 0;
					padding: 20px;
					background-color: white;
					border-radius: 10px;
					box-shadow: 6px 6px 14px 0 rgba(26,26,26,.06);
					display: flex;
					box-sizing: border-box;
					height: 260px;
				}
				.collectPhoto {
					width: 200px;
					height: 100%;
					>img {
						width: 100%;
						height: 100%;
					}
				}
				.collectMsg {
					flex-grow: 1;
					margin-left: 20px;
					>p {
						@include ft-size(16);
						margin-bottom: 20px;
					}
					>span {
						@include ft-size(14);
					}
				}
				.van-swipe-cell__right {
					width: 150px;
					>button {
						transform: translateX(10px);
						width: 100%;
						height: 100%;
						@include ft-size(16);
					}
				}
			}

			.nocollect {
				height: 100%;
				flex-direction: column;
				@include flexCenter();

				>img {
					margin-bottom: 50px;
				}

				>span {
					color: black;
					@include ft-size(16);
				}
			}
		}
	}
</style>
