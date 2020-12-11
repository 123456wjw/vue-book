const throttle = (fn,delay=2000) => {
	let prev = new Date().getTime();
	return function() {
		let now = new Date().getTime();
		if(now - prev > delay) {
			fn.call(this);
			prev = new Date().getTime();
		}
	}
}
export default throttle