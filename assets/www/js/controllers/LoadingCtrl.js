app.controller('LoadingCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, $interval, PageService, DeviceService, $localStorage, WLog, APIService, Deviceconfig, SessionService) {

    // local Strorage
    $localStorage.lang_page = "TM01";
    $localStorage.spotc_scenario = 1;


    //Disable side menu
    $ionicSideMenuDelegate.canDragContent(false);

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    // Page Config
    //$scope.page = PageService.find_page('TM02');

    // (3) P.chk_devcie_status()
    $scope.device_status = [0, 0, 0];
    DeviceService.chk_device_status(function(net_status, gps_status, box_status) {
    console.log('######## TM01 chk_device_status :'+net_status+ ' '+gps_status+' '+box_status);
        $scope.device_status[0] = net_status;
        $scope.device_status[1] = gps_status;
        $scope.device_status[2] = box_status;

        // (4)WLog log_device_status(net_status,gps_status,box_status)
        WLog.log_device_status($scope.device_status[1], $scope.device_status[1], $scope.device_status[2], function(a) {});

        // (4.1) P. [if chk_device_status[111] not_equal >> (scxx),equal >>(5)]
        if ($scope.device_status[0] == 1 && $scope.device_status[1] == 1 && $scope.device_status[2] == 1) {
            // (4.2) getchktom()
            APIService.AppConfig.getchktom(function(TOMs_status) {
                // (4.4) return chk_tom [0,1]
                $scope.TOMs_status = TOMs_status;
                console.log('######## TM01 TOMs_status :' + $scope.TOMs_status);
            })

            // (4.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]

        }

    })


    // (5) P.display progress_bar 0% TM01
    Progress_Bar();

    //Progress setting
    function Progress_Bar() {

        //(6) getDB_device_config()
        
        Deviceconfig.getDB_device_config(function(result) {
            console.log('###################### TM01 DB Deviceconfig  ############');
            // (10) P.declar [lang_id]
            if(result.length>=1){
                $localStorage.lang_id = result[0].devc_lang_id;
                $localStorage.domain_id = result[0].devc_driver_domain;
            }else{
                $localStorage.lang_id = '1';
                $localStorage.domain_id = '1';
            }
            
            


            //$localStorage.lang_id = 1;

            // (8)get [dev_uid,dev_band]
            DeviceService.get_device_info(function(_manufacturer, _model, _serial, _uuid) {
                $scope.band = _manufacturer;
                $scope.model = _model;
                $scope.serial = _serial;
                $scope.uuid = _uuid;
                $localStorage.uuid = $scope.uuid;


                // (9.1) setDB_device_config(devc_driver_id, devc_driver_domain, devc_dev_uid, devc_dev_band, devc_dev_id, devc_lang_id, devc_truck_id, devc_model, devc_serial, callback)
                Deviceconfig.setDB_device_config(null,$localStorage.domain_id,$scope.uuid, $scope.band,null,$localStorage.lang_id,null, $scope.model, $scope.serial,  function(cb) {
                    console.log('######### TM01 setDB_device_config status : ' + cb);
                });

                // (11) WLog current_device_data(dev_uid,dev_band,clang_id)
                WLog.current_device_data($scope.uuid, $scope.band, $localStorage.lang_id);

                APIService.AppConfig.getDeviceId($scope.band, $scope.model, $scope.serial, $scope.uuid, function(status, device_id) {
                    console.log('#####  TM01 API getDeviceId status:' + status);
                    if(status==1){
                        Deviceconfig.updateDB_device_config('devc_dev_id', device_id.toString(), function(result) {
                            console.log('#####  TM01 updateDB_device_config :' + result);
                        })
                    }

                })
            });

        })


        //Progress setting
        var bar = new ProgressBar.Line(container, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#223f87',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: { width: '100%', height: '100%' },
            text: {
                style: {
                    color: '#999',
                    position: 'absolute',
                    right: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            from: { color: '#223f87' },
            to: { color: '#223f87' },
            step: (state, bar) => {
                bar.setText(Math.round(bar.value() * 100) + ' %')
            }
        });

        //Animation
        $('#loading__logo').velocity({
            translateY: [0, 150],
            opacity: [1, 0]
        }, {
            duration: 1500,
            easing: [200, 20]
        });

        $('.footer').velocity({
            opacity: 1
        }, {
            duration: 1000,
            delay: 500
        });

        $('#container').velocity({
            translateY: [0, 150],
            opacity: 1
        }, {
            duration: 1500,
            easing: [150, 20],
            delay: 200,
            complete: function() {
                setTimeout(function() {
                    bar.animate(1.0);
                }, 500);

                $('#loading__logo').velocity({
                    translateY: -50,
                    opacity: 0
                }, {
                    duration: 300,
                    delay: 2200
                });

                $('#container').velocity({
                    translateY: -50,
                    opacity: 0
                }, {
                    duration: 300,
                    delay: 2400
                });

                $('.footer').velocity({
                    translateY: -50,
                    opacity: 0
                }, {
                    duration: 300,
                    delay: 2600,
                    complete: function() {
                        $ionicHistory.nextViewOptions({
                            disableAnimate: true
                        });

                        // (13) getlog_action()
                        //$scope.lang_page_action = null;
                        if(SessionService.get()!=null){
                            WLog.getlog_action(function(result){          
                                console.log('################### getlog_action compleated');
                                console.log(result[0].lang_page);
    
                                try{
                                    $scope.lang_page_action = result[0].lang_page;
                                    $state.go(PageService.find_page($scope.lang_page_action)); 
                                    console.log("case 1")
                                }catch(err){
                                    $state.go('app.login');
                                    console.log("case 2")
                                }

                            })
                        }else if(SessionService.get()==null){ // (16) P. direct to ui TM02 [SC02]
                            $state.go('app.login');
                            console.log("case 3")
                        }
                        //$state.go('app.login');

                    }
                });
            }
        });
    } // end fucntion Progress_Bar
})
