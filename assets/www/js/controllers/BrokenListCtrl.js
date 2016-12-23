app.controller('BrokenListCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state, SessionService, $localStorage, APIService, DeviceService, Languages, Deviceconfig, WLog, Spots, PageService) {

    // Check Session login
    SessionService.chk_login();

    APIService.Batch.all();

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // local Strorage
    $localStorage.lang_page = "TM26";
    $localStorage.spotc_scenario = 9;


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
                    console.log('######## TM26 TOMs_status :' + $scope.TOMs_status);
                })
                // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    });

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, 'TM26', function(result) {
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


    Spots.getDBspot_product($localStorage.ship_id, $localStorage.ship_spot_id, function(products) {
        console.log(products);
        $scope.products = products;

        for (var i = 0; i < $scope.products.length; i++) {
            try {

                $scope.products[i].num_procause_bt = $localStorage.broken_list[i].pro_num_bt;
                $scope.products[i].num_procause_pk = $localStorage.broken_list[i].pro_num_pk;
                console.log($localStorage.broken_list[i].pro_num_bt)
                if($localStorage.broken_list[i].pro_num_bt == undefined && $localStorage.broken_list[i].pro_num_pk == undefined){
                    $scope.products[i].num_procause_bt = 0;
                    $scope.products[i].num_procause_pk = 0;
                }
                console.log("tryyyyyyyyyyyyy");
            } catch (err) {
                $scope.products[i].num_procause_bt = 0;
                $scope.products[i].num_procause_pk = 0;
                console.log("catchhhhhhhhhhh");
            }

        }

    });


    // Broken Amount Modal
    function createBrokenAmountModal() {
        $ionicModal.fromTemplateUrl('setup-broken-amount.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }
    createBrokenAmountModal();


    // broken-list
    $scope.brokenAmount = function(pro_id, pro_code, OrderRank) {
        $scope.broken_product = $scope.products[OrderRank - 1];
        $scope.pro_id = pro_id;
        $scope.pro_code = pro_code;
        $localStorage.broken_list_OrderRank = OrderRank;

        $scope.modal.show();
        $('#broken-amount__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    }

    // ยกเลิก จำนวนลัง
    $scope.brokenAmountHide = function() {
        $('#broken-amount__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createBrokenAmountModal();
            }
        });
    };

    // บันทึก จำนวนลัง
    $scope.brokenAmountSave = function(pro_num_pk, pro_num_bt) {
        if (pro_num_pk == undefined) { pro_num_pk = 0 }
        if (pro_num_bt == undefined) { pro_num_bt = 0 }

        $scope.products[$localStorage.broken_list_OrderRank - 1].num_procause_bt = pro_num_bt;
        $scope.products[$localStorage.broken_list_OrderRank - 1].num_procause_pk = pro_num_pk;

        if (pro_num_pk != 0 || pro_num_bt != 0) {
            $scope.pro_num_pk = pro_num_pk;
            $scope.pro_num_bt = pro_num_bt;
            $localStorage.broken_list[$localStorage.broken_list_OrderRank - 1] = {
                "pro_id": $scope.pro_id,
                "pro_name": $scope.broken_product.pro_name,
                "pro_num_pk": $scope.pro_num_pk,
                "pro_num_bt": $scope.pro_num_bt,
                "pro_cause": "",
                "pro_code": $scope.pro_code,
                "OrderRank": $localStorage.broken_list_OrderRank
            }
            $localStorage.broken_product = $localStorage.broken_list[$localStorage.broken_list_OrderRank - 1];
            console.log($localStorage.broken_list);

            $('.broken-list, #broken-amount__modal').velocity({
                opacity: 0
            }, {
                duration: 300,
                complete: function() {
                    $scope.modal.remove();
                    $ionicHistory.nextViewOptions({
                        disableAnimate: true
                    });

                    $state.go('app.broken-reason');
                }
            });

        } else {
            //delete broken product
            $localStorage.broken_list[$localStorage.broken_list_OrderRank - 1] = [];
            console.log("================delete broken_list=================");
            console.log($localStorage.broken_list);

            // delete image
            var JSON_D17_Pre = {
                ReturnCode: "0",
                LogImage: []
            }
            $localStorage.broken_images[$localStorage.broken_list_OrderRank - 1] = JSON_D17_Pre;
            console.log("================delete broken_images=================");
            console.log($localStorage.broken_images);

            $scope.brokenAmountHide();

        }
    };

    // เสร็จสิ้น
    $scope.brokenDone = function() {

        for (var i = 0; i < $localStorage.broken_list.length; i++) {

            try{
                if ($localStorage.broken_list[i].length != 0) {
                    console.log($localStorage.broken_list[i]);
                    var pro_id = $localStorage.broken_list[i].pro_id;
                    var pro_code = $localStorage.broken_list[i].pro_code;
                    var procause_id = $localStorage.broken_list[i].pro_cause;
                    var num_procause_bt = $localStorage.broken_list[i].pro_num_bt;
                    var num_procause_pk = $localStorage.broken_list[i].pro_num_pk;
                    WLog.setlog_procause($localStorage.ship_id, $localStorage.ship_spot_id, pro_id, procause_id, pro_code, num_procause_bt, num_procause_pk, function(log_procause) {
                        console.log("setlog_procause : " + log_procause);
                    })
                }
            }catch(err){
                console.error("ERR "+err);
            }
        }
        for (var i = 0; i < $localStorage.broken_images.length; i++) {
            try{
                if ($localStorage.broken_images[i].LogImage.length == $localStorage.no_image) {
                    for (var j = 0; j < $localStorage.broken_images[i].LogImage.length; j++) {

                        $localStorage.broken_images[i].LogImage[j].pro_code = $localStorage.broken_list[i].pro_code;
                        $localStorage.broken_images[i].LogImage[j].procause_id = $localStorage.broken_list[i].pro_cause;
                        $localStorage.broken_images[i].LogImage[j].pro_id = $localStorage.broken_list[i].pro_id;
                    }
                }
                WLog.setlog_image($localStorage.broken_images[i], function(setlog_image_status) {
                    console.log("======== setlog_image_status " + setlog_image_status);
                })
            }catch(err){
                console.error("ERR "+err);
            }
        }
        $('.broken-list').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

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
    }
})
