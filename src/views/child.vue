<template>
	<div class="child">
		child
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
				bus.$on('test',data => {
					alert(data)
				})
			}
		},
		created:function() {
			console.log('childCreated')
			this.test()
		}
	}
</script>

<style>
</style>
