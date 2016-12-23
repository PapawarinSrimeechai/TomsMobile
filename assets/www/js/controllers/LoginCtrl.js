app.controller('LoginCtrl', function($scope,$state,$ionicHistory,$ionicSideMenuDelegate,$ionicPopup,$ionicModal,PageService,DeviceService,$localStorage,SessionService,md5,WLog,APIService,Languages,Deviceconfig ) {
    // local Strorage
    $localStorage.lang_page = "TM02";
    $localStorage.spotc_scenario = 2;

    $scope.lang_id = $localStorage.lang_id;
    APIService.Batch.all();

    //Disable side menu
    $ionicSideMenuDelegate.canDragContent(false);

    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

    //$scope.page = PageService.find_page('TM55');

    // (1) P.chk_devcie_status()
    $scope.device_status = [0, 0, 0];
    DeviceService.chk_device_status(function(net_status, gps_status, box_status) {
        console.log('######## TM02 chk_device_status :'+net_status+ ' '+gps_status+' '+box_status);
        $scope.device_status[0] = net_status;
        $scope.device_status[1] = gps_status;
        $scope.device_status[2] = box_status;
        // (2) WLog log_device_status(net_status,gps_status,box_status)
        WLog.log_device_status($scope.device_status[1],$scope.device_status[1],$scope.device_status[2],function(a){     
        });
        // (2.1) P. [if chk_device_status[111] not_equal >> (scxx),equal >>(3)]
        if($scope.device_status[0]==1 && $scope.device_status[1]==1 && $scope.device_status[2]==1){
            //(2.2) getchktom()
            APIService.AppConfig.getchktom(function(TOMs_status){
                // (2.4) return chk_tom [0,1]
                $scope.TOMs_status = TOMs_status;
                console.log('######## TM02 TOMs_status :'+$scope.TOMs_status);
            }) 
            // (2.5) P. [if chk_tom [1] equal >> (scxx),not equal >>(scxx)]
        }

    })

    //(3) getDBlang(lang_id,lang_page)
    //(4) tb_language_config [array]
    Languages.getDBlang($localStorage.lang_id, $localStorage.lang_page, function(result){
        console.log(result);
        $scope.lb1sc02 = result[0].lang_word;   //รหัสพนักงาน
        $scope.lb2sc02 = result[1].lang_word;   //pincode
        $scope.lb3sc02 = result[2].lang_word;   //ทะเบียนรถ
        $scope.lb4sc02 = result[3].lang_word;   //เขา้ สู่ระบบ
    })


    // (5) getDB_device_config() // ได้มาจากหน้า loading แล้ว
    // (6) tb_device_config [array]
    Deviceconfig.getDB_device_config(function(result) {
        $localStorage.lang_id = result[0].devc_lang_id;
    })

    // (7) getDBverlang(lang_id)
    //(8) tb_vlanguage_config [array]
    Languages.getDBverlang($localStorage.lang_id,function(result){
        if(result.length>=1){
            $localStorage.lang_version = result[0].lang_version;
        }else{
            $localStorage.lang_version = '1';
        }
         
         
    })


    // (9) Wlog setlog_action(ship_id,spot_id, spotc_scenario [SC02], lang_page [TM02])
    // (10) return Pst. [0,1] $localStorage.spotc_scenario, $localStorage.lang_page,
    // setlog_action: function(ship_id, spot_id, spotc_scenario, lang_page, numship, pre_mile, tokelogin, lastsend_tom_record, callback)
    WLog.setlog_action(null, null, $localStorage.spotc_scenario, $localStorage.lang_page, null, null, null, null, function(result){
        console.log('######## TM02 WLog setlog_action :' + result);
    })

    // Check default Lang_id
    if( $localStorage.lang_id=='1'){
        $scope.langTH = {
            "height" : "30px",
            "width" : "30px"
        };
    }      
    if( $localStorage.lang_id=='0'){
        $scope.langUK = {
            "height" : "30px",
            "width" : "30px"
        };
    }  
    if( $localStorage.lang_id=='2'){
        $scope.langMM = {
            "height" : "30px",
            "width" : "30px"
        };
    }

    // (13) P. [if bt_lang_click[lang_id] >>(14.1),(15)]
    

    $scope.select_lang =  function(lang_id) {

        // (14.1) getDBlang(lang_id,lang_page) 
        // (14.2) tb_language_config [array]
        if(lang_id==$localStorage.lang_id){ return; }
        Languages.getDBlang(lang_id, $localStorage.lang_page, function(result){
            console.log('############# TM02 getDBlang :');
            $scope.lb1sc02 = result[0].lang_word;   //รหัสพนักงาน
            $scope.lb2sc02 = result[1].lang_word;   //pincode
            $scope.lb3sc02 = result[2].lang_word;   //ทะเบียนรถ
            $scope.lb4sc02 = result[3].lang_word;   //เขา้ สู่ระบบ
        })
        // (14.3) setDB_device_config(dev_uid,dev_band,lang_id)
        // (14.4) return Pst. [0,1]
        Deviceconfig.setDB_device_config(null,null,null, null,null,$localStorage.lang_id,null, null, null,  function(cb) {
            console.log('######### TM01 setDB_device_config status : ' + cb);
        });

        // (14.5) P.get variable [lang_id]
        $localStorage.lang_id = lang_id;

        //(14.6) WLog current_device_data(dev_uid,dev_band,lang_id)
        WLog.current_device_data(null, null, lang_id);
        
        if(lang_id==1){
            $scope.langTH = {
                "height" : "30px",
                "width" : "30px"
            };
            $scope.langUK = {
                "height" : "25px",
                "width" : "25px"
            };
            $scope.langMM = {
                "height" : "25px",
                "width" : "25px"
            };
        }
        
        if(lang_id==0){
            $scope.langUK = {
                "height" : "30px",
                "width" : "30px"
            };
            $scope.langTH = {
                "height" : "25px",
                "width" : "25px"
            };
            $scope.langMM = {
                "height" : "25px",
                "width" : "25px"
            };
        }
        
        if(lang_id==2){
            $scope.langMM = {
                "height" : "30px",
                "width" : "30px"
            };
            $scope.langUK = {
                "height" : "25px",
                "width" : "25px"
            };
            $scope.langTH = {
                "height" : "25px",
                "width" : "25px"
            };
        }

        
    }


    var action;

    $scope.login = function(txt_emp_id, pin_code, txt_truck_id) {

        if(action==1){return}
        
        if(txt_emp_id==null || txt_truck_id==null || pin_code==null ){
            $scope.alertModal();
        }else{
            txt_emp_id = txt_emp_id.replace("-", "");
            txt_truck_id = txt_truck_id.replace("-", "");
            // (19) actlogin(txt_emp_id,txt_pin_code,txt_truck_id,device_domain,lang_id,lang_version)
            action = 1;
            APIService.AppConfig.actlogin(txt_emp_id, pin_code, txt_truck_id, $localStorage.domain_id, $localStorage.lang_id, $localStorage.lang_version,function(_return,_lang_id,_version){
                $localStorage.lang_id = _lang_id;
                $localStorage.lang_version = _version;
                var login_status = _return;
                //var login_status = 1; // temp
                action = 0;
                chk_login(login_status);
            })
            // (23) loginPst.&lang [array]
            // (24) P. chk_login()
            function chk_login(login_status){
                    if (login_status==1) {
                    // (26) P.generate gentokenlogin()

                    Deviceconfig.setDB_device_config(null, null, null, null, null, null, txt_truck_id, null, null, function(cb){

                    })

                    var uuid = $localStorage.uuid;
                    var txt_user = txt_emp_id.concat(pin_code, txt_truck_id, uuid);
                    var tokenlogin = md5.createHash(txt_user);

                    $localStorage.truck_id = txt_truck_id;
                    //usr_session;
                    $localStorage.tokenlogin = tokenlogin;
                    SessionService.set(tokenlogin);

                    // (27) Wlog log_login(txt_emp_id,txt_pin_code,txt_truck_id,login_status,tokenlogin)
                    WLog.log_login(txt_emp_id,txt_truck_id,login_status,tokenlogin);

                    // (28) Wlog log_updateaction("tokenlogin",tokenlogin)
                    WLog.log_updateaction("tokenlogin",tokenlogin,function(log_actionStatus){
                        // (29) return Pst. [0,1]
                        console.log('######## TM02 log_actionStatus: ' + log_actionStatus);
                    })
                    
                    fadeout();
                } else {
                    $scope.alertModal();
                }
            }
            
        }
    }


    // Alert login Modal
    function createAlertModal() {
        $ionicModal.fromTemplateUrl('login-alert.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    }
    createAlertModal()

    $scope.alertModal = function() {
        $scope.modal.show();
        $('#login-alert__modal').velocity({
            opacity: [1, 0]
        }, {
            duration: 300
        });
    };

    $scope.alertHide = function() {
        $('#login-alert__modal').velocity({
            opacity: 0
        }, {
            duration: 300,
            complete: function() {
                $scope.modal.remove();
                createAlertModal()
            }
        });
    };

    function fadeout(){
         // Animation
        $('.login__header').velocity({
            translateY: -50,
            opacity: 0
        }, {
            duration: 300
        });

        $('md-input-container:nth-child(1)').velocity({
            translateY: -50,
            opacity: 0
        }, {
            duration: 300,
            delay: 150
        });

        $('md-input-container:nth-child(2)').velocity({
            translateY: -50,
            opacity: 0
        }, {
            duration: 300,
            delay: 300
        });

        $('button').velocity({
            translateY: -50,
            opacity: 0
        }, {
            duration: 300,
            delay: 450
        });

        $('.login').velocity({
            opacity: 0
        }, {
            duration: 300,
            delay: 600,
            complete: function() {
                $ionicHistory.nextViewOptions({
                    disableAnimate: true
                });

                // (30) P. direct to ui TM03 [SC03]
                $state.go('app.start');
                // on-the-way
                //$state.go(PageService.find_page('TM16'));
            }
        });
    }

})
