<template>
	<div class="index" @scroll="handleScroll">
		<index-search ref='indexSearch'></index-search>
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" :head-height='128'>
			<template #pulling="props">
				<img src="../../assets/img/loading.png" :style="{ transform: `scale(${props.distance / 128})` }" />
			</template>

			<!-- 释放提示 -->
			<template #loosing>
				<img src="../../assets/img/loading_active.png" style='animation: infiRotate 1s linear infinite;' />
			</template>

			<!-- 加载提示 -->
			<template #loading>
				<img src="../../assets/img/loading_active.png" style='animation: infiRotate 1s linear infinite;' />
			</template>
			<!-- 顶部背景 -->
			<div class="top-bg">
				<div class="bg-book"></div>
				<div :class='{fixed: topSearch.isFixed}' :style='[searchTop]' @click='showSearch' ref='topSearch' class='top-search'>你想要什么书？</div>
			</div>
			<!-- 首页主体 -->
			<div class="index-main">
				<!-- 首页分类 -->
				<ul class="classify" ref='classify'>
					<li class="classify-item" v-for='(classify,index) in classifyList' :key='classify.id'>
						<div class='classify-item-bg' :class='"classify-item-bg"+index'></div>
						<span class='classify-item-span'>{{classify.name}}</span>
					</li>
				</ul>
				<div class="hotRecommend" ref='hotRecommend'>
					<div class='title'>
						<h3>
							热门推荐
						</h3>
						<span>更多 ></span>
					</div>
					<ul>
						<li>
							<img src="./yilin.jpg" alt="">
							<span>意林</span><br>
							<span>这是对意林的一段描述</span>
						</li>
						<li>
							<img src="./duzhe.jpg" alt="">
							<span>读者</span><br>
							<span>这是对读者的一段描述</span>
						</li>
						<li>
							<img src="./qnwz.jpg" alt="">
							<span>青年文摘</span><br>
							<span>这是对青年文摘的一段描述</span>
						</li>
						<li>
							<img src="./yilin.jpg" alt="">
							<span>意林</span><br>
							<span>这是对意林的一段描述</span>
						</li>
						<li>
							<img src="./duzhe.jpg" alt="">
							<span>读者</span><br>
							<span>这是对读者的一段描述</span>
						</li>
						<li>
							<img src="./qnwz.jpg" alt="">
							<span>青年文摘</span><br>
							<span>这是对青年文摘的一段描述</span>
						</li>
						<li>查看更多</li>
					</ul>
				</div>
				<!-- 轮播图 -->
				<van-swipe class="my-swipe" :autoplay="3000">
					<van-swipe-item v-for='(banner,index) in 5' :key='index'>
						<img :src='require(`./banner${index}.jpg`)'>
					</van-swipe-item>
				</van-swipe>
				<!-- 精品好书 -->
				<div class="excellent-book" ref='excellentBook'>
					<div class='title'>
						<h3>
							精品好书
						</h3>
					</div>
					<div :class='{fixed: sortBox.isFixed}' :style='[{top: sortBox.isFixed?topSearch.offsetHeight+"px":""},sortTop]'
					 class="sort" ref='sortBox' @click='clickSort'>
						<div class="sort-method">
							<span class='zonghe' :style='{fontWeight: `${(currentSort.sortCode != "5" && currentSort.sortCode != "6")?"700":"400"}`}'>{{currentSort.sortValue}}<img
								 :style='{transform: `${isShowZongHe?"rotate(90deg)":""}`}' class='zonghe' src='./arrow@2x.png'></span>
							<span class='pingfen' data-sortValue='5' :style='currentSort.sortCode == "5" ? "font-weight: 700;" : "400"'>评分高</span>
							<span class='yuedu' data-sortValue='6' :style='currentSort.sortCode == "6" ? "font-weight: 700;" : "400"'>阅读数高</span>
						</div>
						<div class="sort-choose">
							<span :style='choosedList.length ? "font-weight: 700;" : "400"' class='shaixuan'>筛选<img class='shaixuan' src="./choose.png"></span>
						</div>
						<transition name='fadeIn'>
							<div class='sort-methodList' :style='{top: `${this.sortListTop}px`}' v-show="isShowZongHe">
								<transition name='slideDown'>
									<ul v-show="isShowZongHe">
										<li class='sortOne' data-sortValue='1' :class='{active: currentSort.sortCode == "1"}'>综合排序</li>
										<li class='sortOne' data-sortValue='2' :class='{active: currentSort.sortCode == "2"}'>收藏最多</li>
										<li class='sortOne' data-sortValue='3' :class='{active: currentSort.sortCode == "3"}'>发布时间早到晚</li>
										<li class='sortOne' data-sortValue='4' :class='{active: currentSort.sortCode == "4"}'>发布时间晚到早</li>
									</ul>
								</transition>
							</div>
						</transition>
						<transition name='fadeIn'>
							<div class='sort-chooseList' :style='{top: `${this.sortListTop}px`}' v-show="isShowShaiXuan">
								<transition name='slideDown'>
									<ul v-show="isShowShaiXuan">
										<div>类别(可多选)</div>
										<li data-notHide='true' :class='{active: choosedList.includes(index)}' @click='addOneShaixuan(index)' v-for='(item,index) in chooseList'
										 :key='index'>{{item}}</li>
										<button data-notHide='true' @click='emptyChoosedList'>清空</button>
										<button @click='choosedDone'>完成</button>
									</ul>
								</transition>
							</div>
						</transition>
					</div>
					<van-list :style='{marginTop: `${sortBox.isFixed ? sortBox.offsetHeight : 0}px`}' v-model="loading" :finished="finished"
					 finished-text="我也是有底线的" @load="onLoad">
						<template #loading>
							<img src="../../assets/img/loading_active.png" style='animation: infiRotate 1s linear infinite;' />
						</template>
						<ul class='bookList'>
							<li v-for='book in bookList' :key='book.id' @click='getDetial(book.id)'>
								<img v-lazy="book.src">
								<div>
									<h4 class='book-title'>{{book.title}}</h4>
									<span class='book-msg'>收藏数 {{book.collect}}</span><br>
									<span class='book-msg'>评分 {{book.rate}}</span><br>
									<span class='book-msg'>阅读数 {{book.readcount}}</span>
								</div>
							</li>
						</ul>
					</van-list>
				</div>
			</div>
		</van-pull-refresh>
	</div>
</template>

<script>
	import indexSearch from '../indexSearch/indexSearch'
	export default {
		name: 'index',
		data() {
			return {
				//顶部搜索框
				topSearch: {
					offsetHeight: 0,
					offsetTop: 0,
					isFixed: false
				},
				searchTop: '', // 顶部搜索框位置
				sortTop: '', //排序位置
				// 排序盒子
				sortBox: {
					offsetTop: 0,
					offsetHeight: 0,
					isFixed: false
				},
				// 分类数组
				classifyList: [],
				// 书本数组
				bookList: [],
				//下拉刷新
				isLoading: false,
				//上拉加载
				loading: false,
				finished: false,
				currentSort: { //当前排序方式
					sortCode: '1',
					sortValue: '综合排序'
				},
				isShowZongHe: false, //是否显示排序列表
				isShowShaiXuan: false, //是否显示筛选列表
				sortListTop: 0, //显示排序列表时的位置
				chooseList: ['校园', '恐怖', '惊悚', '科幻', '修仙', '言情', '偶像', '青春'], //筛选的选项
				choosedList: [], //筛选中选中的
				pageSize: 10, //每一页数据
				currentPage: 0, //当前页数
				scrollTop: 0, //滚动距离
			}
		},
		components: {
			indexSearch
		},
		created() {
			for (let i = 0; i < 8; i++) {
				this.classifyList.push({
					id: i,
					name: `分类${i}`
				})
			}
			this.getBookList();
		},
		mounted() {
			let {
				offsetHeight,
				offsetTop
			} = this.$refs.topSearch;
			this.topSearch = {
				offsetHeight,
				offsetTop,
				isFixed: false
			}
			this.sortBox = {
				offsetTop: this.$refs.sortBox.offsetTop,
				offsetHeight: this.$refs.sortBox.offsetHeight,
				isFixed: false
			}
		},
		computed: {
			currentSortCode() {
				return this.currentSort.sortCode
			}
		},
		watch: {
			currentSortCode(newCode, oldCode) {
				this.currentPage = 0;
				this.getBookList('refresh')
				let scrollTo = this.sortBox.offsetTop - this.topSearch.offsetHeight;
				if (this.$el.scrollTop > scrollTo) {
					this.$el.scrollTo(0, scrollTo)
				}
			}
		},
		methods: {
			handleScroll() {
				this.topSearch.isFixed = this.$el.scrollTop > this.topSearch.offsetTop ? true : false;
				this.sortBox.isFixed = this.$el.scrollTop > this.sortBox.offsetTop - this.topSearch.offsetHeight ? true : false;
			},
			getDetial(id) {
				this.$router.push({
					name: 'detailBook',
					query: {
						id: id
					}
				});
			},
			// fixed会当祖先元素transform不为none时失效   所以将定位瞬间切为absolute  达到迷惑的效果
			judgeScroll() {
				if (this.scrollTop > this.topSearch.offsetTop) {
					this.searchTop = {
						position: 'absolute',
						top: this.scrollTop + 'px'
					}
				}
				if (this.scrollTop > this.sortBox.offsetTop) {
					this.sortTop = {
						position: 'absolute',
						top: this.scrollTop + this.topSearch.offsetHeight + 'px'
					}
				}
			},
			// 点击排序导航栏
			clickSort(e) {
				let scrollTo = this.sortBox.offsetTop - this.topSearch.offsetHeight;
				if (scrollTo > this.$el.scrollTop) {
					this.$el.scrollTo(0, scrollTo)
				}
				if (!this.sortListTop) {
					this.sortListTop = this.sortBox.offsetHeight + this.topSearch.offsetHeight;
				}
				if (e.target.dataset.sortvalue) { //如果有这个值说明可以直接进行排序
					let sv = e.target.dataset.sortvalue; //获取sortValue
					this.currentSort.sortCode = sv;
					if (sv != '5' && sv != '6') {
						this.currentSort.sortValue = e.target.innerText;
					}
				}
				if (this.isShowZongHe) { //如果排序显示 对于排序来说只要他显示了那么不管点在哪里 肯定要隐藏
					this.isShowZongHe = false;
				} else { //如果没显示
					if (e.target.className == 'zonghe') { //如果点在了综合排序上
						this.isShowZongHe = true;
					}
				}
				if (this.isShowShaiXuan) { //如果筛选显示，点在每一个筛选项和清空不隐藏 其他都隐藏
					if (e.target.dataset.nothide !== "true") { //代表没点在每一个选项和清空上
						this.isShowShaiXuan = false;
					}
				} else { //如果没显示
					if (e.target.className == 'shaixuan') { //如果点在了筛选上
						this.isShowShaiXuan = true;
					}
				}
			},
			//增加一个筛选项
			addOneShaixuan(itemIndex) {
				let flag = this.choosedList.findIndex(value => {
					return value == itemIndex
				})
				if (flag !== -1) {
					this.choosedList.splice(flag, 1);
				} else {
					this.choosedList.push(itemIndex)
				}
			},
			//清空筛选项
			emptyChoosedList() {
				this.choosedList = []
			},
			//筛选完成
			choosedDone() {
				this.isShowShaiXuan = false;
				this.currentPage = 0;
				this.getBookList('refresh')
			},
			// 获取图书
			getBookList(refresh = 'norefresh') {
				let params = {
					code: this.currentSort.sortCode,
					choosedList: this.choosedList,
					pageSize: this.pageSize,
					currentPage: this.currentPage
				}
				this.$post('sorkBook', params).then(res => {
					if (res.code == 0) {
						if (refresh === 'refresh') { //如果是下拉刷新
							this.bookList = [];
							this.isLoading = false;
						} else {
							this.loading = false;
						}
						this.currentPage++
						this.bookList.push(...res.result);
						this.finished = res.finished;
					}
				})
			},
			showSearch() {
				this.$refs.indexSearch.show();
			},
			//下拉刷新
			onRefresh() {
				this.currentPage = 0;
				setTimeout(() => {
					this.bookList = [];
					this.getBookList('refresh');
				}, 1000)
			},
			//上拉加载
			onLoad() {
				setTimeout(() => {
					this.getBookList()
				}, 1000);
			},
		},
		beforeRouteEnter(to, from, next) {
			next(vm => {
				// 用定时器是为了等组件加载完再执行	
				setTimeout(() => {	
					vm.$el.scrollTop = vm.scrollTop;
				}, 0)
			})
		},
		beforeRouteLeave(to, from, next) {
			this.scrollTop = this.$el.scrollTop;
			this.judgeScroll();
			next()
		}
	}
</script>

<style lang='scss'>
	@import '../../assets/scss/baseColor';
	@import '../../assets/scss/mixin';
	@import '../../assets/scss/flexCenter';
	@import '../../assets/scss/infiRotate';

	.index {
		height: 100%;
		width: 100%;
		overflow-y: auto;

		/* 所有加粗标题 */
		.title {
			@include ft-size(16);
			margin-bottom: 20px;
			display: flex;
			justify-content: space-between;
		}

		.van-pull-refresh__head {
			background-color: white;
		}

		/* 顶部搜索 */
		.van-sticky--fixed {
			left: auto;
			right: auto;
		}

		.van-sticky {
			width: 100%;
		}

		.van-sticky.van-sticky--fixed {
			width: calc(100% - 40px);
		}

	}

	/* 顶部背景 */
	.top-bg {
		height: 300px;
		box-sizing: border-box;
		background-color: $base-color;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.bg-book {
		position: relative;
		top: 30px;
		@include bg-image("../../assets/img/book");
		background-size: 100%;
		width: 248px;
		height: 128px;
	}

	.top-search {
		background-color: $base-bg-color;
		height: 100px;
		width: calc(100% - 40px);
		position: absolute;
		bottom: -50px;
		line-height: 100px;
		border-radius: 8px;
		padding-left: 60px;
		box-sizing: border-box;
		@include bg-image("./search");
		background-size: 48px 48px;
		background-position: 10px center;
		@include ft-size(16);
		color: $base-font-color;

		&.fixed {
			position: fixed;
			top: 0;
			z-index: 1;
		}
	}

	/* 首页主体 */
	.index-main {
		padding-top: 50px;
		padding: 50px 20px 0;
	}

	/* 首页分类 */
	.classify {
		display: flex;
		flex-wrap: wrap;
		padding: 20px 0;

		.classify-item {
			width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-bottom: 30px;
		}

		.classify-item-bg {
			width: 128px;
			height: 128px;
			background-size: 100%;
			border-radius: 50%;
			margin-bottom: 10px;
		}

		@for $i from 0 through 7 {
			.classify-item-bg#{$i} {
				@include bg-image("./classify_"+$i);
			}
		}

		.classify-item-span {
			color: $base-font-color;
			@include ft-size(16);
		}
	}

	/* 热门推荐 */
	.hotRecommend {
		margin-bottom: 20px;
		height: 361px;

		>ul {
			display: flex;
			overflow-x: scroll;

			>li {
				margin-right: 10px;
				text-align: center;
				width: 300px;
				flex-shrink: 0;

				/*默认为1代表父元素空间不够，会自动缩小*/
				>span {
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					width: 100%;
					display: inline-block;

					&:nth-child(2) {
						@include ft-size(16);
						font-weight: 700;
						color: #000;
					}

					&:nth-child(4) {
						color: $base-font-color;
						@include ft-size(14);
					}
				}

				>img {
					width: 300px;
					height: 200px;
					border-radius: 10px;
				}

				&:nth-last-child(1) {
					padding-top: 70px;
					width: 32px;
					background: url(./showMore.png) center 30px/32px 32px no-repeat;
				}
			}
		}
	}

	/* 轮播图 */
	.van-swipe {
		height: 300px;
	}

	.van-swipe-item {
		>img {
			height: 100%;
			width: 100%;
			border-radius: 20px;
		}
	}

	.van-swipe__indicator {
		opacity: 1;
		width: 10px;
		height: 10px;
		background-color: white;

		&.van-swipe__indicator--active {
			background-color: $base-color;
		}
	}

	/* 精品好书 */
	.excellent-book {
		margin: 20px 0;

		>.title {
			margin-bottom: 0;
		}

		/* 排序 */
		.sort {
			display: flex;
			justify-content: space-around;
			background-color: #fff;
			height: 82px;
			padding: 20px 0;
			box-sizing: border-box;

			&.fixed {
				position: fixed;
				width: calc(100% - 40px);
			}

			.sort-method {
				flex: auto;

				>span {
					margin-right: 40px;
					padding: 20px 0;

					>img {
						width: 16px;
						height: 16px;
						transform: rotate(-90deg);
						transition: all .3s;
						margin-left: 8px;
					}
				}
			}

			.sort-choose {
				>span {
					padding: 20px 0;

					>img {
						width: 32px;
						height: 32px;
					}
				}
			}

			.sort-choose,
			.sort-method {
				>span {
					@include ft-size(16);
					color: $base-font-color;
				}
			}

			.sort-methodList,
			.sort-chooseList {
				overflow: hidden;
				bottom: 0;
				left: 0;
				right: 0;
				position: fixed;
				background-color: rgba(0, 0, 0, .3);
			}

			.sort-methodList {
				>ul {
					>li {
						border-bottom: 1PX solid #ccc;
						/*no*/
						padding: 20px;
						background-color: white;
						color: $base-font-color;
						@include ft-size(14);

						&.active {
							color: $base-color;
						}
					}
				}

			}

			.sort-chooseList {
				>ul {
					display: flex;
					flex-wrap: wrap;
					background-color: white;

					>div {
						width: 100%;
						padding: 20px;
						box-sizing: border-box;
						@include ft-size(16);
					}

					>li {
						width: 30%;
						box-sizing: border-box;
						background-color: $base-bg-color;
						color: $base-font-color;
						text-align: center;
						@include ft-size(15);
						padding: 20px 0;
						margin: 10px;

						&.active {
							background-color: $base-color;
							color: white;
						}
					}

					>button {
						width: 50%;
						@include ft-size(16);
						text-align: center;
						padding: 30px 0;

						&:nth-of-type(1) {
							background-color: white;
							box-sizing: border-box;
							border-top: 1PX solid #ccc;
							/*no*/
						}

						&:nth-of-type(2) {
							color: white;
							background-color: $base-color;
						}
					}
				}
			}
		}

		.van-list__loading {
			background-color: white;
		}

		.bookList {
			>li {
				display: flex;
				padding: 40px 0;
				height: 200px;
				align-items: center;

				&:nth-child(1) {
					padding-top: 0;
				}

				>img {
					width: 150px;
					height: 150px;
					flex-shrink: 0;
					margin-right: 20px;
				}

				>image[lazy=loading] {
					width: 150px;
					height: 150px;
				}

				.book-title {
					@include ft-size(16);
				}

				.book-msg {
					@include ft-size(14);
					color: $base-font-color;
				}
			}
		}
	}
</style>
