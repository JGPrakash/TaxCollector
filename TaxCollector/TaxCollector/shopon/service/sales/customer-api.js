﻿function CustomerAPI() {
    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        //$.server.webMethodGET("shopon/customer/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&store_no=" + localStorage.getItem("user_store_no"), callback);
        var url = "shopon/customer/?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression + "&store_no=" + localStorage.getItem("user_store_no");
        if (LCACHE.isEmpty(url)) {
            $.server.webMethodGET(url, function (result, obj) {
                LCACHE.set(url, result);
                callback(result, obj);
            });
        } else {
            callback(LCACHE.get(url));
        }
    }

    this.getValue = function (id, callback) {
        $.server.webMethodGET("shopon/customer/" + id.cust_no, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("shopon/customer/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("shopon/customer/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("shopon/customer/" + id, data, callback, callback, callback);
    }
}