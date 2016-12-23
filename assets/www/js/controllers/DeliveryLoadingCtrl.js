app.controller('DeliveryLoadingCtrl',  function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state,SessionService,APIService,$localStorage,PageService,DeviceService,Languages,Deviceconfig,WLog,ShipmentAPI,Spots,PageService) {

    
    // Check Session login
    SessionService.chk_login();

    APIService.Batch.all();

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // local Strorage
    $localStorage.lang_page = "TM23";
    $localStorage.spotc_scenario = 8;


    // Header data
    $scope.ShipmentTotal = $localStorage.ShipmentTotal;
    $scope.ship_id = $localStorage.ship_id;
    $scope.spot_sour_name = $localStorage.shipment[$localStorage.spot_seq - 1].spot_sour_name;
    $scope.spot_dest_name = $localStorage.shipment[$localStorage.spot_seq - 1].spot_dest_name;

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
                    console.log('######## TM23 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM23', function(result) {
        console.log("$localStorage.lang_id," + $localStorage.lang_id)
        console.log(result);
        // $scope.lb1sc04 = result[0].lang_word; //"Shipment No."
        // $scope.lb2sc04 = result[1].lang_word; // "รับ"
        // $scope.lb3sc04 = result[2].lang_word; // "ส่ง"
        // $scope.lb4sc04 = result[3].lang_word; // "จอดรถ-ดับเครื่อง-เก็บกุญแจ"
        // $scope.lb5sc04 = result[4].lang_word; // "จอดรถ-ดึงเบรคมือ-เบรคทาง"
        // $scope.lb6sc04 = result[5].lang_word; // "จอดรถ-ลงจากรถ-หมุนล้อ  "
        // $scope.lb7sc04 = result[6].lang_word; // "กดปุ่ม "
        // $scope.lb8sc04 = result[7].lang_word; // "เมื่อเริ่มขึ้นสินค้า "
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

    $scope.confirmModal = function(){

              // (11.0) updateDBspot("spot_status",ship_id,spot_id,[SL]  //(62) return Pst. [0,1]
        Spots.updateDBspot("spot_status", $localStorage.ship_id, $localStorage.ship_spot_id, "EUS", function(updateDBspot_status) {
            console.log("('============ updateDBspot_status " + updateDBspot_status);
            if (updateDBspot_status == 1) {
                // (11.1) setlog_spot(ship_id,spot_id,spot_status) // (11.2) return Pst. [0,1]
                WLog.setlog_spot($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.spotc_scenario, function(setlog_spot_status) {
                    console.log("('============ setlog_spot_status " + setlog_spot_status);

                })

            }
        })

        $('#delivery-loading__start-btn').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                //$scope.modalBroken.remove();
                //createCheckBrokenModal();

                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                $state.go('app.delivery-loading-take-photo');
            }
        });
    }

})