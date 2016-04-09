	var yluo_ComboBox = (function() {
				var _extend;
				/*
				 * param 参数内容
				 * id 要实例化的id
				 * width
				 * height
				 * dropWidth 下来的宽度
				 * showItems 显示多少行
				 * selectIndex 选种哪行
				 * callback 选择回调
				 * tagName  标签名字
				 * items 初始化数据
				 * */
				function ComboBox(param) {
					this.param = {
						selectIndex: -1,
						width: 150,
						height: 24,
						dropWidth: 60,
						showItems: 7,
					};
					_extend(this.param, param);
					this.isShowBody = false; // 身体是否显示
					this.oComboBox = document.getElementById(this.param.id);
					this._initLayout();
					this._setWidthAndHeight();
					this._initController();
					this._initEvent();
					
					this._initData();
					
					this.setCurIndex(0);// 选中第一条
				};
				ComboBox.prototype._initData = function(){
					console.log("-----------")
					if(this.param.items){
						this.appendArrary(this.param.items);
					}
				}
				
				ComboBox.prototype._initLayout = function() {
					this.oComboBox.classList.add('yluo_comboBox');
					if (this.param.tagName) { // 创建标签
						this.oTagName = document.createElement('span');
						this.oTagName.className = 'tag';
						this.oTagName.innerHTML = this.param.tagName;
						this.oComboBox.appendChild(this.oTagName);
					}
					this.oComboBoxhead = document.createElement('div');
					this.oComboBoxhead.className = 'yluo_comboBox_head';
					this.oComboBoxInput = document.createElement('input');
					this.oComboBoxInput.className = 'yluo_comboBox_input';
					this.oComboBoxInput.setAttribute("type", "text");
					this.oComboBoxhead.appendChild(this.oComboBoxInput);
					this.oComboBoxArrow = document.createElement('span');
					this.oComboBoxArrow.className = 'yluo_comboBox_arrow';
					var oArrowImg = document.createElement('img');
//					oArrowImg.src = "./static/img/arrowDown.png";
					oArrowImg.src = "./img/arrowDown.png";
					this.oComboBoxArrow.appendChild(oArrowImg);
					this.oComboBoxhead.appendChild(this.oComboBoxArrow);
					this.oComboBoxBody = document.createElement('div');
					this.oComboBoxBody.className = 'yluo_comboBox_body';
					this.oComboBoxUl = document.createElement('ul');
					this.oComboBoxBody.appendChild(this.oComboBoxUl);
					this.oComboBox.appendChild(this.oComboBoxhead);
					this.oComboBox.appendChild(this.oComboBoxBody);
				};
				ComboBox.prototype._setWidthAndHeight = function() {
					this.oComboBox.style.width = this.param.width + 'px';
					//  设置标签的高度和行高 -------------------------------------
					var tagNameWith = 0;
					if (this.oTagName) {
						this.oTagName.style.height = this.param.height + 'px';
						this.oTagName.style.lineHeight = this.param.height + 'px';
						tagNameWith = this.oTagName.offsetWidth;
					}
					//  这是 oComboxHead的宽度 -------------------------------------
					var marginRight = yluo_DomHandle.getStyleAttr(this.oTagName, 'marginRight');
					marginRight = parseInt(marginRight);
					// 剩下的空间
					var lastWidth = this.param.width - (marginRight + tagNameWith);
					//  要减去边界的宽度
					lastWidth = lastWidth - (this.oComboBoxhead.offsetWidth - this.oComboBoxhead.clientWidth);
					this.oComboBoxhead.style.width = lastWidth + 'px';
					var oComboBoxheadHeight = this.param.height - (this.oComboBoxhead.offsetHeight - this.oComboBoxhead.clientHeight);
					this.oComboBoxhead.style.height = oComboBoxheadHeight + 'px'; // 设置head的高度
					this.oComboBoxhead.style.lineHeight = oComboBoxheadHeight + 'px'; // 设置head的行高
					//  这是 下拉标签的宽度 -------------------------------------
					this.oComboBoxArrow.style.lineHeight = oComboBoxheadHeight + 'px'; // 设置head的行高
					//  -----------------------------
					this.oComboBoxBody.style.left = (this.oComboBoxhead.offsetLeft + 2) + 'px';
					var oComboBoxBodyTop = this.oComboBoxhead.offsetTop + this.oComboBoxhead.offsetHeight;
					//  设置下来体的位置
					this.oComboBoxBody.style.top = oComboBoxBodyTop + 'px';
					var oComboBoxInputWidth = this.oComboBoxhead.clientWidth - 20;
					this.oComboBoxInput.style.width = oComboBoxInputWidth + "px";
					this.oComboBoxInput.style.height = (this.oComboBoxhead.clientHeight - 4) + "px";
					//  这是 下拉的宽度 -------------------------------------
					this.oComboBoxBody.style.width = this.param.dropWidth + 'px';
					this.oComboBoxUl.style.width = this.param.dropWidth + 'px';
				};
				ComboBox.prototype._initController = function() {
					this.oScroller = new yluo_ScrollView({
						obj: this.oComboBoxBody,
						showHorizontal: false
					});
				};
				ComboBox.prototype._initEvent = function() {
					var This = this;
					this.showComboBody = function() {
						This.oScroller.resize();
						yluo_DomHandle.removeEvent(This.oComboBoxBody, 'transitionend', This.showComboBody);
						This.isShowBody = true;
						This.oComboBox.onmouseleave = function() {
							This.oComboBoxBody.style.height = "0";
							yluo_DomHandle.addEvent(This.oComboBoxBody, 'transitionend', This.hideComboBody);
						}
					}
					this.hideComboBody = function() {
						yluo_DomHandle.removeEvent(This.oComboBoxBody, 'transitionend', This.hideComboBody);
						This.oComboBoxBody.style.display = "none";
						This.oComboBox.onmouseleave = null; //  这里注销一下就OK了
						This.isShowBody = false;
					}
					this.oComboBoxUl.onclick = function(event) {
						var oLi = event.target;
						if (oLi.index !== undefined && This.param.selectIndex !== oLi.index) {
							This.setCurIndex(oLi.index);
							This.oComboBoxBody.style.height = "0";
							yluo_DomHandle.addEvent(This.oComboBoxBody, 'transitionend', This.hideComboBody);
							This.param.callback && This.param.callback(oLi.index);
						}
					}
					this.oComboBoxArrow.onclick = function() {
						if (!This.isShowBody) {
							
							if(!This.oComboBoxUl.children[0]){
								return;
							}
							
							This.oComboBoxBody.style.display = "block";
							var showBodyHeight = (This.oComboBoxUl.children[0].offsetHeight *
								This.param.showItems) + 'px';
							This.oComboBoxBody.style.height = showBodyHeight; //  这里通过Item来做吧
							yluo_DomHandle.addEvent(This.oComboBoxBody, 'transitionend', This.showComboBody);
						} else {
							This.oComboBoxBody.style.height = "0";
							yluo_DomHandle.addEvent(This.oComboBoxBody, 'transitionend', This.hideComboBody);
						}
					};
				};
				ComboBox.prototype.insertLi = function(data) {
					var itemNum = this.oComboBoxUl.children.length;
					var oLi = document.createElement("li");
					oLi.index = itemNum;
					oLi.innerHTML = data;
					this.oComboBoxUl.appendChild(oLi);
				};
				ComboBox.prototype.insertLiArray = function(data) {
					var itemNum = this.oComboBoxUl.children.length;
					var insetItemNum = data.length;
					var fragment = document.createDocumentFragment();
					for (var i = 0; i < insetItemNum; i++) {
						var oLi = document.createElement("li");
						oLi.index = itemNum + i;
						oLi.innerHTML = data[i];
						fragment.appendChild(oLi);
					}
					this.oComboBoxUl.appendChild(fragment);
				};
				ComboBox.prototype.append = function(data) { //插入数组
					this.insertLi(data);
				};
				ComboBox.prototype.appendArrary = function(data) { //插入数组
					this.insertLiArray(data);
				}
				ComboBox.prototype.getCurContent = function() {
					return this.getIndexObj(this.getIndex()).innerHTML;
				}
				ComboBox.prototype.getIndexObj = function(index) {
					if (index < 0 || index >= this.oComboBoxUl.children.length)
						return null
					return this.oComboBoxUl.children[index]
				}
				ComboBox.prototype.removeLi = function(index) {
					if (index < 0 || index >= this.oComboBoxUl.children.length) {
						return
					}
					var oLi = this.oComboBoxUl.children[index];
					this.oComboBoxUl.removeChild(oLi);
		
					this.liLength = this.oComboBoxUl.children.length; //li的数量
					this.setCurIndex(0);
					this.oScroller.resize(); //调整滚动条
				};
				
				ComboBox.prototype.removeAll = function() {
					this.oComboBoxUl.innerHTML = "";
					this.oScroller.resize() //调整滚动条
				};
				ComboBox.prototype.setCurIndex = function(index) {
					if (this.param.selectIndex === index) {
						return;
					}
					var chilrenNum = this.oComboBoxUl.children.length;
					if (index < 0 || index >= chilrenNum) {
						return;
					}
					var oLi = this.oComboBoxUl.children[index];
					this.oComboBoxInput.value = oLi.innerHTML;
					this.param.selectIndex = index;
				};
				ComboBox.prototype.getIndex = function() {
					return this.param.selectIndex;
				}
				_extend = function(dest, src) {
					for (key in src) {
						if (src.hasOwnProperty(key)) {
							dest[key] = src[key];
						}
					}
				};
				return ComboBox;
			}());