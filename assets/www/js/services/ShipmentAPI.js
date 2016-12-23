app.factory('ShipmentAPI', function($http, Shipments, Spots, shipmentApi, WLog, $localStorage, DatabaseSQLite) {

            function prepareImageData(input) {
                var output = [];
                for (var i = 0; i < input.LogImage.length; i++) {
                    var tmp = {
                        "ImgData": input.LogImage[i].binaryimage,
                        "Id": parseInt(input.LogImage[i].id),
                        "ShipmentId": parseInt(input.LogImage[i].ship_id),
                        "DropId": parseInt(input.LogImage[i].spot_id),
                        "ScenarioId": parseInt(input.LogImage[i].scenarioID),
                        "ProductCode": input.LogImage[i].pro_code,
                        "DamageCauseId": input.LogImage[i].pro_cause
                    }
                    output.push(tmp);
                }
                return output;
            }


            function setImageToms(json, callback) {
                console.log(json);
                if (json.ReturnCode == 1) {
                    console.log('###PPAPI:::' + 'ShipmentAPI::setImageToms');
                    var method = "SaveImage";
                    var data = prepareImageData(json);
                    console.log('###PPAPI:::' + 'ShipmentAPI::setImageToms: API Connecting....');
                    $http({
                        method: 'POST',
                        url: shipmentApi + method,
                        headers: { 'Content-Type': 'application/json' },
                        params: {
                            domainId: $localStorage.domain_id,
                            userNo: $localStorage.UserNo,
                        },
                        data: data
                    })

                    .success(function(resp) {
                        console.log('###PPAPI:::' + 'ShipmentAPI::setImageToms: Connect To API Success');

                        if (resp.ReturnCode == 0) {

                            console.log('###PPAPI:::' + 'ShipmentAPI::setImageToms: Server OK!!');
                            console.info('###PPAPI:::' + 'ShipmentAPI::setImageToms: ' + resp.Data.length + ' rows inserted!!');

                            for (var i = 0; i < resp.Data.length; i++) {

                                for (var i = 0; i < json.LogImage.length; i++) {

                                    if (json.LogImage[i].id == resp.Data[i].Id) {

                                        json.LogImage[i].sendtom_status = 'C';
                                    }

                                }
                            }
                            callback(1, json);

                        } else {

                            console.warn('###PPAPI:::' + 'ShipmentAPI::setImageToms: Server Error Code:' + resp.ReturnCode);
                            callback(0, null);
                        }

                    })

                    .error(function(err) {
                        console.error('###PPAPI:::' + 'ShipmentAPI::setImageToms: Fail To Connect Server!!');
                        callback(0, null);

                    })
                } else {
                    callback(0, null);
                }
            }


            function getTomsShipmentTotal(domainId, LngId, driver_id, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::getTomsShipmentTotal');
                var method = "GetShipmentTotal";

                $http({
                    method: 'GET',
                    url: shipmentApi + method,
                    params: {
                        domainId: domainId,
                        lngId: LngId,
                        userNo: parseInt(driver_id)
                    }
                })

                .success(function(resp) {
                    console.log('###PPAPI:::' + 'ShipmentAPI::getTomsShipmentTotal: Connect To API Success');

                    if (resp.ReturnCode == 0) {

                        console.log('###PPAPI:::' + 'ShipmentAPI::getTomsShipmentTotal: Server OK!!');
                        console.info('###PPAPI:::' + 'ShipmentAPI::getTomsShipmentTotal: ' + resp.Data.Shipment_Total + ' Shipment Found!!');
                        callback(1, resp.Data.Shipment_Total);

                    } else {

                        console.warn('###PPAPI:::' + 'ShipmentAPI::getTomsShipmentTotal: Server Error Code:' + resp.ReturnCode);
                        callback(0, null);

                    }
                })

                .error(function(err) {

                    console.error('###PPAPI:::' + 'ShipmentAPI::getTomsShipmentTotal: Fail To Connect Server!!');
                    callback(0, null);

                })

            }

            function getTomsShipment(driver_id, driver_domain, truck_id, lang, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::getTomsShipment');
                var method = "GetShipment";

                $http({
                    method: 'POST',
                    url: shipmentApi + method,
                    params: {
                        domainId: driver_domain,
                        LngId: lang,
                        userNo: parseInt(driver_id),
                        LpNo: truck_id
                    }
                })

                .success(function(resp) {
                    console.log('###PPAPI:::' + 'ShipmentAPI::getTomsShipment: Connect To API Success');

                    if (resp.ReturnCode == 0) {
                        console.log('###PPAPI:::' + 'ShipmentAPI::getTomsShipment: Server OK!!');

                        var shipment = resp.Data.Shipment;
                        var spot = resp.Data.Drop;
                        for (i=0;i<spot.length;i++) {
                            spot[i].FreightId=spot[i].DropId;
                            delete spot[i].DropId;
                        }
                        console.info(spot)
                        var product = resp.Data.DropItem;
                        for (i=0;i<product.length;i++) {
                            product[i].FreightId=product[i].DropId;
                            delete product[i].DropId;
                        }
                        var spot_config = resp.Data.ShipmentStep;
                        for (i=0;i<spot_config.length;i++) {
                            spot_config[i].FreightId=spot_config[i].DropId;
                            delete spot_config[i].DropId;
                        }
                        var pre_mile = resp.Data.StartMile;
                        var damage = resp.Data.Damage;
                         for (i=0;i<damage.length;i++) {
                            damage[i].FreightId=damage[i].DropId;
                            delete damage[i].DropId;
                        }
                        var returnable = resp.Data.Returnable;
                         for (i=0;i<returnable.length;i++) {
                            returnable[i].FreightId=returnable[i].DropId;
                            delete returnable[i].DropId;
                        }
                        var numship;

                        //check number of shipment
                        getTomsShipmentTotal(driver_domain, lang, driver_id, function(ReturnCode, data) {

                            //if check total shipment sucesses
                            if (ReturnCode == 1) {

                                callback(1, shipment, spot, product, spot_config, data, pre_mile, damage, returnable);

                            } else {

                                //if check total shipment faile return null
                                callback(1, shipment, spot, product, spot_config, null, pre_mile, damage, returnable);

                            }

                        });

                    } else {

                        callback(0, null, null, null, null, null, null, null, null);
                        console.warn('###PPAPI:::' + 'ShipmentAPI::getTomsShipment: Server Error Code:' + resp.ReturnCode);

                    }
                })

                .error(function(err) {

                    console.error('###PPAPI:::' + 'ShipmentAPI::getTomsShipment: Fail To Connect Server!!');
                    callback(0, null, null, null, null, null, null, null, null);

                })
            }

            function getshipment(driver_id, driver_domain, truck_id, lang, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::getshipment');
                var shipmentId = "0";

                getTomsShipment(driver_id, driver_domain, truck_id, lang,
                    function(returnCode, shipment, spot, product, spot_config, numship, pre_mile, damage, returnable) {

                        if (returnCode == 1) {

                            var shipmentId = shipment.ShipmentId;
                            var ship_numspot = spot.length;

                            WLog.log_getshipment_TOM(driver_id, driver_domain, truck_id, function() {

                                console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: log_getshipment_TOM completed!!');

                            });

                            WLog.setlog_action(shipmentId, null, $localStorage.spotc_scenario, $localStorage.lang_page, numship, pre_mile, null, null, function() {

                                console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: setlog_action completed!!');

                            });

                            Shipments.setDBshipment(shipmentId, driver_id, ship_numspot, 'P', function(returnCode) {

                                if (returnCode == 1) {
                                    console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT shipment to DatabaseSQLite Success!!');
                                } else {
                                    console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT shipment to DatabaseSQLite Fail!!');
                                }

                            });

                            Shipments.setDBprocause(shipmentId, damage, function(returnCode) {
                                if (returnCode == 1) {
                                    console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT ProductCause to DatabaseSQLite Success!!');
                                } else {
                                    console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT ProductCause to DatabaseSQLite Fail!!');
                                }

                            });

                            Shipments.setDBreware(shipmentId, returnable, function(returnCode) {
                                if (returnCode == 1) {
                                    console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Returnable to DatabaseSQLite Success!!');
                                } else {
                                    console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Returnable to DatabaseSQLite Fail!!');
                                }


                            });
                   
                            Spots.setDBspot(spot,pre_mile, function(returnCode) {

                                if (returnCode == 1) {
                                    console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Spots to DatabaseSQLite Success!!');
                                } else {
                                    console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Spots to DatabaseSQLite Fail!!');
                                }

                            });

                            Spots.setDBspot_config(shipmentId, spot_config, 'P', function(returnCode) {

                                if (returnCode == 1) {
                                    console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Spots Config to DatabaseSQLite Success!!');
                                } else {
                                    console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Spots Config to DatabaseSQLite Fail!!');
                                }

                            });

                            Spots.setDBspot_product(shipmentId, product, function(returnCode) {

                                if (returnCode == 1) {
                                    console.info('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Spots Product to DatabaseSQLite Success!!');
                                } else {
                                    console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: INSERT Spots Product to DatabaseSQLite Fail!!');
                                }

                            });

                            callback(shipmentId);

                        } else {

                            console.error('###PPAPI:::' + 'ShipmentAPI::getshipment: Fail To Connect Server!!');
                            callback(0);

                        }

                    });

            }

            function prepareUnloadType(input) {

                var output = [];

                for (var i = 0; i < input.LogUntype.length; i++) {
                    var tmp = {};
                    tmp.Id = input.LogUntype[i].id;
                    tmp.DropId = input.LogUntype[i].spot_id;
                    tmp.LoadType = parseInt(input.LogUntype[i].untype);
                    output.push(tmp);
                }

                return output;
            }


            function actuntype(driver_id, input, callback) {
                console.log('###PPAPI:::' + 'ShipmentAPI::actuntype');
                var data = prepareUnloadType(input);

                var method = "UpdateLoadProductType";
                $http({
                        method: 'POST',
                        url: shipmentApi + method,
                        headers: { 'Content-Type': 'application/json' },
                        params: {
                            domainId: parseInt($localStorage.domain_id),
                            userNo: parseInt(driver_id),
                        },
                        data: data
                    })
                    .success(function(resp) {

                        if (resp.ReturnCode == 0) {
                            for (var i = 0; i < resp.Data.length; i++) {
                                for (var j = 0; j < input.LogUntype.length; j++) {
                                    if (resp.Data[i].Id == input.LogUntype[j].id) {
                                        input.LogUntype[j].sendtom_status = 'C';
                                    }

                                }

                            }
                            console.log('###PPAPI:::' + 'ShipmentAPI::actuntype: Server OK!!');
                            callback(1, input);

                        } else {

                            console.warn('###PPAPI:::' + 'ShipmentAPI::actuntype: Server Error Code:' + resp.ReturnCode);
                            // save local db to try again
                            callback(0, input);

                        }

                    })
                    .error(function(err) {
                        // save local db to try again
                        console.error('###PPAPI:::' + 'ShipmentAPI::actuntype: Fail To Connect Server!!');
                        callback(0, input);

                    })
            }


            function prepareLogSpot(input) {

                var output = [];

                for (var i = 0; i < input.LogSpot.length; i++) {

                    var tmp = {};
                    tmp.Id = input.LogSpot[i].id;
                    tmp.ShipmentId = input.LogSpot[i].ship_id;
                    tmp.DropId = input.LogSpot[i].spot_id;
                    tmp.ScenarioId = input.LogSpot[i].scenarioID;
                    output.push(tmp);

                }

                return output;
            }

            function actspot(driver_id, input, callback) {
                console.log('###PPAPI:::' + 'ShipmentAPI::actspot');
                var data = prepareLogSpot(input);

                var method = "UpdateDropStatus";
                $http({
                        method: 'POST',
                        url: shipmentApi + method,
                        headers: { 'Content-Type': 'application/json' },
                        params: {
                            domainId: parseInt($localStorage.domain_id),
                            userNo: parseInt(driver_id),
                        },
                        data: data
                    })
                    .success(function(resp) {

                        if (resp.ReturnCode == 0) {
                            for (var i = 0; i < resp.Data.length; i++) {
                                for (var j = 0; j < input.LogSpot.length; j++) {
                                    if (resp.Data[i].Id == input.LogSpot[j].id) {
                                        input.LogSpot[j].sendtom_status = 'C';
                                    }

                                }

                            }
                            console.log('###PPAPI:::' + 'ShipmentAPI::actspot: Server OK!!');
                            callback(1, input);

                        } else if (resp.ReturnCode == 2) {
                            console.warn('###PPAPI:::' + 'ShipmentAPI::actspot: duplicate driver!!!');
                            callback(2, input);

                        } else {

                            console.warn('###PPAPI:::' + 'ShipmentAPI::actspot: Server Error Code:' + resp.ReturnCode);
                            // save local db to try again
                            callback(0, input);

                        }

                    })
                    .error(function(err) {
                        // save local db to try again
                        console.error('###PPAPI:::' + 'ShipmentAPI::actspot: Fail To Connect Server!!');
                        callback(0, input);

                    })
            }

            function prepareLogMile(input) {

                var output = [];

                for (var i = 0; i < input.LogMile.length; i++) {

                    var tmp = {};
                    tmp.Id = input.LogMile[i].id;
                    tmp.ShipmentId = input.LogMile[i].ship_id;
                    tmp.DropId = input.LogMile[i].spot_id;
                    tmp.TruckMile = input.LogMile[i].mile;
                    output.push(tmp);

                }

                return output;
            }
            //บอกเลขเริ่มต้นของแต่ละสปอต
            function actstartmile(driver_id, input, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::actstartmile');
                var data = prepareLogMile(input);
                var method = "UpdateTruckMile";

                $http({
                    method: 'POST',
                    url: shipmentApi + method,
                    headers: { 'Content-Type': 'application/json' },
                    params: {
                        domainId: $localStorage.domain_id,
                        userNo: parseInt(driver_id),
                        LPNo: $localStorage.truck_id,
                    },
                    data: data
                })

                .success(function(resp) {

                        if (resp.ReturnCode == 0) {
                            for (var i = 0; i < resp.Data.length; i++) {
                                for (var j = 0; j < input.LogMile.length; j++) {
                                    if (resp.Data[i].Id == input.LogMile[j].id) {
                                        input.LogMile[j].sendtom_status = 'C';
                                    }

                                }

                            }
                            console.log('###PPAPI:::' + 'ShipmentAPI::actstartmile: Server OK!!');
                            callback(1, input);

                        } else {

                            console.warn('###PPAPI:::' + 'ShipmentAPI::actstartmile: Server Error Code:' + resp.ReturnCode);
                            callback(0, input);

                        }

                    })
                    .error(function(err) {

                        console.error('###PPAPI:::' + 'ShipmentAPI::actstartmile: Fail To Connect Server!!');
                        callback(0, input);

                    })
            }

            // JSOND94 = {
            //         "ReturnCode": 1,                            //สถานะการคืนค้า default :1
            //     "LogProCause": [
            //         {
            //             "id":"1",      
            //             "ship_id":"011" ,                    // รหัสของ shipment
            //             "spot_id":"022",                     // รหัสของ spot
            //             "pro_id":"PD01",                    //รหัสสินค้าได้มาจาก TOM
            //             "procause_id":"PC01",               //รหัสสาเหตุสินค้าเสียหายได้มาจาก TOM
            //             "num_procause_bt":"15",             //รหัสสินค้าได้มาจาก TOM
            //             "num_procause_pk":"15",             //รหัสสินค้าได้มาจาก TOM
            //             "senarioid":"9"        ,             // รหัส senario
            //             "sendtom_status":"P"   ,             //ได้มาจาก app เป็นการบอกว่า serTOM รับแล้วยัง [P,C] [not null]
            //             "timestamp":"2016-07-26 10:22:00.000"   // timestamp ของ database
            //         }
            //         ]};
            function prepareProductBroke(input) {

                var output = [];

                for (var i = 0; i < input.LogProCause.length; i++) {

                    var tmp = {};
                    tmp.Id = input.LogProCause[i].id;
                    tmp.ShipmentId = input.LogProCause[i].ship_id;
                    tmp.DropId = input.LogProCause[i].spot_id;
                    tmp.DamageCauseId = input.LogProCause[i].procause_id * 1;
                    tmp.ProductCode = input.LogProCause[i].pro_code;
                    tmp.SaleUnitQty = input.LogProCause[i].num_procause_bt * 1;
                    tmp.BaseUnitQty = input.LogProCause[i].num_procause_pk * 1;
                    output.push(tmp);

                }

                return output;
            }
            //บอกเลขเริ่มต้นของแต่ละสปอต
            function actproductBroke(driver_id, input, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::actproductBroke');
                var data = prepareProductBroke(input);
                var method = "SaveDamage";
                console.error(data);
                console.warn(data);
                $http({
                    method: 'POST',
                    url: shipmentApi + method,
                    headers: { 'Content-Type': 'application/json' },
                    params: {
                        domainId: $localStorage.domain_id,
                        userNo: parseInt(driver_id)
                    },
                    data: data
                })

                .success(function(resp) {

                    if (resp.ReturnCode == 0) {
                        for (var i = 0; i < resp.Data.length; i++) {
                            for (var j = 0; j < input.LogProCause.length; j++) {
                                if (resp.Data[i].Id == input.LogProCause[j].id) {
                                    input.LogProCause[j].sendtom_status = 'C';
                                }

                            }

                        }
                        console.log('###PPAPI:::' + 'ShipmentAPI::actproductBroke: Server OK!!');
                        callback(1, input);

                    } else {

                        console.warn('###PPAPI:::' + 'ShipmentAPI::actproductBroke: Server Error Code:' + resp.ReturnCode);
                        callback(0, input);

                    }
                })

                .error(function(err) {

                    console.error('###PPAPI:::' + 'ShipmentAPI::actproductBroke: Fail To Connect Server!!');
                    callback(0, input);

                })
            }

            function prepareOTP(input) {
                console.warn(input);
                var output = [];

                for (var i = 0; i < input.LogOtp.length; i++) {

                    var tmp = {};
                    tmp.Id = input.LogOtp[i].id;
                    tmp.ShipmentId = input.LogOtp[i].ship_id;
                    tmp.DropId = input.LogOtp[i].spot_id;
                    tmp.DamageCauseId = input.LogOtp[i].procause_id * 1;
                    tmp.ProductCode = input.LogOtp[i].pro_code;
                    tmp.SaleUnitQty = input.LogOtp[i].num_procause_bt * 1;
                    tmp.BaseUnitQty = input.LogOtp[i].num_procause_pk * 1;
                    output.push(tmp);

                }

                return output;
            }
            //บอกเลขเริ่มต้นของแต่ละสปอต
            function actOTP(driver_id, input, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::actOTP');
                var data = prepareOTP(input);
                var method = "OTP";

                $http({
                    method: 'POST',
                    url: shipmentApi + method,
                    headers: { 'Content-Type': 'application/json' },
                    params: {
                        domainId: $localStorage.domain_id,
                        userNo: parseInt(driver_id)
                    },
                    data: data
                })

                .success(function(resp) {

                    if (resp.ReturnCode == 0) {
                        for (var i = 0; i < resp.Data.length; i++) {
                            for (var j = 0; j < input.LogOtp.length; j++) {
                                if (resp.Data[i].Id == input.LogOtp[j].id) {
                                    input.LogOtp[j].sendtom_status = 'C';
                                }

                            }

                        }
                        console.log('###PPAPI:::' + 'ShipmentAPI::actOTP: Server OK!!');
                        callback(1, input);

                    } else {

                        console.warn('###PPAPI:::' + 'ShipmentAPI::actOTP: Server Error Code:' + resp.ReturnCode);
                        callback(0, input);

                    }
                })

                .error(function(err) {

                    console.error('###PPAPI:::' + 'ShipmentAPI::actOTP: Fail To Connect Server!!');
                    callback(0, input);

                })
            }

            function prepareReturnable(input) {
                     var output = [];
                    for (var i = 0; i < input.LogReware.length; i++) {
                        var tmp = {};
                        tmp.Id = input.LogReware[i].id * 1;
                        tmp.EquipmentId = input.LogReware[i].rew_id * 1;
                        tmp.ShipmentId = input.LogReware[i].ship_id * 1;
                        tmp.DropId = input.LogReware[i].spot_id * 1;
                        tmp.ScenarioId = input.LogReware[i].senarioid * 1;
                        tmp.Qty = input.LogReware[i].num_rew * 1;

                        output.push(tmp);

                    }

                    return output;
                }
                //บอกเลขเริ่มต้นของแต่ละสปอต
                function actReturnable(driver_id, input, callback) {

                    console.log('###PPAPI:::' + 'ShipmentAPI::actReturnable');
                    var data = prepareReturnable(input);
                    var method = "SaveReturnable";

                    $http({
                        method: 'POST',
                        url: shipmentApi + method,
                        headers: { 'Content-Type': 'application/json' },
                        params: {
                            domainId: $localStorage.domain_id,
                            userNo: parseInt(driver_id)
                        },
                        data: data
                    })

                    .success(function(resp) {

                        if (resp.ReturnCode == 0) {
                            for (var i = 0; i < resp.Data.length; i++) {
                                for (var j = 0; j < input.LogReware.length; j++) {
                                    if (resp.Data[i].Id == input.LogReware[j].id) {
                                        input.LogReware[j].sendtom_status = 'C';
                                    }

                                }

                            }
                            console.log('###PPAPI:::' + 'ShipmentAPI::actReturnable: Server OK!!');
                            callback(1, input);

                        } else {

                            console.warn('###PPAPI:::' + 'ShipmentAPI::actReturnable: Server Error Code:' + resp.ReturnCode);
                            callback(0, input);

                        }
                    })

                    .error(function(err) {

                        console.error('###PPAPI:::' + 'ShipmentAPI::actReturnable: Fail To Connect Server!!');
                        callback(0, input);

                    })
                }

                function checkOTP(driver_id,OTP, callback) {

                console.log('###PPAPI:::' + 'ShipmentAPI::checkOTP');
             
                var method = "CheckOTP";

                $http({
                    method: 'POST',
                    url: shipmentApi + method,
                    params: {
                        domainId: $localStorage.domain_id*1,
                        userNo: parseInt(driver_id),
                        shipmentId:$localStorage.ship_id*1,
                        DropId:$localStorage.ship_spot_id*1,
                        OTP:OTP
                    }
                })

                .success(function(resp) {

                    if (resp.ReturnCode == 0) {
                       
                        console.log('###PPAPI:::' + 'ShipmentAPI::checkOTP: Server OK!!');
                        console.log('###PPAPI:::' + 'ShipmentAPI::checkOTP: OTP Correct');
                        callback(1);

                    } else if(resp.ReturnCode == 1){

                        console.log('###PPAPI:::' + 'ShipmentAPI::checkOTP: Server OK!!');
                        console.warn('###PPAPI:::' + 'ShipmentAPI::checkOTP: OTP Wrong!!');
                        callback(2);
                    }else {

                        console.warn('###PPAPI:::' + 'ShipmentAPI::checkOTP: Server Error Code:' + resp.ReturnCode);
                        callback(0);

                    }
                })

                .error(function(err) {

                    console.error('###PPAPI:::' + 'ShipmentAPI::checkOTP: Fail To Connect Server!!');
                    callback(0);

                })
            }



                return {
                    actmile: actstartmile,
                    getshipment: getshipment,
                    getShipmentTotal: getTomsShipmentTotal,
                    actspot: actspot,
                    setImageToms: setImageToms,
                    actuntype: actuntype,
                    actproductBroke: actproductBroke,
                    actOTP:actOTP,
                    actReturnable: actReturnable,
                    checkOTP: checkOTP
                };

            })
