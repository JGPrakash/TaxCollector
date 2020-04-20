function WorkServiceAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("taxcollector/work/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("taxcollector/work/" + id.id, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("taxcollector/work/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("taxcollector/work/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("taxcollector/work/" + id, data, callback, callback, callback);
    }
}