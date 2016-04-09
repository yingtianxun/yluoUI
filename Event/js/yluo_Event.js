var yluo_Event = (function(){
	var eventMap = {};
	function Subscribe(msgType,handle){
		if(!eventMap[msgType]){
			eventMap[msgType] = [];
		} 
		eventMap[msgType].push(handle)
	}
	function Publish(msgType,data){		
		var handles = eventMap[msgType]	
		if(handles){
			for (k in handles) {
				handles[k](data)
			}
		}
	}	
	return {
		Subscribe : Subscribe,
		Publish   : Publish
	}
}());
