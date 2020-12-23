<template>
	<transition name='slide-search' @after-leave="afterLeave">
		<div class="index-search" v-show='isShow'>
			<div class="index-search-top">
				<img @click='goBack' src="../../assets/img/back.png">
				<input class='searchInp' type="text" placeholder="你想要什么书？" v-model='searchValue'>
				<button @click='searchParam = searchValue'>搜索</button>
			</div>
			<div v-show='!searchParam'>
				<div class="hotSearch">
					<p>热门搜索</p>
					<ul>
						<li v-for='item in hotSearch' :key='item.id' @click='chooseHot(item.name)'>{{item.name}}</li>
					</ul>
				</div>
				<div class="historySearch" v-if='historyList.length && token'>
					<p>
						<span>历史搜索</span>
						<img @click='delHistorySearch' src="./del.png">
					</p>
					<ul>
						<li v-for='item in historyList' :key='item.id'>{{item.title}}</li>
					</ul>
				</div>
			</div>
			<bookList v-show='searchParam' :list='searchList' :loading='loading' />
		</div>
	</transition>
</template>

<script>
	import bookList from '../bookList/bookList'
	import {
		Dialog,
		Toast
	} from 'vant';
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				hotSearch: [],
				historyList: [],
				isShow: false,
				searchValue: '',
				searchParam: '',
				searchList: [],
				loading: false
			}
		},
		computed: {
			...mapState('loginState',['token'])
		},
		components: {
			bookList
		},
		watch: {
			searchParam(newValue, oldValue) {
				if(newValue !== oldValue && newValue) {
					this.startSearch(newValue)
				}
			},
			searchValue(newValue, oldValue) {
				if(!newValue && oldValue) {
					this.searchParam = ''
				}
			},
			isShow(value) {
				if(value) {
					this.getHotSearch()
					this.getHistorySearch()
				}
			}
		},
		methods: {
			afterLeave() {
				this.searchValue = ''
				this.searchList = []
				this.searchParam = ''
			},
			getHotSearch() {
				this.$get('getHotSearch').then(({
					code,
					result
				}) => {
					if (0 === code) {
						this.hotSearch = result
					}
				})
			},
			getHistorySearch() {
				if(this.token) {
					this.$get('getHistorySearch').then(({code, result}) => {
						if(0 === code) {
							this.historyList = result
						}
					})
				}
			},
			chooseHot(title) {
				this.searchValue = title;
				this.searchParam = title;
			},
			startSearch(title) {
				this.loading = true
				// 如果token存在 代表登录了
				if(this.token) {
					// 判断是否搜索过了该标题
					const index = this.historyList.findIndex(item => item.title === title)
					if(-1 === index) {
						// 没搜索过添加到最前面
						this.historyList.unshift({id: (this.historyList[0] && this.historyList[0].id + 1) || 1, title})
						// 一次最多展示10个 删除最后面一个
						if(this.historyList.length > 10) {
							this.historyList.pop()
						}
					}
				}
				this.$post('searchBook', {
					title
				}).then(({
					code,
					result
				}) => {
					this.loading = false
					if (0 === code) {
						this.searchList = result
					}
				})
			},
			show() {
				this.isShow = true;
			},
			goBack() {
				this.isShow = false;
			},
			delHistorySearch() {
				Dialog.confirm({
					message: '确认清空吗？',
				}).then(() => {
					this.$post('deleteHistorySearch').then(({code}) => {
						if(0 === code) {
							Toast.success('清空成功');
							this.historyList = []
						}
					})
				}).catch(() => {})
			}
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';

	.slide-search-enter,
	.slide-search-leave-to {
		transform: translateX(100%);
	}

	.slide-search-enter-active,
	.slide-search-leave-active {
		transition: all .3s;
	}

	.index-search {
		position: fixed;
		z-index: 999;
		top: 0;
		bottom: 0;
		height: 100%;
		width: 100%;
		background-color: $base-bg-color;

		.index-search-top {
			height: 60px;
			padding: 20px 0 10px 20px;
			display: flex;
			align-items: center;
			background-color: white;

			>img {
				width: 32px;
				height: 32px;
			}

			>input {
				height: 100%;
				padding: 10px 10px 10px 60px;
				@include ft-size(16);
				margin-left: 20px;
				background-color: $base-bg-color;
				flex: auto;
				border-radius: 4px;
				@include bg-image("../index/search");
				background-size: 48px 48px;
				background-position: 10px center;
				color: $base-font-color;
				position: relative;
			}

			>button {
				height: 100%;
				@include ft-size(16);
				width: 100px;
				background-color: white;
				color: #eaa116;
			}
		}

		.hotSearch,
		.historySearch {
			padding-left: 20px;
			background-color: white;

			>p {
				padding: 20px 0;
				@include ft-size(16);
				border-bottom: 1PX solid #ccc;
				/*no*/
			}

			>ul {
				display: flex;
				flex-wrap: wrap;
				padding-bottom: 20px;

				>li {
					@include ft-size(16);
					border: 1PX solid #ccc;
					/*no*/
					color: #000;
					padding: 10px 20px;
					margin-top: 20px;
					margin-right: 20px;
				}
			}
		}

		.historySearch {
			>p {
				display: flex;
				justify-content: space-between;
				align-items: center;

				>img {
					width: 32px;
					height: 32px;
					margin-right: 20px;
				}
			}
		}
	}
</style>
