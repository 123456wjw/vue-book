<template>
	<div class="father">
		father
		<button style='width: 100px;height: 100px;' @click='test'>触发跳转,bus触发事件</button>
	</div>
</template>

<script>
	import bus from '../bus/bus'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			test() {
				this.$router.push('/child')
			}
		},
		beforeDestroy() {
			console.log('fatherbeforeDestory')
			bus.$emit('test',123)
		},
		Destory() {
			bus.$emit('test',123)
		}
	}
</script>

<style>
</style>
