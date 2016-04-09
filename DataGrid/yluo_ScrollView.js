var yluo_ScrollView = (function() {
	var _extend;
	/*
	 * param
	 * wheelScrollSpeed  滚轮滚动的速度,要负数
	 * id 要实例化的对象
	 * srollXCallback 滚动x轴时的回调
	 * srollYCallback 滚动y轴时的回调
	 * width 滚动框架的宽度
	 * height 滚动框架的高度  没有的时候则自动设置
	 * */
	function ScrollView(param) {
		this.param = {
			wheelScrollSpeed: -10,
			pageShowNum: 20
		};
		_extend(this.param, param);
		this.oScrollView = document.getElementById(this.param.id);
		this.oBody = document.querySelector('body');
		this._initLayout();
	}
	ScrollView.prototype._initLayout = function() {
		this.oScrollView.className += " yluo_scrollView";

		// 设置一下大小
		this.param.width && (this.oScrollView.style["width"] = this.param.width + 'px');
		this.param.height && (this.oScrollView.style["height"] = this.param.height + 'px');
		
		this.oScrollViewContent = document.createElement('div');
		this.oScrollViewContent.className = 'yluo_scrollView_content';
		if (this.oScrollView.children.length !== 1) {
			alert("只能 有一个子元素");
			return;
		}
		this.oContent = this.oScrollView.children[0]; // 添加的content
		this.oScrollViewContent.style["width"] = this.oContent.offsetWidth + 'px';
		this.oScrollViewContent.style["height"] = this.oContent.offsetHeight + 'px';
		this.oScrollViewContent.appendChild(this.oContent);
		this.oScrollView.appendChild(this.oScrollViewContent);
		this._initScrollBar();
	};
	ScrollView.prototype._initScrollBar = function() {
		// 初始化垂直滚动条的
		this._initVerticalLayout();
		// 初始化水平滚动条
		this._initHorizontalLayout();
		// 这里重新检查的了
		this._checkInitLayout(); // 在检查一次
		// 设置滚动条高度宽度的
		this._setLeftDropHeight();
		this._setBottomDropWidth();
	};
	ScrollView.prototype._checkInitLayout = function() {
		if (this.oLeftBar && !this.oBottomBar) { // 显示了做滚动条,底部滚动条没显示的
			if ((this.oScrollViewContent.offsetWidth + this.oLeftBar.offsetWidth) > this.oScrollView.offsetWidth) {
				this._initHorizontalLayout(true); // 强制显示了
			}
		}
		if (this.oBottomBar && !this.oLeftBar) { // 显示了做滚动条,底部滚动条没显示的
			if ((this.oScrollViewContent.offsetHeight + this.oBottomBar.offsetHeight) > this.oScrollView.offsetHeight) {
				this._initVerticalLayout(true); // 强制显示了
			}
		}
	};
	ScrollView.prototype._initVerticalLayout = function(show) {
		if (this.oScrollViewContent.offsetHeight > this.oScrollView.offsetHeight || show) {
			if (!this.oLeftBar) {
				this.reduceWidth = 0;
				this.oLeftBar = document.createElement('div');
				this.oLeftBar.className = 'yluo_scrollView_leftBar';
				this.oLeftDrop = document.createElement('div');
				this.oLeftDrop.className = 'drop';
				this.oLeftBar.appendChild(this.oLeftDrop);
				this.oScrollView.appendChild(this.oLeftBar);
				this._initVerticalEvent(); // 直接添加事件了
			}
		} else {
			// 不符合,之前又有的就全部删除了
			if (this.oLeftBar) {
				// 移除左边的滚动条
				this._scrollYTo(0);
				this.reduceWidth = 0;
				this.oLeftDrop.onmousedown = null;
				this.oScrollView.removeChild(this.oLeftBar);
				this.oLeftBar = null;
				this.oLeftDrop = null;
				yluo_DomHandle.removeScorll(this.oScrollView); // 移除左边的滚动条的时候也要移除滚轮事件
			}
		}
	};
	// 可以重置使用
	ScrollView.prototype._setLeftDropHeight = function() {
		if (this.oLeftBar) {
			
			this.leftDropY = 0;
			
			this.reduceHeight = this.oBottomBar ? this.oBottomBar.offsetHeight : 0;
			
			this.OutSpanHeight = this.oScrollViewContent.offsetHeight - this.oScrollView.offsetHeight + this.reduceHeight;
			
			this.leftDropHeightScale = this.oScrollView.offsetHeight / (this.oScrollViewContent.offsetHeight + this.reduceHeight);
			
			var leftDropHeight = this.leftDropHeightScale * (this.oScrollView.offsetHeight - this.reduceHeight);
			

			this.oLeftDrop.style["height"] = leftDropHeight + 'px'; // 设置垂直滚动条的高度
			// 
//			console.log(leftDropHeight,'-------------------');
			// 垂直滚动条的可滚动范围
			this.oLeftDropScrollSpan = this.oLeftBar.offsetHeight - this.oLeftDrop.offsetHeight - this.reduceHeight; // 左边滚动块最大的移动范围
		}
	};
	ScrollView.prototype._initVerticalEvent = function() {
		var This = this;
		this.oLeftDrop.onmousedown = function(event) {
				This.leftDropY = event.clientY; // 保存点击的鼠标							
				This._registeLeftDropEvent();
			}
			//  这里也要对整体添加一个滚轮事件
		yluo_DomHandle.onScroll(this.oScrollView, function(directY) {
			This._scrollY(directY * This.param.wheelScrollSpeed);
		});
	};
	ScrollView.prototype._registeLeftDropEvent = function() {
		var This = this;
		yluo_DomHandle.addEvent(this.oBody, 'mousemove', _oLeftMouseMove);
		// 后面要移除的
		yluo_DomHandle.addEvent(this.oBody, 'mouseup', _oLeftMouseUpHandle);
		yluo_DomHandle.addEvent(this.oBody, 'mouseleave', _oLeftMouseUpHandle);

		function _oLeftMouseMove(event) {
			var scrollDistY = event.clientY - This.leftDropY;
			This._scrollY(scrollDistY);
			This.leftDropY = event.clientY;
		};

		function _oLeftMouseUpHandle(event) {
			yluo_DomHandle.removeEvent(This.oBody, 'mousemove', _oLeftMouseMove);
			yluo_DomHandle.removeEvent(This.oBody, 'mouseup', _oLeftMouseUpHandle);
			yluo_DomHandle.removeEvent(This.oBody, 'mouseleave', _oLeftMouseUpHandle);
		};
	};
	// -------------------水平布局----------------
	ScrollView.prototype._initHorizontalLayout = function(show) {
		if (this.oScrollViewContent.offsetWidth > this.oScrollView.offsetWidth || show) {		
			if (!this.oBottomBar) {
				this.oBottomBar = document.createElement('div');
				this.oBottomBar.className = 'yluo_scrollView_bottomBar';
				this.oBottomDrop = document.createElement('div');
				this.oBottomDrop.className = 'drop';
				this.oBottomBar.appendChild(this.oBottomDrop);
				this.oScrollView.appendChild(this.oBottomBar);
				this._initHorizontalEvent(); // 直接添加事件了
			}
		} else {
			if (this.oBottomBar) {
				// 移除底部的滚动条
				this._scrollXTo(0);
				this.reduceHeight = 0;
				
				
				this.oBottomDrop.onmousedown = null;
				this.oScrollView.removeChild(this.oBottomBar);
				this.oBottomBar = null;
				this.oBottomDrop = null;
			}
		}
	};
	ScrollView.prototype._initHorizontalEvent = function() {
		var This = this;
		this.oBottomDrop.onmousedown = function(event) {
			This.BottomDropX = event.clientX; // 保存点击的鼠标		
			This._registeBottomDropEvent();
		}
	};
	ScrollView.prototype._registeBottomDropEvent = function() {
		var This = this;
		yluo_DomHandle.addEvent(this.oBody, 'mousemove', _oBottomMouseMove);
		// 后面要移除的
		yluo_DomHandle.addEvent(this.oBody, 'mouseup', _oBottomMouseUpHandle);
		yluo_DomHandle.addEvent(this.oBody, 'mouseleave', _oBottomMouseUpHandle);

		function _oBottomMouseMove(event) {
			var scrollDistX = event.clientX - This.BottomDropX
			This._scrollX(scrollDistX);
			This.BottomDropX = event.clientX;
		};

		function _oBottomMouseUpHandle(event) {
			yluo_DomHandle.removeEvent(This.oBody, 'mousemove', _oBottomMouseMove);
			yluo_DomHandle.removeEvent(This.oBody, 'mouseup', _oBottomMouseUpHandle);
			yluo_DomHandle.removeEvent(This.oBody, 'mouseleave', _oBottomMouseUpHandle);
		};
	};
	ScrollView.prototype._setBottomDropWidth = function() {
		if (this.oBottomBar) {
			
			this.BottomDropX = 0;
			
			this.reduceWidth = this.oLeftBar ? this.oLeftBar.offsetWidth : 0;
					
			// 超出视野范围的
			this.OutSpanWidth = this.oScrollViewContent.offsetWidth - this.oScrollView.offsetWidth + this.reduceWidth;
			
			// 滚动条要显示的比例
			this.BottomDropWidthScale = this.oScrollView.offsetWidth / (this.oScrollViewContent.offsetWidth + this.reduceWidth);
			
			var BottomDropWidth = this.BottomDropWidthScale * (this.oScrollView.offsetWidth - this.reduceWidth);
			
						
			this.oBottomDrop.style["width"] = BottomDropWidth + 'px'; // 设置垂直滚动条的宽度
			// 垂直滚动条的可滚动范围
			this.oBottomDropScrollSpan = this.oBottomBar.offsetWidth - BottomDropWidth - this.reduceWidth ; // 左边滚动块最大的移动范围
		}
	};
	
	ScrollView.prototype.scrollXTo = function(destX){ // 对外的接口
		if(this.oBottomDrop){
			var destXDrop = (destX/this.OutSpanWidth)*this.oBottomDropScrollSpan;
		
			this._scrollXTo(destXDrop);
		}

	};	
	
	ScrollView.prototype._scrollX = function(distx) { //滚动条的比例算的 在当前的位置滚动		
		if(this.oBottomDrop){
			var bottomDropNewOffsetLeft = this.oBottomDrop.offsetLeft + distx; // 将要移动到的位置,当前滚动条的位置
		
			this._scrollXTo(bottomDropNewOffsetLeft);
		}
	
	};
	ScrollView.prototype._scrollXTo = function(bottomDropNewOffsetLeft){
		// 这里是按照滚动条的大小滚动的		
		if (bottomDropNewOffsetLeft < 0) {
			bottomDropNewOffsetLeft = 0;
		} else if (bottomDropNewOffsetLeft > this.oBottomDropScrollSpan) {
	
			bottomDropNewOffsetLeft = this.oBottomDropScrollSpan;	
		}
		if (bottomDropNewOffsetLeft === this.oBottomDrop.offsetLeft) {
			return;
		}		
		this.oBottomDrop.style['left'] = bottomDropNewOffsetLeft + 'px';
		
		var contentScrollDist = -(bottomDropNewOffsetLeft / this.oBottomDropScrollSpan) * this.OutSpanWidth;
		
		this.oScrollViewContent.style['left'] = contentScrollDist + 'px'; //内容滚动的宽度
		
		this.param.srollXCallback && this.param.srollXCallback(contentScrollDist);
	};
	ScrollView.prototype.scrollYTo = function(destY){ // 对外的接口
		if(this.oLeftDrop){
			var destYDrop = (destY/this.OutSpanHeight)*this.oLeftDropScrollSpan;
		
			this._scrollYTo(destYDrop);
		}
		
		
	};	
	ScrollView.prototype._scrollY = function(disty) { // 在当前的位置滚动
		if(this.oLeftDrop){ 
			var leftDropNewOffsetTop = this.oLeftDrop.offsetTop + disty; // 将要移动到的位置,当前滚动条的位置	
			this._scrollYTo(leftDropNewOffsetTop);
		}
	
	};
	ScrollView.prototype._scrollYTo = function(leftDropNewOffsetTop){
		if (leftDropNewOffsetTop < 0) {
			leftDropNewOffsetTop = 0;
		} else if (leftDropNewOffsetTop > this.oLeftDropScrollSpan) {
			leftDropNewOffsetTop = this.oLeftDropScrollSpan;
		}
		if (leftDropNewOffsetTop === this.oLeftDrop.offsetTop) {
			return;
		}
		this.oLeftDrop.style['top'] = leftDropNewOffsetTop + 'px';
		var contentScrollDist = -(leftDropNewOffsetTop / this.oLeftDropScrollSpan) * this.OutSpanHeight;
		this.oScrollViewContent.style['top'] = contentScrollDist + 'px';
		this.param.srollYCallback && this.param.srollYCallback(contentScrollDist);
	}
	
	ScrollView.prototype.resize = function() {
		
		// 大于0 变大,小于0 变小,等于0 返回去
		var changeWidthBiggerOrNot = this.oContent.offsetWidth - this.oScrollViewContent.offsetWidth  ; // 前后两次变化的大小
		var changeHeightBiggerOrNot = this.oContent.offsetHeight - this.oScrollViewContent.offsetHeight;
	
		this.oScrollViewContent.style["width"] = this.oContent.offsetWidth + 'px';
				
		this.oScrollViewContent.style["height"] = this.oContent.offsetHeight + 'px';
		// 重新设置滚动条
		this._initScrollBar();
		
		// // 位置归位		后面再修复
	
		this._scrollX(Math.floor(1 * this.BottomDropWidthScale) );
		
		


		this._scrollY(Math.floor(1 * this.leftDropHeightScale));
		

	};
	ScrollView.prototype.getScrollX = function() {
		return this.oScrollViewContent.offsetLeft;
	};
	ScrollView.prototype.getScrollY = function() {
		return this.oScrollViewContent.offsetTop;
	};
	ScrollView.prototype.setWidth = function(width) {
		this.oScrollView.style['width'] = width + 'px';
		this.resize();
	};
	ScrollView.prototype.setHeight = function(height) {
		this.oScrollView.style['height'] = height + 'px';
		this.resize();
	};
	ScrollView.prototype.setWidthAndHeight = function(width, height) {
		this.oScrollView.style['width'] = width + 'px';
		this.oScrollView.style['height'] = height + 'px';
		this.resize();
	};
	_extend = function(dest, src) {
		for (key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	}
	return ScrollView;
}());