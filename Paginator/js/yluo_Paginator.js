var yluo_Paginator = (function() {
	var _extend;

	function Paginator(param) {
		this.param = {
			height: "36px",
			pageShowNum: 20
		};
		_extend(this.param, param)
		this.oPaginator = document.getElementById(this.param.id);
		this._initLayout();
		this._initEvent();
		this.curPage = 1; // 所在的当前页
		this.totalItemNum = 0; // 当前条目的总数量
		this.totalPageNum = 0; // 总页数
		this._initPageShow();
	};
	Paginator.prototype._initLayout = function() {
		this.oPaginator.className = "yluo_Paginator";
		this.oPaginator.style.height = this.param.height;
		this.oPaginator.style.lineHeight = this.param.height;
		//  显示记录总数的
		this.oItemTotalNumTag = document.createElement("span");
		this.oItemTotalNumTag.className = "itemTotalNum";
		this.oItemTotalNumTag.innerHTML = "记录总数: ";
		this.oItemTotalNum = document.createElement("span"); // 显示具体数量的	
		this.oItemTotalNum.innerHTML = "10";
		this.oItemTotalNumTag.appendChild(this.oItemTotalNum);
		// 显示页数的
		this.oPageNumTag = document.createElement("span");
		this.oPageNumTag.className = "pageNum";
		this.oPageNumTag.innerHTML = '共 <span id="yluo_Paginator_pageNum"></span> 页';
		// --------------------
		this.oFirstPage = document.createElement("span"); // 第一页
		this.oFirstPage.className = "firstPage";
		this.oFirstPage.innerHTML = "第一页"
		this.oPrePage = document.createElement("img");
		this.oPrePage.src = "./img/prePageIco.gif";
		this.oPrePage.className = "prePage";
		this.oCurShowPage = document.createElement("input");
		this.oCurShowPage.type = "text";
		this.oCurShowPage.className = "curShowPage";
		this.oNextPage = document.createElement("img");
		this.oNextPage.src = "./img/nextPageIco.gif";
		this.oNextPage.className = "nextPage";
		this.oLastPage = document.createElement("span"); // 第一页
		this.oLastPage.className = "lastPage";
		this.oLastPage.innerHTML = "最后页"
		var fragment = document.createDocumentFragment(); // 通过碎片来加载上去
		fragment.appendChild(this.oItemTotalNumTag);
		fragment.appendChild(this.oPageNumTag);
		fragment.appendChild(this.oFirstPage);
		fragment.appendChild(this.oPrePage);
		fragment.appendChild(this.oCurShowPage);
		fragment.appendChild(this.oNextPage);
		fragment.appendChild(this.oLastPage);
		this.oPaginator.appendChild(fragment);
	};
	Paginator.prototype._initEvent = function() {
		var This = this;
		this.oFirstPage.onclick = function() {
			if (This.curPage === 1) {
				return;
			}
			This.curPage = 1;
			This.oCurShowPage.value = This.curPage;
			This.param.onPageChange && This.param.onPageChange(This.curPage);
		};
		this.oPrePage.onclick = function() {
			if (This.curPage === 1) {
				return;
			}
			This.curPage--;
			This.oCurShowPage.value = This.curPage;
			This.param.onPageChange && This.param.onPageChange(This.curPage, This.param.pageShowNum);
		};
		this.oNextPage.onclick = function() {
			if (This.curPage === This.totalPageNum) {
				return;
			}
			This.curPage++;
			This.oCurShowPage.value = This.curPage;
			This.param.onPageChange && This.param.onPageChange(This.curPage, This.param.pageShowNum);
		};
		this.oLastPage.onclick = function() {
			if (This.curPage === This.totalPageNum) {
				return;
			}
			This.curPage = This.totalPageNum;
			This.oCurShowPage.value = This.curPage;
			This.param.onPageChange && This.param.onPageChange(This.curPage, This.param.pageShowNum);
		};
		this.oCurShowPage.onkeydown = function(event) {
			event = event ? event : (window.event ? window.event : null);
			if (event.keyCode === 13) {
				var jumpPage = parseInt(This.oCurShowPage.value);
				if (jumpPage) { // 解析正确的结果
					if (jumpPage !== This.curPage && jumpPage >= 1 && jumpPage <= This.totalPageNum) {
						This.curPage = jumpPage;
						This.param.onPageChange && This.param.onPageChange(This.curPage, This.param.pageShowNum);
						this.blur();
						return
					}
				}
				This.oCurShowPage.value = This.curPage;
			}
		}
	};
	Paginator.prototype._initPageShow = function() {
		this.oPageNum = document.getElementById("yluo_Paginator_pageNum"); // 显示页数的
		if (this.param.ItemNum) {
			this.totalItemNum = this.param.ItemNum;
			this.totalPageNum = Math.ceil(this.totalItemNum / this.param.pageShowNum);
		}
		this.oCurShowPage.value = 1;
		this.oItemTotalNum.innerHTML = this.totalItemNum;
		this.oPageNum.innerHTML = this.totalPageNum;
	};
	// 设置总数量的,好分页
	Paginator.prototype.setItemNum = function(itemNum) {
		this.totalItemNum = itemNum;
		this.totalPageNum = Math.ceil(this.totalItemNum / this.param.pageShowNum);
		this.curPage = 1;
		this.oCurShowPage.value = 1;
		this.oItemTotalNum.innerHTML = this.totalItemNum;
		this.oPageNum.innerHTML = this.totalPageNum;
	};
	Paginator.prototype.getItemNum = function() {
		return this.totalPageNum;
	};
	_extend = function(dest, src) {
		for (key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	}
	return Paginator;
}());