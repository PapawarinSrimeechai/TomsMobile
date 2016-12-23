app.controller('LoadProductCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state, SessionService, camera,APIService,$localStorage,PageService,DeviceService,Languages,Deviceconfig,WLog,ShipmentAPI,Spots,PageService) {
// Check Session login
    SessionService.chk_login();

    APIService.Batch.all();

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // local Strorage
    $localStorage.lang_page = "TM21";
    $localStorage.spotc_scenario = 7;

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
                    console.log('######## TM21 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM21', function(result) {
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




    $scope.loadproduct = function(untype) {

        console.log($localStorage.ship_id +" "+$localStorage.ship_spot_id+" "+untype+" "+$localStorage.spotc_scenario);
        WLog.setlog_untype($localStorage.ship_id,$localStorage.ship_spot_id,untype,$localStorage.spotc_scenario,function(status){
            console.log("setlog_untype : "+status );
        })

        $('.delivery, #delivery-confirm__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {

                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                // Next Page Config
                Spots.getDBnext_page($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.OrderRankSc, function(result){
                    //$localStorage.OrderRankSc = ;
                    console.log("--------------------getDBnext_page ----------------------");
                    console.log("-------------------- scenario "+result[0].spotc_scenario);
                    $localStorage.OrderRankSc = result[0].spotc_seq;
                    $scope.page = PageService.find_pageByscenarioId(result[0].scenario_id);
                    $state.go($scope.page);
                }) 
            }
        });
    };
})