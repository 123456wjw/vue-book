<template>
	<transition name='slide-search'>
		<div class="index-search" v-show='isShow'>
			<div class="index-search-top">
				<img @click='goBack' src="../../assets/img/back.png">
				<input type="text" placeholder="你想要什么书？">
				<button @click='search'>搜索</button>
			</div>
			<div class="hotSearch">
				<p>热门搜索</p>
				<ul>
					<li v-for='item in searchList' :key='item.id'>{{item.name}}</li>
				</ul>
			</div>
			<div class="historySearch" v-if='historyList.length'>
				<p>
					<span>历史搜索</span>
					<img @click='delHistorySearch' src="./del.png">
				</p>
				<ul>
					<li v-for='item in historyList' :key='item.id'>{{item.name}}</li>
				</ul>
			</div>
		</div>
	</transition>
</template>

<script>
	import { Dialog } from 'vant';
	export default {
		data() {
			return {
				searchList: [],
				historyList: [],
				isShow: false,
			}
		},
		created() {
			let searchList = require('./searchList.json');
			this.searchList.push(...searchList);
			this.historyList.push(...searchList);
		},
		methods: {
			search() {
				
			},
			show() {
				this.isShow = true;
			},
			goBack() {
				this.isShow = false;
			},
			delHistorySearch() {
				Dialog.confirm({
				  message: '确认删除吗？',
				}).then(() => {
					console.log('删除')
					this.historyList = []
				}).catch(() => {
					console.log('删除')
				})
				
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
				border-bottom: 1PX solid #ccc;/*no*/
			}

			>ul {
				display: flex;
				flex-wrap: wrap;
				padding-bottom: 20px;

				>li {
					@include ft-size(16);
					border: 1PX solid #ccc;/*no*/
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
