const throttle = (fn,delay=2000) => {
	let prev = new Date().getTime();
	console.log('绑定节流函数')
	return function() {
		console.log(this);
		let now = new Date().getTime();
		console.log(now - prev);
		if(now - prev > delay) {
			fn.call(this);
			prev = new Date().getTime();
		}
	}
}
export default throttle