app.factory('DeviceService', function($cordovaNetwork, $cordovaGeolocation, $ionicPlatform, $cordovaDevice) {
    var net_status = 0;
    var gps_status = 0;
    var box_status = 1;
    // Check for Device connection
    function chk_device_status(callback) {
        if (window.cordova) {
            document.addEventListener("deviceready", function() {
                var netOnline = $cordovaNetwork.isOnline();
                if (netOnline) {
                    net_status = 1;
                    chk_gps()
                        // chk();
                } else {
                    net_status = 0;
                    chk_gps()
                        // chk();
                }
            }, true);
            // running on device/emulator
        } else {
            // running in dev mode
            net_status = 1;
            chk_gps()
        }


        function chk_gps() {
            $ionicPlatform.ready(function() {
                var posOptions = {
                    timeout: 10000,
                    enableHighAccuracy: false
                };
                $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function(position) {
                        //lat = position.coords.latitude;
                        gps_status = 1;
                        chk();
                    }, function(err) {
                        //error
                        gps_status = 0
                        console.log('getCurrentPosition error: ' + angular.toJson(err));
                        chk();
                    });
            });
        }

        function chk() {

            callback(net_status, gps_status, box_status);
        }
    }

    // Check Device Infomation
    function get_device_info(callback) {
        var flag = 0;
        document.addEventListener("deviceready", function() {
            var device = $cordovaDevice.getDevice();
            flag = 1;
            callback(device.manufacturer, device.model, device.serial, device.uuid);
        }, true);
        if (flag == 0)
            callback("web12345", "web12345", "web12345", "web12345");
    }

    function getPosition(callback) {
        var resp = {lat:null,lng:null};
        $ionicPlatform.ready(function() {
                var posOptions = {
                    timeout: 10000,
                    enableHighAccuracy: false
                };
                $cordovaGeolocation.getCurrentPosition(posOptions)
                    .then(function(position) {
                        resp.lat = position.coords.latitude;
                        resp.lng = position.coords.longitude;
                        callback(resp);
                    }, function(err) {
                        //error
                        callback(resp);
                        console.log('getCurrentPosition error: ' + angular.toJson(err));
                    });
            });

    }

    return {
        chk_device_status: chk_device_status,
        get_device_info: get_device_info,
        getPosition: getPosition
    };
})
