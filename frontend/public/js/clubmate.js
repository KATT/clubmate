var ClubMate = new Class.Singleton({
	
	Postman: {},
	Components: {},
	UIManager: {},
	NetMan: {},
    Settings: {},
    Strings: {},
    DebugA: null,
	DebugB: null,

	initialize: function() {
	},
	
	Init: function() {
		this.UIManager.InitUI();
		this.Components.Init();
	}
});   

var CM = ClubMate;

CM.UIManager = new Class.Singleton({
	initialize: function() {
	},
	
	InitUI: function() {
		
	}
});

CM.Components = new Class.Singleton({
	Init: function() {
		Crafty.c('player', {
			init: function() {
				this.requires('2D, DOM');
			}
		});
	}
});

CM.NetMan = new Class.Singleton({
	Socket : null,
	
	intialize: function () {},
	Init: function () {
		this.Socket = io.connect(CM.Settings.SocketURL)
	}
});

$(document).ready(CM.Init);
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