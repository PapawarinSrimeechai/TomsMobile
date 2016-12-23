app.controller('ChooseCustomerCtrl', function($scope, $ionicHistory, $ionicPopup, $ionicModal, $state,SessionService) {

    // Check Session login
    SessionService.chk_login();
    //Disable back
    $ionicHistory.nextViewOptions({
        disableBack: true
    });

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

                $state.go('app.container-return-list');
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

    $scope.endMileSave = function() {
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