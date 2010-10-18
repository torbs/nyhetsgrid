(function($){
	// Function namespace for Aftenposten		  
	MNO = {
		common: {
			init:function () {
				
				},
			finalize : function(){
					for (i in MNO) {
						if (i !='common') {
							MNO[i].finalize();
						}
					}
				}
		}
	};

	var UTIL = { 
		fire : function(func,funcname, args){
			var namespace = MNO;  // indicate your obj literal namespace here
			funcname = (funcname === undefined) ? 'init' : funcname;
			if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
				namespace[func][funcname](args);
			} 
		  }, 
		  loadEvents : function(){
				var bodyId = document.body.id;
				// hit up common first.
				UTIL.fire('common');
				// Fetch and run scroipts based on body class
				var bodyClass = document.body.className.split(/\s+/);
				var numScripts = bodyClass.length;
				$.each(bodyClass,function(i,classnm){
					if (classnm) {
						$.getScript('js/'+classnm+'.js', function() {
	  						UTIL.fire(classnm);
							UTIL.fire(classnm,bodyId);
							numScripts--;
							if (numScripts == 0) {
								UTIL.fire('common','finalize');						
							}
						});				
					}
				});
		  }
	}; 	
	
	/*Event handeling*/
	
	var cache = {};

	$.publish = function(topic, args){
		// summary: 
		//		Publish some data on a named topic.
		// topic: String
		//		The channel to publish on
		// args: Array?
		//		The data to publish. Each array item is converted into an ordered
		//		arguments on the subscribed functions. 
		//
		// example:
		//		Publish stuff on '/some/topic'. Anything subscribed will be called
		//		with a function signature like: function(a,b,c){ ... }
		//
		//	|		$.publish("/some/topic", ["a","b","c"]);
		if (cache[topic]) {
			$.each(cache[topic], function(){
				this.apply($, args || []);
			});
		};
	};

	$.subscribe = function(topic, callback){
		// summary:
		//		Register a callback on a named topic.
		// topic: String
		//		The channel to subscribe to
		// callback: Function
		//		The handler event. Anytime something is $.publish'ed on a 
		//		subscribed channel, the callback will be called with the
		//		published array as ordered arguments.
		//
		// returns: Array
		//		A handle which can be used to unsubscribe this particular subscription.
		//	
		// example:
		//	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//
		if(!cache[topic]){
			cache[topic] = [];
		};
		cache[topic].push(callback);
		return [topic, callback]; // Array
	};

	$.unsubscribe = function(handle){
		// summary:
		//		Disconnect a subscribed function for a topic.
		// handle: Array
		//		The return value from a $.subscribe call.
		// example:
		//	|	var handle = $.subscribe("/something", function(){});
		//	|	$.unsubscribe(handle);
		
		var t = handle[0];
		cache[t] && $.each(cache[t], function(idx){
			if(this == handle[1]){
				cache[t].splice(idx, 1);
			};
		});
	};

	$(document).ready(UTIL.loadEvents);
})(window.jQuery);
