<template>
	<div class="tab-bar">
		<ul>
			<router-link :to='{name: "index"}' tag="li">
				首页
			</router-link>
			<router-link :to='{name: "findBook"}' tag="li">
				发现
			</router-link>
			<router-link :to='{name: "personal"}' tag="li">
				我的
			</router-link>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				currentTab: 'index'
			}
		},
		methods: {

		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';

	.tab-bar {
		background-color: white;
		border-top: 1PX solid #ccc;	/*no*/
		padding: 10px 0;
		height: 100px;
		box-sizing: border-box;
		position: relative;
		bottom: 0;
		left: 0;
		right: 0;
		>ul {
			height: 100%;
			flex: auto;
			display: flex;
			justify-content: space-around;

			>li {
				@include ft-size(13);
				display: flex;
				align-items: flex-end;
				color: #000000;
				background: url(./index.png) center 10px/32px 32px no-repeat;
				&:nth-child(2) {
					background-image: url(./findBook.png);
				}
				&:nth-child(3) {
					background-image: url(./mine.png);
				}
				&.active {
					color: $base-color;
					background-image: url(./index_active.png);
					&:nth-child(2) {
						background-image: url(./findBook_active.png);
					}
					&:nth-child(3) {
						background-image: url(./mine_active.png);
					}
				}

			}
		}
	}
</style>
