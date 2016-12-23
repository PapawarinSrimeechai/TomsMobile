app.controller('BrokenTakePhotoCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state, SessionService, camera,APIService,$localStorage,PageService,DeviceService,Languages,Deviceconfig,WLog,ShipmentAPI,Spots,PageService) {

   // Check Session login
    SessionService.chk_login();

    APIService.Batch.all();

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // local Strorage
    $localStorage.lang_page = "TM29";
    $localStorage.spotc_scenario = 9;

    // Header data
    $scope.ShipmentTotal = $localStorage.ShipmentTotal;
    $scope.ship_id = $localStorage.ship_id;
    $scope.spot_sour_name = $localStorage.shipment[$localStorage.spot_seq-1].spot_sour_name;
    $scope.spot_dest_name = $localStorage.shipment[$localStorage.spot_seq-1].spot_dest_name;

    // (1) P.chk_devcie_status()
    $scope.device_status = [0, 0, 0]
    DeviceService.chk_device_status(function(net_status, gps_status, box_status) {
        $scope.device_status[0] = net_status;
        $scope.device_status[1] = gps_status;
        $scope.device_status[2] = box_status;
        // (2) WLog log_device_status(net_status,gps_status,box_status)
        WLog.log_device_status($scope.device_status[1], $scope.device_status[1], $scope.device_status[2], function(a) {});
        // (2.1) P. [if chk_device_status[111] not_equal >> (scxx),equal >>(3)]
        if ($scope.device_status[0] == 1 && $scope.device_status[1] == 1 && $scope.device_status[2] == 1) {
            //(2.2) getchktom()
            APIService.AppConfig.getchktom(function(TOMs_status) {
                    // (2.4) return chk_tom [0,1]
                    $scope.TOMs_status = TOMs_status;
                    console.log('######## TM29 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM29', function(result) {
        console.log("$localStorage.lang_id,"+$localStorage.lang_id);
        console.log(result);
        // $scope.lb9sc04 = result[0].lang_word; // "**กรุณาถ่ายภาพสินค้าที่เสียหาย**"
        // $scope.lb10sc04 = result[1].lang_word; // "บันทึก"
        // $scope.lb11sc04 = result[2].lang_word; // "ยกเลิก"
    })

    // (5) getDB_device_config()
    // (6) tb_device_config [array]
    Deviceconfig.getDB_device_config(function(result) {
        //$localStorage.lang_id = result[0].devc_lang_id;
        $scope.driver_id = result[0].devc_driver_id;
        $localStorage.domain_id = result[0].devc_driver_domain;
        $scope.truck_id = result[0].devc_truck_id;
    })

    // (7) Wlog setlog_action(ship_id, spot_id, spotc_scenario, lang_page, numship, pre_mile, tokenlogin, lastsend_tom_record, callback)
    // (8) return Pst. [0,1]
    WLog.setlog_action($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result) {
        console.log('######## WLog setlog_action : ' + result);
    })
    var JSON_D17_Pre={
        ReturnCode:"1", 
        LogImage:[]
    }

    //header
    $scope.broken_product = $localStorage.broken_product;

    // (13) P.capture image
    //$scope.photo = 'img/broken-bottle.jpg';take-photo
    $scope.photo = 'img/take-photo.jpg';
    $scope.round = $localStorage.no_image;
    $scope.n = 1;   // 3 Phothos
    $scope.takePhoto = function() {
        if($scope.n <= $scope.round ){
            if( $scope.n == $scope.round){$scope.n++;}
            camera.takePhoto(function(img_src) {
                    $scope.photo = img_src;
                    var binaryimage = img_src.replace("data:image/jpeg;base64,","");
                    var tmp={
                        "id" : "",
                        "ship_id" : $localStorage.ship_id,
                        "spot_id" : $localStorage.ship_spot_id,
                        "binaryimage" : binaryimage,
                        "sendtom_status" : "P",
                        "timestamp" : "",
                        "scenarioID" : $localStorage.spotc_scenario,
                        "pro_id" : "",
                        "pro_cause" : "",
                        "pro_code" : ""
                    }
                    JSON_D17_Pre.LogImage.push(tmp);
                    
                    $localStorage.broken_images[$localStorage.broken_list_OrderRank - 1] = JSON_D17_Pre;
                    console.log("================broken_images=================");
                    console.log($localStorage.broken_images);


                    if( $scope.n<$scope.round){
                        $scope.n++;
                    } 
            });
        }
    }



    $scope.brokenTakePhotoCancel = function() {
        // reset
        JSON_D17_Pre={
            ReturnCode:"1", 
            LogImage:[]
        }
        $localStorage.broken_images[$localStorage.broken_list_OrderRank - 1] = JSON_D17_Pre;
        console.log("================clear broken_images=================");
        console.log($localStorage.broken_images);


        $scope.photo = 'img/take-photo.jpg';
        $scope.n = 1;


        $('.broken-take-photo').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                $state.go('app.broken-reason');
            }
        });
    };

    $scope.brokenTakePhotoSave = function() {

        $('.broken-take-photo').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                $state.go('app.broken-list');
            }
        });
    };
})
