var yluo_UserList = (function() {
	var
		_extend,
		_createLi;
	// 1,已激活;2,冻结;3,未激活
	var userStateMap = [
		'<span class="state_normal">已激活</span>',
		'<span class="state_freeze">冻结</span>',
		'<span class="state_noactive">未激活</span>'
	];
	// param id
	function UserList(param) {
		this.param = {};
		_extend(this.param, param)
		this.oUserList = document.getElementById(this.param.id);

		this.oLis = {}; // 用来保存当前li的好删除
		this._initLayout();
		this._initController();
		this._initEvent();
	}
	UserList.prototype._initLayout = function() {
		
		this.oUserListBody = document.createElement('div');
		this.oUserListBody['id'] = this.param.id + 'yluo_userListBody';
		
		this.oUserListUl = document.createElement("ul");
		this.oUserListUl.className = "yluo_user_list_ul";
		
		this.oUserListBody.appendChild(this.oUserListUl);
		

		this.oUserList.appendChild(this.oUserListBody);
	};
	UserList.prototype._initEvent = function() {};

	UserList.prototype.insertRow = function(data) {

		var oUserListLi = _createLi(this, data);

		this.oLis[data.account] = oUserListLi; // 通过名字保存当前的li,后面就不用再遍历了

		this.oUserListUl.appendChild(oUserListLi);
	};
	UserList.prototype.removeRow = function(account) {

		var oUserListLi = this.oLis[account];

		this.oUserListUl.removeChild(oUserListLi);
	};
	UserList.prototype._initController = function() {
		var This = this;
		this.oScroller = new yluo_ScrollView({
			id: this.param.id + 'yluo_userListBody',
			showHorizontal : false,
			srollXCallback: function(curPosx) {
				This.oDataGridHeadUl.style['left'] = curPosx + 'px';
			}
		});
	};
	UserList.prototype.resize = function(){
		this.oScroller.resize();
	};
	_createLi = function(userListObj, data) {
		var oUserListLi = document.createElement("li");
		oUserListLi.className = "yluo_user_list_li";

		var oCover = document.createElement("div");
		oCover.className = "cover";
		var oPortrait = document.createElement("div");
		oPortrait.className = "portrait";
		var oPortraitImg = document.createElement("img");
		oPortraitImg.src = data.img;
		oPortrait.appendChild(oPortraitImg);
		var oDescription = document.createElement("div");
		oDescription.className = "description";
		var oSpanAccount = document.createElement("span");
		oSpanAccount.innerHTML = ' <span class="account">' + data.account + '</span>'
		var oSpanState = document.createElement("span");
		oSpanState.innerHTML = "状态: " + userStateMap[data.state - 1];
		oDescription.appendChild(oSpanAccount);
		oDescription.appendChild(oSpanState);
		var oBtn = document.createElement("button");
		oBtn.innerHTML = "查看详情";
		oBtn.onclick = function() {
			userListObj.param.callback && userListObj.param.callback(data.account);
		};
		oUserListLi.onmouseenter = function() {
			oBtn.style.display = "block";
		};
		oUserListLi.onmouseleave = function() {
			oBtn.style.display = "none";
		};
		oUserListLi.appendChild(oCover);
		oUserListLi.appendChild(oPortrait);
		oUserListLi.appendChild(oDescription);
		oUserListLi.appendChild(oBtn);
		return oUserListLi;
	}
	_extend = function(dest, src) {
		for (key in src) {
			if (src.hasOwnProperty(key)) {
				dest[key] = src[key];
			}
		}
	};
	return UserList;
}());