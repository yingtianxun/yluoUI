var yluo_DomHandle = (function() {
	var outPutMethod = {
		addEvent: function(element, eventType, callback) {
			if (window.addEventListener) {
				addEvent = function(element, eventType, callback) {
					element.addEventListener(eventType, callback, false);
				}
			} else if (window.attachEvent) {
				addEvent = function(element, eventType, callback) {
					element.attachEvent('on' + eventType, callback);
				}
			} else {
				addEvent = function(element, eventType, callback) {
					element['on' + eventType] = callback;
				}
			}
			addEvent(element, eventType, callback);
		},
		removeEvent: function(element, eventType, callback) {
			if (window.removeEventListener) {
				removeEvent = function(element, eventType, callback) {
					element.removeEventListener(eventType, callback);
				}
			} else if (window.detachEvent) {
				removeEvent = function(element, eventType, callback) {
					element.detachEvent('on' + eventType, callback);
				}
			} else {
				element['on' + eventType] = null;
			}
			removeEvent(element, eventType, callback);
		},

		onScroll: function(element, callback) {
			// 这里统一,下负数,上正数
			var handle = function(event) {
				if (event.type === 'DOMMouseScroll') { // 火狐滚动
					// 下 : 正数,上 : 负数	
					callback(event.detail < 0 ? 1 : -1);
				} else if (event.type === 'mousewheel') { // chrome IE 滚动
					// 下 : 负数,上 : 正数	
					callback(event.wheelDelta > 0 ? 1 : -1);
				}
				event.preventDefault();
			};
			outPutMethod.addEvent(element, "mousewheel", handle);
			outPutMethod.addEvent(element, "DOMMouseScroll", handle);
			
			outPutMethod.removeScorll = function(element) {
				outPutMethod.removeEvent(element, "mousewheel", handle);
				outPutMethod.removeEvent(element, "DOMMouseScroll", handle);
			}
		}

	}
	return outPutMethod;
}());