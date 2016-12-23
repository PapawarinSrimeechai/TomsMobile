
app.factory('AppConfigAPI', function($http, DatabaseSQLite, appConfigApi, $localStorage, Deviceconfig, Languages, WLog, md5, Shipments) {


    function getDeviceId(band, model, serialno, uuid, callback) {

        console.log('###PPAPI:::' + 'AppConfigAPI::getDeviceId');
        var method = "GetDeviceId";

        $http({
            method: 'POST',
            url: appConfigApi + method,
            params: {
                band: band,
                model: model,
                serialno: serialno,
                uuid: uuid
            }
        })

        .success(function(resp) {

            if (resp.ReturnCode == 0 || resp.ReturnCode == 2) {

                console.log('###PPAPI:::' + 'AppConfigAPI::getDeviceId: Server OK!!');
                Deviceconfig.updateDB_device_config("devc_dev_id", resp.Data.DeviceId, function() {

                });

                callback(1, resp.Data.DeviceId);

            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::getDeviceId: Server Error Code:' + resp.ReturnCode);
                callback(0, null);

            }
        })

        .error(function(err) {

            console.error('###PPAPI:::' + 'AppConfigAPI::getDeviceId: Fail To Connect Server!!');
            callback(0, null);

        })
    }

    function getTOMlogin(driver_id, truck_id, pin_code, callback) {
        console.log('###PPAPI:::' + 'AppConfigAPI::getTOMlogin');

        var method = "CheckLogin";
        $http({
            method: 'POST',
            url: appConfigApi + method,
            params: {
                userId: driver_id,
                LPNo: truck_id,
                pinCode: pin_code
            }
        })

        .success(function(resp) {
            if (resp.ReturnCode == '0') {

                console.log('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Server OK!!');
                $localStorage.UserNo = resp.Data.UserNo;
                $localStorage.domain_id = resp.Data.DomainId;
                $localStorage.truck_id = resp.Data.LPNo;
                $localStorage.driver_name = resp.Data.UserName;
                $localStorage.driver_ssn = resp.Data.SSNO;

                Shipments.setDBdriver(resp.Data.UserId, resp.Data.UserName, function(data) {

                    if (data == 1) {

                        console.log('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Set Driver Profile success');

                    } else {

                        console.warn('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Set Driver Profile failed');

                    }
                    Deviceconfig.updateDB_device_config("devc_driver_id", resp.Data.UserNo, function(data) {

                        if (data == 1) {

                            console.log('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Set DriverNo success');

                        } else {

                            console.warn('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Set DriverNo failed');

                        }
                        callback(1);
                    });
                });



            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Server Error Code:' + resp.ReturnCode);
                callback(0);

            }
        })

        .error(function(err) {

            console.warn('###PPAPI:::' + 'AppConfigAPI::getTOMlogin: Fail To Connect Server!!');
            loginOffline(pin_code,truck_id,$localStorage.uuid,driver_id,function(data){
                callback(data);
            });
        })
    }

    function loginOffline(pin_code,truck_id,uuid,driver_id,callback) {
        console.log('###PPAPI:::' + 'AppConfigAPI::loginOffline: Try to offline login');
        var txt_user = driver_id.concat(pin_code, truck_id, uuid);
        var tokenlogin = md5.createHash(txt_user);

        WLog.getlog_action(function(data) {

            if (data[0].tokenlogin == tokenlogin) {

                console.log('###PPAPI:::' + 'AppConfigAPI::loginOffline: Login offline success');
                callback(1);

            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::loginOffline: Login offline failed');
                callback(0);

            }

        });

    }

    function getTOMlangversion(domainId, LngId, callback) {

        console.log('###PPAPI:::' + 'AppConfigAPI::getTOMlangversion');
        var method = "InitalApp";
        $http({
            method: 'GET',
            url: appConfigApi + method,
            params: {
                domainId: domainId,
                LngId: LngId
            }
        })

        .success(function(resp) {

            if (resp.ReturnCode == 0) {

                console.log('###PPAPI:::' + 'AppConfigAPI::getTOMlangversion:: Server OK!!');
                var FencingTime = resp.Data[0].FencingTime;
                var SafemateTime = resp.Data[0].SafemateTime;
                var langVersion = resp.Data[0].Version;
                var ImageShot = resp.Data[0].ImageQty;
                callback(1, FencingTime, SafemateTime, langVersion, ImageShot);

            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::getTOMlangversion: Server Error Code:' + resp.ReturnCode);
                callback(0, null, null, null, null);

            }
        })

        .error(function(err) {

            console.error('###PPAPI:::' + 'AppConfigAPI::getTOMlangversion: Fail To Connect Server!!');
            callback(0, null, null, null, null);

        })

    }

    function getUpdateLang(domainId, LngId, callback) {
        console.log('###PPAPI:::' + 'AppConfigAPI::getUpdateLang');
        var method = "UpdateLang";

        $http({
            method: 'GET',
            url: appConfigApi + method,
            params: {
                domainId: domainId,
                LngId: LngId
            }
        })

        .success(function(resp) {

            if (resp.ReturnCode == 0) {

                console.log('###PPAPI:::' + 'AppConfigAPI::getUpdateLang: Server OK!!');
                var langPack = resp.Data.Language;
                callback(1, langPack);

            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::getUpdateLang: Server Error Code:' + resp.ReturnCode);
                callback(0, null);

            }

        })

        .error(function(err) {

            console.error('###PPAPI:::' + 'AppConfigAPI::getUpdateLang: Fail To Connect Server!!');
            callback(0, null);

        })
    }

    function actlogin(driver_id, pin_code, truck_id, domainId, langId, oldLangVersion, callback) {

        console.log('###PPAPI:::' + 'AppConfigAPI::actlogin');

        getTOMlogin(driver_id, truck_id, pin_code, function(loginFlag) {

            if (loginFlag == 1) {

                getTOMlangversion(domainId, langId, function(LangFlag, FencingTime, SafemateTime, newLangVersion, ImageShot) {

                    if (LangFlag == 1) {
                        Deviceconfig.updateDB_device_config("devc_fecingtime", FencingTime, function(flagF) {

                            if (flagF == 1) {
                                console.log('###PPAPI:::' + 'AppConfigAPI::actlogin: Update  FencingTime success');
                            } else {
                                console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: Update  FencingTime failed');

                            }

                            Deviceconfig.updateDB_device_config("devc_safematetime", SafemateTime, function(flagS) {

                                if (flagS == 1) {
                                    console.log('###PPAPI:::' + 'AppConfigAPI::actlogin: Update  SafemateTime success');
                                } else {
                                    console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: Update  SafemateTime failed');

                                }

                                Deviceconfig.updateDB_device_config("no_image", ImageShot, function(flagP) {
                                    console.info(ImageShot);
                                    if (flagP == 1) {
                                        console.log('###PPAPI:::' + 'AppConfigAPI::actlogin: Update  Photo Shot success');
                                    } else {
                                        console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: Update  Photo Shot failed');

                                    }
                                });
                            });

                        });

                        if (oldLangVersion < newLangVersion) {

                            console.log('###PPAPI:::' + 'AppConfigAPI::actlogin: get update version language');
                            getUpdateLang(domainId, langId, function(updateLangFlag, langPack) {
                                if (updateLangFlag == 1) {
                                    Languages.setDBlangversion(langId, newLangVersion, function(resp) {
                                        if (resp == 1) {
                                            Languages.setDBlang(langId, langPack, function(resp) {

                                                if (resp == 1) {

                                                    console.info('###PPAPI:::' + 'AppConfigAPI::actlogin: language version is updated!!');
                                                    callback(1, langId, newLangVersion);

                                                } else {

                                                    console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: language version is fail to updated!!');
                                                    callback(1, langId, oldLangVersion);

                                                }

                                            });
                                        } else {
                                            console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: language version is fail to updated!!');
                                            callback(1, langId, oldLangVersion);
                                        }

                                    });

                                } else {

                                    console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: language version fail to update!!');
                                    callback(1, langId, oldLangVersion);

                                }
                            });
                        } else {

                            console.info('###PPAPI:::' + 'AppConfigAPI::actlogin: Your language version is lasted!!');
                            callback(1, langId, oldLangVersion);

                        }

                    } else {

                        console.error('###PPAPI:::' + 'AppConfigAPI::actlogin: InitalApp Error!!');
                        callback(1, langId, oldLangVersion);

                    }
                });
            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::actlogin: Login Error!!');
                callback(0, null, null);

            }

        });

    }

    function getchktom(callback) {

        console.log('###PPAPI:::' + 'AppConfigAPI::getchktom');
        var method = "checkServerStatus";

        $http({
            method: 'GET',
            url: appConfigApi + method,
            params: {}
        })

        .success(function(resp) {

            if (resp.ReturnCode == 0) {

                console.log('###PPAPI:::' + 'AppConfigAPI::getchktom: Server OK!!');
                callback(1);

            } else {

                console.warn('###PPAPI:::' + 'AppConfigAPI::getchktom: Server Error Code:' + resp.ReturnCode);
                callback(0);

            }
        })

        .error(function(err) {

            console.error('###PPAPI:::' + 'AppConfigAPI::getchktom: Fail To Connect Server!!');
            callback(0);

        })

    }

    return {
        getDeviceId: getDeviceId,
        getchktom: getchktom,
        actlogin: actlogin
    };

})
