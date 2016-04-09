var yluo_checkBox = (function(){
//		<label><img src="./img/checkUncheck.png" /><span>测试1</span></label>
	// 参数 id,content,callback函数
	function CheckBox (param) {
		this.param = param;
		this.oCheckBox = document.getElementById(param.id);
		this.isCheck = false;
		this.initLayout();
		this.initEvent();
	}
	
	
	CheckBox.prototype.initLayout = function() {
		this.oLabel = document.createElement("label");
		this.oImg = document.createElement("img");
		this.oImg.src = "./img/checkUncheck.png";
		this.oSpan = document.createElement("span");
		this.oSpan.innerHTML  = this.param.content;
		this.oLabel.appendChild(this.oImg);
		this.oLabel.appendChild(this.oSpan);
		this.oCheckBox.appendChild(this.oLabel);
	};
	
	CheckBox.prototype.initEvent = function() {
		var This = this;
		this.oCheckBox.onclick = function () {
			
			This.isCheck = !This.isCheck;
			
			This.oImg.src = This.isCheck ? "./img/checkCheck.png" : "./img/checkUncheck.png";
			
			This.param.callback && This.param.callback(This.isCheck);
		}
	};
	CheckBox.prototype.isChecked = function () {
		return this.isCheck;
	}
	return CheckBox;
}());
