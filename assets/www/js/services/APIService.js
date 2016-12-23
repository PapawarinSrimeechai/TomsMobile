//API url config
app.constant('appConfigApi', "http://tomsdev.apps.thaibev.com/TOMsAPI/api/AppConfig/")
    .constant('box', "http://10.100.1.1:4000/")
    .constant('shipmentApi', "http://tomsdev.apps.thaibev.com/TOMsAPI/api/Shipment/")
    .constant('boxApi', "http://tomsdev.apps.thaibev.com/TOMsAPI/api/TruckBox/")
    //API Service Factory Register
    .factory('APIService', function(AppConfigAPI, ShipmentAPI, BoxAPI, BatchAPI) {
        return {
            Shipment: ShipmentAPI,
            AppConfig: AppConfigAPI,
            Box: BoxAPI,
            Batch: BatchAPI
        }

    })


