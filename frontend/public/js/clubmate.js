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
	
	return {
		Init: function () {
			Socket = io.connect(CM.Settings.SocketURL);
			Socket.on('stateUpdate', function (response) {
				var entity = CM[response.entityType];
				entity['on' + response.action](response.data);
			});
		}
	}
} ();

CM.Player = new Class({
	Implements: [Options, Events],
	options: {
		alias: 'Anon',
		x: 0,
		y: 0,
	},
	initialize: function(options) {
		this.setOptions(options);
	},
});

CM.Player.extend({
	onNew: function(data) {
		CM.State.Player = new CM.Player(data);
	},
	onUpdate: function(data) {}
})


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