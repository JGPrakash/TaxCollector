function SettingsAPI() {

    //search api to search purchase and sales bill
    this.getAllSettings = function ( callback) {
        $.server.webMethodGET("shopon/settings", callback);
    };

    //search api to search purchase and sales bill
    this.searchSettings = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("shopon/settings?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };
}