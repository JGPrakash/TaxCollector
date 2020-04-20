function SettingsAPI() {

    this.searchValue = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> rep_no
        $.server.webMethodGET("shopon/settings/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }
}