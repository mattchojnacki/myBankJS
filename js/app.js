var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngWebSocket', 'ngAnimate', 'nvd3', 'ui.bootstrap']);

app.value('globals', { alert: { type: 'info', message: '' } });

app.service('common', ['$http', 'globals', function($http, globals) {

    this.dateFormat = function(dateStr) {
        var d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    }

    this.getSession = function(callback) {
        $http.get('/auth').then(
            function(response) {
                if(!globals.session.id) {
                    globals.session = response.data;
                }
                callback(response.data);
            },
            function(err) {
                callback({});
            }
        );
    }

    this.statusName = function(status) {
        const statusNames = [ 'not-started', 'started', 'in-tests', 'completed', 'cancelled'];
        return status >= 0 && status < statusNames.length ? statusNames[status] : 'unknown';
    }

    this.confirm = { text: '?', action: function() {
            $("#confirmDialog").modal('hide');
        }};

}]);

app.factory('ws', ['$websocket', 'globals', function($websocket, globals) {

    var dataStream = $websocket('ws://' + window.location.host);

    dataStream.onMessage(function(msg) {

        try {
            var data = JSON.parse(msg.data);
            globals.alert.type = data.type;
            globals.alert.message = data.message;
        } catch(err) {}

    });

    return {

        init: function(session) {
            dataStream.send(JSON.stringify({ session: session }));
        }
    }

}]);


