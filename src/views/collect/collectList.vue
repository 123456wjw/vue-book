<template>
	<div class='listWrap'>
		<van-loading type="spinner" v-show='loading' color="#000000" />
		<div class="collectList" v-show='!loading'>
			<ul class='collectListBox' v-if='list.length'>
				<van-swipe-cell :name='book.id' v-for='book in list' :key='book.id' :before-close="beforeClose">
					<li class='oneCollect'>
						<div class='collectPhoto'>
							<img :src="book.src">
						</div>
						<div class='collectMsg'>
							<p>{{book.title}}</p>
							<span>{{book.msg}}</span>
						</div>
					</li>
					<template #right>
						<van-button square text="删除" type="danger" class="delete-button" />
					</template>
				</van-swipe-cell>
			</ul>
			<div class='nocollect' v-else>
				<img src="./nocollect.png">
				<span>暂无书籍</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			loading: {
				default: false,
				type: Boolean
			},
			list: {
				default: () => ([]),
				type: Array
			},
			beforeClose: Function
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	@import '../../assets/scss/flexCenter';
	
	.listWrap {
		flex-grow: 1;
	}

	.collectList {
		background-color: $base-bg-color;
		height: 100%;
		box-sizing: border-box;
		padding: 20px;

		.collectListBox {
			height: 100%;

			.oneCollect {
				margin: 20px 0;
				padding: 20px;
				background-color: white;
				border-radius: 10px;
				box-shadow: 6px 6px 14px 0 rgba(26, 26, 26, .06);
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
</style>
