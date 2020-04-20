$.fn.barcodePrint = function () {
    return $.pageController.getControl(this, function (page, $$) {
        page.template("/" + appConfig.root + '/shopon/view/barcode-print/barcode-print.html');
        page.stockReportAPI = new StockReportAPI();

        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.productTypeAPI = new ProductTypeAPI();
        page.itemAPI = new ItemAPI();
        page.variationAPI = new VariationAPI();

        var typeData = [];

        var inputs = $(':input').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var nextInput = inputs.get(inputs.index(document.activeElement) + 1);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });

        page.events.page_load = function () {
            $$("ddlType").selectionChange(function () {
                $$("txtValue").selectedObject.val("");
                $("#txtValue").css("placeholder", "Select");
                if ($$("ddlType").selectedValue() != "1") {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    if ($$("ddlType").selectedValue() == "2") {
                        $("#txtValue").css("placeholder", "Main Product Type");
                        data.filter_expression = "concat(ifnull(mpt_no,''),ifnull(mpt_name,'')) like '%%'";
                        page.mainproducttypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                    if ($$("ddlType").selectedValue() == "3") {
                        $("#txtValue").css("placeholder", "Product Type");
                        data.filter_expression = "concat(ifnull(ptt.ptype_no,''),ifnull(ptt.ptype_name,'')) like '%%'";
                        page.productTypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                    if ($$("ddlType").selectedValue() == "4") {
                        $("#txtValue").css("placeholder", "Item Name");
                        data.filter_expression = "(concat(item_no,item_name,ifnull(barcode,true)) like '%%' or item_name like '%%')";
                        page.itemAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                    if ($$("ddlType").selectedValue() == "5") {
                        $("#txtValue").css("placeholder", "Variation Name");
                        data.filter_expression = "";
                        page.variationAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            typeData = data;
                        });
                    }
                }
            });
            page.controls.txtValue.dataBind({
                getData: function (term, callback) {
                    callback(typeData);
                }
            });

            $("[controlid=txtBillNo]").bind("keypress", function (e) {
                $$("txtInvoiceNo").val("");
            });
            $("[controlid=txtInvoiceNo]").bind("keypress", function (e) {
                $$("txtBillNo").val("");
            });
        }

        page.interface.load = function (bill) {

            
        }
        page.interface.select = function () {
            //Clear All The Fields Data
            $$("txtBillNo").val("");
            $$("txtInvoiceNo").val("");
            $$("ddlType").selectedValue("1");
            $$("txtValue").selectedObject.val("");
            $$("ddlStock").selectedValue("1");
            page.view.selectedBarcode([]);
        }
        page.events.btnSearchStock_click = function () {
            var filter = {
                viewMode: "Stock",
                bill_no: $$("txtBillNo").val(),
                invoice_no: $$("txtInvoiceNo").val(),
                type: ($$("ddlType").selectedValue() == "1") ? "" : $$("ddlType").selectedValue(),
                value: ($$("txtValue").selectedValue() == null) ? "" : $$("txtValue").selectedValue(),
                stock: ($$("ddlStock").selectedValue() == "1") ? "" : $$("ddlStock").selectedValue(),
            }
            page.stockReportAPI.stockReport(filter, function (data) {
                page.view.selectedBarcode(data);
            });
        }
        page.events.btnPrintBarcode_click = function () {
            $(page.controls.grdBarcodePrint.selectedData()).each(function (i, item) {
                var data = {
                    printRow: $$("ddlBillPrintCount").selectedValue(),
                    printCount: item.printCount,
                    item_name: item.item_name,
                    item_no: item.item_no,
                    var_no: item.var_no,
                    stock_no:item.stock_no,
                    selling_price: item.price,
                    product_type: (item.ptype_name == null || typeof item.ptype_name == "undefined") ? "" : item.ptype_name,
                    size: "",
                    bill_no: item.key1,
                    vendor_name: item.vendor_name
                }
                printStockBarcode(data);
            });
        }
        page.view = {
            selectedBarcode: function (data) {
                page.controls.grdBarcodePrint.width("100%");
                page.controls.grdBarcodePrint.height("250px");
                page.controls.grdBarcodePrint.setTemplate({
                    selection: "Multiple", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "MPT", 'rlabel': 'MPT', 'width': "100px", 'dataField': "mpt_name", visible: CONTEXT.ENABLE_PRODUCT_TYPE },
                        { 'name': "PT", 'rlabel': 'PT', 'width': "100px", 'dataField': "ptype_name", visible: CONTEXT.ENABLE_PRODUCT_TYPE },
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no", "visible": false },
                        { 'name': "", 'rlabel': '', 'width': "0px", 'dataField': "var_no", "visible": false },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "120px", 'dataField': "item_name" },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "80px", 'dataField': "variation_name" },
                        { 'name': "Price", 'rlabel': 'Price', 'width': "80px", 'dataField': "price" },
                        { 'name': "Supplier", 'rlabel': 'Supplier', 'width': "80px", 'dataField': "vendor_name" },
                        { 'name': "Cost", 'rlabel': 'Cost', 'width': "80px", 'dataField': "cost" },
                        { 'name': "Stock No", 'rlabel': 'Stock No', 'width': "80px", 'dataField': "stock_no" },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "80px", 'dataField': "qty" },
                        { 'name': "No Of Print", 'rlabel': 'No Of Print', 'width': "80px", 'dataField': "printCount", editable: true },
                    ]
                });
                page.controls.grdBarcodePrint.dataBind(data);
                page.controls.grdBarcodePrint.edit(true);
            }
        }
    });
}