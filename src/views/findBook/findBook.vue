<template>
	<div class="find-book">
		<h3>发现</h3>
		<ul class="book-tabs" ref="bookTabs">
			<li :ref="`tab${index}`" v-for="(tab, index) in typeList" :key="tab.id" @click="active = index" :class="{ active: active == index }">
				{{ tab.name }}
			</li>
			<div :style="{
          transform: `translateX(${offsetLeft}px)`,
          width: `${activeTabWidth}px`,
        }"
			 class="tab-line" />
		</ul>
		<div class="book-pubus">
			<div class="book-pubus-box" :style="{
          width: `calc(100% * ${typeList.length})`,
          transform: `translateX(${moveX}px)`,
          transition: istransition,
        }"
			 @touchstart="handlets" @touchmove="handletm" @touchend="handlete">
				<van-pull-refresh :ref="`vanPullRefresh${index}`" :style="{
            width: `calc(100% / ${typeList.length})`,
            overflowY: isHidden,
          }"
				 class="book-pubu" v-model="pubu.pullLoading" @refresh="onRefresh(index)" :head-height="128" v-for="(pubu, index) in pubuList"
				 :key="index">
					<template #pulling="props">
						<img src="../../assets/img/loading.png" :style="{ transform: `scale(${props.distance / 128})` }" />
					</template>

					<template #loosing>
						<img src="../../assets/img/loading_active.png" style="animation: infiRotate 1s linear infinite;" />
					</template>

					<template #loading>
						<img src="../../assets/img/loading_active.png" style="animation: infiRotate 1s linear infinite;" />
					</template>
					<van-list v-model="pubu.listLoading" :finished="pubu.finished" finished-text="我也是有底线的" @load="onLoad(index)" :immediate-check='false'>
						<template #loading>
							<img src="../../assets/img/loading_active.png" style="animation: infiRotate 1s linear infinite;" />
						</template>
						<div class="book-pubu-list">
							<ul>
								<li v-for="leftOne in pubu.leftPubu" :key="leftOne.id">
									<img v-lazy="leftOne.src" v-show="leftOne.h" />
									<div>
										<h3>{{ leftOne.title }}</h3>
										<span>{{ leftOne.msg }}</span>
									</div>
								</li>
							</ul>
							<ul>
								<li v-for="rightOne in pubu.rightPubu" :key="rightOne.id">
									<img v-lazy="rightOne.src" v-show="rightOne.h" />
									<div>
										<h3>{{ rightOne.title }}</h3>
										<span>{{ rightOne.msg }}</span>
									</div>
								</li>
							</ul>
						</div>
					</van-list>
				</van-pull-refresh>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'

	export default {
		name: "findBook",
		data() {
			return {
				active: 0, //当前tab索引
				offsetLeft: 0, //当前距离左边距离
				innerWidth: 0, //屏幕宽度
				activeTabWidth: 0, //当前tab宽度
				myAnimateTimer: null, //tab滑动定时器
				moveMin: 0, //最小滑动切换距离
				speedMin: 600, //最慢滑动切换速度
				startTime: 0, //触摸开始时间
				startX: 0, //触摸开始X
				startY: 0, //触摸开始Y
				isHidden: "scroll", //是否可以竖向滑动
				isScrollY: false, //是否是Y滑动
				isScrollX: false, //是否X滑动
				moveX: 0, //X方向上滑动的距离
				istransition: "none", //是否开启过渡
				pageSize: 10, //一次获取几条数据
				pubuList: [], //瀑布流数组
			};
		},
		created() {
			this.initPubuList();
			this.innerWidth = window.innerWidth;
			this.moveMin = (this.innerWidth * 2) / 3;
			setTimeout(() => {
				this.istransition = "all .3s";
			}, 1000);
		},
		mounted() {
			if (!this.typeList.length) {
				this.getTypeList().then(res => {
					this.activeTabWidth = this.$refs.tab0[0].offsetWidth;
					this.getPubu(this.active)
				})
			} else {
				this.activeTabWidth = this.$refs.tab0[0].offsetWidth;
				this.getPubu(this.active)
			}
		},
		computed: {
			...mapState('typeList', ['typeList']),
		},
		watch: {
			active: {
				handler(newval, oldval) {
					if (newval != oldval) {
						this.moveX = -this.innerWidth * newval;
						this.chooseTab();
						if (!this.pubuList[newval].leftPubu.length) {
							this.getPubu(newval);
						}
					}
				},
			},
		},
		methods: {
			...mapActions('typeList', ['getTypeList']),
			initPubuList() {
				for (let i = 0; i < 8; i++) {
					this.pubuList.push({
						leftPubu: [],
						rightPubu: [],
						currentPage: 1,
						leftHeight: 0,
						rightHeight: 0,
						newPubuList: [],
						pullLoading: false,
						listLoading: false,
						finished: false,
						scrollTop: 0,
					});
				}
			},
			handlets(e) {
				this.startTime = new Date().getTime();
				let {
					pageX,
					pageY
				} = e.changedTouches[0];
				this.startX = pageX;
				this.startY = pageY;
				//滑动开始时关闭过渡
				this.istransition = "none";
			},
			handletm(e) {
				//主要针对X方向上滑动处理的方法
				//如果在Y方向上滑动那直接return
				if (this.isScrollY) {
					return;
				}
				let {
					pageX,
					pageY
				} = e.changedTouches[0];
				let diffX, diffY;
				diffX = pageX - this.startX;
				diffY = pageY - this.startY;
				//走到这没在Y方向滑动
				if (!this.isScrollX) {
					//如果也没在X上滑动那么代表第一次进到这个方法
					this.isScrollY = Math.abs(diffY) - Math.abs(diffX) >= 0 ? true : false;
					this.isScrollX = !this.isScrollY;
					if (this.isScrollX) {
						//如果X方向上滑动多,就要关闭Y方向上滑动
						this.isHidden = "hidden";
					}
				} else {
					//如果在X上滑动
					this.moveX = -this.innerWidth * this.active + diffX;
				}
			},
			handlete(e) {
				this.istransition = "all .3s";
				this.isHidden = "scroll";
				this.isScrollX = false;
				if (this.isScrollY) {
					this.isScrollY = false;
					return;
				} else {
					let diffTime = new Date().getTime() - this.startTime;
					let moveX = e.changedTouches[0].pageX - this.startX;
					let maxTab = this.typeList.length - 1;
					if (
						Math.abs(moveX) >= this.moveMin ||
						(Math.abs(moveX) / diffTime) * 1000 >= this.speedMin
					) {
						if (moveX > 0) {
							this.active = this.active !== 0 ? this.active - 1 : 0;
						} else {
							this.active = this.active !== maxTab ? this.active + 1 : maxTab;
						}
					}
					this.moveX = -this.innerWidth * this.active;
				}
			},
			//获取当前tabwidth
			getTabWidth(active) {
				this.activeTabWidth = this.$refs[`tab${active}`][0].offsetWidth;
			},
			//缓动动画
			myAnimate(current, target) {
				let step = (target - current) / 10;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				current = step + current;
				this.$refs.bookTabs.scrollTo(current, 0);
				if (Math.abs(target - current) <= Math.abs(step)) {
					current = target;
					this.$refs.bookTabs.scrollTo(current, 0);
					clearInterval(this.myAnimateTimer);
					this.myAnimateTimer = null;
				}
				return current;
			},
			// 选择tab
			chooseTab() {
				let current = this.$refs.bookTabs.scrollLeft;
				this.getTabWidth(this.active);
				this.offsetLeft = this.$refs[`tab${this.active}`][0].offsetLeft;
				this.myAnimateTimer = setInterval(() => {
					current = this.myAnimate(
						current,
						this.offsetLeft - this.innerWidth / 2 + this.activeTabWidth / 2
					);
				}, 10);
			},
			// 获取瀑布流数据
			getPubu(active, refresh = "norefresh") {
				this.$post("findBook", {
					type: this.typeList[active].type,
					pageSize: this.pageSize,
					currentPage: this.pubuList[active].currentPage,
				}).then((res) => {
					if (res.code == 0) {
						this.pubuList[active].newPubuList = res.result;
						this.loadImg(res.result, active, refresh);
						this.pubuList[active].finished = res.finished;
					}

				});
			},
			//加载图片
			loadImg(imgList, active, refresh) {
				let length = 0;
				let currentPubu = this.pubuList[active];
				imgList.forEach((item, index) => {
					let img = new Image();
					img.src = item.src;
					img.onload = () => {
						imgList[index].h = img.height / img.width * (this.innerWidth / 2 - (20 / 75 * this.innerWidth / 10))
						length++;
						if (length == imgList.length) {
							if (refresh == "refresh") {
								//如果时下拉刷新
								currentPubu.leftHeight = currentPubu.rightHeight = 0;
							}
							this.handleNewPubuList(
								imgList,
								currentPubu.leftHeight,
								currentPubu.rightHeight,
								(resultList, leftH, rightH) => {
									currentPubu.currentPage++;
									currentPubu.leftHeight = leftH;
									currentPubu.rightHeight = rightH;
									if (refresh == "refresh") {
										//如果时下拉刷新
										currentPubu.leftPubu = resultList.pubuL;
										currentPubu.rightPubu = resultList.pubuR;
										currentPubu.pullLoading = false;
									} else {
										currentPubu.leftPubu.push(...resultList.pubuL);
										currentPubu.rightPubu.push(...resultList.pubuR);
										currentPubu.listLoading = false;
									}
									currentPubu.newPubuList = [];
								}
							);
						}
					};
				});
			},
			//处理加载好的图片
			handleNewPubuList(imgList, leftH, rightH, callBack) {
				let resultList = {
					pubuL: [],
					pubuR: [],
				};
				imgList.forEach((item) => {
					if (parseInt(leftH) <= parseInt(rightH)) {
						resultList.pubuL.push(item);
						if (leftH === 0) {
							leftH += 20 / 75 * this.innerWidth / 10
						}
						leftH += item.h + ((100 + 20) / 75 * this.innerWidth / 10);
					} else {
						resultList.pubuR.push(item);
						if (rightH === 0) {
							rightH += 20 / 75 * this.innerWidth / 10
						}
						rightH += item.h + ((100 + 20) / 75 * this.innerWidth / 10);
					}
				});
				callBack(resultList, leftH, rightH);
			},
			//下拉刷新
			onRefresh(index) {
				if (this.active != index) {
					return;
				}
				this.pubuList[index].currentPage = 1;
				this.getPubu(index, "refresh");
			},
			//上拉加载
			onLoad(index) {
				if (this.active != index) {
					return;
				}
				this.getPubu(index);
			},
		},
		beforeRouteEnter(to, from, next) {
			next((vm) => {
				vm.pubuList.forEach((item, index) => {
					setTimeout(() => {
						vm.$refs[`vanPullRefresh${index}`][0].$el.scrollTo = (0, item.scrollTop);
					}, 0)
				});
			});
		},
		beforeRouteLeave(to, from, next) {
			this.pubuList.forEach((item, index) => {
				item.scrollTop = this.$refs[`vanPullRefresh${index}`][0].$el.scrollTop;
			});
			next();
		},
	};
</script>

<style lang="scss">
	@import "../../assets/scss/baseColor";
	@import "../../assets/scss/mixin";
	@import "../../assets/scss/infiRotate";

	.find-book {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;

		>h3 {
			text-align: center;
			padding: 20px;
			background-color: $base-color;
			@include ft-size(16);
		}

		.book-tabs {
			position: relative;
			overflow-x: auto;
			display: flex;

			>li {
				height: 80px;
				padding: 0 40px;
				line-height: 80px;
				text-align: center;
				color: $base-font-color;
				@include ft-size(13);
				flex-shrink: 0;
				flex: 1 0 auto;

				&.active {
					font-weight: 700;
				}
			}

			.tab-line {
				position: absolute;
				left: 0;
				bottom: 0;
				height: 4px;
				background-color: $base-color;
				border-radius: 3px;
				transition: all 0.3s;
			}
		}

		/* tab栏van样式 */
		>.van-tabs {
			.van-tabs__wrap {
				height: 70px;
			}

			.van-tab {
				>span {
					color: $base-font-color;
					@include ft-size(13);
				}
			}

			.van-tab--active {
				>span {
					font-weight: 700;
				}
			}

			.van-tabs__line {
				height: 4px;
			}
		}

		/* 瀑布流盒子样式 */
		.book-pubus {
			height: 0;
			overflow-x: hidden;
			flex: 1 0 auto;

			.book-pubus-box {
				display: flex;
				height: 100%;

				.book-pubu {
					height: 100%;
					background-color: $base-bg-color;

					.book-pubu-list {
						display: flex;
						height: 100%;

						>ul {
							width: 50%;
							box-sizing: border-box;

							>li {
								border-radius: 20px;
								margin: 20px 10px;
								background-color: white;
								overflow: hidden;
								box-shadow: 6px 6px 14px 0 rgba(26, 26, 26, 0.06);

								>img {
									width: 100%;
									height: auto;
								}

								>div {

									height: 100px;

									>h3 {
										padding: 10px 10px 5px;
										box-sizing: border-box;
									}

									>span {
										padding: 5px 10px 10px;
										@include ft-size(14);
										display: inline-block;
										width: 100%;
										white-space: nowrap;
										text-overflow: ellipsis;
										overflow: hidden;
										box-sizing: border-box;
										color: $base-font-color;
									}
								}


							}
						}
					}
				}
			}
		}
	}
</style>
