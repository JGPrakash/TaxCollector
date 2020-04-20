$.fn.stockReport = function() {
    return $.pageController.getPage(this, function(page, $$) {
        page.customerService = new CustomerService();
        page.dynaReportService = new DynaReportService();
        page.inventoryService = new InventoryService();
        page.reportService = new ReportService();

        page.reportAPI = new ReportAPI();
        page.itemAPI = new ItemAPI();
        page.vendorAPI = new VendorAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.stockReportAPI = new StockReportAPI();
        page.stockAPI = new StockAPI();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        var menu_ids = [];
        var item_list = [];
        document.title = "ShopOn - Stock Report";
        page.events = {
            btnGenerate_click: function () {
                var sort_expression = "";
                if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                    sort_expression = "purchase_stock desc"
                }
                if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                    sort_expression = "sales_stock desc"
                }
                var filter = {
                    viewMode: $$("ddlViewMode").selectedValue(),
                    fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                    language: $$("ddlLanguage").selectedValue(),
                    sort_expression: sort_expression,
                    search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
                }
                page.stockReportAPI.stockReport(filter, function (data) {
                    if (data.length == 0) {
                        $$("pnlGridTransaction").hide();
                        $$("pnlEmptyGrid").show();
                    }
                    else {
                        $$("pnlGridTransaction").show();
                        $$("pnlEmptyGrid").hide();
                        page.view.selectedTransaction(data);
                    }
                });
                var transDate = new Date(filter.toDate);
                transDate.setDate(transDate.getDate() - 1);
                var minusOneDay = transDate.getFullYear() + "-" + (((transDate.getMonth()+1) < 10) ? "0" + transDate.getMonth()+1 : transDate.getMonth()+1) + "-" + ((transDate.getDate() < 10) ? "0" + transDate.getDate() : transDate.getDate());
                var transaction_filter = {
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    //toDate: ($$("txtEndDate").getDate() == "") ? "" : minusOneDay + " 10:10:10",
                    getDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                }
                page.stockReportAPI.getStockSummary(transaction_filter, function (data) {
                    $$("lblOpeningStock").val(data[0].stock_qty);
                    $$("lblOpeningStockAmount").val(data[0].stock_amount);
                });
                var closing_filter = {
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                }
                page.stockReportAPI.getStockSummary(closing_filter, function (data) {
                    $$("lblTotalStock").val(data[0].stock_qty);
                    $$("lblTotalStockAmount").val(data[0].stock_amount);
                });
                page.stockReportAPI.getStockSummary(filter, function (data) {
                    $$("lblPurchaseStock").val(data[0].purchase_stock_qty);
                    $$("lblPurchaseStockAmount").val(data[0].purchase_stock_amount);
                });
                var stock_filter = {
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id")
                }
                page.stockReportAPI.getStockSummary(stock_filter, function (data) {
                    $$("lblCurrentStock").val(data[0].stock_qty);
                    $$("lblCurrentStockAmount").val(data[0].stock_amount);
                });
            },
            btnReport_click: function () {
                page.controls.pnlPrintingPopup.open();
                page.controls.pnlPrintingPopup.title("Report Type");
                page.controls.pnlPrintingPopup.rlabel("Report Type");
                page.controls.pnlPrintingPopup.width(500);
                page.controls.pnlPrintingPopup.height(200);
            },
            btnPrintJasperBill_click: function () {
                var bill_item = [];
                var hsn_code, hsn_name;
                var sl_no=1;
                var exp_type = $$("ddlExportType").selectedValue();
                var sort_expression = "";
                if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                    sort_expression = "purchase_stock desc"
                }
                if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                    sort_expression = "sales_stock desc"
                }
                var filter = {
                    viewMode: $$("ddlViewMode").selectedValue(),
                    fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                    toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                    vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                    item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                    main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                    store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                    comp_id: localStorage.getItem("user_company_id"),
                    expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                    language: $$("ddlLanguage").selectedValue(),
                    sort_expression: sort_expression,
                    search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
                }
                page.stockReportAPI.stockReport(filter, function (bill) {
                    $(bill).each(function (i, item) {
                        if ($$("ddlViewMode").selectedValue() == "ItemWiseStockReport" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryDay" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryWeek" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryMonth" || $$("ddlViewMode").selectedValue() == "Hot Purchase" || $$("ddlViewMode").selectedValue() == "Hot Sales") {
                            hsn_code = item.hsn_code;
                            hsn_name = "HSN Code";
                        }
                        else if ($$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All") {
                            hsn_code = item.variation_name;
                            hsn_name = "Variation";
                        }
                        else {
                            hsn_code = item.variation_name;
                            hsn_name = "Variation";
                        }
                        bill_item.push({
                            "SI No Name": "SI No",
                            "Item No Name": "Item No",
                            "Item Name": "Item",
                            "HSN Code Name": hsn_name,
                            "Opn Stock Name": "Opn Stock(" + $$("txtStartDate").getDate() + ")",
                            "Cls Stock Name": "Cls Stock(" + $$("txtEndDate").getDate() + ")",
                            "Pur Stock Name": "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")",
                            "Pur Value Name": "Pur Value",
                            "Sal Stock Name": "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")",
                            "Sal Value Name": "Sal Value",
                            "Profit Name": "Profit",
                            "SI No": sl_no+i,
                            "Item No": item.item_no,
                            "Item": item.item_name,
                            "HSN Code": hsn_code,
                            "Opn Stock": item.opening_stock,
                            "Cls Stock": item.closing_stock,
                            "Pur Stock": item.purchase_stock,
                            "Pur Value": item.purchase_value,
                            "Sal Stock": item.sales_stock,
                            "Sal Value": item.sales_value,
                            "Profit": item.profit
                        });
                    });
                    page.opening_summery(function (opening_stock_qty, opening_stock_amount){
                        page.stock_summery(function (current_stock_qty, current_stock_amount){
                            page.closing_summery(function (closing_stock_qty, closing_stock_amount){
                                page.purchase_stock_summery(function (purchase_stock_qty, purchase_stock_amount){
                                var accountInfo =
                                    {
                                        "CompName": CONTEXT.COMPANY_NAME,
                                        "ReportName": "Stock Report",
                                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + CONTEXT.COMPANY_ADDRESS_LINE2,
                                        "Summary Name": "Summary",
                                        "Stock Summary Name": "Opening / Closing Stock Summary",
                                        "Opening Stock Name": "Opening Stock",
                                        "Closing Stock Name": "Closing Stock",
                                        "Opening Stock Amount Name": "Opening Stock Amount",
                                        "Closing Stock Amount Name": "Closing Stock Amount",
                                        "Purchased Summary Name": "Purchased / Current Stock Summary",
                                        "Stock Purchased Name": "Stock Purchased",
                                        "Current Stock Name": "Current Stock",
                                        "Purchased Stock Amount Name": "Purchased Stock Amount",
                                        "Current Stock Amount Name": "Current Stock Amount",
                                        "Opening Stock": opening_stock_qty,
                                        "Closing Stock": closing_stock_qty,
                                        "Opening Stock Amount": opening_stock_amount,
                                        "Closing Stock Amount": closing_stock_amount,
                                        "Stock Purchased": purchase_stock_qty,
                                        "Current Stock": current_stock_qty,
                                        "Purchased Stock Amount": purchase_stock_amount,
                                        "Current Stock Amount": current_stock_amount,
                                        "Details": bill_item,
                                    }
                                GeneratePrint("ShopOnDev", "Stock-Report-Standard/velan-stock-standard-main-report.jrxml", accountInfo, exp_type);
                                })
                            })
                        })
                    })
                });
            },
            page_load: function () {
                page.controls.ddlItem.dataBind({
                    getData: function (term, callback) {
                        callback(item_list);
                    }
                });
                page.itemAPI.searchValues("", "", "", "", function (data) {
                    item_list = data;
                });
                
                page.vendorAPI.searchValues("", "", "", "", function (data) {
                    $$("ddldefsupplier").dataBind(data, "vendor_no", "vendor_name", "All");

                });
                $$("grdTransactions").width("80%");

                var previlageData = {
                    obj_type: "Product::CompProd::Store",
                    obj_id: localStorage.getItem("prod_id"),
                };
                page.userpermissionAPI.getValue(previlageData, function (store_data) {
                    $(store_data).each(function (i, item) {
                        item.obj_id = item.obj_id.split("::")[2];
                        menu_ids.push(item.obj_id);
                    });
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "store_no in (" + menu_ids.join(",") + ")",
                        sort_expression: ""
                    }
                    page.storeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlStore").dataBind(data, "store_no", "store_name", "All");
                        $$("ddlStore").selectedValue(getCookie("user_store_id"));
                    });
                });
                var languageData = [];
                languageData.push({ view_no: "'en'", view_name: "English" }, { view_no: "'ta'", view_name: "Tamil" });
                $$("ddlLanguage").dataBind(languageData, "view_no", "view_name", "Select");

                var searchViewData = [];
                searchViewData.push({ view_no: "ItemWiseStockReport", view_name: "Item Wise Stock Report" }, { view_no: "VariationWiseStockReport", view_name: "Variation Wise Stock Report" }, { view_no: "StockVariationWiseReport", view_name: "Stock Variation Wise Report" }, { view_no: "ItemWiseSummaryDay", view_name: "Item Wise Summary Day" }, { view_no: "ItemWiseSummaryWeek", view_name: "Item Wise Summary Week" }, { view_no: "ItemWiseSummaryMonth", view_name: "Item Wise Summary Month" }
                , { view_no: "VariationWiseStockSummaryDay", view_name: "Variation Wise Stock Summary Day" }, { view_no: "VariationWiseStockSummaryWeek", view_name: "Variation Wise Stock Summary Week" }, { view_no: "VariationWiseStockSummaryMonth", view_name: "Variation Wise Stock Summary Month" }
                , { view_no: "StockVariationWiseSummaryDay", view_name: "Stock Variation Wise Summary Day" }, { view_no: "StockVariationWiseSummaryWeek", view_name: "Stock Variation Wise Summary Week" }, { view_no: "StockVariationWiseSummaryMonth", view_name: "Stock Variation Wise Summary Month" }, { view_no: "Hot Purchase", view_name: "Hot Purchase" }, { view_no: "Hot Sales", view_name: "Hot Sales" });
                $$("ddlViewMode").dataBind(searchViewData, "view_no", "view_name");
                $$("ddlViewMode").selectionChange(function () {
                    if ($$("ddlViewMode").selectedValue() == "StockVariationWiseReport") {
                        if (CONTEXT.ENABLE_EXP_DATE) {
                            $$("pnlExpiry").show();
                        }
                        else {
                            $$("pnlExpiry").hide();
                        }
                    }
                    else {
                        $$("pnlExpiry").hide();
                    }
                    if ($$("ddlViewMode").selectedValue() == "ItemWiseStockReport") {
                        $$("pnlStock").show();
                    }
                    else {
                        $$("pnlStock").hide();
                    }
                });
                $$("txtStartDate").setDate(dbDate($.datepicker.formatDate("dd-mm-yy", new Date())));
                $$("txtEndDate").setDate(dbDate($.datepicker.formatDate("dd-mm-yy", new Date())));
                $$("lblTotalStock").disable(true);
                $$("lblTotalStockAmount").disable(true);

                page.mainproducttypeAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlMainProductType").dataBind(data, "mpt_no", "mpt_name", "None");
                });
            }
        }
        page.stock_summery = function (callback) {
            var current_stock_qty, current_stock_amount;
            var stock_filter = {
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                comp_id: localStorage.getItem("user_company_id")
            }
            page.stockReportAPI.getStockSummary(stock_filter, function (data4) {
                current_stock_qty = data4[0].stock_qty;
                current_stock_amount = data4[0].stock_amount;
                if (callback != undefined && data4.length > 0) {
                    callback(current_stock_qty, current_stock_amount);
                } else {
                    current_stock_qty = 0;
                    current_stock_qty = 0;
                    callback(current_stock_qty, current_stock_amount);
                }
            });
        }
        page.purchase_stock_summery = function (callback) {
            var sort_expression = "";
            if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                sort_expression = "purchase_stock desc"
            }
            if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                sort_expression = "sales_stock desc"
            }
            var purchase_stock_qty, purchase_stock_amount;
            var filter = {
                viewMode: $$("ddlViewMode").selectedValue(),
                fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                language: $$("ddlLanguage").selectedValue(),
                sort_expression: sort_expression,
                search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
            }
            page.stockReportAPI.getStockSummary(filter, function (data3) {
                purchase_stock_qty = data3[0].purchase_stock_qty;
                purchase_stock_amount = data3[0].purchase_stock_amount;
                if (callback != undefined && data3.length > 0) {
                    callback(purchase_stock_qty, purchase_stock_amount);
                } else {
                    purchase_stock_qty = 0;
                    purchase_stock_amount = 0;
                    callback(purchase_stock_qty, purchase_stock_amount);
                }
            });
        }
        page.closing_summery = function (callback) {
            var closing_stock_qty, closing_stock_amount;
            var closing_filter = {
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
            }
            page.stockReportAPI.getStockSummary(closing_filter, function (data2) {
                closing_stock_qty = data2[0].stock_qty;
                closing_stock_amount = data2[0].stock_amount;
                if (callback != undefined && data2.length > 0) {
                    callback(closing_stock_qty, closing_stock_amount);
                } else {
                    closing_stock_qty = 0;
                    closing_stock_amount = 0;
                    callback(closing_stock_qty, closing_stock_amount);
                }
            });
        }
        page.opening_summery = function (callback) {
            var sort_expression = "";
            if ($$("ddlViewMode").selectedValue() == "Hot Purchase") {
                sort_expression = "purchase_stock desc"
            }
            if ($$("ddlViewMode").selectedValue() == "Hot Sales") {
                sort_expression = "sales_stock desc"
            }
            var opening_stock_qty, opening_stock_amount;
            var filter = {
                viewMode: $$("ddlViewMode").selectedValue(),
                fromDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                toDate: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
                store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                expiry_view: $$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All" ? "" : $$("ddlexpiryview").selectedValue(),
                language: $$("ddlLanguage").selectedValue(),
                sort_expression: sort_expression,
                search_stock: ($$("ddlStock").selectedValue() == "All") ? "" : $$("ddlStock").selectedValue()
            }
            var transDate = new Date(filter.toDate);
            transDate.setDate(transDate.getDate() - 1);
            var minusOneDay = transDate.getFullYear() + "-" + (((transDate.getMonth() + 1) < 10) ? "0" + transDate.getMonth() + 1 : transDate.getMonth() + 1) + "-" + ((transDate.getDate() < 10) ? "0" + transDate.getDate() : transDate.getDate());
            var transaction_filter = {
                item_no: ($$("ddlItem").selectedValue() == null || $$("ddlItem").selectedValue() == "-1") ? "" : $$("ddlItem").selectedValue(),
                store_no: $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                comp_id: localStorage.getItem("user_company_id"),
                //toDate: ($$("txtEndDate").getDate() == "") ? "" : minusOneDay + " 10:10:10",
                getDate: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                vendor_no: ($$("ddldefsupplier").selectedValue() == null || $$("ddldefsupplier").selectedValue() == "-1") ? "" : $$("ddldefsupplier").selectedValue(),
                main_prod_type_no: ($$("ddlMainProductType").selectedValue() == null || $$("ddlMainProductType").selectedValue() == "-1") ? "" : $$("ddlMainProductType").selectedValue(),
            }
            page.stockReportAPI.getStockSummary(transaction_filter, function (data1) {
                opening_stock_qty = data1[0].stock_qty;
                opening_stock_amount = data1[0].stock_amount;
                if (callback != undefined && data1.length>0) {
                    callback(opening_stock_qty, opening_stock_amount);
                } else {
                    opening_stock_qty = 0;
                    opening_stock_amount = 0;
                    callback(opening_stock_qty, opening_stock_amount);
                }
            });
        }
        page.view = {
            selectedTransaction: function (data) {
                $$("grdTransactions").height("480px");
                $$("grdTransactions").width("100%");
                if ($$("ddlViewMode").selectedValue() == "ItemWiseStockReport" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryDay" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryWeek" || $$("ddlViewMode").selectedValue() == "ItemWiseSummaryMonth" || $$("ddlViewMode").selectedValue() == "Hot Purchase" || $$("ddlViewMode").selectedValue() == "Hot Sales") {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "90px", 'dataField': "item_no", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "180px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "HSN Code", 'rlabel': 'HSN Code', 'width': "120px", 'dataField': "hsn_code", filterType: "Text" },
                            { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "145px", 'dataField': "opening_stock", filterType: "Text" },
                            { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "145px", 'dataField': "closing_stock", filterType: "Text" },
                            { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "purchase_stock", filterType: "Text" },
                            { 'name': "Pur Value", 'width': "130px", 'dataField': "purchase_value", filterType: "Text" },
                            { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "220px", 'dataField': "sales_stock", filterType: "Text" },
                            //{ 'name': "Sal Value", 'width': "110px", 'dataField': "sales_value", filterType: "Text" },
                            //{ 'name': "Profit", 'width': "90px", 'dataField': "profit", filterType: "Text" },
                        ]
                    });
                }
                else if ($$("ddlexpiryview").selectedValue() == -1 || $$("ddlexpiryview").selectedValue() == "All") {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "90px", 'dataField': "item_no", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "180px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "150px", 'dataField': "variation_name", filterType: "Text" },
                            { 'name': "Opn Stock(" + $$("txtStartDate").getDate() + ")", 'width': "140px", 'dataField': "opening_stock", filterType: "Text" },
                            { 'name': "Cls Stock(" + $$("txtEndDate").getDate() + ")", 'width': "140px", 'dataField': "closing_stock", filterType: "Text" },
                            { 'name': "Pur Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "215px", 'dataField': "purchase_stock", filterType: "Text" },
                            { 'name': "Pur Value", 'width': "120px", 'dataField': "purchase_value", filterType: "Text" },
                            { 'name': "Sal Stock(" + $$("txtStartDate").getDate() + " to " + $$("txtEndDate").getDate() + ")", 'width': "215px", 'dataField': "sales_stock", filterType: "Text" },
                            //{ 'name': "Sal Value", 'width': "100px", 'dataField': "sales_value", filterType: "Text" },
                            //{ 'name': "Profit", 'width': "80px", 'dataField': "profit", filterType: "Text" },
                        ]
                    });
                }
                else {
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "40px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "50px", 'dataField': "item_no", filterType: "Text" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "140px", 'dataField': "item_name", filterType: "Text" },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "130px", 'dataField': "variation_name", filterType: "Text" },
                            { 'name': "Stock", 'width': "120px", 'dataField': "stock", filterType: "Text" },
                            { 'name': "Expiry Date", 'width': "120px", 'dataField': "expiry_date", filterType: "Text" },
                            { 'name': "Man Date", 'width': "120px", 'dataField': "man_date", filterType: "Text" },
                            { 'name': "Batch No", 'width': "140px", 'dataField': "batch_no", filterType: "Text" },
                            { 'name': "MRP", 'width': "100px", 'dataField': "mrp", filterType: "Text" },
                            { 'name': "Cost", 'width': "100px", 'dataField': "cost", filterType: "Text" }
                        ]
                    });
                }
                page.controls.grdTransactions.rowBound = function (row, item) {
                    $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    row.on("click", "[datafield=purchase_stock]", function () {
                        page.controls.pnlItemDetails.open();
                        page.controls.pnlItemDetails.title("Items Purchase Details");
                        page.controls.pnlItemDetails.rlabel("Items Purchase Details");
                        page.controls.pnlItemDetails.width(700);
                        page.controls.pnlItemDetails.height(300);
                        page.stockAPI.searchValues("", "", "svt.item_no=" + item.item_no + " and (ipt.trans_type like 'Purchase' or ipt.trans_type like 'PurchaseReturn')", "", function (item_data) {
                            $$("grdItemDetails").height("auto");
                            $$("grdItemDetails").width("100%");
                            page.controls.grdItemDetails.setTemplate({
                                selection: false, paging: true, pageSize: 50,
                                columns: [
                                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "trans_date", filterType: "Select" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "key1", filterType: "Text" },
                                    { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "110px", 'dataField': "vendor_name", filterType: "Select" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost", filterType: "Text" },
                                 ]
                            });
                            $$("grdItemDetails").dataBind(item_data);
                        });
                    });
                    row.on("click", "[datafield=sales_stock]", function () {
                        page.controls.pnlItemDetails.open();
                        page.controls.pnlItemDetails.title("Items Sales Details");
                        page.controls.pnlItemDetails.rlabel("Items Sales Details");
                        page.controls.pnlItemDetails.width(700);
                        page.controls.pnlItemDetails.height(300);
                        page.stockAPI.searchValues("", "", "svt.item_no=" + item.item_no + " and (ipt.trans_type like 'Sale' or ipt.trans_type like 'SaleReturn')", "", function (item_data) {
                            $$("grdItemDetails").height("auto");
                            $$("grdItemDetails").width("100%");
                            page.controls.grdItemDetails.setTemplate({
                                selection: false, paging: true, pageSize: 50,
                                columns: [
                                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "trans_date", filterType: "Select" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "trans_type", filterType: "Select" },
                                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "key1", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Cost", 'rlabel': 'Cost', 'width': "70px", 'dataField': "cost", filterType: "Text" },
                                ]
                            });
                            $$("grdItemDetails").dataBind(item_data);
                        });
                    });
                    row.on("click", "[datafield=sales_value]", function () {
                        page.controls.pnlItemDetails.open();
                        page.controls.pnlItemDetails.title("Items Sales Details");
                        page.controls.pnlItemDetails.rlabel("Items Sales Details");
                        page.controls.pnlItemDetails.width(500);
                        page.controls.pnlItemDetails.height(300);
                        page.stockAPI.searchPricesMain(item.item_no, getCookie("user_store_id"), function (data) {
                            $$("grdItemDetails").height("auto");
                            $$("grdItemDetails").width("100%");
                            page.controls.grdItemDetails.setTemplate({
                                selection: false, paging: true, pageSize: 50,
                                columns: [
                                    { 'name': "From Date", 'rlabel': 'From Date', 'width': "150px", 'dataField': "valid_from", filterType: "Select" },
                                    { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': 'Selling Price', 'width': "80px", 'dataField': "price", filterType: "Text" },
                                    { 'name': CONTEXT.ALTER_PRICE_1_LABEL_NAME, 'rlabel': 'Selling Price1', 'width': "100px", 'dataField': "alter_price_1", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_1 },
                                    { 'name': CONTEXT.ALTER_PRICE_2_LABEL_NAME, 'rlabel': 'Selling Price2', 'width': "100px", 'dataField': "alter_price_2", filterType: "Text", visible: CONTEXT.ENABLE_ALTER_PRICE_2 },
                                ]
                            });
                            $$("grdItemDetails").dataBind(data);
                        });
                    });
                }
                $$("grdTransactions").dataBind(data);
            },
        }
    });

}





    $.widget( "custom.combobox", {
        _create: function() {
            this.wrapper = $( "<span>" )
              .addClass( "custom-combobox" )
              .insertAfter( this.element );
 
            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },
 
        _createAutocomplete: function() {
            var selected = this.element.children( ":selected" ),
              value = selected.val() ? selected.text() : "";
 
            this.input = $( "<input>" )
              .appendTo( this.wrapper )
              .val( value )
              .attr( "title", "" )
              .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
              .autocomplete({
                  delay: 0,
                  minLength: 0,
                  source: $.proxy( this, "_source" )
              })
              .tooltip({
                  classes: {
                      "ui-tooltip": "ui-state-highlight"
                  }
              });
 
            this._on( this.input, {
                autocompleteselect: function( event, ui ) {
                    ui.item.option.selected = true;
                    this._trigger( "select", event, {
                        item: ui.item.option
                    });
                },
 
                autocompletechange: "_removeIfInvalid"
            });
        },
 
        _createShowAllButton: function() {
            var input = this.input,
              wasOpen = false;
 
            $( "<a>" )
              .attr( "tabIndex", -1 )
              .attr( "title", "Show All Items" )
              .tooltip()
              .appendTo( this.wrapper )
              .button({
                  icons: {
                      primary: "ui-icon-triangle-1-s"
                  },
                  text: false
              })
              .removeClass( "ui-corner-all" )
              .addClass( "custom-combobox-toggle ui-corner-right" )
              .on( "mousedown", function() {
                  wasOpen = input.autocomplete( "widget" ).is( ":visible" );
              })
              .on( "click", function() {
                  input.trigger( "focus" );
 
                  // Close if already visible
                  if ( wasOpen ) {
                      return;
                  }
 
                  // Pass empty string as value to search for, displaying all results
                  input.autocomplete( "search", "" );
              });
        },
 
        _source: function( request, response ) {
            var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
            response( this.element.children( "option" ).map(function() {
                var text = $( this ).text();
                if ( this.value && ( !request.term || matcher.test(text) ) )
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }) );
        },
 
        _removeIfInvalid: function( event, ui ) {
 
            // Selected an item, nothing to do
            if ( ui.item ) {
                return;
            }
 
            // Search for a match (case-insensitive)
            var value = this.input.val(),
              valueLowerCase = value.toLowerCase(),
              valid = false;
            this.element.children( "option" ).each(function() {
                if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                    this.selected = valid = true;
                    return false;
                }
            });
 
            // Found a match, nothing to do
            if ( valid ) {
                return;
            }
 
            // Remove invalid value
            this.input
              .val( "" )
              .attr( "title", value + " didn't match any item" )
              .tooltip( "open" );
            this.element.val( "" );
            this._delay(function() {
                this.input.tooltip( "close" ).attr( "title", "" );
            }, 2500 );
            this.input.autocomplete( "instance" ).term = "";
        },
 
        _destroy: function() {
            this.wrapper.remove();
            this.element.show();
        }
    });
    
 