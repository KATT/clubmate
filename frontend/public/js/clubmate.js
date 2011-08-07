var CM = function() {
	var Init = function() {
		CM.UIManager.InitUI();
		CM.Components.Init();
		CM.NetMan.Init();
	};
	return {
		Components: {},
		UIManager: {},
		NetMan: {},
	    Settings: {},
	    Strings: {},
		State: {},
	    DebugA: null,
		DebugB: null,
		
		Init: Init
	};
} ();   
CM.UIManager = function() {
	return {
		InitUI: function() {
					
		}
	};
}();

CM.Components = function() {
	return {
		Init: function() {
			Crafty.c('player', {
				init: function() {
					this.requires('2D, DOM');
				}
			});
		}
	};
} ();

CM.NetMan = function() {
	var Socket  = null;
	
	var EntityTypes;
	var Actions;
	
	return {
		Init: function () {
			EntityTypes = CM.Enums.EntityTypes;
			Actions = CM.Enums.Actions;
			
			Socket = io.connect(CM.Settings.SocketURL);
			Socket.on('stateUpdate', function (response) {
				switch(response.entityType) {
					case EntityTypes.Player:
						switch(response.action) {
							case Actions.New:
								CM.State.Player = response.data;
								break;
						}
						break;
					case EntityTypes.Map:
						switch(response.action) {
							case Actions.New:
								CM.State.Map = response.data;
								break;
						}
						break;
					case EntityTypes.Objects:
						break;
					default:
						break;
				
				}
			});
		}
	}
} ();

window.addEvent('domready', CM.Init);
/*GetHome.Postman = function() {
	var ns = GetHome;
	
	var Actions = {
		GetProviders: 10
	};
	
	function ResponseHandler(response) {
        if(response.success) {
            try {
                switch(response.action) {
					case Actions.GetProviders:
						ns.ProviderManager.HandleLoadProvidersResult(response.data);
                    default:
                        break;
                }
            } catch(e) {
				if(console.info) {
                	console.info(e);
				}
            }
        }
    };
    
    function DoRequest(page, action, params) {
        dojo.xhrPost({
            type: 'POST',
            url: ns.Settings.SiteRoot + '/' + page + '/' + action + '/',
            handleAs: 'json',
            content: params,
            load: function(response, ioArgs) {
                ResponseHandler(response);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                ns.DebugA = textStatus;
                ns.DebugB = errorThrown;
				if(console.info) {
					console.info(ns.Strings.GeneralError + errorThrown );
				}
            }
        })
    };

	return {
		ResponseHandler: ResponseHandler,
        DoRequest: DoRequest
    };
} (); */