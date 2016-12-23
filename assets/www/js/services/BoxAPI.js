app.factory('BoxAPI', function($http, box, boxApi, WLog, DatabaseSQLite, $localStorage) {

    function setbox_data(json, callback) {
        console.log('###PPAPI:::' + 'box::setbox_data');
        if (json.ReturnCode == 1) {
            var method = "VehicleTracking_Receive";
            var data = {};
            data.ids = [];

            for (var i = 0; i < json.LogData.length; i++) {

                if (json.LogData[i].sendbox_status == 'C') {
                    data.ids.push(json.LogData[i].id_box);
                }

            }

            $http({
                method: 'POST',
                url: box + method,
                headers: { 'Content-Type': 'application/json' },
                data: data
            })

            .success(function(resp) {

                console.log('###PPAPI:::' + 'box::setbox_data: Connect To API Success');
                console.info('###PPAPI:::' + 'box::setbox_data: ' + data.ids.length + ' rows deleted!!');
                callback(1);

            })

            .error(function(err) {

                console.error('###PPAPI:::' + 'box::setbox_data: Fail To Connect Box!!');
                callback(0);

            })
        } else {
            console.log('###PPAPI:::' + 'box::setbox_data: JSON null');
            callback(1);
        }

    }

    function prepareGetBoxData(resp) {
        var data = {
            "ReturnCode": 1,
            "LogData": []
        }

        for (var i = 0; i < resp.length; i++) {

            var driver_identify = "";
            var id_identify = "";
            var driver_name = "";
            var exp_month = "";
            var country_number = "";
            var bdate = "";
            var license_type = "";
            var gender = "";
            var office_branch = "";

            if (resp[i].driver_license_parsed != null) {
                driver_identify = resp[i].driver_license_parsed.license_number;
                id_identify = resp[i].driver_license_parsed.national_identification_number;
                driver_name = resp[i].driver_license_parsed.full_name;
                country_number = resp[i].driver_license_parsed.country_number;
                exp_month = resp[i].driver_license_parsed.expiry_date_yymm;
                bdate = resp[i].driver_license_parsed.birth_date_yyyymmdd;
                license_type = resp[i].driver_license_parsed.license_type;
                gender = resp[i].driver_license_parsed.gender;
                office_branch = resp[i].driver_license_parsed.issue_at_office_branch;
            }

            var ignition = 0;

            if (resp[i].ignition_on == true) {
                ignition = 1;
            }

            var battery = 0;

            if (resp[i].external_power_supply == true) {
                battery = 1;
            }

            var lat_box = "";
            var long_box = "";
            var speed_box = "";
            var angle_box = "";
            var fix_box = "";
            var gpstime_box = "";

            if (resp[i].gps_message_parsed != null) {

                lat_box = resp[i].gps_message_parsed.lat;
                long_box = resp[i].gps_message_parsed.lng;
                speed_box = resp[i].gps_message_parsed.speed_in_kmph;
                angle_box = resp[i].gps_message_parsed.track_angle_in_degree;
                fix_box = resp[i].gps_message_parsed.fix;
                gpstime_box = resp[i].gps_message_parsed.timestamp;

            }

            var fix = 0;

            if (fix_box == true) {
                fix = 1;
            }

            data.LogData.push({
                "ship_id": "", //ship_id ณ ขณะนั้น  [null]
                "spot_id": "", //spot_id ณ ขณะนั้น  [null]
                "domain_id": "",
                "lang_page": "", // หน้าที่ app แสดง ณ  ขณะนั้น [not null] //Top
                "spotc_scenario": "", // app  scenario ณ  ขณะนั้น [not null]//Top
                "id_box": resp[i]._id,
                "driver_id": "", //ได้มาจาก box [null]
                "driver_identify": driver_identify, //ได้มาจาก box ื[not null]
                "id_identify": id_identify, //ได้มาจาก box [not null]
                "serial_box": resp[i].serial_number, //ได้มาจาก box [not null]
                "indextom": 0, //ได้มาจากการ gen ใน app [not null]
                "lat_box": lat_box, //ได้มาจาก box [null]
                "long_box": long_box, //ได้มาจาก box [null]
                "consum_box": "", //ได้มาจาก box [null]
                "led_status": ignition, //ได้มาจาก box [null]
                "battery_status": battery, //ได้มาจาก box [null]
                "timestamp_box": resp[i].created_at, //ได้มาจาก box [null]
                "device_status": "", //ได้มาจาก app [not null]
                "driver_name": driver_name,
                "country_number": country_number,
                "exp_month": exp_month,
                "bdate": bdate,
                "license_type": license_type,
                "gender": gender,
                "office_branch": office_branch,
                "truck_start": ignition,
                "fuel_box": resp[i].fuel_quantity_in_litre,
                "speed_box": speed_box,
                "angle_box": angle_box,
                "fix_box": fix,
                "gpstime_box": gpstime_box,
                "sendbox_status": "P",
                "sendtom_status": "P", //ได้มาจาก app เป็นการบอกว่า serTOM รับแล้วยัง [P,C] [not null]
            });
        }
        return data;

    }

    function getbox_data(truck_id, callback) {
        console.log('###PPAPI:::' + 'box::getbox_data');

        var method = "VehicleTracking";

        $http({
            method: 'GET',
            url: box + method,
            params: {
                license_plate: truck_id
            }
        })

        .success(function(resp) {
            console.log('###PPAPI:::' + 'box::getbox_data: Connect To API Success!!');
            console.info('###PPAPI:::' + 'box::getbox_data: ' + resp.length + ' rows found!!');

            var data = prepareGetBoxData(resp);
            callback(1, data);

        })

        .error(function(err) {
            console.error('###PPAPI:::' + 'box::getbox_data: Fail To Connect Box!!');
            callback(0, null);
        })

    }

    function prepareDataSetBoxDataTom(json) {
        var data = [];      

        for (var i = 0; i < json.LogData.length; i++) {        
            var temp = {
                "AppIndexId": json.LogData[i].indextom,
                "BoxIndexId": json.LogData[i].id_box,
                "ShipmentId": json.LogData[i].ship_id,
                "FreightId": json.LogData[i].spot_id,
                "ScenarioId": json.LogData[i].spotc_scenario,
                "Ignition": json.LogData[i].truck_start,
                "ExternalPower": json.LogData[i].battery_status,
                "FuelQty": json.LogData[i].fuel_box,
                "BoxSerialNo": json.LogData[i].serial_box,
                "BoxDate": json.LogData[i].timestamp_box,
                "DriverName": json.LogData[i].driver_name,
                "CountryNo": json.LogData[i].country_number,
                "SSNO": json.LogData[i].id_identify,
                "ExpiryMonth": json.LogData[i].exp_month,
                "BirthDate": json.LogData[i].bdate,
                "LicenseType": json.LogData[i].license_type,
                "Gender": json.LogData[i].gender,
                "LicenseNo": json.LogData[i].driver_identify,
                "OfficeBranch": json.LogData[i].office_branch,
                "Latitude": json.LogData[i].lat_box,
                "Longitude": json.LogData[i].long_box,
                "Speed": json.LogData[i].speed_box,
                "AngleTrack": json.LogData[i].angle_box,
                "Fix": json.LogData[i].fix_box,
                "GPSDate": json.LogData[i].gpstime_box
            }        
            data.push(temp);      

        }      
        return data;
    }

    function setboxdatatom(json, callback) {
        console.log('###PPAPI:::' + 'box::setboxdatatom');
        var data = prepareDataSetBoxDataTom(json);
        var method = "InsertTruckBoxData";      

        console.log('###PPAPI:::' + 'box::setboxdatatom: API Connecting....');
        $http({
            method: 'POST',
            url: boxApi + method,
            headers: { 'Content-Type': 'application/json' },
            params: {
                domainId: $localStorage.domain_id,
                userNo: $localStorage.UserNo,
                LPNo: $localStorage.truck_id.toString(),
            },
            data: data

        })

        .success(function(resp) {
            console.log('###PPAPI:::' + 'box::setboxdatatom: Connect To API Success');

            if (resp.ReturnCode == 0) {

                console.log('###PPAPI:::' + 'box::setboxdatatom: Server OK!!');
                console.info('###PPAPI:::' + 'box::setboxdatatom: ' + resp.Data.AppIndex.length + ' rows inserted!!');

                for (var i = 0; i < resp.Data.AppIndex.length; i++) {

                    for (var i = 0; i < json.LogData.length; i++) {

                        if (json.LogData[i].id_box == resp.Data.AppIndex[i].BoxIndexId) {

                            json.LogData[i].sendtom_status = 'C';
                        }

                    }
                }
                callback(1, json);

            } else {

                console.warn('###PPAPI:::' + 'box::setboxdatatom: Server Error Code:' + resp.ReturnCode);
                callback(0, null);
            }

        })

        .error(function(err) {

            console.error('###PPAPI:::' + 'box::setboxdatatom: Fail To Connect Server!!');
            callback(0, null);

        })

    }

    return {
        setbox_data: setbox_data,
        getbox_data: getbox_data,
        setboxdatatom: setboxdatatom
    };

})
