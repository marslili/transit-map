$(document).ready(function(){
    var linesPool = (function() {
        var linesData = {
            '11_22': [
                '47.416739,8.5501539',
                '47.411599,8.5438883'
            ],
            '22_3': [
                '47.411599,8.5438883',
                '47.409101,8.5386526',
                '47.398790,8.5324299',
                '47.393009,8.5293400'
            ],
            '3_4': [
                '47.393009,8.5293400',
                '47.387837,8.5261213',
                '47.384583,8.5206282',
                '47.381735,8.5225165',
                '47.381253,8.5270587',
                '47.378057,8.5402338'
            ],
            '4_5': [
                '47.378057,8.5402338',
                '47.375064,8.5437957'
            ]
        };
        
        function draw() {
            $.each(linesData, function(k1, lineData) {
                var lineCoords = [];
                $.each(lineData, function(k2, p) {
                    var pParts = p.split(',');
                    lineCoords.push(new google.maps.LatLng(parseFloat(pParts[0]), parseFloat(pParts[1])));
                });
                var lineMap = new google.maps.Polyline({
                  path: lineCoords,
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 2,
                  map: map
                });
            });
        }
        
        return {
            draw: draw
        }
    })();
    var helpers = (function(){
        function hm2m(hm) {
            var hmParts = hm.split(':');
            return parseInt(hmParts[0], 10)*60 + parseInt(hmParts[1], 10);
        }
        function m2hm(m) {
            function pad2Dec(what) {
                var strNotPadded = '0' + what;
                return strNotPadded.substring(strNotPadded.length - 2);
            }
            
            var hS = pad2Dec(Math.floor(m/60));
            var mS = pad2Dec(m - (parseInt(hS, 10)*60));
            return hS + ':' + mS;
        }
        
        return {
            hm2m: hm2m,
            m2hm: m2hm
        }
    })();

    function Vehicle(data) {
        this.stations = data.stations;
        this.depM = [];
        this.arrM = [];
        // TODO - optimize introduce passedSteps
        for (var i in data.departures) {
            this.depM.push(helpers.hm2m(data.departures[i]));
            this.arrM.push(helpers.hm2m(data.arrivals[i]));
        }
    }
    Vehicle.prototype.render = function(hm) {
        var nowM = helpers.hm2m(hm);
        if (nowM < this.depM[0]) {
            // The vehicle will run later; 
            // This condition should be present on the serverside 
            //      when returning the current objects
            // For now: do nothing
            console.log(hm + ' Will start at ' + helpers.m2hm(this.depM[0]));
            return;
        }
        if (nowM > this.arrM[(this.arrM.length - 1)]) {
            // The vehicle ran earlier; 
            // This condition should be present on the serverside 
            //      when returning the current objects
            // For now: do nothing
            console.log(hm + ' Finished at ' + helpers.m2hm(this.arrM[(this.arrM.length - 1)]));
            return;
        }
        for (var i=0; i<this.arrM.length; i++) {
            if (nowM < this.arrM[i]) {
                if (nowM > this.depM[i]) {
                    console.log(hm + '      ' + this.stations[i] + ' ---- ' + this.stations[i+1]);
                } else {
                    // The vehicle is in a station
                    console.log(hm + ' Station ' + this.stations[i]);                    
                }
                break;
            }
        }
    };
    
    var start = new google.maps.LatLng(47.378057, 8.5402338);
    var myOptions = {
      zoom: 15,
      center: start,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    linesPool.draw();
    
    var vehicleData = {
        stations: [11,22,3,4,5],
        departures: ['10:10','10:13','10:17','10:23'],
        arrivals: ['10:12','10:17','10:20','10:25']
    };
    
    var v1 = new Vehicle(vehicleData);
    console.log(v1);
    v1.render('08:30');
    v1.render('10:11');
    v1.render('10:12');
    v1.render('10:15');
    v1.render('10:17');
    v1.render('10:18');
    v1.render('10:22');
    v1.render('10:24');
    v1.render('10:45');
});