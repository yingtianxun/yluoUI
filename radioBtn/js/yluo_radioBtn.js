var yluo_radioBox = (function() {
	// 传入 id ,还有内容数组[]
	var _extend;

	function RadioBox(param) {
		this.param = {};
		_extend(this.param, param)

		this.param = param;
		this.oRadioBox = document.getElementById(this.param.id);
		this.initLayout();
		this.initEvent();
		this.index = this.param.index ? this.param.index : -1;
		this.select(this.param.index);
	};
	RadioBox.prototype.initLayout = function() {
		this.oRadioBox.className = "yluo_radioBtn"
		this.oUl = document.createElement("ul");
		this.oLi = [];
		this.oLabel = [];
		this.oImg = [];
		this.oSpan = [];
		for (var i = 0; i < this.param.Content.length; i++) {
			this.oLi[i] = document.createElement("li");
			
//			if(this.param.float){
				
			this.param.float &&	(this.oLi[i].style["float"] = this.param.float);
//			}
				
			this.param.marginRight &&(this.oLi[i].style["marginRight"] = this.param.marginRight);
			
			this.oLabel[i] = document.createElement("label");
			this.oImg[i] = document.createElement("img");
			this.oImg[i].src = "img/radioBtnNormal.png";
			this.oSpan[i] = document.createElement("span");
			this.oSpan[i].innerHTML = this.param.Content[i]; // 设置内容的
			this.oLabel[i].appendChild(this.oImg[i]);
			this.oLabel[i].appendChild(this.oSpan[i]);
			this.oLi[i].appendChild(this.oLabel[i]);
			this.oUl.appendChild(this.oLi[i])
		}
		this.oRadioBox.appendChild(this.oUl);
	};
	RadioBox.prototype.select = function(index) {
		
		(this.index >= 0) && (this.oImg[this.index].src = "img/radioBtnNormal.png");
		
		this.oImg[index].src = "img/radioBtnUnNormal.png";
		
		this.index = index;
		this.param.callback && this.param.callback(index);
	}
	RadioBox.prototype.initEvent = function() {
		var This = this;
		for (var i = 0; i < this.param.Content.length; i++) {
			var oLabel = this.oLabel[i];
			oLabel.index = i;
			oLabel.onclick = function() {
				if (This.index != this.index) {
					This.select(this.index);
				}
			};
		}
	};
	RadioBox.prototype.index = function() {
		return this.index;
	}
	_extend = function(dest, src) {
		for (key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	};
	return RadioBox;
}());