<template>
	<div class='bookListWrap'>
		<van-loading type="spinner" v-show='loading' color="#000000" />
		<div class="bookList" v-show='!loading'>
			<ul class='bookListBox' v-if='list.length'>
				<li class='oneBook' v-for='book in list' :key='book.id' @click='getDetial(book.id)'>
					<div class='bookPhoto'>
						<img :src="book.src">
					</div>
					<div class='bookMsg'>
						<p>{{book.title}}</p>
						<span>{{book.msg}}</span>
					</div>
				</li>
			</ul>
			<div class='noBook' v-else>
				<img src="./noBook.png">
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
		},
		methods: {
			// 查看书本详情
			getDetial(id) {
				this.$router.push({
					name: 'detailBook',
					query: {
						id: id
					}
				});
			},
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	@import '../../assets/scss/flexCenter';
	.bookListWrap {
		height: calc(100% - 90px);
		.bookList {
			background-color: $base-bg-color;
			height: 100%;
			box-sizing: border-box;
			padding: 20px;
		
			.bookListBox {
				height: 100%;
				overflow-y: auto;
		
				.oneBook {
					margin: 20px 0;
					padding: 20px;
					background-color: white;
					border-radius: 10px;
					box-shadow: 6px 6px 14px 0 rgba(26, 26, 26, .06);
					display: flex;
					box-sizing: border-box;
					height: 260px;
				}
		
				.bookPhoto {
					width: 200px;
					height: 100%;
		
					>img {
						width: 100%;
						height: 100%;
					}
				}
		
				.bookMsg {
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
		
			.noBook {
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
