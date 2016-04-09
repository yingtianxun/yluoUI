var yluo_dataGrid = (function() {
	var _extend;
	var oHead = document.querySelector('head');

	function DataGird(param) {
		this.param = {
			cols: [],
		};
		_extend(this.param, param);
		this.oDataGrid = document.getElementById(this.param.id);
		this._initLayout();
		this._initHead();
		this._initController(); // 初始化控件

		this.checkColsHead = null; // 选中的

		this.selectRowObj = {
			selectRowIndex: {},
			selectRowNum: 0,
			isSelAll: false,
		}; // 选中行的标记

	};
	DataGird.prototype._initLayout = function() {
		this.oDataGrid.className += 'yluo_datagrid';
		this.oLeftLine = document.createElement('div');
		this.oLeftLine.className = 'changeSizeLeftLine';
		this.oRightLine = document.createElement('div');
		this.oRightLine.className = 'changeSizeRightLine';
		this.oDataGridHead = document.createElement('div');
		this.oDataGridHead.className = 'yluo_datagrid_head';
		this.oDataGridHeadUl = document.createElement('ul');
		this.oDataGridHead.appendChild(this.oDataGridHeadUl);
		this.oDataGridBody = document.createElement('div');
		this.oDataGridBody['id'] = this.param.id + 'yluo_dataGridBody';
		this.oDataGridBody.className = 'yluo_datagrid_body';
		this.oDataGridBodyTable = document.createElement('table');
		this.oDataGridBodyTable.setAttribute('border', '0');
		this.oDataGridBodyTable.setAttribute('cellpadding', '0');
		this.oDataGridBodyTable.setAttribute('cellspacing', '0');
		this.oDataGridBodyTable.setAttribute('width', '100%');
		// 添加表格进身体里面
		this.oDataGridBody.appendChild(this.oDataGridBodyTable);
		// 添加左线
		this.oDataGrid.appendChild(this.oLeftLine);
		// 添加右线
		this.oDataGrid.appendChild(this.oRightLine);
		// 添加头部
		this.oDataGrid.appendChild(this.oDataGridHead);
		// 添加身体
		this.oDataGrid.appendChild(this.oDataGridBody);
	};
	DataGird.prototype._initHead = function() {
		var colsNum = this.param.cols.length;
		var cols = this.param.cols;
		var fragment = document.createDocumentFragment();
		var styleFragment = document.createDocumentFragment();
		var oLi;
		this.oLiStyle = [];
		var beginIndex = 0;
		if (this.param.checkCol) {
			this._addCheckCol();
			beginIndex = 1;
		}
		for (var i = 0; i < colsNum; i++) {
			oLi = this._addCol(cols[i]);
			oLi.index = i + beginIndex;
			fragment.appendChild(oLi);
			this.oLiStyle[i + beginIndex] = document.createElement('style');

			this._setColWidth(oLi, cols[i].width + 1); // 设置列宽

			styleFragment.appendChild(this.oLiStyle[i + beginIndex]);
		}
		oHead.appendChild(styleFragment);
		this.oDataGridHeadUl.appendChild(fragment);
		this._setUlAndTableWidth(); // 设置ul的宽度
	};
	DataGird.prototype._addCheckCol = function() {
		var This = this;
		this.oLiStyle[0] = document.createElement('style');
		this.checkColsHead = document.createElement('li');
		this.checkColsHead.index = 0;
		this.oHeadOImg = document.createElement('img');
		this.oHeadOImg.src = '../checkBox/img/checkUncheck.png';
		this.checkColsHead.style['width'] = '30px';
		this.checkColsHead.appendChild(this.oHeadOImg);
		this._setColWidth(this.checkColsHead, 31); // 设置列宽
		oHead.appendChild(this.oLiStyle[0]);
		this.oDataGridHeadUl.appendChild(this.checkColsHead);

		this.checkColsHead.onclick = function() {
			if (This.selectRowObj.isSelAll) {
				This.deSelectAllRow();
				This.selectRowObj.isSelAll = false;
			} else {
				This.selectAllRow();
				This.selectRowObj.isSelAll = true;
			}
		}
	};
	DataGird.prototype._addCol = function(data) {
		var oLi = document.createElement('li');
		oLi.style['width'] = data.width + 'px';
		var oSpan = document.createElement('span');
		oSpan.innerHTML = data.title;
		var oResizeCols = document.createElement('span');
		oResizeCols.className = 'resizeDrop';
		oLi.appendChild(oSpan);
		oLi.appendChild(oResizeCols);
		this._addColsEvent(oResizeCols);
		return oLi;
	};
	DataGird.prototype._setUlAndTableWidth = function() {
		var oUlNewWidth = 0;
		var oLis = this.oDataGridHeadUl.children;
		var oLisNum = oLis.length; // 头部高度的
		for (var i = 0; i < oLisNum; i++) {
			oUlNewWidth += oLis[i].offsetWidth;
		}
		this.oDataGridHeadUl.style['width'] = oUlNewWidth + 'px';
		this.oDataGridBodyTable.style['width'] = oUlNewWidth + 'px';
	};
	DataGird.prototype._initController = function() {
		var This = this;
		this.oScroller = new yluo_ScrollView({
			id: this.param.id + 'yluo_dataGridBody',
			srollXCallback: function(curPosx) {
				This.oDataGridHeadUl.style['left'] = curPosx + 'px';
			}
		});
	};
	DataGird.prototype._showLine = function() {
		this.oLeftLine.style['display'] = 'block';
		this.oRightLine.style['display'] = 'block';
		this.oDataGrid.style['cursor'] = 'col-resize';
	};
	DataGird.prototype._hideLine = function() {
		this.oLeftLine.style['display'] = 'none';
		this.oRightLine.style['display'] = 'none';
		this.oDataGrid.style['cursor'] = 'default';
	};
	DataGird.prototype._addColsEvent = function(elem) {
		var This = this;
		var startPosX = 0;
		var elemParent = elem.parentNode;
		elem.onmousedown = function(event) {
			startPosX = event.clientX;
			var lineOffSetLeft = This.oDataGridHeadUl.offsetLeft + elemParent.offsetLeft - 1;
			This.oLeftLine.style['left'] = (lineOffSetLeft - 1) + 'px';
			This.oRightLine.style['left'] = (lineOffSetLeft + elemParent.offsetWidth) + 'px';
			This._showLine();
			This.oDataGrid.onmousemove = function(event) {
				var moveDistX = event.clientX - startPosX;
				This.oRightLine.style['left'] =
					(This.oRightLine.offsetLeft + This.oRightLine.offsetWidth + moveDistX - 1) + 'px';
				startPosX = event.clientX;
			};
			This.oDataGrid.onmouseup = function(event) {
				var changeSize = -This.oDataGridHeadUl.offsetLeft + This.oRightLine.offsetLeft -
					elemParent.offsetLeft - elemParent.clientWidth;
				if (changeSize !== 0) {
					elemParent.style['width'] = (elemParent.clientWidth + changeSize) + 'px';
					This._setUlAndTableWidth(); // 设置ul的宽度

					This._setColWidth(elemParent); // 重新设置宽度

					This.oScroller.resize();
				}
				This._hideLine();
				This.oDataGrid.onmouseup = null;
				This.oDataGrid.onmousemove = null;
			}
			This.oDataGrid.onmouseleave = function() {
				This._hideLine();
				This.oDataGrid.onmousemove = null;
				This.oDataGrid.onmouseleave = null;
			}
		};
	};

	DataGird.prototype._setColWidth = function(colObj, width) {

		width = colObj.offsetWidth ? colObj.offsetWidth : width;

		this.oLiStyle[colObj.index].innerHTML = '.yluo_datagrid_body td:nth-child(' + (colObj.index + 1) + ') {width:' + width + 'px;}';
	};

	DataGird.prototype.insertRow = function(data) {
		var rowIndex = this.oDataGridBodyTable.children.length;
		var oTr = this._createRow(data, rowIndex);
		oTr.index = rowIndex;
		this.oDataGridBodyTable.appendChild(oTr, oTr.index);
		this.oScroller.resize();
		this._changeHeaderImgState(false);

	};
	DataGird.prototype.insertRows = function(data) {
		var fragment = document.createDocumentFragment();
		var insertRowNum = data.length;
		var trNum = this.oDataGridBodyTable.children.length;
		var oTr;

		for (var i = 0; i < insertRowNum; i++) {

			oTr = this._createRow(data[i], trNum + i);
			oTr.index = trNum + i;
			fragment.appendChild(oTr);
		}
		this.oDataGridBodyTable.appendChild(fragment);
		this.oScroller.resize();
		this._changeHeaderImgState(false);
	};

	DataGird.prototype.removeRow = function(rowIndex) {
		var oTr = this.oDataGridBodyTable.children[rowIndex];
		if (oTr) {
			this.oDataGridBodyTable.removeChild(oTr);
			this._resetIndex(rowIndex);
			this.oScroller.resize();
		}
	};
	DataGird.prototype.removeRows = function(rowIndexs) {
		var oTr,
			delRowNum = rowIndexs.length,
			minRowIndex = this.oDataGridBodyTable.children.length,
			isDel = false,
			delRowArr = [],
			delRow;
		for (var i = 0; i < delRowNum; i++) {
			oTr = this.oDataGridBodyTable.children[rowIndexs[i]];
			oTr && delRowArr.push(oTr);
		}
		for (var i = 0; i < delRowArr.length; i++) {
			delRow = delRowArr[i];
			minRowIndex = delRow.index < minRowIndex ? delRow.index : minRowIndex;
			this.oDataGridBodyTable.removeChild(delRow);
			isDel = true;
		}
		if (isDel) {
			this._resetIndex(minRowIndex);
			this.oScroller.resize();
		}
	};

	DataGird.prototype.removeAll = function() {
		this.oDataGridBodyTable.innerHTML = '';
		this._changeHeaderImgState(false);
	};
	DataGird.prototype.scrollToRow = function(rowIndex) {
		var
			rowNum = this.oDataGridBodyTable.children.length,
			scrollSpan = 0,
			rows = this.oDataGridBodyTable.children;

		rowIndex = rowNum < rowIndex ? rowNum : rowIndex;

		for (var i = 0; i < rowIndex; i++) {
			scrollSpan += rows[i].offsetHeight;
		}
		this.oScroller.scrollYTo(scrollSpan);
	};

	DataGird.prototype._resetIndex = function(beginRowIndex) {
		var oTrs = this.oDataGridBodyTable.children;
		var rowNum = oTrs.length;
		for (var i = beginRowIndex; i < rowNum; i++) {
			oTrs[i].index = i;
		}
	};

	DataGird.prototype._createRow = function(data, rowIndex) {
		var
			This = this,
			oTr = document.createElement('tr'),
			cols = this.param.cols,
			colsNum = this.param.cols.length;
		var oTd, col;
		if (this.param.checkCol) {
			oTr.appendChild(this._addCheckTd())
		}
		for (var i = 0; i < colsNum; i++) {
			col = cols[i];
			oTd = document.createElement('td');
			if (col.renderer) { // 如果为真就渲染

				var backContent = col.renderer(data[col['name']], rowIndex);

				if (typeof backContent === 'string') {
					oTd.innerHTML = backContent;
				} else {
					oTd.appendChild(backContent);
				}
			} else {
				oTd.innerHTML = data[col['name']];
			}
			oTr.appendChild(oTd);

			oTr.onclick = function() {
				This._changekRowSelState(this);
			}
		}
		return oTr;
	};
	DataGird.prototype._changekRowSelState = function(oTr) {
		if (this.selectRowObj.selectRowIndex[oTr.index]) {
			delete this.selectRowObj.selectRowIndex[oTr.index];
			oTr.className = '';
			this._changeCheckTdState(oTr, false);
			this.selectRowObj.selectRowNum--;
		} else {
			this.selectRowObj.selectRowIndex[oTr.index] = true;
			this.selectRowObj.selectRowNum++;
			oTr.className = 'selRow';
			this._changeCheckTdState(oTr, true);
		}
	};

	DataGird.prototype._changeCheckTdState = function(oTr, isSel) {
		if (this.param.checkCol) {
			var oImg = oTr.children[0].children[0];
			var oTrNum = this.oDataGridBodyTable.children.length;
			if (!isSel) {
				oImg.src = './checkUncheck.png';
				if (this.selectRowObj.selectRowNum === oTrNum) {
					this.oHeadOImg.src = './checkUncheck.png';
					this.selectRowObj.isSelAll = false;
				}
			} else {
				oImg.src = './checkCheck.png';
				if (this.selectRowObj.selectRowNum === oTrNum) {
					this.oHeadOImg.src = './checkCheck.png';
					this.selectRowObj.isSelAll = true;
				}
			}
		}
	};

	DataGird.prototype._changeHeaderImgState = function(isSel) {
		if (isSel) {
			this.oHeadOImg.src = './checkCheck.png';
			this.selectRowObj.isSelAll = true;
		} else {
			this.selectRowObj.isSelAll = false;
			this.oHeadOImg.src = './checkUncheck.png';
		}

	}


	DataGird.prototype.selectedRowsIndex = function() {
		var selectRows = this.selectRowObj.selectRowIndex;

		var selectRowsIndex = [];

		for (k in selectRows) {
			selectRowsIndex.push(parseInt(k));
		}

		selectRowsIndex.sort(function(a, b) {
			return a > b ? 1 : -1;
		});

		return selectRowsIndex;

	};

	DataGird.prototype.selectAllRow = function() {
		var oTrNum = this.oDataGridBodyTable.children.length;
		var oTr
		for (var i = 0; i < oTrNum; i++) {
			oTr = this.oDataGridBodyTable.children[i];
			if (!this.selectRowObj.selectRowIndex[oTr.index]) {
				this.selectRowObj.selectRowIndex[oTr.index] = true;
				this.selectRowObj.selectRowNum++;
				oTr.className = 'selRow';
				this._changeCheckTdState(oTr, true);
			}
		}
	};

	DataGird.prototype.selectRow = function(rowIndex) {
		var oTrNum = this.oDataGridBodyTable.children.length;
		if (rowIndex < 0 || rowIndex > oTrNum) {
			return;
		}
		var oTr = this.oDataGridBodyTable.children[rowIndex];

		if (!this.selectRowObj.selectRowIndex[oTr.index]) {
			this.selectRowObj.selectRowIndex[oTr.index] = true;
			this.selectRowObj.selectRowNum++;
			oTr.className = 'selRow';
			this._changeCheckTdState(oTr, true);
		}
	};

	DataGird.prototype.deSelectAllRow = function() {
		var oTrNum = this.oDataGridBodyTable.children.length;
		var oTr
		for (var i = 0; i < oTrNum; i++) {
			oTr = this.oDataGridBodyTable.children[i];
			if (this.selectRowObj.selectRowIndex[oTr.index]) {
				delete this.selectRowObj.selectRowIndex[oTr.index];
				oTr.className = '';
				this._changeCheckTdState(oTr, false);
				this.selectRowObj.selectRowNum--;
			}
		}
	};

	DataGird.prototype.deSelectRow = function(rowIndex) {
		var oTrNum = this.oDataGridBodyTable.children.length;
		if (rowIndex < 0 || rowIndex > oTrNum) {
			return;
		}
		var oTr = this.oDataGridBodyTable.children[rowIndex];

		if (this.selectRowObj.selectRowIndex[oTr.index]) {
			delete this.selectRowObj.selectRowIndex[oTr.index];
			oTr.className = '';
			this._changeCheckTdState(oTr, false);
			this.selectRowObj.selectRowNum--;
		}
	};
	DataGird.prototype._addCheckTd = function() {
		var oTd = document.createElement('td');
		var oImg = document.createElement('img');
		oImg.src = './checkUncheck.png';

		oTd.appendChild(oImg);

		return oTd;
	};

	DataGird.prototype.resize = function() {

		this.oScroller.resize();
	};
	_extend = function(dest, src) {
		for (key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	};
	return DataGird;
}());