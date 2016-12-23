app.controller('ContainerReturnListCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state, SessionService, $localStorage, APIService, DeviceService, Languages, Deviceconfig, WLog, Spots, PageService, Shipments) {

    // Check Session login
    SessionService.chk_login();

    APIService.Batch.all();

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // local Strorage
    $localStorage.lang_page = "TM34";
    $localStorage.spotc_scenario = 11;


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
                    console.log('######## TM34 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM34', function(result) {
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
        $localStorage.lang_id = result[0].devc_lang_id;
        $scope.driver_id = result[0].devc_driver_id;
        $localStorage.domain_id = result[0].devc_driver_domain;
        $scope.truck_id = result[0].devc_truck_id;
    })

    // (7) Wlog setlog_action(ship_id, spot_id, spotc_scenario, lang_page, numship, pre_mile, tokenlogin, lastsend_tom_record, callback)
    // (8) return Pst. [0,1]
    WLog.setlog_action($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result) {
        console.log('######## WLog setlog_action : ' + result);
    })

    //get_returnWare
    Shipments.getDBreware($localStorage.ship_id, $localStorage.ship_spot_id, function(reware) {
        $scope.rewares = reware;
        console.log(reware)
        for (var i = 0; i < $scope.rewares.length; i++) {
            $scope.rewares[i].rank = i;
            try {
                $scope.rewares[i].num_rew = $localStorage.temp_rew[i].num_rew;
                console.log("my tryyyyyyyyyyyyy");
                if ($localStorage.temp_rew[i].num_rew == undefined) {
                    $scope.rewares[i].num_rew = 0;
                }
            } catch (err) {
                $scope.rewares[i].num_rew = 0;
                console.log("my catchhhhhhhhhhh");
            }

        }
    })

    // Broken Amount Modal
    function createContainerReturnAmountModal() {
        $ionicModal.fromTemplateUrl('container-return-amount.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }
    createContainerReturnAmountModal();

    // เลือก return ware
    $scope.containerReturnAmount = function(rew_id, rank) {

        $scope.rew_id = rew_id;
        $scope.rank = rank;

        $scope.modal.show();
        $('#container-return-amount__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    }

    $scope.containerReturnAmountHide = function() {
        $('#container-return-amount__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createContainerReturnAmountModal();
            }
        });
    };

    $scope.containerReturnAmountSave = function(num_rew) {
        console.log(num_rew);

        if (num_rew == undefined) { num_rew = 0; }
        $scope.rewares[$scope.rank].num_rew = num_rew;
        if (num_rew != 0) {
            $localStorage.temp_rew[$scope.rank] = {
                "ship_id": $localStorage.ship_id,
                "spot_id": $localStorage.ship_spot_id,
                "rew_id": $scope.rew_id,
                "num_rew": num_rew
            }
        } else {
            $localStorage.temp_rew[$scope.rank] = [];
        }

        console.log($localStorage.temp_rew);

        $('#container-return-amount__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createContainerReturnAmountModal();
            }
        });
    };

    $scope.brokenDone = function() {
        $('.container-return').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                $state.go('app.choose-customer');
            }
        });
    }

    // End Mile Modal
    function createEndMileModal() {
        $ionicModal.fromTemplateUrl('end-mile.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.endMileModal = modal;
        });
    }
    createEndMileModal();

    $scope.endMile = function() {

        Spots.getDBspot($localStorage.ship_id, function(resp) {
            $scope.items = resp;
        })

        Shipments.getDBship_status($localStorage.ship_id, function(resp) {
            console.log(resp)
            $scope.mile = $scope.items[($localStorage.spot_seq) - 1].spot_start_mile;
        });


        $scope.endMileModal.show();
        $('#end-mile__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    }
    $scope.endMileSave = function(end_mile) {

        for (var i = 0; i < $localStorage.temp_rew.length; i++) {
            try {
                if ($localStorage.temp_rew[i].length != 0) {
                    var ship_id = $localStorage.temp_rew[i].ship_id;
                    var spot_id = $localStorage.temp_rew[i].spot_id;
                    var num_rew = $localStorage.temp_rew[i].num_rew;
                    var rew_id = $localStorage.temp_rew[i].rew_id;
                    console.log("==============tryyyyyyyyyyyyyy");
                    WLog.setlog_returnware(ship_id, spot_id, rew_id, num_rew, $localStorage.spotc_scenario, function(log_rew) {
                        console.log("==============log reware : " + log_rew);
                    })
                }

            } catch (err) {
                console.error("ERR " + err);
            }
        }

        WLog.setlog_mile($localStorage.ship_id, $localStorage.ship_spot_id, end_mile, $localStorage.spotc_scenario, function() {
            WLog.log_updatespot("spot_arrive_mile", $localStorage.ship_id, $localStorage.ship_spot_id, end_mile)
            Spots.updateDBspot("spot_arrive_mile", $localStorage.ship_id, $localStorage.ship_spot_id, end_mile, function(updateDBspot) {
                console.log("==================== updateDBspot status : " + updateDBspot);
                WLog.clearjob(function(cjob_status) {
                    console.log("clearjob status : " + cjob_status);
                    Spots.getDBnextjob($localStorage.ship_id, function(case_page) {

                        $localStorage.case_page = case_page;
                        console.log("********************** getDBnextjob : "+$localStorage.case_page)

                        $('.container-return, #end-mile__modal').velocity({
                            opacity: 0
                        }, {
                            duration: 300,
                            complete: function() {
                                $scope.endMileModal.remove();
                                createEndMileModal();

                                $state.go('app.start');
                            }
                        });

                    })
                })
            })

        })
    }

    $scope.endMileHide = function() {
        $('#end-mile__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.endMileModal.remove();
                createEndMileModal();
            }
        });
    }
});
