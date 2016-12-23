'use strict'

app.factory('SessionService',  function ($state,$localStorage) {

	function set(value){
		return $localStorage.user_session = value;
	}
	function get(){
		return $localStorage.user_session
	}
	function remove(){
		return $localStorage.user_sessions = null;
	}
	function chk_login(){
		if(get()==null){
        	$state.go('app.login');
    	}
    }

	return{
		set:set, get:get, remove:remove, chk_login:chk_login
	};

})
