window.onload = function() {

	new yluo_Search("testFuck", function(content) {
		alert(content)
	})
	new yluo_Search("testFuck1")
	new yluo_Search("testFuck2")
}

var yluo_Search = (function() {
	
	function SearchBar(id, callback) {
		this.oOutFrame = document.getElementById(id);

		this.oSearchBtn = null

		this.oSearchInput = null

		this.oOutFrame.style.width = "200px"

		this.oOutFrame.style.height = "28px"

		this.init(callback)
	}

	SearchBar.prototype.init = function(callback) {

		this.oSearchInput = document.createElement("input")

		this.oSearchInput.className = "searchBarInput"

		this.oOutFrame.appendChild(this.oSearchInput)

		this.oSearchBtn = document.createElement("input")

		this.oSearchBtn.type = "button"

		this.oSearchBtn.className = "searchBarBtn"

		this.oSearchBtn.value = "搜 索"

		var oSearchInput = this.oSearchInput;

		this.oSearchBtn.onclick = function() {

			callback && callback(oSearchInput.value)
		}
		this.oOutFrame.appendChild(this.oSearchBtn)
	}
	return SearchBar;
}());