app.controller('StartCtrl', function($scope, $ionicHistory, $ionicPopup, $state, $ionicModal, $interval, PageService, $localStorage, SessionService, DeviceService, WLog, APIService, ShipmentAPI, Languages, Deviceconfig, Shipments, Spots) {
    //--------------------------TM03------------------------------------//
    // Check Session login
    SessionService.chk_login();

    APIService.Batch.all();
    // ใช้ใน SC9
    $localStorage.broken_list = [];
    $localStorage.broken_images = [];
    $localStorage.temp_rew = [];


    // local Strorage
    $localStorage.lang_page = "TM03";
    $localStorage.spotc_scenario = 3;
    $localStorage.OrderRankSc = -1;

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });


    $scope.driver_name = $localStorage.driver_name;
    $scope.driver_ssn = $localStorage.driver_ssn;
    $scope.truck_id = $localStorage.truck_id;

    // (1) P.chk_devcie_status()
    $scope.device_status = [0, 0, 0]
    DeviceService.chk_device_status(function(net_status, gps_status, box_status) {
        console.log('######## TM03 chk_device_status :' + net_status + ' ' + gps_status + ' ' + box_status);
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
                    console.log('######## TM03 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM03', function(result) {
        $scope.lb1sc03 = result[0].lang_word; //"ตรวจสภาพรถ-ก่อนการใชงาน"
        $scope.lb2sc03 = result[1].lang_word; //"ระดับแอลกอฮอล์ ต้องเป็น 0"
        $scope.lb3sc03 = result[2].lang_word; // "กดปุ่ม"
        $scope.lb4sc03 = result[3].lang_word; // "เพื่อตรวจสอบงาน"
    })

    // (5) getDB_device_config()
    // (6) tb_device_config [array]
    Deviceconfig.getDB_device_config(function(result) {
        //$localStorage.lang_id = result[0].devc_lang_id;
        $scope.driver_id = result[0].devc_driver_id;
        $localStorage.domain_id = result[0].devc_driver_domain;
        $scope.truck_id = result[0].devc_truck_id;
        $localStorage.no_image = result[0].no_image;

        ShipmentAPI.getShipmentTotal($localStorage.domain_id, $localStorage.lang_id, $scope.driver_id, function(status, resp) {
            if (status == 1) {
                $scope.ShipmentTotal = resp;
                $localStorage.ShipmentTotal = resp;
            } else {
                $scope.ShipmentTotal = 0;
                $localStorage.ShipmentTotal = 0;
            }
        })


    })

    // if have old spot (case 1)
    if ($localStorage.case_page != undefined || $localStorage.case_page != null) {
        if ($localStorage.case_page == 1) {
            console.log("case_page 1");

            Languages.getDBlang($localStorage.lang_id, 'TM04', function(result) {
                console.log('############# getDBlang :');
                $scope.lb7sc03 = result[2].lang_word; // "รับสินค้า"
                $scope.lb8sc03 = result[3].lang_word; // "ส่งสินค้า"
                $scope.lb9sc03 = result[4].lang_word; // "Shipment No."
                $scope.lb10sc03 = result[5].lang_word; // "เริ่มงาน"
            })


            ShipmentAPI.getShipmentTotal($localStorage.domain_id, $localStorage.lang_id, $scope.driver_id, function(status, resp) {
                if (status == 1) {
                    $scope.ShipmentTotal = resp;
                    $localStorage.ShipmentTotal = resp;
                } else {
                    $scope.ShipmentTotal = 0;
                    $localStorage.ShipmentTotal = 0;
                }
            })

            Spots.getDBspot($localStorage.ship_id, function(resp) {
                console.log(resp)
                    // (39) Wlog log_getspot(spot_id[])
                WLog.log_getspot(resp);
                $scope.items = resp;
                $localStorage.shipment = resp;
            })

            $('#start-div').velocity({
                //translateY: 50,
                opacity: 0
            }, {
                duration: 300,
                complete: function() {
                    $('#start-div').remove();
                    $('#list-item').velocity({
                        opacity: 1
                    }, {
                        duration: 300
                    });
                }
            });

        }
    }


    // (21) P.display ui TM03


    //--------------------------TM04------------------------------------//

    // Check list button
    var ckklist_btn = false;
    $scope.checkList = function() {
        console.log(ckklist_btn)
        if (ckklist_btn == true) {
            return;
        }

        ckklist_btn = true;
        // (7) getshipment(driver_id,driver_domain,truck_id)
        // (14) return Pst. [0,ship_id]

        APIService.Batch.all();
        if ($localStorage.case_page != undefined || $localStorage.case_page != null) {
            if ($localStorage.case_page == 2) {
                console.log("case_page 2");
                ShipmentAPI.getShipmentTotal($localStorage.domain_id, $localStorage.lang_id, $scope.driver_id, function(status, resp) {
                    // status=1;
                    // resp = 0;
                    if (status == 1) {
                        $scope.ShipmentTotal = resp;
                        $localStorage.ShipmentTotal = resp;
                        if (resp == 0) {
                            $localStorage.case_page = undefined; // reset
                            $localStorage.onTheWayCase2 = 1;
                            $state.go('app.on-the-way');
                        } else {
                            Shipment();
                        }
                    } else {
                        $scope.ShipmentTotal = 0;
                        $localStorage.ShipmentTotal = 0;
                        //alert('get Shipment Error');
                        ckklist_btn = false;
                        $scope.alertErrModal();
                    }
                })
            }
        } else {
            Shipment();
        }

    }

    //
    function Shipment() {
        ShipmentAPI.getshipment($scope.driver_id, $localStorage.domain_id, $scope.truck_id, $localStorage.lang_id, function(resp) {
            console.log('######## getshipment ########')
            console.log(resp);
            if (resp != 0) {
                ckklist_btn = false;
                // (15) P.declar [ship_id]
                ShipmentAPI.getShipmentTotal($localStorage.domain_id, $localStorage.lang_id, $scope.driver_id, function(status, numship) {

                    if (status == 1) {
                        $scope.ShipmentTotal = numship;
                        $localStorage.ShipmentTotal = numship;

                        $localStorage.ship_id = resp;

                        // (16) WLog log_revshipmet_TOM(ship_id)
                        WLog.log_revshipment_TOM($localStorage.ship_id)
                            // (17.1) getlog_action()
                            // (18) log_action [array]
                        WLog.getlog_action(function(resp) {
                            console.log('######## getlog_action')

                            // (19) Wlog setlog_action: function(ship_id, spot_id, spotc_scenario, lang_page, numship, pre_mile, tokenlogin, lastsend_tom_record, callback)
                            // (20) return Pst. [0,1]
                            WLog.setlog_action($localStorage.ship_id, null, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result) {
                                console.log('######## WLog setlog_action : ' + result);
                            })

                        })

                        Languages.getDBlang($localStorage.lang_id, 'TM04', function(result) {
                            console.log('############# getDBlang :');
                            $scope.lb7sc03 = result[2].lang_word; // "รับสินค้า"
                            $scope.lb8sc03 = result[3].lang_word; // "ส่งสินค้า"
                            $scope.lb9sc03 = result[4].lang_word; // "Shipment No."
                            $scope.lb10sc03 = result[5].lang_word; // "เริ่มงาน"
                        })

                        // (23) actshipment(ship_id,driver_id) -->  function actspot(driver_id, input, callback)
                        // (24) return Pst. [0,1]

                        WLog.setlog_spot($localStorage.ship_id, 0, 3, function(resp) {
                            console.log('============ setlog_spot ' + resp)

                        })


                        // (25) setDBship_status(ship_id,ship_status[A],ship_spot_id [null])
                        // (26) return Pst. [0,1]
                        Shipments.setDBship_status($localStorage.ship_id, 'P', null, null, function(resp) {
                            console.log('######## setDBship_status status: ' + resp);
                        })

                        // (27) Wlog log_ship_status(ship_id,ship_status,ship_spot_id)
                        WLog.log_ship_status($localStorage.ship_id, 'P', null)

                        // (28) P. direct to ui TM04

                        // (34) Wlog setlog_action(ship_id,spot_id, spotc_scenario [SC03], lang_page [TM04])
                        // (35) return Pst. [0,1]
                        WLog.setlog_action($localStorage.ship_id, null, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result) {
                            console.log('########  WLog setlog_action :' + result);
                        })

                        // (36) P.display ui TM04

                        // (37) getDBspot(ship_id)
                        // (38) tb_spot_ship [array]
                        Spots.getDBspot($localStorage.ship_id, function(resp) {
                            console.log(resp)
                                // (39) Wlog log_getspot(spot_id[])
                            WLog.log_getspot(resp);
                            $scope.items = resp;
                            $localStorage.shipment = resp;
                            $localStorage.case_page = 1;
                        })

                        $('#start-div').velocity({
                            //translateY: 50,
                            opacity: 0
                        }, {
                            duration: 300,
                            complete: function() {
                                $('#start-div').remove();
                                $('#list-item').velocity({
                                    opacity: 1
                                }, {
                                    duration: 300
                                });
                            }
                        });

                    } else {
                        $scope.ShipmentTotal = 0;
                        $localStorage.ShipmentTot
                    }
                })
            } else {
                //alert('get Shipment Error');
                ckklist_btn = false;
                $scope.alertErrModal();
            }
        })
    }

    // Mile Modal
    function createMileModal() {
        $ionicModal.fromTemplateUrl('setup-mile.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modalMile = modal;
        });
    }
    createMileModal();

    //--------------------------TM05------------------------------------//
    $scope.mileShow = function() {

        APIService.Batch.all();

        Languages.getDBlang($localStorage.lang_id, 'TM05', function(result) {
            console.log('############# TM05 getDBlang :');
            $scope.lb11sc03 = result[0].lang_word; // "ระบุเลขไมล์รถก่อนเริ่มงาน"
            $scope.lb12sc03 = result[1].lang_word; // "บันทึก"
            $scope.lb13sc03 = result[2].lang_word; // "ยกเลิก"
        })

        Shipments.getDBship_status($localStorage.ship_id, function(resp) {
            console.log($scope.items)
            console.log(resp);
            $scope.spot_seq = 0;
            if (resp[0].spot_seq != null && (resp[0].spot_seq < resp[0].ship_numspot)) {
                $scope.spot_seq = parseInt(resp[0].spot_seq) + 1;
                $scope.mile = $scope.items[($scope.spot_seq) - 1].spot_start_mile;
                $localStorage.spot_seq = $scope.spot_seq;
                console.log('seq (1) ' + $scope.spot_seq)
            } else if (resp[0].spot_seq < resp[0].ship_numspot) {
                $scope.spot_seq++;
                $scope.mile = $scope.items[($scope.spot_seq) - 1].spot_start_mile;
                console.log('seq (2) ' + $scope.spot_seq)
                $localStorage.spot_seq = $scope.spot_seq;
            }
        });

        $scope.modalMile.show();
        $('#mile__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    };

    $scope.mileHide = function() {
        $('#mile__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modalMile.remove();
                createMileModal();
            }
        });
    };

    $scope.mileSave = function(mile) {

        // (40) bt_spot (click)

        Shipments.getDBship_status($localStorage.ship_id, function(resp) {
            $scope.spot_seq = 0;
            if (resp[0].spot_seq != null && (resp[0].spot_seq < resp[0].ship_numspot)) {
                $scope.spot_seq = parseInt(resp[0].spot_seq) + 1;
                $scope.ship_spot_id = $scope.items[($scope.spot_seq) - 1].spot_id;
                TM05($scope.spot_seq, $scope.ship_spot_id);
                console.log('spot id (1) ' + $scope.ship_spot_id)
            } else if (resp[0].spot_seq < resp[0].ship_numspot) {
                $scope.spot_seq++;
                $scope.ship_spot_id = $scope.items[($scope.spot_seq) - 1].spot_id;
                TM05($scope.spot_seq, $scope.ship_spot_id);
                console.log('spot id (2)' + $scope.ship_spot_id)
            }
        });


        function TM05(spot_seq, ship_spot_id) {
            // (41) actspot(ship_id,spot_id,driver_id)
            // (42) return Pst. [0,1]

            WLog.setlog_spot($localStorage.ship_id, ship_spot_id, 3, function(resp) {
                console.log('============ setlog_spot ' + resp)

            })


            // (43) P.declar [spot_id]
            $localStorage.ship_spot_id = ship_spot_id;

            // (44) setDBship_status(ship_id,ship_status[A],ship_spot_id [null])
            // (45) return Pst. [0,1]
            Shipments.setDBship_status($localStorage.ship_id, 'A', spot_seq, ship_spot_id, function(resp) {
                    console.log('setDBship_status status: ' + resp)
                })
                // (46) Wlog log_ship_status(ship_id,ship_status,ship_spot_id)
            WLog.log_ship_status($localStorage.ship_id, 'A', ship_spot_id)
                // (47) Wlog setlog_action(ship_id,spot_id, spotc_scenario [SC03], lang_page [TM05])
                // (48) return Pst. [0,1]
            WLog.setlog_action($localStorage.ship_id, ship_spot_id, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result) {
                    console.log('######## 5 WLog setlog_action :' + result);
                })
                // (49) P.direct to ui TM05
                // (59) actstartmile(ship_id,spot_id,driver_id,txt_start_mile)
                // (60) return Pst. [0,1]
            WLog.setlog_mile($localStorage.ship_id, ship_spot_id, mile, $localStorage.spotc_scenario, function(resp) {

                console.log('============ setlog_mile ' + resp)


            })

            // (61) updateDBspot("spot_start_mile",ship_id,spot_id, txt_start_mile)
            // (62) return Pst. [0,1]
            Spots.updateDBspot("spot_start_mile", $localStorage.ship_id, ship_spot_id, mile, function(status) {
                console.log('mile' + mile);
                console.log('######## updateDBspot status : ' + status);
            })

            // (63) Wlog log_updatespot("spot_start_mile",ship_id,spot_id, txt_start_mile)
            WLog.log_updatespot("spot_start_mile", $localStorage.ship_id, ship_spot_id, mile);
            // (64) P. direct to ui TM06 [SC04]

            $localStorage.case_page = undefined;

        }





        $('.start, #mile__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modalMile.remove();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                Spots.getDBnext_page($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.OrderRankSc, function(result) {
                    //$localStorage.OrderRankSc = ;
                    console.log(result);
                    console.log("--------------------getDBnext_page ----------------------");
                    console.log("-------------------- scenario " + result[0].spotc_scenario);
                    $localStorage.OrderRankSc = result[0].spotc_seq;
                    $scope.page = PageService.find_pageByscenarioId(result[0].scenario_id);
                    $state.go($scope.page);
                })

                //$state.go('app.broken-take-photo');

            }
        });
    };

    // Alert Ship Err
    function createAlertShipmentErrModal() {
        $ionicModal.fromTemplateUrl('getShipmentErr-alert.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }
    createAlertShipmentErrModal()

    $scope.alertErrModal = function() {
        $scope.modal.show();
        $('#getShipmentErr-alert__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    };

    $scope.alertErrHide = function() {
        $('#getShipmentErr-alert__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createAlertShipmentErrModal()
            }
        });
    };

})
