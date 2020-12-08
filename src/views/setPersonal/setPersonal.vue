<template>
	<div class="setPersonal">
		<div class="title">
			<img @click='goBack' src="../../assets/img/back.png">
			<span>个人资料</span>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	.setPersonal {
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
	}
</style>
