app.factory('PageService', function() {

    var pages = [
        {
            page_id:'TM01',
            page_name:'app.loading'
        },
        {
            page_id:'TM02',
            page_name:'app.login'
        },
        {
            page_id:'TM03',
            page_name:'app.start'
        },
        {
            page_id:'TM06',
            page_name:'app.pickup'
        },
        {
            page_id:'TM07',
            page_name:'app.pickup-take-photo'
        },
        {
            page_id:'TM11',
            page_name:'app.pickup-loading'
        },
        {
            page_id:'TM12',
            page_name:'app.pickup-loading-take-photo'
        },
        {
            page_id:'TM16',
            page_name:'app.on-the-way'
        },
        {
            page_id:'TM17',
            page_name:'app.delivery'
        },
        {
            page_id:'TM18',
            page_name:'app.delivery-take-photo'
        },
        {
            page_id:'TM21',
            page_name:'app.load-product'
        },
        {
            page_id:'TM23',
            page_name:'app.delivery-loading'
        },
        {
            page_id:'TM24',
            page_name:'app.delivery-loading-take-photo'
        },
        {
            page_id:'TM26',
            page_name:'app.broken-list'
        },
        {
            page_id:'TM28',
            page_name:'app.broken-reason'
        },
        {
            page_id:'TM29',
            page_name:'app.broken-take-photo'
        },
        {
            page_id:'TM32',
            page_name:'app.otp'
        },
        {
            page_id:'TM33',
            page_name:'app.container-return-list'
        },
        {
            page_id:'TM34',
            page_name:'app.container-return-list'
        }
    ]

    var Scenario = [
        {
            Scenario_id:'4',
            page_name:'app.pickup'
        },
        {
            Scenario_id:'5',
            page_name:'app.pickup-loading'
        },
        {
            Scenario_id:'6',
            page_name:'app.on-the-way'
        },
        {
            Scenario_id:'7',
            page_name:'app.delivery'
        },
        {
            Scenario_id:'8',
            page_name:'app.delivery-loading'
        },
        {
            Scenario_id:'9',
            page_name:'app.broken-list'
        },
        {
            Scenario_id:'10',
            page_name:'app.otp'
        },
        {
            Scenario_id:'11',
            page_name:'app.container-return-list'
        }
    
    ]

    // find_page('TM01')
    function find_page(page_id){

        for(var i=0; i<pages.length; i++){
            if(pages[i].page_id == page_id){
                    var page_name = pages[i].page_name;
            }
        }
        return page_name;

    }
    function find_pageByscenarioId(Scenario_id){

        for(var i=0; i<Scenario.length; i++){
            if(Scenario[i].Scenario_id == Scenario_id){
                    var page_name = Scenario[i].page_name;
            }
        }
        return page_name;

    }
    

    return {
        find_page: find_page,
        find_pageByscenarioId: find_pageByscenarioId
    };
})

