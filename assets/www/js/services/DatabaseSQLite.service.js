app.factory('DatabaseSQLite', ['$cordovaSQLite', '$q', function($cordovaSQLite, $q) {
    var deferred = $q.defer();
    return {
        connect: function() {
            //var deferred = $q.defer();
            if (window.cordova) {
                db = $cordovaSQLite.openDB({ name: "TOMs.db", location: "default" }); //device
                console.log("Android");

            } else {
                db = window.openDatabase("TOMs.db", '', 'my', 1024 * 1024 * 100); // browser
                console.log("browser");
            }
            //return deferred.promise;
        },
        createTB: function() {
            window.queries = [
                //Drop tables
                //"DROP TABLE IF EXISTS log_action;",
                //"DROP TABLE IF EXISTS log_box;",
                //"DROP TABLE IF EXISTS log_spot;",
                //"DROP TABLE IF EXISTS log_image;",
                // "DROP TABLE IF EXISTS log_untype;",
                // //"DROP TABLE IF EXISTS tb_device_config;",
                // "DROP TABLE IF EXISTS tb_language_config;",
                // // "DROP TABLE IF EXISTS tb_vlanguage_config;",
                // // "DROP TABLE IF EXISTS tb_ship_profile;",
                // "DROP TABLE IF EXISTS tb_spot_ship;",
                // "DROP TABLE IF EXISTS tb_spot_config;",
                // "DROP TABLE IF EXISTS tb_spot_product;",
                // // "DROP TABLE IF EXISTS driver_profile;",
                // // "DROP TABLE IF EXISTS tb_vproduct_type;",
                // "DROP TABLE IF EXISTS tb_product_type;",
                // "DROP TABLE IF EXISTS tb_product_cause;",
                // "DROP TABLE IF EXISTS tb_spot_typeunload;",
                // "DROP TABLE IF EXISTS tb_spot_action;",
                // // "DROP TABLE IF EXISTS tb_spot_freight;",
                // // "DROP TABLE IF EXISTS tb_spot_fencing;",
                // "DROP TABLE IF EXISTS tb_return_ware;",
                // "DROP TABLE IF EXISTS log_procause;",
                // "DROP TABLE IF EXISTS log_otp;",
                // "DROP TABLE IF EXISTS log_image;",
                // "DROP TABLE IF EXISTS log_returnware;",

                //Create tables
                "CREATE TABLE IF NOT EXISTS log_returnware (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,rew_id varchar,num_rew int,scenarioID varchar,sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS log_procause (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,pro_id varchar,procause_id varchar,pro_code varchar,num_procause_bt int,num_procause_pk int,sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS log_untype (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,type varchar,scenarioID varchar,sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS log_otp (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,otp varchar,scenarioID varchar,sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS log_image (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,pro_id varchar,procause_id varchar,pro_code varchar,image Text,scenarioID varchar,sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS log_action (id INTEGER PRIMARY KEY AUTOINCREMENT, ship_id varchar,spot_id varchar,spotc_scenario varchar,lang_page varchar,numship varchar,pre_mile varchar,tokenlogin varchar,lastsend_tom_record varchar);",
                "CREATE TABLE IF NOT EXISTS log_box (id INTEGER PRIMARY KEY AUTOINCREMENT,indextom VARCHAR NOT NULL DEFAULT '',driver_id varchar NOT NULL DEFAULT '',driver_domain varchar NOT NULL DEFAULT '',truck_id varchar NOT NULL DEFAULT '', ship_id varchar NOT NULL DEFAULT '',spot_id varchar NOT NULL DEFAULT '',lang_page varchar NOT NULL DEFAULT '',spotc_scenario varchar NOT NULL DEFAULT '',id_box varchar NOT NULL DEFAULT '',driver_name varchar NOT NULL DEFAULT '',country_number varchar NOT NULL DEFAULT '',driver_identify varchar NOT NULL DEFAULT '',id_identify varchar NOT NULL DEFAULT '',serial_box varchar NOT NULL DEFAULT '',exp_month varchar NOT NULL DEFAULT '',bdate varchar NOT NULL DEFAULT '',license_type varchar NOT NULL DEFAULT '',gender varchar NOT NULL DEFAULT '',office_branch varchar NOT NULL DEFAULT '',truck_start varchar NOT NULL DEFAULT '',lat_box varchar NOT NULL DEFAULT '',long_box varchar NOT NULL DEFAULT '',consum_box varchar NOT NULL DEFAULT '',fuel_box varchar NOT NULL DEFAULT '',speed_box varchar NOT NULL DEFAULT '',angle_box varchar NOT NULL DEFAULT '',fix_box varchar NOT NULL DEFAULT '',led_status varchar NOT NULL DEFAULT '',battery_status varchar NOT NULL DEFAULT '',device_status varchar NOT NULL DEFAULT '',sendtom_status varchar NOT NULL DEFAULT '',sendbox_status varchar NOT NULL DEFAULT '',gps_timestamp varchar NOT NULL DEFAULT '',timestamp_box varchar NOT NULL DEFAULT '',timestamp varchar);",
                "CREATE TABLE IF NOT EXISTS log_spot (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,scenarioID varchar,image_1 text,image_2 text,image_3 text,sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS log_mile (id INTEGER PRIMARY KEY AUTOINCREMENT,ship_id varchar,spot_id varchar,mile varchar, scenarioID varchar, sendtom_status varchar,timestamp datetime)",
                "CREATE TABLE IF NOT EXISTS tb_device_config (  devc_driver_id    TEXT,devc_driver_domain    TEXT,devc_dev_uid  TEXT,devc_dev_band TEXT,devc_dev_id   TEXT,devc_lang_id  TEXT,devc_truck_id TEXT,devc_model    TEXT,devc_serial   TEXT,devc_fecingtime   INTEGER,devc_safematetime INTEGER, no_image INTEGER,'devc_timestamp' DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_language_config (lang_no INTEGER primary key AUTOINCREMENT, lang_id TEXT, lang_position TEXT, lang_word TEXT, lang_page TEXT, lang_timestamp DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_vlanguage_config (lang_id TEXT, lang_version INTEGER, vlang_timestamp DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_ship_profile (ship_no   INTEGER PRIMARY KEY AUTOINCREMENT,ship_id   TEXT,driver_id TEXT,ship_spot_id  TEXT,ship_numspot  INTEGER,ship_status   TEXT,spot_seq INTEGER, ship_timestamp    DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_spot_ship (`spot_no` INTEGER PRIMARY KEY AUTOINCREMENT,`ship_id`   TEXT,`spot_id`   TEXT,`spot_seq`  TEXT,`spot_sel_datetime` NUMERIC,`spot_sour_name`    TEXT,`spot_sour_add` TEXT,`spot_sour_gate`    TEXT,`spot_sour_date`    NUMERIC,`spot_sour_time`    NUMERIC,`spot_sour_fencid`  TEXT,`spot_dest_name`    TEXT,`spot_dest_add` TEXT,`spot_dest_gate`    TEXT,`spot_dest_date`    NUMERIC,`spot_dest_time`    NUMERIC,`spot_dest_fencid`  TEXT,`spot_start_mile`   INTEGER,`spot_smile_datetime`   NUMERIC,`spot_arrive_mile`  INTEGER,`spot_amile_datetime`   NUMERIC,`spot_otp`  TEXT,`spot_otp_datetime` NUMERIC,`spot_status`   TEXT,`spot_recipient`    TEXT,`spot_timestamp`    DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')))",
                "CREATE TABLE IF NOT EXISTS tb_spot_config (spotc_no  INTEGER PRIMARY KEY AUTOINCREMENT, ship_id   TEXT,spot_id   INTEGER, scenario_id INTEGER,spotc_scenario    TEXT,spotc_status  TEXT, spotc_seq  INTEGER,spotc_timestamp   DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_spot_product (spotpro_no INTEGER PRIMARY KEY AUTOINCREMENT,ship_id TEXT,spot_id TEXT,protype_id TEXT,pro_id TEXT,pro_name TEXT, pro_code TEXT, spotpro_num INTEGER, OrderRank INTEGER, spotpro_timestamp DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS driver_profile (driver_id TEXT,driver_name   TEXT,driver_sname  TEXT,driver_timestamp  DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_vproduct_type (vprotype_version  TEXT,vprotype_timestamp    DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_product_type (protype_no    INTEGER PRIMARY KEY AUTOINCREMENT,protype_id    TEXT,protype_name  TEXT, protype_timestamp DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_product_cause (procause_no   INTEGER PRIMARY KEY AUTOINCREMENT,`ship_id`   TEXT,`spot_id`   TEXT, procause_id   TEXT,protype_id    TEXT,procause_name TEXT,procause_timestamp    DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                //"CREATE TABLE IF NOT EXISTS tb_spot_typeunload (spotun_no INTEGER PRIMARY KEY AUTOINCREMENT,ship_id   TEXT,spot_id   TEXT,spotun_type   TEXT,spotun_image_1    TEXT,spotun_image_2    TEXT,spotun_image_3    TEXT,spotun_timestamp  DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                //"CREATE TABLE IF NOT EXISTS tb_spot_action (spotact_no    INTEGER PRIMARY KEY AUTOINCREMENT,spoact_id TEXT,ship_id   TEXT,spot_id   TEXT,spotact_status    TEXT,spotact_image_1   TEXT,spotact_image_2   TEXT,spotact_image_3   TEXT,spotact_timestamp DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_spot_freight (spot_id TEXT, lat INTEGER, long INTEGER, fencing INTEGER)",
                "CREATE TABLE IF NOT EXISTS tb_spot_fencing (`spotf_no`  INTEGER PRIMARY KEY AUTOINCREMENT,`ship_id`   TEXT,`spot_id`   TEXT,`spot_seq`  INTEGER,'from_area1' TEXT, 'from_polygon1' TEXT,'from_area2' TEXT, 'from_polygon2' TEXT,'from_area3' TEXT, 'from_polygon3' TEXT,`spotf_state`   TEXT, `spotf_timestamp`   DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
                "CREATE TABLE IF NOT EXISTS tb_return_ware (`rew_no`    INTEGER PRIMARY KEY AUTOINCREMENT,`ship_id`   TEXT,`spot_id`   TEXT,`rew_id`    TEXT, `rew_name`  TEXT,`rew_timestamp` DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'LOCALTIME')));",
            ];
            db.transaction(function(tx) {
                for (var i = 0; i < window.queries.length; i++) {
                    var query = window.queries[i].replace(/\\n/g, '\n');
                    //console.log(window.queries[i]);
                    tx.executeSql(query);
                }
            }, function(error) {
                console.log('Transaction create ERROR: ' + error.message);
                deferred.reject(error);
            }, function() {
                console.log('Transaction success.');
                deferred.resolve("create OK");
            });
            return deferred.promise;
        },
        insertTest: function() {
            window.languages = [
                "('0', 'lang_position', 'English', 'TM16')",
                "('1', 'lang_position', 'Thai', 'TM16')",
                "('2', 'lang_position', 'myanmar', 'TM16')",
                //TM02
                "('1', 'lb1sc02', 'รหัสพนักงาน', 'TM02')",
                "('1', 'lb2sc02', 'PINCODE', 'TM02')",
                "('1', 'lb3sc02', 'ทะเบียนรถ', 'TM02')",
                "('1', 'lb4sc02', 'เข้าสู่ระบบ', 'TM02')",
                "('0', 'lb1sc02', 'Employee ID', 'TM02')",
                "('0', 'lb2sc02', 'PINCODE', 'TM02')",
                "('0', 'lb3sc02', 'Plate Number', 'TM02')",
                "('0', 'lb4sc02', 'Login', 'TM02')",
                "('2', 'lb1sc02', 'ဝန်ထမ်း ID ကို', 'TM02')",
                "('2', 'lb2sc02', 'PINCODE', 'TM02')",
                "('2', 'lb3sc02', 'ပန်းကန်အရေအတွက်', 'TM02')",
                "('2', 'lb4sc02', 'လော့ဂ်အင်', 'TM02')",
                //TM03
                "('1', 'lb1sc03', 'ตรวจสภาพรถ-ก่อนการใชงาน', 'TM03')",
                "('1', 'lb2sc03', 'ระดับแอลกอฮอล์ ต้องเป็น 0', 'TM03')",
                "('1', 'lb3sc03', 'กดปุ่ม', 'TM03')",
                "('1', 'lb4sc03', 'เพื่อตรวจสอบงาน', 'TM03')",
                "('0', 'lb1sc03', 'Check the car - before use.', 'TM03')",
                "('0', 'lb2sc03', 'Alcohol level must be 0', 'TM03')",
                "('0', 'lb3sc03', 'Press the button', 'TM03')",
                "('0', 'lb4sc03', 'The QS', 'TM03')",
                "('2', 'lb1sc03', 'ကားကို Check - အသုံးမပြုမီ။', 'TM03')",
                "('2', 'lb2sc03', 'အရက်အဆငျ့သူဖြစ်ရမည် 0 င်', 'TM03')",
                "('2', 'lb3sc03', 'ခလုတ်ကိုနှိပ်', 'TM03')",
                "('2', 'lb4sc03', 'အဆိုပါ QS', 'TM03')",
                //TM04
                "('1', 'lb5sc03', 'ตรวจสภาพรถ-ก่อนการใชงาน', 'TM04')",
                "('1', 'lb6sc03', 'ระดับแอลกอฮอล์ต ้องเป็น 0', 'TM04')",
                "('1', 'lb7sc03', 'รับสินค้า', 'TM04')",
                "('1', 'lb8sc03', 'ส่งสินค้า', 'TM04')",
                "('1', 'lb9sc03', 'Shipment No.', 'TM04')",
                "('1', 'lb10sc03', 'เริ่มงาน', 'TM04')",
                "('0', 'lb5sc03', 'Check the car - before use.', 'TM04')",
                "('0', 'lb6sc03', 'Alcohol level must be 0', 'TM04')",
                "('0', 'lb7sc03', 'Receive product', 'TM04')",
                "('0', 'lb8sc03', 'Deliver', 'TM04')",
                "('0', 'lb9sc03', 'Shipment No.', 'TM04')",
                "('0', 'lb10sc03', 'Start working', 'TM04')",
                "('2', 'lb5sc03', 'ကားကို Check - အသုံးမပြုမီ။', 'TM04')",
                "('2', 'lb6sc03', 'အရက်အဆငျ့သူဖြစ်ရမည် 0 င်', 'TM04')",
                "('2', 'lb7sc03', 'ထုတ်ကုန်များ', 'TM04')",
                "('2', 'lb8sc03', 'ပို့', 'TM04')",
                "('2', 'lb9sc03', 'Shipment No.', 'TM04')",
                "('2', 'lb10sc03', 'စတင်', 'TM04')",
                //TM05
                "('1', 'lb11sc03', 'ระบุเลขไมล์รถก่อนเริ่มงาน', 'TM05')",
                "('1', 'lb12sc03', 'บันทึก', 'TM05')",
                "('1', 'lb13sc03', 'ยกเลิก', 'TM05')",
                "('0', 'lb11sc03', 'Enter the number of miles the vehicle before starting work.', 'TM05')",
                "('0', 'lb12sc03', 'Record', 'TM05')",
                "('0', 'lb13sc03', 'cancel', 'TM05')",
                "('2', 'lb11sc03', 'အလုပ်မစတင်မီမိုင်ယာဉ်များ၏အရေအတွက်ကိုထည့်သွင်းပါ။', 'TM05')",
                "('2', 'lb12sc03', 'စံချိန်', 'TM05')",
                "('2', 'lb13sc03', 'ဖျက်သိမ်း', 'TM05')",
                //TM07
                "('1', 'lb9sc04', '**กรุณาถ่ายภาพสินค้าที่เสียหาย**'  , 'TM07')",
                "('0', 'lb9sc04', '** Please take a photo broken products. **' ,  'TM07')",
                "('2', 'lb9sc04', '** ပျက်စီးသွားသောပစ္စည်း၏ဓာတ်ပုံတပုံကိုယူပါ။ **'  ,  'TM07')",
                "('1', 'lb10sc04', 'บันทึก'   ,   'TM07')",
                "('0', 'lb10sc04', 'Record'  ,    'TM07')",
                "('2', 'lb10sc04', 'စံချိန်'  ,  'TM07')",
                "('1', 'lb11sc04',  'ยกเลิก'  , 'TM07')",
                "('0', 'lb11sc04', 'Cancel'   ,  'TM07')",
                "('2', 'lb11sc04', 'ဖျက်သိမ်း'  ,  'TM07')",
                "('1', 'lb1sc04',  'Shipment No.',  'TM06')",
                "('0',  'lb1sc04', 'Shipment No.'  ,'TM06')",
                "('2',  'lb1sc04', 'တင်ပို့ခြင်းအမှတ်'  ,'TM06')",
                "('1',  'lb2sc04', 'รับ'  ,'TM06')",
                "('0',  'lb2sc04', 'Receive'   ,'TM06')",
                "('2',  'lb2sc04', 'ခံယူ ' ,'TM06')",
                "('1',  'lb3sc04', 'ส่ง'  ,'TM06')",
                "('0',  'lb3sc04', 'send'     ,'TM06')",
                "('2',  'lb3sc04', 'ပေးပို့ ' ,'TM06')",
                "('1',  'lb4sc04', 'จอดรถ-ดับเครื่อง-เก็บกุญแจ'  ,'TM06')",
                "('0',  'lb4sc04', 'Parking - engine off - holds the key.'    ,'TM06')",
                "('2',  'lb4sc04', 'ပန်းခြံ - ထိုမော်တာကိုရပ်တန့်- key ကိုရရှိထားသူ'  ,'TM06')",
                "('1',  'lb5sc04', 'จอดรถ-ดึงเบรคมือ-เบรคทาง'     ,'TM06')",
                "('0',  'lb5sc04', 'Parking - pull the hand brake - the brake. '  ,'TM06')",
                "('2',  'lb5sc04', 'ယာဉ်ရပ်နား - လက်တော်ဘရိတ်ဆွဲ - ဘရိတ်။ ' ,'TM06')",
                "('1',  'lb6sc04', 'จอดรถ-ลงจากรถ-หมุนล้อ  '  ,'TM06')",
                "('0',  'lb6sc04', 'Parking - out of the car - spinning wheel.' ,'TM06')",
                "('2', 'lb6sc04', 'ယာဉ်ရပ်နား - ကား - spinning ဘီး။ ' ,'TM06')",
                "('1',  'lb7sc04', 'กดปุ่ม '  ,'TM06')",
                "('0',  'lb7sc04', 'Press the button ', 'TM06')",
                "('2', 'lb7sc04', 'ခလုတ်ကိုနှိပ် ' ,'TM06')",
                "('1',  'lb8sc04', 'เมื่อเริ่มขึ้นสินค้า '   ,'TM06')",
                "('0', 'lb8sc04', 'When starting up products  '  ,'TM06')",
                "('2', 'lb8sc04', 'ကုန်ပစ္စည်းတက်စတင်လာတဲ့အခါ ' ,'TM06')",    
            ];
            db.transaction(function(tx) {
                // insert tb_device_config
                //tx.executeSql("INSERT INTO tb_device_config ( devc_driver_id, devc_driver_domain, devc_dev_uid, devc_dev_band, devc_dev_id, devc_lang_id, devc_truck_id, devc_model, devc_serial, devc_fecingtime, devc_safematetime) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ["11025300", "1", "android01", "android01", "12345678", "1", "กข123", "sm-j7", "324234234", 1, 60000]);
                // intesert tb_language_config
                for (var i = 0; i < window.languages.length; i++) {
                    var query_lang_word = window.languages[i].replace(/\\n/g, '\n');
                    tx.executeSql("INSERT INTO tb_language_config (lang_id, lang_position, lang_word, lang_page) values" + query_lang_word);
                }
                //insert tb_vlanguage_config
                //tx.executeSql("INSERT INTO tb_vlanguage_config (lang_id, lang_version) values(?, ?)", ["1", "0"]);
                //in function setDBshipment
                //tx.executeSql("INSERT INTO tb_ship_profile (ship_id, driver_id, ship_numspot, ship_status, spot_seq) values(?, ?, ?, ?,?)",["ship_id", "driver_id", 1, "ship_status",1]);
                //insert tb_spot_ship
                //tx.executeSql("INSERT INTO tb_spot_ship (spot_no, ship_id, spot_id, spot_seq, spot_sel_datetime, spot_sour_name, spot_sour_add, spot_sour_gate, spot_sour_date, spot_sour_time, spot_sour_fencid, spot_dest_name, spot_dest_add, spot_dest_gate, spot_dest_date, spot_dest_time, spot_dest_fencid, spot_start_mile, spot_smile_datetime, spot_arrive_mile, spot_amile_datetime, spot_otp, spot_otp_datetime, spot_status, spot_recipient)values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?)", [null, "ship_id", null, "spot_seq", "datetime()", "spot_sour_name", "spot_sour_add", "spot_sour_gate", null, null, "spot_sour_fencid", "spot_dest_name", "spot_dest_add", "spot_dest_gate", null, null, "spot_dest_fencid", 1, null, 1, null, "spot_otp", null, "spot_status", "spot_recipient"]);
                //insert tb_product_type
                tx.executeSql("INSERT INTO tb_product_type (protype_id, protype_name) values(?, ?)", ["protype_id", "protype_name"]);
                //insert driver_profile
                //tx.executeSql("INSERT INTO driver_profile (driver_id, driver_name, driver_sname) values(?,?,?)", ["", "", ""]);
                //insert tb_vproduct_type
                tx.executeSql("INSERT INTO tb_vproduct_type (vprotype_version) values(?)", ["Chang00159"]);
                //insert tb_product_type
                tx.executeSql("INSERT INTO tb_product_type (protype_id, protype_name) values(?, ?)", ["PT01", "ขวดแก้ว"]);
                tx.executeSql("INSERT INTO tb_product_type (protype_id, protype_name) values(?, ?)", ["PT02", "ถัง"]);
                tx.executeSql("INSERT INTO tb_product_type (protype_id, protype_name) values(?, ?)", ["PT03", "ขวดพลาสติก"]);
                //insert tb_product_cause
                // tx.executeSql("INSERT INTO tb_product_cause (procause_id, protype_id, procause_name) values(?, ?, ?)", ["PC04578", "PT03", "แตกระหว่างส่ง"]);
                // tx.executeSql("INSERT INTO tb_product_cause (procause_id, protype_id, procause_name) values(?, ?, ?)", ["PC04579", "PT04", "แตกก่อนขึ้นของ"]);
                //insert tb_spot_product
                //tx.executeSql("INSERT INTO tb_spot_product (ship_id ,spot_id ,protype_id ,pro_id , pro_name, pro_code, spotpro_num) values(?, ?, ?, ?, ?, ?, ?)", ["15486597", "021546584", "PT03", "Chang00159", "chang", "ggg", 1000]);
                //insert tb_spot_typeunload
                //tx.executeSql("INSERT INTO tb_spot_typeunload (ship_id ,spot_id ,spotun_type ,spotun_image_1  ,spotun_image_2  ,spotun_image_3 ) values(?, ?, ?, ?, ?, ?)", ["15486597", "021546584", "L", "spotun_image_1", "spotun_image_2", "spotun_image_3"]);
                //insert tb_spot_typeunload
                //tx.executeSql("INSERT INTO tb_spot_action (spoact_id ,ship_id   ,spot_id   ,spotact_status    ,spotact_image_1   ,spotact_image_2   ,spotact_image_3   ) values(?, ?, ?, ?, ?, ?, ?)", ["SP1546", "15486597", "021546584", "C", "spotun_image_1", "spotun_image_2", "spotun_image_3"]);
                //insert tb_spot_config
                //tx.executeSql("INSERT INTO tb_spot_config (ship_id, spot_id, spotc_scenario, spotc_status) values(?, ?, ?, ?)", ["15486597", "021546584", 2, "P"]);
                //
            }, function(error) {
                console.log('Transaction insert ERROR: ' + error.message);
                deferred.reject(error);
            }, function() {
                console.log('Transaction insert success.');
                deferred.resolve("insert OK")
            });
            return deferred.promise;
        }
    }
}])


.factory('Shipments', function($cordovaSQLite) {

    function is_in_polygon(myLatlng, PolygonLatlng) {
        var inside = false;
        var pointX = myLatlng.lat;
        var pointY = myLatlng.lng;
        var startX, startY, endX, endY;
        console.log( PolygonLatlng.length);
        for (var i = 0; i < PolygonLatlng.length; i++) {
            startX = endX;
            startY = endY;
            Polygon = PolygonLatlng[i];
            endX = Polygon.lat;
            endY = Polygon.lng;
            inside ^= (endY > pointY ^ startY > pointY) /* ? pointY inside [startY;endY] segment ? */ && /* if so, test if it is under the segment */
                ((pointX - endX) < (pointY - endY) * (startX - endX) / (startY - endY));
        }
        return inside;
    }

    function setDBshipment(ship_id, driver_id, ship_numspot, ship_status, callback) {
        var query = "SELECT ship_id FROM tb_ship_profile WHERE ship_id = ?";
        $cordovaSQLite.execute(db, query, [ship_id]).then(function(data) {
            if (data.rows.length == 0) {
                var queryINSERT = "INSERT INTO tb_ship_profile (ship_id, driver_id, ship_numspot, ship_status) values(?, ?, ?, ?)";
                $cordovaSQLite.execute(db, queryINSERT, [ship_id, driver_id, ship_numspot, ship_status]).then(function(res) {
                    callback(1);
                    console.log("insert setDBshipment success");
                }, function(err) {
                    console.log("insert function setDBshipment error" + err.message);
                    callback(0);
                });
            } else {
                var queryUPDATE = "UPDATE tb_ship_profile SET driver_id = ?, ship_numspot= ?, ship_status= ? WHERE ship_id = ?";
                $cordovaSQLite.execute(db, queryUPDATE, [driver_id, ship_numspot, ship_status, ship_id]).then(function(res) {
                    console.log("upadte setDBshipment success ");
                    callback(1);
                }, function(err) {
                    console.log("update setDBshipment error" + err.message);
                    callback(0);
                });
            }
        }, function(err) {
            callback(0);
            console.log("insert function setDBshipment error" + err.message);
        });

    }

    function setDBship_status(ship_id, ship_status, spot_seq, ship_spot_id, callback) {
        if (ship_spot_id == null && spot_seq == null) {
            var query = "UPDATE tb_ship_profile SET ship_status = ? WHERE ship_id = ?";
            arr = [ship_status, ship_id];
        } else {
            var query = "UPDATE tb_ship_profile SET ship_status = ?, spot_seq = ?, ship_spot_id=? WHERE ship_id = ?";
            arr = [ship_status, spot_seq, ship_spot_id, ship_id];
        }
        $cordovaSQLite.execute(db, query, arr).then(function(res) {
            callback(1);
            console.log("update setDBship_status success");
        }, function(err) {
            callback(0);
            console.log("update setDBship_status error" + err.message);
        });
    }

    function getDBship_status(ship_id, callback) {
        var result = [];
        var query = "SELECT * FROM tb_ship_profile WHERE ship_id = ?;";
        $cordovaSQLite.execute(db, query, [ship_id]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBship_status success");
        }, function(err) {
            callback(0);
            console.log("select getDBship_status error" + err.message);
        });
    }

    function setDBdriver(driver_id, driver_name, callback) {
        var split = driver_name.split(" ");
        var name = split[0] + " " + split[1];
        var query = "DELETE FROM driver_profile";
        $cordovaSQLite.execute(db, query).then(function(data) {
            var queryINSERT = "INSERT INTO driver_profile (driver_id, driver_name, driver_sname) values(?, ?, ?)";
            $cordovaSQLite.execute(db, queryINSERT, [driver_id, name, split[2]]).then(function(res) {
                console.log("update setDBdriver success");
                callback(1);
            }, function(err) {
                callback(0);
                console.log("update setDBdriver error" + err.message);
            });
        }, function(error) {
            callback(0);
            console.log("update setDBdriver error");
        });
    }

    function getDBdriver(driver_id, callback) { // kom request Complate
        var query = "SELECT * FROM driver_profile WHERE driver_id = ?";
        $cordovaSQLite.execute(db, query, [driver_id]).then(function(res) {
            callback(res);
            console.log("select getDBdriver success");
        }, function(err) {
            callback(0);
            console.log("select getDBdriver error");
        });
    }

    function setDBprocause(ship_id, json, callback){
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM tb_product_cause");
            for (var i = 0; i < json.length; i++) {
                tx.executeSql("INSERT INTO tb_product_cause (ship_id, spot_id, procause_id, procause_name, protype_id) values(?, ?, ?, ?, ?)", [ship_id, json[i].FreightId, json[i].DamageCauseId, json[i].DamageCauseMsg, null]);
            }
        }, function(error) {
            callback(0);
            console.warn("INSERT setDBprocause : error" + error.message);
        }, function() {
            callback(1);
            console.log("INSERT setDBprocause : success");
        });
    }

    function getDBprocause(ship_id, spot_id, callback){
        var result = [];
        var query = "SELECT ship_id, spot_id, procause_id, procause_name, procause_timestamp FROM tb_product_cause WHERE ship_id = ? AND spot_id = ? ;";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBspot success");
        }, function(err) {
            callback(0);
            console.warn("select getDBspot error" + err.message);
        });
    }

    function setDBreware(ship_id, json, callback){
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM tb_return_ware;");
            for (var i = 0; i < json.length; i++) {
                tx.executeSql("INSERT INTO tb_return_ware (ship_id, spot_id, rew_id, rew_name) values(?, ?, ?, ?)", [ship_id, json[i].FreightId, json[i].EquipmentId, json[i].EquipmentMsg]);
            }
        }, function(error) {
            callback(0);
            console.warn("INSERT setDBreware : error" + error.message);
        }, function() {
            callback(1);
            console.log("INSERT setDBreware : success");
        });
    }

    function getDBreware(ship_id, spot_id, callback){
        var result = [];
        var query = "SELECT rew_no, ship_id, spot_id, rew_id, rew_name, rew_timestamp FROM tb_return_ware WHERE ship_id = ? AND spot_id = ?;";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBreware success");
        }, function(err) {
            callback(0);
            console.warn("select getDBreware error" + err.message);
        });
    }

    function chkfencing(ship_id, spot_id, state, myLatlng, callback) {
        var cuttedPick = [];
        var query = "SELECT * FROM tb_spot_fencing WHERE ship_id = ? AND spot_id = ? AND spotf_state = ? ;";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id, state]).then(function(data) {
            var PickFromPolygon1 = data.rows.item(0).from_polygon1;
            var PickFromPolygon2 = data.rows.item(0).from_polygon2;
            var PickFromPolygon3 = data.rows.item(0).from_polygon3;
            var i=0;
            if (PickFromPolygon1 != "" && PickFromPolygon1 != undefined) {
                data = [];
                var cutPolygon1 = PickFromPolygon1.split(",");
                for (var cut = 0; cut < cutPolygon1.length; cut++) {
                    data.push({
                        lat: cutPolygon1[cut].split(" ")[0],
                        lng: cutPolygon1[cut].split(" ")[1],
                    });
                }
                i++;
                cuttedPick.push(data);
            }
            if (PickFromPolygon2 != "" && PickFromPolygon2 != undefined) {
                data = [];
                var cutPolygon2 = PickFromPolygon2.split(",");
                for (var cut = 0; cut < cutPolygon2.length; cut++) {
                    data.push({
                        lat: cutPolygon2[cut].split(" ")[0],
                        lng: cutPolygon2[cut].split(" ")[1],
                    });
                }
                 i++;
                cuttedPick.push(data);
            }
            if (PickFromPolygon3 != "" && PickFromPolygon3 != undefined) {
               data = [];
                var cutPolygon3 = PickFromPolygon3.split(",");
                for (var cut = 0; cut < cutPolygon3.length; cut++) {
                    data.push({
                        lat: cutPolygon3[cut].split(" ")[0],
                        lng: cutPolygon3[cut].split(" ")[1],
                    });
                }
                 i++;
                cuttedPick.push(data);
            }
            //console.log(JSON.stringify(cuttedPick));
            // c = cuttedPick[0];
            // console.log(c[0].lat);

            //----------------
            //var myLatlng = {lat:16.476626,lng:102.811343};
            //-------------------

            var count = cuttedPick.length;
            //console.log("count "+count);
            var checkMyLat = {lat:null,lng:null};
            var checkIn = 0;
            if(JSON.stringify(myLatlng) == JSON.stringify(checkMyLat)){
                checkIn = 2;
                //console.log("in myLatlng = null");
            }else{
                for (var i = 0; i < count ; i++) {
                    result = is_in_polygon(myLatlng, cuttedPick[i]);
                    if(result==1){
                        checkIn = 1 
                        //console.log("checkIn = "+checkIn);
                    }
                }
            }
               //console.log("checkIn = "+result);
            callback(checkIn);
            console.log("select chkfencing success");
        }, function(err) {
            callback(0);
            console.warn("select chkfencing error" + err.message);
        });
    }

    return {
        setDBshipment: setDBshipment,
        setDBship_status: setDBship_status,
        setDBdriver: setDBdriver,
        getDBdriver: getDBdriver,
        getDBship_status: getDBship_status,
        setDBprocause: setDBprocause,
        getDBprocause: getDBprocause,
        setDBreware: setDBreware,
        getDBreware: getDBreware,
        chkfencing: chkfencing,
    };
})

.factory('Spots', function($cordovaSQLite, $q) {
    //AND spot_arrive_mile = ?
    function getDBspot(ship_id, callback) {
        var result = [];
        var query = "SELECT * FROM tb_spot_ship WHERE ship_id = ? ORDER BY spot_seq ASC;";
        $cordovaSQLite.execute(db, query, [ship_id]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBspot success");
        }, function(err) {
            callback(0);
            console.log("select getDBspot error");
        });
    }

    function setDBspot(json, StartMile, callback) {//spot_otp คมจะส่งมาให้

        db.transaction(function(tx) {
                var i = 0;

                function abc(i) {
                    if (i < json.length) {
                        var spot_sour_datetime = json[i].LegOnloadDate.split(" ");
                        var spot_dest_datetime = json[i].LegTargetDate.split(" ");
                        tx.executeSql("SELECT spot_id FROM tb_spot_ship WHERE ship_id = ? AND spot_id = ?", [json[i].ShipmentId, json[i].FreightId], function(tx, res) {
                            var len = res.rows.length;
                            if (len > 0) {
                                
                                tx.executeSql("UPDATE tb_spot_ship SET spot_seq=?, spot_sel_datetime=?, spot_sour_name=?, spot_sour_add=?, spot_sour_gate=?, spot_sour_date=?, spot_sour_time=?, spot_sour_fencid=?, spot_dest_name=?, spot_dest_add=?, spot_dest_gate=?, spot_dest_date=?, spot_dest_time=?, spot_dest_fencid=?, spot_start_mile=?, spot_smile_datetime=?, spot_arrive_mile=?, spot_amile_datetime=?, spot_otp=?, spot_otp_datetime=?, spot_status=?, spot_recipient=? WHERE ship_id = ? AND spot_id = ?",[json[i].OrderRank, null, json[i].PickFrom, json[i].PickFromAddr, null, spot_sour_datetime[0], spot_sour_datetime[1], null, json[i].SendTo, json[i].SendToAddr, null, spot_dest_datetime[0], spot_dest_datetime[1], null, StartMile, null, 1, null, json[i].OTP, null, "spot_status", "spot_recipient", json[i].ShipmentId, json[i].FreightId]);
 
                                i++;
                                abc(i);
                            } else {
                                
                                tx.executeSql("INSERT INTO tb_spot_ship (ship_id, spot_id, spot_seq, spot_sel_datetime, spot_sour_name, spot_sour_add, spot_sour_gate, spot_sour_date, spot_sour_time, spot_sour_fencid, spot_dest_name, spot_dest_add, spot_dest_gate, spot_dest_date, spot_dest_time, spot_dest_fencid, spot_start_mile, spot_smile_datetime, spot_arrive_mile, spot_amile_datetime, spot_otp, spot_otp_datetime, spot_status, spot_recipient)values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [json[i].ShipmentId, json[i].FreightId, json[i].OrderRank, null, json[i].PickFrom, json[i].PickFromAddr, null, spot_sour_datetime[0], spot_sour_datetime[1], null, json[i].SendTo, json[i].SendToAddr, null, spot_dest_datetime[0], spot_dest_datetime[1], null, StartMile, null, 0, null, json[i].OTP, null, "spot_status", "spot_recipient"]);

                                i++;
                                abc(i);
                            }
                        }, function(err) {
                            console.log(err.message);
                        });
                    }
                }
                abc(i);

                var PickPorigon = [];
                for (var m = 0; m < json.length; m++) {
                    PickPorigon.push({
                        ship_id: json[m].ShipmentId,
                        spot_id: json[m].FreightId,
                        PickFromArea1: json[m].PickFromArea1,
                        PickFromPolygon1: json[m].PickFromPolygon1,
                        PickFromArea2: json[m].PickFromArea2,
                        PickFromPolygon2: json[m].PickFromPolygon2,
                        PickFromArea3: json[m].PickFromArea3,
                        PickFromPolygon3: json[m].PickFromPolygon3,
                        spotf_state: "S",
                    });
                }
                var SendPorigon = [];
                for (var n = 0; n < json.length; n++) {
                    SendPorigon.push({
                        ship_id: json[n].ShipmentId,
                        spot_id: json[n].FreightId,
                        SendToArea1: json[n].SendToArea1,
                        SendToPolygon1: json[n].SendToPolygon1,
                        SendToArea2: json[n].SendToArea2,
                        SendToPolygon2: json[n].SendToPolygon2,
                        SendToArea3: json[n].SendToArea3,
                        SendToPolygon3: json[n].SendToPolygon3,
                        spotf_state: "D",
                    });
                }
                var j = 0;

                function setDBspot_fencing(j) {
                    if (j < json.length) {
                        tx.executeSql("SELECT spot_id FROM tb_spot_fencing WHERE ship_id = ? AND spot_id = ?", [json[j].ShipmentId, json[j].FreightId], function(tx, res) {
                            var len = res.rows.length;

                            if (len > 0) {
                                tx.executeSql("UPDATE tb_spot_fencing SET ship_id = ?, spot_id = ?, spotf_state = ?, spot_seq = ?, from_area1 = ?, from_polygon1 = ?,from_area2 = ?, from_polygon2 = ?,from_area3 = ?, from_polygon3 = ? WHERE ship_id = ? AND spot_id = ? AND spotf_state = ?", [PickPorigon[j].ship_id, PickPorigon[j].spot_id, PickPorigon[j].spotf_state, json[j].OrderRank, PickPorigon[j].PickFromArea1, PickPorigon[j].PickFromPolygon1, PickPorigon[j].PickFromArea2, PickPorigon[j].PickFromPolygon2, PickPorigon[j].PickFromArea3, PickPorigon[j].PickFromPolygon3, json[j].ShipmentId, json[j].FreightId, PickPorigon[j].spotf_state]);

                                j++;
                                setDBspot_fencing(j);
                            } else {
                                tx.executeSql("INSERT INTO tb_spot_fencing (ship_id, spot_id, spotf_state, spot_seq, from_area1, from_polygon1,from_area2, from_polygon2,from_area3, from_polygon3) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [PickPorigon[j].ship_id, PickPorigon[j].spot_id, PickPorigon[j].spotf_state, json[j].OrderRank, PickPorigon[j].PickFromArea1, PickPorigon[j].PickFromPolygon1, PickPorigon[j].PickFromArea2, PickPorigon[j].PickFromPolygon2, PickPorigon[j].PickFromArea3, PickPorigon[j].PickFromPolygon3]);
                                tx.executeSql("INSERT INTO tb_spot_fencing (ship_id, spot_id, spotf_state, spot_seq, from_area1, from_polygon1,from_area2, from_polygon2,from_area3, from_polygon3) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [SendPorigon[j].ship_id, SendPorigon[j].spot_id, SendPorigon[j].spotf_state, json[j].OrderRank, SendPorigon[j].SendToArea1, SendPorigon[j].SendToPolygon1, SendPorigon[j].SendToArea2, SendPorigon[j].SendToPolygon2, SendPorigon[j].SendToArea3, SendPorigon[j].SendToPolygon3]);

                                j++;
                                setDBspot_fencing(j);
                            }
                        });
                    }
                }
                setDBspot_fencing(j);

            },
            function(error) {
                callback(0);
                console.log('Transaction setDBspot ERROR: ' + error.message);
            },
            function() {
                callback(1);
                console.log('Transaction setDBspot success.');
            });
    }

    function getDBnext_page(ship_id, spot_id, OrderRank, callback) {
        var result = [];
        var query = "SELECT scenario_id, spotc_scenario, spotc_seq FROM tb_spot_config WHERE ship_id = ? AND spot_id = ? AND spotc_seq > ? ORDER BY spotc_seq ASC  LIMIT 1";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id, OrderRank]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBnext_page success");
        }, function(err) {
            callback(0);
            console.log("select getDBnext_page error" + err.message);
        });
    }

    function setDBspot_config(shipmentId, json, spotc_status, callback) {
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM tb_spot_config WHERE ship_id = ?", [shipmentId]);
            for (var i = 0; i < json.length; i++) {
                tx.executeSql("INSERT INTO tb_spot_config (ship_id, spot_id, scenario_id, spotc_scenario, spotc_status, spotc_seq) values(?, ?, ?, ?, ?, ?)", [shipmentId, json[i].FreightId, json[i].ScenarioId, json[i].Scenario, spotc_status, json[i].OrderRank]);
            }
        }, function(error) {
            callback(0);
            console.log("insert function setDBspot_config error");
        }, function() {
            callback(1);
            console.log("insert function setDBspot_config success");
        });
    }

    function setDBspot_product(shipmentId, json, callback) {
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM tb_spot_product WHERE ship_id = ?", [shipmentId]);
            for (var i = 0; i < json.length; i++) {
                tx.executeSql("INSERT INTO tb_spot_product (ship_id, spot_id, pro_id, pro_name, spotpro_num, pro_code, OrderRank) values(?, ?, ?, ?, ?, ?, ?)", [shipmentId, json[i].FreightId, json[i].FreightItemId, json[i].ProductShortMsg, json[i].Qty, json[i].ProductCode, json[i].OrderRankFreightItem]);
            }
        }, function(error) {
            callback(0);
            console.warn("insert function setDBspot_product error" + error.message);
        }, function() {
            callback(1);
            console.log("insert function setDBspot_product success");
        });
    }

    function getDBspot_product(ship_id, spot_id, callback){// get string ship_id, spot_id,
        var result = [];
        var query = "SELECT * FROM tb_spot_product WHERE ship_id = ? AND spot_id = ?;";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBspot_product success");
        }, function(err) {
            callback(0);
            console.warn("select getDBspot_product error" + err.message);
        });
    }

    function updateDBspot(field_name, ship_id, spot_id, data, callback) {
        var query = "UPDATE tb_spot_ship SET " + field_name + " = ? WHERE ship_id=? AND spot_id = ?";
        $cordovaSQLite.execute(db, query, [data, ship_id, spot_id]).then(function(res) {
            callback(1);
            console.log("update updateDBspot success");
        }, function(err) {
            callback(0);
            console.log("update updateDBspot error");
        });
    }

    function getDBspot_fencing(ship_id, spot_id, spotf_state, callback){
        var result = [];
        var query = "SELECT * FROM tb_spot_fencing WHERE ship_id = ? AND spot_id = ? AND spotf_state = ?";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id, spotf_state]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBspot_fencing success");
        }, function(err) {
            callback(0);
            console.log("select getDBspot_fencing error" + err.message);
        });
    }

    function getDBspot_otp(ship_id, spot_id, callback){
        var query = "SELECT spot_otp FROM tb_spot_ship WHERE ship_id = ? AND spot_id = ?";
        $cordovaSQLite.execute(db, query, [ship_id, spot_id]).then(function(data) {
            callback(data.rows.item(0).spot_otp);
            console.log("select getDBspot_otp success");
        }, function(err) {
            callback(0);
            console.log("select getDBspot_otp error" + err.message);
        });
    }

    function getDBnextjob(ship_id, callback){
        var query = "SELECT count(*) count FROM tb_spot_ship WHERE ship_id = ? AND spot_arrive_mile = 0";
        $cordovaSQLite.execute(db, query, [ship_id]).then(function(data) {
            count = data.rows.item(0).count;
            if( count > 0){
                callback(1);    
            }else if(count == 0){
                callback(2);
            }
            console.log("select getDBspot_fencing success");
        }, function(err) {
            callback(0);
            console.log("select getDBnextjob error" + err.message);
        });

    }

    return {
        getDBspot: getDBspot,
        setDBspot: setDBspot,
        getDBnext_page: getDBnext_page,
        setDBspot_config: setDBspot_config,
        setDBspot_product: setDBspot_product,
        getDBspot_product: getDBspot_product,
        updateDBspot: updateDBspot,
        getDBspot_fencing: getDBspot_fencing,
        getDBspot_otp: getDBspot_otp,
        getDBnextjob: getDBnextjob,
    };
})

.factory('Deviceconfig', function($cordovaSQLite, $q) {

    function getDB_device_config(callback) {
        var result = [];
        var query = "SELECT * FROM tb_device_config LIMIT 1;";
        $cordovaSQLite.execute(db, query).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDB_device_config success");
        }, function(err) {
            callback(0);
            console.log("select getDB_device_config error" + err.message);
        });
    }

    function setDB_device_config(devc_driver_id, devc_driver_domain, devc_dev_uid, devc_dev_band, devc_dev_id, devc_lang_id, devc_truck_id, devc_model, devc_serial, callback) { //complate
        var query = "SELECT * FROM tb_device_config LIMIT 1;";
        $cordovaSQLite.execute(db, query, []).then(function(result) {
            if (result.rows.length > 0) {
                console.log(result.rows.length + " rows found. setDB_device_config");
                console.log(result.rows.item(0).devc_dev_uid);
                for (var i = 0; i < result.rows.length; i++) {
                    if (devc_driver_id == null) {
                        devc_driver_id = result.rows.item(i).devc_driver_id;
                    }
                    if (devc_driver_domain == null) {
                        devc_driver_domain = result.rows.item(i).devc_driver_domain;
                    }
                    if (devc_dev_uid == null) {
                        devc_dev_uid = result.rows.item(i).devc_dev_uid;
                    }
                    if (devc_dev_band == null) {
                        devc_dev_band = result.rows.item(i).devc_dev_band;
                    }
                    if (devc_dev_id == null) {
                        devc_dev_id = result.rows.item(i).devc_dev_id;
                    }
                    if (devc_lang_id == null) {
                        devc_lang_id = result.rows.item(i).devc_lang_id;
                    }
                    if (devc_truck_id == null) {
                        devc_truck_id = result.rows.item(i).devc_truck_id;
                    }
                    if (devc_model == null) {
                        devc_model = result.rows.item(i).devc_model;
                    }
                    if (devc_serial == null) {
                        devc_serial = result.rows.item(i).devc_serial;
                    }
                }
                var queryUPDATE = "UPDATE tb_device_config SET devc_driver_id = ?, devc_driver_domain = ?, devc_dev_uid = ?, devc_dev_band = ?, devc_dev_id = ?, devc_lang_id = ?, devc_truck_id = ?, devc_model = ?, devc_serial = ?";
                $cordovaSQLite.execute(db, queryUPDATE, [devc_driver_id, devc_driver_domain, devc_dev_uid, devc_dev_band, devc_dev_id, devc_lang_id, devc_truck_id, devc_model, devc_serial]).then(function(success) {
                    console.log("Update setDB_device_config OK");
                    callback(1);
                }, function(err) {
                    console.log("Update setDB_device_config fail!");
                    callback(0);
                });
            } else {
                var queryINSERT = "INSERT INTO tb_device_config (devc_driver_id, devc_driver_domain, devc_dev_uid, devc_dev_band, devc_dev_id, devc_lang_id, devc_truck_id, devc_model, devc_serial) values(?, ?, ?, ?, ?, ?, ?, ?, ?)"
                $cordovaSQLite.execute(db, queryINSERT, [devc_driver_id, devc_driver_domain, devc_dev_uid, devc_dev_band, devc_dev_id, devc_lang_id, devc_truck_id, devc_model, devc_serial]).then(function(success) {
                    console.log("insert setDB_device_config first OK");
                    callback(1);
                }, function(err) {
                    console.log("insert setDB_device_config first error!");
                    callback(0);
                });
            }

        })
    }
    // update 1 row ตาม field name
    function updateDB_device_config(field_name, data, callback) {
        var query = "UPDATE tb_device_config SET " + field_name + "= ?";
        $cordovaSQLite.execute(db, query, [data]).then(function(success) {
            callback(1);
            console.log("UPDATE tb_device_config : success");
        }, function(error) {
            callback(0);
            console.log("UPDATE tb_device_config : ERROR");
        });
    }

    return {
        getDB_device_config: getDB_device_config,
        setDB_device_config: setDB_device_config,
        updateDB_device_config: updateDB_device_config,
    };
})

.factory('Languages', function($cordovaSQLite) {
    //complate
    function setDBlangversion(lang_id, lang_version, callback) { //รอเรียกใช้
        var query = "DELETE FROM tb_vlanguage_config";
        $cordovaSQLite.execute(db, query).then(function(res) {
            var queryINSERT = "INSERT INTO tb_vlanguage_config (lang_version, lang_id) values(?, ?);";
            $cordovaSQLite.execute(db, queryINSERT, [lang_version, lang_id]).then(function(res) {
                callback(1);
                console.log("UPDATE setDBlangversion : success");
            }, function(err) {
                callback(0);
                console.log("UPDATE setDBlangversion error");
            });
        }, function() {
            callback(0);
            console.log("UPDATE setDBlangversion error");
        });

    }

    //complate
    function setDBlang(lang_id, json, callback) {
        db.transaction(function(tx) {
            tx.executeSql("DELETE FROM tb_language_config WHERE lang_id = " + lang_id);
            for (var i = 0; i < json.length; i++) {
                tx.executeSql("INSERT INTO tb_language_config (lang_id, lang_position, lang_word, lang_page) values(?,?,?,?)", [lang_id, json[i].LabelId, json[i].MsgTxt, json[i].PageId]);
            }
        }, function(error) {
            callback(0);
            console.log("UPDATE setDBlang : error");
        }, function() {
            callback(1);
            console.log("UPDATE setDBlang : success");
        });
        callback(1);
    }

    function getDBlang(lang_id, lang_page, callback) {
        var result = [];
        var query = "SELECT * FROM tb_language_config WHERE lang_id = ? AND lang_page = ?";
        $cordovaSQLite.execute(db, query, [lang_id, lang_page]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.table(result);
            console.log("UPDATE setDBlang : success");
        }, function(err) {
            callback(0);
            console.log("UPDATE setDBlang : error");
        });
    }

    function getDBverlang(lang_id, callback) {
        var result = [];
        var query = "SELECT * FROM tb_vlanguage_config WHERE lang_id = ?";
        $cordovaSQLite.execute(db, query, [lang_id]).then(function(data) {
            for (var i = 0; i < data.rows.length; i++) {
                result.push(data.rows.item(i));
            }
            callback(result);
            console.log("select getDBverlang : success");
        }, function(err) {
            callback(0);
            console.log("select getDBverlang : error");
        });
    }

    return {
        setDBlangversion: setDBlangversion,
        setDBlang: setDBlang,
        getDBlang: getDBlang,
        getDBverlang: getDBverlang
    };
})
