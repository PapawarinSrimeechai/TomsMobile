app.factory('BatchAPI', function(WLog, BoxAPI, ShipmentAPI, Deviceconfig) {
    function batchStartMile() {
        WLog.getlog_mile(function(JSON_D15) {
            if (JSON_D15.LogMile.length > 0) {

                Deviceconfig.getDB_device_config(function(result) {
                    var driver_id = result[0].devc_driver_id;
                    ShipmentAPI.actmile(driver_id, JSON_D15, function(resp, JSON_D16) {

                        if (resp == 1) {
                            console.info('###PPAPI:::' + 'Batch::batchStartMile: ' + JSON_D16.LogMile.length + ' rows Batched!!');
                            WLog.updatelog_mile(JSON_D16, function(updatelog) {

                            })
                        }

                    })


                });


            }

        })
    }

    function batchSpot() {
        WLog.getlog_spot(function(JSON_D15) {
            if (JSON_D15.LogSpot.length > 0) {
                Deviceconfig.getDB_device_config(function(result) {
                    var driver_id = result[0].devc_driver_id;
                    ShipmentAPI.actspot(driver_id, JSON_D15, function(resp, JSON_D16) {

                        if (resp == 1) {
                            console.info('###PPAPI:::' + 'Batch::all:batchSpot: ' + JSON_D16.LogSpot.length + ' rows Batched!!');
                            WLog.updatelog_spot(JSON_D16, function(updatelog) {

                            })
                        }

                    })


                });

            }

        })
    }

    function batchImage() {
        WLog.getlog_image(function(JSON_D17) {

            if (JSON_D17.LogImage.length > 0) {

                ShipmentAPI.setImageToms(JSON_D17, function(flag, JSON_D18) {
                    if (flag == 1) {
                        console.info('###PPAPI:::' + 'Batch::all:batchImage: ' + JSON_D18.LogImage.length + ' rows Batched!!');

                        WLog.updatelog_image(JSON_D18, function(updatelog_image_status) {

                        })
                    }
                });

            }

        })
    }

    function batchBoxData() {
        WLog.getlog_box_data(function(JSON_D3) {
            if (JSON_D3.ReturnCode == 1) {

                BoxAPI.setbox_data(JSON_D3, function(status) {

                    if (status == 1) {

                        BoxAPI.setboxdatatom(JSON_D3, function(status, JSON_D4) {
                            console.info('###PPAPI:::' + 'Batch::all:batchBoxData: ' + JSON_D4.LogData.length + ' rows Batched!!');

                            for (i = 0; i < JSON_D4.LogData.length; i++) {
                                if (JSON_D4.LogData[i].sendtom_status == 'C') {

                                    WLog.updatelog_box_data(JSON_D4.LogData[i].indextom, JSON_D4.LogData[i].sendtom_status, function(status) {
                                        if (i == JSON_D4.LogData.length) {

                                            console.log('status : ' + status);

                                        }

                                    });
                                }

                            }

                        });
                    }
                });

            }
        });

    }

    function batchUntype() {
        WLog.getlog_untype(function(JSON_D15) {
            if (JSON_D15.LogUntype.length > 0) {
                Deviceconfig.getDB_device_config(function(result) {
                    var driver_id = result[0].devc_driver_id;
                    ShipmentAPI.actuntype(driver_id, JSON_D15, function(resp, JSON_D16) {
                        if (resp == 1) {
                            console.info('###PPAPI:::' + 'Batch::all:batchUntype: ' + JSON_D16.LogUntype.length + ' rows Batched!!');
                            WLog.updatelog_untype(JSON_D16, function(updatelog) {

                            })
                        }

                    })


                });

            }

        })
    }

    function batchProductBroke() {
        WLog.getlog_procause(function(JSON_D15) {
            if (JSON_D15.LogProCause.length > 0) {

                Deviceconfig.getDB_device_config(function(result) {
                    var driver_id = result[0].devc_driver_id;
                    ShipmentAPI.actproductBroke(driver_id, JSON_D15, function(resp, JSON_D16) {

                        if (resp == 1) {
                            console.info('###PPAPI:::' + 'Batch::batchProductBroke: ' + JSON_D16.LogProCause.length + ' rows Batched!!');
                            WLog.updatelog_procause(JSON_D16, function(updatelog) {

                            })
                        }

                    })


                });


            }

        })
    }

    function batchOTP() {
        WLog.getlog_otp(function(JSON_D15) {
            if (JSON_D15.LogOtp.length > 0) {

                Deviceconfig.getDB_device_config(function(result) {
                    var driver_id = result[0].devc_driver_id;
                    ShipmentAPI.actOTP(driver_id, JSON_D15, function(resp, JSON_D16) {

                        if (resp == 1) {
                            console.info('###PPAPI:::' + 'Batch::batchOTP: ' + JSON_D16.LogOtp.length + ' rows Batched!!');
                            WLog.updatelog_returnware(JSON_D16, function(updatelog) {

                            })
                        }

                    })


                });


            }

        })
    }

    function batchReturnable() {
        WLog.getlog_returnware(function(JSON_D15) {
            if (JSON_D15.LogReware.length > 0) {

                Deviceconfig.getDB_device_config(function(result) {
                    var driver_id = result[0].devc_driver_id;
                    ShipmentAPI.actReturnable(driver_id, JSON_D15, function(resp, JSON_D16) {

                        if (resp == 1) {
                            console.info('###PPAPI:::' + 'Batch::batchReturnable: ' + JSON_D16.LogReware.length + ' rows Batched!!');
                            WLog.updatelog_returnware(JSON_D16, function(updatelog) {

                            })
                        }

                    })


                });


            }

        })
    }

    function all() {
        batchStartMile();
        batchSpot();
        // batchBoxData();
        // งดใช้งานชั่วคราวอย่างไม่มีกำหนด
        batchImage();
        batchUntype();
        batchProductBroke();
        // batchOTP();
        batchReturnable();
    }

    return {
        all: all
    };
})
