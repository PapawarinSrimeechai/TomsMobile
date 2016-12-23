app.controller('OnTheWayCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state, SessionService, $localStorage, Deviceconfig, DeviceService, WLog, $interval, Languages, APIService, SessionService, Spots, PageService, Shipments) {
    // local Strorage
    $localStorage.lang_page = "TM16";
    $localStorage.spotc_scenario = 6;
    $scope.safematetime = 0;
    // Check Session login
    SessionService.chk_login();
    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });
    APIService.Batch.all();


    //(1) getDBlang(lang_id,lang_page)
    //(2) tb_language_config [array]
    //Languages.getDBlang($localStorage.lang_id, $localStorage.lang_page, function(result){
    Languages.getDBlang($localStorage.lang_id, $localStorage.lang_page, function(result) {
        console.log('############# TM16 getDBlang :');
        console.log(result);
    })

    //(3) getDB_device_config()
    //(4) tb_device_config [array]
    Deviceconfig.getDB_device_config(function(result) {
        console.log('############# TM16 getDB_device_config :');
        console.log(result);
        $scope.safematetime = result[0].devc_safematetime;
        $scope.fecingtime = result[0].devc_fecingtime;
        console.log('safematetime : ' + $scope.safematetime);
        console.log('fecingtime : ' + $scope.fecingtime);

        check_source();
        check_dest();
        startInterval_fecing();

    });

    //(5) Wlog setlog_action(ship_id,spot_id, spotc_scenario [SC06], lang_page [TM16])
    //(6) return Pst. [0,1]
    WLog.setlog_action(null, null, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result) {
        console.log('############# TM16 setlog_action :' + result);
    });

    //(7) P.display ui TM16

    // Header data
    $scope.ShipmentTotal = $localStorage.ShipmentTotal;
    $scope.ship_id = $localStorage.ship_id;
    $scope.spot_sour_name = $localStorage.shipment[$localStorage.spot_seq - 1].spot_sour_name;
    $scope.spot_dest_name = $localStorage.shipment[$localStorage.spot_seq - 1].spot_dest_name;

    //(8) loop open
    var chk_s = 0;
    var chk_d = 0;

    // test btn
    // fn for open loop
    $scope.set_s = function() {
            //startInterval_fecing();
            OnTheWay();
            startInterval_safemate();
        }
        // fn for close loop
    $scope.set_d = function() {
            $scope.stopInterval_fecing();
            $scope.stopInterval_safemate();
        }
        // couter loop
    $scope.a = 0;

    // interval fecing
    var stop_fecing;

    function startInterval_fecing() {
        // Don't start a new interval if we are already
        console.log("startInterval_fecing")
        if (angular.isDefined(stop_fecing)) return;

        stop_fecing = $interval(function() {
            // code
            check_source();
            check_dest();
        }, $scope.fecingtime); // interval time (ms)
    };
    $scope.stopInterval_fecing = function() {
        console.log("stopInterval_fecing");
        if (angular.isDefined(stop_fecing)) {
            $interval.cancel(stop_fecing);
            stop_fecing = undefined;
        }
        $scope.next();
    };
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopInterval_fecing();
    });

    // interval Safemate
    var stop_safemate;

    function startInterval_safemate() {
        // Don't start a new interval if we are already
        console.log("startInterval_safemate")
        if (angular.isDefined(stop_safemate)) return;

        stop_safemate = $interval(function() {
            // code
            OnTheWay();
        }, $scope.safematetime); // interval time (ms)
    };
    $scope.stopInterval_safemate = function() {
        console.log("stopInterval_safemate");
        if (angular.isDefined(stop_safemate)) {
            $interval.cancel(stop_safemate);
            stop_safemate = undefined;
        }
        $scope.next();
    };
    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopInterval_safemate();
    });
    var source_flag = 0;
    function check_source() {
        DeviceService.getPosition(function(coords) {
            console.log(coords)
            Shipments.chkfencing($localStorage.ship_id, $localStorage.ship_spot_id, "S", coords, function(chkfecing_sour) {
                console.log("$$$$$$$$$$$$$$$$$$$$ source return : " + chkfecing_sour)
                if (chkfecing_sour == 0) {
                    if (source_flag != 0) {
                        return; 
                    } else {
                        source_flag = 1;
                        OnTheWay();
                        startInterval_safemate();
                    } 
                }
            })
        })
    }

    function check_dest() {
        DeviceService.getPosition(function(coords) {
            console.log(coords)
            Shipments.chkfencing($localStorage.ship_id, $localStorage.ship_spot_id, "D", coords, function(chkfecing_sour) {
                console.log("$$$$$$$$$$$$$$$$$$$$ dest return : " + chkfecing_sour)
                if (chkfecing_sour == 1) {
                    $scope.stopInterval_fecing();
                    $scope.stopInterval_safemate();
                }
            })
        })
    }

    function OnTheWay() {

        //(11) P.chk_devcie_status()
        $scope.device_status = [0, 0, 0];
        DeviceService.chk_device_status(function(net_status, gps_status, box_status) {
            $scope.device_status[0] = net_status;
            $scope.device_status[1] = gps_status;
            $scope.device_status[2] = box_status;
            //(12) WLog log_device_status(net_status,gps_status,box_status)
            WLog.log_device_status($scope.device_status[1], $scope.device_status[1], $scope.device_status[2], function(a) {});
            $scope.a = $scope.a + 1; //chk interval
            console.log('#################### Interval safemat :' + $scope.a + ' #####################')

            function getTimeStamp() {
                var now = new Date();
                return (now.getDate() + '/' +
                    (now.getMonth() + 1) + '/' +
                    now.getFullYear() + " " +
                    now.getHours() + ':' +
                    ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' +
                    ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds())));
            }
            console.log(getTimeStamp());

            //(13) P. [if chk_device_status !=[111] >> (scxx),else >>(14)]
            // if($scope.device_status[0]==1 && $scope.device_status[1]==1 && $scope.device_status[2]==1){

            //(14) P.getbox_data(truck_id)
            console.log('***************device_status : ' + $scope.device_status);
            APIService.Box.getbox_data($localStorage.truck_id, function(status, JSON_D2) {
                console.log("####################### (14)getbox_data ###################");
                if (status == 1) {
                    for (var i = 0; i < JSON_D2.LogData.length; i++) {
                        JSON_D2.LogData[i].ship_id = 0;
                        JSON_D2.LogData[i].spot_id = 0;
                        JSON_D2.LogData[i].lang_page = $localStorage.lang_page;
                        JSON_D2.LogData[i].spotc_scenario = $localStorage.spotc_scenario;
                        JSON_D2.LogData[i].device_status = $scope.device_status;
                        JSON_D2.LogData[i].domain_id = $localStorage.domain_id;
                        JSON_D2.LogData[i].truck_id = $localStorage.truck_id;
                    }
                    console.log(JSON_D2);

                    WLog.selectindex(function(indextom) {
                        console.log('indextom : ' + indextom);
                        //(15) Wlog setlog_box_data(JSON-D2)
                        //(16) return JSON-D3
                        WLog.setlog_box_data(JSON_D2, indextom, function(status1) {
                            console.log("####################### (15)setlog_box_data ###################");
                            console.log('setlog_box : ' + status1);
                            APIService.Batch.all();

                        }); // WLog.setlog_box_data

                    }); // selectindex
                } else {
                    APIService.Batch.all();

                }
            }); // APIService.Box.getbox_data

            // } //endif

        });

    }
    //(25) loop close


    //$('.on-the-way').click(function() {
    var numnext = 0;
    //$localStorage.onTheWayCase2 =1;

    $scope.next = function() {

        if (numnext > 0) {
            return;
        }
        numnext++;
        if ($localStorage.onTheWayCase2 == null || $localStorage.onTheWayCase2 == undefined) {
            $('.on-the-way').velocity({
                opacity: 0
            }, {
                duration: 300,
                complete: function() {
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true
                    });


                    // Next Page
                    console.log("p rank " + $localStorage.OrderRankSc);
                    Spots.getDBnext_page($localStorage.ship_id, $localStorage.ship_spot_id, $localStorage.OrderRankSc, function(result) {
                        //$localStorage.OrderRankSc = ;
                        console.log("--------------------getDBnext_page ----------------------");
                        console.log("-------------------- scenario " + result[0].spotc_scenario);
                        $localStorage.OrderRankSc = result[0].spotc_seq;
                        $scope.page = PageService.find_pageByscenarioId(result[0].scenario_id);
                        console.log("-------------------- page " + $scope.page);
                        $state.go($scope.page);
                    })
                }
            });

        } else if ($localStorage.onTheWayCase2 == 1) {

            $scope.endMile();
        }

    }

    //});

    // End Mile Modal
    function createEndMileModal() {
        $ionicModal.fromTemplateUrl('end-milecase2.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.endMileModal = modal;
        });
    }
    createEndMileModal();

    $scope.endMile = function() {
        $scope.endMileModal.show();
        $('#end-mile__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    }
    $scope.endMileSave = function(end_mile) {

        $localStorage.onTheWayCase2 = null;
        $localStorage.case_page = null;

        WLog.setlog_mile($localStorage.ship_id, $localStorage.ship_spot_id, end_mile, $localStorage.spotc_scenario, function() {
            WLog.log_updatespot("spot_arrive_mile", $localStorage.ship_id, $localStorage.ship_spot_id, end_mile)
            Spots.updateDBspot("spot_arrive_mile", $localStorage.ship_id, $localStorage.ship_spot_id, end_mile, function(updateDBspot) {
                console.log("==================== updateDBspot status : " + updateDBspot);
                WLog.clearjob(function(cjob_status) {
                    console.log("clearjob status : " + cjob_status);

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
})
