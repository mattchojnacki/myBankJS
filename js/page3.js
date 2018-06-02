app.controller("Page3", [ "$http", "common", function($http, common) {

    var ctrl = this;

    ctrl.options = {

        chart: {
            type: 'lineChart',
            height: 450,
            margin: { top: 20, right: 90, bottom: 75, left: 50 },
			showValues: false,
            x: function(d) { return new Date(d.date); },
            y: function(d) { return d.after; },
            duration: 500,
            xAxis: {
            	axisLabel: 'Time',
				rotateLabels: 30,
				tickFormat: function(d) { return common.dateFormat(d); },
				showMaxMin: false
			},
            yAxis: {
            	axisLabel: 'Balance',
				axisLabelDistance: -10,
				showMaxMin: false
			},
            xScale: d3.time.scale(),
			interpolate: 'step-before',
			clipEdge: false
        }

    };

    ctrl.data = [
        {
        	key: 'Account balance',
			values: []
        }
	];

    $http.get('/history/').then(function(rep) {
        ctrl.data[0].values = rep.data;
        $http.get('/account').then(function(rep) {
            ctrl.data[0].values.unshift({ date: new Date().toString(), after: rep.data.balance });
        });
    });


}]);