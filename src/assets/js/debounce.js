const debounce = (fn,wait) => {
	let timeout = null;
	return function() {
		timeout && clearTimeout(timeout);
		timeout = setTimeout(fn,wait);
	}
}
export default debounce