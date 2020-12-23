<template>
	<div class="collect">
		<div class="title">
			<img @click='goBack' src="../../assets/img/back.png">
			<span>我的收藏</span>
		</div>
		<collectList :loading='loading' :list='collectList' :isCollect='true' :beforeClose='beforeClose' />
	</div>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import { clearLoginState } from 'assets/js/utils'
	import { Dialog } from 'vant';
	import collectList from './collectList'
	export default {
		data() {
			return {
				collectList: []
			}
		},
		components: {
			collectList
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
					this.setLoading(false);
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

	}
</style>
