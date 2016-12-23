app.controller('OtpCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state, SessionService, $localStorage, APIService, DeviceService, Languages, Deviceconfig, WLog, Spots, PageService, ShipmentAPI,Shipments) {
    // Check Session login
    SessionService.chk_login();

    APIService.Batch.all();

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // local Strorage
    $localStorage.lang_page = "TM32";
    $localStorage.spotc_scenario = 10;

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
                    console.log('######## TM32 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM32', function(result) {
        console.log("$localStorage.lang_id," + $localStorage.lang_id);
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

    // Spots.getDBspot_otp($localStorage.ship_id, $localStorage.ship_spot_id, function(otp){
    //         $scope.otp = otp;
    //         console.log("OTP TOMs is "+otp);
    // })

    $scope.chk_otp = function(userotp) {
        console.log("User OTP is " + userotp);
        ShipmentAPI.checkOTP($scope.driver_id, userotp, function(checkOTP_status) {

            console.log("checkOTP_status : " + checkOTP_status);

            if (checkOTP_status == 1) {
                WLog.setlog_otp($localStorage.ship_id, $localStorage.ship_spot_id, $scope.otp, $localStorage.spotc_scenario, function(setlog_otp) {
                    console.log("setlog_otp is " + setlog_otp)
                })
                $scope.containerReturnModal();
            } else if (checkOTP_status == 2) {
                // รหัสผ่านผิด
                $scope.alertErrModal();
            } else if (checkOTP_status == 0) {
                // ไม่มีการเชื่อมต่ออินเตอร์เน็ต
                $scope.alertErrModal();
            }
        })

    }


    // Confirm Modal
    function createContainerReturnModal() {
        $ionicModal.fromTemplateUrl('container-return.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }
    createContainerReturnModal();

    $scope.containerReturnModal = function() {


        $scope.modal.show();
        $('#container-return-confirm__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    };

    $scope.containerReturnYes = function() {
        $('.choose-customer, #container-return-confirm__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();

                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                //$state.go('app.container-return-list');
                // Next Page Config
                Spots.getDBnext_page($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.OrderRankSc, function(result) {
                    //$localStorage.OrderRankSc = ;
                    console.log("--------------------getDBnext_page ----------------------");
                    console.log("-------------------- scenario " + result[0].spotc_scenario);
                    $localStorage.OrderRankSc = result[0].spotc_seq;
                    $scope.page = PageService.find_pageByscenarioId(result[0].scenario_id);
                    $state.go($scope.page);
                })
            }
        });
    };

    $scope.containerReturnNo = function() {
        $('#container-return-confirm__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createContainerReturnModal();
            }
        });
    };


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


        $('#container-return-confirm__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createContainerReturnModal();
            }
        });

        $scope.endMileModal.show();
        $('#end-mile__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    }

    $scope.endMileSave = function(end_mile) {

        WLog.setlog_mile($localStorage.ship_id, $localStorage.ship_spot_id, end_mile, $localStorage.spotc_scenario, function() {
            WLog.log_updatespot("spot_arrive_mile", $localStorage.ship_id, $localStorage.ship_spot_id, end_mile)
            Spots.updateDBspot("spot_arrive_mile", $localStorage.ship_id, $localStorage.ship_spot_id, end_mile, function(updateDBspot) {
                console.log("==================== updateDBspot status : " + updateDBspot);
                WLog.clearjob(function(cjob_status) {
                    console.log("clearjob status : " + cjob_status);
                    Spots.getDBnextjob($localStorage.ship_id, function(case_page) {

                        $localStorage.case_page = case_page;
                        console.log("********************** getDBnextjob : " + $localStorage.case_page)

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

    // Alert Ship Err
    function createAlertErrModal() {
        $ionicModal.fromTemplateUrl('Err-alert.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modalerr = modal;
        });
    }
    createAlertErrModal()

    $scope.alertErrModal = function() {
        $scope.modalerr.show();
        $('#Err-alert__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    };

    $scope.alertErrHide = function() {
        $('#Err-alert__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modalerr.remove();
                createAlertErrModal()
            }
        });
    };
})
