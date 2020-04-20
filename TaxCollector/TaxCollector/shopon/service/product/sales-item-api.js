function SalesItemAPI() {

    var self = this;

    this.searchValues = function (start_record, end_record, filterExpression, sort_expression, callback) {
        //todo filter expression -> user_id, comp_prod_id, instance_id, prod_id, comp_prod_name, comp_id, email_id, user_name, phone_no, full_name, city, state, country
        $.server.webMethodGET("sales/item/?sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX + "&start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filterExpression) + "&sort_expression=" + sort_expression, callback);
    }

    this.getValue = function (id, callback) {
        //$.server.webMethodGET("sales/item/" + id.item_no + "?item_no=" + id.item_no + "&sales_tax_no=" + id.sales_tax_no, callback, callback);
        $.server.webMethodGET("sales/item/1?item_no=" + encodeURIComponent(id.item_no) + "&sales_tax_no=" + id.sales_tax_no, callback, callback);
    }

    this.postValue = function (data, callback, errorCallback) {
        $.server.webMethodPOST("sales/item/", data, callback, errorCallback);
    }

    this.putValue = function (id, data, callback, errorCallback) {
        $.server.webMethodPUT("sales/item/" + id, data, callback, errorCallback);
    }

    this.deleteValue = function (id, data, callback, errorCallback) {
        $.server.webMethodDELETE("sales/item/" + id, data, callback, callback, callback);
    }
    

    /*
    this.searchItem = function (start_record, end_record, filter_expression, sort_expression, callback) {
        $.server.webMethodGET("sale/item/search/main_search?start_record=" + start_record + "&end_record=" + end_record + "&filter_expression=" + encodeURIComponent(filter_expression) + "&sort_expression=" + sort_expression, callback);
    };

    this.searchItemCount = function (filter_expression, callback) {
        $.server.webMethodGET("sale/item/search/main_search_count?filter_expression=" + encodeURIComponent(filter_expression), callback);
    };



    this.searchVariationsMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("sale/variation/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchStocksMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("sale/variation/stock/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };

    this.searchPricesMain = function (item_no, store_no, callback) {
        $.server.webMethodGET("sale/variation/price/search/main_search?item_no=" + item_no + "&store_no=" + store_no, callback);
    };
    */


}