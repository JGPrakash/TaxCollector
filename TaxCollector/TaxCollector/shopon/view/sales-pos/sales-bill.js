var slaesPage = null;
var globalScanner = true;

$.fn.salesBill = function () {

    return $.pageController.getControl(this, function (page, $$) {
        global_page = page;
        slaesPage = page;

        //Import Services required
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.billService = new BillService();
        page.accService = new AccountingService();
        page.salesService = new SalesService();
        page.finfactsEntry = new FinfactsEntry();
        page.expenseBillService = new BillExpenseService();
        page.taxclassService = new TaxClassService();
        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.settingService = new SettingService();
        page.rewardService = new RewardService();
        page.finfactsService = new FinfactsService();
        page.itemAPI = new ItemAPI();
        page.purchaseItemAPI = new PurchaseItemAPI();
        
        page.salesExecutiveRewardService = new SalesExecutiveRewardService();
        page.template("/" + appConfig.root + "/shopon/view/sales-pos/sales-bill.html");

        page.discountAPI = new DiscountAPI();
        page.salestaxAPI = new SalesTaxAPI();
        page.customerAPI = new CustomerAPI();
        page.salesItemAPI = new SalesItemAPI();
        page.discountItemAPI = new DiscountItemAPI();
        page.salestaxclassAPI = new SalesTaxClassAPI();
        page.rewardplanAPI = new RewardPlanAPI();
        page.billAPI = new BillAPI();
        page.customerrewardAPI = new CustomerRewardAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.stockAPI = new StockAPI();
        page.salesExecutiveRewardPlanAPI = new SalesExecutiveRewardPlanAPI();
        page.salesexecutiverewardAPI = new SalesExecutiveRewardAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.taxclassAPI = new TaxClassAPI();

        page.selectedBill = null;
        page.productList = [];
        page.manualDiscountValue = 0;
        page.manualDiscountbillLevel = false;
        page.currentCust_no = 0;
        page.currentBillNo = 0;
        page.currentCustNo = 0;
        page.currentReturnBillNo = 0;
        page.clickCount = 0;

        page.interface.currentProductList = null;
        page.discountPercentageData = [];

        page.selectedPayment = {};
        page.tax = [];
        page.plan_id = null;
        page.salesExecutiveList = null;
        page.creditBill = false;
        page.creditBillAmount = 0;
        page.editBill = false;
        page.searchAttributes = "text";
        page.packageAttributes = "text";

        page.events.btnOpenBill_click = function (bill) {
            var obj = page.createBillView(bill.bill_no);
            obj.viewBill(bill.bill_no);
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }

        $(page.selectedObject).keydown(function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 114 || keyCode == 35) {
                e.preventDefault();
                page.events.btnPayment_click();
            }
            if (keyCode == 115) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (keyCode == 118) {
                e.preventDefault();
                page.events.btnItemStock_click();
            }
            if (keyCode == 120) {
                $$("txtDiscountPercentage").selectedObject.focus().select();
            }
            if (e.altKey && e.which == 67) {
                $$("txtCustomerName").selectedObject.focus();
            }
            if (e.altKey && e.which == 73) {
                $$("txtItemSearch").selectedObject.focus();
            }
           
        });
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        var $input = $("[controlid=txtBillDiscount]");
        var $inputTotDays = $("[controlid=txtTotDays]");
        var $inputTotDate = $("[controlid=txtAdvEndDate]");
        var $inputEMI = $("[controlid=txtEMIPayment]");
        var $inputEMIInterest = $("[controlid=txtEMIInterest]");
        var $inputEMIAmount = $("[controlid=txtEMIAmount]");
        var $inputCashierBarcode = $("[controlid=txtCashierBarcode]");
        var $inputItemSearch = $("[controlid=txtItemSearch]");
        var $inputDiscountPercentage = $("[controlid=txtDiscountPercentage]");
        var $inputCustomerName = $("[controlid=txtCustomerName]");
        $input.on('keyup', function () {
            if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) < 0) {
                $$("txtBillDiscount").value("");
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
            }
            else {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
            }
        });

        //on keydown, clear the countdown 
        $input.on('keydown', function () {
            clearTimeout(typingTimer);
        });

        //on keyup, start the countdown
        $inputTotDays.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTotDays, doneTypingInterval);
        });

        //on keydown, clear the countdown 
        $inputTotDays.on('keydown', function () {
            clearTimeout(typingTimer);
        });
        $inputEMI.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneDownEMI, doneTypingInterval);
        });
        $inputTotDate.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTotDate, doneTypingInterval);
        });
        $inputEMIInterest.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneDownEMIInterest, doneTypingInterval);
        });
        $inputEMIAmount.on('keyup', function () {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneDownEMIInterest, doneTypingInterval);
        });
        $inputCashierBarcode.on('keyup', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneCashierBarcode, doneTypingInterval);
            }
        });

        $inputItemSearch.on('keydown', function (e) {
            if (e.altKey && e.which == 78) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { page.events.btnAddNewItem_click(); }, doneTypingInterval);
            }
        });
        $inputDiscountPercentage.on('keydown', function (e) {
            if (e.which == 13) {
                page.selectedBill.discounts = [];
                page.calculateTotal(function (emp) {
                    page.selectedBill.discounts = [];
                    var data = page.discountPercentageData;

                    var disc_val = ($$("txtDiscountValue").value() == "" || $$("txtDiscountValue").value() == null) ? "0" : $$("txtDiscountValue").value();
                    if (isNaN(disc_val))
                        disc_val = 0;
                    disc_val = (parseFloat(disc_val) / parseFloat($$("lblTotalNet").value())) * 100;
                    var per = ($$("txtDiscountPercentage").value() == "" || $$("txtDiscountPercentage").value() == null) ? "0" : $$("txtDiscountPercentage").value();
                
                    page.selectedBill.discounts.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_level: data.disc_level,
                        disc_value: parseFloat(per) + parseFloat(disc_val)
                        });
                    page.calculate();
                });
            }
        });
        $inputCustomerName.on('keydown', function (e) {
            if (e.altKey && e.which == 78) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { page.events.btnAddCustomer_click(); }, doneTypingInterval);
            }
        });
        $("[controlid=txtDiscountValue]").on('keydown', function (e) {
            if (e.which == 13) {
                page.selectedBill.discounts = [];
                page.calculateTotal(function (emp) {
                    var disc_val = ($$("txtDiscountValue").value() == "" || $$("txtDiscountValue").value() == null) ? "0" : $$("txtDiscountValue").value();
                    if (isNaN(disc_val))
                        disc_val = 0;
                    disc_val = (parseFloat(disc_val) / parseFloat($$("lblTotalNet").value())) * 100;
                    var per = ($$("txtDiscountPercentage").value() == "" || $$("txtDiscountPercentage").value() == null) ? "0" : $$("txtDiscountPercentage").value();
                    page.selectedBill.discounts = [];
                    var data = page.discountPercentageData;
                    page.selectedBill.discounts.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_level: data.disc_level,
                        disc_value: parseFloat(per) + parseFloat(disc_val)
                    });
                    page.calculate();
                });
            }
        });
        //user is "finished typing," do something
        function doneTyping() {
            page.calculate();
        }
        function doneTotDays() {
            var totDate = $$("txtTotDays").value();
            if (totDate == "" || totDate == null || typeof totDate == "undefined") {
                alert("Rent Days Should Be A Number");
                $$("txtTotDays").value("");
            }
            else {
                var today = new Date();
                var newdate = new Date();
                newdate.setDate(today.getDate() + parseInt(totDate));
                $$("txtAdvEndDate").setDate(newdate);
            }
        }
        function doneTotDate() {
            var totDate = $$("txtAdvEndDate").getDate();
            if (totDate == "" || totDate == null || typeof totDate == "undefined") {
                var newdate = new Date();
                $$("txtAdvEndDate").setDate(newdate);
            }
            else {
                var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                var firstDate = new Date();
                var secondDate = $.datepicker.formatDate("dd-mm-yy", totDate);//new Date(totDate);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                $$("txtTotDays").value(diffDays);
            }
        }
        function doneDownEMI() {
            if (parseInt($$("txtEMIPayment").value()) <= 0 || $$("txtEMIPayment").value() == "" || $$("txtEMIPayment").value() == null || typeof $$("txtEMIPayment").value() == "undefined") {
                $$("txtEMIPayment").value(0);
            }
            $$("lblTotalEMIPaidAmount").value($$("txtEMIPayment").value());
            var amount = parseFloat(parseFloat(page.controls.lblTotal.value()) - parseFloat($$("txtEMIPayment").value())).toFixed(4);
            page.controls.lblTotalBalanceEMIAmount.value(amount);
        }
        function doneDownEMIInterest() {
            try {
                if (parseInt($$("txtEMIAmount").value()) <= 0 || $$("txtEMIAmount").value() == "" || $$("txtEMIAmount").value() == null || typeof $$("txtEMIAmount").value() == "undefined") {
                    $$("txtEMIAmount").value(0);
                }
                if (parseInt($$("txtEMIInterest").value()) <= 0 || $$("txtEMIInterest").value() == "" || $$("txtEMIInterest").value() == null || typeof $$("txtEMIInterest").value() == "undefined") {
                    $$("txtEMIInterest").value(0);
                }
                var amount = parseFloat(parseFloat(page.controls.lblTotal.value()) + (parseFloat($$("txtEMIAmount").value()) * (parseFloat($$("txtEMIInterest").value()) / 100))).toFixed(4);
                page.controls.lblTotalEMIAmount.value(amount);
                $$("lblTotalEMIDueAmount").value(parseFloat(parseFloat(amount) - parseFloat($$("txtEMIPayment").value())).toFixed(2));
            }
            catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        }
        function doneCashierBarcode() {
            var str = $$("txtCashierBarcode").val();
            if (!isNaN(str)) {
                if (str.startsWith("00")) {
                    str = (str.substring(0, str.length - 1));
                }
                $$("ddlDeliveryBy").selectedValue(parseInt(str));
                $$("chkSingleCashier").prop('checked', true);
                $$("txtCashierBarcode").val("");
                $$("txtItemSearch").selectedObject.focus();
            }
            else {
                alert("Please Check Your Number");
                $$("txtCashierBarcode").val("");
                $$("txtCashierBarcode").focus();
            }
            if ($$("chkSingleCashier").prop("checked")) {
                CONTEXT.SingleCashier = true;
                page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
            }
        }


        function confirmManualDisc() {
            var defer = $.Deferred();

            $("#dialog-form").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#manualDiscount");
                        //Do your code here
                        page.manualDiscountValue = text1.val();
                        defer.resolve("Ok");
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        defer.resolve("Cancel");

                        $(this).dialog("close");
                    }
                }
            });

            //$("#dialog-form").dialog("open");

            return defer.promise();
        }
        page.loadSelectedBill = function (bill, callback) {
            
            page.selectedBill = bill;

            $$("txtCustomerName").customText(bill.cust_name);
            $$("hdnCustomerNo").val(bill.cust_no);
            $$("lblPhoneNo").value(bill.phone_no);
            $$("lblAddress").value(bill.address);
            $$("lblBillNo").value(bill.bill_no);
            $$("txtBillDate").setDate(nvl(bill.bill_date, ""));
            $$("txtBillDueDate").setDate(nvl(bill.due_date, ""));

            $$("txtAdvEndDate").setDate(nvl(bill.adv_end_date, ""));

            $$("txtAdvanceAmount").val(bill.adv_sec_amt);
            $$("ddlAdvancePayType").selectedValue(bill.adv_sec_status);


            $$("lblSubTotal").value(bill.sub_total);
            $$("lblRndOff").value(bill.round_off);
            $$("lblTotal").value(bill.total);
            $$("lblTotalNet").value(parseFloat(parseFloat(bill.total) - parseFloat(bill.bill_discount)).toFixed(2));
            page.interface.setBillAmount(bill.total);
            $$("lblDiscount").value(bill.discount);
            $$("lblTax").value(bill.tax);
            $$("lblEmailId").value(bill.email);bill.sub_total
            $$("lblGst").value(bill.gst_no);
            $$("ddlDeliveryBy").selectedValue(bill.sales_executive);

            //Customer More Details
            $$("lblMoreCustomer").value(bill.cust_name);
            $$("lblMoreTotalSales").value(bill.cust_tot_sales);
            $$("lblMoreTotalReturn").value(bill.cust_tot_return);
            $$("lblMoreTotalSalesPayment").value(bill.cust_tot_sales_payment);
            $$("lblMoreTotalReturnPayment").value(bill.cust_tot_ret_payment);
            $$("lblMorePendingPayment").value(bill.cust_tot_pending_pay);
            $$("lblMorePendingSettlement").value(bill.cust_tot_pending_settlement);

            if (bill.cust_no != "" && bill.cust_no != null && typeof bill.cust_no != "undefined") {
                page.customerAPI.getValue({ cust_no: bill.cust_no }, function (data, callback) {
                    if (data.length != 0)
                        $$("lblAvalablePoints").value(data[0].points);
                });
            }
            
            //Expense
            $$("txtExpenseName").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length-1].exp_name);
            $$("txtExpense").value((bill.expenses == undefined) ? "" : (bill.expenses.length == 0) ? "" : bill.expenses[bill.expenses.length - 1].amount);
            $$("txtBillDiscount").value(bill.bill_discount);
            
            if (bill.state_text == "NewReturn") {

                $$("grdReturnItemSelection").width("100%");
                $$("grdReturnItemSelection").height("220px");
                $$("grdReturnItemSelection").setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Item No", 'width': "75px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "170px", 'dataField': "item_name" },
                        { 'name': "Qty", 'width': "100px", 'dataField': "qty", },
                        { 'name': "Free Qty", 'width': "100px", 'dataField': "free_qty", },
                        { 'name': "Unit", 'width': "100px", 'dataField': "unit", },
                        { 'name': "Qty in Hand", 'width': "100px", 'dataField': "qty_stock", },
                        { 'name': "Mrp", 'width': "80px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Price", 'width': "100px", 'dataField': "price" },
                        { 'name': "Disc", 'width': "100px", 'dataField': "discount" },
                        { 'name': "Tax", 'width': "100px", 'dataField': "tax_per" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no" },
                        { 'name': "Amount", 'width': "120px", 'dataField': "total_price" },
                       // { 'name': "", 'width': "250px", 'dataField': "", visible: true, editable: false, itemTemplate: "<input type='button' value='Send Email' action='SendEmail' control='salesPOS.primaryWriteButton' controlid='btnSendMail' event='click:btnSendMail_click'/>" }
                    ]
                });
                $$("grdReturnItemSelection").dataBind(bill.billItems);
                $$("grdReturnItemSelection").selectionChanged = function (row, rowId) {
                    var total = 0;
                    var sub_total = 0;
                    var discount = 0;
                    var tax = 0;
                    $(page.controls.grdReturnItemSelection.selectedData()).each(function (i, item) {
                        total = parseFloat(parseFloat(total) + parseFloat(item.total_price)).toFixed(5);
                        sub_total = parseFloat(parseFloat(sub_total) + parseFloat(item.price)).toFixed(5);
                        discount = parseFloat(parseFloat(discount) + parseFloat(item.discount)).toFixed(5);

                        tax = parseFloat(parseFloat(tax) + (parseFloat(item.price) * parseFloat(item.qty) - parseFloat(item.total_price) - parseFloat(item.discount))).toFixed(5);
                    });

                    page.controls.lblSubTotal.value(sub_total);
                    page.controls.lblTotal.value(total);
                    page.interface.setBillAmount(total);
                    page.controls.lblDiscount.value(discount);
                    page.controls.lblTax.value(Math.abs(tax));
                };
            }
            
            else {
                page.pingGrid(page.selectedBill.state_text, bill.billItems);

                var dataList = [];
                $(page.interface.currentProductList).each(function (i, item) {
                    dataList.push(item);
                });
                page.productList = dataList;
            }

            $$("grdDiscount").dataBind(bill.discounts);
            $$("ddlSalesTax").selectedValue(bill.sales_tax_no);  //Should ser page.sales_tax  
            if (parseFloat(bill.sub_total) == 0) {
                $$("txtDiscountPercentage").value(0);
            }
            else {
                $$("txtDiscountPercentage").value(parseInt((100 * parseFloat(bill.discount)) / (parseFloat(bill.tax) + parseFloat(bill.sub_total))));//sub_total
                //$$("txtDiscountPercentage").value(parseInt((100 * parseFloat(bill.discount)) / parseFloat(bill.total)));//sub_total
            }
            
            if (parseFloat(bill.sub_total) == 0) {
                $$("txtDiscountValue").value(0);
            }
            else
                $$("txtDiscountValue").value(parseFloat(bill.discount).toFixed(2));

            page.view.UIState(bill.state_text);
            if (callback)
                callback();
        }
        page.loadSalesTaxClasses = function (sales_tax_no, callback) {
            if (sales_tax_no == -1) {
                callback([]);
            } else {
                page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + sales_tax_no, "", function (data) {
                    taxClassData = data;
                    callback(data);
                });
            }
        }
        page.pingGrid = function (state_text, billItems) {
            var gwidth = 100;
            if (CONTEXT.POSShowFree == true)
                gwidth = gwidth + 10;
            if (CONTEXT.POSShowStock == true)
                gwidth = gwidth + 50;
            if (CONTEXT.POSShowGST == true)
                gwidth = gwidth + 60;
            $$("grdBill").width(gwidth + "%");
            $$("grdBill").height("auto;min-height:100px;overflow-y:auto");

            //Set The Grid For Mobile
            if (window.mobile) {
                $$("grdBill").height("auto");
                page.controls.grdBill.setTemplate({
                    selection: false,
                    columns: [
                        { 'name': "", 'width': "5%", 'dataField': "", visible: state_text == "NewBill" || state_text == "Saved", editable: false, itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },

                        { 'name': "Item No", 'width': "0px", 'dataField': "item_no",visible:false },
                        { 'name': "Item Name", 'width': "200px", 'dataField': "item_name" },
                        { 'name': "Rack No", 'width': "100px", 'dataField': "rack_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "qty", editable: state_text == "NewBill" || state_text == "Saved",visible:false },
                        { 'name': "Qty", 'width': "70px", 'dataField': "temp_qty", editable: state_text == "NewBill" || state_text == "Saved" },
                        { 'name': "Price", 'width': "80px", 'dataField': "price", editable: CONTEXT.SELLING_PRICE_EDITABLE },
                        { 'name': "Disc", 'width': "80px", 'dataField': "discount", visible: CONTEXT.ENABLE_DISCOUNT_MODULE },
                        { 'name': "GST", 'width': "60px", 'dataField': "tax_per", visible: CONTEXT.ENABLE_TAX_MODULE },
                        { 'name': "Amount", 'width': "90px", 'dataField': "total_price" },
                        
                        { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.SHOW_FREE },
                        { 'name': "Free Qty", 'width': "90px", 'dataField': "temp_free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.SHOW_FREE },
                        { 'name': "Tray", 'width': "90px", 'dataField': "tray_received", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.ENABLE_MODULE_TRAY },

                        { 'name': "HSN Code", 'width': "0px", 'dataField': "hsn_code", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_HSN_CODE, visible: false },
                        { 'name': "CGST", 'width': "0px", 'dataField': "cgst", visible: CONTEXT.POSShowGST, visible: false },
                        { 'name': "SGST", 'width': "0px", 'dataField': "sgst", visible: CONTEXT.POSShowGST, visible: false },
                        { 'name': "IGST", 'width': "0px", 'dataField': "igst", visible: CONTEXT.POSShowGST, visible: false },

                        { 'name': "Variation", 'width': "0px", 'dataField': "variation_name", visible: CONTEXT.POSShowStock && CONTEXT.ENABLE_VARIATION, visible: false },
                        { 'name': "Cost Of Good", 'width': "0px", 'dataField': "cot_of_good", visible: CONTEXT.POSShowStock , visible: false },
                        { 'name': "Mrp", 'width': "70px", 'dataField': "mrp", visible: CONTEXT.POSShowStock && CONTEXT.ENABLE_MRP },
                        { 'name': "Stock", 'width': "70px", 'dataField': "qty_stock", editable: false, visible: CONTEXT.POSShowStock && CONTEXT.SHOW_STOCK_COLUMN },
                        
                        { 'name': "Unit", 'width': "70px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//, visible: CONTEXT.POSShowStock },
                        { 'name': "Manufacture Date", 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE && CONTEXT.POSShowStock },
                        { 'name': "Expiry Date", 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && CONTEXT.POSShowStock },
                        { 'name': "Batch No", 'width': "70px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && CONTEXT.POSShowStock },

                        { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no" },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no" },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                        { 'name': "", 'width': "0px", 'dataField': "cost" },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no" },
                        { 'name': "", 'width': "0px", 'dataField': "price_no" },
                        { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                        { 'name': "", 'width': "0px", 'dataField': "discount_inclusive" },
                        { 'name': "", 'width': "0px", 'dataField': "item_sub_total" },
                    ]
                });
            }
            else {
                page.controls.grdBill.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "40px", 'dataField': "", visible: state_text == "NewBill" || state_text == "Saved", editable: false, itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },

                        { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                        { 'name': "Executive Id", 'rlabel': 'Executive Id', 'width': "150px", 'dataField': "executive_id", editable: true, visible: (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE && (!(CONTEXT.SingleCashier))) },
                        { 'name': "HSN Code", 'rlabel': 'HSN Code', 'width': "120px", 'dataField': "hsn_code", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_HSN_CODE && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "230px", 'dataField': "item_name", visible: !CONTEXT.ENABLE_SALES_SECONDARY_LANGUAGE },
                        { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "230px", 'dataField': "item_name_tr", visible: CONTEXT.ENABLE_SALES_SECONDARY_LANGUAGE },
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no" },
                        //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_code" },
                        { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                        { 'name': "Stock", 'rlabel': 'Stock', 'width': "90px", 'dataField': "qty_stock", editable: false, visible: CONTEXT.POSShowStock && CONTEXT.SHOW_STOCK_COLUMN },
                        { 'name': "Unit Fact", 'rlabel': 'Unit Fact', 'width': "100px", 'dataField': "temp_unit_fact", visible: CONTEXT.ENABLE_ALTER_UNIT && false },
                        { 'name': "B.I. Qty", 'rlabel': 'B.I. Qty', 'width': "100px", 'dataField': "bill_item_qty", visible: page.creditBill },
                        { 'name': "Start Date", 'rlabel': 'Start Date', 'width': "150px", 'dataField': "temp_start_date", visible: CONTEXT.ENABLE_SALES_ITEM_DATE, itemTemplate: "<input type='date' dataField='temp_start_date'>" },
                        { 'name': "End Date", 'rlabel': 'End Date', 'width': "150px", 'dataField': "temp_end_date", visible: CONTEXT.ENABLE_SALES_ITEM_DATE, itemTemplate: "<input type='date' dataField='temp_end_date'>" },
                        { 'name': "", 'width': "0px", 'dataField': "qty", editable: state_text == "NewBill" || state_text == "Saved" },
                        { 'name': "Mrp", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Qty", 'rlabel': 'Qty', 'width': "70px", 'dataField': "temp_qty", editable: state_text == "NewBill" || state_text == "Saved" },
                        { 'name': "", 'width': "0px", 'dataField': "free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.SHOW_FREE },
                        { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "90px", 'dataField': "temp_free_qty", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.POSShowFree && CONTEXT.SHOW_FREE },
                        { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },//, visible: CONTEXT.POSShowStock },
                        { 'name': CONTEXT.SALE_PRICE_NAME, 'rlabel': 'Selling Price', 'width': "120px", 'dataField': "price", editable: CONTEXT.SELLING_PRICE_EDITABLE },
                        { 'name': "Disc", 'rlabel': 'Discount', 'width': "80px", 'dataField': "discount", visible: CONTEXT.ENABLE_DISCOUNT_MODULE },
                        { 'name': "Buy Cost", 'rlabel': 'Buy Cost', 'width': "120px", 'dataField': "cost", visible: CONTEXT.ENABLE_SALES_BUYING_COST },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "Tray", 'rlabel': 'Tray', 'width': "90px", 'dataField': "tray_received", editable: state_text == "NewBill" || state_text == "Saved", visible: CONTEXT.ENABLE_MODULE_TRAY },

                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        //{ 'name': "Cess Rate", 'rlabel': 'Cess Rate', 'width': "130px", 'dataField': "cess_qty_amount", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POSShowGST },
                        //{ 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "130px", 'dataField': "additional_tax", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POSShowGST },


                        { 'name': "CGST", 'rlabel': 'CGST', 'width': "60px", 'dataField': "cgst", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "CGST Amt", 'rlabel': 'CGST Amt', 'width': "60px", 'dataField': "cgst_val", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "SGST", 'rlabel': 'SGST', 'width': "60px", 'dataField': "sgst", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "SGST Amt", 'rlabel': 'SGST Amt', 'width': "60px", 'dataField': "sgst_val", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "IGST", 'rlabel': 'IGST', 'width': "60px", 'dataField': "igst", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "IGST Amt", 'rlabel': 'IGST Amt', 'width': "60px", 'dataField': "igst_val", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_CUST_GST },
                        { 'name': "Cess Per", 'rlabel': 'Cess Per', 'width': "60px", 'dataField': "cess_per", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_ADDITIONAL_TAX },
                        { 'name': "Cess Amt", 'rlabel': 'Cess Amt', 'width': "60px", 'dataField': "cess_per_val", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_ADDITIONAL_TAX },
                        { 'name': "Cess Rate", 'rlabel': 'Cess Rate', 'width': "130px", 'dataField': "cess_qty_amount", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POSShowGST },
                        { 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "130px", 'dataField': "additional_tax", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX && CONTEXT.POSShowGST },
                        { 'name': "GST", 'rlabel': 'GST', 'width': "60px", 'dataField': "tax_per", visible: CONTEXT.ENABLE_TAX_MODULE },
                        { 'name': "GST Amt", 'rlabel': 'GST Amt', 'width': "60px", 'dataField': "tax_per_amt", visible: CONTEXT.POSShowGST && CONTEXT.ENABLE_TAX_MODULE },
                        { 'name': "Amount", 'rlabel': 'Amount', 'width': "90px", 'dataField': "total_price" },
                      //  { 'name': "", 'width': "10px", 'dataField': "", itemTemplate: "<div style='margin-top:5px;width:100%;background-color:lightgray'>&nbsp;</div>" },
                        { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.POSShowStock && CONTEXT.ENABLE_VARIATION },
                        { 'name': "Cost Of Good", 'rlabel': 'Cost Of Good', 'width': "110px", 'dataField': "cot_of_good", visible: false },
                        //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", visible: CONTEXT.POSShowStock },
                        //{ 'name': "Mrp", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", visible: CONTEXT.POSShowStock && CONTEXT.ENABLE_MRP },
                        { 'name': "Manufacture Date", 'rlabel': 'Man Date', 'width': "150px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE && CONTEXT.POSShowStock },
                        { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "110px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE && CONTEXT.POSShowStock },
                        { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "110px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO && CONTEXT.POSShowStock },

                        { 'name': "", 'width': "0px", 'dataField': "qty_const",visible:false },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tax_class_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "discount_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tray_id", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "cost", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "unit_identity", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "price_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "tax_inclusive", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "discount_inclusive", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "item_sub_total", visible: false },

                        //Executive Details
                        { 'name': "", 'width': "0px", 'dataField': "reward_plan_id",visible:false },
                        { 'name': "", 'width': "0px", 'dataField': "reward_plan_point", visible: false },

                        { 'name': "", 'width': "0px", 'dataField': "alter_price_1" },
                        { 'name': "", 'width': "0px", 'dataField': "alter_price_2" },
                        { 'name': "", 'width': "0px", 'dataField': "temp_price" },
                        { 'name': "", 'width': "0px", 'dataField': "start_date" },
                        { 'name': "", 'width': "0px", 'dataField': "end_date" },
                        { 'name': "", 'width': "0px", 'dataField': "stock_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "stock_selection", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "package_item", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "package_count", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "item_package", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "cess_qty", visible: false },
                        
                    ]
                });
            }
            page.controls.grdBill.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Delete") {
                    page.controls.grdBill.deleteRow(rowId);
                    page.calculate();
                }
            }
            page.controls.grdBill.rowBound = function (row, item) {
                if (window.mobile) {
                    row.find("div[datafield=item_no]").css("display", "none");
                    row.find("div[datafield=cgst]").css("display", "none");
                    row.find("div[datafield=sgst]").css("display", "none");
                    row.find("div[datafield=igst]").css("display", "none");
                    row.find("div[datafield=variation_name]").css("display", "none");
                    row.find("div[datafield=cot_of_good]").css("display", "none");
                }
                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdBill.allData().length);
                
                //Check the expiry items or not
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        var EnteredDate = item.expiry_date;
                        var date = "28";
                        var month = EnteredDate.substring(0,2);
                        var year = EnteredDate.substring(3, 7);

                        var myDate = new Date(year, month - 1, date);
                        var today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (CONTEXT.ENABLE_EXP_ALERT) {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                    row[0].style.color = "red";
                                }
                            }
                            else {
                                myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                                if (myDate <= today) {
                                    alert("This Product Will Be Expire On " + item.expiry_date);
                                    row[0].style.color = "orange";
                                }
                            } 
                        } else {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                    row[0].style.color = "red";
                                }
                            }
                        }
                    }
                }
                else {
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        var EnteredDate = item.expiry_date;
                        var date = EnteredDate.substring(0, 2);
                        var month = EnteredDate.substring(3, 5);
                        var year = EnteredDate.substring(6, 10);

                        var myDate = new Date(year, month - 1, date);
                        var today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (CONTEXT.ENABLE_EXP_ALERT) {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                }
                                row[0].style.color = "red";
                            }
                            else {
                                myDate.setDate(myDate.getDate() - parseInt(item.expiry_alert_days));
                                if (myDate <= today) {
                                    alert("This Product Will Be Expire On " + item.expiry_date);
                                    row[0].style.color = "orange";
                                }
                            } 
                        } else {
                            if (myDate <= today) {
                                if (!CONTEXT.POS_ALLOW_EXPIRED_ITEMS) {
                                    row.find("div[datafield=qty]").css("visibility", "hidden");
                                    row.find("div[datafield=temp_qty]").css("visibility", "hidden");
                                    row.find("div[datafield=free_qty]").css("visibility", "hidden");
                                }
                                row[0].style.color = "red";
                            }
                        }
                    }
                }
                if (CONTEXT.POS_SHOW_STOCK_EMPTY_COLOR) {
                    if (parseInt(item.qty_stock) <= 0) {
                        row.find("div[datafield=variation_name]").css("color", "blue");
                    }
                }
                if (CONTEXT.ENABLE_STOCK_ALERT) {
                    if (parseInt(item.qty_stock) <= parseInt(item.reorder_level)) {
                        alert("Item Stock Is Less Than Reorder Level")
                        row[0].style.color = "#f90bf2";
                    }
                }
                
                if (item.tray_id == "-1" || item.tray_id == null) {
                    row.find("div[datafield=tray_received]").css("visibility", "hidden");
                }
                var htmlTemplate = [];
                if (CONTEXT.ENABLE_ALTER_UNIT) {
                    if (item.alter_unit == undefined || item.alter_unit == null || item.alter_unit == "") {
                        htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                    } else {
                        htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</option><option value='1'>" + item.alter_unit + "</option></select></div>");
                    }
                } else {
                    htmlTemplate.push("<div><select id='itemUnit'><option value='0'>" + item.unit + "</select></div>");
                }
                
                $(row).find("[id=prdDetail]").html(htmlTemplate.join(""));

                $(row).find("[id=itemUnit]").change(function () {
                    if ($(row).find("[id=itemUnit]").val() == "0") {
                        item.qty = parseFloat(item.temp_qty);
                        if (isNaN(item.temp_qty)) {
                            item.temp_qty = 0;
                            item.qty = 0;
                        }
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty));
                        item.free_qty = parseFloat(item.temp_free_qty);
                        if (isNaN(item.temp_free_qty)) {
                            item.temp_free_qty = 0;
                            item.free_qty = 0;
                        }
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty));
                        item.unit_identity = 0;
                        $(row).find("[datafield=unit_identity]").find("div").html(0);
                        $(row).find("[datafield=temp_unit_fact]").find("div").html(parseFloat(1));
                    } else {
                        item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                        if (isNaN(item.temp_qty)) {
                            item.temp_qty = 0;
                            item.qty = 0;
                        }
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact));
                        item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                        if (isNaN(item.temp_free_qty)) {
                            item.temp_free_qty = 0;
                            item.free_qty = 0;
                        }
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact));
                        item.unit_identity = 1;
                        $(row).find("[datafield=unit_identity]").find("div").html(1);
                        $(row).find("[datafield=temp_unit_fact]").find("div").html(parseFloat(item.alter_unit_fact));
                    }
                    page.calculate();
                });

                if (item.unit_identity == "1") {
                    item.temp_qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.temp_qty)) {
                        item.temp_qty = 0;
                        item.temp_qty = 0;
                    }
                    $(row).find("[datafield=temp_qty]").find("div").html(parseFloat(item.temp_qty));
                    $(row).find("[datafield=temp_unit_fact]").find("div").html(parseFloat(item.alter_unit_fact));

                    item.temp_free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                    if (isNaN(item.temp_free_qty)) {
                        item.temp_free_qty = 0;
                        item.free_qty = 0;
                    }
                    $(row).find("[datafield=temp_free_qty]").find("div").html(parseFloat(item.temp_free_qty));

                    $(row).find("[id=itemUnit]").val(1);
                }
                else {
                    $(row).find("[datafield=temp_unit_fact]").find("div").html(parseFloat(1));
                }

                row.on('keyup keydown keypress onDOMAttrModified propertychange change', "input[dataField=qty]", function (evt) {
                    row.find("[dataField=total_price]").children("div").html(parseInt(row.find("[dataField=price]").children("div").html()) * parseInt(row.find("input[dataField=qty]").val()));
                });
                $(row).find("[datafield=qty] input").css("width", "40px");
                $(row).find("[datafield=item_name] input").css("width", "175px");
                $(row).find("[datafield=discount]").attr("action", "discount");
                row.on("click", "[datafield=discount]", function () {
                    page.controls.pnlItemDiscountPopup.open();
                    page.controls.pnlItemDiscountPopup.title("Discount(s) Applied For Item:" + item.item_name + "");
                    page.controls.pnlItemDiscountPopup.rlabel("Discount");
                    page.controls.pnlItemDiscountPopup.width(1000);
                    page.controls.pnlItemDiscountPopup.height(400);

                    page.controls.grdItemDiscount.width("100%");
                    page.controls.grdItemDiscount.height("220px");
                    page.controls.grdItemDiscount.setTemplate({
                        selection: "Single",

                        columns: [
                            { 'name': "Disc No", 'rlabel': 'Disc No', 'width': "100px", 'dataField': "disc_no" },
                            { 'name': "Disc Name", 'rlabel': 'Disc Name', 'width': "200px", 'dataField': "disc_name" },
                            { 'name': "Disc Type", 'rlabel': 'Discount Type', 'width': "150px", 'dataField': "disc_type" },
                            { 'name': "Disc Value", 'rlabel': 'Discount Value', 'width': "150px", 'dataField': "disc_value" },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "150px", 'dataField': "item_no" },
                        ]
                    });
                    page.discount_item_no = item.item_no;
                    page.discount_item_variation_name = item.variation_name;
                    var itemDisount = [];
                    $(page.selectedBill.discounts).each(function (i, data) {
                        if (typeof data.item_no == "undefined" || item.item_no == data.item_no) {
                            itemDisount.push(data);
                        }
                    });
                    page.controls.grdItemDiscount.dataBind(itemDisount);

                    if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {

                        $$("btnItemDiscountOK").show();

                    }
                    else {
                        $$("btnItemDiscountOK").hide();

                    }
                });
                row.on("change", "input[datafield=price]", function () {
                    if (item.qty_type == "Integer")
                        $(this).val(parseInt($(this).val()));
                    page.calculate();
                });
                row.on("change", "input[datafield=temp_qty]", function () {
                    if ($(row).find("[id=itemUnit]").val() == "0") {
                        item.qty = parseFloat(item.temp_qty);
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty))
                    } else {
                        item.qty = parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=qty]").find("div").html(parseFloat(item.temp_qty) * parseFloat(item.alter_unit_fact))
                    }
                    page.calculate();
                    var ori_stock = parseFloat(item.qty_const) - (parseFloat(item.qty) + parseFloat(item.free_qty));
                    item.qty_stock = parseFloat(ori_stock).toFixed(5);
                    $(row).find("[datafield=qty_stock]").find("div").html(ori_stock.toFixed(5));
                });
                row.on("change", "input[datafield=temp_free_qty]", function () {
                    if ($(row).find("[id=itemUnit]").val() == "0") {
                        item.free_qty = parseFloat(item.temp_free_qty);
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty))
                    } else {
                        item.free_qty = parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact);
                        $(row).find("[datafield=free_qty]").find("div").html(parseFloat(item.temp_free_qty) * parseFloat(item.alter_unit_fact))
                    }
                    if (item.qty_type == "Integer")
                        $(this).val(parseInt($(this).val()));
                    page.calculate();
                    var ori_stock = parseFloat(item.qty_const) - (parseFloat(item.qty) + parseFloat(item.free_qty));
                    item.qty_stock = parseFloat(ori_stock).toFixed(5);
                    $(row).find("[datafield=qty_stock]").find("div").html(ori_stock.toFixed(5));
                });
                row.on("keydown", "input[datafield=temp_qty]", function (e) {
                    if (e.which == 9 || e.which == 13) {
                        e.preventDefault();
                        var nextRow = $(this).closest("grid_row").next();
                        if (nextRow.length == 0) {
                            page.controls.txtItemSearch.selectedObject.focus();
                            //nextRow.find("input[datafield=price]").focus();
                        } else {
                            page.controls.txtItemSearch.selectedObject.focus();
                            //nextRow.find("input[datafield=price]").focus();
                        }
                    }
                });
                row.on("keydown", "input[datafield=price]", function (e) {
                    if (e.which == 9 || e.which == 13) {
                        e.preventDefault();
                        var nextRow = $(this).closest("grid_row").next();
                        if (nextRow.length == 0) {
                            page.controls.txtItemSearch.selectedObject.focus();
                        } else {
                            //nextRow.find("input[datafield=qty]").focus();
                            nextRow.find("input[datafield=temp_qty]").focus();
                        }

                    }
                });
                row.on("change", "input[datafield=executive_id]", function () {
                    page.checkSalesExecutive(row, item);
                    row.find("[datafield=temp_qty]").find("input").focus().select();
                });
                row.on("keydown", "input[datafield=executive_id]", function (e) {
                    if (e.which == 9 || e.which == 13) {
                        e.preventDefault();
                        var nextRow = $(this).closest("grid_row").next();
                        if (nextRow.length == 0) {
                            page.controls.txtItemSearch.selectedObject.focus();
                            //nextRow.find("input[datafield=price]").focus();
                        } else {
                            page.controls.txtItemSearch.selectedObject.focus();
                            //nextRow.find("input[datafield=price]").focus();
                        }
                    }
                });
                $(row).find("input[dataField=temp_start_date]").change(function () {
                    var temp_date = $(row).find("[datafield=temp_start_date]").find("input").val();
                    var day = temp_date.substring(8, 10);
                    var month = temp_date.substring(5, 7);
                    var year = temp_date.substring(0, 4);

                    item.start_date = year + "-" + month + "-" + day;
                    $(row).find("[datafield=start_date]").find("div").html(item.start_date);
                    page.calculateDays(function (data) {
                        page.calculate();
                    });
                });
                $(row).find("input[dataField=temp_end_date]").change(function () {
                    var temp_date = $(row).find("[datafield=temp_end_date]").find("input").val();
                    var day = temp_date.substring(8, 10);
                    var month = temp_date.substring(5, 7);
                    var year = temp_date.substring(0, 4);

                    item.end_date = year + "-" + month + "-" + day;
                    $(row).find("[datafield=end_date]").find("div").html(item.end_date);
                    page.calculateDays(function (data) {
                        page.calculate();
                    });
                });
                //if (state_text != "NewBill") {
                $(row).find("[datafield=temp_start_date]").find("input").val(dbDate(item.start_date));
                $(row).find("[datafield=temp_end_date]").find("input").val(dbDate(item.end_date));

                //}
                if (item.unit != "Period") {
                    row.find("div[datafield=temp_start_date]").css("display", "none");
                    row.find("div[datafield=temp_end_date]").css("display", "none");
                }

                //row.on("change", "input[datafield=mrp]", function () {
                //    page.check_mrp_variation(row, item);
                //    page.calculate();
                //});
                row.on("focus", "input[datafield=mrp]", function () {
                    page.getMRPAutocomplete(row, item, function (data) {
                        row.find("input[datafield=mrp]").autocomplete({
                            minLength: 0,
                            source: data,
                            focus: function (event, ui) {
                                row.find("input[datafield=mrp]").val(ui.item.label);
                                return false;
                            },
                            select: function (event, ui) {
                                item.mrp = ui.item.mrp;
                                item.batch_no = ui.item.batch_no;
                                item.expiry_date = ui.item.expiry_date;
                                item.man_date = ui.item.man_date;
                                item.cost = ui.item.cost;
                                item.var_no = ui.item.var_no;
                                item.price = ui.item.selling_price;
                                $(row).find("input[datafield=price]").val(ui.item.selling_price);
                                $(row).find("input[datafield=var_no]").val(ui.item.var_no);
                                item.stock_selection = "auto";
                                $(row).find("input[datafield=stock_selection]").val("auto");
                                page.calculate();
                            },
                            change: function (event, ui) {
                                page.events.getMRPAutocomplete1();
                            }
                        })
                    });
                });
                
                row.on("click", "[datafield=item_name]", function () {
                    page.clickCount++;
                    if (page.clickCount == 2) {
                        page.clickCount = 0;
                        if (CONTEXT.ITEM_SELECTION_MODE == "HighVolumeAuto") {
                            page.controls.pnlItemStock.open();
                            page.controls.pnlItemStock.title("Stock");
                            page.controls.pnlItemStock.rlabel("Stock");
                            page.controls.pnlItemStock.width(700);
                            page.controls.pnlItemStock.height(300);

                            $$("grdItemStock").width(680);
                            $$("grdItemStock").height("auto");
                            page.controls.grdItemStock.setTemplate({
                                selection: "Single",
                                columns: [
                                    { 'name': "Variation", 'width': "90px", 'dataField': "variation_name" },
                                    { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                                    { 'name': "", 'width': "0px", 'dataField': "stock_no", visible: false },
                                    { 'name': "MRP", 'width': "90px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                                    { 'name': "Cost", 'width': "90px", 'dataField': "cost", visible: CONTEXT.ENABLE_SALES_BUYING_COST },
                                    { 'name': "Batch No", 'width': "90px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                                    { 'name': "Man Date", 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE },
                                    { 'name': "Exp Date", 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE },
                                    { 'name': "Qty", 'width': "90px", 'dataField': "qty" },
                                ]
                            });
                            page.controls.grdItemStock.dataBind([]);
                            page.stockAPI.getStockByItem(item.item_no, function (data) {
                                page.controls.grdItemStock.dataBind(data);
                            });
                        }
                    }
                });
                page.stockAPI.getVariationByItem({ item_no: item.item_no, vendor_no: null }, function (variation) {
                    item.variation_data = variation;
                });
                if (CONTEXT.ITEM_SELECTION_MODE == "HighVolumeManual") {
                    page.stockAPI.getStockByItem(item.item_no, function (data) {
                        if (data.length != 0) {
                            page.controls.pnlItemStock.open();
                            page.controls.pnlItemStock.title("Stock");
                            page.controls.pnlItemStock.rlabel("Stock");
                            page.controls.pnlItemStock.width(700);
                            page.controls.pnlItemStock.height(300);

                            $$("grdItemStock").width(680);
                            $$("grdItemStock").height("auto");
                            page.controls.grdItemStock.setTemplate({
                                selection: "Single",
                                columns: [
                                    { 'name': "Variation", 'width': "90px", 'dataField': "variation_name" },
                                    { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                                    { 'name': "", 'width': "0px", 'dataField': "stock_no", visible: false },
                                    { 'name': "MRP", 'width': "90px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                                    { 'name': "Cost", 'width': "90px", 'dataField': "cost", visible: CONTEXT.ENABLE_SALES_BUYING_COST },
                                    { 'name': "Batch No", 'width': "90px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                                    { 'name': "Man Date", 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE },
                                    { 'name': "Exp Date", 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE },
                                    { 'name': "Qty", 'width': "90px", 'dataField': "qty" },
                                ]
                            });
                            page.controls.grdItemStock.dataBind(data);
                        }
                    });
                }
            };

            $$("grdBill").dataBind(billItems);
            $$("grdBill").edit(true);

            $$("grdBill").selectedObject.find(".grid_header:last-child").hide();
            $$("grdBill").selectedObject.append("<div class='grid_bill_footer'>" + $$("grdBill").selectedObject.find(".grid_header:first-child").html() + "</div>");
            $$("grdBill").selectedObject.find(".grid_bill_footer div").html("");

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=price]").html("Total");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html("0");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html("0");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html("0");

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").attr("cursor", "pointer");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").click(function () {
                $$("lblDiscountLabel").selectedObject.click();
            });

            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").attr("cursor", "pointer");
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").click(function () {
                $$("lblTaxLabel").selectedObject.click();
            });
        }
        page.check_mrp_variation = function (row, billItem) {
            $(billItem.variation_data).each(function (i, item) {
                if (parseFloat(item.mrp) === parseFloat(billItem.mrp)) {
                    billItem.price = item.selling_price;
                    $(row).find("input[datafield=price]").val(item.selling_price);
                    billItem.var_no = item.var_no;
                    $(row).find("input[datafield=var_no]").val(item.var_no);
                }
            });
        }
        page.getMRPAutocomplete = function (row, billItem, callback) {
            var var_data = [];
            $(billItem.variation_data).each(function (i, item) {
                var_data.push({
                    value: item.mrp,
                    label: item.mrp,
                    mrp: item.mrp,
                    batch_no: item.batch_no,
                    expiry_date: item.expiry_date,
                    cost: item.cost,
                    active: item.active,
                    var_no: item.var_no,
                    selling_price: item.selling_price
                });
            });
            callback(var_data);
        };
        page.getMRPAutocomplete1 = function (row, billItem) {
            var var_data = [];
            $(billItem.variation_data).each(function (i, item) {
                /*var_data.push({
                    value: item.mrp,
                    label: item.mrp,
                    mrp: item.mrp,
                    batch_no: item.batch_no,
                    expiry_date: item.expiry_date,
                    cost: item.cost,
                    active: item.active,
                    var_no: item.var_no,
                    selling_price: item.selling_price
                });*/
                if (parseFloat(billItem.mrp) == parseFloat(item.mrp)) {
                    billItem.mrp = item.mrp;
                    billItem.price = item.selling_price;
                    $(row).find("input[datafield=price]").val(item.selling_price);
                    $(row).find("input[datafield=mrp]").val(item.mrp);
                    page.calculate();
                }
            });
        };
        page.events.btnItemStock_click = function () {
            if (CONTEXT.ITEM_SELECTION_MODE == "HighVolumeAuto") {
                var item = $$("grdBill").selectedData()[0];
                page.controls.pnlItemStock.open();
                page.controls.pnlItemStock.title("Stock");
                page.controls.pnlItemStock.rlabel("Stock");
                page.controls.pnlItemStock.width(700);
                page.controls.pnlItemStock.height(300);

                $$("grdItemStock").width(680);
                $$("grdItemStock").height("auto");
                page.controls.grdItemStock.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Variation", 'width': "90px", 'dataField': "variation_name" },
                        { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                        { 'name': "", 'width': "0px", 'dataField': "stock_no", visible: false },
                        { 'name': "MRP", 'width': "90px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                        { 'name': "Cost", 'width': "90px", 'dataField': "cost", visible: CONTEXT.ENABLE_SALES_BUYING_COST },
                        { 'name': "Batch No", 'width': "90px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                        { 'name': "Man Date", 'width': "90px", 'dataField': "man_date", visible: CONTEXT.ENABLE_MAN_DATE },
                        { 'name': "Exp Date", 'width': "90px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE },
                        { 'name': "Qty", 'width': "90px", 'dataField': "qty" },
                    ]
                });
                page.controls.grdItemStock.dataBind([]);
                page.stockAPI.getStockByItem(item.item_no, function (data) {
                    page.controls.grdItemStock.dataBind(data);
                    var rows = page.controls.grdItemStock.getRow({
                        var_no: item.var_no
                    });
                    rows[0].find("[datafield=variation_name]").click();
                });
            }
        }
        page.calculate = function (callback) {
            page.controls.grdDiscount.dataBind(page.selectedBill.discounts);

            var itemDiscounts = arr = jQuery.grep(page.selectedBill.discounts, function (dis, i) {
                if (dis.disc_level == "Item") {
                    if (typeof dis.item_no == "undefined" || dis.item_no == undefined || dis.item_no == "" || dis.item_no == null)
                        return true;
                    else if (dis.item_no == page.discount_item_no)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            });
            page.controls.grdItemDiscount.dataBind(itemDiscounts);

            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            //var comm_tax = 0;

            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdBill.getRowData(row);
                var item_no = billItem.item_no;//parseFloat($(row).find("[datafield=item_no]").find("div").html());
                if (CONTEXT.SELLING_PRICE_EDITABLE) {
                    var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    }
                } else {
                    var price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    }
                }
                
                $(row).find("[datafield=sl_no]").find("div").html(i+1);
                var qty = $(row).find("[datafield=qty]").find("div").html();
                var qty_stock = $(row).find("[datafield=qty_stock]").find("div");
                var qty_val = parseFloat($(row).find("[datafield=qty_const]").find("div").html());
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var txtDiscount = $(row).find("[datafield=discount]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());
                var variation_name = $(row).find("[datafield=variation_name]").find("div").html();
                var cgst = $(row).find("[datafield=cgst]").find("div").html();
                var sgst = $(row).find("[datafield=sgst]").find("div").html();
                var igst = $(row).find("[datafield=igst]").find("div").html();
                var tax_inclusive = $(row).find("[datafield=tax_inclusive]").find("div").html();
                var discount_inclusive = $(row).find("[datafield=discount_inclusive]").find("div").html();
                var txt_sub_total = $(row).find("[datafield=item_sub_total]").find("div");
                var cess_qty = parseFloat($(row).find("[datafield=cess_qty]").find("div").html());
                var cess_qty_amount = parseFloat($(row).find("[datafield=cess_qty_amount]").find("div").html());
                var cess_per = parseFloat($(row).find("[datafield=cess_per]").find("div").html());

                page.controls.grdBill.getRowData(row)
                var alldata = page.controls.grdBill.allData();
                var free_qty;
                $(alldata).each(function (index, item) {
                    if (i == index) {
                        free_qty = parseFloat(item.free_qty);
                    }
                });

                if (isNaN(qty_val))
                    qty_val = parseFloat($(row).find("[datafield=qty_stock]").find("div").html());

                if (isNaN(free_qty))
                    free_qty = 0;


                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = parseFloat(item.tax_per);
                        }
                    });
                    return rdata;
                }
                var tax = parseFloat(getTaxPercent(tax_class_no));
                //tax = tax;
                var discount = 0; //calculate using rules in future
                var count = 1;
                $(page.selectedBill.discounts).each(function (j, data) {
                    if (data.item_no == item_no) {
                        //Discount for all items
                        if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {

                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }

                        } else if (data.item_no == item_no) {
                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }
                        }
                    }
                    else if(typeof data.item_no == "undefined"||data.item_no ==null||data.item_no =="") {
                        if (data.disc_type == "Fixed")
                            discount = discount + data.disc_value * qty;
                        else if (data.disc_type == "Percent") {
                            if (discount_inclusive == "1") {
                                discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                            }
                            else {
                                discount = discount + ((price * qty) * data.disc_value / 100);
                            }
                        }
                    }
                });
                tot_discount = tot_discount + discount;
                //price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    if (!page.creditBill) {
                        if (tax_inclusive == "1") {
                            price = parseFloat(price) - parseFloat(cess_qty_amount);
                            price = (parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1));// - parseFloat(cess_qty_amount);
                        }
                        else
                            price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                    }
                }
                else {
                    price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                if (isNaN(price)) {
                    price = 0;
                }
                var qty_price = (price * qty);
                sub_total = sub_total + qty_price;
               // var disc_price = qty_price - discount
                //var tax_amount = (disc_price * tax / 100);
                var tax_amount = (qty_price * tax / 100) + (parseFloat(qty) * parseFloat(cess_qty_amount));
                tot_sales_tax = tot_sales_tax + tax_amount;
                //var amount = disc_price + tax_amount;
                var amount = qty_price + tax_amount;
                var rem_qty = qty_val - qty - parseFloat(free_qty);
                txt_sub_total.html(qty_price);
                billItem.item_sub_total = qty_price;
                txtTax.html(tax);
                
                txtDiscount.html(parseFloat(discount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                txtAmount.html(parseFloat(amount).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                var currentData = page.controls.grdBill.getRowData(row); //set the grid value
                currentData.tax_per = tax;
                currentData.discount = discount;
                currentData.total_price = amount;
                currentData.additional_tax = parseFloat(qty) * parseFloat(cess_qty_amount);
                //currentData.disc_no = page.discount.disc_no;
                $(row).find("[datafield=additional_tax]").find("div").html(parseFloat(parseFloat(qty) * parseFloat(cess_qty_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                cess_amt_value = parseFloat(cess_amt_value) + (parseFloat(qty) * parseFloat(cess_qty_amount));
                cess_per_value = parseFloat(cess_per_value) + (qty_price * parseFloat(cess_per) / 100);
                cgst_value = parseFloat(cgst_value) + (qty_price * parseFloat(cgst) / 100);
                sgst_value = parseFloat(sgst_value) + (qty_price * parseFloat(sgst) / 100);
                igst_value = parseFloat(igst_value) + (qty_price * parseFloat(igst) / 100);

                $(row).find("[datafield=cgst_val]").find("div").html(parseFloat(qty_price * parseFloat(cgst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=sgst_val]").find("div").html(parseFloat(qty_price * parseFloat(sgst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=igst_val]").find("div").html(parseFloat(qty_price * parseFloat(igst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=cess_per_val]").find("div").html(parseFloat(qty_price * parseFloat(cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=tax_per_amt]").find("div").html(parseFloat(tax_amount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            });
            //Show the subtotal
            page.controls.lblSubTotal.value(parseFloat(parseFloat(sub_total) + parseFloat(tot_discount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            total = sub_total + tot_sales_tax;// - tot_discount;

            var data = page.controls.grdBill.allData();
            
            page.controls.lblDiscount.value(parseFloat(tot_discount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTax.value(parseFloat(tot_sales_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            var total_after_Rnd_off = Math.round(parseFloat(total));// total_after_Rnd_off
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(total)).toFixed(CONTEXT.COUNT_AFTER_POINTS);

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            //Discount charge
            if ($$("txtBillDiscount").value() != "" && $$("txtBillDiscount").value() != 0 && isInt($$("txtBillDiscount").value() != 0) && page.controls.lblSubTotal.value() != 0) {
                var expAmount = $$("txtBillDiscount").value();
                var tot_with_expense = parseFloat(total_after_Rnd_off) - parseFloat(expAmount);
                tot_with_expense = tot_with_expense.toFixed(5);
                page.controls.lblTotalNet.value(parseFloat(tot_with_expense).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            }
            else
                page.controls.lblTotalNet.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.interface.setBillAmount(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            if (page.controls.lblTotal.value() == 0 || page.controls.lblTotal.value() == "" || page.controls.lblTotal.value() == undefined) {
                $$("txtExpense").value('');
            }


            if (CONTEXT.ENABLE_TOTAL_QTY_IN_BILL) {
                var alldataqty = page.controls.grdBill.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                    }
                    if (!temp[obj.alter_unit]) {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                    }
                }
                var result = "";
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + ",";
                }
                $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=unit]").html(result);
            }
            
             
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
            
            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            //callback([]);

        }
        page.billCalculate = function (data,billType) {
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            $(data).each(function (i, item) {
                var price = item.price;
                var discount = item.discount;
                var qty = item.qty;
                var tax = item.tax_per;
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    if (!page.creditBill) {
                        if (item.tax_inclusive == "1") {
                            price = parseFloat(price) - (parseFloat(item.additional_tax) / parseFloat(item.qty));
                            price = (parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1));// - parseFloat(cess_qty_amount);
                        }
                        else
                            price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                    }
                }
                else {
                    price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                if (isNaN(price)) {
                    price = 0;
                }
                var qty_price = (price * qty);
                cess_per_value = parseFloat(cess_per_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.cess_per)) / 100);
                cgst_value = parseFloat(cgst_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.cgst)) / 100);
                sgst_value = parseFloat(sgst_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.sgst)) / 100);
                igst_value = parseFloat(igst_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.igst)) / 100);
                cess_amt_value = parseFloat(cess_amt_value) + parseFloat(item.additional_tax);
            });
            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.grdDiscount.dataBind(page.selectedBill.discounts);
            var itemDiscounts = arr = jQuery.grep(page.selectedBill.discounts, function (dis, i) {
                if (dis.disc_level == "Item") {
                    if (typeof dis.item_no == "undefined" || dis.item_no == undefined || dis.item_no == "" || dis.item_no == null)
                        return true;
                    else if (dis.item_no == page.discount_item_no)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            });
            page.controls.grdItemDiscount.dataBind(itemDiscounts);
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdBill.getRowData(row);
                var item_no = billItem.item_no;//parseFloat($(row).find("[datafield=item_no]").find("div").html());
                if (CONTEXT.SELLING_PRICE_EDITABLE) {
                    var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    }
                } else {
                    var price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    }
                }

                $(row).find("[datafield=sl_no]").find("div").html(i + 1);
                var qty = $(row).find("[datafield=qty]").find("div").html();
                var qty_stock = $(row).find("[datafield=qty_stock]").find("div");
                var qty_val = parseFloat($(row).find("[datafield=qty_const]").find("div").html());
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var txtDiscount = $(row).find("[datafield=discount]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());
                var variation_name = $(row).find("[datafield=variation_name]").find("div").html();
                var cgst = $(row).find("[datafield=cgst]").find("div").html();
                var sgst = $(row).find("[datafield=sgst]").find("div").html();
                var igst = $(row).find("[datafield=igst]").find("div").html();
                var tax_inclusive = $(row).find("[datafield=tax_inclusive]").find("div").html();
                var discount_inclusive = $(row).find("[datafield=discount_inclusive]").find("div").html();
                var txt_sub_total = $(row).find("[datafield=item_sub_total]").find("div");
                var cess_qty = parseFloat($(row).find("[datafield=cess_qty]").find("div").html());
                var cess_qty_amount = parseFloat($(row).find("[datafield=cess_qty_amount]").find("div").html());
                var cess_per = parseFloat($(row).find("[datafield=cess_per]").find("div").html());
                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = parseFloat(item.tax_per);
                        }
                    });
                    return rdata;
                }
                var tax = parseFloat(getTaxPercent(tax_class_no));
                //tax = tax;
                var discount = 0; //calculate using rules in future
                var count = 1;
                if (billType == "Sale" || billType == "NewBill") {
                    $(page.selectedBill.discounts).each(function (j, data) {
                        if (data.item_no == item_no) {
                            //Discount for all items
                            if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {

                                if (data.disc_type == "Fixed")
                                    discount = discount + data.disc_value * qty;
                                else if (data.disc_type == "Percent") {
                                    if (discount_inclusive == "1") {
                                        discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                    }
                                    else {
                                        discount = discount + ((price * qty) * data.disc_value / 100);
                                    }
                                }

                            } else if (data.item_no == item_no) {
                                if (data.disc_type == "Fixed")
                                    discount = discount + data.disc_value * qty;
                                else if (data.disc_type == "Percent") {
                                    if (discount_inclusive == "1") {
                                        discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                    }
                                    else {
                                        discount = discount + ((price * qty) * data.disc_value / 100);
                                    }
                                }
                            }
                        }
                        else if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }
                        }
                    });
                }
                
                tot_discount = tot_discount + discount;
                //price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                if (billType == "Sale" || billType == "NewBill") {
                    if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                        if (!page.creditBill) {
                            if (tax_inclusive == "1") {
                                price = parseFloat(price) - parseFloat(cess_qty_amount);
                                price = (parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1));// - parseFloat(cess_qty_amount);
                            }
                            else
                                price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                        }
                    }
                    else {
                        price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                    }
                }
                
                if (isNaN(price)) {
                    price = 0;
                }
                var qty_price = (price * qty);
                sub_total = sub_total + qty_price;
                // var disc_price = qty_price - discount
                //var tax_amount = (disc_price * tax / 100);
                var tax_amount = (qty_price * tax / 100) + (parseFloat(qty) * parseFloat(cess_qty_amount));

                $(row).find("[datafield=cgst_val]").find("div").html(parseFloat(qty_price * parseFloat(cgst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=sgst_val]").find("div").html(parseFloat(qty_price * parseFloat(sgst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=igst_val]").find("div").html(parseFloat(qty_price * parseFloat(igst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=cess_per_val]").find("div").html(parseFloat(qty_price * parseFloat(cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=tax_per_amt]").find("div").html(parseFloat(tax_amount).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            });
            
        }
        page.returnBillCalculate = function (data) {
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            $(data).each(function (i, item) {
                var price = item.price;
                var discount = item.discount;
                var qty = item.qty;
                var tax = item.tax_per;
                price = parseFloat(parseFloat(price));
                if (isNaN(price)) {
                    price = 0;
                }
                var qty_price = (price * qty);
                cess_per_value = parseFloat(cess_per_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.cess_per)) / 100);
                cgst_value = parseFloat(cgst_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.cgst)) / 100);
                sgst_value = parseFloat(sgst_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.sgst)) / 100);
                igst_value = parseFloat(igst_value) + parseFloat(parseFloat(qty_price) * (parseFloat(item.igst)) / 100);
                cess_amt_value = parseFloat(cess_amt_value) + parseFloat(item.additional_tax);
            });
            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
        }
        page.reCalculate = function (callback) {
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdBill.getRowData(row);
                var price = ($$("ddlRate").selectedValue() == "1") ? billItem.temp_price : ($$("ddlRate").selectedValue() == "2") ? billItem.alter_price_1 : billItem.alter_price_2;
                billItem.price = price;
                $(row).find("[datafield=price]").find("div").html(price);
            });
            callback({});
        }
        page.calculateDays = function (callback) {
            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdBill.getRowData(row);
                var start_date = $(row).find("[datafield=start_date]").find("div").html();
                var end_date = $(row).find("[datafield=end_date]").find("div").html();
                if(start_date != null && start_date != "" && typeof start_date != "undefined")
                {
                    if (end_date != null && end_date != "" && typeof end_date != "undefined") {
                        start_date = start_date.split('-');
                        end_date = end_date.split('-');
                        if (start_date[0].length == 2) {
                            var swap;
                            swap = start_date[0];
                            start_date[0] = start_date[2];
                            start_date[2] = swap;
                        }
                        if (end_date[0].length == 2) {
                            var swap;
                            swap = end_date[0];
                            end_date[0] = end_date[2];
                            end_date[2] = swap;
                        }
                        var new_start_date = new Date(start_date[0], start_date[1], start_date[2]);
                        var new_end_date = new Date(end_date[0], end_date[1], end_date[2]);
                        var tot_days = Math.round((new_end_date.getTime() - new_start_date.getTime()) / (1000 * 60 * 60 * 24));
                        billItem.qty = tot_days+1;
                        $(row).find("[datafield=qty]").find("div").html(billItem.qty);
                        $(row).find("[datafield=temp_qty]").find("div").val(billItem.qty);
                        $(row).find("input[datafield=temp_qty]").val(billItem.qty);
                        billItem.temp_qty = billItem.qty;
                    }
                }
            });
            callback({});
        }
        page.searchStock_click = function () {
            if ($$("txtItemSearch").selectedObject.val() != "") {
                var term = $$("txtItemSearch").selectedObject.val();
                var filter = "";
                var sort = "";
                if (term.startsWith("00"))
                    term = term.substring(0, term.length - 1);
                if (!isNaN(term))
                    filter = "(c.item_no = '" + term + "' or c.item_code = '" + term + "' or c.barcode like '%" + term + "%' )";
                else
                    filter = "(item_name like '" + term + "%' or c.barcode like '%" + term + "%'   or man_name like '" + term + "')";
                var search = term;
                var flag = false;

                if (search.startsWith("S") || search.startsWith("s")) {
                    var no = search.substring(1, search.length);
                    if (!isNaN(no)) {
                        filter = "(ist.stock_no = '" + search.substring(1, search.length) + "' and m.var_no=ist.var_no )";
                        flag = true;
                    }
                }
                if (CONTEXT.ENABLE_STOCK_MAINTANENCE) {
                    sort = "having qty_stock > 0";
                }
                if (flag) {
                    page.salesItemAPI.searchValues("", "", filter, sort, function (data) {
                        if (data.length == 1) {
                            page.selectItem(data[0]);
                        }
                    });
                }
                else {
                    page.salesItemAPI.getValue({ item_no: term, sales_tax_no: CONTEXT.DEFAULT_SALES_TAX }, function (data) {
                        if (data.length == 1) {
                            page.selectItem(data[0]);
                        }
                    });
                }
            }
        }
        page.calculateTotal = function (callback) {
            page.controls.grdDiscount.dataBind(page.selectedBill.discounts);

            var itemDiscounts = arr = jQuery.grep(page.selectedBill.discounts, function (dis, i) {
                if (dis.disc_level == "Item") {
                    if (typeof dis.item_no == "undefined" || dis.item_no == undefined || dis.item_no == "" || dis.item_no == null)
                        return true;
                    else if (dis.item_no == page.discount_item_no)
                        return true;
                    else
                        return false;
                }
                else
                    return false;
            });
            page.controls.grdItemDiscount.dataBind(itemDiscounts);

            var sub_total = 0;
            var tot_sales_tax = 0;
            var tot_discount = 0;
            var total = 0;
            var cess_per_value = 0;
            var cess_amt_value = 0;
            var cgst_value = 0;
            var sgst_value = 0;
            var igst_value = 0;
            //var comm_tax = 0;

            $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdBill.getRowData(row);
                var item_no = billItem.item_no;//parseFloat($(row).find("[datafield=item_no]").find("div").html());
                if (CONTEXT.SELLING_PRICE_EDITABLE) {
                    var price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    }
                } else {
                    var price = parseFloat($(row).find("[datafield=price]").find("div").html());
                    if (isNaN(price)) {
                        price = parseFloat($(row).find("[datafield=price]").find("input").val());
                    }
                }

                $(row).find("[datafield=sl_no]").find("div").html(i + 1);
                var qty = $(row).find("[datafield=qty]").find("div").html();
                var qty_stock = $(row).find("[datafield=qty_stock]").find("div");
                var qty_val = parseFloat($(row).find("[datafield=qty_const]").find("div").html());
                var tax_class_no = parseInt($(row).find("[datafield=tax_class_no]").find("div").html());
                var txtTax = $(row).find("[datafield=tax_per]").find("div");
                var txtDiscount = $(row).find("[datafield=discount]").find("div");
                var txtAmount = $(row).find("[datafield=total_price]").find("div");
                var txtAmountVal = parseFloat($(row).find("[datafield=total_price]").find("div").html());
                var variation_name = $(row).find("[datafield=variation_name]").find("div").html();
                var cgst = $(row).find("[datafield=cgst]").find("div").html();
                var sgst = $(row).find("[datafield=sgst]").find("div").html();
                var igst = $(row).find("[datafield=igst]").find("div").html();
                var tax_inclusive = $(row).find("[datafield=tax_inclusive]").find("div").html();
                var discount_inclusive = $(row).find("[datafield=discount_inclusive]").find("div").html();
                var txt_sub_total = $(row).find("[datafield=item_sub_total]").find("div");
                var cess_qty = parseFloat($(row).find("[datafield=cess_qty]").find("div").html());
                var cess_qty_amount = parseFloat($(row).find("[datafield=cess_qty_amount]").find("div").html());
                var cess_per = parseFloat($(row).find("[datafield=cess_per]").find("div").html());

                page.controls.grdBill.getRowData(row)
                var alldata = page.controls.grdBill.allData();
                var free_qty;
                $(alldata).each(function (index, item) {
                    if (i == index) {
                        free_qty = parseFloat(item.free_qty);
                    }
                });

                if (isNaN(qty_val))
                    qty_val = parseFloat($(row).find("[datafield=qty_stock]").find("div").html());

                if (isNaN(free_qty))
                    free_qty = 0;


                function getTaxPercent(tax_class_no) {
                    var rdata = 0;
                    $(page.selectedBill.sales_tax_class).each(function (i, item) {
                        if (tax_class_no == item.tax_class_no) {
                            rdata = parseFloat(item.tax_per);
                        }
                    });
                    return rdata;
                }
                var tax = parseFloat(getTaxPercent(tax_class_no));
                //tax = tax;
                var discount = 0; //calculate using rules in future
                var count = 1;
                $(page.selectedBill.discounts).each(function (j, data) {
                    if (data.item_no == item_no) {
                        //Discount for all items
                        if (typeof data.item_no == "undefined" || data.item_no == undefined || data.item_no == "" || data.item_no == null) {

                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }

                        } else if (data.item_no == item_no) {
                            if (data.disc_type == "Fixed")
                                discount = discount + data.disc_value * qty;
                            else if (data.disc_type == "Percent") {
                                if (discount_inclusive == "1") {
                                    discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                                }
                                else {
                                    discount = discount + ((price * qty) * data.disc_value / 100);
                                }
                            }
                        }
                    }
                    else if (typeof data.item_no == "undefined" || data.item_no == null || data.item_no == "") {
                        if (data.disc_type == "Fixed")
                            discount = discount + data.disc_value * qty;
                        else if (data.disc_type == "Percent") {
                            if (discount_inclusive == "1") {
                                discount = discount + ((parseFloat(price) - parseFloat(price / ((data.disc_value / 100) + 1))) * parseFloat(qty));
                            }
                            else {
                                discount = discount + ((price * qty) * data.disc_value / 100);
                            }
                        }
                    }
                });
                tot_discount = tot_discount + discount;
                //price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                    if (!page.creditBill) {
                        if (tax_inclusive == "1") {
                            price = parseFloat(price) - parseFloat(cess_qty_amount);
                            price = (parseFloat(parseFloat(price) - (parseFloat(discount) / qty)) / parseFloat((parseFloat(tax) / 100) + 1));// - parseFloat(cess_qty_amount);
                        }
                        else
                            price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                    }
                }
                else {
                    price = parseFloat(parseFloat(price) - (parseFloat(discount) / qty));
                }
                if (isNaN(price)) {
                    price = 0;
                }
                var qty_price = (price * qty);
                sub_total = sub_total + qty_price;
                // var disc_price = qty_price - discount
                //var tax_amount = (disc_price * tax / 100);
                var tax_amount = (qty_price * tax / 100) + (parseFloat(qty) * parseFloat(cess_qty_amount));
                tot_sales_tax = tot_sales_tax + tax_amount;
                //var amount = disc_price + tax_amount;
                var amount = qty_price + tax_amount;
                var rem_qty = qty_val - qty - parseFloat(free_qty);
                txt_sub_total.html(qty_price);
                billItem.item_sub_total = qty_price;
                txtTax.html(tax);

                txtDiscount.html(parseFloat(discount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                txtAmount.html(parseFloat(amount).toFixed(CONTEXT.COUNT_AFTER_POINTS));

                var currentData = page.controls.grdBill.getRowData(row); //set the grid value
                currentData.tax_per = tax;
                currentData.discount = discount;
                currentData.total_price = amount;
                currentData.additional_tax = parseFloat(qty) * parseFloat(cess_qty_amount);
                //currentData.disc_no = page.discount.disc_no;
                $(row).find("[datafield=additional_tax]").find("div").html(parseFloat(parseFloat(qty) * parseFloat(cess_qty_amount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                cess_amt_value = parseFloat(cess_amt_value) + (parseFloat(qty) * parseFloat(cess_qty_amount));
                cess_per_value = parseFloat(cess_per_value) + (qty_price * parseFloat(cess_per) / 100);
                cgst_value = parseFloat(cgst_value) + (qty_price * parseFloat(cgst) / 100);
                sgst_value = parseFloat(sgst_value) + (qty_price * parseFloat(sgst) / 100);
                igst_value = parseFloat(igst_value) + (qty_price * parseFloat(igst) / 100);

                $(row).find("[datafield=cgst_val]").find("div").html(parseFloat(qty_price * parseFloat(cgst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=sgst_val]").find("div").html(parseFloat(qty_price * parseFloat(sgst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=igst_val]").find("div").html(parseFloat(qty_price * parseFloat(igst) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=cess_per_val]").find("div").html(parseFloat(qty_price * parseFloat(cess_per) / 100).toFixed(CONTEXT.COUNT_AFTER_POINTS));
                $(row).find("[datafield=tax_per_amt]").find("div").html(parseFloat(tax_amount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            });
            //Show the subtotal
            page.controls.lblSubTotal.value(parseFloat(parseFloat(sub_total) + parseFloat(tot_discount)).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            total = sub_total + tot_sales_tax;// - tot_discount;

            var data = page.controls.grdBill.allData();

            page.controls.lblDiscount.value(parseFloat(tot_discount).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblTax.value(parseFloat(tot_sales_tax).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            var total_after_Rnd_off = Math.round(parseFloat(total));// total_after_Rnd_off
            var round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(total)).toFixed(CONTEXT.COUNT_AFTER_POINTS);

            page.controls.lblRndOff.value(parseFloat(round_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.controls.lblTotal.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            //Discount charge
            if ($$("txtBillDiscount").value() != "" && $$("txtBillDiscount").value() != 0 && isInt($$("txtBillDiscount").value() != 0) && page.controls.lblSubTotal.value() != 0) {
                var expAmount = $$("txtBillDiscount").value();
                var tot_with_expense = parseFloat(total_after_Rnd_off) - parseFloat(expAmount);
                tot_with_expense = tot_with_expense.toFixed(5);
                page.controls.lblTotalNet.value(parseFloat(tot_with_expense).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            }
            else
                page.controls.lblTotalNet.value(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));

            page.interface.setBillAmount(parseFloat(total_after_Rnd_off).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            if (page.controls.lblTotal.value() == 0 || page.controls.lblTotal.value() == "" || page.controls.lblTotal.value() == undefined) {
                $$("txtExpense").value('');
            }


            if (CONTEXT.ENABLE_TOTAL_QTY_IN_BILL) {
                var alldataqty = page.controls.grdBill.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                            temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                    }
                    if (!temp[obj.alter_unit]) {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = obj.temp_qty;
                    } else {
                        if (parseInt(obj.unit_identity) == 1)
                            temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                    }
                }
                var result = "";
                for (var i in temp) {
                    result = result + temp[i] + ":" + i + ",";
                }
                $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=unit]").html(result);
            }


            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
            $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());

            page.controls.lblCGSTAmount.value(parseFloat(cgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblSGSTAmount.value(parseFloat(sgst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblIGSTAmount.value(parseFloat(igst_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessAmount.value(parseFloat(cess_per_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            page.controls.lblCessRate.value(parseFloat(cess_amt_value).toFixed(CONTEXT.COUNT_AFTER_POINTS));
            callback(page.selectedBill.discounts);

        }
        
        page.checkSalesExecutive = function (row, billItem) {
            var check = true;
            var exe_id = "";
            billItem.reward_plan_id = 0;
            billItem.reward_plan_point = 1;
            if (billItem.executive_id.startsWith("1000")) {
                $(page.salesExecutiveList).each(function (i, item) {
                    if (check) {
                        //var se_name = item.sale_executive_name.toUpperCase();
                        //var a = se_name[0].charCodeAt(0);
                        //var b = se_name[1].charCodeAt(0);
                        var id = parseInt(item.sale_executive_no);
                        var ori_exe_id = billItem.executive_id.substr(1).slice(0, -1);
                        if (parseInt(id) == parseInt(ori_exe_id)) {
                            exe_id = parseInt(item.value);
                            billItem.reward_plan_id = item.reward_plan_id;
                            billItem.reward_plan_point = item.reward_plan_point;
                            check = false;
                        }
                    }
                })
            }
            else {
                $(page.salesExecutiveList).each(function (i, item) {
                    if (check) {
                        if (parseInt(item.value) == parseInt(billItem.executive_id)) {
                            exe_id = parseInt(item.value);
                            billItem.reward_plan_id = item.reward_plan_id;
                            billItem.reward_plan_point = item.reward_plan_point;
                            check = false;
                        }
                    }
                })
            }
            billItem.executive_id = exe_id;
            row.find("[datafield=executive_id]").val(billItem.executive_id);
        }
        page.events.btnSaveItemStock_click = function () {
            var count = 0;
            var length = page.controls.grdItemStock.selectedData().length;
            if (length == 1) {
                $(page.controls.grdBill.selectedRows()).each(function (i, row) {
                    var billItem = page.controls.grdBill.getRowData(row);
                    var upd_data = page.controls.grdItemStock.selectedData()[0];
                    billItem.price = upd_data.selling_price;
                    $(row).find("input[datafield=price]").val(billItem.price);
                    billItem.var_no = upd_data.var_no;
                    $(row).find("input[datafield=var_no]").val(billItem.var_no);
                    $(row).find("[datafield=var_no]").find("div").html(billItem.var_no);
                    billItem.qty_const = upd_data.qty;
                    $(row).find("[datafield=qty_const]").find("div").html(billItem.qty_stock);
                    billItem.qty_stock = parseFloat(upd_data.qty) - parseFloat(billItem.qty);
                    $(row).find("[datafield=qty_stock]").find("div").html(billItem.qty_stock);
                    billItem.stock_no = upd_data.stock_no;
                    $(row).find("[datafield=stock_no]").find("div").html(billItem.stock_no);
                    billItem.stock_selection = "stockno";
                    $(row).find("[datafield=stock_selection]").find("div").html("stockno");
                    billItem.mrp = upd_data.mrp;
                    $(row).find("input[datafield=mrp]").val(billItem.mrp);
                    billItem.cost = upd_data.cost;
                    $(row).find("input[datafield=cost]").val(billItem.cost);
                    $(row).find("[datafield=cost]").find("div").html(billItem.cost);
                    billItem.batch_no = upd_data.batch_no;
                    $(row).find("input[datafield=batch_no]").val(billItem.batch_no);
                    $(row).find("[datafield=batch_no]").find("div").html(billItem.batch_no);
                    billItem.man_date = upd_data.man_date;
                    $(row).find("input[datafield=man_date]").val(billItem.man_date);
                    $(row).find("[datafield=man_date]").find("div").html(billItem.man_date);
                    billItem.expiry_date = upd_data.expiry_date;
                    $(row).find("input[datafield=expiry_date]").val(billItem.expiry_date);
                    $(row).find("[datafield=expiry_date]").find("div").html(billItem.expiry_date);
                });
            }
            else {
                $(page.controls.grdBill.selectedRows()).each(function (i, row) {
                    var billItem = page.controls.grdBill.getRowData(row);
                    var upd_data = page.controls.grdItemStock.selectedData()[0];
                    billItem.price = upd_data.selling_price;
                    $(row).find("input[datafield=price]").val(billItem.price);
                    billItem.var_no = upd_data.var_no;
                    $(row).find("input[datafield=var_no]").val(billItem.var_no);
                    billItem.qty_const = upd_data.qty;
                    $(row).find("[datafield=qty_const]").find("div").html(billItem.qty_stock);
                    billItem.qty_stock = parseFloat(upd_data.qty) - parseFloat(billItem.qty);
                    $(row).find("[datafield=qty_stock]").find("div").html(billItem.qty_stock);
                    billItem.stock_no = upd_data.stock_no;
                    $(row).find("[datafield=stock_no]").find("div").html(billItem.stock_no);
                    billItem.stock_selection = "stockno";
                    $(row).find("[datafield=stock_selection]").find("div").html("stockno");
                    billItem.mrp = upd_data.mrp;
                    $(row).find("input[datafield=mrp]").val(billItem.mrp);
                    billItem.cost = upd_data.cost;
                    $(row).find("input[datafield=cost]").val(billItem.cost);
                    billItem.batch_no = upd_data.batch_no;
                    $(row).find("input[datafield=batch_no]").val(billItem.batch_no);
                    billItem.man_date = upd_data.man_date;
                    $(row).find("input[datafield=man_date]").val(billItem.man_date);
                    billItem.expiry_date = upd_data.expiry_date;
                    $(row).find("input[datafield=expiry_date]").val(billItem.expiry_date);
                });
                for (var i = 1; i < length; i++) {
                    var billItem = page.controls.grdBill.selectedData()[0];
                    var upd_data = page.controls.grdItemStock.selectedData()[i];
                    billItem.price = upd_data.selling_price;
                    billItem.var_no = upd_data.var_no;
                    billItem.qty_stock = upd_data.qty;
                    billItem.stock_no = upd_data.stock_no;
                    billItem.stock_selection = "stockno";
                    billItem.mrp = upd_data.mrp;
                    billItem.cost = upd_data.cost;
                    billItem.batch_no = upd_data.batch_no;
                    billItem.man_date = upd_data.man_date;
                    billItem.expiry_date = upd_data.expiry_date;
                    var rows = page.controls.grdBill.getRow({
                        var_no: billItem.var_no
                    });
                    if (rows.length == 0) {
                        page.controls.grdBill.createRow(billItem);
                        page.controls.grdBill.edit(true);
                        rows = page.controls.grdBill.getRow({
                            var_no: item.var_no
                        });
                        rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                    }
                    else {
                        var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                        txtQty.val(parseFloat(txtQty.val()) + 1);
                        rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                    }
                }
            }
            //$(page.controls.grdBill.selectedRows()).each(function (i, row) {
            //    count++;
            //    if (count == 1) {
            //        var billItem = page.controls.grdBill.getRowData(row);
            //        billItem.price = page.controls.grdItemStock.selectedData()[0].selling_price;
            //        $(row).find("input[datafield=price]").val(billItem.price);
            //        billItem.var_no = page.controls.grdItemStock.selectedData()[0].var_no;
            //        $(row).find("input[datafield=var_no]").val(billItem.var_no);
            //        billItem.qty_stock = page.controls.grdItemStock.selectedData()[0].qty;
            //        $(row).find("[datafield=qty_stock]").find("div").html(billItem.qty_stock);
            //        billItem.stock_no = page.controls.grdItemStock.selectedData()[0].stock_no;
            //        $(row).find("[datafield=stock_no]").find("div").html(billItem.stock_no);
            //        billItem.stock_selection = "stockno";
            //        $(row).find("[datafield=stock_selection]").find("div").html("stockno");
            //    }
            //    else {
            //        var billItem = page.controls.grdBill.getRowData(row);
            //        billItem.price = page.controls.grdItemStock.selectedData()[0].selling_price;
            //        $(row).find("input[datafield=price]").val(billItem.price);
            //        billItem.var_no = page.controls.grdItemStock.selectedData()[0].var_no;
            //        $(row).find("input[datafield=var_no]").val(billItem.var_no);
            //        billItem.qty_stock = page.controls.grdItemStock.selectedData()[0].qty;
            //        $(row).find("[datafield=qty_stock]").find("div").html(billItem.qty_stock);
            //        billItem.stock_no = page.controls.grdItemStock.selectedData()[0].stock_no;
            //        $(row).find("[datafield=stock_no]").find("div").html(billItem.stock_no);
            //        billItem.stock_selection = "stockno";
            //        $(row).find("[datafield=stock_selection]").find("div").html("stockno");
            //    }
                

            //});
            page.calculate();
            $$("pnlItemStock").close();
        }
        

        page.insertBill = function (bill_type, pay_mode, callback) {
            page.msgPanel.show("Bill is Creating...");
            try{
                var result = "";
                if (CONTEXT.ENABLE_TOTAL_QTY_IN_BILL) {
                    var alldataqty = page.controls.grdBill.allData();
                    var temp = {};
                    var obj = null;
                    for (var i = 0; i < alldataqty.length; i++) {
                        obj = alldataqty[i];

                        if (!temp[obj.unit]) {
                            if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                                temp[obj.unit] = obj.temp_qty;
                        } else {
                            if (parseInt(obj.unit_identity) == 0 || obj.unit_identity == null || obj.unit_identity == undefined)
                                temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.temp_qty);
                        }
                        if (!temp[obj.alter_unit]) {
                            if (parseInt(obj.unit_identity) == 1)
                                temp[obj.alter_unit] = obj.temp_qty;
                        } else {
                            if (parseInt(obj.unit_identity) == 1)
                                temp[obj.alter_unit] = parseFloat(temp[obj.alter_unit]) + parseFloat(obj.temp_qty);
                        }
                    }
                    for (var i in temp) {
                        result = result + temp[i] + ":" + i + "/";
                    }
                }
                var buying_cost = 0;
                var cus_name = $$("txtCustomerName").selectedObject.val().split('_');
                var newBill = {
                    bill_no: (page.creditBill) ? "0" : page.currentBillNo.toString(),
                    bill_date: dbDateTime($$("txtBillDate").getDate()),
                    store_no: getCookie("user_store_id"),
                    reg_no:localStorage.getItem("user_register_id"),
                    user_no: localStorage.getItem("app_user_id"),
                    due_date: dbDateTime($$("txtBillDueDate").getDate()),

                    sub_total: page.controls.lblSubTotal.value(),
                    round_off: page.controls.lblRndOff.value(),
                    total: (pay_mode == "EMI") ? page.controls.lblTotalEMIAmount.value() : page.controls.lblTotal.value(),
                    discount: page.controls.lblDiscount.value(),
                    tax: page.controls.lblTax.value(),

                    bill_type: bill_type,
                    state_no: bill_type == "SaleSaved" ? "100" : (bill_type == "Sale" || bill_type == "SalesCredit" || bill_type == "SalesDebit") ? "200" : "300",
                    sales_tax_no: page.selectedBill.sales_tax_no,
                    //pay_type: $$("ddlPayType").selectedValue(),
                    delivered_by: $$("ddlDeliveryBy").selectedValue(),
                    expense: ($$("txtExpense").value() == "" || $$("txtExpense").value() == null) ? 0 : $$("txtExpense").value(),
                    cust_no: page.controls.hdnCustomerNo.val(),
                    cust_name: cus_name[0],//$$("txtCustomerName").selectedObject.val(),
                    mobile_no: $$("lblPhoneNo").value(),
                    email_id: $$("lblEmailId").value(),
                    cust_address: $$("lblAddress").value().replace(/,/g, '-'),
                    gst_no: $$("lblGst").value(),
                    tot_qty_words: result,
                    bill_no_par: (page.creditBill) ? page.currentBillNo.toString() : "",
                    pay_mode: $$("ddlPayType").selectedValue(),
                    bill_barcode: "",//Check It
                    sales_executive: $$("ddlDeliveryBy").selectedValue(),
                    //FINFACTS ENTRY DATA
                    invent_type: (bill_type == "SaleSaved" || bill_type == "Sale" || bill_type == "SalesCredit" || bill_type == "SalesDebit") ? "SaleCredit" : "SaleReturnCredit",
                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    advance_amount: $$("txtAdvanceAmount").val(),
                    advance_status: $$("ddlAdvancePayType").selectedValue(),
                    adv_end_date: dbDateTime($$("txtAdvEndDate").getDate()),
                    bill_discount: ($$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null) ? 0 : $$("txtBillDiscount").value(),
                    //fulfill: true,
                    price_rate: $$("ddlRate").selectedValue()
                };
                var rbillItems = [];
                var executivePoints = [];
                $(page.controls.grdBill.allData()).each(function (i, billItem) {
                    if (parseFloat(billItem.qty) > 0) {
                        var qty = billItem.free_qty;
                        if (isNaN(qty))
                            qty = 0;
                        if (billItem.alter_unit != undefined && billItem.alter_unit != null && billItem.alter_unit != "") {
                            var start = billItem.qty.length - billItem.alter_unit.length;
                            if (!isNaN(start)) {
                                var lastChar = billItem.qty.substring(start, billItem.qty.length);
                                if (lastChar == billItem.alter_unit) {
                                    billItem.qty = parseFloat(billItem.qty) * billItem.alter_unit_fact;
                                }
                            }
                        }
                        if (billItem.tray_received == "" || billItem.tray_received == null || typeof billItem.tray_received == "undefined") {
                            billItem.tray_received = 0;
                        }
                        if (isNaN(billItem.tray_received) || billItem.tray_received < 0) {
                            throw "Tray shold be a number and non negative";
                        }
                        var temp_start_date = billItem.start_date.split('-');
                        if (temp_start_date[0].length == 2) {
                            billItem.start_date = temp_start_date[2] + "-" + temp_start_date[1] + "-" + temp_start_date[0];
                        }
                        var temp_end_date = billItem.end_date.split('-');
                        if (temp_end_date[0].length == 2) {
                            billItem.end_date = temp_end_date[2] + "-" + temp_end_date[1] + "-" + temp_end_date[0];
                        }
                        if(billItem.stock_selection == null || typeof billItem.stock_selection == "undefined" || billItem.stock_selection == ""){
                            billItem.stock_selection = "none";
                        }
                        rbillItems.push({
                            var_no: billItem.var_no,
                            item_no: billItem.item_no,
                            item_name: billItem.item_name,
                            bill_item_qty: (billItem.qty_type == "Integer") ? parseInt(billItem.bill_item_qty) : parseFloat(billItem.bill_item_qty),
                            qty: (billItem.qty_type == "Integer") ? parseInt(billItem.qty) : parseFloat(billItem.qty),
                            free_qty: billItem.free_qty,
                            unit_identity: billItem.unit_identity,
                            unit: billItem.unit,
                            alter_unit: billItem.alter_unit,
                            price: billItem.price,
                            discount: billItem.discount,
                            taxable_value: ((parseFloat(billItem.item_sub_total) - parseFloat(billItem.discount)) * parseFloat(billItem.tax_per)) / 100,
                            tax_per: billItem.tax_per,
                            tax_inclusive: billItem.tax_inclusive,
                            total_price: billItem.total_price,
                            price_no: billItem.price_no,
                            bill_type: bill_type,
                            tax_class_no: billItem.tax_class_no,
                            sub_total: parseFloat(billItem.item_sub_total),

                            hsn_code: billItem.hsn_code,
                            cgst: billItem.cgst,//parseFloat(billItem.tax_per / 2),
                            sgst: billItem.sgst,//parseFloat(billItem.tax_per / 2),
                            igst: billItem.igst,
                            tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined") ? "0" : billItem.tray_received,
                            cost: billItem.cost,
                            amount: parseFloat(billItem.cost) * parseFloat(billItem.qty),

                            executive_id: (billItem.executive_id == "") ? "-1" : billItem.executive_id,
                            text_qty: billItem.start_date + "||" + billItem.end_date,

                            //Item Stock Table
                            mrp: billItem.mrp,
                            batch_no: billItem.batch_no,
                            man_date: (billItem.man_date == null || billItem.man_date == "" || typeof billItem.man_date == "undefined") ? "" : dbDateTime(billItem.man_date),
                            expiry_date: (billItem.expiry_date == null || billItem.expiry_date == "" || typeof billItem.expiry_date == "undefined") ? "" : dbDateTime(billItem.expiry_date),
                            stock_no:billItem.stock_no,
                            stock_selection: (billItem.stock_no == null || typeof billItem.stock_no == "undefined") ? billItem.stock_selection : "stockno",//billItem.stock_selection,
                            package_item:billItem.item_package,
                            item_package: billItem.item_package,
                            additional_tax: billItem.additional_tax,
                        });
                        buying_cost = buying_cost + (parseFloat(billItem.cost) * (parseFloat(billItem.qty) + parseFloat(billItem.free_qty)));

                        if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE) {
                            if (billItem.reward_plan_id == "0" || typeof billItem.reward_plan_id == "undefined" || billItem.reward_plan_id == null) { }
                            else {
                                executivePoints.push({
                                    sales_executive_no: (billItem.executive_id == "") ? "-1" : billItem.executive_id,
                                    reward_plan_id: billItem.reward_plan_id,
                                    trans_date: dbDateTime($$("txtBillDate").getDate()),
                                    points: parseFloat(billItem.total_price) / parseFloat(billItem.reward_plan_point),
                                    trans_type: "Credit",
                                    description: "Credit",
                                    setteled_amount: (parseFloat(billItem.total_price) * parseFloat(billItem.reward_plan_point)) / 4,

                                });
                            }
                        }
                    }
                });
                newBill.bill_items = rbillItems;
                newBill.executivePoints = executivePoints;
                var billSO = [];
                var billShedule = [];
                var rewardSo = [];
                if (pay_mode == "Cash") {
                    billSO.push({
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_desc: "POS Bill Payment",
                        amount: parseFloat(page.controls.lblTotalNet.value()).toFixed(5),
                        collector_id: CONTEXT.user_no,
                        pay_type: "Sale",
                        pay_mode: page.controls.ddlPayType.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: "",
                        coupon_no: ""
                    });
                    if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) == 0) {
                    }
                    else{
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: parseFloat($$("txtBillDiscount").value()).toFixed(5),
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: "Discount",
                            store_no: getCookie("user_store_id"),
                            card_no: "",
                            card_type: "",
                            coupon_no: ""
                        });
                    }
                }
                else if (pay_mode == "Rewards") {
                    rewardSo.push({
                        trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        reward_plan_id: page.plan_id,
                        points: parseFloat(page.controls.lblTotalNet.value()) * 4,
                        trans_type: "Debit",
                        setteled_amount: page.controls.lblTotalNet.value()
                    });
                    billSO.push({
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_desc: "POS Bill Payment",
                        amount: parseFloat(page.controls.lblTotalNet.value()).toFixed(5),
                        collector_id: CONTEXT.user_no,
                        pay_type: "Sale",
                        pay_mode: page.controls.ddlPayType.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: "",
                        coupon_no: ""
                    });
                    if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) == 0) {
                    }
                    else {
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: parseFloat($$("txtBillDiscount").value()).toFixed(5),
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: "Discount",
                            store_no: getCookie("user_store_id"),
                            card_no: "",
                            card_type: "",
                            coupon_no: ""
                        });
                    }
                }
                else if (pay_mode == "Mixed") {
                    var reward_amount = 0;
                    $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                        if (item.points != "") {
                            reward_amount = parseFloat(reward_amount) + parseFloat(item.amount);
                        }
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: item.amount,
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: item.pay_type,
                            store_no: getCookie("user_store_id"),
                            card_type: item.card_type,
                            card_no: item.card_no,
                            coupon_no: item.coupon_no
                        });
                    });
                    if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) == 0) {
                    }
                    else {
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: parseFloat($$("txtBillDiscount").value()).toFixed(5),
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: "Discount",
                            store_no: getCookie("user_store_id"),
                            card_no: "",
                            card_type: "",
                            coupon_no: ""
                        });
                    }
                }
                else if (pay_mode == "EMI") {
                    billSO.push({
                        pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        pay_desc: "POS Bill Payment",
                        amount: parseFloat(page.controls.txtEMIPayment.value()).toFixed(5),
                        collector_id: CONTEXT.user_no,
                        pay_type: "Sale",
                        pay_mode: page.controls.ddlPayType.selectedValue(),
                        store_no: getCookie("user_store_id"),
                        card_no: "",
                        card_type: "",
                        coupon_no: ""
                    });
                    if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) == 0) {
                    }
                    else {
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: parseFloat($$("txtBillDiscount").value()).toFixed(5),
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: "Discount",
                            store_no: getCookie("user_store_id"),
                            card_no: "",
                            card_type: "",
                            coupon_no: ""
                        });
                    }
                    $(page.controls.grdAllEMI.allData()).each(function (i, item) {
                        billShedule.push({
                            schedule_date: dbDateTime(item.schedule_date),
                            due_date: dbDateTime(item.due_date),
                            amount: item.amount,
                            status: "Open",
                            temp_schedule_id: item.schedule_id,
                            paid:"0"
                        });
                    });
                }
                else {
                    if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) == 0) {
                    }
                    else {
                        billSO.push({
                            pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            pay_desc: "POS Bill Payment",
                            amount: parseFloat($$("txtBillDiscount").value()).toFixed(5),
                            collector_id: CONTEXT.user_no,
                            pay_type: "Sale",
                            pay_mode: "Discount",
                            store_no: getCookie("user_store_id"),
                            card_no: "",
                            card_type: "",
                            coupon_no: ""
                        });
                    }
                }
                newBill.payments = billSO;
                newBill.billschedule = billShedule;
                newBill.reward = rewardSo;
                newBill.discounts = page.selectedBill.discounts;
                var expense = [];
                if ($$("txtExpenseName").value() != "" && $$("txtExpenseName").value() != null && $$("txtExpenseName").value() != undefined) {
                    expense.push({
                        exp_name: $$("txtExpenseName").value(),
                        amount: $$("txtExpense").value()
                    });
                }
                if ($$("txtBillDiscount").value() != "" && $$("txtBillDiscount").value() != null && $$("txtBillDiscount").value() != undefined) {
                    expense.push({
                        exp_name: "Discount",
                        amount: $$("txtBillDiscount").value()
                    });
                }
                newBill.expenses = expense;
                //Get Finfacts Data
                var finfacts_data = [];
                var finfacts_payment_data = [];
                var finfacts_advance = [];
                var finfacts_expense = [];
                if (page.controls.ddlPayType.selectedValue() == "Loan") {
                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                    finfacts_data.push({
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        //description: "POS-" + currentBillNo,
                        target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                        buying_cost: buying_cost,
                        round_off: $$("lblRndOff").value(),

                        //key_1: currentBillNo,
                        key_2: $$("txtCustomerName").selectedValue(),
                    });
                }
                else if (page.controls.ddlPayType.selectedValue() == "Mixed") {
                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                    finfacts_data.push({
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        //description: "POS-" + currentBillNo,
                        target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                        buying_cost: buying_cost,
                        round_off: $$("lblRndOff").value(),

                        //key_1: currentBillNo,
                        key_2: $$("txtCustomerName").selectedValue(),
                    });
                    $(page.controls.grdAllPayment.allData()).each(function (i, item) {
                        finfacts_payment_data.push({
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                            paid_amount: item.amount,
                            //description: "POS -" + currentBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            //key_1: currentBillNo,
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        });
                    });
                }
                else if (page.controls.ddlPayType.selectedValue() == "Cash") {
                    var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                    finfacts_data.push({
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        //description: "POS-" + currentBillNo,
                        target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                        tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                        buying_cost: buying_cost,
                        round_off: $$("lblRndOff").value(),
                        //key_1: currentBillNo,
                        key_2: $$("txtCustomerName").selectedValue(),
                    });
                }
                newBill.finfacts = finfacts_data;
                newBill.finfacts_payment = finfacts_payment_data;
                if (CONTEXT.ENABLE_BILL_ADVANCE) {
                    if (parseFloat($$("txtAdvanceAmount").val())) {
                        finfacts_advance.push({
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            paid_amount: $$("txtAdvanceAmount").val(),
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        });
                    }
                }
                if ($$("txtBillDiscount").value() != "" && $$("txtBillDiscount").value() != null && $$("txtBillDiscount").value() != undefined) {
                    finfacts_expense.push({
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,
                        expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                        amount: parseFloat($$("txtBillDiscount").value()),
                        //description: "POS Discount-" + currentBillNo,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        //key_1: currentBillNo,
                        key_2: $$("txtCustomerName").selectedValue(),
                    });
                }
                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                    if (parseInt(newBill.expense) != 0) {
                        finfacts_expense.push({
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,
                            expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                            amount: newBill.expense == "" ? 0 : newBill.expense,//$$("txtExpense").value(),
                            //description: "POS Expense-" + currentBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            //key_1: currentBillNo,
                            key_2: $$("txtCustomerName").selectedValue() == null ? " " : $$("txtCustomerName").selectedValue(),
                        });
                    }
                }
                newBill.finfacts_advance = finfacts_advance;
                newBill.finfacts_expense = finfacts_expense;
                //Insert Bill
                page.stockAPI.insertBill(newBill, function (data) {
                    var currentBillNo = data.bill_no;
                    if (newBill.bill_type == "SaleReturn" || newBill.bill_type == "SaleSaved")
                        currentBillNo = data;
                    buying_cost = data.buying_cost;
                    if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                        page.printReceipt(newBill, currentBillNo, function (data) {
                        });
                    }
                    callback(currentBillNo, newBill);
                    page.msgPanel.flash("Bill Is Created....");
                    if (bill_type == "Sale") {
                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            if (page.controls.ddlPayType.selectedValue() == "EMI") {
                                var s_with_tax = (parseFloat(page.controls.lblSubTotal.value()) - parseFloat(page.controls.lblDiscount.value()));
                                var data1 = {
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    description: "POS-" + currentBillNo,
                                    target_acc_id: (page.controls.ddlPayType.selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : (page.controls.ddlPayType.selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : (page.controls.ddlPayType.selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                    sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                                    tax_amt: parseFloat(page.controls.lblTax.value()).toFixed(5),
                                    buying_cost: buying_cost,
                                    round_off: $$("lblRndOff").value(),

                                    key_1: currentBillNo,
                                    key_2: $$("txtCustomerName").selectedValue(),
                                };
                                var data2 = [];
                                var emiinterest = parseFloat(page.controls.lblTotalEMIAmount.value()) - parseFloat(page.controls.lblTotal.value());
                                data2.push({
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                    paid_amount: parseFloat($$("txtEMIPayment").value()) - parseFloat(emiinterest),
                                    description: "POS -" + currentBillNo,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    key_1: currentBillNo,
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                });
                                page.msgPanel.show("Updating Finfacts...");
                                page.finfactsEntryAPI.creditSales(data1, function (response) {
                                    page.finfactsEntryAPI.allcreditSalesPayment(0, data2, function (response) {
                                        var data1 = {
                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            amount: emiinterest,
                                            trans_type: "Debit",
                                            description: "POS Interest -" + currentBillNo,
                                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            key_1: currentBillNo,
                                        };
                                        var data3 = {
                                            //per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                            amount: emiinterest,
                                            trans_type: "Debit",
                                            description: "POS Interest -" + currentBillNo,
                                            //jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            key_1: currentBillNo,
                                        };
                                        var data2 = {
                                            //per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                            acc_id: CONTEXT.FINFACTS_SALES_INTEREST_ACCOUNT,
                                            amount: emiinterest,
                                            trans_type: "Credit",
                                            description: "POS Interest -" + currentBillNo,
                                            //jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            key_1: currentBillNo,
                                        };
                                        page.finfactsEntryAPI.insertJournal(data1, function (response) {
                                            data3.jrn_id = response[0].key_value;
                                            page.finfactsEntryAPI.insertTransaction(data3, function () {
                                                data2.jrn_id = response[0].key_value;
                                                page.finfactsEntryAPI.insertTransaction(data2, function () {
                                                    callback(currentBillNo);
                                                    page.msgPanel.show("POS payment is recorded successfully.");
                                                });
                                            });
                                        });
                                    });
                                    page.msgPanel.show("POS payment is recorded successfully.");
                                    page.msgPanel.hide();
                                });
                            }
                            //else {
                            //    page.msgPanel.show("POS payment is recorded successfully.");
                                
                            //    page.msgPanel.hide();
                            //}
                        }
                    }
                    //else {
                    //    callback(currentBillNo);
                    //}
                }, function (data) {
                    alert(data);
                });
            } catch (e) {
                alert(e);
                page.msgPanel.hide();;
            }
        }

        
        page.addpoints = function (billno,bill) {
            var newItem = {};
            var cust_no = bill.cust_no;//page.controls.hdnCustomerNo.val();
            if (cust_no != "")
                //page.customerService.getCustomerById(cust_no, function (data) {
                page.customerAPI.getValue({ cust_no: cust_no }, function (data, callback) {
                    //page.rewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                    page.rewardplanAPI.getValue({reward_plan_id:data[0].reward_plan_id},function(data2){
                        if (data2.length != 0) {
                            //page.billService.getBill(billno, function (data1) {
                            page.billAPI.searchValues("", "", "b.bill_no=" + billno, "", function (data1) {
                                newItem.cust_no = data[0].cust_no;
                                newItem.reward_plan_id = data[0].reward_plan_id;
                                //page.customerList = data;
                                newItem.bill_no = data1[0].bill_no;
                                newItem.trans_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                newItem.points = data1[0].total / data2[0].reward_plan_point;
                                newItem.trans_type = "Credit";
                                newItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                //page.customerService.insertCustomerRewardt(newItem, function (data) {
                                page.customerrewardAPI.postValue(newItem,function(data){
                                    page.msgPanel.show("Points added successfully.");
                                });
                            });
                        } else {
                            page.msgPanel.show("Customer cannot have reward plans.");
                        }

                    });
                });

        }
        page.addSalesExecutivePoints = function (billno,bill) {
            var newItem = {};
            var sales_executive_no = bill.delivered_by;
            if (sales_executive_no != "-1")
                //page.salesExecutiveRewardService.getSalesExecutiveById(sales_executive_no, function (data) {
                page.salesexecutiveAPI.getValue({ sale_executive_no:sales_executive_no }, function (data) {
                    //page.salesExecutiveRewardService.getRewardById(data[0].reward_plan_id, function (data2) {
                    page.salesExecutiveRewardPlanAPI.getValue({ reward_plan_id: data[0].reward_plan_id }, function (data2) {
                        if (data2.length != 0) {
                            //page.billService.getBill(billno, function (data1) {
                            page.billAPI.getValue(billno, function (data1) {
                                newItem.sale_executive_no = sales_executive_no;
                                newItem.reward_plan_id = data[0].reward_plan_id;
                                //page.customerList = data;
                                newItem.bill_no = data1.bill_no;
                                newItem.trans_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date()));
                                newItem.points = data1.total / data2[0].reward_plan_point;
                                newItem.trans_type = "Credit";
                                newItem.description = "Credit";
                                newItem.setteled_amount = parseFloat(data1.total * data2[0].reward_plan_point) / 4;
                                //page.salesExecutiveRewardService.insertSalesExecutiveRewardt(newItem, function (data) {
                                page.salesexecutiverewardAPI.postValue(newItem, function (data) {
                                    page.msgPanel.show("Points added successfully.");
                                });
                            });
                        } else {
                            page.msgPanel.show("Sales Executive cannot have reward plans.");
                        }
                    });
                });
        }
        page.addTray = function (currentBillNo) {
            try {
                var trayItems = [];
                $(page.controls.grdBill.allData()).each(function (i, item) {

                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null)
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Customer Sales",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                cust_id: (page.controls.txtCustomerName.selectedValue() == null) ? "-1" : page.controls.txtCustomerName.selectedValue(),
                                bill_id: currentBillNo,
                                store_no: localStorage.getItem("user_store_no")
                            });
                });
                page.eggtraytransAPI.postAllValues(0, trayItems, function (data) {
                });
                //page.trayService.insertEggTrayTransactions(0, trayItems, function (data) {
                //});

            } catch (e) {
                page.msgPanel.flash(e);
            }

        }

        page.interface.createBill = function () {
            $$("btnSave").show();
            $$("btnPayment").show();
            $$("btnPayment").disable(false);
            //New Bill
            var newBill = {
                cust_no: "",
                cust_name: "",
                phone_no: "",
                address: "",

                sub_total: 0,
                total: 0,
                discount: 0,
                tax: 0,
                bill_discount:0,

                sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                billItems: [],
                discounts: [],
                bill_no: null,
                state_text: "NewBill",
                adv_sec_amt: 0,
                adv_sec_status: "Received"
            };
            page.loadSelectedBill(newBill,function () {
                page.loadSalesTaxClasses(newBill.sales_tax_no, function (sales_tax_class) {
                    newBill.sales_tax_class = sales_tax_class;
                    page.calculate();
                    setTimeout(function () {
                        if ((CONTEXT.ENABLE_CASHIER_BARCODE)) {
                            $$("txtCashierBarcode").focus();
                        }
                        else {
                            $$("txtItemSearch").selectedObject.focus();
                        }
                    }, 10);
                });
            });
        }

        page.interface.returnBill = function (billNo) {
            var currentBillNo = billNo;  //page.currentBillNo;
            page.currentBillNo = billNo;
            page.billService.getBill(currentBillNo, function (data) {
                var bill = data[0];
                var saleBill = {
                    cust_no: bill.cust_no,
                    cust_name: bill.cust_name,
                    phone_no: bill.phone_no,
                    address: bill.address,
                    email: bill.email,

                    sub_total: 0,
                    total: 0,
                    discount: 0,
                    tax: 0,

                    sales_tax_no: -1,
                    billItems: [],
                    discounts: [],
                    bill_no: currentBillNo,
                    state_text: "NewReturn",
                    adv_sec_amt: bill.adv_sec_amt,
                    adv_sec_status: bill.adv_sec_status,
                    adv_end_date: bill.adv_end_date,
                };

                page.billService.getBillItem(saleBill.bill_no, function (billItems) {
                    saleBill.billItems = billItems;
                    page.loadSelectedBill(saleBill,false);
                });
            });
            page.billService.getBillByNo(page.currentBillNo, function (data) {
                $$("ddlPayType").selectedValue(data[0].pay_type);
            });
        }

        page.interface.viewBill = function (billNo) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            page.billAPI.getValue(page.currentBillNo, function (data) {
                var bill = data;
                var openBill = {
                    cust_no: bill.cust_no,
                    cust_name: bill.cust_name,
                    email: bill.email_id,
                    phone_no: bill.phone_no,
                    address: bill.address.replace(/-/g, ","),
                    sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,
                    sub_total: bill.sub_total,
                    round_off: bill.round_off,
                    total: bill.total,
                    discount: bill.discount,
                    tax: bill.tax,
                    bill_no: bill.bill_no,
                    bill_no_par: bill.bill_no_par,
                    bill_date: bill.bill_date,
                    due_date:bill.due_date,
                    bill_type:bill.bill_type,
                    state_text: bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                    //expense: bill.expense,
                    gst_no: bill.gst_no,
                    expenses: bill.expenses,
                    sales_executive: bill.sales_executive,
                    adv_sec_amt: bill.adv_sec_amt,
                    adv_sec_status: bill.adv_sec_status,
                    adv_end_date: bill.adv_end_date,
                    bill_discount: bill.bill_discount,
                    pay_mode: bill.pay_mode,
                    price_rate: bill.price_rate,
                    return_price_rate:bill.return_price_rate,

                    cust_tot_sales: bill.total_sales,
                    cust_tot_return: bill.total_sales_return,
                    cust_tot_sales_payment: bill.total_sales_payment,
                    cust_tot_ret_payment: bill.total_sales_return_payment,
                    cust_tot_pending_pay: bill.total_pending_payment,
                    cust_tot_pending_settlement: bill.total_pending_settlement,
                };
                openBill.discounts = bill.discounts;
                if (openBill.bill_type == "SalesCredit" || openBill.bill_type == "SalesDebit") {
                    page.creditBill = true;
                }
                page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
                    openBill.sales_tax_class = sales_tax_class;
                    openBill.billItems = bill.bill_items;
                        page.msgPanel.show("Getting Bill Discounts...");
                            page.msgPanel.show("Loading data...");
                            page.loadSelectedBill(openBill, function () {
                                if (openBill.state_text == "Saved") {
                                    $$("ddlRate").selectedValue(openBill.price_rate);
                                    page.calculate();
                                }
                                if (bill.state_text == "Sale") {
                                    page.billAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                                        if (data.length > 0) {
                                            $$("grdReturnBillPanel").show();
                                            page.controls.grdBillReturn.display("");
                                            page.controls.grdBillReturn.dataBind(data);
                                        }
                                    });
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
                                    $$("ddlRate").selectedValue(openBill.price_rate);
                                    page.billCalculate(openBill.billItems, bill.state_text);
                                }
                                if (bill.state_text == "Return") {
                                    $$("ddlRate").selectedValue(openBill.return_price_rate);
                                    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                                    //page.billService.getBillSale(openBill.bill_no, function (data) {
                                    page.billAPI.searchValues("", "", "b.bill_no=" + openBill.bill_no_par, "", function (data) {
                                        if (data.length > 0) {
                                            $$("grdReturnBillPanel").show();
                                            page.controls.grdBillReturn.display("");
                                            page.controls.grdBillReturn.dataBind(data);
                                        }
                                    });
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                                    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
                                    //page.returnBillCalculate(openBill.billItems);
                                    page.billCalculate(openBill.billItems, bill.state_text);
                                }
                                //page.billService.getBillByNo(page.currentBillNo, function (data) {
                                $$("ddlPayType").selectedValue(openBill.pay_mode);
                                //$$("ddlBillType").selectedValue(openBill.bill_type);
                                //});
                                page.msgPanel.flash("Bill is opened...");
                                
                            });
                        //});
                });
            });
            
        }
        page.interface.creditBill = function (billNo) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            page.creditBill = true;
            page.billAPI.getValue(billNo, function (data) {
                var bill = data;
                var openBill = {
                    cust_no: bill.cust_no,
                    cust_name: bill.cust_name,
                    email: bill.email_id,
                    phone_no: bill.phone_no,
                    address: bill.address.replace(/-/g, ","),
                    sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,
                    sub_total: bill.sub_total,
                    round_off: bill.round_off,
                    total: bill.total,
                    discount: bill.discount,
                    tax: bill.tax,
                    bill_no: bill.bill_no,
                    bill_date: bill.bill_date,
                    due_date: bill.due_date,
                    bill_type:bill.bill_type,
                    state_text: "NewBill",//bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                    gst_no: bill.gst_no,
                    expenses: bill.expenses,
                    sales_executive: bill.sales_executive,
                    adv_sec_amt: bill.adv_sec_amt,
                    adv_sec_status: bill.adv_sec_status,
                    adv_end_date: bill.adv_end_date,
                    bill_discount: bill.bill_discount,
                    pay_mode: bill.pay_mode,
                    price_rate: bill.price_rate,
                    return_price_rate: bill.return_price_rate,

                    cust_tot_sales: bill.total_sales,
                    cust_tot_return: bill.total_sales_return,
                    cust_tot_sales_payment: bill.total_sales_payment,
                    cust_tot_ret_payment: bill.total_sales_return_payment,
                    cust_tot_pending_pay: bill.total_pending_payment,
                    cust_tot_pending_settlement: bill.total_pending_settlement,
                };
                openBill.discounts = bill.discounts;
                bill.state_text = openBill.state_text;
                page.creditBillAmount = openBill.total;
                page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
                    openBill.sales_tax_class = sales_tax_class;
                    openBill.billItems = bill.bill_items;
                    page.msgPanel.show("Getting Bill Discounts...");
                    page.msgPanel.show("Loading data...");
                    page.loadSelectedBill(openBill, function () {
                        //if (openBill.state_text == "Saved") {
                        //    $$("ddlRate").selectedValue(openBill.price_rate);
                        //    page.calculate();
                        //}
                        //if (bill.state_text == "Sale") {
                        //    page.billAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                        //        if (data.length > 0) {
                        //            $$("grdReturnBillPanel").show();
                        //            page.controls.grdBillReturn.display("");
                        //            page.controls.grdBillReturn.dataBind(data);
                        //        }
                        //    });
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
                        //    $$("ddlRate").selectedValue(openBill.price_rate);
                        //}
                        //if (bill.state_text == "Return") {
                        //    $$("ddlRate").selectedValue(openBill.return_price_rate);
                        //    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                        //    page.billAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                        //        if (data.length > 0) {
                        //            $$("grdReturnBillPanel").show();
                        //            page.controls.grdBillReturn.display("");
                        //            page.controls.grdBillReturn.dataBind(data);
                        //        }
                        //    });
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
                        //}
                        if (openBill.state_text == "NewBill") {
                            //page.calculate();
                        }
                        $$("ddlPayType").selectedValue(openBill.pay_mode);
                        //$$("ddlBillType").selectedValue(openBill.bill_type);
                        page.msgPanel.flash("Bill is opened...");
                    });
                });
            });
        }
        page.interface.editBill = function (billNo) {
            page.msgPanel.show("Getting Bill Details...");
            page.currentBillNo = billNo;
            page.editBill = true;
            page.billAPI.getValue(page.currentBillNo, function (data) {
                var bill = data;
                var openBill = {
                    cust_no: bill.cust_no,
                    cust_name: bill.cust_name,
                    email: bill.email_id,
                    phone_no: bill.phone_no,
                    address: bill.address.replace(/-/g, ","),
                    sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,
                    sub_total: bill.sub_total,
                    round_off: bill.round_off,
                    total: bill.total,
                    discount: bill.discount,
                    tax: bill.tax,
                    bill_no: bill.bill_no,
                    bill_date: bill.bill_date,
                    due_date: bill.due_date,
                    state_text: "NewBill",//bill.state_text,   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                    gst_no: bill.gst_no,
                    expenses: bill.expenses,
                    sales_executive: bill.sales_executive,
                    adv_sec_amt: bill.adv_sec_amt,
                    adv_sec_status: bill.adv_sec_status,
                    adv_end_date: bill.adv_end_date,
                    bill_discount: bill.bill_discount,
                    pay_mode: bill.pay_mode,
                    price_rate: bill.price_rate,
                    return_price_rate: bill.return_price_rate,

                    cust_tot_sales: bill.total_sales,
                    cust_tot_return: bill.total_sales_return,
                    cust_tot_sales_payment: bill.total_sales_payment,
                    cust_tot_ret_payment: bill.total_sales_return_payment,
                    cust_tot_pending_pay: bill.total_pending_payment,
                    cust_tot_pending_settlement: bill.total_pending_settlement,
                };
                openBill.discounts = bill.discounts;
                bill.state_text = openBill.state_text;
                page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
                    openBill.sales_tax_class = sales_tax_class;
                    openBill.billItems = bill.bill_items;
                    page.msgPanel.show("Getting Bill Discounts...");
                    page.msgPanel.show("Loading data...");
                    page.loadSelectedBill(openBill, function () {
                        $$("ddlRate").selectedValue(openBill.price_rate);
                        //if (openBill.state_text == "Saved") {
                        //    $$("ddlRate").selectedValue(openBill.price_rate);
                        //    page.calculate();
                        //}
                        //if (bill.state_text == "Sale") {
                        //    page.billAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                        //        if (data.length > 0) {
                        //            $$("grdReturnBillPanel").show();
                        //            page.controls.grdBillReturn.display("");
                        //            page.controls.grdBillReturn.dataBind(data);
                        //        }
                        //    });
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
                        //    $$("ddlRate").selectedValue(openBill.price_rate);
                        //}
                        //if (bill.state_text == "Return") {
                        //    $$("ddlRate").selectedValue(openBill.return_price_rate);
                        //    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                        //    page.billAPI.searchValues("", "", "b.bill_no_par=" + openBill.bill_no, "", function (data) {
                        //        if (data.length > 0) {
                        //            $$("grdReturnBillPanel").show();
                        //            page.controls.grdBillReturn.display("");
                        //            page.controls.grdBillReturn.dataBind(data);
                        //        }
                        //    });
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=discount]").html(page.controls.lblDiscount.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=tax_per]").html(page.controls.lblTax.value());
                        //    $$("grdBill").selectedObject.find(".grid_bill_footer div[datafield=total_price]").html(page.controls.lblTotal.value());
                        //}
                        if (openBill.state_text == "NewBill") {
                            page.calculate();
                        }
                        $$("ddlPayType").selectedValue(openBill.pay_mode);
                        //$$("ddlBillType").selectedValue(openBill.bill_type);
                        page.msgPanel.flash("Bill is opened...");
                    });
                });
            });
        }
        page.events.page_load = function () {

            $$("lblSalesExecutive").value(CONTEXT.SALES_EXECUTIVE_LABEL_NAME);
            $("[controlid=txtItemSearch]").bind("keypress", function (e) {
                if (e.ctrlKey == true && e.which == 0) {
                    if ($(this).attr("search_mode") == "text") {
                        $(this).attr("search_mode", "barcode");
                        $(this).attr("placeholder", "Enter Your Barcode");
                        page.searchAttributes = "barcode";
                        $$("imgBarcode").show();
                    }
                    else {
                        $(this).attr("search_mode", "text");
                        $(this).attr("placeholder", "Item No,Item Name or Scan.");
                        page.searchAttributes = "text";
                        $$("imgBarcode").hide();
                    }
                }

                if ($(this).attr("search_mode") == "barcode" && e.which == 13) {
                   page.searchStock_click();
                }

                var self = this;
                var beforeScan = $(self).val();
                setTimeout(function () {
                    var str = $(self).val();
                    //if (beforeScan.length == 0 && str.length >= 6)
                    //    alert("barcode search event");
                    if (str.startsWith("00")) {
                        $(self).val(parseInt(str.substring(0, str.length - 1)));
                        // $(self).keydown();
                    }
                }, 100)
            });

            page.salesexecutiveAPI.searchValues(0, "", "saexe_active=1", "", function (data) {
                page.controls.ddlDeliveryBy.dataBind(data, "sale_executive_no", "sale_executive_name", "Select");
                page.salesExecutiveList = data;
                page.salesexecutiveAPI.searchValues(0, "", "user_id=" + localStorage.getItem("app_user_id"), "", function (data) {
                    if (data.length != 0)
                        page.controls.ddlDeliveryBy.selectedValue(data[0].sale_executive_no);
                });
            });
            page.discountAPI.searchValues("", "", "disc_level='Item' and disc_type='Percent'", "", function (data) {
                page.controls.ddlDiscount.dataBind(data, "disc_no", "disc_name", "None");
                page.discountPercentageData = data[0];
            });
            page.discountAPI.searchValues("", "", "disc_level='Item'", "", function (data) {
                page.controls.ddlItemDiscount.dataBind(data, "disc_no", "disc_name", "None");
            });
            page.salestaxAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlSalesTax.dataBind(data, "sales_tax_no", "sales_tax_name", "None");
            });

            $$("lblDiscountLabel").selectedObject.click(function () {
                page.controls.pnlDiscountPopup.open();
                page.controls.pnlDiscountPopup.title("Discount(s) Applied For Bill");
                page.controls.pnlDiscountPopup.rlabel("Discount");
                page.controls.pnlDiscountPopup.width(1000);
                page.controls.pnlDiscountPopup.height(400);


                page.controls.grdDiscount.width("100%");
                page.controls.grdDiscount.height("220px");
                page.controls.grdDiscount.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Disc No", 'rlabel': 'Disc No', 'width': "100px", 'dataField': "disc_no" },
                        { 'name': "Disc Name", 'rlabel': 'Disc Name', 'width': "200px", 'dataField': "disc_name" },
                        { 'name': "Disc Type", 'rlabel': 'Discount Type', 'width': "150px", 'dataField': "disc_type" },
                        { 'name': "Disc Value", 'rlabel': 'Discount Value', 'width': "150px", 'dataField': "disc_value" },
                        { 'name': "Item No", 'rlabel': 'Item No', 'width': "150px", 'dataField': "item_no" },
                    ]
                });
                page.controls.grdDiscount.dataBind(page.selectedBill.discounts);
                if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {
                    $$("btnDiscountOK").show();
                    $$("btnDiscountRemove").show();
                }
                else {
                    $$("btnDiscountOK").hide();
                    $$("btnDiscountRemove").hide();
                }
            });

            page.view.UIState("New");

            page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                page.customerList = data;
            });
            //Customer autocomplete
            page.controls.txtCustomerName.dataBind({
                getData: function (term, callback) {
                    callback(page.customerList);
                    // page.customerService.getCustomerByAll(term, callback);
                }
            });
            page.controls.txtCustomerName.select(function (item) {
                if (item == null)
                    item = { cust_no: "", phone_no: "", address: "" };
                page.controls.hdnCustomerNo.val(item.cust_no);
                page.controls.lblPhoneNo.value(item.phone_no);
                page.controls.lblEmailId.value((typeof item.email == "undefined") ? "" : item.email);
                page.controls.lblGst.value((typeof item.gst_no == "undefined") ? "" : item.gst_no);
                page.controls.lblAddress.value(item.address);
                page.plan_id = item.reward_plan_id;
                page.controls.txtItemSearch.selectedObject.focus();

                page.customerAPI.getValue({ cust_no: item.cust_no }, function (data, callback) {
                    $$("lblAvalablePoints").value(data[0].points);
                });
                //More Customer Details
                $$("lblMoreCustomer").value(page.controls.txtCustomerName.selectedObject.val().split("_")[0]);
                $$("lblMoreTotalSales").value(item.total_sales);
                $$("lblMoreTotalReturn").value(item.total_sales_return);
                $$("lblMoreTotalSalesPayment").value(item.total_sales_payment);
                $$("lblMoreTotalReturnPayment").value(item.total_sales_return_payment);
                $$("lblMorePendingPayment").value(parseFloat(item.total_sales) - parseFloat(item.total_sales_payment));
                $$("lblMorePendingSettlement").value(parseFloat(item.total_sales_return) - parseFloat(item.total_sales_return_payment));

            });
            page.controls.txtCustomerName.noRecordFound(function (txt) {
                txt.val("");
                page.controls.btnAddCustomer.show();
                page.controls.hdnCustomerNo.val("");
                page.controls.lblPhoneNo.value("");
                page.controls.lblAddress.value("");
                page.controls.lblAvalablePoints.value("");
                page.controls.lblGst.value("");
                page.controls.txtCustomerName.selectedObject.focus();

                //More Customer Details
                $$("lblMoreCustomer").value("");
                $$("lblMoreTotalSales").value("");
                $$("lblMoreTotalReturn").value("");
                $$("lblMoreTotalSalesPayment").value("");
                $$("lblMoreTotalReturnPayment").value("");
                $$("lblMorePendingPayment").value("");
                $$("lblMorePendingSettlement").value("");
            });

            //Item autocomplete
            page.controls.txtItemSearch.itemTemplate = function (item) {
                var mrp = isNaN(parseFloat(item.mrp)) ? "" : parseFloat(item.mrp).toFixed(2);
                //if (CONTEXT.ENABLE_STOCK_MAINTANENCE) {
                //    if (item.qty_stock > 0) {
                //if (parseInt(item.cost) == 0) {
                //    if (CONTEXT.GROUP_BUYING_COST) {
                //        return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";//-Free
                //    }
                //    else {
                //        return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";//-Free
                //    }
                //}
                //else {
                if (CONTEXT.GROUP_BUYING_COST) {
                    if (item.ptype_name == null)
                        return "<a>" + item.item_name + "-" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                    else
                        return "<a>" + item.item_name + " in " + item.ptype_name + " -" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                }
                else {
                    if (item.ptype_name == null)
                        return "<a>" + item.item_name + "-" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                    else
                        return "<a>" + item.item_name + " in " + item.ptype_name + " -" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                }
                //}
                //}
                //}
                //else {
                //    if (parseInt(item.cost) == 0) {
                //        if (CONTEXT.GROUP_BUYING_COST) {
                //            return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";//-Free
                //        }
                //        else {
                //            return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";//-Free
                //        }
                //    }
                //    else {
                //        if (CONTEXT.GROUP_BUYING_COST) {
                //            return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                //        }
                //        else {
                //            return "<a>" + item.item_name + "_" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                //        }
                //    }
                //}
            }
            page.controls.txtItemSearch.dataBind({
                getData: function (term, callback) {
                    if (page.searchAttributes == "text") {
                        var filter = "";
                        var sort = "";
                        if (term.startsWith("00"))
                            term = term.substring(0, term.length - 1);
                        if (!isNaN(term))
                            filter = "(c.item_no = '" + term + "' or c.item_code = '" + term + "' or c.barcode like '%" + term + "%' )";
                        else
                            filter = "(item_name like '" + term + "%' or c.barcode like '%" + term + "%'   or man_name like '" + term + "')";
                        if (term.startsWith("@")) {
                            filter = "(ivt.var_no = '" + term.substring(1, term.length) + "' and m.var_no=ivt.var_no )";
                        }
                        /*if (term.startsWith("#3")) {
                            filter = "(ist.stock_no = '" + term.substring(1, term.length) + "' and m.var_no=ist.var_no )";
                        }*/
                        var search = term;
                        var flag = false;
                        if (search.startsWith("S") || search.startsWith("s")) {
                            var no = search.substring(1, search.length);
                            if (!isNaN(no)) {
                                //filter = "(ist.stock_no = '" + search.substring(1, search.length) + "' and m.var_no=ist.var_no )";
                                filter = "(ist.stock_no = '" + search.substring(1, search.length) + "')";
                                flag = true;
                            }
                        }

                        if (CONTEXT.ENABLE_STOCK_MAINTANENCE) {
                            sort = "having qty_stock > 0";
                        }
                        if (flag) {
                            page.salesItemAPI.searchValues("", "", filter, sort, function (data) {
                                if (data.length == 1) {
                                    page.selectItem(data[0]);
                                    callback([]);
                                }
                                else {
                                    if (CONTEXT.ITEM_SELECTION_MODE == "HighVolumeAuto" || CONTEXT.ITEM_SELECTION_MODE == "HighVolumeManual") {
                                        var result = TakeLatest(data);
                                        if (result.length == 1) {
                                            page.selectItem(result[0]);
                                            callback([]);
                                        }
                                        else {
                                            callback(result);
                                        }
                                    }
                                    else {
                                        callback(data);
                                    }
                                }
                            });
                        }
                        else {
                            page.salesItemAPI.getValue({ item_no: term, sales_tax_no: CONTEXT.DEFAULT_SALES_TAX }, function (data) {
                                if (data.length == 1) {
                                    page.selectItem(data[0]);
                                    callback([]);
                                }
                                else {
                                    if (CONTEXT.ITEM_SELECTION_MODE == "HighVolumeAuto" || CONTEXT.ITEM_SELECTION_MODE == "HighVolumeManual") {
                                        var result = TakeLatest(data);
                                        if (result.length == 1) {
                                            page.selectItem(result[0]);
                                            callback([]);
                                        }
                                        else {
                                            callback(result);
                                        }
                                    }
                                    else {
                                        callback(data);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        callback([]);
                    }
                }
            });
            page.controls.txtItemSearch.select(function (item) {
                var tax_per = 0, cgst = 0, sgst = 0, igst = 0,cess_per=0,cess_qty=0,cess_qty_amount=0;
                if (item != null) {
                    if (typeof item.item_no != "undefined") {

                        //populate discount
                        page.itemService.getItemDiscountAutocomplete(item.item_no, function (data) {
                            if (item.tax_class_no == null || item.tax_class_no == "" || item.tax_class_no == undefined)
                                item.tax_class_no = -1;
                            $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                                if (item.tax_class_no == tax_data.tax_class_no) {
                                    tax_per = tax_data.tax_per;
                                    cgst = tax_data.cgst;
                                    sgst = tax_data.sgst;
                                    igst = tax_data.igst;
                                    cess_per = tax_data.cess_per;
                                    cess_qty = tax_data.cess_qty;
                                    cess_qty_amount = tax_data.cess_qty_amount;
                                }
                            });
                            if (data != '' && data != undefined) {
                                $(data).each(function (i, ditem) {
                                    page.selectedBill.discounts.push({
                                        disc_no: ditem.disc_no,
                                        disc_type: ditem.disc_type,
                                        disc_name: ditem.disc_name,
                                        disc_value: ditem.disc_value,
                                        item_no: item.item_no
                                    });
                                });
                            }
                            if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                                var monthex;
                                var yearex
                                if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                                    monthex = item.expiry_date.substring(3, 5);
                                    yearex = item.expiry_date.substring(6, 10);
                                    item.expiry_date = monthex + "-" + yearex;
                                }
                                if (item.man_date != null && item.man_date != undefined && item.man_date != "") {
                                    monthex = item.man_date.substring(3, 5);
                                    yearex = item.man_date.substring(6, 10);
                                    item.man_date = monthex + "-" + yearex;
                                }
                            }
                            var newdate = new Date();
                            var newitem = {
                                item_no: item.item_no,
                                item_code: item.item_code,
                                item_name: item.item_name,
                                item_name_tr: item.item_name_tr,
                                discount: 0,
                                //tax: item.tax,
                                tax: tax_per,
                                tax_per: tax_per,
                                tax_class_no: item.tax_class_no,
                                qty: 1,
                                bill_item_qty: 1,
                                temp_qty: 1,
                                //free_item:item.free_item,
                                qty_const: item.qty_stock,
                                free_qty: 0,
                                qty_stock: item.qty_stock,
                                // price: (item.tax_inclusive == "0") ? parseFloat(item.price).toFixed(5) : parseFloat(parseFloat(item.price) / ((100 + parseFloat(item.tax)) / 100)).toFixed(4),
                                price: ($$("ddlRate").selectedValue() == "1") ? item.price : ($$("ddlRate").selectedValue() == "2") ? item.alter_price_1 : item.alter_price_2,
                                temp_price: item.price,
                                alter_price_1: item.alter_price_1,
                                alter_price_2: item.alter_price_2,
                                //price: item.price,
                                unit: item.unit,
                                mrp: item.mrp,
                                expiry_date: item.expiry_date,
                                batch_no: item.batch_no,
                                item_sub_total: item.price * 1 - item.tax * item.price * 1,
                                total_price: item.price * 1 - item.tax * item.price * 1,
                                tray_id: item.tray_no,
                                qty_type: item.qty_type,
                                cost: item.cost == null ? 0 : parseFloat(item.cost).toFixed(5),
                                tax_inclusive: item.tax_inclusive,
                                variation_name: item.variation_name,
                                var_no: item.var_no,
                                hsn_code: item.hsn_code,
                                cgst: cgst,//parseFloat(item.cgst).toFixed(5),
                                sgst: sgst,//parseFloat(item.sgst).toFixed(5),
                                igst: igst,//parseFloat(item.igst).toFixed(5),
                                cot_of_good: item.cost,
                                man_date: item.man_date,
                                alter_unit: item.alter_unit,
                                alter_unit_fact: item.alter_unit_fact,
                                unit_identity: 0,
                                expiry_alert_days: item.expiry_alert_days,
                                price_no: item.price_no == null ? "0" : item.price_no,
                                rack_no: item.rack_no,
                                reorder_level: item.reorder_level,
                                discount_inclusive: item.discount_inclusive,
                                executive_id: "",
                                start_date: "",//newdate.getDate() + "-" + newdate.getMonth() + "-" + newdate.getFullYear(),
                                end_date: "",//newdate.getDate() + "-" + newdate.getMonth() + "-" + newdate.getFullYear()
                                out_stock_cost: item.out_stock_cost,
                                stock_selection: "none",
                                stock_no:item.stock_no,
                                package_item: item.package_item,
                                package_count: item.package_count,
                                item_package: "",
                                cess_per : cess_per,
                                cess_qty : cess_qty,
                                cess_qty_amount: cess_qty_amount,
                                cgst_val: 0,
                                sgst_val: 0,
                                igst_val: 0,
                                cess_per_val: 0,
                                tax_per_amt: 0,
                            };

                            //Populate 
                            var rows = page.controls.grdBill.getRow({
                                variation_name: item.variation_name
                            });

                            if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE && (!CONTEXT.SingleCashier)) {
                                if (rows.length == 0) {
                                    page.controls.grdBill.createRow(newitem);
                                    page.controls.grdBill.edit(true);
                                    rows = page.controls.grdBill.getRow({
                                        //item_no: newitem.item_no
                                        variation_name: item.variation_name
                                    });
                                    rows[0].find("[datafield=executive_id]").click();
                                    rows[0].find("[datafield=executive_id]").find("input").focus().select();
                                }
                                else {
                                    var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                    txtQty.val(parseFloat(txtQty.val()) + 1);
                                    page.controls.grdBill.getRowData(rows[0]).temp_qty = parseFloat(txtQty.val());

                                    //Change Qty
                                    var txtQty1 = rows[0].find("[datafield=qty]").find("div");
                                    txtQty1.val(parseFloat(txtQty.val()));
                                    rows[0].find("[datafield=qty]").find("div").html(parseFloat(txtQty1.val()));
                                    rows[0].find("[datafield=qty]").find("div").val(parseFloat(txtQty1.val()));
                                    page.controls.grdBill.getRowData(rows[0]).qty = parseFloat(txtQty1.val());

                                    rows[0].find("[datafield=executive_id]").find("input").focus().select();
                                }
                            }
                            else {
                                if (rows.length == 0) {
                                    page.controls.grdBill.createRow(newitem);
                                    page.controls.grdBill.edit(true);
                                    rows = page.controls.grdBill.getRow({
                                        //item_no: newitem.item_no
                                        variation_name: item.variation_name
                                    });
                                    rows[0].find("[datafield=temp_qty]").click();
                                    rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                                }
                                else {
                                    var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                    txtQty.val(parseFloat(txtQty.val()) + 1);
                                    page.controls.grdBill.getRowData(rows[0]).temp_qty = parseFloat(txtQty.val());

                                    //Change Qty
                                    var txtQty1 = rows[0].find("[datafield=qty]").find("div");
                                    txtQty1.val(parseFloat(txtQty.val()));
                                    rows[0].find("[datafield=qty]").find("div").html(parseFloat(txtQty1.val()));
                                    page.controls.grdBill.getRowData(rows[0]).qty = parseFloat(txtQty1.val());

                                    txtQty.trigger('change');
                                    txtQty.focus();
                                }
                            }

                            page.controls.txtItemSearch.customText("");
                            page.controls.txtItemSearch.clearLastTerm();
                            page.calculate();

                            if (item.package_item != null && item.package_item != "" && typeof item.package_item != "undefined") {
                                rows[0].find("[datafield=temp_qty]").click()
                                page.events.btnItemPackage_click();
                            }
                            //   })

                        });
                    }
                }
            });
            if (CONTEXT.ENABLE_EMAIL == "true") {
                $$("btnSendMail").show();
            } else {
                $$("btnSendMail").hide();
            }
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                $$("btnSendSMS").show();
            } else {
                $$("btnSendSMS").hide();
            }
            (CONTEXT.ENABLE_SALES_EXECUTIVE) ? $$("pnlSalesExecutive").show() : $$("pnlSalesExecutive").hide();
            (CONTEXT.ENABLE_CASHIER_BARCODE) ? $$("pnlCashierBarcode").show() : $$("pnlCashierBarcode").hide();
            page.view.selectedPayment([]);

            var payModeType = [];
            payModeType.push({ mode_type: "Cash" }, { mode_type: "Card" });
            if (CONTEXT.ENABLE_REWARD_MODULE == true)
                payModeType.push({ mode_type: "Points" })
            if (CONTEXT.ENABLE_COUPON_MODULE == "true")
                payModeType.push({ mode_type: "Coupon" })
            page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
            page.controls.ddlEMIPaymentType.dataBind(payModeType, "mode_type", "mode_type");
            payModeType.push({ mode_type: "Mixed" });
            page.controls.ddlPayType.dataBind(payModeType, "mode_type", "mode_type");
            payModeType.push({ mode_type: "Loan" });
            page.controls.ddlPayType.dataBind(payModeType, "mode_type", "mode_type");
            if (CONTEXT.ENABLE_EMI_PAYMENT) {
                payModeType.push({ mode_type: "EMI" });
                page.controls.ddlPayType.dataBind(payModeType, "mode_type", "mode_type");
            }

            (CONTEXT.ENABLE_REWARD_MODULE == true) ? $$("pnlCustPoints").show() : $$("pnlCustPoints").hide();

            (CONTEXT.ENABLE_CUST_GST == true) ? $$("pnlCustGst").show() : $$("pnlCustGst").hide();

            $$("ddlPayType").selectedValue(CONTEXT.SALES_BILL_PAY_MODE);

            CONTEXT.POSShowFree = false;
            CONTEXT.POSShowStock = false;
            CONTEXT.POSShowGST = false;
            CONTEXT.SingleCashier = false;
            $$("chkShowFree").change(function () {
                if ($$("chkShowFree").prop("checked")) {

                    CONTEXT.POSShowFree = true;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    page.calculate();
                } else {
                    CONTEXT.POSShowFree = false;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    page.calculate();
                }
            });
            $$("chkShowStock").change(function () {
                if ($$("chkShowStock").prop("checked")) {
                    CONTEXT.POSShowStock = true;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    page.calculate();
                } else {
                    CONTEXT.POSShowStock = false;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    page.calculate();
                }
            });
            $$("chkShowGst").change(function () {
                if ($$("chkShowGst").prop("checked")) {
                    CONTEXT.POSShowGST = true;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.calculate();
                    page.billCalculate(page.controls.grdBill.allData(), page.selectedBill.state_text);
                } else {
                    CONTEXT.POSShowGST = false;
                    page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
                    //page.calculate();
                    page.billCalculate(page.controls.grdBill.allData(), page.selectedBill.state_text);
                }
            });
            $$("chkSingleCashier").change(function () {
                if ($$("chkSingleCashier").prop("checked")) {
                    CONTEXT.SingleCashier = true;
                }
                else {
                    CONTEXT.SingleCashier = false;
                }
                page.pingGrid(page.selectedBill.state_text, page.controls.grdBill.allData());
            });
            if (CONTEXT.SHOW_FREE == true) {
                $$("chkShowFree").show();
                $$("lblFree").show();
            } else {
                $$("chkShowFree").hide();
                $$("lblFree").hide();
            }
            if (CONTEXT.SHOW_STOCK_COLUMN == true) {
                $$("chkShowStock").show();
                $$("lblFreeStock").show();
            } else {
                $$("chkShowStock").hide();
                $$("lblFreeStock").hide();
            }
            if (CONTEXT.ENABLE_CUST_GST == true) {
                $$("chkShowGst").show();
                $$("lblGst1").show();
            } else {
                $$("chkShowGst").hide();
                $$("lblGst1").hide();
            }
            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                $$("pnlExpenses").show();
                $$("pnlExpenseName").show();
            } else {
                $$("pnlExpenses").hide();
                $$("pnlExpenseName").hide();
            }
            if (CONTEXT.ENABLE_BILL_ADVANCE) {
                $$("pnlAdvancePanel").show();
            } else {
                $$("pnlAdvancePanel").hide();
            }
            if (CONTEXT.ENABLE_ADVANCE_SEARCH) {
                $$("btnSearchItem").show();
            } else {
                $$("btnSearchItem").hide();
            }
            if (CONTEXT.ENABLE_BILL_LEVEL_DISCOUNT) {
                $$("pnlBillDiscount").show();
            } else {
                $$("pnlBillDiscount").hide();
            }
            if (CONTEXT.ENABLE_ITEM_RATE) {
                page.controls.ddlRate.show();
            }
            else {
                page.controls.ddlRate.hide();
            }

            page.controls.ddlRate.selectionChange(function () {
                if (page.selectedBill.state_text == "Sale" || page.selectedBill.state_text == "Return" || page.selectedBill.state_text == "SaleReturn") {

                }
                else {
                    page.reCalculate(function (data) {
                        page.calculate();
                    });
                }
            });

            page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + CONTEXT.DEFAULT_SALES_TAX, "", function (data) {
                if (typeof page.selectedBill != "undefined" && page.selectedBill != null) {
                    page.selectedBill.sales_tax_class = data;
                }
            });
            $$("chkPrintBill").prop("checked", true);
            $("#txtEMIPayment").bind("change", function () {
                try {
                    if (parseInt($$("txtEMIPayment").value()) <= 0 || $$("txtEMIPayment").value() == "" || $$("txtEMIPayment").value() == null || typeof $$("txtEMIPayment").value() == "undefined") {
                        $$("txtEMIPayment").value(0);
                    }
                    var amount = parseFloat(parseFloat(page.controls.lblTotal.value()) - parseFloat($$("txtEMIPayment").value())).toFixed(4);
                    page.controls.lblTotalBalanceEMIAmount.value(amount);
                }
                catch (e) {
                    ShowDialogBox('Warning', e, 'Ok', '', null);
                }
            });

            $$("lblTaxLabel").selectedObject.click(function () {
                if (CONTEXT.ENABLE_TAX_CHANGES) {
                    page.controls.ddlSalesTax.selectedValue(page.selectedBill.sales_tax_no);
                    page.controls.pnlTaxPopup.open();
                    page.controls.pnlTaxPopup.title("Tax Selection");
                    page.controls.pnlTaxPopup.rlabel("Tax");
                    page.controls.pnlTaxPopup.width(600);
                    page.controls.pnlTaxPopup.height(150);
                    if (page.selectedBill.state_text == "Saved" || page.selectedBill.state_text == "NewBill") {
                        $$("btnTaxOK").show();
                    }
                    else {
                        $$("btnTaxOK").hide();
                    }
                } else { }
            });

            if (CONTEXT.ENABLE_QR_CODE) {
                $$("btnQrScan").show();
            }
            else {
                $$("btnQrScan").hide();
            }

            //$("[controlid=txtItemPackage]").bind("keypress", function (e) {
            //    var self = this;
            //    setTimeout(function () {
            //        var str = $(self).val();
            //        if (str.startsWith("00")) {
            //            $(self).val(parseInt(str.substring(0, str.length - 1)));
            //            // $(self).keydown();
            //        }
            //    }, 1000);
            //});
            $("[controlid=txtItemPackage]").bind("keypress", function (e) {
                if (e.ctrlKey == true && e.which == 0) {
                    if ($(this).attr("search_mode") == "text") {
                        $(this).attr("search_mode", "barcode");
                        $(this).attr("placeholder", "Enter Your Barcode");
                        page.packageAttributes = "barcode";
                    }
                    else {
                        $(this).attr("search_mode", "text");
                        $(this).attr("placeholder", "Item No,Item Name or Scan.");
                        page.packageAttributes = "text";
                    }
                }
                if ($(this).attr("search_mode") == "barcode" && e.which == 13) {
                    page.searchPackageStock_click();
                }

                var self = this;
                var beforeScan = $(self).val();
                setTimeout(function () {
                    var str = $(self).val();
                    if (str.startsWith("00")) {
                        $(self).val(parseInt(str.substring(0, str.length - 1)));
                    }
                }, 100)
            });
            page.controls.txtItemPackage.itemTemplate = function (item) {
                var mrp = isNaN(parseFloat(item.mrp)) ? "" : parseFloat(item.mrp).toFixed(2);
                if (CONTEXT.GROUP_BUYING_COST) {
                    if (item.ptype_name == null)
                        return "<a>" + item.item_name + "-" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                    else
                        return "<a>" + item.item_name + " in " + item.ptype_name + " -" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                }
                else {
                    if (item.ptype_name == null)
                        return "<a>" + item.item_name + "-" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                    else
                        return "<a>" + item.item_name + " in " + item.ptype_name + " -" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
                }
            }
            page.controls.txtItemPackage.dataBind({
                getData: function (term, callback) {
                    if (page.packageAttributes == "text") {
                        var filter = "";
                        var sort = "";
                        if (term.startsWith("00"))
                            term = term.substring(0, term.length - 1);
                        if (!isNaN(term))
                            filter = "(c.item_no = '" + term + "' or c.item_code = '" + term + "' or c.barcode like '%" + term + "%' )";
                        else
                            filter = "(item_name like '" + term + "%' or c.barcode like '%" + term + "%'   or man_name like '" + term + "')";
                        if (term.startsWith("@")) {
                            filter = "(ivt.var_no = '" + term.substring(1, term.length) + "' and m.var_no=ivt.var_no )";
                        }
                        var search = term;
                        var flag = false;
                        if (search.startsWith("S") || search.startsWith("s")) {
                            var no = search.substring(1, search.length);
                            if (!isNaN(no)) {
                                filter = "(ist.stock_no = '" + search.substring(1, search.length) + "' and m.var_no=ist.var_no )";
                                flag = true;
                            }
                        }

                        if (CONTEXT.ENABLE_STOCK_MAINTANENCE) {
                            sort = "having qty_stock > 0";
                        }
                        if (flag) {
                            page.salesItemAPI.searchValues("", "", filter, sort, function (data) {
                                if (data.length == 1) {
                                    page.selectPackage(data[0]);
                                    callback([]);
                                }
                                else {
                                    callback(data);
                                }
                            });
                        }
                        else {
                            page.salesItemAPI.getValue({ item_no: term, sales_tax_no: CONTEXT.DEFAULT_SALES_TAX }, function (data) {
                                if (data.length == 1) {
                                    page.selectPackage(data[0]);
                                    callback([]);
                                }
                                else {
                                    callback(data);
                                }
                            });
                        }
                    }
                    else {
                        callback([]);
                    }
                }
            });
            page.controls.txtItemPackage.select(function (item) {
                page.selectPackage(item);
            });
            //page.controls.txtItemPackage.itemTemplate = function (item) {
            //    var mrp = isNaN(parseFloat(item.mrp)) ? "" : parseFloat(item.mrp).toFixed(2);
            //    if (CONTEXT.GROUP_BUYING_COST) {
            //        if (item.ptype_name == null)
            //            return "<a>" + item.item_name + "-" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
            //        else
            //            return "<a>" + item.item_name + " in " + item.ptype_name + " -" + item.item_no + "<span style='margin:right:30px'><span>[PP:" + parseFloat(item.cost).toFixed(2) + "]<span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
            //    }
            //    else {
            //        if (item.ptype_name == null)
            //            return "<a>" + item.item_name + "-" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
            //        else
            //            return "<a>" + item.item_name + " in " + item.ptype_name + " -" + item.item_no + "<span style='margin:right:30px'><span style='margin:right:30px'><span>[SP:" + parseFloat(item.price).toFixed(2) + "]<span style='margin:right:30px'><span> [MP:" + mrp + "]</a>";
            //    }
            //}
            //page.controls.txtItemPackage.dataBind({
            //    getData: function (term, callback) {
            //        var filter = "";
            //        var sort = "";
            //        if (!isNaN(term))
            //            filter = "(c.item_no = '" + term + "' or c.item_code = '" + term + "' or c.barcode like '%" + term + "%' )";
            //        else
            //            filter = "(item_name like '" + term + "%' or c.barcode like '%" + term + "%'   or man_name like '" + term + "')";
            //        if (term.startsWith("#")) {
            //            filter = "(c.item_no = '" + term.substring(1, term.length) + "' )";
            //        }
            //        if (term.startsWith("@")) {
            //            filter = "(ivt.var_no = '" + term.substring(1, term.length) + "' and m.var_no=ivt.var_no )";
            //        }
            //        page.salesItemAPI.searchValues("", "", filter, sort, function (data) {
            //            if (data.length == 1) {
            //                page.selectPackage(data[0]);
            //                callback([]);
            //            }
            //            else {
            //                callback(data);
            //            }
            //        });
            //    }
            //});
            //page.controls.txtItemPackage.select(function (item) {
            //    page.selectPackage(item);
            //});

            $$("ddlBillType").selectionChange(function () {
                if ($$("ddlBillType").selectedValue() == "SaleReturn"){
                    page.controls.lblTotalNet.css("color", "red");
                }
                else{
                    page.controls.lblTotalNet.css("color", "white");
                }
            });
        }
        page.events.btnItemPackage_click = function () {
            page.controls.pnlItemPackage.open();
            page.controls.pnlItemPackage.title("Package");
            page.controls.pnlItemPackage.rlabel("Package");
            page.controls.pnlItemPackage.width(700);
            page.controls.pnlItemPackage.height(300);

            $$("grdItemPackage").width("100%");
            $$("grdItemPackage").height("auto");
            page.controls.grdItemPackage.setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Variation", 'width': "90px", 'dataField': "variation_name" },
                    { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                    { 'name': "Item No", 'width': "120px", 'dataField': "item_no" },
                    { 'name': "Item Name", 'width': "120px", 'dataField': "item_name" },
                    { 'name': "", 'width': "40px", 'dataField': "", itemTemplate: "<input type='button'  class='grid-button' value='' action='Delete' style='background-image: url(BackgroundImage/cancel.png);    background-size: contain;    background-color: transparent;    width: auto;background-repeat: no-repeat;    width: 15px;    border: none;    cursor: pointer;'/>" },
                ]
            });
            page.controls.grdItemPackage.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Delete") {
                    page.controls.grdItemPackage.deleteRow(rowId);
                    page.calculate();
                }
            }
            page.controls.grdItemPackage.dataBind([]);
            page.controls.txtItemPackage.selectedObject.val("");
        }
        page.selectPackage = function (item) {
            if (typeof item.var_no != "undefined") {
                var data = {
                    variation_name: item.variation_name,
                    item_no: item.item_no,
                    item_name: item.item_name,
                    var_no:item.var_no
                }
                $$("grdItemPackage").createRow(data);
            }

            page.controls.txtItemPackage.customText("");
            page.controls.txtItemPackage.clearLastTerm();
        }
        page.events.btnSaveItemPackage_click = function (data) {
            page.checkPackageItem(function (data) {
                if (data) {
                    var rows = page.controls.grdBill.selectedData()[0];
                    $(page.controls.grdItemPackage.getAllRows()).each(function (i, row) {
                        var item = page.controls.grdItemPackage.getRowData(row);
                        rows.item_package = (rows.item_package == "") ? item.var_no : rows.item_package + "-" + item.var_no;
                    });
                    page.controls.pnlItemPackage.close();
                    $$("txtItemSearch").selectedObject.focus();
                }
            });
        }
        page.checkPackageItem = function (callback) {
            try{
                var rows = page.controls.grdBill.selectedData()[0];
                if (parseInt(rows.package_count) < page.controls.grdItemPackage.allData().length)
                    throw "Items Exceeds Than The Packaged Item";
                var checkedItems = rows.package_item.split("||");
                $(page.controls.grdItemPackage.getAllRows()).each(function (i, row) {
                    var item = page.controls.grdItemPackage.getRowData(row);
                    if (!checkedItems.includes(item.item_no))
                        throw "Non Packaged Item Are Present Please Remove It";
                });
                callback(true);
            }
            catch (e) {
                alert(e);
                callback(false);
            }
        }
        page.selectItem = function (item) {
            var tax_per = 0, cgst = 0, sgst = 0, igst = 0, cess_per = 0, cess_qty = 0, cess_qty_amount = 0;
            if (item != null) {
                if (typeof item.item_no != "undefined") {

                    //populate discount
                    page.itemService.getItemDiscountAutocomplete(item.item_no, function (data) {
                        //page.discountItemAPI.searchValues("", "", "t.comp_id=" + localStorage.getItem("user_company_id") + " and i.item_no= " + item.item_no + " and (t.end_date='' or t.end_date is null or (STR_TO_DATE(t.end_date, '%m/%d/%Y %H:%i'))>(STR_TO_DATE(sysdate(), '%Y-%m-%d %H:%i')))", "", function (data) {
                        if (item.tax_class_no == null || item.tax_class_no == "" || item.tax_class_no == undefined)
                            item.tax_class_no = -1;
                        $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                            if (item.tax_class_no == tax_data.tax_class_no) {
                                tax_per = tax_data.tax_per;
                                cgst = tax_data.cgst;
                                sgst = tax_data.sgst;
                                igst = tax_data.igst;
                                cess_per = tax_data.cess_per;
                                cess_qty = tax_data.cess_qty;
                                cess_qty_amount = tax_data.cess_qty_amount;
                            }
                        });
                        //  page.taxclassService.getTaxByItem(page.selectedBill.sales_tax_no, item.tax_class_no, function (taxData) {
                        if (data != '' && data != undefined) {
                            $(data).each(function (i, ditem) {
                                page.selectedBill.discounts.push({
                                    disc_no: ditem.disc_no,
                                    disc_type: ditem.disc_type,
                                    disc_name: ditem.disc_name,
                                    disc_value: ditem.disc_value,
                                    item_no: item.item_no
                                });
                            });
                        }
                        if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                            var monthex;
                            var yearex
                            if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                                monthex = item.expiry_date.substring(3, 5);
                                yearex = item.expiry_date.substring(6, 10);
                                item.expiry_date = monthex + "-" + yearex;
                            }
                            if (item.man_date != null && item.man_date != undefined && item.man_date != "") {
                                monthex = item.man_date.substring(3, 5);
                                yearex = item.man_date.substring(6, 10);
                                item.man_date = monthex + "-" + yearex;
                            }
                        }
                        var newdate = new Date();
                        var newitem = {
                            item_no: item.item_no,
                            item_code: item.item_code,
                            item_name: item.item_name,
                            item_name_tr: item.item_name_tr,
                            discount: 0,
                            //tax: item.tax,
                            tax: tax_per,
                            tax_per: tax_per,
                            tax_class_no: item.tax_class_no,
                            qty: 1,
                            bill_item_qty: 1,
                            temp_qty: 1,
                            //free_item:item.free_item,
                            qty_const: item.qty_stock,
                            free_qty: 0,
                            qty_stock: item.qty_stock,
                            // price: (item.tax_inclusive == "0") ? parseFloat(item.price).toFixed(5) : parseFloat(parseFloat(item.price) / ((100 + parseFloat(item.tax)) / 100)).toFixed(4),
                            price: ($$("ddlRate").selectedValue() == "1") ? item.price : ($$("ddlRate").selectedValue() == "2") ? item.alter_price_1 : item.alter_price_2,
                            temp_price: item.price,
                            alter_price_1: item.alter_price_1,
                            alter_price_2: item.alter_price_2,
                            //price: item.price,
                            unit: item.unit,
                            mrp: item.mrp,
                            expiry_date: item.expiry_date,
                            batch_no: item.batch_no,
                            item_sub_total: item.price * 1 - item.tax * item.price * 1,
                            total_price: item.price * 1 - item.tax * item.price * 1,
                            tray_id: item.tray_no,
                            qty_type: item.qty_type,
                            cost: item.cost == null ? 0 : parseFloat(item.cost).toFixed(5),
                            tax_inclusive: item.tax_inclusive,
                            variation_name: item.variation_name,
                            var_no: item.var_no,
                            hsn_code: item.hsn_code,
                            cgst: cgst,//parseFloat(item.cgst).toFixed(5),
                            sgst: sgst,//parseFloat(item.sgst).toFixed(5),
                            igst: igst,//parseFloat(item.igst).toFixed(5),
                            cot_of_good: item.cost,
                            man_date: item.man_date,
                            alter_unit: item.alter_unit,
                            alter_unit_fact: item.alter_unit_fact,
                            unit_identity: 0,
                            expiry_alert_days: item.expiry_alert_days,
                            price_no: item.price_no == null ? "0" : item.price_no,
                            rack_no: item.rack_no,
                            reorder_level: item.reorder_level,
                            discount_inclusive: item.discount_inclusive,
                            executive_id: "",
                            start_date: "",//newdate.getDate() + "-" + newdate.getMonth() + "-" + newdate.getFullYear(),
                            end_date: "",//newdate.getDate() + "-" + newdate.getMonth() + "-" + newdate.getFullYear()
                            out_stock_cost: item.out_stock_cost,
                            stock_selection: "none",
                            stock_no: item.stock_no,
                            package_item: item.package_item,
                            package_count: item.package_count,
                            item_package: "",
                            cess_per: cess_per,
                            cess_qty: cess_qty,
                            cess_qty_amount: cess_qty_amount,
                            cgst_val: 0,
                            sgst_val: 0,
                            igst_val: 0,
                            cess_per_val: 0,
                            tax_per_amt : 0,
                        };

                        //Populate 
                        var rows = page.controls.grdBill.getRow({
                            //item_no: newitem.item_no
                            variation_name: item.variation_name
                        });

                        if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE && (!CONTEXT.SingleCashier)) {
                            if (rows.length == 0) {
                                page.controls.grdBill.createRow(newitem);
                                page.controls.grdBill.edit(true);
                                rows = page.controls.grdBill.getRow({
                                    variation_name: item.variation_name
                                });
                                rows[0].find("[datafield=executive_id]").find("input").focus().select();
                            }
                            else {
                                var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                txtQty.val(parseFloat(txtQty.val()) + 1);
                                page.controls.grdBill.getRowData(rows[0]).temp_qty = parseFloat(txtQty.val());
                                var txtQty1 = rows[0].find("[datafield=qty]").find("div");
                                txtQty1.val(parseFloat(txtQty.val()));
                                rows[0].find("[datafield=qty]").find("div").html(parseFloat(txtQty1.val()));
                                page.controls.grdBill.getRowData(rows[0]).qty = parseFloat(txtQty1.val());


                                //rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                                rows[0].find("[datafield=executive_id]").find("input").focus().select();
                            }
                        }
                        else {
                            if (rows.length == 0) {
                                page.controls.grdBill.createRow(newitem);
                                page.controls.grdBill.edit(true);
                                rows = page.controls.grdBill.getRow({
                                    //item_no: newitem.item_no
                                    variation_name: item.variation_name
                                });
                                rows[0].find("[datafield=temp_qty]").click();
                                rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                            }
                            else {
                                var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                txtQty.val(parseFloat(txtQty.val()) + 1);
                                page.controls.grdBill.getRowData(rows[0]).temp_qty = parseFloat(txtQty.val());

                                //Change Qty
                                var txtQty1 = rows[0].find("[datafield=qty]").find("div");
                                txtQty1.val(parseFloat(txtQty.val()));
                                rows[0].find("[datafield=qty]").find("div").html(parseFloat(txtQty1.val()));
                                page.controls.grdBill.getRowData(rows[0]).qty = parseFloat(txtQty1.val());

                                txtQty.trigger('change');
                                txtQty.focus().select();
                            }
                        }

                        page.controls.txtItemSearch.customText("");
                        page.controls.txtItemSearch.clearLastTerm();
                        page.calculate();
                        if (item.package_item != null && item.package_item != "" && typeof item.package_item != "undefined") {
                            rows[0].find("[datafield=temp_qty]").click()
                            page.events.btnItemPackage_click();
                        }
                    });
                }
            }

        }
        page.selectHighVloumeItem = function (item) {
            var tax_per = 0, cgst = 0, sgst = 0, igst = 0;
            if (item != null) {
                if (typeof item.item_no != "undefined") {
                    page.itemService.getItemDiscountAutocomplete(item.item_no, function (data) {
                        if (item.tax_class_no == null || item.tax_class_no == "" || item.tax_class_no == undefined)
                            item.tax_class_no = -1;
                        $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                            if (item.tax_class_no == tax_data.tax_class_no) {
                                tax_per = tax_data.tax_per;
                                cgst = tax_data.cgst;
                                sgst = tax_data.sgst;
                                igst = tax_data.igst;
                            }
                        });
                        if (data != '' && data != undefined) {
                            $(data).each(function (i, ditem) {
                                page.selectedBill.discounts.push({
                                    disc_no: ditem.disc_no,
                                    disc_type: ditem.disc_type,
                                    disc_name: ditem.disc_name,
                                    disc_value: ditem.disc_value,
                                    item_no: item.item_no
                                });
                            });
                        }
                        if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                            var monthex;
                            var yearex
                            if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                                monthex = item.expiry_date.substring(3, 5);
                                yearex = item.expiry_date.substring(6, 10);
                                item.expiry_date = monthex + "-" + yearex;
                            }
                            if (item.man_date != null && item.man_date != undefined && item.man_date != "") {
                                monthex = item.man_date.substring(3, 5);
                                yearex = item.man_date.substring(6, 10);
                                item.man_date = monthex + "-" + yearex;
                            }
                        }
                        page.stockAPI.getVariationByItem({ item_no: item.item_no, vendor_no: null }, function (variation) {
                            var newitem = {
                                item_no: item.item_no,
                                item_code: item.item_code,
                                item_name: item.item_name,
                                item_name_tr: item.item_name_tr,
                                discount: 0,
                                tax: tax_per,
                                tax_per: tax_per,
                                tax_class_no: item.tax_class_no,
                                qty: 1,
                                bill_item_qty: 1,
                                temp_qty: 1,
                                qty_const: item.qty_stock,
                                free_qty: 0,
                                qty_stock: variation[0].qty_stock,
                                price: ($$("ddlRate").selectedValue() == "1") ? variation[0].selling_price : ($$("ddlRate").selectedValue() == "2") ? variation[0].pre_alter_price_1 : variation[0].pre_alter_price_2,
                                temp_price: variation[0].selling_price,
                                alter_price_1: variation[0].pre_alter_price_1,
                                alter_price_2: variation[0].pre_alter_price_2,
                                unit: item.unit,
                                mrp: variation[0].mrp,
                                expiry_date: variation[0].expiry_date,
                                batch_no: variation[0].batch_no,
                                item_sub_total: variation[0].selling_price * 1 - item.tax * item.price * 1,
                                total_price: variation[0].selling_price * 1 - item.tax * variation[0].selling_price * 1,
                                tray_id: item.tray_no,
                                qty_type: item.qty_type,
                                cost: item.cost == null ? 0 : parseFloat(variation[0].rate).toFixed(5),
                                tax_inclusive: item.tax_inclusive,
                                variation_name: variation[0].variation_name,
                                var_no: variation[0].var_no,
                                hsn_code: item.hsn_code,
                                cgst: cgst,//parseFloat(item.cgst).toFixed(5),
                                sgst: sgst,//parseFloat(item.sgst).toFixed(5),
                                igst: igst,//parseFloat(item.igst).toFixed(5),
                                cot_of_good: variation[0].rate,
                                man_date: variation[0].man_date,
                                alter_unit: item.alter_unit,
                                alter_unit_fact: item.alter_unit_fact,
                                unit_identity: 0,
                                expiry_alert_days: item.expiry_alert_days,
                                price_no: item.price_no == null ? "0" : item.price_no,
                                rack_no: item.rack_no,
                                reorder_level: item.reorder_level,
                                discount_inclusive: item.discount_inclusive,
                                executive_id: "",
                                start_date: "",//newdate.getDate() + "-" + newdate.getMonth() + "-" + newdate.getFullYear(),
                                end_date: "",//newdate.getDate() + "-" + newdate.getMonth() + "-" + newdate.getFullYear()
                                out_stock_cost: item.out_stock_cost,
                                variation_data: variation
                            };
                            //Populate 
                            var rows = page.controls.grdBill.getRow({
                                variation_name: newitem.variation_name
                            });
                            if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE && (!CONTEXT.SingleCashier)) {
                                if (rows.length == 0) {
                                    page.controls.grdBill.createRow(newitem);
                                    page.controls.grdBill.edit(true);
                                    rows = page.controls.grdBill.getRow({
                                        variation_name: item.variation_name
                                    });
                                    rows[0].find("[datafield=executive_id]").find("input").focus().select();
                                }
                                else {
                                    var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                    txtQty.val(parseFloat(txtQty.val()) + 1);
                                    rows[0].find("[datafield=executive_id]").find("input").focus().select();
                                }
                            }
                            else {
                                if (rows.length == 0) {
                                    page.controls.grdBill.createRow(newitem);
                                    page.controls.grdBill.edit(true);
                                    rows = page.controls.grdBill.getRow({
                                        variation_name: newitem.variation_name
                                    });
                                    rows[0].find("[datafield=temp_qty]").find("input").focus().select();
                                }
                                else {
                                    var txtQty = rows[0].find("[datafield=temp_qty]").find("input");
                                    txtQty.val(parseFloat(txtQty.val()) + 1);
                                    txtQty.trigger('change');
                                    txtQty.focus();
                                }
                            }
                            page.controls.txtItemSearch.customText("");
                            page.controls.txtItemSearch.clearLastTerm();
                            page.calculate();
                        });
                    });
                }
            }
        }
        page.interface.setMessagePanel = function (msgPanel) {
            page.msgPanel = msgPanel;
        }

        page.interface.launchNewBill = null;
        page.interface.btnSaveBill_click = function () {
            page.events.btnSave_click();
        }
        page.interface.btnPayBill_click = function () {
            page.events.btnPayment_click();
        }
        page.interface.btnItemStock_click = function () {
            page.events.btnItemStock_click();
        }
        page.events.btnPay_EMI_click = function () {
            $$("btnPayEMI").disable(true);
            $$("btnPayEMI").hide();
            $$("btnSave").show();
            $$("btnPayment").show();
            $$("btnPayment").disable(false);
            page.controls.pnlEMI.open();
            page.controls.pnlEMI.title("EMI Payment Panel");
            page.controls.pnlEMI.rlabel("EMI Payment Panel");
            page.controls.pnlEMI.width(1200);
            page.controls.pnlEMI.height(600);
            page.view.selectedEMIPayment([]);
            $$("txtEMIPayment").value("");
            $$("txtEMIAmount").value("");
            $$("txtEMIInterest").value("");
            $$("txtEMIMonth").value("");
            $$("lblTotalBalanceEMIAmount").value("");
            $$("lblTotalEMIPaidAmount").value("");
            $$("lblTotalEMIDueAmount").value("");
            $$("ddlEMIDueType").selectedValue("-1");
            page.controls.lblTotalEMIAmount.value(page.controls.lblTotal.value());
            page.controls.lblTotalEMIBillAmount.value(page.controls.lblTotal.value());

            //Action For Due Type Change
            $$("ddlEMIDueType").selectionChange(function () {
                page.view.selectedEMIPayment([]);
                if ($$("ddlEMIDueType").selectedValue() == "-1") {
                    page.controls.pnlEMIDaily.hide();
                    page.controls.pnlEMIWeek.hide();
                    page.controls.pnlEMIMonth.hide();
                }
                if ($$("ddlEMIDueType").selectedValue() == "1") {
                    page.controls.pnlEMIDaily.show();
                    page.controls.pnlEMIWeek.hide();
                    page.controls.pnlEMIMonth.hide();
                }
                if ($$("ddlEMIDueType").selectedValue() == "2") {
                    page.controls.pnlEMIDaily.hide();
                    page.controls.pnlEMIWeek.show();
                    page.controls.pnlEMIMonth.hide();
                }
                if ($$("ddlEMIDueType").selectedValue() == "3") {
                    page.controls.pnlEMIDaily.hide();
                    page.controls.pnlEMIWeek.hide();
                    page.controls.pnlEMIMonth.show();
                }
            });
            $$("ddlEMIDueTypeWeek").selectionChange(function () {
                page.view.selectedEMIPayment([]);
            });
            $$("ddlEMIDueTypeMonth").selectionChange(function () {
                page.view.selectedEMIPayment([]);
            });
        }
        
        page.events.btnGenerateEMI_click = function () {
            try {
                if (parseInt($$("txtEMIAmount").value()) <= 0 || $$("txtEMIAmount").value() == "" || $$("txtEMIAmount").value() == null || typeof $$("txtEMIAmount").value() == "undefined" || isNaN($$("txtEMIAmount").value())) {
                    $$("txtEMIAmount").focus();
                    throw "EMI Amount Should Be Number And Positive";
                }
                if (parseInt($$("txtEMIMonth").value()) <= 0 || $$("txtEMIMonth").value() == "" || $$("txtEMIMonth").value() == null || typeof $$("txtEMIMonth").value() == "undefined" || isNaN($$("txtEMIMonth").value())) {
                    $$("txtEMIMonth").focus();
                    throw "EMI Month Should Be Number And Positive";
                }
                if (parseInt($$("txtEMIInterest").value()) <= 0 || $$("txtEMIInterest").value() == "" || $$("txtEMIInterest").value() == null || typeof $$("txtEMIInterest").value() == "undefined" || isNaN($$("txtEMIInterest").value())) {
                    $$("txtEMIInterest").focus();
                    throw "EMI Interest Should Be Number And Positive";
                }
                if (parseInt($$("txtEMIPayment").value()) <= 0 || $$("txtEMIPayment").value() == "" || $$("txtEMIPayment").value() == null || typeof $$("txtEMIPayment").value() == "undefined" || isNaN($$("txtEMIPayment").value())) {
                    $$("txtEMIPayment").focus();
                    throw "EMI Payment Should Be Number And Positive";
                }
                if (parseFloat($$("lblTotalEMIAmount").value()) < parseFloat($$("txtEMIPayment").value())) {
                    $$("txtEMIPayment").focus();
                    throw "EMI Payment Should Be Number And Positive";
                }
                if ($$("ddlEMIDueType").selectedValue() == "-1") {
                    throw "EMI Due Type Is Not Selected";
                }
                if ($$("ddlEMIDueType").selectedValue() == "1") {
                    if ($$("dsEMIStartDate").getDate() == "") {
                        throw"Start Date Is InValid"
                    }
                    //if ($$("dsEMIEndDate").getDate() == "") {
                    //    throw "End Date Is InValid"
                    //}
                    var end_date = new Date($$("dsEMIStartDate").getDate().split("-")[2], $$("dsEMIStartDate").getDate().split("-")[1] - 1, $$("dsEMIStartDate").getDate().split("-")[0]);
                    end_date.setMonth(end_date.getMonth() + parseInt($$("txtEMIMonth").value()));
                    var day = no_of_days($$("dsEMIStartDate").getDate(), $.datepicker.formatDate("dd-mm-yy", end_date));
                    if (parseInt(day) <= 0) {
                        throw "Invalid Start And End Date";
                    }
                }
                $$("btnPayEMI").disable(false);
                $$("btnPayEMI").show();
                var amount = parseFloat($$("lblTotalEMIAmount").value());
                amount = amount - parseFloat($$("txtEMIPayment").value());
                page.controls.grdAllEMI.dataBind([]);
                var data = [];
                if ($$("ddlEMIDueType").selectedValue() == "3") {
                    var start_date = new Date();
                    var date = $$("ddlEMIDueTypeMonth").selectedValue();
                    var month = start_date.getMonth() + 1;
                    var year = start_date.getFullYear();
                    for (var i = 0; i < parseInt($$("txtEMIMonth").value()) ; i++) {
                        month = month + 1;
                        var ori_date = ((month % 12) < 10) ? "0" + month % 12 : month % 12;
                        ori_date = parseInt(ori_date) == 0 ? 12 : ori_date;
                        var data1={
                            schedule_id: i + 1,
                            schedule_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            due_date: date + "-" + ori_date + "-" + year,
                            amount: parseFloat(amount / parseInt($$("txtEMIMonth").value())).toFixed(2)
                        };
                        page.controls.grdAllEMI.createRow(data1);
                        if (month % 12 == 0) {
                            year = year + 1;
                        }
                    }
                    //page.controls.grdAllEMI.dataBind(data);
                }
                if ($$("ddlEMIDueType").selectedValue() == "2") {
                    var monthDays = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31", ];
                    var start_date = new Date();
                    var seletDay = $$("ddlEMIDueTypeWeek").selectedValue();
                    var currentDay = start_date.getDay();
                    var interDay = seletDay - currentDay;
                    if (interDay == 0) {
                        interDay = 7;
                    }
                    else if (interDay < 0) {
                        interDay = 7 + interDay;
                    }
                    var month = start_date.getMonth();
                    var year = start_date.getFullYear();
                    var calDate = start_date.getDate();
                    for (var i = 0; i < parseInt($$("txtEMIMonth").value()) * 4 ; i++) {
                        
                        calDate = parseInt(calDate) + parseInt(interDay);
                        if (calDate > monthDays[month]) {
                            if (year % 4 == 0) {
                                if (month == 1) {
                                    calDate = calDate % 29;
                                    month = parseInt(month) + 1;
                                }
                                else {
                                    calDate = calDate % parseInt(monthDays[month]);
                                    month = parseInt(month) + 1;
                                }
                            }
                            else {
                                calDate = calDate % parseInt(monthDays[month]);
                                month = parseInt(month) + 1;
                            }
                        }
                        var ori_month = parseInt(month) + 1;
                        if (ori_month > 12) {
                            ori_month = ori_month % 12;
                        }
                        var data1={
                            schedule_id: i + 1,
                            schedule_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            due_date: calDate + "-" + ori_month + "-" + year,
                            amount: parseFloat(amount / (parseInt($$("txtEMIMonth").value()) * 4)).toFixed(2)
                        };
                        page.controls.grdAllEMI.createRow(data1);
                        if (month % 12 == 0) {
                            year = year + 1;
                        }
                        
                        interDay = 7;
                    }
                    //page.controls.grdAllEMI.dataBind(data);
                }
                if ($$("ddlEMIDueType").selectedValue() == "1") {
                    var end_date = new Date($$("dsEMIStartDate").getDate().split("-")[2], $$("dsEMIStartDate").getDate().split("-")[1] - 1, $$("dsEMIStartDate").getDate().split("-")[0]);
                    end_date.setMonth(end_date.getMonth() + parseInt($$("txtEMIMonth").value()));
                    var day = no_of_days($$("dsEMIStartDate").getDate(), $.datepicker.formatDate("dd-mm-yy", end_date));
                    var start_date = new Date(dbDateTime($$("dsEMIStartDate").getDate()));
                    var total = parseFloat($$("lblTotalEMIAmount").value()) - parseFloat($$("txtEMIPayment").value());
                    for (var i = 0; i < parseInt(day) ; i++) {
                        if (i != 0) {
                            start_date.setDate(start_date.getDate() + 1);
                        }
                        var data1={
                            schedule_id: i + 1,
                            schedule_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                            due_date: start_date.getDate() + "-" + (start_date.getMonth() + 1) + "-" + start_date.getFullYear(),
                            amount: parseFloat(parseFloat(total) / parseInt(day)).toFixed(2)
                        };
                        page.controls.grdAllEMI.createRow(data1);
                    }
                    //page.controls.grdAllEMI.dataBind(data);
                }
            }
            catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayEMI").disable(true);
                $$("btnPayEMI").hide();
            }
        }
        page.events.btnPayEMI_click = function () {
            $$("btnPayEMI").disable(true);
            $$("btnPayEMI").hide();
            if(page.controls.grdAllEMI.allData().length == 0){
                alert("Schedule Is Not Generated Properly...");
            }
            else {
                page.insertBill($$("ddlBillType").selectedValue(), "EMI", function (currentBillNo) {
                    page.controls.pnlEMI.close();
                    if ($$("chkPrintBill").prop("checked")) {
                        if (CONTEXT.ENABLE_JASPER) {
                            page.printJasper(currentBillNo, "PDF");
                        }
                    }

                    if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                        page.addpoints(currentBillNo);
                    }
                    if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                        page.addTray(currentBillNo);
                    }
                    if (CONTEXT.ENABLE_EMAIL == "true") {
                        page.events.btnSendMail_click();
                    }
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                        page.events.btnSendSMS_click();
                    }
                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                        page.addSalesExecutivePoints(currentBillNo);
                    }
                    page.interface.closeBill();
                    page.interface.launchNewBill();
                    page.currentBillNo = null;
                });
            }
        }
        page.events.btnPay_now_click = function () {
            $$("btnPayPending").disable(false);
            $$("btnPayPending").show();
            $$("btnSave").show();
            //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").show() : $$("btnSavePrint").hide();
            $$("btnPayment").show();
            $$("btnPayment").disable(false);
            page.controls.pnlPayNow.open();
            page.controls.pnlPayNow.title("Make Payment.");
            page.controls.pnlPayNow.rlabel("Make Payment.");
            page.controls.pnlPayNow.width(800);
            page.controls.pnlPayNow.height(400);
            $$("pnlCard").hide();
            $$("pnlCoupon").hide();
            $$("pnlAmount").show();
            $$("pnlBalance").show();
            $$("pnlPoints").hide();
            $$("lblBalance").value(parseFloat(page.controls.lblTotalNet.value()));
            $$("txtAmount").val('');
            $$("txtAmount").focus();
            $$("ddlPaymentType").selectionChange(function () {
                if ($$("ddlPaymentType").selectedValue() == "Cash") {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                else if ($$("ddlPaymentType").selectedValue() == "Coupon") {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").show();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                else if ($$("ddlPaymentType").selectedValue() == "Card") {
                    $$("pnlCard").show();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
                else if ($$("ddlPaymentType").selectedValue() == "Points") {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").show();
                    $$("pnlAmount").hide();
                    $$("pnlBalance").hide();
                }
                else {
                    $$("pnlCard").hide();
                    $$("pnlCoupon").hide();
                    $$("pnlPoints").hide();
                    $$("pnlAmount").show();
                    $$("pnlBalance").show();
                }
            });
        }
        page.events.btnAddPayment_click = function () {
            var amount = 0;
            try {
                var amt = parseInt($$("lblBalance").value()) - parseInt($$("txtAmount").val());
                if (!$$("ddlPaymentType").selectedValue() == "Points")
                    if (parseInt($$("txtAmount").val()) == 0 || $$("txtAmount").val() == null || $$("txtAmount").val() == undefined || isNaN(parseFloat($$("txtAmount").val())) || parseFloat($$("txtAmount").val()) <= 0 || $$("txtAmount").val() == "")
                        throw "Amount should be number and positive";
                if (($$("ddlPaymentType").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                    throw "Card no should be mantatory";
                if (($$("ddlPaymentType").selectedValue() == "Cash") && page.controls.txtAmount.val() == 0)
                    throw "Amount should not be zero";
                if (($$("ddlPaymentType").selectedValue() == "Card") && page.controls.txtAmount.val() == 0)
                    throw "Amount should not be zero";
                if (($$("ddlPaymentType").selectedValue() == "Cash") && parseInt(amt) < parseInt(0))
                    throw "Amount should not be exceed total amount";
                if (($$("ddlPaymentType").selectedValue() == "Card") && parseInt(amt) < parseInt(0))
                    throw "Amount should not be exceed total amount";
                if (($$("ddlPaymentType").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                    throw "Coupon no should be mantatory";
                if (($$("ddlPaymentType").selectedValue() == "Points") && ($$("txtPoints").val() == ""))
                    throw "Coupon no should be mantatory";
                if ($$("ddlPaymentType").selectedValue() == "Points") {
                    if (page.controls.txtCustomerName.selectedObject.val() == "" || page.controls.txtCustomerName.selectedObject.val() == null || page.controls.txtCustomerName.selectedObject.val() == undefined)
                        throw "Customer should be selected";
                    if (page.controls.lblAvalablePoints.value() == "" || page.controls.lblAvalablePoints.value() == null || page.controls.lblAvalablePoints.value() == undefined)
                        throw "Customer should have the points";
                    if (parseFloat(page.controls.lblTotal.value()) > parseFloat(page.controls.lblAvalablePoints.value()) / 4)
                        throw "Customer not having the enought points"
                    if (parseFloat(page.controls.txtPoints.value()) > parseFloat(page.controls.lblAvalablePoints.value()))
                        throw "Points Exceeds"
                }
                var data = {
                    pay_type: $$("ddlPaymentType").selectedValue(),
                    card_type: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Coupon" || $$("ddlPaymentType").selectedValue() == "Points") ? "" : $$("ddlCardType").selectedValue(),
                    card_no: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Coupon" || $$("ddlPaymentType").selectedValue() == "Points") ? "" : $$("txtCardNo").val(),
                    coupon_no: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Card" || $$("ddlPaymentType").selectedValue() == "Points") ? "" : $$("txtCouponNo").val(),
                    points: ($$("ddlPaymentType").selectedValue() == "Cash" || $$("ddlPaymentType").selectedValue() == "Card" || $$("ddlPaymentType").selectedValue() == "Coupon") ? "" : $$("txtPoints").val(),
                    amount: ($$("ddlPaymentType").selectedValue() == "Points") ? parseFloat($$("txtPoints").val()) / 4 : $$("txtAmount").val()
                }
                page.controls.grdAllPayment.createRow(data);
                $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                    amount = parseFloat(data.amount) + parseFloat(amount);
                });
                $$("lblBalance").value(parseFloat(page.controls.lblTotalNet.value()) - parseFloat(amount));
                // page.view.selectedPayment(data);
                $$("txtAmount").val('');

            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
            }
        },
        page.events.btnMixedPayment_click = function () {
            $$("btnPayPending").disable(true);
            $$("btnPayPending").hide();
            $$("btnSave").hide();
            //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").hide() : $$("btnSavePrint").hide();
            $$("btnPayment").hide();
            $$("btnPayment").disable(true);
            var amount = 0;
            try {
                if (page.controls.grdAllPayment.allData() == 0)
                    throw "Payment details not entered";
                $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                    amount = parseFloat(data.amount) + amount;
                });
                if (amount > parseFloat(page.controls.lblTotal.value()))
                    throw "Amount should not be exceeds than the total amount";
                page.insertBill($$("ddlBillType").selectedValue(), "Mixed", function (currentBillNo) {
                    page.controls.pnlPayNow.close();
                    if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                        page.addpoints(currentBillNo);
                    }
                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                        page.addSalesExecutivePoints(currentBillNo);
                    }
                    if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                        page.addTray(currentBillNo);
                    }
                    if (CONTEXT.ENABLE_EMAIL == "true") {
                        page.events.btnSendMail_click();
                    }
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                        page.events.btnSendSMS_click();
                    }
                    if ($$("chkPrintBill").prop("checked")) {
                        if (CONTEXT.ENABLE_JASPER) {
                            page.printJasper(currentBillNo, "PDF");
                        }
                    }
                    page.interface.closeBill();
                    page.interface.launchNewBill();
                });
            } catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayPending").disable(false);
                $$("btnPayPending").show();
                $$("btnSave").show();
                //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").show() : $$("btnSavePrint").hide();
                $$("btnPayment").show();
                $$("btnPayment").disable(false);
            }
        },
        page.events.btnPayment_click = function () {
            $$("btnPayment").disable(true);
            $$("btnPayment").hide();
            $$("btnSave").hide();
            //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").hide() : $$("btnSavePrint").hide();
            //var err_count = 0;
            //var item_count = true;
            try {
                page.check_item_qty(function (result) {
                    if (result) {
                        if (page.creditBill) {
                            if (parseFloat(page.controls.lblTotal.value()) < parseFloat(page.creditBillAmount)) {
                                err_count++;
                                throw "Credit Bill Amount Is Not  Lesser Than The Actual Bill Amount";;
                            }
                            if (parseFloat(page.controls.lblTotal.value()) > parseFloat(page.creditBillAmount)) {
                                err_count++;
                                throw "Credit Bill Amount Is Not Greater Than The Actual Bill Amount";;
                            }
                        }
                        if (CONTEXT.ENABLE_BILL_ADVANCE) {
                            if ($$("txtAdvanceAmount").val() == "" || isNaN($$("txtAdvanceAmount").val()) || parseInt($$("txtAdvanceAmount").val()) < 0 || typeof $$("txtAdvanceAmount").val() == "undefined") {
                                $$("txtAdvanceAmount").val(0);
                            }
                        }
                        if ($$("txtExpense").value() != "" && $$("txtExpense").value() != 0 && !isInt($$("txtExpense").value())) {
                            page.expense = false;
                        } else
                            page.expense = true;
                        if ($$("ddlPayType").selectedValue() == "Mixed") {
                            try {
                                if (page.controls.txtCustomerName.selectedObject.val() == "" || page.controls.txtCustomerName.selectedObject.val() == null || page.controls.txtCustomerName.selectedObject.val() == undefined)
                                    throw "Customer should be selected";
                                page.events.btnPay_now_click();
                            }
                            catch (e) {
                                ShowDialogBox('Warning', e, 'Ok', '', null);
                                $$("btnPayment").disable(false);
                                $$("btnPayment").show();
                                $$("btnSave").show();
                            }
                        }
                        else if ($$("ddlPayType").selectedValue() == "EMI") {
                            try {
                                if (page.controls.txtCustomerName.selectedObject.val() == "" || page.controls.txtCustomerName.selectedObject.val() == null || page.controls.txtCustomerName.selectedObject.val() == undefined)
                                    throw "Customer should be selected";
                                page.events.btnPay_EMI_click();
                            }
                            catch (e) {
                                ShowDialogBox('Warning', e, 'Ok', '', null);
                                $$("btnPayment").disable(false);
                                $$("btnPayment").show();
                                $$("btnSave").show();
                            }

                        }
                        else {
                            var pay_mode = ($$("ddlPayType").selectedValue() == "Points") ? "Rewards" : (page.controls.ddlPayType.selectedValue() == "Loan") ? "Loan" : "Cash";
                            try {
                                page.insertBill($$("ddlBillType").selectedValue(), pay_mode, function (currentBillNo,bill) {
                                    page.interface.createBill();
                                    //if ($$("chkPrintBill").prop("checked")) {
                                    //    if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                                    //        page.interface.printBill(currentBillNo, true);
                                    //    }
                                    //}
                                    if ($$("chkPrintBill").prop("checked")) {
                                        if (CONTEXT.ENABLE_JASPER) {
                                            page.printJasper(currentBillNo, "PDF");
                                        }
                                    }

                                    if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                                        page.addpoints(currentBillNo, bill);
                                    }
                                    if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                                        page.addTray(currentBillNo);
                                    }
                                    if (CONTEXT.ENABLE_EMAIL == "true") {
                                        page.events.btnSendMail_click();
                                    }
                                    if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                                        page.events.btnSendSMS_click();
                                    }
                                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                                        page.addSalesExecutivePoints(currentBillNo, bill);
                                    }

                                        
                                    //page.interface.closeBill();
                                    //page.interface.launchNewBill();
                                    page.currentBillNo = "0";
                                });
                            }
                            catch (e) {
                                ShowDialogBox('Warning', e, 'Ok', '', null);
                                $$("btnPayment").disable(false);
                                $$("btnPayment").show();
                                $$("btnSave").show();
                            }
                        }
                    }
                    else {
                        $$("btnPayment").disable(false);
                        $$("btnPayment").show();
                        $$("btnSave").show();
                    }
                });
            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayment").disable(false);
                $$("btnPayment").show();
                $$("btnSave").show();
                //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").show() : $$("btnSavePrint").hide();
            }
        }
        // Advance Search
        $("[controlid=txtAdvVendor]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.selectedBill.sales_tax_no);
        });
        $("[controlid=txtAdvManufacturer]").keyup(function () {
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.selectedBill.sales_tax_no);
        });
        page.check_item_qty = function (callback) {
            var result = true, j = 0;;
            if (page.controls.grdBill.allData().length == 0) {
                alert("No item(s) can be sale");
                $$("btnPayment").disable(false);
                $$("btnPayment").show();
                $$("btnSave").show();
                $$("txtItemSearch").selectedObject.focus();
                result = false;
            }
            $(page.controls.grdBill.allData()).each(function (i, item) {
                ++j;
                if (result) {
                    if (!page.creditBill)
                        if (parseFloat(item.qty) <= 0 || item.qty == undefined || item.qty == null || item.qty == "" || isNaN(item.qty))// || isNaN(items.qty))
                        {
                            alert("Qty should be number and positive");
                            result = false;
                        }
                    if (!page.creditBill)
                        if (parseFloat(item.free_qty) < 0 || (item.free_qty == "" && item.free_qty != 0) || isNaN(item.free_qty)) {
                            alert("Item free qty should be number and positive");
                            result = false;
                        }
                    if (item.free_qty == null || item.free_qty == undefined)
                        item.free_qty = 0;
                    if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                        item.tray_received = 0;
                    if (CONTEXT.ENABLE_STOCK_MAINTAINENCE) {
                        if (parseInt(item.qty_const) < (parseInt(item.qty) + parseInt(item.free_qty))) {
                            if ((confirm("Out Of Stock Entry Is Allowed For This Bill"))) {// + item.out_stock_cost + "
                                result = true;
                            }
                            else {
                                result = false;
                            }
                        }
                    }
                }
                if (j == page.controls.grdBill.allData().length) {
                    callback(result);
                }
            });
        }
        page.advanceItemSearch = function (ven_name, man_name, sales_tax_no) {
            page.itemService.getTouchItemAdvanceSearch(ven_name, man_name, sales_tax_no, function (data) {
                page.controls.grdAdvSearchItem.hide();
                page.controls.grdTouchAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                            { 'name': "", 'width': "0px", 'dataField': "item_no" },
                            { 'name': "", 'width': "0px", 'dataField': "item_name" },
                            { 'name': "", 'width': "0px", 'dataField': "item_code" },
                            { 'name': "", 'width': "0px", 'dataField': "vendor_name" },
                            { 'name': "", 'width': "0px", 'dataField': "man_name" },
                            { 'name': "", 'width': "0px", 'dataField': "tax" },
                            { 'name': "", 'width': "0px", 'dataField': "price" },
                            { 'name': "", 'width': "0px", 'dataField': "mrp" },
                            { 'name': "Select Items", 'width': "100%", 'dataField': "item_no", itemTemplate: "<div id='detailGrid'></div>" }

                    ]
                })

                $$("grdTouchAdvSearchItem").rowBound = function (row, item) {
                    var htmlTemplate = [];
                    htmlTemplate.push("<div><img id='output' style='max-width:150px; max-height:150px; min-height:150px;' src='" + CONTEXT.ImageDownloadPath + item.item_no + '/' + item.image_name + "'/><BR><p style='background-color:orange;'><span > Vendor : " + item.vendor_name + "<BR> Manufacturer : " + item.man_name + "<BR> MRP : " + item.mrp + "</span></p></div>");

                    $(row).find("[id=detailGrid]").html(htmlTemplate.join(""));
                }

                //page.controls.grdTouchAdvSearchItem.createRow(item);
                page.controls.grdTouchAdvSearchItem.dataBind(data);
                //page.controls.grdTouchAdvSearchItem.dataBind(data);
            });
        }
        // Advance Search
        page.events.btnTouchAdvaSearchItem_click = function () {
            $("div.touch").show();
            $$("txtAdvVendor").val('');
            $$("txtAdvManufacturer").val('');
            $$("txtAdvVendor").focus();
            page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val(), page.selectedBill.sales_tax_no);
            page.controls.grdAdvSearchItem.hide();
            //page.advanceItemSearch($$("txtAdvVendor").val(), $$("txtAdvManufacturer").val());
        }
        page.events.btnAdvSearchItem_click = function () {
            $("div.touch").hide();
            page.controls.pnlAdvSearchItemPopup.open();
            page.controls.pnlAdvSearchItemPopup.title("Item Advance Search");
            page.controls.pnlAdvSearchItemPopup.width(1300);
            page.controls.pnlAdvSearchItemPopup.height(600);
            $$("txtAdvItemSearch").val('');
            page.controls.grdAdvSearchItem.hide();
        }
        page.events.btnAdvaSearchItem_click = function () {
            $("div.touch").hide();
            page.controls.grdAdvSearchItem.show();

            page.itemService.getItemAdvanceSearchPO($$("txtAdvItemSearch").val(), function (data) {

                page.controls.grdAdvSearchItem.width("100%");
                //page.controls.grdAdvSearchItem.height("220px");
                page.controls.grdAdvSearchItem.setTemplate({
                    selection: "Multiple",
                    columns: [
                        { 'name': "Item No", 'width': "60px", 'dataField': "item_no" },
                        { 'name': "Item Name", 'width': "120px", 'dataField': "item_name" },
                        { 'name': "Item Code", 'width': "75px", 'dataField': "item_code" },
                        { 'name': "Default Vendor", 'width': "130px", 'dataField': "vendor_name" },
                        { 'name': "Manufacturer", 'width': "100px", 'dataField': "man_name" },
                        { 'name': "Tax", 'width': "60px", 'dataField': "tax" },
                        { 'name': "Price", 'width': "80px", 'dataField': "price" },
                        { 'name': "MRP", 'width': "80px", 'dataField': "mrp" },

                    ]
                });
                page.controls.grdAdvSearchItem.dataBind(data);

            });
        }
        page.events.btnAddAdvaSearchItem_click = function () {
            var data = {};
            if ($('div.touch').css('display') == 'none') {
                data = page.controls.grdAdvSearchItem.selectedData();
            }
            else {
                data = page.controls.grdTouchAdvSearchItem.selectedData();
            }
            page.advSearchItemSelect(data);
            page.controls.pnlAdvSearchItemPopup.close();
        }
        page.advSearchItemSelect = function (item) {
            if (item != null) {
                $(item).each(function (i, item) {
                    if (typeof item.item_no != "undefined") {

                        //populate discount
                        page.itemService.getItemDiscountAutocomplete(item.item_no, function (data) {
                            if (data != '' && data != undefined) {
                                $(data).each(function (i, ditem) {
                                    page.selectedBill.discounts.push({
                                        disc_no: ditem.disc_no,
                                        disc_type: ditem.disc_type,
                                        disc_name: ditem.disc_name,
                                        disc_value: ditem.disc_value,
                                        item_no: item.item_no
                                    });
                                });

                            }

                            var newitem = {
                                item_no: item.item_no,
                                item_name: item.item_name,
                                discount: 0,
                                tax: item.tax,
                                tax_class_no: item.tax_class_no,
                                qty: 1,
                                qty_const: item.qty_stock,
                                free_qty: 0,
                                qty_stock: item.qty_stock,
                                price: item.price,
                                unit: item.unit,
                                mrp: item.mrp,
                                expiry_date: item.expiry_date,
                                batch_no: item.batch_no,

                                total_price: item.price * 1 - item.tax * item.price * 1,
                                tray_id: item.tray_no,
                                qty_type: item.qty_type,
                            };

                            //Populate 
                            var rows = page.controls.grdBill.getRow({
                                item_no: newitem.item_no
                            });


                            if (rows.length == 0) {
                                page.controls.grdBill.createRow(newitem);
                                page.controls.grdBill.edit(true);
                                rows = page.controls.grdBill.getRow({
                                    item_no: newitem.item_no
                                });
                                rows[0].find("[datafield=qty]").find("input").focus();
                            } else {
                                var txtQty = rows[0].find("[datafield=qty]").find("input");
                                //txtQty.val(parseInt(txtQty.val()) + 1);
                                txtQty.val(parseFloat(txtQty.val()) + 1);
                                txtQty.trigger('change');
                                txtQty.focus();
                            }
                            page.controls.txtItemSearch.customText("");
                            page.calculate();

                        });
                    }
                });
            }

        }

        page.printJasper = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no,
            }
            //page.stockAPI.getSalesBill(bill_no, function (data) {
            //    page.events.btnprintInvoiceJson_click(data, data.bill_items, exp_type);
            //});
            page.billService.getSalesPrint(billdata, function (data) {
                page.events.btnprintInvoiceJson_click(data,data, exp_type);
            });
        }


        page.events.btnprintInvoiceJson_click = function (bill,billItem, exp_type) {
            var template = CONTEXT.INVOICE_TEMPLATE;
            if (template == "Template1") {
                page.events.btnPrintInvoiceTemplateFirst(bill, billItem, exp_type);
            }
            else if (template == "Template2") {
                page.events.btnPrintInvoiceTemplateSecond(bill, billItem, exp_type);
            }
            else if (template == "Template3") {
                page.events.btnPrintInvoiceTemplateThird(bill, billItem, exp_type);
            }
            else if (template == "Template4") {
                page.events.btnPrintInvoiceTemplateFourth(bill, billItem, exp_type);
            }
            else if (template == "Template5") {
                page.events.btnPrintInvoiceTemplateFifth(bill, billItem, exp_type);
            }
            else if (template == "Template6") {
                page.events.btnPrintInvoiceTemplateSixth(bill, billItem, exp_type);
            }
            else if (template == "Template7") {
                page.events.btnPrintInvoiceTemplateSeventh(bill, billItem, exp_type);
            }
            else if (template == "Template8") {
                page.events.btnPrintInvoiceTemplateEight(bill, billItem, exp_type);
            }
            else if (template == "Template9") {
                page.events.btnPrintInvoiceTemplateNine(bill, billItem, exp_type);
            }
            else if (template == "Template10") {
                page.events.btnPrintInvoiceTemplateTenth(bill, billItem, exp_type);
            }
            else if (template == "Template11") {
                page.events.btnPrintInvoiceTemplateEleven(bill, billItem, exp_type);
            }
        }
        page.events.btnPrintInvoiceTemplateFirst = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit,//item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                var full_address = data.address.split("-");
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(data.total).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                if (data.bill_type == "SalesCredit") {
                    accountInfo.BillName = "Credit BILL";
                    accountInfo.TaxAmount = parseFloat(parseFloat(data.sub_total) - parseFloat(data.tot_discount)).toFixed(2);
                    PrintService.PrintFile("sales-bill-print/main-credit-invoice.jrxml", accountInfo);
                }
                else if (data.bill_type == "SalesDebit") {
                    accountInfo.BillName = "Debit BILL";
                    PrintService.PrintFile("sales-bill-print/main-credit-invoice.jrxml", accountInfo);
                }
                else {
                    PrintService.PrintFile("sales-bill-print/main-sales-bill-short-new4.jrxml", accountInfo);
                }
            });
        }

        page.events.btnPrintInvoiceTemplateSecond = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address.split("-");
                //var add_len = full_address.length;
                //var half_add_len = add_len / 2;
                //var first_address="";
                //var sec_address="";
                //for (var ip = 0; ip < add_len; ip++) {
                //    if (half_add_len >= ip)
                //        first_address = first_address + "" + full_address[ip];
                //    else
                //        sec_address = sec_address + "" + full_address[ip];
                //}
                var accountInfo =
                {
                    "BillType": "INVOICE",
                    "PayMode": data.pay_mode,
                    "CustomerName": data.cust_name,	// standard double-quoted field name
                    "Phone": data.phone_no,
                    "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                    "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                    "DLNo": data.license_no,
                    "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                    "GST": data.gst_no,
                    "TIN": data.tin_no,
                    "Area": data.area,//data.sales_exe_area,
                    "SalesExecutiveName": data.sales_exe_name,
                    "VehicleNo": data.vehicle_no,
                    "BillNo": data.bill_no,
                    //"BillNo": data.bill_id,
                    "BillDate": data.bill_date,
                    "NoofItems": data.no_of_items,
                    "Quantity": data.no_of_qty,
                    "Abdeen": "Abdeen:",
                    "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                    "Off": pending_balance,
                    "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                    //"+9199444 10350",
                    "ApplsName": CONTEXT.COMPANY_NAME,
                    "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                    "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                    "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                    "Home": "LL:",
                    "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                    "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                    "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                    "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                    "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                    "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                    "BillAmount": parseFloat(data.total).toFixed(2),
                    "ApplicaName": CONTEXT.COMPANY_NAME,
                    "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                    "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                    "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                    "CompanyName2": "",//"Dealer : Steel & Pipes",
                    "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                    "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                    "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                    "Cell": "Cell : ",
                    "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                    "Home": "Phone : ",
                    "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                    //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                    //"CompanyCityStreetPincode": "",
                    "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                    "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                    "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                    "CompanyGST": CONTEXT.COMPANY_GST_NO,
                    //"33CCKPS9949CIZ4",
                    "SSSS": "DUPLICATE",
                    "ShipAmt": data.expense_amt,
                    "Original": "Duplicate",
                    "RoundAmount": parseFloat(data.round_off).toFixed(2),
                    "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                    "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                    "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                    "Bill_Advance_End_Date": data.adv_end_date,
                    "Bill_Advance_End_Days": data.adv_end_days,
                    "Balance": pending_balance,
                    "BillItem": bill_item
                };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                accountInfo.Original = "Original";
                PrintService.PrintFile("sales-bill-print/main_sales_sun_solutions2.jrxml", accountInfo);
            });
        }

        page.events.btnPrintInvoiceTemplateThird = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;
            data.cust_no = (typeof data.cust_no == "undefined") ? 0 : data.cust_no;
            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                var full_address = data.address.split("-");
                var accountInfo =
                    {
                        "BillType": "INVOICE",
                        "PayMode": data.pay_mode,
                        "CustomerName": data.cust_name,	// standard double-quoted field name
                        "Phone": data.phone_no,
                        "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                        "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                        "DLNo": data.license_no,
                        "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                        "GST": data.gst_no,
                        "TIN": data.tin_no,
                        "Area": data.area,//data.sales_exe_area,
                        "SalesExecutiveName": data.sales_exe_name,
                        "VehicleNo": data.vehicle_no,
                        "BillNo": data.bill_no,
                        //"BillNo": data.bill_id,
                        "BillDate": data.bill_date,
                        "NoofItems": data.no_of_items,
                        "Quantity": data.no_of_qty,
                        "Abdeen": "Abdeen:",
                        "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                        "Off": pending_balance,
                        "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                        //"+9199444 10350",
                        "ApplsName": CONTEXT.COMPANY_NAME,
                        "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                        "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                        "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                        "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                        "Home": "LL:",
                        "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                        "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                        "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                        "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                        "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                        "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                        "BillAmount": parseFloat(data.total).toFixed(2),
                        "ApplicaName": CONTEXT.COMPANY_NAME,
                        "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                        "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                        "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                        "CompanyName2": "",//"Dealer : Steel & Pipes",
                        "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                        "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                        "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                        "Cell": "Cell : ",
                        "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                        "Home": "Phone : ",
                        "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                        //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                        //"CompanyCityStreetPincode": "",
                        "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                        "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                        "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                        "CompanyGST": CONTEXT.COMPANY_GST_NO,
                        //"33CCKPS9949CIZ4",
                        "SSSS": "DUPLICATE",
                        "ShipAmt": data.expense_amt,
                        "Original": "Duplicate",
                        "RoundAmount": parseFloat(data.round_off).toFixed(2),
                        "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                        "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                        "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                        "Bill_Advance_End_Date": data.adv_end_date,
                        "Bill_Advance_End_Days": data.adv_end_days,
                        "Balance": pending_balance,
                        "BillItem": bill_item
                    };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main-sales-medical-bill-short1.jrxml", accountInfo);
            });
        }

        page.events.btnPrintInvoiceTemplateFourth = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address.split("-");
                //var add_len = full_address.length;
                //var half_add_len = add_len / 2;
                //var first_address="";
                //var sec_address="";
                //for (var ip = 0; ip < add_len; ip++) {
                //    if (half_add_len >= ip)
                //        first_address = first_address + "" + full_address[ip];
                //    else
                //        sec_address = sec_address + "" + full_address[ip];
                //}
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(data.total).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main-sales-bill-short-new4.jrxml", accountInfo);
            });
        }

        page.events.btnPrintInvoiceTemplateFifth = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;
            data.cust_no = (typeof data.cust_no == "undefined") ? 0 : data.cust_no;
            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address.split("-");
                //var add_len = full_address.length;
                //var half_add_len = add_len / 2;
                //var first_address="";
                //var sec_address="";
                //for (var ip = 0; ip < add_len; ip++) {
                //    if (half_add_len >= ip)
                //        first_address = first_address + "" + full_address[ip];
                //    else
                //        sec_address = sec_address + "" + full_address[ip];
                //}
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(data.total).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main_sales_sun_solutions3.jrxml", accountInfo);
            });
        }
        page.events.btnPrintInvoiceTemplateSixth = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address.split("-");
                //var add_len = full_address.length;
                //var half_add_len = add_len / 2;
                //var first_address="";
                //var sec_address="";
                //for (var ip = 0; ip < add_len; ip++) {
                //    if (half_add_len >= ip)
                //        first_address = first_address + "" + full_address[ip];
                //    else
                //        sec_address = sec_address + "" + full_address[ip];
                //}
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(data.total).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main_sales_jebaraj.jrxml", accountInfo);
            });
        }
        page.events.btnPrintInvoiceTemplateSeventh = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address.split("-");
                //var add_len = full_address.length;
                //var half_add_len = add_len / 2;
                //var first_address="";
                //var sec_address="";
                //for (var ip = 0; ip < add_len; ip++) {
                //    if (half_add_len >= ip)
                //        first_address = first_address + "" + full_address[ip];
                //    else
                //        sec_address = sec_address + "" + full_address[ip];
                //}
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(data.total).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main-sales-raja-ram.jrxml", accountInfo);
            });
        }
        page.events.btnPrintInvoiceTemplateEight = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            page.billService.getBillByNo(data.bill_no, function (pending) {

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        //"Qty_unit": item.qty_unit,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        //"Unit": parseFloat(item.mrp).toFixed(5),
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address.split("-");
                //var add_len = full_address.length;
                //var half_add_len = add_len / 2;
                //var first_address="";
                //var sec_address="";
                //for (var ip = 0; ip < add_len; ip++) {
                //    if (half_add_len >= ip)
                //        first_address = first_address + "" + full_address[ip];
                //    else
                //        sec_address = sec_address + "" + full_address[ip];
                //}
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": "",
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_discount).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(data.total).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Paid": pending[0].paid,
                                "Balance": pending[0].balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main-sales-bill-sr-steel.jrxml", accountInfo);
            });
        }
        page.events.btnPrintInvoiceTemplateNine = function (bill, billItem, exp_type) {
            var data = bill[0];
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;
            var tot_discount = 0;

            page.billService.getBillByNo(data.bill_no, function (pending) {

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
					tot_discount = parseFloat(tot_discount) + parseFloat(item.discount);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                var full_address = data.address1.split("-");

                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": "",
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(data.tot_bill_disc).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(parseFloat(data.total) - parseFloat(data.bill_discount)).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Paid": pending[0].paid,
                                "Balance": pending[0].balance,
                                "gst0": data.gst0,
                                "gst5": data.gst5,
                                "gst12": data.gst12,
                                "gst18": data.gst18,
                                "gst28": data.gst28,
                                "BillItem": bill_item
                            };
                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main-sales-template9.jrxml", accountInfo);
            });
        }
        page.events.btnPrintInvoiceTemplateTenth = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": parseInt(item.tax_per) / 2 + "%",//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "SGST": parseInt(item.tax_per) / 2 + "%",//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                var full_address = data.address.split("-");
                var tot_amt = parseFloat(data.total) - parseFloat(data.bill_discount);
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(parseFloat(data.tot_discount) + parseFloat(data.bill_discount)).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(tot_amt).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(tot_amt)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main_sales_jsaper10.jrxml", accountInfo);
            });
        }
        page.events.btnPrintInvoiceTemplateEleven = function (bill, billItem, exp_type) {
            var data = bill;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;

            var repInput = {
                viewMode: "Standard",
                fromDate: "",
                toDate: "",
                cust_no: data.cust_no,
                item_no: "",
                bill_type: ""
            }
            page.dynaReportService.getSalesReport(repInput, function (pending) {
                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                $(pending).each(function (i, item) {
                    if (item.bill_type == "Sale") {
                        salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                        salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                    }
                    else {
                        salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                        salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                    }
                });
                var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                $(billItem).each(function (i, item) {
                    tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                    s_no = s_no + 1;
                    (item.unit_identity == "0") ? item.alter_unit_fact = 1 : item.alter_unit_fact = item.alter_unit_fact;
                    (item.unit_identity == "1") ? item.qty = (parseFloat(item.qty) / parseFloat(item.alter_unit_fact)) : item.qty = (parseFloat(item.qty));
                    if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                        var monthex;
                        var yearex
                        if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                            monthex = item.expiry_date.substring(3, 5);
                            yearex = item.expiry_date.substring(6, 10);
                            item.expiry_date = monthex + "-" + yearex;
                        }
                    }
                    bill_item.push({
                        "BillItemNo": s_no,
                        "ProductName": item.item_name,	// nonstandard unquoted field name
                        "Pack": item.packing,	// nonstandard single-quoted field name
                        "Batch": item.batch_no,	// standard double-quoted field name
                        "Exp": item.expiry_date,
                        "Qty": item.qty,
                        "Per": item.unit_per,
                        "Qty_unit": parseFloat(item.qty) * parseFloat(item.alter_unit_fact) + "" + item.unit_per,
                        "Hsn": item.hsn_code,
                        "FreeQty": item.free_qty,
                        "Rate": parseFloat(item.price).toFixed(2),
                        "PDis": parseFloat(item.discount).toFixed(2),
                        "MRP": parseFloat(item.mrp).toFixed(2),
                        "CGST": parseInt(item.tax_per) / 2 + "%",//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "SGST": parseInt(item.tax_per) / 2 + "%",//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2),
                        "start_date": item.start_date,
                        "end_date": item.end_date
                    });
                });
                var full_address = data.address.split("-");
                var tot_amt = parseFloat(data.total) - parseFloat(data.bill_discount);
                var accountInfo =
                            {
                                "BillType": "INVOICE",
                                "PayMode": data.pay_mode,
                                "CustomerName": data.cust_name,	// standard double-quoted field name
                                "Phone": data.phone_no,
                                "CustAddress": (data.cust_no == "0") ? "" : full_address[0] + "" + full_address[1] + "" + full_address[2],//first_address,//data.address1,
                                "CustCityStreetZipCode": (data.cust_no == "0") ? "" : full_address[3] + "" + full_address[4],//sec_address,//data.address2,
                                "DLNo": data.license_no,
                                "isSalesExe": CONTEXT.ENABLE_SALES_EXECUTIVE,
                                "GST": data.gst_no,
                                "TIN": data.tin_no,
                                "Area": data.area,//data.sales_exe_area,
                                "SalesExecutiveName": data.sales_exe_name,
                                "VehicleNo": data.vehicle_no,
                                "BillNo": data.bill_no,
                                //"BillNo": data.bill_id,
                                "BillDate": data.bill_date,
                                "NoofItems": data.no_of_items,
                                "Quantity": data.no_of_qty,
                                "Abdeen": "Abdeen:",
                                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                                "Off": pending_balance,
                                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                                //"+9199444 10350",
                                "ApplsName": CONTEXT.COMPANY_NAME,
                                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                                "Home": "LL:",
                                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                                "BSubTotal": parseFloat(data.sub_total).toFixed(2),
                                "DiscountAmount": parseFloat(parseFloat(data.tot_discount) + parseFloat(data.bill_discount)).toFixed(2),
                                "BCGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "BSGST": parseFloat(data.tot_gst_tax).toFixed(2),
                                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(2),
                                "BillAmount": parseFloat(tot_amt).toFixed(2),
                                "ApplicaName": CONTEXT.COMPANY_NAME,
                                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                                "CompanyName1": CONTEXT.COMPANY_NAME, //"New",
                                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                                "CompanyName2": "",//"Dealer : Steel & Pipes",
                                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                                "BillAmountWordings": inWords(parseInt(tot_amt)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                                "Cell": "Cell : ",
                                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                                "Home": "Phone : ",
                                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                                //"CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                //"CompanyCityStreetPincode": "",
                                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                                //"33CCKPS9949CIZ4",
                                "SSSS": "DUPLICATE",
                                "ShipAmt": data.expense_amt,
                                "Original": "Duplicate",
                                "RoundAmount": parseFloat(data.round_off).toFixed(2),
                                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                                "Bill_Advance_End_Date": data.adv_end_date,
                                "Bill_Advance_End_Days": data.adv_end_days,
                                "Balance": pending_balance,
                                "BillItem": bill_item
                            };

                if (page.PrintBillType == "Return") {
                    accountInfo.BillName = "ORIGINAL RETURN BILL";
                    accountInfo.BillAmount = parseFloat(accountInfo.BillAmount) + parseFloat(accountInfo.ShipAmt);
                    accountInfo.BillAmountWordings = inWords(parseInt(accountInfo.BillAmount));
                }
                else {
                    accountInfo.BillName = "ORIGINAL BILL";
                }
                PrintService.PrintFile("sales-bill-print/main-sales-template11.jrxml", accountInfo);
            });
        }

        //var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        //var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        //function inWords(num) {
        //    if ((num = num.toString()).length > 9) return 'overflow';
        //    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        //    if (!n) return; var str = '';
        //    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
        //    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
        //    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
        //    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
        //    str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Only ' : '';
        //    return str + " Only";
        //}
        function no_of_days(today, date) {
            var one_day = 1000 * 60 * 60 * 24;
            var date1_ms = new Date(dbDate(today)).getTime();
            var date2_ms = new Date(dbDate(date)).getTime();
            var difference_ms = date2_ms - date1_ms;
            return Math.round(difference_ms / one_day);
        }
        function TakeLatest(data) {
            var result = [];
            for (var i = 0; i < data.length - 1; i++) {
                if (i == 0) {
                    result.push(data[i]);
                }
                if (data[i].item_no != data[i + 1].item_no) {
                    result.push(data[i+1]);
                }
            }
            return result;
        }
        page.events.btnSavePrint_click = function () {
            page.events.btnSave_click("true");
        }
        page.events.btnSave_click = function (print) {
            if (typeof print == "undefined")
                print = "false";
            $$("btnSave").hide();
            $$("btnPayment").disable(true);
            $$("btnPayment").hide();
            try {
                page.check_item_qty(function (result) {
                    if (result) {
                        page.insertBill("SaleSaved", "Cash", function (currentBillNo) {
                            if ($$("chkPrintBill").prop("checked")) {
                                if (CONTEXT.ENABLE_JASPER) {
                                    page.printJasper(currentBillNo, "PDF");
                                }
                            }
                            //if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                            //    page.addpoints(currentBillNo);
                            //}
                            //if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                            //    page.addTray(currentBillNo);
                            //}
                            //if (CONTEXT.ENABLE_EMAIL == "true") {
                            //    page.events.btnSendMail_click();
                            //}
                            //if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                            //    page.events.btnSendSMS_click();
                            //}
                            //if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                            //    page.addSalesExecutivePoints(currentBillNo);
                            //}
                            page.interface.closeBill();
                            page.interface.launchNewBill();
                            page.currentBillNo = null;
                        });
                    }
                    else {
                        $$("btnPayment").disable(false);
                        $$("btnPayment").show();
                        $$("btnSave").show();
                    }
                });
            } catch (e) {
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnSave").show();
                $$("btnPayment").disable(false);
                $$("btnPayment").show();
            }
        }

        page.events.btnReturn_click = function () {
            var selItem = $$("grdReturnItemSelection").selectedData()[0];
            if (selItem == undefined) {
                //alert("No items to be selected");
                ShowDialogBox('Warning', 'No items selected...!', 'Ok', '', null);
            }
            else {
                var currentBillNo = page.currentBillNo;
                page.billService.getSOByBillNo(currentBillNo, function (data) {
                    page.currentData = data[0];

                    if (page.currentData == null) {
                        //Create a Saved Bill
                        page.saveBill("Return", function (currentBillNo) {
                            //Load all sales
                            page.interface.closeBill();
                            page.interface.launchNewBill();

                        });
                    } else {
                        page.msgPanel.show("Bill cant be returned from POS since it is associated with sales order number" + data[0].order_id + "");
                    }
                });
            }
        }

        page.events.btnAddCustomer_click = function () {
            page.controls.pnlNewCustomer.open();
            page.controls.pnlNewCustomer.title("New Customer");
            page.controls.pnlNewCustomer.rlabel("New Customer");
            page.controls.pnlNewCustomer.width(550);
            page.controls.pnlNewCustomer.height(630);

            page.controls.ucCustomerEdit.select({});

        }
        page.events.btnSaveCustomer_click = function () {
            page.controls.ucCustomerEdit.save(function (data) {
                page.controls.txtCustomerName.customText(data.cust_name);
                page.controls.hdnCustomerNo.val(data.cust_no);
                page.controls.lblPhoneNo.value(data.phone_no);
                page.controls.lblAddress.value(data.address);
                page.controls.lblEmailId.value(data.email);
                page.controls.lblGst.value(data.gst_no);
                page.controls.pnlNewCustomer.close();
                $$("txtItemSearch").selectedObject.focus();
            });
        }
        page.events.btnSaveCustomerTemp_click = function () {
            page.controls.ucCustomerEdit.returnCustomer(function (data) {
                page.controls.txtCustomerName.customText(data.cust_name);
                page.controls.hdnCustomerNo.val(data.cust_no);
                page.controls.lblPhoneNo.value(data.phone_no);
                page.controls.lblAddress.value(data.address);
                page.controls.lblEmailId.value(data.email);
                page.controls.lblGst.value(data.gst_no);
                page.controls.pnlNewCustomer.close();
                $$("txtItemSearch").selectedObject.focus();
            });
        }
        page.events.btnCustomerMoreDetails_click = function () {
            page.controls.pnlCustomerDetails.open();
            page.controls.pnlCustomerDetails.title("Customer Details");
            page.controls.pnlCustomerDetails.rlabel("Customer Details");
            page.controls.pnlCustomerDetails.width(550);
            page.controls.pnlCustomerDetails.height(350);
        }

        page.events.btnBillMoreDetails_click = function () {
            page.controls.pnlBillMoreDetails.open();
            page.controls.pnlBillMoreDetails.title("More Options");
            page.controls.pnlBillMoreDetails.rlabel("More Options");
            page.controls.pnlBillMoreDetails.width(400);
            page.controls.pnlBillMoreDetails.height(500);
            if (CONTEXT.ENABLE_CUST_GST) {
                $$("pnlCGSTTax").show();
                $$("pnlSGSTTax").show();
                $$("pnlIGSTTax").show();
            }
            else {
                $$("pnlCGSTTax").hide();
                $$("pnlSGSTTax").hide();
                $$("pnlIGSTTax").hide();
            }
            if (CONTEXT.ENABLE_ADDITIONAL_TAX) {
                $$("pnlCessTax").show();
                $$("pnlCessRateTax").show();
            }
            else {
                $$("pnlCessTax").hide();
                $$("pnlCessRateTax").hide();
            }
        }

        page.events.btnManualDiscountCancel_click = function () {
            page.controls.pnlManualDiscountPopUp.close();
        }
        page.events.btnManualDiscountOK_click = function () {
            //var data = page.controls.ddlItemDiscount.selectedData();
            var data = page.discountData;
            if (page.manualDiscountbillLevel == false) {
                page.selectedBill.discounts.push({
                    disc_no: data.disc_no,
                    disc_type: data.disc_type,
                    disc_name: data.disc_name,
                    disc_level: data.disc_level,
                    disc_value: $$("txtManualDiscount").val(),
                    item_no: page.discount_item_no,
                    variation_name: page.discount_item_variation_name
                });
            }
            else {
                page.selectedBill.discounts.push({
                    disc_no: data.disc_no,
                    disc_type: data.disc_type,
                    disc_name: data.disc_name,
                    disc_level: data.disc_level,
                    disc_value: $$("txtManualDiscount").val()
                });
            }
            page.calculate();
            //alert("Discount successfully applied");
            //ShowDialogBox('Message', 'Discount successfully applied...!', 'Ok', '', null);
            page.controls.pnlManualDiscountPopUp.close();
            page.controls.pnlDiscountPopup.close();
            $$("btnPayment").selectedObject.focus();
        }
        
        page.events.btnItemDiscountOK_click = function () {

            var data = page.controls.ddlItemDiscount.selectedData();
            if (typeof data != "undefined" && data != null) {
                if (data.disc_name != null && (data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    page.manualDiscountbillLevel = false;
                    page.controls.pnlManualDiscountPopUp.open();
                    page.controls.pnlManualDiscountPopUp.title("Manual Discount");
                    page.controls.pnlManualDiscountPopUp.rlabel("Manual Discount");
                    //data.variation_name = page.discount_item_variation_name;
                    page.discountData = data;
                    //confirmManualDisc().then(function (answer) {
                    //    if (answer == "Ok") {
                    //        page.selectedBill.discounts.push({
                    //            disc_no: data.disc_no,
                    //            disc_type: data.disc_type,
                    //            disc_name: data.disc_name,
                    //            disc_level: data.disc_level,
                    //            disc_value: page.manualDiscountValue,
                    //            item_no: page.discount_item_no
                    //        });
                    //        page.calculate();
                    //        alert("Discount successfully applied");
                    //    }
                    //});
                }
                else {

                    page.selectedBill.discounts.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_level: data.disc_level,
                        disc_value: data.disc_value,
                        item_no: page.discount_item_no,
                        variation_name: page.discount_item_variation_name
                    });
                    page.calculate();
                    //alert("Discount successfully applied");
                    ShowDialogBox('Message', 'Discount successfully applied...!', 'Ok', '', null);

                }
            }
            /*  var arr = jQuery.grep(page.selectedBill.discounts, function (n, i) {
                  return (n.disc_no == 7 && n.item_no == page.discount_item_no);
              });
  
              if (arr.length > 0) {
                  arr[0].disc_value = page.controls.txtItemDiscountValue.val();
              } else {
                  page.selectedBill.discounts.push({
                      disc_no: $$("ddlItemDiscount").selectedValue(),
                      disc_type: "Fixed",
                      disc_name: "Manual Discount by User",
                      disc_value: page.controls.txtItemDiscountValue.val(),
                      item_no: page.discount_item_no
                  });
              }
  
  
              page.calculate();
              page.controls.txtItemDiscountValue.val("");
              page.controls.pnlItemDiscountPopup.close();*/
        }

        page.events.btnDiscountOK_click = function () {
            var data = page.controls.ddlDiscount.selectedData();
            if (typeof data != "undefined") {
                if (data.disc_name != null && (data.disc_name == "Manual Discount of x percent" || data.disc_name == "Manual Discount of x value" || data.disc_name == "Manual discount of x percent in item price" || data.disc_name == "Manual discount of x value in item price")) {
                    page.manualDiscountbillLevel = true;
                    page.controls.pnlManualDiscountPopUp.open();
                    page.controls.pnlManualDiscountPopUp.title("Manual Discount");
                    page.controls.pnlManualDiscountPopUp.rlabel("Manual Discount");
                    page.discountData = data;
                    //confirmManualDisc().then(function (answer) {
                    //    if (answer == "Ok") {
                    //        page.selectedBill.discounts.push({
                    //            disc_no: data.disc_no,
                    //            disc_type: data.disc_type,
                    //            disc_name: data.disc_name,
                    //            disc_level: data.disc_level,
                    //            disc_value: page.manualDiscountValue
                    //        });
                    //        page.calculate();
                    //    }
                    //});

                }
                else {

                    page.selectedBill.discounts.push({
                        disc_no: data.disc_no,
                        disc_type: data.disc_type,
                        disc_name: data.disc_name,
                        disc_level: data.disc_level,
                        disc_value: data.disc_value
                    });
                    page.calculate();

                }
            }
        }
        page.events.btnDiscountRemove_click = function () {
            var data = $$("grdDiscount").selectedData();
            if (data.length > 0) {
                for (var i = page.selectedBill.discounts.length - 1; i >= 0; i--) {
                    if (page.selectedBill.discounts[i].disc_no == data[0].disc_no && page.selectedBill.discounts[i].item_no == data[0].item_no) {
                        page.selectedBill.discounts.splice(i, 1);
                    }
                }
                page.calculate();
            }

        }
        page.events.btnItemDiscountRemove_click = function () {
            var data = $$("grdItemDiscount").selectedData();
            if (data.length > 0) {
                for (var i = page.selectedBill.discounts.length - 1; i >= 0; i--) {
                    if (page.selectedBill.discounts[i].disc_no == data[0].disc_no && page.selectedBill.discounts[i].item_no == data[0].item_no && page.selectedBill.discounts[i].variation_name == data[0].variation_name) {
                        page.selectedBill.discounts.splice(i, 1);
                    }
                }
                page.calculate();
            }

        }


        page.events.btnTaxOK_click = function () {
            if (page.controls.ddlSalesTax.selectedValue() == -1) {
                page.selectedBill.sales_tax_class = [];
                page.selectedBill.sales_tax_no = -1;
                page.calculate();
            } else {
                var data = page.controls.ddlSalesTax.selectedData();
                var tax_per, cgst, sgst, igst;
                page.selectedBill.sales_tax_no = data.sales_tax_no;
                page.salestaxclassAPI.searchValues("", "", "sales_tax_no=" + data.sales_tax_no, "", function (data) {
                    page.selectedBill.sales_tax_class = data;
                    if (page.creditBill || page.editBill) {
                        $(page.controls.grdBill.getAllRows()).each(function (i, row) {
                            $(page.selectedBill.sales_tax_class).each(function (i, tax_data) {
                                var billItem = page.controls.grdBill.getRowData(row);
                                if (billItem.item_current_tax == tax_data.tax_class_no) {
                                    billItem.tax_per = tax_data.tax_per;
                                    $(row).find("[datafield=tax_per]").find("div").html(tax_data.tax_per);
                                    billItem.tax_class_no = tax_data.tax_class_no;
                                    $(row).find("[datafield=tax_class_no]").find("div").html(tax_data.tax_class_no);
                                    billItem.cgst = tax_data.cgst;
                                    $(row).find("[datafield=cgst]").find("div").html(tax_data.cgst);
                                    billItem.sgst = tax_data.sgst;
                                    $(row).find("[datafield=sgst]").find("div").html(tax_data.sgst);
                                    billItem.igst = tax_data.igst;
                                    $(row).find("[datafield=igst]").find("div").html(tax_data.igst);
                                }
                            });
                        });
                    }
                    page.calculate();
                });
            }
            page.msgPanel.show("Tax added in current session...");
            page.controls.pnlTaxPopup.close();
            page.msgPanel.hide();

        }

        page.events.btnSendMail_click = function () {
            if (CONTEXT.ENABLE_EMAIL == "true") {
                try {
                    var sms_error_count = 0;
                    var bill = page.selectedBill;
                    if (page.controls.txtCustomerName.selectedValue() == null || page.controls.txtCustomerName.selectedValue() == "" || typeof page.controls.txtCustomerName.selectedValue() == "undefined") {
                        sms_error_count++;
                        throw "Customer Not Selected For Sending Email";
                    }
                    if (page.controls.hdnCustomerNo.val() == null || page.controls.hdnCustomerNo.val() == "" || typeof page.controls.hdnCustomerNo.val() == "undefined") {
                        sms_error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.lblEmailId.value() == "" || page.controls.lblEmailId.value() == null || page.controls.lblEmailId.value() == undefined) {
                        sms_error_count++;
                        throw "No email id is proviced for the customer";
                    } 
                    if (sms_error_count == 0) {
                        var itemLists = [];
                        //page.customerService.getTotalPoints(page.controls.txtCustomerName.selectedValue(), function (data, callback) {
                        page.customerAPI.getValue({ cust_no: page.controls.txtCustomerName.selectedValue() }, function (data, callback) {
                            $(bill.billItems).each(function (i, item) {
                                itemLists.push({ "itemNo": item.item_no + "", "itemName": item.item_name + "", "qty": item.qty + "", "unit": item.unit + "", "price": item.price + "", "discount": item.discount + "", "totalPrice": item.total_price + "", });
                            });

                            // page.billService.getCustomerBillsByAll(openBill.bill_no, function (itemList) {
                            //       $(itemList).each(function (i, item) {
                            var accountInfosp = {
                                // "billNo": page.controls.lblBillNo.value(),
                                //bill.bill_no,
                                // "billDate": page.controls.lblBillDate.value(),
                                //bill.bill_date,
                                //"2015-03-25T12:00:00Z",
                                "appName": CONTEXT.COMPANY_NAME,
                                "companyId": localStorage.getItem("user_company_id"),
                                "clientAddress": CONTEXT.COMPANY_ADDRESS,
                                "customerNumber": page.controls.txtCustomerName.selectedValue(),
                                "customerName": page.controls.txtCustomerName.selectedObject.val().split("_")[0],
                                "tax": page.controls.lblTax.value(),
                                "subTotal": page.controls.lblSubTotal.value(),
                                "discount": page.controls.lblDiscount.value(),
                                "totalPaid": page.controls.lblTotal.value(),
                                "totalRewardPoint": data[0].points,
                                "billType": page.controls.ddlPayType.selectedValue(),
                                //"2300",
                                "emailAddressList": [page.controls.lblEmailId.value()],
                                //["sam.info85@gmail.com"],
                                // [bill.email],
                                //["balumanoj85@gmail.com"],
                                //["sundaralingam48@gmail.com","wototech@outlook.com","balumanoj85@gmail.com"],

                                "billItemList": itemLists,
                            };
                            var accountInfoposJson = JSON.stringify(accountInfosp);

                            $.ajax({
                                type: "POST",
                                //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/pos-bill",
                                url: CONTEXT.SALES_EMAIL_URL,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfosp),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);
                                    $(".detail-info").progressBar("hide");
                                    page.msgPanel.show("Email Sent Successfully..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);
                                    $(".detail-info").progressBar("hide");
                                    page.msgPanel.show("Email Sent Failed..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
                                }
                            });

                        });
                    }
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            } else {
                //alert("Sorry!.. Your settings blocks email sending");
                ShowDialogBox('Warning', 'Sorry!.. Your settings blocks email sending...!', 'Ok', '', null);
            }
        }
        page.events.btnSendSMS_click = function () {
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                try {
                    var error_count = 0;
                    var bill = page.selectedBill;
                    if (page.controls.txtCustomerName.selectedValue() == null || page.controls.txtCustomerName.selectedValue() == "" || typeof page.controls.txtCustomerName.selectedValue()=="undefined") {
                        error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.hdnCustomerNo.val() == null || page.controls.hdnCustomerNo.val() == "" || typeof page.controls.hdnCustomerNo.val() == "undefined") {
                        error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.hdnCustomerNo.val() == null || page.controls.hdnCustomerNo.val() == "" || typeof page.controls.hdnCustomerNo.val() == "undefined") {
                        error_count++;
                        throw "Customer Not Selected For Sending SMS";
                    }
                    if (page.controls.lblPhoneNo.value() == "" || page.controls.lblPhoneNo.value() == null || typeof page.controls.lblPhoneNo.value() == "undefined")
                    {
                        error_count++;
                        throw "Customer mobile number not provided";
                    }
                    if(error_count==0){
                        //page.customerService.getTotalPoints(page.controls.txtCustomerName.selectedValue(), function (data, callback) {
                        page.customerAPI.getValue({ cust_no: page.controls.txtCustomerName.selectedValue() }, function (data, callback) {
                            var accountInfo =
                            {
                                "appName": CONTEXT.COMPANY_NAME,

                                "senderNumber": CONTEXT.SMS_SENDER_NO,
                                "companyId": CONTEXT.SMS_COMPANY_ID,
                                //"+917338898011",
                                //"919486342575",
                                //("txtSenderNumber").val(),
                                "message": //"Hai",
                                    "Dear " + page.controls.txtCustomerName.selectedObject.val().split("_")[0] + "," + "\n" +
                                    "Thankyou For Purchasing " +
                                    "Your Total Amount is Rs. " + page.controls.lblTotal.value() + "\n" +
                                    "Your Total Reward Points " + data[0].points + "\n" +
                                    "Regards as " + CONTEXT.COMPANY_NAME + "",
                                "receiverNumber": "+91" + page.controls.lblPhoneNo.value(),
                                // "+918098453314",
                                // $$("lblPOVendorPhone").html(),
                                //"919003300929",
                                //$$("txtReceiverNumber").val(),
                                //"mobileNumber":
                                //"9486342575",
                                //"7338898011",
                            };

                            var accountInfoJson = JSON.stringify(accountInfo);

                            $.ajax({
                                type: "POST",
                                //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                                url: CONTEXT.SMSURL,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfo),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);

                                    $$("msgPanel").flash("SMS Sent Successfully...");
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);

                                    $$("msgPanel").show("SMS Sent Failed...");
                                }
                            });
                        });
                    }
                    
                } catch (e) {
                    $$("msgPanel").flash(e);
                }
            } else {
                //alert("Sorry!.. your settings block sending messages");
                ShowDialogBox('Warning', 'Sorry!.. your settings block sending messages...!', 'Ok', '', null);
            }
        }


        page.events.btnReturnItemOK_click = function () {
            page.controls.grdBill.dataBind(page.controls.grdReturnItemSelection.selectedData());
        }

        page.view = {
            UIState: function (state) {
                $$("ddlAdvancePayType").disable(true);
                var bill_type = [];
                if (page.creditBill) {
                    bill_type.push({ mode_data: "SalesCredit", mode_type: "Sales Credit" });
                    bill_type.push({ mode_data: "SalesDebit", mode_type: "Sales Debit" });
                    $$("pnlCreditBillAmount").show();
                    $$("lblCreditAmount").value(page.creditBillAmount);
                }
                else {
                    bill_type.push({ mode_data: "Sale", mode_type: "Sale" });
                    bill_type.push({ mode_data: "SaleReturn", mode_type: "SaleReturn" });
                    $$("pnlCreditBillAmount").hide();
                    $$("lblCreditAmount").value(0);
                }
                page.controls.ddlBillType.dataBind(bill_type, "mode_data", "mode_type");
                if (page.creditBill) {
                    page.controls.ddlBillType.selectedValue("SalesCredit");
                }
                else {
                    page.controls.ddlBillType.selectedValue("Sale");
                }
                if (state == "NewBill") {
                    $$("btnReturn").hide();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();
                    $$("btnAddCustomer").show();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").show();
                    
                    $$("grdBill").edit(true);
                    $$("txtCustomerName").selectedObject.removeAttr('readonly');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("grdReturnBillPanel").hide();
                    $$("txtBillDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("txtBillDueDate").disable(false);
                    var today = new Date();
                    var newdate = new Date();
                    newdate.setDate(today.getDate() + parseInt(CONTEXT.DEFAULT_BILL_DUE_DAYS));
                    $$("txtBillDueDate").setDate(newdate);
                    $$("grdBillAdjustment").hide();
                    $$("pnlDiscount").show();
                    $$("pnlTax").show();
                    page.controls.txtItemSearch.selectedObject.focus();
                    $$("txtAdvanceAmount").disable(false);
                    $$("txtAdvEndDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
                    $$("txtTotDays").value("0");
                    $$("txtBillDiscount").disable(false);
                    (CONTEXT.ENABLE_CASHIER_BARCODE) ? $$("pnlCashierBarcode").show() : $$("pnlCashierBarcode").hide();
                    $$("txtDiscountPercentage").disable(false);
                    $$("txtDiscountValue").disable(false);
                }
                if (state == "Saved") {
                    $$("btnReturn").hide();
                    $$("pnlBillNo").show();
                    $$("btnSave").show();
                    //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").show() : $$("btnSavePrint").hide();
                    $$("btnPayment").disable(false);
                    $$("btnPayment").show();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").show();

                    $$("grdBill").edit(true);
                    $$("txtCustomerName").selectedObject.removeAttr('readonly');


                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("grdReturnBillPanel").hide();
                    // $$("btnSendEmail").show();
                    //$$("txtBillDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()))
                    $$("grdBillAdjustment").hide();
                    $$("pnlDiscount").show();
                    $$("pnlTax").show();
                    $$("txtAdvanceAmount").disable(false);
                    $$("txtBillDiscount").disable(false);
                    $$("txtBillDueDate").disable(false);
                    (CONTEXT.ENABLE_CASHIER_BARCODE) ? $$("pnlCashierBarcode").show() : $$("pnlCashierBarcode").hide();
                    $$("txtDiscountPercentage").disable(false);
                    $$("txtDiscountValue").disable(false);
                }
                if (state == "Sale") {
                    $$("btnReturn").hide();
                    $$("btnSave").hide();
                    //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").hide() : $$("btnSavePrint").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();
                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();

                    $$("grdBill").edit(false);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("grdReturnBillPanel").hide();
                    //TODO : show if return is there
                    // $$("btnSendEmail").show();
                    $$("txtBillDate").disable(true);
                    $$("grdBillAdjustment").hide();
                    $$("pnlDiscount").show();
                    $$("pnlTax").show();
                    $$("txtAdvanceAmount").disable(true);
                    $$("txtAdvEndDate").disable(true);
                    $$("txtBillDiscount").disable(true);
                    $$("txtBillDueDate").disable(true);
                    $$("pnlCashierBarcode").hide();
                    $$("txtDiscountPercentage").disable(true);
                    $$("txtDiscountValue").disable(true);
                }

                if (state == "Return") {
                    $$("btnReturn").hide();
                    $$("btnSave").hide();
                    //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").hide() : $$("btnSavePrint").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    $$("pnlItemSearch").hide();
                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();

                    $$("grdBill").edit(false);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").show();
                    $$("grdReturnItemSelection").hide();
                    $$("grdBillReturn").hide();
                    $$("grdReturnBillPanel").hide();
                    // $$("btnSendEmail").show();
                    $$("txtBillDate").disable(true);
                    $$("txtBillDueDate").disable(true);
                    $$("grdBillAdjustment").hide();
                    $$("pnlDiscount").hide();
                    $$("pnlTax").show();
                    $$("txtAdvanceAmount").disable(true);
                    $$("txtAdvEndDate").disable(true);
                    $$("txtBillDiscount").disable(true);
                    $$("pnlCashierBarcode").hide();
                    $$("txtDiscountPercentage").disable(true);
                    $$("txtDiscountValue").disable(true);
                }
                if (state == "NewReturn") {
                    $$("btnReturn").show();
                    $$("btnSave").hide();
                    //(CONTEXT.ENABLE_SECOND_BILL) ? $$("btnSavePrint").hide() : $$("btnSavePrint").hide();
                    $$("btnAddCustomer").hide();
                    $$("btnPayment").disable(true);
                    $$("btnPayment").hide();

                    $$("pnlBillNo").show();
                    $$("pnlBillDate").show();
                    $$("pnlItemSearch").hide();

                    $$("grdBill").edit(false);
                    $$("txtCustomerName").selectedObject.attr('readonly', 'true');

                    $$("grdBill").hide();
                    $$("grdReturnItemSelection").show();
                    $$("grdBillReturn").hide();
                    $$("grdReturnBillPanel").hide();
                    //$$("btnSendEmail").show();
                    $$("grdBillAdjustment").hide();
                    $$("pnlDiscount").hide();
                    $$("pnlTax").hide();
                    $$("txtAdvanceAmount").disable(true);
                    $$("pnlCashierBarcode").hide();
                    $$("txtDiscountPercentage").disable(true);
                    $$("txtDiscountValue").disable(true);
                }

                if (state == "New") {
                    page.controls.grdBillReturn.display("none");
                    page.controls.lblDiscountLabel.selectedObject.css("cursor", "pointer");
                    page.controls.lblTaxLabel.selectedObject.css("cursor", "pointer");
                    page.controls.lblDiscountLabel.selectedObject.hover(function () {
                        $(this).css("text-decoration", "underline");
                    }, function () {
                        $(this).css("text-decoration", "");
                    });
                    page.controls.lblTaxLabel.selectedObject.hover(function () {
                        $(this).css("text-decoration", "underline");
                    }, function () {
                        $(this).css("text-decoration", "");
                    });
                    page.controls.txtItemSearch.selectedObject.focus();
                    page.pingGrid("NewBill", []);

                    page.controls.grdBillReturn.width("1200px");
                    if (window.mobile) {
                        page.controls.grdBillReturn.height("auto");
                    }
                    else {
                        page.controls.grdBillReturn.height("100px");
                    }
                    page.controls.grdBillReturn.setTemplate({
                        selection: false,
                        columns: [
                            //{ 'name': "Bill No", 'width': "70px", 'dataField': "bill_no" },
                            { 'name': "Bill No", 'width': "70px", 'dataField': "bill_id" },
                            { 'name': "Bill Date", 'width': "120px", 'dataField': "bill_date" },
                            { 'name': "Cust Name", 'width': "240px", 'dataField': "cust_name" },
                            { 'name': "Total Amount", 'width': "145px", 'dataField': "total" },
                            { 'name': "State", 'width': "85px", 'dataField': "state_text" },

                        ]
                    });
                    page.controls.grdBillReturn.dataBind([]);

                    $$("txtAdvanceAmount").disable(false);
                    $$("pnlCashierBarcode").hide();
                }
            },
            //Show grid for Payment
            selectedPayment: function (data) {
                page.controls.grdAllPayment.width("100%");
                page.controls.grdAllPayment.height("200px");
                page.controls.grdAllPayment.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Pay Type", 'rlabel': 'Pay Type', 'width': "70px", 'dataField': "pay_type" },
                        { 'name': "Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "amount" },
                        { 'name': "Card Type", 'rlabel': 'Card Type', 'width': "100px", 'dataField': "card_type" },
                        { 'name': "Card No", 'rlabel': 'Card No', 'width': "120px", 'dataField': "card_no" },
                        { 'name': "Coupon No", 'rlabel': 'Coupon No', 'width': "85px", 'dataField': "coupon_no", visible: CONTEXT.ENABLE_COUPON_MODULE == "true", },
                        { 'name': "Points", 'rlabel': 'Points', 'width': "85px", 'dataField': "points", visible: CONTEXT.ENABLE_REWARD_MODULE == true, },
                        { 'name': "", 'width': "50px", 'dataField': "pay_type", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }

                    ]
                });
                //Handle Row Command
                page.controls.grdAllPayment.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    var amount = 0;
                    //To Handle removing an item from list.
                    if (action == "Delete") {
                        page.controls.grdAllPayment.deleteRow(rowId);
                        $(page.controls.grdAllPayment.allData()).each(function (j, data) {
                            amount = parseFloat(data.amount) + parseFloat(amount);
                        });
                        $$("lblBalance").value(parseFloat(page.controls.lblTotal.value()) - parseFloat(amount));
                    }
                }
                //Bind the data
                page.controls.grdAllPayment.dataBind(data);
            },

            selectedEMIPayment: function (data) {
                page.controls.grdAllEMI.width("1000px");
                page.controls.grdAllEMI.height("400px");
                page.controls.grdAllEMI.setTemplate({
                selection: false,
                columns: [
                    { 'name': "Sch Id", 'rlabel': 'Sch Id', 'width': "110px", 'dataField': "schedule_id" },
                    { 'name': "Date", 'rlabel': 'Date', 'width': "150px", 'dataField': "schedule_date" },
                    { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "150px", 'dataField': "due_date" },
                    { 'name': "Due Amount", 'rlabel': 'Due Amount', 'width': "150px", 'dataField': "amount" },

                    ]
                });
                //Bind the data
                page.controls.grdAllEMI.dataBind(data);
        }
        }
        //QR Code Scan
        page.events.btnQrScan_click = function () {
            page.controls.pnlQrScan.open();
            page.controls.pnlQrScan.title("QR Scanning Screen");
            page.controls.pnlQrScan.rlabel("QR Code");
            page.controls.pnlQrScan.width(750);
            page.controls.pnlQrScan.height(550);
            let scanner = new Instascan.Scanner({ video: $(page.controls.preview.selectedObject)[0] });
            scanner.addListener('scan', function (content) {
                page.controls.pnlQrScan.close();
                page.controls.txtItemSearch.selectedText(content);
                scanner.stop();
            });
            Instascan.Camera.getCameras().then(function (cameras) {
                if (cameras.length > 0) {
                    scanner.start(cameras[0]);
                } else {
                    console.error('No cameras found.');
                }
            }).catch(function (e) {
                console.error(e);
            });
        }

        //Add New Item
        page.events.btnAddNewItem_click = function () {
            page.taxclassAPI.searchValues("", "", "", "", function (data) {
                page.controls.ddlNewTax.dataBind(data, "tax_class_no", "tax_class_name", "None");
                $$("ddlNewTax").selectedValue(1);
            });
            //$$("txtNewItemCode").value("");
            //$$("txtNewItemName").selectedObject.val("");
            //$$("itemNewUnit").selectedValue("-1");
            //$$("ddlNewTax").selectedValue("-1");
            page.controls.pnlNewItem.open();
            page.controls.pnlNewItem.title("New Item");
            page.controls.pnlNewItem.rlabel("New Item");
            page.controls.pnlNewItem.width(1200);
            page.controls.pnlNewItem.height(450);

            if (CONTEXT.showItemCode) {
                $$("pnltemCode").show();
            }
            else {
                $$("pnltemCode").hide();
            }
            
            $$("txtNewItemName").selectedObject.focus();
            $$("pnlNewVarSupplierNo").hide();
            $$("pnlNewVarBuyingCost").hide();
            $$("pnlNewVarMrp").hide();
            $$("pnlNewVarBatchNo").hide();
            $$("pnlNewVarManDate").hide();
            $$("pnlNewVarExpiryDate").hide();
            
            $$("chkItemVariationSupplierNo").change(function () {
                if ($$("chkItemVariationSupplierNo").prop("checked")) {
                    $$("pnlNewVarSupplierNo").show();
                } else {
                    $$("pnlNewVarSupplierNo").hide();
                }
            });
            $$("chkItemVariationBuyingCost").change(function () {
                if ($$("chkItemVariationBuyingCost").prop("checked")) {
                    $$("pnlNewVarBuyingCost").show();
                } else {
                    $$("pnlNewVarBuyingCost").hide();
                }
            });
            $$("chkItemVariationMRP").change(function () {
                if ($$("chkItemVariationMRP").prop("checked")) {
                    $$("pnlNewVarMrp").show();
                } else {
                    $$("pnlNewVarMrp").hide();
                }
            });
            $$("chkItemVariationBatchNo").change(function () {
                if ($$("chkItemVariationBatchNo").prop("checked")) {
                    $$("pnlNewVarBuyingCost").show();
                } else {
                    $$("pnlNewVarBuyingCost").hide();
                }
            });
            $$("chkItemVariationManDate").change(function () {
                if ($$("chkItemVariationManDate").prop("checked")) {
                    $$("pnlNewVarManDate").show();
                } else {
                    $$("pnlNewVarManDate").hide();
                }
            });
            $$("chkItemVariationExpiryDate").change(function () {
                if ($$("chkItemVariationExpiryDate").prop("checked")) {
                    $$("pnlNewVarExpiryDate").show();
                } else {
                    $$("pnlNewVarExpiryDate").hide();
                }
            });
            if (CONTEXT.ENABLE_ALTER_UNIT) {
                $$("pnlNewItemAlterUnit").show();
                $$("pnlNewItemAlterUnitFact").show();
            }
            else {
                $$("pnlNewItemAlterUnit").hide();
                $$("pnlNewItemAlterUnitFact").hide();
            }
            if (CONTEXT.SHOW_BARCODE) {
                $$("pnlNewItemBarcode").show();
            }
            else {
                $$("pnlNewItemBarcode").hide();
            }
            $$("txtNewItemStock").val(0);
            $$("txtNewItemName").value("");
            $$("txtNewBarcode").value("");
            $$("txtAlterUnit").value("");
            $$("txtAlterUnitFact").value("");
            $$("ddlNewTax").selectedValue("1");
            $$("itemNewUnit").selectedValue("Pcs");
            if (CONTEXT.ENABLE_TAX_INCLUSIVE) {
                $$("chkNewInclusive").prop("checked", true);
            }
            else {
                $$("chkNewInclusive").prop("checked", false);
            }
            $$("txtNewItemVariation").value("");
            $$("txtNewItemSupplierNo").value("");
            $$("txtNewItemBuyingCost").value("");
            $$("txtNewItemMrp").value("");
            $$("txtNewItemBatchNo").value("");
            $$("dsNewItemManDate").selectedObject.val("");
            $$("dsNewItemExpiryDate").selectedObject.val("");
            $$("txtNewItemSellingPrice").value("");
            $$("txtNewItemStockBuyingCost").value("");
            $$("txtNewItemStockMrp").value("");
            $$("txtNewItemStockBatchNo").value("");
            $$("txtNewItemStockSupplierNo").value("");
            $$("dsNewItemStockManDate").selectedObject.val("");
            $$("dsNewItemStockExpiryDate").selectedObject.val("");
            if (CONTEXT.ENABLE_VARIATION_VENDOR_NO) {
                $$("chkItemVariationSupplierNo").prop('checked', true);
                $$("pnlNewVarSupplierNo").show();
            }
            else {
                $$("chkItemVariationSupplierNo").prop('checked', false);
                $$("pnlNewVarSupplierNo").hide();
            }
            if (CONTEXT.ENABLE_VARIATION_MRP) {
                $$("chkItemVariationMRP").prop('checked', true);
                $$("pnlNewVarMrp").show();
            }
            else {
                $$("chkItemVariationMRP").prop('checked', false);
                $$("pnlNewVarMrp").hide();
            }
            if (CONTEXT.ENABLE_VARIATION_MAN_DATE) {
                $$("chkItemVariationManDate").prop('checked', true);
                $$("pnlNewVarManDate").show();
            }
            else {
                $$("chkItemVariationManDate").prop('checked', false);
                $$("pnlNewVarManDate").hide();
            }
            if (CONTEXT.ENABLE_VARIATION_EX_DATE) {
                $$("chkItemVariationExpiryDate").prop('checked', true);
                $$("pnlNewVarExpiryDate").show();
            }
            else {
                $$("chkItemVariationExpiryDate").prop('checked', false);
                $$("pnlNewVarExpiryDate").hide();
            }
            if (CONTEXT.ENABLE_VARIATION_BATCH_NO) {
                $$("chkItemVariationBatchNo").prop('checked', true);
                $$("pnlNewVarBuyingCost").show();
            }
            else {
                $$("chkItemVariationBatchNo").prop('checked', false);
                $$("pnlNewVarBuyingCost").hide();
            }
            if (CONTEXT.ENABLE_VARIATION_BUYING_COST) {
                $$("chkItemVariationBuyingCost").prop('checked', true);
                $$("pnlNewVarBuyingCost").show();
            }
            else {
                $$("chkItemVariationBuyingCost").prop('checked', false);
                $$("pnlNewVarBuyingCost").hide();
            }
            var typingTimer;                //timer identifier
            var doneTypingInterval = 250;
            var $inputAlterUnitFact = $("[controlid=txtAlterUnitFact]");
            $inputAlterUnitFact.on('focusout', function () {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { $$("txtNewItemVariation").focus() }, doneTypingInterval);
            });
        }
        page.events.btnShowStockMore_click = function () {
            $$("btnShowStockMore").hide();
            $$("btnShowStockLess").show();
            $$("pnlNewStockBuyCost").show();
            $$("pnlNewStockMrp").show();
            $$("pnlNewStockBatchNo").show();
            $$("pnlNewStockManDate").show();
            $$("pnlNewStockExpiryDate").show();
        }
        page.events.btnShowStockLess_click = function () {
            $$("btnShowStockMore").show();
            $$("btnShowStockLess").hide();
            $$("pnlNewStockBuyCost").hide();
            $$("pnlNewStockMrp").hide();
            $$("pnlNewStockBatchNo").hide();
            $$("pnlNewStockManDate").hide();
            $$("pnlNewStockExpiryDate").hide();
        }
        page.events.btnSaveNewItem_click = function () {
            try{
                if (page.controls.txtNewItemName.value() == "") {
                    $$("txtNewItemName").focus();
                    throw "Item Name Is Mantatory...";
                }
                var vari_check = true;
                if (($$("chkItemVariationSupplierNo").prop("checked")))
                    vari_check = false;
                if (($$("chkItemVariationBuyingCost").prop("checked")))
                    vari_check = false;
                if (($$("chkItemVariationMRP").prop("checked")))
                    vari_check = false;
                if (($$("chkItemVariationBatchNo").prop("checked")))
                    vari_check = false;
                if (($$("chkItemVariationManDate").prop("checked")))
                    vari_check = false;
                if (($$("chkItemVariationExpiryDate").prop("checked")))
                    vari_check = false;
                if (vari_check) {
                    throw "Please Choose The Variation List";
                }
                if (($$("chkItemVariationBuyingCost").prop("checked"))) {
                    if ($$("txtNewItemBuyingCost").value() == "" || $$("txtNewItemBuyingCost").value() == null || parseInt($$("txtNewItemBuyingCost").value()) <= 0 || isNaN($$("txtNewItemBuyingCost").value())) {
                        $$("txtNewItemBuyingCost").focus();
                        throw "Buying Cost Should Be A Number And Non Negative";
                    }
                }
                else {
                    if ($$("txtNewItemStockBuyingCost").value() == "" || $$("txtNewItemStockBuyingCost").value() == null || parseInt($$("txtNewItemStockBuyingCost").value()) <= 0 || isNaN($$("txtNewItemStockBuyingCost").value())) {
                        $$("txtNewItemStockBuyingCost").focus();
                        throw "Buying Cost Should Be A Number And Non Negative";
                    }
                }
                if (page.controls.txtNewItemStock.value() == "") {
                    $$("txtNewItemStock").focus();
                    throw "Item Stock Is Mantatory...";
                }
                var active;
                if ($$("chkNewInclusive").prop("checked"))
                    active = 1;
                else
                    active = 0;
                var item_data = {
                    item_name: page.controls.txtNewItemName.value(),
                    barcode: $$("txtNewBarcode").value(),
                    unit: $$("itemNewUnit").selectedValue(),
                    tax_class_no: $$("ddlNewTax").selectedValue(),
                    tax_inclusive: active,
                    alter_unit: $$("txtAlterUnit").value(),
                    alter_unit_fact: $$("txtAlterUnitFact").value(),
                    var_supp_no: ($$("chkItemVariationSupplierNo").prop("checked")) ? 1 : 0,
                    var_buying_cost: ($$("chkItemVariationBuyingCost").prop("checked")) ? 1 : 0,
                    var_mrp: ($$("chkItemVariationMRP").prop("checked")) ? 1 : 0,
                    var_batch_no: ($$("chkItemVariationBatchNo").prop("checked")) ? 1 : 0,
                    var_man_date: ($$("chkItemVariationManDate").prop("checked")) ? 1 : 0,
                    var_expiry_date: ($$("chkItemVariationExpiryDate").prop("checked")) ? 1 : 0,
                    pos_item: 1
                }
                page.itemAPI.postValue(item_data, function (data) {
                    var itemNo = data[0].key_value;
                    var variation_name = ($$("txtNewItemVariation").value() == "") ? data[0].key_value + "-" + localStorage.getItem("user_store_no") + "-0-0-0-0-0" : $$("txtNewItemVariation").value();
                    var inventItems = {
                        store_no: localStorage.getItem("user_store_no"),
                        item_no: itemNo,
                        variation_name: variation_name,
                        cost: $$("txtNewItemBuyingCost").value(),
                        vendor_no: $$("txtNewItemSupplierNo").value(),
                        mrp: $$("txtNewItemMrp").value(),
                        batch_no: $$("txtNewItemBatchNo").value(),
                        expiry_date: ($$("dsNewItemExpiryDate").getDate() == "") ? "" : dbDateTime($$("dsNewItemExpiryDate").getDate()),
                        man_date: ($$("dsNewItemManDate").getDate() == "") ? "" : dbDateTime($$("dsNewItemManDate").getDate()),
                        active: "1",
                        user_no: getCookie("user_id"),
                        rate: ($$("chkItemVariationBuyingCost").prop("checked")) ? $$("txtNewItemBuyingCost").value() : $$("txtNewItemStockBuyingCost").value(),
                        disc_per: 0,
                        disc_val: 0,
                    }
                    page.stockAPI.insertVariation(inventItems, function (data) {
                        var var_no = data[0].key_value;
                        var amount = 0;
                        if ($$("chkItemVariationBuyingCost").prop("checked")) {
                            amount = parseFloat($$("txtNewItemBuyingCost").value()) * parseFloat($$("txtNewItemStock").val());
                        }
                        else {
                            amount = parseFloat($$("txtNewItemStockBuyingCost").value()) * parseFloat($$("txtNewItemStock").val());
                        }
                        var man_date = "";
                        if ($$("chkItemVariationManDate").prop("checked")) {
                            man_date = ($$("dsNewItemManDate").getDate() == "") ? "" : dbDateTime($$("dsNewItemManDate").getDate());
                        }
                        else {
                            man_date = ($$("dsNewItemStockManDate").getDate() == "") ? "" : dbDateTime($$("dsNewItemStockManDate").getDate());
                        }
                        var expiry_date = "";
                        if ($$("chkItemVariationExpiryDate").prop("checked")) {
                            expiry_date = ($$("dsNewItemExpiryDate").getDate() == "") ? "" : dbDateTime($$("dsNewItemExpiryDate").getDate());
                        }
                        else {
                            expiry_date = ($$("dsNewItemStockExpiryDate").getDate() == "") ? "" : dbDateTime($$("dsNewItemStockExpiryDate").getDate());
                        }
                        var inventItem = {
                            var_no: var_no,
                            qty: $$("txtNewItemStock").val(),
                            trans_type: "Purchase",
                            user_id: getCookie("user_id"),
                            trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            key1: "-1",
                            key2: itemNo,
                            key3: "",
                            comments: "Manual Stock In POS",
                            //Stock Table Data
                            vendor_no: ($$("chkItemVariationSupplierNo").prop("checked")) ? $$("txtNewItemSupplierNo").value() : $$("txtNewItemStockSupplierNo").value(),
                            cost: ($$("chkItemVariationBuyingCost").prop("checked")) ? $$("txtNewItemBuyingCost").value() : $$("txtNewItemStockBuyingCost").value(),
                            mrp: ($$("chkItemVariationMRP").prop("checked")) ? $$("txtNewItemMrp").value() : $$("txtNewItemStockMrp").value(),
                            batch_no: ($$("chkItemVariationBatchNo").prop("checked")) ? $$("txtNewItemBatchNo").value() : $$("txtNewItemStockBatchNo").value(),
                            man_date: man_date,
                            expiry_date: expiry_date,
                            //FINFACTS ENTRY DATA
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            invent_type: "PurchaseCredit",
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            description: "PurchaseCredit",
                            amount: amount,
                        };
                        page.stockAPI.insertVariationStock(inventItem, function (data1) {
                            var date = new Date();
                            date.setDate(date.getDate() - 1);
                            var priceItem = {
                                var_no: var_no,
                                valid_from: dbDateTime($.datepicker.formatDate("dd-mm-yy", date)),
                                price: $$("txtNewItemSellingPrice").value(),
                                user_no: getCookie("user_id")
                            }
                            page.stockAPI.insertVariationPrice(priceItem, function (data) {
                                alert("New Item Created Successfully..");
                                page.controls.pnlNewItem.close();
                                //page.controls.txtItemSearch.selectedText(page.controls.txtNewItemName.value());
                                var filter = "ivt.item_no = " + itemNo;
                                page.salesItemAPI.searchValues("", "", filter, "", function (data) {
                                    page.selectItem(data[0]);
                                });
                            });
                        });
                    });
                });
            }
            catch (e) {
                alert(e);
            }
        }
        
        //Print Receipt Only For Template11
        page.printReceipt = function (data, billNo, callback) {
            //var template = CONTEXT.RECEIPT_TEMPLATE;
            var template = "Template16";
            if (template == "Template15") {
                var total_qty = 0;
                var left_space = 15;
                var billDetails = data;
                var billItems = data.bill_items;
                total_qty = billItems.length;
                var length = (billItems.length * 40) + parseInt(600);
                var printBox = {
                    PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                    Width: 280,
                    Height: length,
                    Copies:2,
                    Lines: []
                };
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                var currentDate = strTime;
                var custName = "";
                if (billDetails.cust_name == undefined || billDetails.cust_name == null || billDetails.cust_name == "") { }
                else {
                    custName = billDetails.cust_name.substring(0, 10);
                }
                var t1 = (CONTEXT.COMPANY_NAME).length;
                t1 = t1 * (280 / 36);
                t1 = 280 - t1;
                var com_start = Math.round(t1 / 2);
                t1 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                t1 = t1 * (280 / 36);
                t1 = 280 - t1;
                var add_start = Math.round(t1 / 2);
                t1 = ("Ph.No: " + CONTEXT.COMPANY_PHONE_NO).length;
                t1 = t1 * (280 / 36);
                t1 = 280 - t1;
                var phno_start = Math.round(t1 / 2);
                t1 = ("TIN.No: " + CONTEXT.CompanyTINNo).length;
                t1 = t1 * (280 / 36);
                t1 = 280 - t1;
                var tinno_start = Math.round(t1 / 2);

                var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";
                t1 = (bill_title).length;
                t1 = t1 * (280 / 36);
                t1 = 280 - t1;
                var cashbill_start = Math.round(t1 / 2);

                printBox.Lines.push({ StartX: com_start - 5, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 14, FontStyle: 1 });
                printBox.Lines.push({ StartX: add_start, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: 80, StartY: 40, Text: "Ph.No: " + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: cashbill_start, StartY: 60, Text: bill_title, FontFamily: "Agency FB", FontSize: 12, FontStyle: 1 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 80, Text: "BILL NO:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 68, StartY: 80, Text: billNo, FontFamily: "Agency FB", FontSize: 14, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 100, Text: "Cus Id:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 100, Text: billDetails.cust_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 120, Text: "DATE:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 120, Text: sysDate(billDetails.bill_date), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 120, Text: "TIME:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 120, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 130, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                //Header
                printBox.Lines.push({ StartX: left_space + 0, StartY: 150, Text: "SNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 30, StartY: 150, Text: "Product", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 10, StartY: 170, Text: "Rate", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 80, StartY: 170, Text: "Price", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 125, StartY: 170, Text: "Qty", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 190, StartY: 170, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 175, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                var offset = 195;
                var count = 1;
                var tot_qty = 0;
                var tot_sub_tot = 0;
                $(billItems).each(function (i, row) {
                    var kgm = "";
                    var temp_qty = row.qty;
                    var temp_price = row.price;
                    if (row.unit == "Kilogram") {
                        kgm = row.qty.substring(0, 5);
                    }
                    if (parseInt(row.free_qty) != 0) {
                        tot_qty = tot_qty + parseFloat(row.qty) + parseFloat(row.free_qty);
                        row.qty = row.qty + " + " + row.free_qty + " " + row.unit;
                    }
                    else {
                        tot_qty = tot_qty + parseFloat(row.qty);
                        row.qty = row.qty + " " + row.unit;
                    }
                    var itemName = row.item_name;
                    if (billDetails.state_text != "Return")
                        if (row.tax_inclusive == "1")
                            row.price = parseFloat(row.price) / parseFloat((parseFloat(row.tax_per) / 100) + 1);

                    (row.unit_identity == "0") ? row.unit = row.unit : row.unit = row.alter_unit;
                    (row.unit == "" || row.unit == null) ? row.unit = "" : row.unit = row.unit;
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: count, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 30, StartY: offset, Text: itemName, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 10, StartY: offset + 20, Text: (temp_price == null) ? 0 : parseFloat(temp_price).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: left_space + 80, StartY: offset + 20, Text: (row.price == null) ? 0 : parseFloat(row.price).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 125, StartY: offset + 20, Text: row.qty, FontFamily: "Agency FB", FontSize: 10, FontStyle: 0 });
                    printBox.Lines.push({ StartX: left_space + 190, StartY: offset + 20, Text: parseFloat(parseFloat(row.price) * parseFloat(temp_qty)).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                    count = count + 1;
                    offset = offset + 45;
                    //tot_sub_tot = parseFloat(tot_sub_tot) + parseFloat(parseFloat(row.price) * parseFloat(row.qty));
                });

                offset = offset;
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                offset = offset;
                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 20, Text: parseFloat(billDetails.sub_total).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                if (parseInt(billDetails.discount) != 0) {
                    printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 40, Text: parseFloat(billDetails.discount).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                }
                else {
                    offset = offset - 10;
                }
                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 60, Text: "GST:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 60, Text: parseFloat(billDetails.tax).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 65, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 80, Text: "TOTAL QTY:", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 80, Text: tot_qty, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 100, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 100, Text: parseFloat(billDetails.total).toFixed(2), FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 115, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 0 });

                printBox.Lines.push({ StartX: left_space + 40, StartY: offset + c5, BarcodeText: getBitByZero(billNo, 20), FontFamily: "Courier New", FontSize: 28, FontStyle: 1, TextHeight: 20, TextWidth: 110 });

                printBox.Lines.push({ StartX: left_space + 30, StartY: offset + 165, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space, StartY: offset + 185, Text: "குறிப்புகள்", FontFamily: "Agency FB", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space, StartY: offset + 200, Text: "1. பொருட்களை 3 நாட்களுக்குள் மாற்றிக் கொள்ளலாம்", FontFamily: "Agency FB", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space, StartY: offset + 215, Text: "2. ரசீது இன்றி மாற்ற இயலாது", FontFamily: "Agency FB", FontSize: 6, FontStyle: 1 });

                //printBox.Lines.push({ StartX: left_space + 35, StartY: offset + 255, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                //PrintService.PrintReceiptCallback(printBox, function (data) {
                    PrintService.PrintReceipt(printBox);
                    callback(billNo);
                //});
            }
            else if (template == "Template16") {
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                var currentDate = strTime;
                var billData = [];
                var tot_qty = 0;
                var subTotal = 0;
                $(data.bill_items).each(function (i, item) {
                    var temp_qty = item.qty;
                    var temp_price = item.price;
                    subTotal = subTotal + parseFloat(temp_price) * parseFloat(temp_qty);
                    if (parseInt(item.free_qty) != 0) {
                        tot_qty = tot_qty + parseFloat(item.qty) + parseFloat(item.free_qty);
                        item.qty = item.qty + " + " + item.free_qty + " " + item.unit;
                    }
                    else {
                        tot_qty = tot_qty + parseFloat(item.qty);
                        item.qty = item.qty + " " + item.unit;
                    }
                    if (data.bill_type != "Return")
                        if (item.tax_inclusive == "1")
                            item.price = parseFloat(parseFloat(item.price) / parseFloat((parseFloat(item.tax_per) / 100) + 1)).toFixed(2);
                    item.discount = parseFloat(item.discount).toFixed(2);
                    billData.push({
                        SlNo: i + 1,
                        ItemName: item.item_name,
                        Rate: convertBitString(temp_price.toString(), 6) + " ",
                        Price: convertBitString(item.price.toString(), 6),
                        Qty: convertBitString(item.qty, 12),
                        Amount: parseFloat(item.total_price).toFixed(2),//parseFloat(parseFloat(item.price) * parseFloat(temp_qty)).toFixed(2),
                        Discount: convertBitString(item.discount.toString(), 9)
                    });
                });
                //var billSummary = "Sale:" + parseFloat(subTotal).toFixed(2) + " | GST:" + parseFloat(data.tax).toFixed(2) + " | Dis:" + parseFloat(data.discount).toFixed(2);
                var billSummary = "Sale + GST:" + parseFloat(subTotal).toFixed(2) + " | Dis:" + parseFloat(data.discount).toFixed(2);
                var printData = {
                    CompanyName: CONTEXT.COMPANY_NAME,
                    Address: CONTEXT.COMPANY_ADDRESS_LINE1.substring(0, 15),
                    PhoneNo: CONTEXT.COMPANY_PHONE_NO,
                    Copies: 2,
                    BillType: (data.bill_type != "SaleReturn") ? "Cash Bill" : "Return Bill",
                    BillNo: billNo,
                    Customer: data.cust_name,
                    CustId: data.cust_no,
                    BillDate: sysDate(data.bill_date),
                    BillTime: currentDate,
                    SubTotal: billSummary,//parseFloat(data.sub_total).toFixed(2),
                    Discount: parseFloat(data.discount).toFixed(2),
                    Tax: parseFloat(data.tax).toFixed(2),
                    TotalQty: tot_qty,
                    TotalAmount: parseFloat(data.total).toFixed(2),
                    BarCodeText: getBitByZero(billNo, 10),
                    Template: "Template2",
                    BillItems: billData
                }
                PrintService.PrintPOSReceipt(printData);
                callback(billNo);
            }
            else {
                callback(billNo);
            }
        }
    });
}