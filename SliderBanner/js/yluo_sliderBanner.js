var yluo_sliderBanner = (function() {
	function SliderBanner(param) {
		this.param = param;
		this.oOuter = document.getElementById(param.id);
		this.curIndex = 0;
		this._initLayout();
		this._initEvent();
	}
	SliderBanner.prototype._initLayout = function() {
		this.pageNum = this.oOuter.children.length;
		this.oOuter.className = "yluo_sliderBanner";
		this.oOuter.style["width"] = this.param.width + "px";
		this.oOuter.style["height"] = this.param.height + "px";
		this.oUl = document.createElement("ul")
		this.oUl.style["width"] = (this.pageNum * this.param.width) + "px";
		this.oUl.style["height"] = this.param.height + "px";
		for (var i = 0; i < this.oOuter.children.length;) {
			var oChildren = this.oOuter.children[i];
			oChildren.style["width"] = this.param.width + "px";
			oChildren.style["height"] = this.param.height + "px";
			this.oLi = document.createElement("li");
			this.oLi.appendChild(oChildren);
			this.oUl.appendChild(this.oLi);
		}
		this.oOuter.appendChild(this.oUl);
		this.oPreBtn = document.createElement("button");
		this.oPreBtn.className = "indexBtn preBtn";
		this.oNextBtn = document.createElement("button");
		this.oNextBtn.className = "indexBtn nextBtn";
		this.oOuter.appendChild(this.oPreBtn);
		this.oOuter.appendChild(this.oNextBtn);
	};
	SliderBanner.prototype._initEvent = function() {
		var This = this;
		var slideMinSpan = -1 * (This.pageNum - 1);
		this.oPreBtn.onclick = function() {
			if (This.curIndex < 0) {
				This.curIndex++;
				startMove(This.oUl, {
					left: This.curIndex * This.param.width
				});
			}
		};
		this.oNextBtn.onclick = function() {
			if (This.curIndex > slideMinSpan) {
				This.curIndex--;
				startMove(This.oUl, {
					left: This.curIndex * This.param.width
				});
			}
		};
	};

	function _getStyle(obj, attr) {
		if (obj.currentStyle) {
			_getStyle = function() {
				return obj.currentStyle[attr];
			};
		} else {
			_getStyle = function() {
				return getComputedStyle(obj, null)[attr];
			};
		}
		return _getStyle();
	}

	function startMove(obj, json, endFn) {
		clearInterval(obj.timer);
		obj.timer = setInterval(function() {
			var bBtn = true;
			for (var attr in json) {
				var iCur = 0;
				if (attr == 'opacity') {
					if (Math.round(parseFloat(_getStyle(obj, attr)) * 100) == 0) {
						iCur = Math.round(parseFloat(_getStyle(obj, attr)) * 100);
					} else {
						iCur = Math.round(parseFloat(_getStyle(obj, attr)) * 100) || 100;
					}
				} else {
					iCur = parseInt(_getStyle(obj, attr)) || 0;
				}
				var iSpeed = (json[attr] - iCur) / 8;
				iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
				if (iCur != json[attr]) {
					bBtn = false;
				}
				if (attr == 'opacity') {
					obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')';
					obj.style.opacity = (iCur + iSpeed) / 100;
				} else {
					obj.style[attr] = iCur + iSpeed + 'px';
				}
			}
			if (bBtn) {
				clearInterval(obj.timer);
				endFn && endFn.call(obj);
			}
		}, 30);
	}
	return SliderBanner;
}());