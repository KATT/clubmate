var CM = function() {
	var Init = function() {
		this.getInstance().UIManager.InitUI();
		this.Components.Init();
	};
	return {
		Components: {},
		UIManager: {},
		NetMan: {},
	    Settings: {},
	    Strings: {},
	    DebugA: null,
		DebugB: null
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
} ());

ClubMate.NetMan = function() {
	Socket : null,
	
	return {
		Init: function () {
			this.Socket = io.connect(CM.Settings.SocketURL)
		}
	}
} ();

window.addEvent('domready', ClubMate.Init);
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