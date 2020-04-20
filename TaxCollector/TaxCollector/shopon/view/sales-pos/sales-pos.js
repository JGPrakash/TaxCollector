var global_page = null;
var bill_tab_count = 0;
var paymentPage = 0;
$.fn.salesPOS = function () {
    return $.pageController.getControl(this, function (page, $$) {
        //Import Services required
        page.billService = new BillService();
        page.accService = new AccountingService();
        page.salesService = new SalesService();
        page.finfactsEntry = new FinfactsEntry();

        page.trayService = new TrayService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.inventoryService = new InventoryService();
        page.settingService = new SettingService();
        page.finfactsService = new FinfactsService();
        page.rewardService = new RewardService();
        page.stockAPI = new StockAPI();
        page.salesExecutiveRewardService = new SalesExecutiveRewardService();
        page.expenseBillService = new BillExpenseService();
        page.invoiceService = new InvoiceService();
        page.stockService = new StockService();
        page.billScheduleAPI = new BillScheduleAPI();

        page.customerAPI = new CustomerAPI();
        page.customerrewardAPI = new CustomerRewardAPI();
        page.billAPI = new BillAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.billPaymentAPI = new BillPaymentAPI();
        page.billPayTransactionAPI = new BillPayTransactionAPI();
        page.finfactsEntryAPI = new FinfactsEntryAPI();
        page.eggtraytransAPI = new EggTrayTransAPI();
        page.rewardplanAPI = new RewardPlanAPI();
        page.salesExecutiveRewardPlanAPI = new SalesExecutiveRewardPlanAPI();
        page.salesexecutiverewardAPI = new SalesExecutiveRewardAPI();
        page.SubscriptionPlanAPI = new SubscriptionPlanAPI();
        page.reportAPI = new ReportAPI();
        
        page.tabs = {};
        page.tabId = 1;
        page.currentTabId = null;
        page.returnExpense = 0;
        page.temp_obj = null;
        page.billAmount = 0;
        page.bill_count = 0;
        page.discount = 0;

        function confirmAmount() {
            $("#BillAmount").html(page.billAmount);
            $("#cashAmount").val("");
            var defer = $.Deferred();
            $("#dialog-form-amount").dialog({
                autoOpen: true,
                modal: true,
                buttons: {
                    "Ok": function () {
                        var text1 = $("#cashAmount");
                        //Do your code here
                        page.cashAmount = text1.val();
                        defer.resolve("Ok");
                        $(this).dialog("close");
                    },
                    "Cancel": function () {
                        defer.resolve("Cancel");
                        $(this).dialog("close");
                    }
                }
            });
            return defer.promise();
        }
        document.title = "ShopOn - POS";
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;

            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNewBill_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnBack_click();
                page.events.btnPayPendingBack_click();
            }
            if (keyCode == 119) {
                e.preventDefault();
                page.events.btnPendingPayment_click();
            }
            if (keyCode == 39) {
                ++paymentPage;
                page.setPendingPage();
            }
            if (keyCode == 37) {
                --paymentPage;
                page.setPendingPage();
            }
        });
        //$('#pnlPayPending').keydown(function (event) {
            
        //});
        $('#pnlReturnPOSPopup').keydown(function (event) {
            if (event.keyCode == 35) {
                page.events.btnReturnPOSItemPopup_click();
            }
        });
        
        var typingTimer;                //timer identifier
        var doneTypingInterval = 250;  //time in ms, 5 second for example
        var $input = $("[controlid=txtBillDiscount]");
        var $inputSearchBillNo = $("[controlid=txtSearchBillNo]");
        var $inputPendingDiscuount = $("[controlid=txtPendingPaymentDiscount]");
        var $inputReceivedAmount = $("[controlid=txtReceivedAmount]");
        //on keyup, start the countdown
        $input.on('keyup', function () {
            if (isNaN($$("txtBillDiscount").value()) || $$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null || typeof $$("txtBillDiscount").value() == "undefined" || parseFloat($$("txtBillDiscount").value()) < 0) {
                $$("txtBillDiscount").value("0");
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
        $inputSearchBillNo.on('keydown', function (e) {
            //if (e.which == 32) {
            //    clearTimeout(typingTimer);
            //    typingTimer = setTimeout(donePayPayment, doneTypingInterval);
            //}
            if (e.which == 32) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { $$("txtReceivedAmount").selectedObject.focus().select(); $$("txtSearchBillNo").value(""); }, doneTypingInterval);
            }
        });
        $inputPendingDiscuount.on('keydown', function (e) {
            if (e.which == 13) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(function () { $$("txtReceivedAmount").selectedObject.focus().select();}, doneTypingInterval);
            }
            else if ($$("txtPendingPaymentDiscount").value() == "" || $$("txtPendingPaymentDiscount").value() == null || typeof $$("txtPendingPaymentDiscount").value() == "undefined" || parseFloat($$("txtPendingPaymentDiscount").value()) < 0) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(donePendingDiscount, doneTypingInterval);
            }
            else {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(donePendingDiscount, doneTypingInterval);
            }
        });
        $inputReceivedAmount.on('keydown', function (e) {
            clearTimeout(typingTimer);
            typingTimer = setTimeout(donePaymentBalance, doneTypingInterval);
        });
        //var typingTimer;                //timer identifier
        //var doneTypingInterval = 250;  //time in ms, 5 second for example
        //var $inputPendingPaymentDiscount = $("[controlid=txtPendingPaymentDiscount]");
        //var $inputReceivedAmount = $("[controlid=txtReceivedAmount]");
        //$inputPendingPaymentDiscount.on('keyup', function () {
        //    if ($$("txtPendingPaymentDiscount").value() == "" || $$("txtPendingPaymentDiscount").value() == null || typeof $$("txtPendingPaymentDiscount").value() == "undefined" || parseFloat($$("txtPendingPaymentDiscount").value()) < 0) {
        //        //$$("txtPendingPaymentDiscount").value("0");
        //        clearTimeout(typingTimer);
        //        typingTimer = setTimeout(donePendingDiscount, doneTypingInterval);
        //    }
        //    else {
        //        clearTimeout(typingTimer);
        //        typingTimer = setTimeout(donePendingDiscount, doneTypingInterval);
        //    }
        //});
        function donePendingDiscount() {
            var discount = 0;
            if ($$("txtPendingPaymentDiscount").value().startsWith("%")) {
                discount = (parseFloat($$("lblTotalAmount").value()) * parseFloat($$("txtPendingPaymentDiscount").value().substring(1, $$("txtPendingPaymentDiscount").value().length))) / 100;
            }
            else
                discount = $$("txtPendingPaymentDiscount").value();
            if (discount == "" || typeof discount == "undefined" || discount == null || isNaN(discount))
                discount = 0;
            page.discount = discount;
            $$("lblTotalAmount").value(parseFloat(parseFloat($$("lblTotalPendingAmount").value() - parseFloat(discount))).toFixed(2));
            $$("txtReceivedAmount").value(parseFloat($$("lblTotalAmount").value()).toFixed(2));
            donePaymentBalance();
        }
        //$inputReceivedAmount.on('keydown', function () {
        //    clearTimeout(typingTimer);
        //    typingTimer = setTimeout(donePaymentBalance, doneTypingInterval);
        //});
        function donePaymentBalance() {
            $$("lblPaymentBalance").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())).toFixed(2));
        }
        function doneTyping() {
            if (parseFloat($$("txtBillDiscount").value()) > parseFloat($$("lblTempReturnAmount").value())) {
                alert("Discount Should Not Exceed Than The Actual Return Amount");
                $$("txtBillDiscount").value("0");
                $$("txtBillDiscount").focus();
                $$("lblTempReturnNetAmount").value(parseFloat(parseFloat(parseFloat($$("lblTempReturnAmount").value())) - parseFloat($$("txtBillDiscount").value())).toFixed(2));
                //$$("txtReturnAmount").value(parseFloat(parseFloat($$("lblTempReturnAmount").value())) - parseFloat($$("txtBillDiscount").value()));
            }
            else {
                $$("lblTempReturnNetAmount").value(parseFloat(parseFloat(parseFloat($$("lblTempReturnAmount").value())) - parseFloat($$("txtBillDiscount").value())).toFixed(2));
                //$$("txtReturnAmount").value(parseFloat(parseFloat($$("lblTempReturnAmount").value())) - parseFloat($$("txtBillDiscount").value()));
            }
        }
        function donePayPayment() {
            page.events.btnPayPending_click();
        }

        page.createBillView = function (billNo) {
            //Add tab and panel
            var tabText = typeof billNo == "undefined" ? "New * : 0.00" : "Bill " + billNo + " : 0.00";
            $('<li index="' + page.tabId + '" ><a target="#bill_' + page.tabId + '"  style="padding-top: 1px;    padding-bottom: 0px;    height: auto;">' + tabText + '</a><button style="background-color: transparent; border: none;" >x</button></li>').insertBefore($("[controlId=tabBills] hr"));
            $$("tabPanels").append('<div style="display:none"  id="bill_' + page.tabId + '">cccccccc' + page.tabId + '</div>');
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                var nextTab = $(this).closest("li").next();
                if (nextTab.length == 0)
                    nextTab = $(this).closest("li").prev();
                if (nextTab.length == 0) {
                    page.currentTabId = null;
                    page.events.btnBack_click();
                } else {
                    page.currentTabId = parseInt(nextTab.attr("index"));
                    var index = $(this).closest("li").attr("index");
                    $.pageController.unLoadUserControl(page, "bill_" + index);
                    $$("tabPanels").find("[id=bill_" + index + "]").remove();

                    $$("tabBills").selectedObject.find("[index=" + index + "]").remove();
                    delete page.tabs[index];
                }
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] a").click();
            //$$("tabPanels").selectedObject.find('id=bill_' + page.tabId).salesBill();
            var obj = $.pageController.loadUserControl(page, $$("tabPanels").find('[id=bill_' + page.tabId + "]"), "bill_" + page.tabId, "salesBill");

            $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click(function () {
                
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                bill_tab_count--;
                if (bill_tab_count == 0) {
                    page.events.btnBack_click();
                }
            });

            obj.setMessagePanel($$("msgPanel"));
            obj.closeBill = function () {
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                bill_tab_count--;
            }
            obj.launchNewBill = function () {
                page.events.btnNewBill_click();
                bill_tab_count++;
            }
            obj.setBillAmount = function (amount) {
                var tabText = $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html();
                if (tabText != null && typeof tabText != "undefined" && tabText != "")
                    $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html(tabText.split(":")[0] + ": " + amount);
            }

            obj.printBill = function (billNo,rec_amount) {
                page.events.btnPrintBill_click(billNo, rec_amount);
            }
            
            obj.currentProductList = page.productList;
            
            //Store bil_ids
            page.tabs[page.tabId] = "";
            page.currentTabId = page.tabId;
            page.tabId = page.tabId + 1;
            return obj;
        }
        page.createEditBillView = function (billNo) {
            //Add tab and panel
            var tabText = typeof billNo == "undefined" ? "New * : 0.00" : "Bill " + billNo + " : 0.00";
            $('<li index="' + page.tabId + '" ><a target="#bill_' + page.tabId + '"  style="padding-top: 1px;    padding-bottom: 0px;    height: auto;">' + tabText + '</a><button style="background-color: transparent; border: none;" >x</button></li>').insertBefore($("[controlId=tabBills] hr"));
            $$("tabPanels").append('<div style="display:none"  id="bill_' + page.tabId + '">cccccccc' + page.tabId + '</div>');
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                var nextTab = $(this).closest("li").next();
                if (nextTab.length == 0)
                    nextTab = $(this).closest("li").prev();
                if (nextTab.length == 0) {
                    page.currentTabId = null;
                    page.events.btnBack_click();
                } else {
                    page.currentTabId = parseInt(nextTab.attr("index"));
                    var index = $(this).closest("li").attr("index");
                    $.pageController.unLoadUserControl(page, "bill_" + index);
                    $$("tabPanels").find("[id=bill_" + index + "]").remove();

                    $$("tabBills").selectedObject.find("[index=" + index + "]").remove();
                    delete page.tabs[index];
                }
            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] a").click();
            //$$("tabPanels").selectedObject.find('id=bill_' + page.tabId).salesBill();
            var obj = $.pageController.loadUserControl(page, $$("tabPanels").find('[id=bill_' + page.tabId + "]"), "bill_" + page.tabId, "salesEdit");

            $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click(function () {

            });
            $$("tabBills").selectedObject.find("[index=" + page.tabId + "] button").click(function () {
                bill_tab_count--;
                if (bill_tab_count == 0) {
                    page.events.btnBack_click();
                }
            });

            obj.setMessagePanel($$("msgPanel"));
            obj.closeBill = function () {
                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                //page.events.btnNewBill_click();
            }
            obj.launchNewBill = function () {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                page.events.btnNewBill_click();
                bill_tab_count++;
            }
            obj.setBillAmount = function (amount) {
                //$$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] button").click();
                var tabText = $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html();

                $$("tabBills").selectedObject.find("[index=" + page.currentTabId + "] a").html(tabText.split(":")[0] + ": " + amount);
            }

            obj.printBill = function (billNo, rec_amount) {
                page.events.btnPrintBill_click(billNo, rec_amount);
            }

            obj.currentProductList = page.productList;

            //Store bil_ids
            page.tabs[page.tabId] = "";
            page.currentTabId = page.tabId;
            page.tabId = page.tabId + 1;
            return obj;
        }
        
        page.events.btnBack_click = function () {
            $$("pnlSales").show();
            $$("pnlBill").hide();
            $$("ddlSearchViews").selectedValue(1);
            //$$("grdSales").dataBind({
            //    getData: function (start, end, sortExpression, filterExpression, callback) {
            //        //page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
            //        var totalRecord = page.bill_count;
            //        page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
            //            callback(data, totalRecord);
            //        });
            //        //});
            //    },
            //    update: function (item, updatedItem) {
            //        for (var prop in updatedItem) {
            //            if (!updatedItem.hasOwnProperty(prop)) continue;
            //            item[prop] = updatedItem[prop];
            //        }
            //    }
            //});
        }


        page.events.btnNewBill_click = function () {
            var obj = page.createBillView();
            page.temp_obj = obj;
            obj.createBill();
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
            $$("pnlPayPending").hide();
        }

        //Event to make a new Return Entry
        page.events.btnNewReturnBill_click = function (bill) {
            if (bill.state_text == "Return") {
                //alert("Already Returned");
                ShowDialogBox('Warning', 'Bill already returned...!', 'Ok', '', null);
            }
            else {
                var obj = page.createBillView(bill.bill_no);
                obj.returnBill(bill.bill_no);
                $$("pnlSales").hide()
                $$("pnlBill").show();
            }
        }
        page.events.btnOpenBill_click = function (bill) {
            var obj = page.createBillView(bill.bill_no);
            //var obj = page.createBillView(bill.bill_id);
            page.temp_obj = obj;
            obj.viewBill(bill.bill_no);
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnBillEdit_click = function (bill) {
            //var obj = page.createEditBillView(bill);
            //page.temp_obj = obj;
            //obj.viewBill(bill);
            //bill_tab_count++;
            //$$("pnlSales").hide();
            //$$("pnlBill").show();
            var obj = page.createBillView(bill.bill_no);
            //var obj = page.createBillView(bill.bill_id);
            page.temp_obj = obj;
            obj.editBill(bill.bill_no);
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btncreditBill_click = function (bill) {
            var obj = page.createBillView(bill.bill_no);
            //var obj = page.createBillView(bill.bill_id);
            page.temp_obj = obj;
            obj.creditBill(bill.bill_no);
            bill_tab_count++;
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnAdjustmentBill_click = function (bill, billAdjustment) {
            var obj = page.createAdjustmentBillView(bill.bill_no);
            obj.viewBill(bill.bill_no, billAdjustment);
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        page.events.btnReturnBill_click = function (bill) {
            var obj = page.createReturnBillView(bill.bill_no);
            obj.viewBill(bill.bill_no,bill);
            $$("pnlSales").hide();
            $$("pnlBill").show();
        }
        //Event to make a new Return Entry
        page.events.btnSendMailGrid_click = function (bill) {
            var payMode = "";
            if (CONTEXT.ENABLE_EMAIL == "true") {
                try {
                    var error_count = 0;
                    if (bill.cust_no == null || bill.cust_no == "" || typeof bill.cust_no == "undefined") {
                        error_count++;
                        throw "Customer Not Selected";
                    }
                    if (bill.cust_name == null || bill.cust_name == "" || typeof bill.cust_name == "undefined") {
                        error_count++;
                        ShowDialogBox('Warning', 'Customer not selected...!', 'Ok', '', null);
                    }
                    if (bill.email == null || bill.email == "" || typeof bill.email == "undefined"){
                        error_count++;
                        throw "Email id is not provided for the customer";
                    }
                    if(error_count == 0) {
                        var itemLists = [];
                        page.billService.getPayBillByNo(bill.bill_no, function (mode) {

                            page.billService.getBillItem(bill.bill_no, function (billItems) {
                                page.customerAPI.getValue({ cust_no: bill.cust_no }, function (data) {
                                    $(billItems).each(function (i, item) {
                                        itemLists.push({ "itemNo": item.item_no, "itemName": item.item_name, "qty": item.qty, "unit": item.unit, "price": item.price, "discount": item.discount, "totalPrice": item.total_price, });
                                    });
                                    $(mode).each(function (i, paymode) {
                                        payMode = paymode.pay_mode + "/" + payMode;
                                    })

                                    var accountInfosp = {
                                        "billNo": bill.bill_no,
                                        "billDate": bill.bill_date,
                                        //"2015-03-25T12:00:00Z",
                                        "appName": CONTEXT.COMPANY_NAME,
                                        "companyId": "1",//CONTEXT.FINFACTS_COMPANY,
                                        "clientAddress": CONTEXT.ClientAddress,
                                        "customerNumber": bill.cust_no,
                                        "customerName": bill.cust_name,
                                        "tax": bill.tax,
                                        "subTotal": bill.sub_total,
                                        "discount": bill.discount,
                                        "totalPaid": bill.total,
                                        "totalRewardPoint": (data[0].points == null) ? "0" : data[0].points,
                                        "billType": payMode,
                                        //"2300",
                                        "emailAddressList": [bill.email],
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
                                            $$("msgPanel").show("Email Sent Successfully..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
                                        },
                                        error: function (request, status, error) {
                                            console.log(request.responseText);
                                            $(".detail-info").progressBar("hide");
                                            $$("msgPanel").show("Email Sent Failed..." + bill.cust_name + " " + bill.email + " " + CONTEXT.COMPANY_NAME);
                                        }
                                    });

                                });
                            })
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

        page.events.btnSendSMS_click = function (bill) {
            if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                try {
                    var error_count = 0;
                    if (bill.cust_no == null || bill.cust_no == "" || typeof bill.cust_no == "undefined") {
                        error_count++;
                        ShowDialogBox('Warning', 'Customer not selected...!', 'Ok', '', null);
                    }
                    if (bill.cust_name == null || bill.cust_name == "" || typeof bill.cust_name == "undefined") {
                        error_count++;
                        ShowDialogBox('Warning', 'Customer not selected...!', 'Ok', '', null);
                    }
                    if (bill.mobile_no == "" || bill.mobile_no == null || typeof bill.mobile_no == "undefined" || bill.mobile_no == "+91") {
                        error_count++;
                        throw "Customer mobile number not provided";
                    }
                    if (error_count == 0) {
                            var customer = {
                                cust_no: bill.cust_no
                            }
                            page.customerAPI.getValue(customer, function (data) {
                            var accountInfo =
                            {
                                "appName": CONTEXT.COMPANY_NAME,
                                "senderNumber": CONTEXT.SMS_SENDER_NO,
                                "companyId": CONTEXT.SMS_COMPANY_ID,
                                //"+917338898011",
                                //"919486342575",
                                //("txtSenderNumber").val(),
                                "message": //"Hai",
                                    "Dear " + bill.cust_name + "," + "\n" +
                                    "Thankyou For Purchasing " +
                                    "Your Total Amount is Rs. " + bill.total + "\n" +
                                    "Your Total Reward Points " + data[0].points + "\n" +
                                    "Regards as " + CONTEXT.COMPANY_NAME + "",
                                "receiverNumber": "+91" + bill.mobile_no,
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
                                //url: "http://104.251.212.122:8080/woto-utility-rest/rest/sendSMS/text-message",
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

        page.events.btnReturnPOS_click = function (bill) {
            page.returnExpense = 0;
            page.returnMobileNo = bill.mobile_no;
            page.returnCustomer = bill.cust_name;
            page.returnCusEmail = bill.email;
            page.returnCusAddress = bill.cust_address;
            page.returnCusGstNo = bill.gst_no;
            if (CONTEXT.ENABLE_SALES_EXECUTIVE) {
                $$("ddlDeliveryBy").show();
                $$("lblSalesExe").show();
            }
            else {
                $$("ddlDeliveryBy").hide();
                $$("lblSalesExe").hide();
            }
            $$("lblSalesExe").value(CONTEXT.SALES_EXECUTIVE_LABEL_NAME);
            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                $$("pnlExpenses").show();
                $$("pnlExpenseName").show();
                $$("txtExpense").value(bill.expenses);
                page.returnExpense = parseFloat(bill.expenses);
            } else {
                $$("pnlExpenses").hide();
                $$("pnlExpenseName").hide();
                $$("txtExpense").value(bill.expenses);
                page.returnExpense = parseFloat(bill.expenses);
            }
            if (CONTEXT.ENABLE_BILL_LEVEL_DISCOUNT) {
                $$("pnlBillDiscount").show();
            } else {
                $$("pnlBillDiscount").hide();
            }
            try {
                if (bill.state_text == "Return")
                    throw "Bill Already Returned";
                if (bill.state_text == "Saved")
                    throw "Bill Not Paid";

                $$("txtReturnPayDesc").value("CurrentBill");
                $$("dsReturnPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

                //Sales Executive
                CONTEXT.ENABLE_SALES_EXECUTIVE ? $$("pnlSalesExecutive").show() : $$("pnlSalesExecutive").hide();
                $$("ddlDeliveryBy").selectedValue(bill.sales_executive);

                //RETURN AMOUNT
                $$("txtBillDiscount").value("0");
                $$("txtExpense").value("");
                $$("txtExpenseName").value("");
                $$("txtReturnAmount").value("0");
                $$("lblTempReturnAmount").value("0");
                $$("btnReturnPOSItemPopup").disable(false);
                $$("btnReturnPOSItemPopup").show();
                $$("lblBillDiscount").value(bill.bill_discount);
                $$("lblTempReturnNetAmount").value("0.00");
                $$("lblTempReturnAmount").value("0.00");
                page.controls.pnlReturnPOSPopup.open();
                page.controls.pnlReturnPOSPopup.title("Return Items");
                page.controls.pnlReturnPOSPopup.rlabel("Return Items");
                page.controls.pnlReturnPOSPopup.width("90%");
                page.controls.pnlReturnPOSPopup.height(600);
                //page.billService.getReturnedPOSBillByNo(bill.bill_no, function (rdata) {
                //page.stockAPI.getSalesBill(bill.bill_no, function (data) {
                page.billAPI.getReturnBill(bill.bill_no, function (data1) {
                    var data = (data1.length == 1)?data1:getUnique(data1);
                    var dataitems = [];
                    $(data).each(function (i, item) {
                        if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                            item.free_qty_return = 0;
                        if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                            item.free_qty = 0;
                        var qty_fact = 1;
                        if (item.discount != null && item.discount != undefined) {
                            item.discount = parseFloat(item.discount) / (parseFloat(item.qty) / parseFloat(qty_fact));
                        }
                        dataitems.push({
                            batch_no: item.batch_no,
                            delivered: item.delivered,
                            expiry_date: item.expiry_date,
                            man_date: item.man_date,
                            free_qty: parseFloat(item.free_qty) / parseFloat(qty_fact),
                            free_qty_return: parseFloat(item.free_qty_return) / parseFloat(qty_fact),
                            item_name: item.item_name,
                            item_name_tr: item.item_name_tr,
                            item_no: item.item_no,
                            item_code: item.item_code,
                            item_price: parseFloat(item.item_price),// - parseFloat(item.discount),
                            mrp: item.mrp,
                            ordered_price: item.total_price,
                            ordered_qty: parseFloat(item.qty) / parseFloat(qty_fact),
                            qty: parseFloat(parseFloat(item.qty) / parseFloat(qty_fact)) - parseFloat(parseFloat(item.free_qty) / parseFloat(qty_fact)),
                            qty_returned: parseFloat(parseFloat(item.qty_returned) / parseFloat(qty_fact)) - parseFloat(parseFloat(item.free_qty_return) / parseFloat(qty_fact)),
                            tray_id: item.tray_id,
                            cost: item.cost,
                            variation_name: item.variation_name,
                            tax_per: item.tax_per,
                            hsn_code: item.hsn_code,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            unit: item.unit,
                            alter_unit: item.alter_unit,
                            unit_identity: "0",
                            alter_unit_fact: item.alter_unit_fact,
                            tax_class_no: item.tax_class_no,
                            var_no: item.var_no,
                            price_no: item.price_no,
                            taxable_value: parseFloat(item.taxable_value) / parseFloat(parseFloat(item.ordered_qty) / parseFloat(qty_fact)),
                            tax_inclusive: item.tax_inclusive,
                            rack_no: item.rack_no,
                            executive_id: item.executive_id,
                            reward_plan_id: item.reward_plan_id,
                            reward_plan_point: item.reward_plan_point,
                            start_date: "",
                            end_date: "",
                            package_item: item.package_item,
                            cess_per: item.cess_per,
                            cess_qty: item.cess_qty,
                            cess_qty_amount: item.cess_qty_amount,
                        });
                    });
                    page.controls.grdReturnPOSItems.rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdReturnPOSItems.allData().length);
                        //UNIT DROPDOWN
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
                        //CHANGES MADE IN UNIT
                        $(row).find("[id=itemUnit]").change(function () {
                            if ($(this).val() == "0") {
                                item.free_qty = parseFloat(item.free_qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty]").find("div").html(item.free_qty);
                                item.free_qty_return = parseFloat(item.free_qty_return) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty_return]").find("div").html(item.free_qty_return);
                                item.ordered_qty = parseFloat(item.ordered_qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=ordered_qty]").find("div").html(item.ordered_qty);
                                item.qty = parseFloat(item.qty) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty]").find("div").html(item.qty);
                                item.qty_returned = parseFloat(item.qty_returned) * parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty_returned]").find("div").html(item.qty_returned);

                                item.unit_identity = 0;
                                $(row).find("[datafield=unit_identity]").find("div").html(0);
                            }
                            else {
                                item.free_qty = parseFloat(item.free_qty) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty]").find("div").html(item.free_qty);
                                item.free_qty_return = parseFloat(item.free_qty_return) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=free_qty_return]").find("div").html(item.free_qty_return);
                                item.ordered_qty = parseFloat(item.ordered_qty) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=ordered_qty]").find("div").html(item.ordered_qty);
                                item.qty = parseFloat(item.qty) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty]").find("div").html(item.qty);
                                item.qty_returned = parseFloat(item.qty_returned) / parseFloat(item.alter_unit_fact);
                                $(row).find("[datafield=qty_returned]").find("div").html(item.qty_returned);

                                item.unit_identity = 1;
                                $(row).find("[datafield=unit_identity]").find("div").html(1);
                            }
                            var tot_ret_amount = 0;
                            var ori_qty = 0;
                            var temp_price = item.item_price;
                            var item_amount = 0;
                            if (item.unit_identity == "1") {
                                ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            }
                            else {
                                ori_qty = parseFloat(item.ret_qty);
                            }
                            item_amount = (parseFloat(ori_qty) * parseFloat(temp_price));
                            item.tot_amount = parseFloat(item_amount) + (parseFloat(item_amount) * parseFloat(item.tax_per) / 100);
                            if (isNaN(item.tot_amount))
                                item.tot_amount = 0;
                            $(page.controls.grdReturnPOSItems.allData()).each(function (i, row) {
                                var qty_amount = (typeof row.tot_amount == "undefined" || row.tot_amount == null || row.tot_amount == "") ? 0 : row.tot_amount;
                                tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(qty_amount);
                            });
                            tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                            $$("lblTempReturnAmount").value(tot_ret_amount);
                            $$("lblTempReturnNetAmount").value(parseFloat(tot_ret_amount) - parseFloat($$("txtBillDiscount").value()));
                            //$$("txtReturnAmount").value(parseFloat(tot_ret_amount) - parseFloat($$("txtBillDiscount").value()));
                            $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                        });

                        if (item.tray_id == "-1" || item.tray_id == null) {
                            row.find("div[datafield=tray_received]").css("visibility", "hidden");
                        }
                        //Handle quantity change and recalculate
                        row.on("change", "input[datafield=ret_qty]", function () {
                            var tot_ret_amount = 0;
                            var ori_qty = 0;
                            var temp_price = item.item_price;
                            var item_amount=0;
                            if (item.unit_identity == "1") {
                                ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                            }
                            else {
                                ori_qty = parseFloat(item.ret_qty);
                            }
                            item_amount=(parseFloat(ori_qty) * parseFloat(temp_price));
                            item.tot_amount = parseFloat(item_amount) + (parseFloat(item_amount) * parseFloat(item.tax_per) / 100) + (parseFloat(item.cess_qty_amount) * parseFloat(ori_qty));
                            if (isNaN(item.tot_amount))
                                item.tot_amount = 0;
                            item.additional_tax = parseFloat(item.cess_qty_amount) * parseFloat(ori_qty);
                            $(page.controls.grdReturnPOSItems.allData()).each(function (i, row) {
                                var qty_amount = (typeof row.tot_amount == "undefined" || row.tot_amount == null || row.tot_amount == "") ? 0 : row.tot_amount;
                                tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(qty_amount);
                            });
                            tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                            $$("lblTempReturnAmount").value(tot_ret_amount);
                            $$("lblTempReturnNetAmount").value(parseFloat(tot_ret_amount) - parseFloat($$("txtBillDiscount").value()));
                            $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                            $(row).find("[datafield=additional_tax]").find("div").html(item.additional_tax.toFixed(5));
                        });
                        $(row).find("input[dataField=temp_start_date]").change(function () {
                            var temp_date = $(row).find("[datafield=temp_start_date]").find("input").val();
                            var day = temp_date.substring(8, 10);
                            var month = temp_date.substring(5, 7);
                            var year = temp_date.substring(0, 4);

                            item.start_date = year + "-" + month + "-" + day;
                            $(row).find("[datafield=start_date]").find("div").html(item.start_date);
                            page.calculateDays(function (data) {
                                var tot_ret_amount = 0;
                                var ori_qty = 0;
                                var temp_price = item.item_price;
                                var item_amount = 0;
                                if (item.unit_identity == "1") {
                                    ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                                }
                                else {
                                    ori_qty = parseFloat(item.ret_qty);
                                }
                                item_amount = (parseFloat(ori_qty) * parseFloat(temp_price));
                                item.tot_amount = parseFloat(item_amount) + (parseFloat(item_amount) * parseFloat(item.tax_per) / 100);
                                if (isNaN(item.tot_amount))
                                    item.tot_amount = 0;
                                $(page.controls.grdReturnPOSItems.allData()).each(function (i, row) {
                                    var qty_amount = (typeof row.tot_amount == "undefined" || row.tot_amount == null || row.tot_amount == "") ? 0 : row.tot_amount;
                                    tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(qty_amount);
                                });
                                tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                                $$("lblTempReturnAmount").value(tot_ret_amount);
                                $$("lblTempReturnNetAmount").value(parseFloat(tot_ret_amount) - parseFloat($$("txtBillDiscount").value()));
                                $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
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
                                var tot_ret_amount = 0;
                                var ori_qty = 0;
                                var temp_price = item.item_price;
                                var item_amount = 0;
                                if (item.unit_identity == "1") {
                                    ori_qty = parseFloat(item.ret_qty) * parseFloat(item.alter_unit_fact);
                                }
                                else {
                                    ori_qty = parseFloat(item.ret_qty);
                                }
                                item_amount = (parseFloat(ori_qty) * parseFloat(temp_price));
                                item.tot_amount = parseFloat(item_amount) + (parseFloat(item_amount) * parseFloat(item.tax_per) / 100);
                                if (isNaN(item.tot_amount))
                                    item.tot_amount = 0;
                                $(page.controls.grdReturnPOSItems.allData()).each(function (i, row) {
                                    var qty_amount = (typeof row.tot_amount == "undefined" || row.tot_amount == null || row.tot_amount == "") ? 0 : row.tot_amount;
                                    tot_ret_amount = parseFloat(tot_ret_amount) + parseFloat(qty_amount);
                                });
                                tot_ret_amount = Math.round(parseFloat(tot_ret_amount));
                                $$("lblTempReturnAmount").value(tot_ret_amount);
                                $$("lblTempReturnNetAmount").value(parseFloat(tot_ret_amount) - parseFloat($$("txtBillDiscount").value()));
                                $(row).find("[datafield=tot_amount]").find("div").html(item.tot_amount.toFixed(5));
                            });
                        });
                        if (item.unit != "Period") {
                            row.find("div[datafield=temp_start_date]").css("display", "none");
                            row.find("div[datafield=temp_end_date]").css("display", "none");
                        }

                    }
                    $$("grdReturnPOSItems").dataBind(dataitems);
                    $$("grdReturnPOSItems").edit(true);
                });
                
                
                if (window.mobile) {
                    $$("grdReturnPOSItems").width("1600px");
                    $$("grdReturnPOSItems").height("auto");
                    $$("grdReturnPOSItems").setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "", 'width': "0px", 'dataField': "order_item_id", editable: false,visible:false },
                                //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "0px", 'dataField': "item_no", editable: false, visible: false },
                                { 'name': "Item No", 'rlabel': 'Item No', 'width': "0px", 'dataField': "item_code", editable: false, visible: false },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", editable: false },
                                { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name_tr", editable: false, visible: CONTEXT.ENABLE_SALES_SECONDARY_LANGUAGE },
                                { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: false },
                                { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", editable: false },
                               { 'name': "Stocked", 'rlabel': 'Stocked', 'width': "60px", 'dataField': "qty", editable: false },
                               { 'name': "Returned", 'rlabel': 'Returned', 'width': "90px", 'dataField': "qty_returned", editable: false },
                                { 'name': "Return Qty", 'rlabel': 'Return Qty', 'width': "100px", 'dataField': "ret_qty", editable: true },
                                { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.SHOW_FREE },
                                { 'name': "Returned Free", 'rlabel': 'Returned Free', 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.SHOW_FREE },
                                { 'name': "Free Item", 'rlabel': 'Free Item', 'width': "100px", 'dataField': "ret_free", editable: true, visible: CONTEXT.SHOW_FREE },
                                { 'name': "Tray", 'rlabel': 'Tray', 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                                { 'name': "Variation", 'rlabel': 'Variation', 'width': "0px", 'dataField': "variation_name", visible: false },
                                { 'name': "MRP", 'rlabel': 'MRP', 'width': "0px", 'dataField': "mrp", visible: false },
                                { 'name': "Man Date", 'rlabel': 'Man Date', 'width': "0px", 'dataField': "man_date", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "0px", 'dataField': "expiry_date", visible: false }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                                { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "0px", 'dataField': "batch_no", visible: false },
                                { 'name': "Price to return", 'rlabel': 'Price to return', 'width': "140px", 'dataField': "item_price" },//, editable: false },
                                { 'name': "Tax", 'rlabel': 'GST', 'width': "0px", 'dataField': "tax_per", visible: false },
                                { 'name': "HSN Code", 'rlabel': 'HSN Code', 'width': "0px", 'dataField': "hsn_code", visible: false },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "0px", 'dataField': "cgst", visible: false },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "0px", 'dataField': "sgst", visible: false },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "0px", 'dataField': "igst", visible: false },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "tot_amount" },
                                { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                                { 'name': "", 'width': "0px", 'dataField': "qty_const", visible: false },
                                { 'name': "", 'width': "0px", 'dataField': "tray_id", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "amount", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "unit_identity", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "cost", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "var_no", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "taxable_value", visible: false },
                              { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                        ]
                    });
                }
                else {
                    $$("grdReturnPOSItems").width("2800px");
                    $$("grdReturnPOSItems").height("auto");
                    $$("grdReturnPOSItems").setTemplate({
                        selection: "Single",
                        columns: [
                            { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no" },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", editable: false },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name_tr", editable: false, visible: CONTEXT.ENABLE_SALES_SECONDARY_LANGUAGE },
                            //{ 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", editable: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_code", editable: false },
                            { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", itemTemplate: "<div  id='prdDetail' style=''></div>" },
                                //{ 'name': "Unit", 'width': "80px", 'dataField': "unit", editable: false },
                            { 'name': "Stocked", 'rlabel': 'Stocked', 'width': "60px", 'dataField': "qty", editable: false },
                            { 'name': "Returned", 'rlabel': 'Returned', 'width': "90px", 'dataField': "qty_returned", editable: false },
                            { 'name': "Start Date", 'rlabel': 'Start Date', 'width': "200px", 'dataField': "temp_start_date", visible: CONTEXT.ENABLE_SALES_ITEM_DATE, itemTemplate: "<input type='date' dataField='temp_start_date'>" },
                            { 'name': "End Date", 'rlabel': 'End Date', 'width': "200px", 'dataField': "temp_end_date", visible: CONTEXT.ENABLE_SALES_ITEM_DATE, itemTemplate: "<input type='date' dataField='temp_end_date'>" },
                            { 'name': "Return Qty", 'rlabel': 'Return Qty', 'width': "100px", 'dataField': "ret_qty", editable: true },
                            { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.SHOW_FREE },
                            { 'name': "Returned Free", 'rlabel': 'Returned Free', 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.SHOW_FREE },
                            { 'name': "Free Item", 'rlabel': 'Free Item', 'width': "100px", 'dataField': "ret_free", editable: true, visible: CONTEXT.SHOW_FREE },
                            { 'name': "Tray", 'rlabel': 'Tray', 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.ENABLE_VARIATION },
                            { 'name': "MRP", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Man Date", 'rlabel': 'Man Date', 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Expiry Date", 'rlabel': 'Expiry Date', 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "Price to return", 'rlabel': 'Price to return', 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Tax", 'rlabel': 'GST', 'width': "40px", 'dataField': "tax_per" },
                            { 'name': "HSN Code", 'rlabel': 'HSN Code', 'width': "100px", 'dataField': "hsn_code", visible: CONTEXT.ENABLE_HSN_CODE },
                            { 'name': "CGST", 'rlabel': 'CGST', 'width': "60px", 'dataField': "cgst" },
                            { 'name': "SGST",'rlabel': 'SGST', 'width': "60px", 'dataField': "sgst" },
                            { 'name': "IGST", 'rlabel': 'IGST', 'width': "60px", 'dataField': "igst" },
                            { 'name': "Cess Per", 'rlabel': 'Cess Per', 'width': "60px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "Cess Rate", 'rlabel': 'Cess Rate', 'width': "130px", 'dataField': "cess_qty_amount", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "Cess Amount", 'rlabel': 'Cess Amount', 'width': "130px", 'dataField': "additional_tax", editable: false, visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                            { 'name': "Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "tot_amount" },
                            { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                            { 'name': "", 'width': "0px", 'dataField': "amount" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "1px", 'dataField': "cost" },
                            { 'name': "", 'width': "1px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "taxable_value", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                            //Executive Details
                            { 'name': "", 'width': "0px", 'dataField': "executive_id", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "reward_plan_id", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "reward_plan_point", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "start_date", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "end_date", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "package_item", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "cess_qty", visible: false },
                        ]
                    });
                }
                $$("chkReturnPrintBill").prop("checked", true);
                $$("btnReturnPOSItemPopup").disable(false);
                var today = new Date();
                var newdate = new Date();
                newdate.setDate(today.getDate() + parseInt(CONTEXT.DEFAULT_BILL_DUE_DAYS));
                $$("txtBillDueDate").setDate(newdate);
            } catch (e) {
                $$("msgPanel").show(e);
            }
            
        }
        page.calculateDays = function (callback) {
            $(page.controls.grdReturnPOSItems.getAllRows()).each(function (i, row) {
                var billItem = page.controls.grdReturnPOSItems.getRowData(row);
                var start_date = $(row).find("[datafield=start_date]").find("div").html();
                var end_date = $(row).find("[datafield=end_date]").find("div").html();
                if (start_date != null && start_date != "" && typeof start_date != "undefined") {
                    if (end_date != null && end_date != "" && typeof end_date != "undefined") {
                        start_date = start_date.split('-');
                        end_date = end_date.split('-');
                        var new_start_date = new Date(start_date[0], start_date[1], start_date[2]);
                        var new_end_date = new Date(end_date[0], end_date[1], end_date[2]);
                        var tot_days = Math.round((new_end_date.getTime() - new_start_date.getTime()) / (1000 * 60 * 60 * 24));
                        billItem.ret_qty = tot_days + 1;
                        //$(row).find("[datafield=ret_qty]").find("div").html(billItem.ret_qty);
                        $(row).find("[datafield=ret_qty]").find("div").val(billItem.ret_qty);
                        $(row).find("input[datafield=ret_qty]").val(billItem.ret_qty);
                    }
                }
            });
            callback({});
        }
        page.events.btnReturnPOSItemPopup_click = function (overrideItems) {
            $$("btnReturnPOSItemPopup").disable(true);
            $$("btnReturnPOSItemPopup").hide();
            try {
                var result = "";
                var itemlList = page.controls.grdReturnPOSItems.allData();
                var returnItems = [];

                if (parseFloat($$("txtExpense").value()) < 0 || isNaN($$("txtExpense").value()))
                    throw "Loading Charge Is Number and Non Negative";

                var alldataqty = page.controls.grdReturnPOSItems.allData();
                var temp = {};
                var obj = null;
                for (var i = 0; i < alldataqty.length; i++) {
                    obj = alldataqty[i];

                    if (!temp[obj.unit]) {
                        temp[obj.unit] = obj.ret_qty;
                    }
                    else {
                        temp[obj.unit] = parseFloat(temp[obj.unit]) + parseFloat(obj.ret_qty);
                    }
                }

                for (var i in temp) {
                    result = result + temp[i] + ":" + i + "/";
                }

                var newBill = {
                    bill_no: "0",
                    bill_date: (typeof overrideItems == "undefined") ? dbDateTime($$("dsReturnPayDate").getDate()) : dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    store_no: getCookie("user_store_id"),
                    reg_no: localStorage.getItem("user_register_id"),
                    user_no: localStorage.getItem("app_user_id"),
                    due_date: (typeof overrideItems == "undefined") ? dbDateTime($$("txtBillDueDate").getDate()) : dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),

                    sub_total: 0,
                    total: 0,
                    discount: 0,
                    tax: 0,

                    bill_type: "SaleReturn",
                    state_no: 300, //300 is Return
                    pay_mode: (typeof overrideItems == "undefined")?$$("ddlReturnPayBillType").selectedValue():"Cash",
                    round_off: 0,
                    sales_tax_no: page.controls.grdSales.selectedData()[0].sales_tax_no,
                    mobile_no: page.controls.grdSales.selectedData()[0].mobile_no,
                    email_id: page.controls.grdSales.selectedData()[0].email,
                    gst_no: page.controls.grdSales.selectedData()[0].gst_no,
                    tot_qty_words: result,
                    bill_no_par: page.controls.grdSales.selectedData()[0].bill_no,
                    cust_no: page.controls.grdSales.selectedData()[0].cust_no,
                    cust_name: page.controls.grdSales.selectedData()[0].cust_name,
                    cust_address: page.controls.grdSales.selectedData()[0].cust_address,
                    delivered_by: (typeof overrideItems != "undefined")?$$("ddlDeliveryBy").selectedValue():"-1",
                    //expense: ($$("txtExpense").value() == "" || $$("txtExpense").value() == null) ? 0 : $$("txtExpense").value(),
                    bill_barcode: "",
                    sales_executive: (typeof overrideItems == "undefined")?$$("ddlDeliveryBy").selectedValue():"-1",
                    //FINFACTS ENTRY DATA
                    invent_type: "SaleReturnCredit",
                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    bill_discount: ($$("txtBillDiscount").value() == "" || $$("txtBillDiscount").value() == null) ? 0 : $$("txtBillDiscount").value(),
                    //fulfill: true,
                };
                var stockItems = [];
                var lastItemNo = "";
                var lastItemVariation = "";
                var lastItem = null;
                var item_tax_val;
                var buying_cost = 0;
                var additionalTax = 0;

                //CHECK THE RETURN AMOUNT
                if (parseFloat($$("txtReturnAmount").value()) > parseFloat($$("lblTempReturnAmount").value())) {
                    throw "Return amount should not be exceed than the actual return amount";
                }
                if (isNaN($$("txtReturnAmount").value()) || parseFloat($$("txtReturnAmount").value()) < 0) {
                    throw "Return amount should be a number and non negative";
                }

                var flagNoData = false;
                $(itemlList).each(function (i, item) {
                    item.unit_identity == "1" ? item.alter_unit_fact = item.alter_unit_fact : item.alter_unit_fact = 1;

                    if (typeof overrideItems != "undefined")
                        item.ret_qty = parseFloat(item.qty) - parseFloat(item.qty_returned);

                    //Set default value if empty
                    if (item.ret_qty == null || item.ret_qty == "" || typeof item.ret_qty == "undefined" || isNaN(item.ret_qty)) {
                        item.ret_qty = 0;
                    }
                    if (item.ret_free == null || item.ret_free == "" || typeof item.ret_free == "undefined" || isNaN(item.ret_free)) {
                        item.ret_free = 0;
                    }
                    if (item.free_qty_return == null || item.free_qty_return == "" || typeof item.free_qty_return == "undefined") {
                        item.free_qty_return = 0;
                    }
                    if (item.free_qty == null || item.free_qty == "" || typeof item.free_qty == "undefined") {
                        item.free_qty = 0;
                    }

                    //Validate number and non negative
                    if (isNaN(item.ret_qty) || parseFloat(item.ret_qty) < 0) //If not a number or negative set flag=1
                        throw "Quantity to return should be a number and non negative.";
                    if (isNaN(item.ret_free) || parseFloat(item.ret_free) < 0) //If not a number or negative set flag=1
                        throw "Free quantity to return should be a number and non negative.";

                    if (parseFloat(item.free_qty) < (parseFloat(item.free_qty_return) + parseFloat(item.ret_free)))
                        throw "Free qty cannot be greater than the total free qty";
                    if (item.tray_received == undefined || item.tray_received == null || item.tray_received == "")
                        item.tray_received = 0;
                    if (parseFloat(item.tray_received) < 0 || isNaN(item.tray_received))
                        throw "Tray qty should be number and positive";

                    if (parseFloat(item.qty) < (parseFloat(item.ret_qty) + parseFloat(item.qty_returned))) //If not a number or negative set flag=1
                        throw "Total return quantity cannot be greater than ordered quantity.";

                    if (parseFloat(item.ret_qty) > 0) {
                        var temp_price = item.item_price;
                        flagNoData = true;
                        item.ret_qty = item.ret_qty * item.alter_unit_fact;
                        item.ret_free = item.ret_free * item.alter_unit_fact;
                        //Add list for inventory transaction
                        stockItems.push(item);
                        if (true) {//if (lastItemVariation != item.variation_name) {
                            lastItem = item;
                            lastItem.fin_ret_qty = parseFloat(item.ret_qty);
                            lastItem.fin_ret_free = parseFloat(item.ret_free);
                            lastItem.fin_total_price = (parseFloat(item.ret_qty) * parseFloat(temp_price));
                            lastItem.sum_qty_returned = parseFloat(item.qty_returned);
                            returnItems.push(item);
                            lastItemNo = item.item_no;
                            lastItemVariation = item.variation_name;
                            additionalTax = (parseFloat(item.ret_qty) * parseFloat(item.cess_qty_amount));
                        }
                        else {
                            lastItem.fin_ret_qty = parseFloat(lastItem.fin_ret_qty);// + parseFloat(item.ret_qty);
                            lastItem.fin_ret_free = parseFloat(lastItem.fin_ret_free) + parseFloat(item.ret_free);
                            lastItem.fin_total_price = parseFloat(lastItem.fin_total_price) + (parseFloat(lastItem.fin_ret_qty) * parseFloat(temp_price));
                            lastItem.sum_qty_returned = lastItem.sum_qty_returned + parseFloat(item.qty_returned);
                            additionalTax = (parseFloat(item.ret_qty) * parseFloat(item.cess_qty_amount));
                        }

                            //Calculate bill total value
                            newBill.sub_total = newBill.sub_total + parseFloat(item.ret_qty) * parseFloat(temp_price);
                            item_tax_val = (parseFloat(temp_price) * (parseFloat(item.tax_per) / 100)) * parseFloat(item.ret_qty);
                            
                            newBill.tax = parseFloat(newBill.tax) + parseFloat(item_tax_val) + parseFloat(additionalTax);
                            
                            newBill.total = parseFloat(newBill.sub_total) + parseFloat(newBill.tax);
                            var total_after_Rnd_off = Math.round(parseFloat(newBill.total));
                            newBill.round_off = parseFloat(parseFloat(total_after_Rnd_off) - parseFloat(newBill.total)).toFixed(5);
                            newBill.total = total_after_Rnd_off;
                            newBill.total = newBill.total;// + parseFloat(newBill.expense); TODO:CLEAR THE CONCEPT
                            buying_cost = buying_cost + (parseFloat(item.ret_qty) + parseFloat(item.ret_free)) * parseFloat(item.cost);

                    }
                });

                if (flagNoData == false)
                    throw "No retuen quantity is specified";
                //Insert the Bill
                var rbillItems = [];
                var executivePoints = [];
                $(returnItems).each(function (i, billItem) {
                    rbillItems.push({
                        item_no: billItem.item_no,
                        var_no: billItem.var_no,
                        qty: billItem.fin_ret_qty,
                        free_qty: billItem.fin_ret_free,
                        unit_identity: billItem.unit_identity,
                        price: billItem.item_price,
                        discount: "0",
                        taxable_value: (parseFloat(billItem.fin_total_price) * parseFloat(billItem.tax_per)) / 100,
                        sub_total: parseFloat(billItem.item_price) * parseFloat(billItem.fin_ret_qty),
                        tax_per: billItem.tax_per,
                        total_price: (typeof overrideItems == "undefined")?parseFloat(billItem.tot_amount).toFixed(2):billItem.fin_total_price,
                        price_no: billItem.price_no,
                        bill_type: "SaleReturn",
                        tax_class_no: billItem.tax_class_no,

                        hsn_code: billItem.hsn_code,
                        cgst: billItem.cgst,
                        sgst: billItem.sgst,
                        igst: billItem.igst,
                        tray_received: (billItem.tray_received == null || billItem.tray_received == "" || typeof billItem.tray_received == "undefined") ? "0" : billItem.tray_received,
                        amount: parseFloat(billItem.cost) * (parseFloat(billItem.fin_ret_qty) + parseFloat(billItem.fin_ret_free)),

                        executive_id: (typeof overrideItems != "undefined")?((billItem.executive_id == "") ? "-1" : billItem.executive_id):"-1",
                        text_qty: (typeof overrideItems != "undefined")?(billItem.start_date + "||" + billItem.end_date):"",
                        //Item Stock Table
                        cost: billItem.cost,
                        mrp: billItem.mrp,
                        batch_no: billItem.batch_no,
                        man_date: (billItem.man_date == null || billItem.man_date == "" || typeof billItem.man_date == "undefined") ? "" : billItem.man_date,
                        expiry_date: (billItem.expiry_date == null || billItem.expiry_date == "" || typeof billItem.expiry_date == "undefined") ? "" : billItem.expiry_date,
                        stock_selection: "auto",
                        package_item: billItem.package_item,
                        item_package: billItem.package_item,
                        additional_tax: parseFloat(billItem.fin_ret_qty) * parseFloat(billItem.cess_qty_amount),
                    });
                    if (CONTEXT.SHOW_FREE && CONTEXT.ENABLE_FREE_VARIATION) {
                        if (billItem.free_var_no == undefined || billItem.free_var_no == null || billItem.free_var_no == "") { }
                        else {
                            rbillItems[rbillItems.length - 1].free_var_no = billItem.free_var_no;
                        }
                    }
                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_BARCODE) {
                        if (billItem.reward_plan_id == "0" || typeof billItem.reward_plan_id == "undefined" || billItem.reward_plan_id == null) { }
                        else {
                            executivePoints.push({
                                sales_executive_no: (billItem.executive_id == "") ? "-1" : billItem.executive_id,
                                reward_plan_id: billItem.reward_plan_id,
                                trans_date: dbDateTime($$("dsReturnPayDate").getDate()),
                                points: parseFloat(billItem.tot_amount) / parseFloat(billItem.reward_plan_point),
                                trans_type: "Debit",
                                description: "Debit",
                                setteled_amount: (parseFloat(billItem.tot_amount) * parseFloat(billItem.reward_plan_point)) / 4,

                            });
                        }
                    }
                });
                newBill.bill_items = rbillItems;
                newBill.executivePoints = executivePoints;
                var billSO = [];
                if (parseInt(parseFloat($$("txtReturnAmount").value())) != 0) {
                    billSO.push({
                    collector_id: CONTEXT.user_no,
                    pay_desc: "POS Bill Return Payment",
                    amount: Math.round(parseFloat($$("txtReturnAmount").value())),
                    pay_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    pay_type: "SaleReturn",
                    pay_mode: page.controls.ddlReturnPayBillType.selectedValue(),
                    store_no: getCookie("user_store_id"),
                    card_no: "",
                    card_type: "",
                    coupon_no:""
                });
                }
                if (typeof overrideItems == "undefined") {
                    if ($$("txtBillDiscount").value() != "0" && $$("txtBillDiscount").value() != null && $$("txtBillDiscount").value() != undefined && $$("txtBillDiscount").value() != "") {
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
                var expense = [];
                if ($$("txtExpense").value() == "" || $$("txtExpense").value() == null || typeof $$("txtExpense").value() == "undefined"){}
                else {
                    expense.push({
                        exp_name: $$("txtExpenseName").value(),
                        amount: $$("txtExpense").value()
                    });
                }
                if ($$("txtBillDiscount").value() != "0" && $$("txtBillDiscount").value() != null && $$("txtBillDiscount").value() != undefined && $$("txtBillDiscount").value() != "") {
                    expense.push({
                        exp_name: "Discount",
                        amount: $$("txtBillDiscount").value()
                    });
                }
                newBill.expenses = expense;

                var finfacts_data = [];
                var finfacts_payment_data = [];
                var finfacts_advance = [];
                var finfacts_expense = [];
                if (page.controls.ddlReturnPayBillType.selectedValue() == "Cash" || page.controls.ddlReturnPayBillType.selectedValue() == "Bank") {
                    var round_off = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount)) + (parseFloat(newBill.tax));
                    var s_with_tax = parseFloat((parseFloat(newBill.sub_total) - parseFloat(newBill.discount))).toFixed(5);
                    var ori_round_off = (parseFloat(Math.round(parseFloat(round_off)).toFixed(5) - parseFloat(round_off)));
                    finfacts_data.push({
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                        sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                        tax_amt: parseFloat(newBill.tax).toFixed(5),
                        buying_cost: buying_cost,
                        round_off: (parseFloat(ori_round_off) > 0) ? -(parseFloat(ori_round_off)) : parseFloat(ori_round_off),
                        key_2: newBill.cust_no,
                    });
                }
                finfacts_payment_data.push({
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                    paid_amount: Math.round(parseFloat($$("txtReturnAmount").value())),
                    description: "POS -" + page.currentReturnBillNo,
                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                });
                newBill.finfacts = finfacts_data;
                newBill.finfacts_payment = finfacts_payment_data;
                if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                    if ($$("txtExpense").value() != "" && $$("txtExpense").value() != "0" && $$("txtExpense").value() != null && typeof $$("txtExpense").value() != "undefined") {
                        finfacts_expense.push({
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                            expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                            amount: ($$("txtExpense").value() == "" || $$("txtExpense").value() == null || typeof $$("txtExpense").value() == "undefined") ? "0" : parseFloat($$("txtExpense").value()),
                            description: "POS Income-" + page.currentBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            key_1: page.currentBillNo,
                            key_2: newBill.cust_no,
                        });
                    }
                }
                if ($$("txtBillDiscount").value() != "" && $$("txtBillDiscount").value() != "0" && $$("txtBillDiscount").value() != null && $$("txtBillDiscount").value() != undefined) {
                    finfacts_expense.push({
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                        expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                        amount: $$("txtBillDiscount").value(),
                        description: "POS Discount-" + page.currentBillNo,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        key_1: page.currentBillNo,
                        key_2: newBill.cust_no,
                    });
                }
                newBill.finfacts_expense = finfacts_expense;
                page.stockAPI.insertBill(newBill, function (data) {
                    page.currentReturnBillNo = data;
                    /*
                    if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                        $$("msgPanel").show('Updating Finfacts!');
                        var round_off = (parseFloat(newBill.sub_total) - parseFloat(newBill.discount)) + (parseFloat(newBill.tax));
                        var s_with_tax = parseFloat((parseFloat(newBill.sub_total) - parseFloat(newBill.discount))).toFixed(5);
                        var ori_round_off =(parseFloat(Math.round(parseFloat(round_off)).toFixed(5) - parseFloat(round_off)));
                        var data1 = {
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            description: "POS Return-" + page.currentReturnBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            target_acc_id: ($$("ddlReturnPayBillType").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlReturnPayBillType").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlReturnPayBillType").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlReturnPayBillType").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                            sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                            tax_amt: parseFloat(newBill.tax).toFixed(5),
                            buying_cost: buying_cost,
                            round_off: (parseFloat(ori_round_off)>0)?-(parseFloat(ori_round_off)):parseFloat(ori_round_off),
                            key_1: page.currentReturnBillNo,
                            key_2: newBill.cust_no,
                        };
                        var data2 = {
                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                            target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                            paid_amount: Math.round(parseFloat($$("txtReturnAmount").value())),
                            description: "POS -" + page.currentReturnBillNo,
                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                            key_1: page.currentReturnBillNo,
                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        };
                        if (parseFloat(Math.round(parseFloat($$("txtReturnAmount").value()))) == parseFloat(Math.round(parseFloat($$("lblTempReturnNetAmount").value())))) {
                            page.finfactsEntryAPI.cashReturnSales(data1, function (response) {
                                if (typeof overrideItems == "undefined") {
                                    page.controls.pnlReturnPOSPopup.close();
                                }
                                $$("msgPanel").flash('Finfacts entry updated!');
                                ShowDialogBox('Message', 'Successfully returned...!', 'Ok', '', null);
                            });
                        }
                        else {
                            page.finfactsEntryAPI.creditReturnSales(data1, function (response) {
                                page.finfactsEntryAPI.creditReturnSalesPayment(data2, function (response) {
                                });
                                if (typeof overrideItems == "undefined") {
                                    page.controls.pnlReturnPOSPopup.close();
                                }
                                $$("msgPanel").flash('Finfacts entry updated!');
                                ShowDialogBox('Message', 'Successfully returned...!', 'Ok', '', null);
                            });
                        }

                        if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                            var expenseData1 = {
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                                expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                                amount: $$("txtExpense").value(),
                                description: "POS Income-" + page.currentBillNo,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                key_1: page.currentBillNo,
                                key_2: newBill.cust_no,
                            };
                            if (expenseData1.amount == null || expenseData1.amount == undefined || expenseData1.amount == "" || parseFloat(expenseData1.amount == 0)) { } else {
                                page.finfactsEntryAPI.insertBillIncome(expenseData1, function (response) { });
                            }
                        }
                        if ($$("txtBillDiscount").value() != "0" && $$("txtBillDiscount").value() != null && $$("txtBillDiscount").value() != undefined) {
                            var expenseData1 = {
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT_DEPTOR,
                                expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                                amount: $$("txtBillDiscount").value(),
                                description: "POS Discount-" + page.currentBillNo,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                key_1: page.currentBillNo,
                                key_2: newBill.cust_no,
                            };
                            if (expenseData1.amount == null || expenseData1.amount == undefined || expenseData1.amount == "" || parseFloat(expenseData1.amount == 0)) { } else {
                                page.finfactsEntryAPI.insertBillIncome(expenseData1, function (response) { });
                            }
                        }
                    }
                    else {
                        if (typeof overrideItems == "undefined") {
                            page.controls.pnlReturnPOSPopup.close();
                        }
                        ShowDialogBox('Message', 'Successfully returned...!', 'Ok', '', null);
                        
                    }
                    */
                    if (typeof overrideItems == "undefined") {
                        page.controls.pnlReturnPOSPopup.close();
                    }
                    $$("msgPanel").flash('Finfacts entry updated!');
                    ShowDialogBox('Message', 'Successfully returned...!', 'Ok', '', null);
                    if (CONTEXT.ENABLE_MODULE_TRAY == true) {
                        page.addTray(newBill, page.currentReturnBillNo);
                    }
                    if (CONTEXT.ENABLE_REWARD_MODULE == true) {
                        var newItem = {};
                        if (page.currentCust_no != "" && page.currentCust_no != null && typeof page.currentCust_no != "undefined")
                            page.customerAPI.getValue({ cust_no: page.currentCust_no }, function (data) {
                                page.rewardplanAPI.getValue({ reward_plan_id: data[0].reward_plan_id }, function (data2) {
                                    if (data2.length != 0) {
                                        page.billAPI.searchValues("", "", "bill_no=" + page.currentReturnBillNo, "", function (data1) {
                                            newItem.cust_no = data[0].cust_no;
                                            newItem.reward_plan_id = data[0].reward_plan_id;
                                            newItem.bill_no = data1[0].bill_no;
                                            newItem.trans_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            newItem.points = data1[0].total / data2[0].reward_plan_point;
                                            newItem.trans_type = "Debit";
                                            newItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                            page.customerrewardAPI.postValue(newItem, function (data) {
                                                $$("msgPanel").flash("Points added successfully.");
                                            });
                                        });
                                    } else {
                                        $$("msgPanel").flash("Customer cannot have reward plans.");
                                    }

                                });
                            });
                    }
                    if (CONTEXT.ENABLE_SALES_EXECUTIVE_REWARD == true) {
                        var newExecutiveItem = {};
                        var sales_executive_no = page.controls.ddlDeliveryBy.selectedValue();
                        if (sales_executive_no != "-1")
                            page.salesexecutiveAPI.getValue({ sale_executive_no: sales_executive_no }, function (data) {
                                page.salesExecutiveRewardPlanAPI.getValue({ reward_plan_id: data[0].reward_plan_id }, function (data2) {
                                    if (data2.length != 0) {
                                        page.billAPI.searchValues("", "", "bill_no=" + page.currentReturnBillNo, "", function (data1) {
                                            newExecutiveItem.sale_executive_no = sales_executive_no;
                                            newExecutiveItem.reward_plan_id = data[0].reward_plan_id;
                                            newExecutiveItem.bill_no = data1[0].bill_no;
                                            newExecutiveItem.trans_date = dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                            newExecutiveItem.points = data1[0].total / data2[0].reward_plan_point;
                                            newExecutiveItem.trans_type = "Debit";
                                            newExecutiveItem.description = "Debit";
                                            newExecutiveItem.setteled_amount = parseFloat(data1[0].total * data2[0].reward_plan_point) / 4;
                                            page.salesexecutiverewardAPI.postValue(newExecutiveItem, function (data) {
                                            });
                                        });
                                    } else {
                                        page.msgPanel.show("Sales Executive cannot have reward plans.");
                                    }
                                });
                            });
                    }
                    $$("msgPanel").hide();
                    if (CONTEXT.ENABLE_SALE_RETURN_BILL) {
                        if ($$("chkReturnPrintBill").prop("checked")) {
                            page.printReturnBill(page.currentReturnBillNo);
                        }
                    }
                    page.events.btnBack_click();
                });
                
            } catch (e) {
                //alert(e);
                ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnReturnPOSItemPopup").disable(false);
                $$("btnReturnPOSItemPopup").show();
            }
        }

        page.events.btnCancelBill_click = function (bill) {
            $$("msgPanel").show("Please Wait....");
            page.returnExpense = 0;
            page.returnMobileNo = bill.mobile_no;
            page.returnCustomer = bill.cust_name;
            page.returnCusEmail = bill.email;
            page.returnCusAddress = bill.cust_address;
            page.returnCusGstNo = bill.gst_no;
            $$("txtReturnAmount").value("");
            $$("txtReturnAmount").value(bill.total);
            $$("lblTempReturnAmount").value(bill.total);
            if (CONTEXT.isSalesExecutive == "true") {
                $$("ddlDeliveryBy").show();
                $$("lblSalesExe").show();
            }
            else {
                $$("ddlDeliveryBy").hide();
                $$("lblSalesExe").hide();
            }
            if (CONTEXT.ENABLE_BILL_EXPENSE_MODULES) {
                $$("pnlExpenses").show();
                $$("pnlExpenseName").show();
                $$("txtExpense").value(bill.expenses);
                page.returnExpense = parseFloat(bill.expenses);
            } else {
                $$("pnlExpenses").hide();
                $$("pnlExpenseName").hide();
                $$("txtExpense").value(bill.expenses);
                page.returnExpense = parseFloat(bill.expenses);
            }
            try {
                if (bill.state_text == "Return")
                    throw "Bill Already Returned";
                if (bill.state_text == "Saved")
                    throw "Bill Not Paid";

                $$("txtReturnPayDesc").value("CurrentBill");
                $$("dsReturnPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

                //Sales Executive
                CONTEXT.isSalesExecutive == "true" ? $$("pnlSalesExecutive").show() : $$("pnlSalesExecutive").hide();
                $$("ddlDeliveryBy").selectedValue(bill.sales_executive);

                //page.billService.getReturnedPOSBillByNo(bill.bill_no, function (rdata) {
                //page.stockAPI.getSalesBill(bill.bill_no, function (data) {
                page.billAPI.getValue(bill.bill_no, function (data) {
                    var dataitems = [];
                    $(data.bill_items).each(function (i, item) {
                        if (item.free_qty_return == undefined || item.free_qty_return == null || item.free_qty_return == "")
                            item.free_qty_return = 0;
                        if (item.free_qty == undefined || item.free_qty == null || item.free_qty == "")
                            item.free_qty = 0;
                        var qty_fact = 1;
                        var item_unit = item.unit;
                        if (item.unit_identity == "1") {
                            qty_fact = item.alter_unit_fact;
                            item_unit = item.alter_unit;
                        }
                        if (item.discount != null && item.discount != undefined) {
                            item.discount = parseFloat(item.discount) / (parseFloat(item.ordered_qty) / parseFloat(qty_fact));
                        }
                        dataitems.push({
                            batch_no: item.batch_no,
                            delivered: item.delivered,
                            expiry_date: item.expiry_date,
                            man_date: item.man_date,
                            free_qty: parseFloat(item.free_qty) / parseFloat(qty_fact),
                            free_qty_return: parseFloat(item.free_qty_return) / parseFloat(qty_fact),
                            ret_free: parseFloat(item.free_qty) / parseFloat(qty_fact),
                            item_name: item.item_name,
                            item_no: item.item_no,
                            item_price: parseFloat(item.item_price),// - parseFloat(item.discount),
                            mrp: item.mrp,
                            ordered_price: item.ordered_price,
                            ordered_qty: parseFloat(item.ordered_qty) / parseFloat(qty_fact),
                            ret_qty: parseFloat(item.ordered_qty) / parseFloat(qty_fact),
                            qty: parseFloat(parseFloat(item.qty) / parseFloat(qty_fact)) - parseFloat(parseFloat(item.free_qty) / parseFloat(qty_fact)),
                            qty_returned: parseFloat(parseFloat(item.qty_returned) / parseFloat(qty_fact)) - parseFloat(parseFloat(item.free_qty_return) / parseFloat(qty_fact)),
                            tray_id: item.tray_id,
                            cost: item.cost,
                            variation_name: item.variation_name,
                            tax_per: item.tax_per,
                            hsn_code: item.hsn_code,
                            cgst: item.cgst,
                            sgst: item.sgst,
                            igst: item.igst,
                            unit: item_unit,
                            unit_identity: item.unit_identity,
                            alter_unit_fact: item.alter_unit_fact,
                            tax_class_no: item.tax_class_no,
                            var_no: item.var_no,
                            price_no: item.price_no,
                            taxable_value: parseFloat(item.taxable_value) / parseFloat(parseFloat(item.ordered_qty) / parseFloat(qty_fact)),
                            tax_inclusive: item.tax_inclusive,
                            rack_no: item.rack_no
                        });
                    })
                    $$("grdReturnPOSItems").dataBind(dataitems);
                    $$("grdReturnPOSItems").edit(true);
                    page.events.btnReturnPOSItemPopup_click("Cancel");
                    $$("msgPanel").hide();
                });
                $$("grdReturnPOSItems").width("2300px");
                $$("grdReturnPOSItems").height("auto");
                $$("grdReturnPOSItems").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "", 'width': "1px", 'dataField': "order_item_id", editable: false },
                            { 'name': "Item No", 'rlabel': 'Item No', 'width': "80px", 'dataField': "item_no", editable: false },
                            { 'name': "Item Name", 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", editable: false },
                            { 'name': "Rack No", 'rlabel': 'Rack No', 'width': "100px", 'dataField': "rack_no", visible: CONTEXT.ENABLE_RACK },
                            { 'name': "Unit", 'rlabel': 'Unit', 'width': "80px", 'dataField': "unit", editable: false },
                            { 'name': "Stocked", 'rlabel': 'Stocked', 'width': "60px", 'dataField': "qty", editable: false },
                            { 'name': "Returned", 'rlabel': 'Returned', 'width': "90px", 'dataField': "qty_returned", editable: false },
                            { 'name': "Return Qty", 'rlabel': 'Return Qty', 'width': "100px", 'dataField': "ret_qty", editable: true },
                            { 'name': "Free Qty", 'rlabel': 'Free Qty', 'width': "80px", 'dataField': "free_qty", editable: false, visible: CONTEXT.showFree },
                            { 'name': "Returned Free", 'rlabel': 'Returned Free', 'width': "110px", 'dataField': "free_qty_return", editable: false, visible: CONTEXT.showFree },
                            { 'name': "Free Item", 'rlabel': 'Free Item', 'width': "100px", 'dataField': "ret_free", editable: true, visible: CONTEXT.showFree },
                            { 'name': "Tray", 'rlabel': 'Tray', 'width': "100px", 'dataField': "tray_received", editable: true, visible: CONTEXT.ENABLE_MODULE_TRAY },
                            { 'name': "Variation", 'rlabel': 'Variation', 'width': "120px", 'dataField': "variation_name", visible: CONTEXT.showVariation },
                            { 'name': "MRP", 'rlabel': 'MRP', 'width': "70px", 'dataField': "mrp", visible: CONTEXT.ENABLE_MRP },
                            { 'name': "Man Date", 'rlabel': 'Man Date', 'width': "100px", 'dataField': "man_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Expiry Date", 'rlabel': 'Exp Date', 'width': "100px", 'dataField': "expiry_date", visible: CONTEXT.ENABLE_EXP_DATE }, //page.currentPO.state_text == "Created", visible: CONTEXT.ENABLE_EXP_DATE },
                            { 'name': "Batch No", 'rlabel': 'Batch No', 'width': "80px", 'dataField': "batch_no", visible: CONTEXT.ENABLE_BAT_NO },
                            { 'name': "Price to return", 'rlabel': 'Price to return', 'width': "160px", 'dataField': "item_price" },//, editable: false },
                            { 'name': "Tax", 'rlabel': 'GST', 'width': "40px", 'dataField': "tax_per" },
                            { 'name': "HSN Code", 'rlabel': 'HSN Code', 'width': "100px", 'dataField': "hsn_code", visible: CONTEXT.showHsnCode },
                            { 'name': "CGST", 'rlabel': 'CGST', 'width': "60px", 'dataField': "cgst" },
                            { 'name': "SGST", 'rlabel': 'SGST', 'width': "60px", 'dataField': "sgst" },
                            { 'name': "IGST",'rlabel': 'IGST', 'width': "60px", 'dataField': "igst" },
                            { 'name': "Amount", 'rlabel': 'Amount', 'width': "100px", 'dataField': "tot_amount" },
                            { 'name': "", 'width': "0px", 'dataField': "price", editable: false },
                            { 'name': "", 'width': "0px", 'dataField': "qty_const" },
                            { 'name': "", 'width': "0px", 'dataField': "tray_id" },
                            { 'name': "", 'width': "0px", 'dataField': "amount" },
                            { 'name': "", 'width': "0px", 'dataField': "unit_identity" },
                            { 'name': "", 'width': "0px", 'dataField': "alter_unit_fact" },
                            { 'name': "", 'width': "1px", 'dataField': "cost" },
                            { 'name': "", 'width': "1px", 'dataField': "var_no" },
                            { 'name': "", 'width': "0px", 'dataField': "taxable_value", visible: false },
                            { 'name': "", 'width': "0px", 'dataField': "tax_inclusive" },
                    ]
                });
            } catch (e) {
                $$("msgPanel").show(e);
            }
        }
        page.events.btnReceipt_click = function () {
            page.controls.pnlBillReceipt.open();
            page.controls.pnlBillReceipt.title("Bill Receipt Screen");
            page.controls.pnlBillReceipt.rlabel("Bill Receipt Screen");
            page.controls.pnlBillReceipt.width(600);
            page.controls.pnlBillReceipt.height(500);

            $$("grdBillReceipt").width("100%");
            $$("grdBillReceipt").height("220px");
            $$("grdBillReceipt").setTemplate({
                selection: "Single",
                columns: [
                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "60px", 'dataField': "bill_no" },
                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "110px", 'dataField': "bill_date" },
                    { 'name': "Bill Amount", 'rlabel': 'Amount', 'width': "120px", 'dataField': "total" },
                    { 'name': "Paid", 'rlabel': 'Paid Amt', 'width': "100px", 'dataField': "total_paid_amount" },
                   // { 'name': "", 'width': "50px", 'dataField': "pay_type", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }
                ]
            });
            //Handle Row Command
            page.controls.grdBillReceipt.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "Delete") {
                    page.controls.grdBillReceipt.deleteRow(rowId);
                }
            }
            page.controls.grdBillReceipt.dataBind([]);
            $$("txtBillNo").focus();
        }
        page.events.btnBillSearch_click = function () {
            try{
                if(isNaN($$("txtBillNo").value()) || parseFloat($$("txtBillNo").value()) <= 0)
                    throw "Bill No Should Be A Number And Non Negative";
                var temp_search = $$("txtBillNo").value();
                if (temp_search.startsWith("00")) {
                    temp_search = (temp_search.substring(0, temp_search.length - 2));
                }
                $$("txtBillNo").value(temp_search);
                //page.billService.getBillByReceipt($$("txtBillNo").value(), function (data) {
                page.billPayTransactionAPI.searchValues("", "", $$("txtBillNo").value(), "", function (data) {
                    if (data.length == 0) {
                        alert("Please Check Your Bill No");
                    }
                    else {
                        //Update search result
                        page.controls.grdBillReceipt.dataBind(data);
                        $$("txtBillNo").value("");
                        $$("txtBillNo").focus();
                    }
                })
            }
            catch (e) {
                
            }
        }
        page.events.btnPrintTocken_click = function () {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var sl_no = 1;
            var grand_total = 0;
            var offset = 0;
            var paid_amt = 0;
            var received_amt = 0;
            var printBox = {
                PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                Width: 280,
                Height: 1500,
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
            var t1 = (CONTEXT.COMPANY_NAME).length;
            (t1 > 22) ? t1 = 22 : t1 = t1;
            var t2 = t1 / 2;
            var t3 = t2 * 12.72;
            var com_start = parseInt(140 - t3);
            var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
            (t4 > 22) ? t4 = 22 : t4 = t4;
            var t5 = t4 / 2;
            var t6 = t5 * 12;
            var add_start = parseInt(140 - t6);
            printBox.Lines.push({ StartX: 35, StartY: 35, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 18, FontStyle: 16 });
            printBox.Lines.push({ StartX: 0, StartY: 80, Text: "Cashier :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 45, StartY: 80, Text: CONTEXT.user_name, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 160, StartY: 80, Text: "Date :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 190, StartY: 80, Text: date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 0, StartY: 100, Text: "", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 45, StartY: 100, Text: "", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 160, StartY: 100, Text: "Time :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 190, StartY: 100, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

            printBox.Lines.push({ StartX: 0, StartY: 115, Text: "----------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

            //Header
            printBox.Lines.push({ StartX: 0, StartY: 128, Text: "S.No", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 50, StartY: 128, Text: "BillNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 200, StartY: 128, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 0, StartY: 140, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

            offset = 155;
            $(page.controls.grdBillReceipt.allData()).each(function (i, item) {
                printBox.Lines.push({ StartX: 0, StartY: offset, Text: sl_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: 50, StartY: offset, Text: item.bill_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: 200, StartY: offset, Text: item.total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                sl_no++;
                if (item.state_text == "Sale")
                    grand_total = parseFloat(grand_total) + parseFloat(item.total);
                else
                    grand_total = parseFloat(grand_total) - parseFloat(item.total);
                paid_amt = parseFloat(paid_amt) + parseFloat(item.paid);
                offset += 15;
                received_amt = item.received_amount;
            });

            printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

            printBox.Lines.push({ StartX: 100, StartY: offset += 15, Text: "Total(Rs) :", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
            printBox.Lines.push({ StartX: 160, StartY: offset, Text: grand_total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

            printBox.Lines.push({ StartX: 0, StartY: offset += 15, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

            printBox.Lines.push({ StartX: 0, StartY: offset += 10, Text: "CASH AMOUNT", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
            printBox.Lines.push({ StartX: 200, StartY: offset, Text: grand_total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

            printBox.Lines.push({ StartX: 15, StartY: offset += 20, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
            printBox.Lines.push({ StartX: 170, StartY: offset, Text: received_amt, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

            printBox.Lines.push({ StartX: 15, StartY: offset += 15, Text: "Refund", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
            printBox.Lines.push({ StartX: 170, StartY: offset, Text: parseFloat(received_amt) - parseFloat(grand_total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

            printBox.Lines.push({ StartX: 0, StartY: offset += 15, Text: "--------------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 0 });

            printBox.Lines.push({ StartX: 50, StartY: offset += 15, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

            PrintService.PrintReceipt(printBox);
        }
        page.events.btnPendingPayment_click = function () {
            try{
                if (!CONTEXT.ADMIN) {
                    throw "You Don't Have The Previlages To Pay Pending Contact Your Admin!!!";
                }
                else {
                    page.controls.pnlPayPending.show();
                    page.controls.pnlSales.hide();
                    page.controls.pnlBill.hide();
                    //page.controls.ucSalesPayment.createPending();
                    paymentPage = 1;
                    page.setPendingPage();
                }
                //else {
                //    $$("lblTotalAmount").value("0");
                //    $$("lblTotalPendingAmount").value(0);
                //    $$("txtReceivedAmount").value("0");
                //    $$("lblPaymentBalance").value("0.00");
                //    $$("txtPendingPaymentDiscount").value("0");
                //    $$("txtReceivedAmount").disable(false);
                //    $$("btnPayPending").disable(false);
                //    $$("btnPayPending").show();
                //    $$("pnlSales").hide();
                //    $$("pnlBill").hide();
                //    page.discount = 0;
                //    page.controls.pnlPayPending.show();
                //    page.controls.pnlSales.hide();
                //    $("br").css("display", "none");
                //    page.view.selectedPendingPayment([]);
                //    $$("pnlCardType").hide();
                //    $$("pnlCouponNo").hide();
                //    $$("pnlCardNo").hide();
                //    $$("txtSearchBillNo").value("");
                //    $$("txtSearchBillNo").focus();
                //    $$("ddlBillView").selectedValue("Bill View");
                //    $$("ddlPayBillType").selectedValue("Select");
                //    if (CONTEXT.ENABLE_CASHIER_BILL) {
                //        $$("chkPrintBill").prop('checked', true);
                //    }
                //    else {
                //        $$("chkPrintBill").prop('checked', false);
                //    }

                //    page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                //        $$("ddlCustName").dataBind(data, "cust_no", "cust_name", "All");
                //    });

                //    $$("txtPendingPayDesc").value("CurrentBill");
                //    $$("dsPendingPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));

                //    $$("ddlBillView").selectionChange(function () {
                //        $$("lblTotalAmount").value("0");
                //        $$("lblTotalPendingAmount").value(0);
                //        $$("txtReceivedAmount").value("0");
                //        $$("lblPaymentBalance").value("0.00");
                //        $$("txtPendingPaymentDiscount").value("0");
                //        var loan_data = {};
                //        loan_data.cust_no = $$("ddlCustName").selectedValue();
                //        loan_data.bill_type = $$("ddlPayBillType").selectedValue();

                //        if ($$("ddlBillView").selectedValue() == "Payment View") {
                //            $$("pnlPendingReceivedAmount").hide();
                //            $$("pnlPendingPayButton").hide();
                //            $$("pnlPendingPaidAmount").hide();
                //            page.billPaymentAPI.searchValues("", "", "bill_type='" + loan_data.bill_type + "' and ifnull(cust_no,'')=" + loan_data.cust_no, "", function (data) {
                //                page.view.selectedPendingPayment(data);
                //                page.controls.grdPendingPayment.edit(false);
                //            });

                //        }
                //        else {
                //            $$("pnlPendingReceivedAmount").show();
                //            $$("pnlPendingPayButton").show();
                //            $$("pnlPendingPaidAmount").show();
                //            var filter = {};
                //            filter.viewMode = "Standard";
                //            filter.fromDate = "";
                //            filter.toDate = "";
                //            filter.bill_type = $$("ddlPayBillType").selectedValue();
                //            filter.item_no = "";
                //            filter.status = "";
                //            filter.cust_no = $$("ddlCustName").selectedValue();
                //            var payment_data = [];
                //            if (filter.cust_no == "" || filter.cust_no == "-1") {
                //                page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "'", "", function (data) {
                //                    $(data).each(function (i, item) {
                //                        if (parseFloat(item.total) != parseFloat(item.paid)) {
                //                            payment_data.push({
                //                                bill_no: item.bill_no,
                //                                bill_id: item.bill_id,
                //                                bill_date: item.bill_date,
                //                                bill_type: item.bill_type,
                //                                cust_no: item.cust_no,
                //                                cust_name: item.cust_name,
                //                                total: item.total,
                //                                total_paid_amount: item.paid,
                //                                expense_amt: item.expense,
                //                                balance: parseFloat(item.total) - parseFloat(item.paid),
                //                                sch_id: item.sch_id,
                //                                due_date: item.due_date
                //                            })
                //                        }
                //                    })
                //                    page.view.selectedPendingPayment(payment_data);
                //                });
                //            }
                //            else {
                //                page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "' and ifnull(b.cust_no,'')=" + filter.cust_no, "", function (data) {
                //                    $(data).each(function (i, item) {
                //                        if (parseFloat(item.total) != parseFloat(item.paid)) {
                //                            payment_data.push({
                //                                bill_no: item.bill_no,
                //                                bill_id: item.bill_id,
                //                                bill_date: item.bill_date,
                //                                bill_type: item.bill_type,
                //                                cust_no: item.cust_no,
                //                                cust_name: item.cust_name,
                //                                total: item.total,
                //                                total_paid_amount: item.paid,
                //                                expense_amt: item.expense,
                //                                balance: parseFloat(item.total) - parseFloat(item.paid),
                //                                sch_id: item.sch_id,
                //                                due_date: item.due_date
                //                            })
                //                        }
                //                    })
                //                    page.view.selectedPendingPayment(payment_data);
                //                });
                //            }
                //        }
                //    });
                //    $$("ddlPayBillType").selectionChange(function () {
                //        $$("lblTotalAmount").value(parseFloat(0));
                //        $$("lblTotalPendingAmount").value(0);
                //        $$("txtReceivedAmount").value(parseFloat(0));
                //        $$("lblPaymentBalance").value("0.00");
                //        //Get the all bill details
                //        var filter = {};
                //        filter.viewMode = "Standard";
                //        filter.fromDate = "";
                //        filter.toDate = "";
                //        filter.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();
                //        filter.item_no = "";
                //        filter.status = "";
                //        filter.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                //        var payment_data = [];
                //        if (filter.cust_no == "" || filter.cust_no == "-1") {
                //            page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "'", "", function (data) {
                //                $(data).each(function (i, item) {
                //                    if (parseFloat(item.total) != parseFloat(item.paid)) {
                //                        payment_data.push({
                //                            bill_no: item.bill_no,
                //                            bill_id: item.bill_id,
                //                            bill_date: item.bill_date,
                //                            bill_type: item.bill_type,
                //                            cust_no: item.cust_no,
                //                            cust_name: item.cust_name,
                //                            total: item.total,
                //                            total_paid_amount: item.paid,
                //                            expense_amt: item.expense,
                //                            balance: parseFloat(item.total) - parseFloat(item.paid),
                //                            sch_id: item.sch_id,
                //                            due_date: item.due_date
                //                        })
                //                    }
                //                })
                //                page.view.selectedPendingPayment(payment_data);
                //            });
                //        }
                //        else {
                //            page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "' and ifnull(b.cust_no,'')=" + filter.cust_no, "", function (data) {
                //                $(data).each(function (i, item) {
                //                    if (parseFloat(item.total) != parseFloat(item.paid)) {
                //                        payment_data.push({
                //                            bill_no: item.bill_no,
                //                            bill_id: item.bill_id,
                //                            bill_date: item.bill_date,
                //                            bill_type: item.bill_type,
                //                            cust_no: item.cust_no,
                //                            cust_name: item.cust_name,
                //                            total: item.total,
                //                            total_paid_amount: item.paid,
                //                            expense_amt: item.expense,
                //                            balance: parseFloat(item.total) - parseFloat(item.paid),
                //                            sch_id: item.sch_id,
                //                            due_date: item.due_date
                //                        })
                //                    }
                //                })
                //                page.view.selectedPendingPayment(payment_data);
                //            });
                //        }
                //    })

                //    $$("ddlPayMode").selectionChange(function () {
                //        if ($$("ddlPayMode").selectedValue() == "Cash") {
                //            $$("pnlCardType").hide();
                //            $$("pnlCardNo").hide();
                //            $$("pnlCouponNo").hide();
                //        }
                //        if ($$("ddlPayMode").selectedValue() == "Card") {
                //            $$("pnlCardType").hide();
                //            $$("pnlCouponNo").hide();
                //            $$("pnlCardNo").hide();
                //        }
                //        if ($$("ddlPayMode").selectedValue() == "Coupon") {
                //            $$("pnlCardType").hide();
                //            $$("pnlCouponNo").hide();
                //            $$("pnlCardNo").hide();
                //        }
                //    });
                //}
            }
            catch (e) {
                alert(e);
            }
        }
        page.setPendingPage = function () {
            var billPage = parseInt(paymentPage) % 4;
            (billPage == 1) ? page.events.btnPayment1_click() : (billPage == 2) ? page.events.btnPayment2_click() : (billPage == 3) ? page.events.btnPayment3_click() : page.events.btnPayment4_click();
        }
        page.events.btnPayment1_click = function () {
            $$("btnPayment1").selectedObject.css("border-bottom", "solid 3px green");
            $$("btnPayment2").selectedObject.css("border-bottom", "none");
            $$("btnPayment3").selectedObject.css("border-bottom", "none");
            $$("btnPayment4").selectedObject.css("border-bottom", "none");
            $$("pnlBillPaymentPage1").show();
            $$("pnlBillPaymentPage2").hide();
            $$("pnlBillPaymentPage3").hide();
            $$("pnlBillPaymentPage4").hide();
            $$("currentUC1").focus();
        }
        page.events.btnPayment2_click = function () {
            $$("btnPayment1").selectedObject.css("border-bottom", "none");
            $$("btnPayment2").selectedObject.css("border-bottom", "solid 3px green");
            $$("btnPayment3").selectedObject.css("border-bottom", "none");
            $$("btnPayment4").selectedObject.css("border-bottom", "none");
            $$("pnlBillPaymentPage1").hide();
            $$("pnlBillPaymentPage2").show();
            $$("pnlBillPaymentPage3").hide();
            $$("pnlBillPaymentPage4").hide();
            $$("currentUC2").focus();
        }
        page.events.btnPayment3_click = function () {
            $$("btnPayment1").selectedObject.css("border-bottom", "none");
            $$("btnPayment2").selectedObject.css("border-bottom", "none");
            $$("btnPayment3").selectedObject.css("border-bottom", "solid 3px green");
            $$("btnPayment4").selectedObject.css("border-bottom", "none");
            $$("pnlBillPaymentPage1").hide();
            $$("pnlBillPaymentPage2").hide();
            $$("pnlBillPaymentPage3").show();
            $$("pnlBillPaymentPage4").hide();
            $$("currentUC3").focus();
        }
        page.events.btnPayment4_click = function () {
            $$("btnPayment1").selectedObject.css("border-bottom", "none");
            $$("btnPayment2").selectedObject.css("border-bottom", "none");
            $$("btnPayment3").selectedObject.css("border-bottom", "none");
            $$("btnPayment4").selectedObject.css("border-bottom", "solid 3px green");
            $$("pnlBillPaymentPage1").hide();
            $$("pnlBillPaymentPage2").hide();
            $$("pnlBillPaymentPage3").hide();
            $$("pnlBillPaymentPage4").show();
            $$("currentUC4").focus();
        }
        page.events.btnSearchBill_click = function () {
            try {
                var str = $$("txtSearchBillNo").value();
                if (str.startsWith("00")) {
                    str=(parseInt(str.substring(0, str.length - 1)));
                    //str = (parseInt(str.substring(0, str.length)));
                }
                $$("txtSearchBillNo").value(str);
                if (isNaN($$("txtSearchBillNo").value()) || parseFloat($$("txtSearchBillNo").value()) <= 0)
                    throw "Bill No Should Be A Number And Non Negative";
                page.billAPI.searchValues("", "", "b.bill_no="+$$("txtSearchBillNo").value(),"", function (data) {
                    var payment_data = [];
                    $(data).each(function (i, item) {
                        if (parseFloat(item.balance) != 0) {
                            payment_data.push({
                                bill_no: item.bill_no,
                                bill_id: item.bill_id,
                                bill_date: item.bill_date,
                                bill_type: item.bill_type,
                                cust_no: item.cust_no,
                                cust_name: item.cust_name,
                                total: item.total,
                                total_paid_amount: item.paid,
                                expense_amt: item.expense,
                                balance: parseFloat(item.total) - parseFloat(item.paid),
                                sch_id: item.sch_id,
                                due_date: item.due_date
                            })
                        }
                    });
                    if (payment_data.length != 0)
                    {
                        var rows = page.controls.grdPendingPayment.getRow({
                            bill_no: payment_data[0].bill_no
                        });
                        if (rows.length == 0) {
                            page.controls.grdPendingPayment.createRow(payment_data[0]);
                            page.controls.grdPendingPayment.edit(true);
                        }
                        else {
                            alert("This Bill Is Already Scanned");
                        }
                    }
                    else {
                        alert("Incorrect Bill No Or No Balance");
                    }
                    $$("txtSearchBillNo").value("");
                });
            }
            catch (e) {

            }
        }
        page.events.btnPayPendingBack_click = function () {
            page.controls.pnlPayPending.hide();
            page.controls.pnlSales.show();
            $("br").css("display", "block");
            $$("grdSales").dataBind({
                getData: function (start, end, sortExpression, filterExpression, callback) {
                    //page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                        var totalRecord = page.bill_count;
                        page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            callback(data, totalRecord);
                        });
                    //});
                },
                update: function (item, updatedItem) {
                    for (var prop in updatedItem) {
                        if (!updatedItem.hasOwnProperty(prop)) continue;
                        item[prop] = updatedItem[prop];
                    }
                }
            });
        }
        page.events.btnPayPending_click = function () {
            $$("btnPayPending").disable(true);
            $$("btnPayPending").hide();
            var allBillSO = [];
            var data1 = [];
            var data2 = [];
            var finfacts_expense = [];
            var bill_no_par = 0;
            var bill_no_par_check = true;
            try {
                var countNoAmount = false;
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (parseFloat(item.amount_pay) < 0)
                        countNoAmount = true;
                    if (parseFloat(item.balance) == 0)
                        countNoAmount = true;
                    if (parseFloat(item.amount_pay) > parseFloat(item.balance))
                        countNoAmount = true;
                });
                if (countNoAmount)
                    throw "Please check the amount...!";
                //if (($$("ddlPayMode").selectedValue() == "Card") && ($$("txtCardNo").val() == ""))
                //    throw "Card no should be mantatory";
                //if (($$("ddlPayMode").selectedValue() == "Coupon") && ($$("txtCouponNo").val() == ""))
                //    throw "Coupon no should be mantatory";
                if ($$("ddlPayMode").selectedValue() == "" || $$("ddlPayMode").selectedValue() == null)
                    throw "Select mode of pay...!";
                //Get all payment details in grid
                var bill_trans_data = {
                    receive_amount: $$("txtReceivedAmount").value(),
                    bill_amount: $$("lblTotalAmount").value(),
                }
                $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                    if (parseFloat(item.amount_pay) > 0) {
                        page.expense_amt = item.expense_amt;
                        if (bill_no_par_check) {
                            bill_no_par = item.bill_no;
                            bill_no_par_check = false;
                        }
                        allBillSO.push({
                            collector_id: CONTEXT.user_no,
                            pay_desc: "POS Bill Payment",
                            amount: item.amount_pay,
                            bill_no: item.bill_no,
                            pay_date: dbDateTime($$("dsPendingPayDate").getDate()),//$.datepicker.formatDate("dd-mm-yy", new Date()),
                            pay_type: $$("ddlPayBillType").selectedValue(),
                            pay_mode: $$("ddlPayMode").selectedValue(),
                            card_type: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Coupon") ? "" : $$("ddlCardType").selectedValue(),
                            card_no: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Coupon") ? "" : $$("txtCardNo").val(),
                            coupon_no: ($$("ddlPayMode").selectedValue() == "Cash" || $$("ddlPayMode").selectedValue() == "Card") ? "" : $$("txtCouponNo").val(),
                            //trans_id: data[0].key_value
                        });
                        //if ($$("ddlPayBillType").selectedValue() == "Sale") {
                        if(item.bill_type == "Sale"){
                            data1.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPayMode").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POS-" + item.bill_no,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: item.bill_no,
                                key_2: $$("ddlCustName").selectedValue(),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                        else {
                            data2.push({
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                target_acc_id: ($$("ddlPayMode").selectedValue() == "Cash") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Card") ? CONTEXT.FINFACTS_SALES_DEF_BANK_ACCOUNT : ($$("ddlPayMode").selectedValue() == "Coupon") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTCoupon : ($$("ddlPayMode").selectedValue() == "Reward") ? CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNTReward : CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                //amount: item.amount_pay,
                                paid_amount: item.amount_pay,
                                description: "POS Return-" + item.bill_no,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                key_1: item.bill_no,
                                key_2: $$("ddlCustName").selectedValue(),
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                            });
                        }
                    }
                });
                if (parseInt(page.discount) != 0) {
                    finfacts_expense.push({
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        target_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_ACCOUNT,
                        expense_acc_id: CONTEXT.FINFACTS_BILL_EXPENSE_CATEGORY,
                        amount: parseInt(page.discount),
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        key_2: $$("ddlCustName").selectedValue(),
                    });
                }
                var data = {
                    receive_amount: parseFloat($$("txtReceivedAmount").value()) + parseFloat(page.discount),
                    bill_amount: parseFloat($$("lblTotalAmount").value()) + parseFloat(page.discount),
                    payment_data: allBillSO,
                    finfacts_sale_data: data1,
                    finfacts_return_data: data2,
                    discount_amount: page.discount,
                    finfacts_expense: finfacts_expense,
                    bill_no_par: bill_no_par
                }
                page.billPaymentAPI.postAllValue(data, function (data) {
                    $$("msgPanel").flash("Successfully paid...!");
                    $$("btnPayPending").disable(false);
                    $$("btnPayPending").show();
                    if ($$("chkPrintBill").prop("checked")) {
                        $$("msgPanel").flash("Printing the selected Bill.Please wait.");
                        var sl_no = 1;
                        var grand_total = 0;
                        var offset = 0;
                        var printBox = {
                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                            Width: 280,
                            Height: 1500,
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

                        var t1 = (CONTEXT.COMPANY_NAME).length;
                        (t1 > 22) ? t1 = 22 : t1 = t1;
                        var t2 = t1 / 2;
                        var t3 = t2 * 12.72;
                        //var com_start = parseInt(140 - t3);
                        var com_start = Math.round(t1 / 2);
                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                        (t4 > 22) ? t4 = 22 : t4 = t4;
                        var t5 = t4 / 2;
                        var t6 = t5 * 12;
                        var add_start = parseInt(140 - t6);
                        var refundAmount = (parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())) < 0 ? 0 : (parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value()));
                        var bills = [];
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            bills.push({
                                SlNo: i + 1,
                                BillNo:convertBitString(item.bill_no.toString(),13),
                                Amount: (item.bill_type == "Sale") ? item.total : -item.total
                            });
                        });
                        var printData = {
                            CompanyName: CONTEXT.COMPANY_NAME,
                            Address: CONTEXT.COMPANY_ADDRESS_LINE1.substring(0, 15),
                            Copies: 1,
                            Cashier: CONTEXT.user_name,
                            Date:date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear(),
                            Time: currentDate,
                            TotalAmount: parseFloat(parseFloat($$("lblTotalAmount").value()) + parseFloat(page.discount)).toFixed(2),
                            Discount: parseFloat(page.discount).toFixed(2),
                            CashAmount: parseFloat($$("lblTotalAmount").value()).toFixed(2),
                            Received: parseFloat($$("txtReceivedAmount").value()).toFixed(2),
                            Refund: parseFloat(refundAmount).toFixed(2),
                            Bills: bills
                        }
                        PrintService.PrintPOSCashReceipt(printData);
                        /*printBox.Lines.push({ StartX: 70, StartY: 30, ImageText: "Image", FontFamily: "Agency FB", FontSize: 18, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 70, StartY: 15, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 18, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 50, StartY: 55, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 160, StartY: 80, Text: "Date :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 190, StartY: 80, Text: date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "Cashier :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 45, StartY: 100, Text: CONTEXT.user_name, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 160, StartY: 100, Text: "Time :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                        printBox.Lines.push({ StartX: 0, StartY: 115, Text: "----------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                        //Header
                        printBox.Lines.push({ StartX: 0, StartY: 128, Text: "S.No", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 50, StartY: 128, Text: "BillNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 200, StartY: 128, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 0, StartY: 140, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                        offset = 155;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: sl_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 50, StartY: offset, Text: item.bill_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 200, StartY: offset, Text: (item.bill_type == "Sale") ? item.total : -item.total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            sl_no++;
                            grand_total = parseFloat(grand_total) + parseFloat(item.total);
                            offset += 15;
                        });

                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                        printBox.Lines.push({ StartX: 100, StartY: offset += 15, Text: "Total(Rs) :", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 160, StartY: offset, Text: parseFloat(parseFloat($$("lblTotalAmount").value()) + parseFloat($$("txtPendingPaymentDiscount").value())).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                        if (parseFloat(page.discount) != 0) {
                            printBox.Lines.push({ StartX: 100, StartY: offset += 15, Text: "Discount :", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 160, StartY: offset, Text: parseFloat(page.discount).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                        }

                        printBox.Lines.push({ StartX: 0, StartY: offset += 15, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                        printBox.Lines.push({ StartX: 0, StartY: offset += 10, Text: "CASH AMOUNT", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 200, StartY: offset, Text: parseFloat($$("lblTotalAmount").value()).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                        printBox.Lines.push({ StartX: 15, StartY: offset += 20, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset, Text: parseFloat($$("txtReceivedAmount").value()).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                        printBox.Lines.push({ StartX: 15, StartY: offset += 15, Text: "Refund", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset, Text: parseFloat(refundAmount).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                        printBox.Lines.push({ StartX: 0, StartY: offset += 15, Text: "--------------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 50, StartY: offset += 15, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                        PrintService.PrintReceipt(printBox);*/
                        page.view.selectedPendingPayment([]);
                        $$("txtPendingPaymentDiscount").value("");
                        $$("lblPaymentBalance").value("0.00");
                        page.discount = 0;
                        $$("txtSearchBillNo").focus();
                    }
                    else {
                        page.view.selectedPendingPayment([]);
                        $$("txtPendingPaymentDiscount").value("");
                        $$("lblPaymentBalance").value("0.00");
                        page.discount = 0;
                        $$("txtSearchBillNo").focus();
                    }
                    if (CONTEXT.ENABLE_SUBSCRIPTION) {
                        $$("lblTotalAmount").value(parseFloat(0));
                        $$("lblTotalPendingAmount").value(parseFloat(0));
                        $$("txtReceivedAmount").value(parseFloat(0));
                        var filter = {};
                        filter.viewMode = "Standard";
                        filter.fromDate = "";
                        filter.toDate = "";
                        filter.bill_type = ($$("ddlPayBillType").selectedValue() == "Select") ? "" : $$("ddlPayBillType").selectedValue();
                        filter.item_no = "";
                        filter.status = "";
                        filter.cust_no = $$("ddlCustName").selectedValue() == -1 ? "" : $$("ddlCustName").selectedValue();
                        var payment_data = [];
                        if (filter.cust_no == "" || filter.cust_no == "-1") {
                            page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "'", "", function (data) {
                                $(data).each(function (i, item) {
                                    if (parseFloat(item.total) != parseFloat(item.paid)) {
                                        payment_data.push({
                                            bill_no: item.bill_no,
                                            bill_date: item.bill_date,
                                            bill_type: item.bill_type,
                                            cust_no: item.cust_no,
                                            cust_name: item.cust_name,
                                            total: item.total,
                                            total_paid_amount: item.paid,
                                            expense_amt: item.expense,
                                            balance: parseFloat(item.total) - parseFloat(item.paid),
                                            sch_id: item.sch_id,
                                            due_date: item.due_date
                                        })
                                    }
                                })
                                page.view.selectedPendingPayment(payment_data);

                            });
                        }
                        else {
                            page.billAPI.searchValues("", "", "ifnull(b.pay_mode,'') <> 'EMI' and b.bill_type='" + filter.bill_type + "' and ifnull(b.cust_no,'')=" + filter.cust_no, "", function (data) {
                                $(data).each(function (i, item) {
                                    if (parseFloat(item.total) != parseFloat(item.paid)) {
                                        payment_data.push({
                                            bill_no: item.bill_no,
                                            bill_date: item.bill_date,
                                            bill_type: item.bill_type,
                                            cust_no: item.cust_no,
                                            cust_name: item.cust_name,
                                            total: item.total,
                                            total_paid_amount: item.paid,
                                            expense_amt: item.expense,
                                            balance: parseFloat(item.total) - parseFloat(item.paid),
                                            sch_id: item.sch_id,
                                            due_date: item.due_date
                                        })
                                    }
                                })
                                page.view.selectedPendingPayment(payment_data);
                            });
                        }
                    }
                        
                });
            } catch (e) {
                alert(e);
                //ShowDialogBox('Warning', e, 'Ok', '', null);
                $$("btnPayPending").disable(false);
                $$("btnPayPending").show();
            }
        }
        page.events.btnPayEMI_click = function () {
            page.controls.pnlEMIPayment.open();
            page.controls.pnlEMIPayment.title("EMI Payment Panel");
            page.controls.pnlEMIPayment.rlabel("EMI Payment Panel");
            page.controls.pnlEMIPayment.width(1200);
            page.controls.pnlEMIPayment.height(500);
            page.view.selectedPendingEMIPayment([]);
            $$("dsEMIPendingPayDate").setDate($.datepicker.formatDate("mm-dd-yy", new Date()));
            $$("txtEMIBillNo").value("");
            $$("btnEMIPay").disable(false);
            $$("lblEMICustomer").html("");
            $$("lblEMIBalance").html("0.00");
            $$("txtEMIPayAmount").value("");
        }
        page.events.btnEMIBillSearch_click = function () {
            page.controls.grdEMIBill.dataBind([]);
            page.controls.txtEMIPayAmount.value("");
            try {
                if (isNaN($$("txtEMIBillNo").value()) || parseFloat($$("txtEMIBillNo").value()) <= 0)
                    throw "Bill No Should Be A Number And Non Negative";
                var temp_search = $$("txtEMIBillNo").value();
                if (temp_search.startsWith("00")) {
                    temp_search = (temp_search.substring(0, temp_search.length - 2));
                }
                $$("txtEMIBillNo").value(temp_search);
                page.billScheduleAPI.getValue($$("txtEMIBillNo").value(), function (data) {
                    if (data.length == 0) {
                        alert("Please Check Your Bill No");
                    }
                    else {
                        $$("lblEMICustomer").html(data[0].cust_name);
                        var emiBalance = 0;
                        $(data).each(function (i, item) {
                            var data1 = {
                                temp_schedule_id: item.temp_schedule_id,
                                schedule_id: item.schedule_id,
                                bill_no:item.bill_no,
                                schedule_date: item.schedule_date,
                                due_date: item.due_date,
                                amount: item.amount,
                                paid: item.paid,
                                balance: item.balance,
                                pay_amount: (item.status == "Open") ? "0" : item.balance,
                                status: item.status,
                                bill_id:item.bill_id
                            }
                            emiBalance = parseFloat(emiBalance) + parseFloat(item.balance);
                            page.controls.lblEMIBalance.html(emiBalance);
                            page.controls.grdEMIBill.createRow(data1);
                            page.controls.grdEMIBill.edit(true);
                        });
                        
                        //page.controls.grdEMIBill.dataBind(data);
                        //page.controls.grdEMIBill.edit(true);
                    }
                })
            }
            catch (e) {
            }
        }
        page.events.btnEMIPaymentEntry_click = function () {
            try{
                if ($$("lblEMIBalance").html() == "" || $$("lblEMIBalance").html() == null || typeof $$("lblEMIBalance").html() == "undefined" || parseFloat($$("lblEMIBalance").html()) == 0) {
                    throw"Please Check The Paid And Balance Amount!!!"
                }
                if (parseFloat($$("txtEMIPayAmount").value()) > parseFloat($$("lblEMIBalance").html())) {
                    $$("txtEMIPayAmount").focus();
                    throw "Paid Amount Should Not Exceed Than The Balance Amount"
                }
                var balanceAmount = parseFloat($$("txtEMIPayAmount").value());
                var data = [];
                $(page.controls.grdEMIBill.allData()).each(function (i,item) {
                    if (item.status == "Paid") {
                        data.push({
                            bill_no: item.bill_no,
                            temp_schedule_id: item.temp_schedule_id,
                            schedule_id: item.schedule_id,
                            schedule_date: item.schedule_date,
                            due_date: item.due_date,
                            amount:item.amount,
                            paid: item.paid,
                            balance: item.balance,
                            pay_amount: item.pay_amount,
                            status:item.status,
                        });
                    }
                    else {
                        if (parseFloat(balanceAmount) >= parseFloat(item.balance)) {
                            data.push({
                                bill_no: item.bill_no,
                                temp_schedule_id: item.temp_schedule_id,
                                schedule_id: item.schedule_id,
                                schedule_date: item.schedule_date,
                                due_date: item.due_date,
                                amount: item.amount,
                                paid: item.paid,
                                balance: item.balance,
                                pay_amount: item.balance,
                                status: item.status,
                            });
                            balanceAmount = parseFloat(balanceAmount) - parseFloat(item.balance);
                        }
                        else if (parseFloat(balanceAmount) > 0 && parseFloat(balanceAmount) < parseFloat(item.balance)) {
                            data.push({
                                bill_no: item.bill_no,
                                temp_schedule_id: item.temp_schedule_id,
                                schedule_id: item.schedule_id,
                                schedule_date: item.schedule_date,
                                due_date: item.due_date,
                                amount: item.amount,
                                paid: item.paid,
                                balance: item.balance,
                                pay_amount: balanceAmount,
                                status: item.status,
                            });
                            balanceAmount = parseFloat(balanceAmount) - parseFloat(item.balance);
                        }
                        else {
                            data.push({
                                bill_no: item.bill_no,
                                temp_schedule_id: item.temp_schedule_id,
                                schedule_id: item.schedule_id,
                                schedule_date: item.schedule_date,
                                due_date: item.due_date,
                                amount: item.amount,
                                paid: item.paid,
                                balance: item.balance,
                                pay_amount: "0",
                                status: item.status,
                            });
                        }
                    }
                });
                page.view.selectedPendingEMIPayment([]);
                page.view.selectedPendingEMIPayment(data);
            }
            catch (e) {
                alert(e);
            }
        }
        page.events.btnEMIPay_click = function () {
            var emiBillNo;
            $$("btnEMIPay").disable(true);
            if (confirm("Are You Sure Want To Pay This Schedule")) {
                var allBillSO = [];
                var schedule_data = [];
                var data1 = [];
                $(page.controls.grdEMIBill.allData()).each(function (i, item) {
                    try {
                        if (item.status != "Paid") {
                            if (parseFloat(item.pay_amount) != 0) {
                                emiBillNo = item.bill_no;
                                allBillSO.push({
                                    collector_id: CONTEXT.user_no,
                                    pay_desc: "POS EMI Payment",
                                    amount: item.pay_amount,
                                    bill_no: item.bill_no,
                                    pay_date: dbDateTime($$("dsEMIPendingPayDate").getDate()),//$.datepicker.formatDate("dd-mm-yy", new Date()),
                                    pay_type: "Sale",
                                    pay_mode: $$("ddlEMIPayMode").selectedValue(),
                                    schedule_id: item.schedule_id
                                });
                                schedule_data.push({
                                    sch_id: item.schedule_id,
                                    amount: parseFloat(item.paid) + parseFloat(item.pay_amount),
                                    status: (parseInt(item.balance) - parseInt(item.pay_amount)) == 0 ? "Paid" : "Open"
                                })
                                data1.push({
                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                    target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                    paid_amount: item.pay_amount,
                                    description: "POS-" + item.bill_no,
                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                    key_1: item.bill_no,
                                    comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                });
                            }
                        }
                    }
                    catch (e) {
                        alert(e);
                    }
                });
                page.billPaymentAPI.postAllValue(0, allBillSO, function (data) {
                    page.billScheduleAPI.updateScheduleAmount(schedule_data, function () {
                        page.finfactsEntryAPI.allcreditSalesPayment(0, data1, function (response) {
                            page.controls.grdEMIBill.dataBind([]);
                            alert("Amount Paid Successfully...");
                            page.billScheduleAPI.getValue($$("txtEMIBillNo").value(), function (data) {
                                page.view.selectedPendingEMIPayment([]);
                                var emiBalance = 0;
                                $(data).each(function (i, item) {
                                    var data1 = {
                                        temp_schedule_id: item.temp_schedule_id,
                                        schedule_id: item.schedule_id,
                                        bill_no: item.bill_no,
                                        schedule_date: item.schedule_date,
                                        due_date: item.due_date,
                                        amount: item.amount,
                                        paid: item.paid,
                                        balance: item.balance,
                                        pay_amount: (item.status == "Open") ? "0" : item.balance,
                                        status: item.status
                                    }
                                    emiBalance = parseFloat(emiBalance) + parseFloat(item.balance);
                                    page.controls.lblEMIBalance.html(emiBalance);
                                    page.controls.grdEMIBill.createRow(data1);
                                    page.controls.grdEMIBill.edit(true);
                                    $$("btnEMIPay").disable(false);
                                });
                                page.events.btnBack_click();
                            });
                            //TODO:Print The EMI Payment
                            if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                                if ($$("chkEmiPrintBill").prop("checked")) {
                                    page.billService.getBill(emiBillNo, function (data) {
                                        var billDetails = data[0];
                                        var printBox = {
                                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                            Width: 280,
                                            Height: 300,
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
                                        var custName = $$("lblEMICustomer").html();
                                        var t1 = (CONTEXT.COMPANY_NAME).length;
                                        (t1 > 22) ? t1 = 22 : t1 = t1;
                                        var t2 = t1 / 2;
                                        var t3 = t2 * 12.72;
                                        var com_start = parseInt(140 - t3);
                                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                                        (t4 > 22) ? t4 = 22 : t4 = t4;
                                        var t5 = t4 / 2;
                                        var t6 = t5 * 12;
                                        var add_start = parseInt(140 - t6);

                                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: "CASH BILL", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: emiBillNo, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: custName, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                        //printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        //printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: $$("dsEMIPendingPayDate").getDate(), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 15, StartY: 140, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: 140, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });

                                        printBox.Lines.push({ StartX: 15, StartY: 165, Text: ($.datepicker.formatDate("dd-mm-yy", new Date())) + "'s Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: 165, Text: $$("txtEMIPayAmount").value(), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 15, StartY: 185, Text: "Paid Due", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: 185, Text: parseFloat(billDetails.total) - parseFloat($$("lblEMIBalance").html()), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 15, StartY: 205, Text: "Balance Due", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: 205, Text: parseFloat($$("lblEMIBalance").html()), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                                        printBox.Lines.push({ StartX: 0, StartY: 220, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 10, StartY: 235, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 20, StartY: 250, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });
                                        PrintService.PrintReceipt(printBox);

                                        page.controls.txtEMIPayAmount.value("");
                                    });
                                }
                            }
                            else {
                                page.controls.txtEMIPayAmount.value("");
                            }
                        });
                    });
                });
            }
            else {
                $$("btnEMIPay").disable(false);
            }
        }
        page.events.btnMore_click = function () {
            page.controls.pnlMorePopup.open();
            page.controls.pnlMorePopup.title("Print Bill Panel");
            page.controls.pnlMorePopup.rlabel("Print Bill Panel");
            page.controls.pnlMorePopup.width(800);
            page.controls.pnlMorePopup.height(400);

            page.controls.grdBillPrint.width("100%");
            page.controls.grdBillPrint.height("200px");
            page.controls.grdBillPrint.setTemplate({
                selection: "Multiple", paging: true, pageSize: 50,
                columns: [
                    { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                    { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "60px", 'dataField': "bill_id" },
                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "state_text" },
                    { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                    { 'name': "Customer", 'rlabel': 'Customer', 'width': "200px", 'dataField': "cust_name" },
                    { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "135px", 'dataField': "total" },
                    { 'name': "Paid", 'rlabel': 'Paid', 'width': "100px", 'dataField': "paid", visible: false },
                    { 'name': "Balance", 'rlabel': 'Balance', 'width': "110px", 'dataField': "balance", visible: false },
                    { 'name': "Advance(Rs)", 'rlabel': 'Advance Amt', 'width': "125px", 'dataField': "adv_sec_amt", visible: false },
                    { 'name': "Status", 'rlabel': 'Status', 'width': "125px", 'dataField': "adv_sec_status", visible: false },
                    { 'name': "End Date", 'rlabel': 'End Date', 'width': "125px", 'dataField': "adv_end_date", visible: false },
                    { 'name': "", 'width': "300px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />  <input type='button' title='Receipt Print'  class='grid-button' value='' action='Print' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px;' id='receiptPrint' />  <input type='button' title='Return Bill'  class='grid-button' value='' action='Return' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Return-Purchase-icon.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' /><input type='button' title='Bill Adjustment'  class='grid-button' value='' action='Adjustment' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/bills.png);    background-size: contain;    width: 22px;    height: 25px;;margin-right:10px' id='billAdjustment' />  <input type='button'  title='Send E-mail' class='grid-button' value='' action='sendMail' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/mail-envelope.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' id='sendMail' /><input type='button'  title='Send SMS' class='grid-button' value='' action='sendSMS' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/sms-icon.png);    background-size: contain;    width: 25px;    height: 28px;margin-right:10px;' id='sendSms' /> <input type='button'  title='Print Jasper' class='grid-button' value='' action='printJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='jasperPrint' /><input type='button'  title='Cancel Bill' class='grid-button' value='' action='cancelBill' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='cancelBill' /><input type='button'  title='Advance Return' class='grid-button' value='' action='advanceReturn' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Advance-Return-icon.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='returnAdvance' />",visible:false }
                    
                ]
            });
            page.controls.grdBillPrint.dataBind([]);

            $$("ddlSearchPrintViews").selectionChange(function () {
                if ($$("ddlSearchPrintViews").selectedValue() == "1") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "2") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "3") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "4") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "bill_type='SaleSaved' and state_no=100", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "bill_type='SaleSaved' and state_no=100", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "5") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "bpt.pay_mode='Cash' and b.state_no=200 ", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "bpt.pay_mode='Cash' and b.state_no=200 ", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "6") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "bpt.pay_mode='Card' and b.state_no=200 ", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "bpt.pay_mode='Card' and b.state_no=200 ", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "7") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "bpt.pay_mode='Coupon' and b.state_no=200 ", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "bpt.pay_mode='Coupon' and b.state_no=200 ", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "8") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "bpt.pay_mode='Points' and b.state_no=200 ", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "bpt.pay_mode='Points' and b.state_no=200 ", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
                if ($$("ddlSearchPrintViews").selectedValue() == "9") {
                    $$("grdBillPrint").dataBind({
                        getData: function (start, end, sortExpression, filterExpression, callback) {
                            page.billAPI.searchValues("", "", "state_no=300 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                var totalRecord = data.length;
                                page.billAPI.searchValues("", "", "state_no=300 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                            });
                        },
                        update: function (item, updatedItem) {
                            for (var prop in updatedItem) {
                                if (!updatedItem.hasOwnProperty(prop)) continue;
                                item[prop] = updatedItem[prop];
                            }
                        }
                    });
                }
            });
        }

        page.events.btnPrintMultiBill_click = function () {
            var selItem = $$("grdBillPrint").selectedData();
            $(page.controls.grdBillPrint.selectedData()).each(function (i, item) {
                 page.events.btnPrintBill_click(item.bill_no, false);
            });
        }
        //PrintInvoice
        page.events.btnPrintInvoice_click = function (bill_no) {
            if (CONTEXT.ENABLE_INVOICE_PRINT) {
                page.view.viewPrintBill(bill_no);
            }
            else {
                $$("msgPanel").show("Your Settings Block Receipt Printing Please Check It");
            }
        }
        
        //printJasper
        page.events.btnPrintJasperBill_click = function () {
            if (CONTEXT.ENABLE_INVOICE_PRINT) {
                var exp_type = $$("ddlExportType").selectedValue();
                if (exp_type == "" || exp_type == undefined || exp_type == null)
                    $$("msgPanel").show("Please select export type");
                page.printJasper(page.printBillNo, exp_type);
            }
            else {
                $$("msgPanel").show("Your Settings Block Receipt Printing Please Check It");
            }
        }

        page.printJasper = function (bill_no, exp_type) {
            var billdata = {
                bill_no: bill_no,
            }
            page.billService.getSalesPrint(billdata, function (data) {
                page.events.btnprintInvoiceJson_click(data, exp_type);
            });
        }


        page.events.btnprintInvoiceJson_click = function (billItem, exp_type) {
            var template = CONTEXT.INVOICE_TEMPLATE;
            //var template = "Template3";
            if (template == "Template1") {
                page.events.btnPrintInvoiceTemplateFirst(billItem, exp_type);
            }
            else if (template == "Template2") {
                page.events.btnPrintInvoiceTemplateSecond(billItem, exp_type);
            }
            else if (template == "Template3") {
                page.events.btnPrintInvoiceTemplateThird(billItem, exp_type);
            }
            else if (template == "Template4") {
                page.events.btnPrintInvoiceTemplateFourth(billItem, exp_type);
            }
            else if (template == "Template5") {
                page.events.btnPrintInvoiceTemplateFifth(billItem, exp_type);
            }
            else if (template == "Template6") {
                page.events.btnPrintInvoiceTemplateSixth(billItem, exp_type);
            }
            else if (template == "Template7") {
                page.events.btnPrintInvoiceTemplateSeventh(billItem, exp_type);
            }
            else if (template == "Template8") {
                page.events.btnPrintInvoiceTemplateEight(billItem, exp_type);
            }
            else if (template == "Template9") {
                page.events.btnPrintInvoiceTemplateNine(billItem, exp_type);
            }
            else if (template == "Template10") {
                page.events.btnPrintInvoiceTemplateTenth(billItem, exp_type);
            }
            else if (template == "Template11") {
                page.events.btnPrintInvoiceTemplateEleven(billItem, exp_type);
            }
            else if (template == "Template12") {
                page.events.btnPrintInvoiceTemplateTwele(billItem, exp_type);
            }
        }
        page.events.btnPrintInvoiceTemplateFirst = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "CGST": parseInt(item.tax_per) + "%",//item.tax_rate,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "SGST": parseInt(item.tax_per) + "%",//item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
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
                                "BillItem": bill_item,
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
                    GeneratePrint("ShopOnDev", "sales-bill-print/main-credit-invoice.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
                else if (data.bill_type == "SalesDebit") {
                    accountInfo.BillName = "Debit BILL";
                    GeneratePrint("ShopOnDev", "sales-bill-print/main-credit-invoice.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
                else {
                    GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-bill1.jrxml", accountInfo, exp_type, function (responseData) {
                        $$("pnlBillViewPopup").open();
                        $$("pnlBillViewPopup").title("Bill View");
                        $$("pnlBillViewPopup").rlabel("Bill View");
                        $$("pnlBillViewPopup").width("1000");
                        $$("pnlBillViewPopup").height("600");
                        $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                    });
                }
            });
        }

        page.events.btnPrintInvoiceTemplateSecond = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "CGST": item.cgst_per+" %",
                        "TaxRate": item.tax_rate,
                        "SGST": item.sgst_per+" %",
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address1.split("-");
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main_sales_sun_solutions2.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }

        page.events.btnPrintInvoiceTemplateThird = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "TaxRate": parseInt(item.tax_per)/2,
                        "SGST": item.tax_rate,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address1.split("-");
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-bill2.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }

        page.events.btnPrintInvoiceTemplateFourth = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "CGST": item.tax_rate/2,//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "GST": item.tax_cgst_percent,
                        "SGST": item.tax_rate/2,//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.cost) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                //var BillWordings = inWords(parseFloat(data.total).toFixed(5));
                var full_address = data.address1.split("-");
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-bill-short-new4.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }

        page.events.btnPrintInvoiceTemplateFifth = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "CGST": parseInt(item.tax_per)/2 + "%",//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "SGST": parseInt(item.tax_per) / 2 + "%",//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main_sales_sun_solutions3.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
        page.events.btnPrintInvoiceTemplateSixth = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "CGST": parseInt(item.tax_per) / 2 + "%",//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "SGST": parseInt(item.tax_per) / 2 + "%",//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main_sales_jebaraj.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
        page.events.btnPrintInvoiceTemplateSeventh = function (billItem, exp_type) {
            var data = billItem[0];
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-raja-ram.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
            

        page.events.btnPrintInvoiceTemplateEight = function (billItem, exp_type) {
            var data = billItem[0];
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-bill-sr-steel.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }

        page.events.btnPrintInvoiceTemplateNine = function (billItem, exp_type) {
            var data = billItem[0];
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
                                "BillAmount": parseFloat(parseFloat(data.total)-parseFloat(data.bill_discount)).toFixed(2),
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-template9.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
        page.events.btnPrintInvoiceTemplateTenth = function (billItem, exp_type) {
            var data = billItem[0];
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
                        "CGST": parseInt(item.tax_per)/2 + "%",//item.tax_cgst,
                        "TaxRate": item.tax_rate,
                        "SGST": parseInt(item.tax_per) / 2 + "%",//item.tax_sgst,
                        "GST": parseInt(item.tax_per) + "%",
                        "netrate": parseFloat(item.price) + (parseFloat(item.tax_rate) / parseFloat(item.qty)),
                        "GValue": parseFloat(item.total_price).toFixed(2)
                    });
                });
                var full_address = data.address1.split("-");
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main_sales_jsaper10.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
        page.events.btnPrintInvoiceTemplateEleven = function (billItem, exp_type) {
            var data = billItem[0];
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
                var full_address = data.address1.split("-");
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-template11.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
        page.events.btnPrintInvoiceTemplateTwele = function (billItem, exp_type) {
            var data = billItem[0];
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
                var full_address = data.address1.split("-");
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
                GeneratePrint("ShopOnDev", "sales-bill-print/main-sales-template11.jrxml", accountInfo, exp_type, function (responseData) {
                    $$("pnlBillViewPopup").open();
                    $$("pnlBillViewPopup").title("Bill View");
                    $$("pnlBillViewPopup").rlabel("Bill View");
                    $$("pnlBillViewPopup").width("1000");
                    $$("pnlBillViewPopup").height("600");
                    $$("pnlBillViewPopup").selectedObject.html('<iframe controlId="frmBillView" control="salesPOS.htmlControl" src="data:application/pdf;base64,' + responseData + '" height="100%" width="100%"></iframe>');
                });
            });
        }
        // print the bill
        page.events.btnPrintBill_click = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                //var template = CONTEXT.RECEIPT_TEMPLATE;
                var template = "Template16";
                if (template == "Template1") {
                    page.events.btnPrintReceiptTemplateFirst(bill_no, rec_amount);
                }
                else if (template == "Template2") {
                    page.events.btnPrintReceiptTemplateSecond(bill_no, rec_amount);
                }
                else if (template == "Template3") {
                    page.events.btnPrintReceiptTemplateThird(bill_no, rec_amount);
                }
                else if (template == "Template4") {
                    page.events.btnPrintReceiptTemplateFourth(bill_no, rec_amount);
                }
                else if (template == "Template5") {
                    page.events.btnPrintReceiptTemplateFifth(bill_no, rec_amount);
                }
                else if (template == "Template6") {
                    page.events.btnPrintReceiptTemplateSixth(bill_no, rec_amount);
                }
                else if (template == "Template7") {
                    page.events.btnPrintReceiptTemplateSeventh(bill_no, rec_amount);
                }
                else if (template == "Template8") {
                    page.events.btnPrintReceiptTemplateEight(bill_no, rec_amount);
                }
                else if (template == "Template9") {
                    page.events.btnPrintReceiptTemplateNinth(bill_no, rec_amount);
                }
                else if (template == "Template10") {
                    page.events.btnPrintReceiptTemplateTenth(bill_no, rec_amount);
                }
                else if (template == "Template11") {
                    page.events.btnPrintReceiptTemplateEleven(bill_no, rec_amount);
                }
                else if (template == "Template12") {
                    page.events.btnPrintReceiptTemplateTwelve(bill_no, rec_amount);
                }
                else if (template == "Template13") {
                    page.events.btnPrintReceiptTemplateThirteen(bill_no, rec_amount);
                }
                else if (template == "Template14") {
                    page.events.btnPrintReceiptTemplateFourteen(bill_no, rec_amount);
                }
                else if (template == "Template15") {
                    page.events.btnPrintReceiptTemplateFifteen(bill_no, rec_amount);
                }
                else if (template == "Template16") {
                    page.events.btnPrintReceiptTemplateSixteen(bill_no);
                }
            }
            else {
                $$("msgPanel").show("Your Settings Block Receipt Printing Please Check It");
            }
            
        }
        page.events.btnPrintReceiptTemplateFirst = function (bill_no, rec_amount) {
            var currentBillNo = bill_no;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                if (data.cust_no != null && data.cust_no != undefined && data.cust_no != "")
                {
                    var repInput = {
                        viewMode: "Standard",
                        fromDate: "",
                        toDate: "",
                        cust_no: data.cust_no,
                        item_no: "",
                        bill_type: ""
                    }
                    page.dynaReportService.getSalesReport(repInput, function (data) {
                        var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                        var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                        $(data).each(function (i, item) {
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

                        //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                            var length = (billItems.length * 30) + parseInt(550);
                            var printBox = {

                                PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                Width: 280,
                                Height: length,
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
                            (t1 > 22) ? t1 = 22 : t1 = t1;
                            var t2 = t1 / 2;
                            var t3 = t2 * 12.72;
                            var com_start = parseInt(140 - t3);
                            var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                            (t4 > 22) ? t4 = 22 : t4 = t4;
                            var t5 = t4 / 2;
                            var t6 = t5 * 12;
                            var add_start = parseInt(140 - t6);
                            var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                            printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                            //printBox.Lines.push({ StartX: 30, StartY: 60, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            //printBox.Lines.push({ StartX: 160, StartY: 60, Text: currentDate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                            printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            //Header
                            printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 170, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                            var offset = 185;
                            var count = 1;
                            $(billItems).each(function (i, row) {
                                var kgm = "";
                                if (row.unit == "Kilogram") {
                                    kgm = row.qty.substring(0, 5);
                                }
                                var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                                printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 170, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                                count = count + 1;
                                offset = offset + 30;
                            });

                            offset = offset;
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            offset = offset;
                            printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                            printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                            if (billDetails.state_text == "Return") { }
                            else {
                                printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            }
                            printBox.Lines.push({ StartX: 0, StartY: offset + 57, Text: "___________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            printBox.Lines.push({ StartX: 15, StartY: offset + 80, Text: "TOTAL AMT(Rs):", FontFamily: "Courier New", FontSize: 12, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 80, Text: billDetails.total, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 0, StartY: offset + 82, Text: "__________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            printBox.Lines.push({ StartX: 20, StartY: offset + 105, Text: "Credit:", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 100, StartY: offset + 105, Text: pending_balance, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 10, StartY: offset + 140, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 10, StartY: offset + 160, Text: "", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                            PrintService.PrintReceipt(printBox);

                        //});

                    });
                }
                else {
                    //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                        var length = (billItems.length * 30) + parseInt(500);
                        var printBox = {

                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                            Width: 280,
                            Height: length,
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
                        (t1 > 22) ? t1 = 22 : t1 = t1;
                        var t2 = t1 / 2;
                        var t3 = t2 * 12.72;
                        var com_start = parseInt(140 - t3);
                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                        (t4 > 22) ? t4 = 22 : t4 = t4;
                        var t5 = t4 / 2;
                        var t6 = t5 * 12;
                        var add_start = parseInt(140 - t6);
                        var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        //printBox.Lines.push({ StartX: 30, StartY: 60, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        //printBox.Lines.push({ StartX: 160, StartY: 60, Text: currentDate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //Header
                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 170, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                        var offset = 185;
                        var count = 1;
                        $(billItems).each(function (i, row) {
                            var kgm = "";
                            if (row.unit == "Kilogram") {
                                kgm = row.qty.substring(0, 5);
                            }
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: row.item_name, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                            count = count + 1;
                            offset = offset + 30;
                        });
                        offset = offset;
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        offset = offset;
                        printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        if (billDetails.state_text == "Return") { }
                        else {
                            printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        }

                        printBox.Lines.push({ StartX: 0, StartY: offset + 57, Text: "___________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 15, StartY: offset + 80, Text: "TOTAL AMT(Rs):", FontFamily: "Courier New", FontSize: 12, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 80, Text: billDetails.total, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: offset + 80, Text: "__________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 10, StartY: offset + 110, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });



                        PrintService.PrintReceipt(printBox);

                    //});
                }
            });
        }

        page.events.btnPrintReceiptTemplateSecond = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var tot_mrp = 0;
                var billDetails = data;
                var billItems = data.bill_items;
                var repInput = {
                    viewMode: "Standard",
                    fromDate: "",
                    toDate: "",
                    cust_no: (data.cust_no == null || data.cust_no == undefined || data.cust_no == "") ? 0 : data.cust_no,
                    item_no: "",
                    bill_type: ""
                }
                page.dynaReportService.getSalesReport(repInput, function (data) {
                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                    var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                    $(data).each(function (i, item) {
                        if (item.bill_type == "Sale") {
                            salSummary.tot_sale = salSummary.tot_sale + parseFloat(item.total);
                            salSummary.tot_pay = salSummary.tot_pay + parseFloat(item.total_paid_amount);
                        }
                        else {
                            salSummary.tot_ret = salSummary.tot_ret + parseFloat(item.total);
                            salSummary.tot_ret_pay = salSummary.tot_ret_pay + parseFloat(item.total_paid_amount);
                        }
                    });
                    if (data[0].cust_no == null || data[0].cust_no == undefined || data[0].cust_no == "")
                        var pending_balance = 0;
                    else
                        var pending_balance = parseFloat(salSummary.tot_sale) - parseFloat(salSummary.tot_pay);

                    //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                        var length = (billItems.length * 30) + parseInt(550);
                        var printBox = {
                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"Posiflex PP8800 Partial Cut","CITIZEN CT-S310II",
                            Width: 500,
                            Height: length+500,
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
                        (t1 > 22) ? t1 = 22 : t1 = t1;
                        var t2 = t1 / 2;
                        var t3 = t2 * 12.72;
                        var com_start = parseInt(140 - t3);
                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                        (t4 > 22) ? t4 = 22 : t4 = t4;
                        var t5 = t4 / 2;
                        var t6 = t5 * 12;
                        var add_start = parseInt(140 - t6);
                        var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        //printBox.Lines.push({ StartX: 30, StartY: 60, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        //printBox.Lines.push({ StartX: 160, StartY: 60, Text: currentDate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //Header
                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        //printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                        var offset = 185;
                        var count = 1;
                        $(billItems).each(function (i, row) {
                            row.qty = row.qty + " " + row.unit;
                            if (row.mrp == "" || typeof row.mrp == "undefined" || row.mrp == null) {
                                row.mrp = row.price;
                            }
                            tot_mrp = tot_mrp + (parseFloat(row.qty) * parseFloat(row.mrp));
                            var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                            count = count + 1;
                            offset = offset + 30;
                        });

                        offset = offset;
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        offset = offset;
                        printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        
                        
                        printBox.Lines.push({ StartX: 0, StartY: offset + 65, Text: "---------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 15, StartY: offset + 80, Text: "TOTAL AMT(Rs):", FontFamily: "Courier New", FontSize: 12, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 80, Text: billDetails.total, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 20, StartY: offset + 100, Text: "Savings:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 100, StartY: offset + 100, Text: parseFloat(tot_mrp) - parseFloat(billDetails.total), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: offset + 108, Text: "---------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //printBox.Lines.push({ StartX: 20, StartY: offset + 105, Text: "Credit:", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                        //printBox.Lines.push({ StartX: 100, StartY: offset + 105, Text: pending_balance, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 120, BarcodeText: billDetails.bill_barcode, FontFamily: "Courier New", FontSize: 28, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 10, StartY: offset + 170, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 10, StartY: offset + 210, Text: "", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        PrintService.PrintReceipt(printBox);

                    //});

                });
            });
        }

        page.events.btnPrintReceiptTemplateThird = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                    total_qty = billItems.length;
                        var length = (billItems.length * 30) + parseInt(550);
                        var printBox = {

                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                            Width: 280,
                            Height: length,
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
                        (t1 > 22) ? t1 = 22 : t1 = t1;
                        var t2 = t1 / 2;
                        var t3 = t2 * 12.72;
                        var com_start = parseInt(140 - t3);
                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                        (t4 > 22) ? t4 = 22 : t4 = t4;
                        var t5 = t4 / 2;
                        var t6 = t5 * 12;
                        var add_start = parseInt(140 - t6);
                        var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        //printBox.Lines.push({ StartX: 30, StartY: 60, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        //printBox.Lines.push({ StartX: 160, StartY: 60, Text: currentDate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        if (bill_title == "RETURN BILL") {
                            printBox.Lines.push({ StartX: 130, StartY: 80, Text: "Source Bill:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 240, StartY: 80, Text: billDetails.bill_id_par, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        }
                        
                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //Header
                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                       // printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                      //  printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 140, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 190, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                        var offset = 185;
                        var count = 1;
                        $(billItems).each(function (i, row) {
                            var kgm = "";
                            if (row.unit == "Kilogram") {
                                kgm = row.qty.substring(0, 5);
                            }
                            var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            //printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 50, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 140, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                            count = count + 1;
                            offset = offset + 30;
                        });

                        offset = offset;
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        offset = offset;
                        printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        if (billDetails.state_text == "Return") { }
                        else {
                            printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        }
                        
                        printBox.Lines.push({ StartX: 0, StartY: offset + 57, Text: "___________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 15, StartY: offset + 80, Text: "TOTAL QTY:", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 80, Text: total_qty, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 15, StartY: offset + 100, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 100, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 0, StartY: offset + 105, Text: "__________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //printBox.Lines.push({ StartX: 20, StartY: offset + 105, Text: "Credit:", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                        //printBox.Lines.push({ StartX: 100, StartY: offset + 105, Text: pending_balance, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 130, BarcodeText: billDetails.bill_barcode, FontFamily: "Courier New", FontSize: 28, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 10, StartY: offset + 180, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 20, StartY: offset + 210, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                        PrintService.PrintReceipt(printBox);

                    //});
              //  });
            });
        }
        page.events.btnPrintReceiptTemplateFourth = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var billdata = {
                bill_no: bill_no,
            }
            //page.billService.getSalesPrint(billdata, function (billItem) {
            //page.stockAPI.getSalesBill(bill_no, function (data) {
            page.billAPI.getValue(bill_no, function (data) {
                var data = data;
                var billItem = data.bill_items;
            var bill_item = [];
            var s_no = 0;
            var tot_tax_per = 0;
            $(billItem).each(function (i, item) {
                tot_tax_per = parseFloat(tot_tax_per) + parseFloat(item.tax_per);
                s_no = s_no + 1;
                if (CONTEXT.ENABLE_DATE_FORMAT == "true") {
                    var monthex;
                    var yearex
                    if (item.expiry_date != null && item.expiry_date != undefined && item.expiry_date != "") {
                        monthex = item.expiry_date.substring(3, 5);
                        yearex = item.expiry_date.substring(6, 10);
                        item.expiry_date = monthex + "-" + yearex;
                    }
                }
                var itemName = (item.item_name_tr != null) ? item.item_name_tr : item.item_name;
                bill_item.push({
                    "BillItemNo": s_no,
                    "ProductName": itemName,	// nonstandard unquoted field name
                    "Pack": item.packing,	// nonstandard single-quoted field name
                    "Batch": item.batch_no,	// standard double-quoted field name
                    "Exp": item.expiry_date,
                    "Qty": item.qty,
                    "Per": item.unit_per,
                    "Qty_unit": item.qty,
                    "Hsn": item.hsn_code,
                    "FreeQty": item.free_qty,
                    "Rate": parseFloat(item.price).toFixed(5),
                    "PDis": parseFloat(item.discount).toFixed(5),
                    "MRP": parseFloat(item.mrp).toFixed(5),
                    "CGST": item.tax_rate,//item.tax_cgst,
                    "TaxRate": item.tax_rate,
                    "GST": item.tax_cgst_percent,
                    "SGST": item.tax_rate,//item.tax_sgst,
                    "GST": parseInt(item.tax_per),
                    "netrate": "1000",
                    "GValue": parseFloat(item.total_price).toFixed(5)
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
                "BillDate": data.bill_date,
                "NoofItems": data.no_of_items,
                "Quantity": data.no_of_qty,
                "Abdeen": "Abdeen:",
                "AbdeenMobile": CONTEXT.COMPANY_PHONE_NO,
                "Off": "Off:",
                "OffMobile": CONTEXT.COMPANY_PHONE_NO,
                "ApplsName": CONTEXT.COMPANY_NAME,
                "web": CONTEXT.COMPANY_WEB_ADDRESS,//"abc.com",
                "email": CONTEXT.COMPANY_EMAIL,//"abc@gmail.com",
                "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1,
                "CompanyCityStreetPincode": CONTEXT.COMPANY_ADDRESS_LINE2,
                "Home": "LL:",
                "HomeMobile": CONTEXT.COMPANY_LANDLINE_NO,
                "BSubTotal": parseFloat(data.sub_total).toFixed(5),
                "DiscountAmount": parseFloat(data.tot_discount).toFixed(5),
                "BCGST": parseFloat(data.tot_gst_tax).toFixed(5),
                "BSGST": parseFloat(data.tot_gst_tax).toFixed(5),
                "TaxAmount": parseFloat(data.tot_tax_amt).toFixed(5),
                "BillAmount": parseFloat(data.total).toFixed(5),
                "ApplicaName": CONTEXT.COMPANY_NAME,
                "ApplsName": CONTEXT.COMPANY_NAME.toUpperCase(),
                "CompanyName1": "", //"New",
                "CompanyName": CONTEXT.COMPANY_NAME,//"Essar Steel Corporation",
                "CompanyName2": "",//"Dealer : Steel & Pipes",
                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,//"No. 2/227-4, Tuticorin Road, Opp. K.T.C. Depot",
                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,//"Veerapandiyapattinum - 628216, THIRUCHENDUR",
                "BillAmountWordings": inWords(parseInt(data.total)),//"Six Lakhs Fifty Thousand Five Hundred and Ninity Eight Only", 
                "Cell": "Cell : ",
                "Cell No": CONTEXT.COMPANY_PHONE_NO,//"94434 63089",
                "Home": "Phone : ",
                "Home No": CONTEXT.COMPANY_LANDLINE_NO,//"04639-245 478",
                "CompanyPhoneNoEtc": CONTEXT.COMPANY_PHONE_NO,
                "CompanyDLNo": CONTEXT.COMPANY_DL_NO,
                "CompanyTINNo": CONTEXT.COMPANY_TIN_NO,
                "CompanyGST": CONTEXT.COMPANY_GST_NO,
                "SSSS": "DUPLICATE",
                "ShipAmt": data.expense_amt,
                "Original": "Duplicate",
                "RoundAmount": parseFloat(data.round_off).toFixed(5),
                "sales_tot_tax": tot_tax_per / s_no + "%",//"5%",
                "cgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
                "sgst_tot_tax": (tot_tax_per / s_no) / 2 + "%",//"2.5%",
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
            var length = (billItem.length * 30) + parseInt(550);
            var printBox = {

                PrinterName: "TVS MSP 240 Classic Plus",//"CITIZEN CT-S310II",
                Width: 840,
                Height: billItem.length + 600,
                Lines: []
            };
            //PRINT THE LEFT SIDE CONTENT
            printBox.Lines.push({ StartX: 0, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 16, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 20, Text: accountInfo.CompanyAddress, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 35, Text: accountInfo.CompanyCityStreetPincode, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 50, Text: "GSTIN", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            printBox.Lines.push({ StartX: 75, StartY: 50, Text: CONTEXT.COMPANY_GST_NO, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

            //PRINT THE RIGHT SIDE CONTENT
            printBox.Lines.push({ StartX: 400, StartY: 0, Text: "Tax Invoice", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            printBox.Lines.push({ StartX: 400, StartY: 20, Text: "Ph:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 450, StartY: 20, Text: accountInfo.AbdeenMobile, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 400, StartY: 36, Text: "Email:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 450, StartY: 36, Text: accountInfo.email, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 400, StartY: 50, Text: "Web:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 450, StartY: 50, Text: accountInfo.web, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 65, Text: "--------------------------------------------------------------------------------------------------------------------------", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                //CUSTOMER LEFT SIDE INFORMATION
            printBox.Lines.push({ StartX: 0, StartY: 75, Text: accountInfo.CustomerName.substring(0, 30), FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 95, Text: accountInfo.CustAddress.substring(0, 30), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 110, Text: accountInfo.CustCityStreetZipCode.substring(0, 30), FontFamily: "Courier New", FontSize: 10, FontStyle: 1});
            printBox.Lines.push({ StartX: 0, StartY: 125, Text: "GSTIN", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 50, StartY: 125, Text: accountInfo.GST, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                //CUSTOMER CENTER INFORMATION
            printBox.Lines.push({ StartX: 375, StartY: 125, Text: "Ph:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 415, StartY: 125, Text: accountInfo.Phone.substring(0, 10), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                //CUSTOMER RIGHT SIDE INFORMATION
            printBox.Lines.push({ StartX: 550, StartY: 75, Text: "Date", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 625, StartY: 75, Text: accountInfo.BillDate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 550, StartY: 95, Text: "Invoice:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 625, StartY: 95, Text: accountInfo.BillNo, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 550, StartY: 110, Text: "Mode:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 625, StartY: 110, Text: accountInfo.PayMode, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 550, StartY: 125, Text: "Beat:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 625, StartY: 125, Text: accountInfo.Area, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 140, Text: "--------------------------------------------------------------------------------------------------------------------------", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                //BILL ITEM HEADING
            printBox.Lines.push({ StartX: 0, StartY: 153, Text: "S.No", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 45, StartY: 153, Text: "Product Name", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 175, StartY: 153, Text: "HSN", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 235, StartY: 153, Text: "MRP", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 305, StartY: 153, Text: "Qty", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 360, StartY: 153, Text: "Rate", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 430, StartY: 153, Text: "Disc", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 490, StartY: 153, Text: "CGST%", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 540, StartY: 153, Text: "SGST%", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 590, StartY: 153, Text: "NetRate", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 680, StartY: 153, Text: "Amount", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: 165, Text: "--------------------------------------------------------------------------------------------------------------------------", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                //BILL ITEM
            var offset = 180;
            $(accountInfo.BillItem).each(function (i, item) {
                printBox.Lines.push({ StartX: 0, StartY: offset, Text: item.BillItemNo, FontFamily: "Courier New", FontSize: 11, FontStyle: 1 });
                printBox.Lines.push({ StartX: 40, StartY: offset, Text: item.ProductName.substring(0, 15), FontFamily: "Courier New", FontSize: 11, FontStyle: 1 });
                printBox.Lines.push({ StartX: 175, StartY: offset, Text: item.Hsn, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 235, StartY: offset, Text: item.MRP.substring(0, 6), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 305, StartY: offset, Text: item.Qty.substring(0, 5), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 360, StartY: offset, Text: item.Rate.substring(0, 6), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 430, StartY: offset, Text: item.PDis.substring(0, 6), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 495, StartY: offset, Text: item.CGST, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 545, StartY: offset, Text: item.SGST, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 590, StartY: offset, Text: item.netrate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: 680, StartY: offset, Text: item.GValue, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                offset = offset + 18;
            });
                //BOTTOM INFORMATION
            printBox.Lines.push({ StartX: 670, StartY: offset+15, Text: "------------", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 680, StartY: offset + 30, Text: accountInfo.BSubTotal, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 175, StartY: offset + 45, Text: "Round Amount", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 680, StartY: offset + 45, Text: accountInfo.RoundAmount, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "--------------------------------------------------------", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                //TAX AMOUNT DETAILS
            printBox.Lines.push({ StartX: 45, StartY: offset + 75, Text: "TAXABLE AMOUNT", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 225, StartY: offset + 75, Text: "CGST", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 340, StartY: offset + 75, Text: "SGST", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: offset + 90, Text: "SALES", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 60, StartY: offset + 90, Text: accountInfo.sales_tot_tax, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 100, StartY: offset + 90, Text: accountInfo.TaxAmount, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 190, StartY: offset + 90, Text: accountInfo.cgst_tot_tax, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 230, StartY: offset + 90, Text: accountInfo.BCGST, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 310, StartY: offset + 90, Text: accountInfo.sgst_tot_tax, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 350, StartY: offset + 90, Text: accountInfo.BSGST, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 45, StartY: offset + 110, Text: "Net Total", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
            printBox.Lines.push({ StartX: 680, StartY: offset + 110, Text: accountInfo.BillAmount, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                //FOOTER INFORMATION
            printBox.Lines.push({ StartX: 0, StartY: offset + 128, Text: "--------------------------------------------------------------------------------------------------------------------------", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 0, StartY: offset + 140, Text: accountInfo.BillAmountWordings, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
            printBox.Lines.push({ StartX: 380, StartY: offset + 140, Text: "Collect By:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 360, StartY: offset + 155, Text: "Have A Nice Day", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            printBox.Lines.push({ StartX: 620, StartY: offset + 155, Text: "SIGNATURE", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
            

            PrintService.PrintReceipt(printBox);

        });
        }
        page.events.btnPrintReceiptTemplateFifth = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                    var length = (billItems.length * 30) + parseInt(550);
                    var printBox = {

                        PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                        Width: 280,
                        Height: length,
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
                    (t1 > 22) ? t1 = 22 : t1 = t1;
                    var t2 = t1 / 2;
                    var t3 = t2 * 12.72;
                    var com_start = parseInt(140 - t3);
                    var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                    (t4 > 22) ? t4 = 22 : t4 = t4;
                    var t5 = t4 / 2;
                    var t6 = t5 * 12;
                    var add_start = parseInt(140 - t6);
                    var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                    printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                    //printBox.Lines.push({ StartX: 30, StartY: 60, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    //printBox.Lines.push({ StartX: 160, StartY: 60, Text: currentDate, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 0, StartY: 100, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 50, StartY: 100, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 160, StartY: 100, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 200, StartY: 100, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 0, StartY: 110, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    //Header
                    printBox.Lines.push({ StartX: 0, StartY: 125, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                    printBox.Lines.push({ StartX: 30, StartY: 125, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                    // printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 50, StartY: 140, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                    //  printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 140, StartY: 140, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 190, StartY: 140, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 0, StartY: 145, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                    var offset = 165;
                    var count = 1;
                    $(billItems).each(function (i, row) {
                        var kgm = "";
                        if (row.unit == "Kilogram") {
                            kgm = row.qty.substring(0, 5);
                        }
                        var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        //printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 50, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 140, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                        count = count + 1;
                        offset = offset + 30;
                    });

                    offset = offset;
                    printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    offset = offset;
                    //printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    //printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                    //printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    //printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                    if (billDetails.state_text == "Return") { }
                    else {
                        printBox.Lines.push({ StartX: 0, StartY: offset + 20, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 35, StartY: offset + 20, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 90, StartY: offset + 20, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 125, StartY: offset + 20, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    }
                    
                    printBox.Lines.push({ StartX: 0, StartY: offset + 17, Text: "___________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    printBox.Lines.push({ StartX: 15, StartY: offset + 40, Text: "TOTAL AMT(Rs):", FontFamily: "Courier New", FontSize: 12, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.total, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 0, StartY: offset + 40, Text: "__________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    //printBox.Lines.push({ StartX: 20, StartY: offset + 105, Text: "Credit:", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    //printBox.Lines.push({ StartX: 100, StartY: offset + 105, Text: pending_balance, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                    //printBox.Lines.push({ StartX: 60, StartY: offset + 110, BarcodeText: billDetails.bill_barcode, FontFamily: "Courier New", FontSize: 28, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 10, StartY: offset + 70, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 20, StartY: offset + 100, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                    PrintService.PrintReceipt(printBox);

                //});
                //  });
            });
        }
        page.events.btnPrintReceiptTemplateSixth = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            var left_space = 15;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data){
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                    total_qty = billItems.length;
                    var length = (billItems.length * 30) + parseInt(550);
                    var printBox = {

                        PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                        Width: 280,
                        Height: length,
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

                    printBox.Lines.push({ StartX: com_start-5, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 14, FontStyle: 1 });
                    printBox.Lines.push({ StartX: add_start, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 80, StartY: 40, Text: "Ph.No: " + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 78, StartY: 60, Text: "TIN.No: " + CONTEXT.CompanyTINNo, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 65, StartY: 80, Text: "GST.No: " + CONTEXT.CompanyGST, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 0, StartY: 100, Text: "Authorised Dealer For Colorful Export Quality", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 0, StartY: 120, Text: "Products Of", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 140, StartY: 140, Text: "SONY VINAYAGA FIREWORKS", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: cashbill_start, StartY: 160, Text: bill_title, FontFamily: "Agency FB", FontSize: 12, FontStyle: 1 });

                    printBox.Lines.push({ StartX: left_space + 0, StartY: 180, Text: "BILL NO:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+68, StartY: 180, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 0, StartY: 200, Text: "CUSTOMER:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+50, StartY: 200, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: left_space+160, StartY: 200, Text: "Cus Id:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+200, StartY: 200, Text: billDetails.cust_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                    printBox.Lines.push({ StartX: left_space + 0, StartY: 220, Text: "DATE:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 50, StartY: 220, Text: billDetails.bill_date, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: left_space + 160, StartY: 220, Text: "TIME:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+200, StartY: 220, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });

                    printBox.Lines.push({ StartX: left_space + 0, StartY: 230, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                    //Header
                    printBox.Lines.push({ StartX: left_space + 0, StartY: 250, Text: "SNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+30, StartY: 250, Text: "Product", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 80, StartY: 260, Text: "Rate", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+125, StartY: 260, Text: "Qty", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 190, StartY: 260, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 0, StartY: 265, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                    var offset = 285;
                    var count = 1;
                    $(billItems).each(function (i, row) {
                        var kgm = "";
                        if (row.unit == "Kilogram") {
                            kgm = row.qty.substring(0, 5);
                        }
                        (row.unit_identity == "0") ? row.unit = row.unit : row.unit = row.alter_unit;
                        (row.unit == "") ? row.unit = "" : row.unit = row.unit;
                        var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                        printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: count, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: left_space + 30, StartY: offset, Text: itemName, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: left_space + 80, StartY: offset + 15, Text: (row.price == null) ? 0 : parseFloat(row.price).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: left_space + 125, StartY: offset + 15, Text: parseFloat(row.qty).toFixed(2) + " " + row.unit, FontFamily: "Agency FB", FontSize: 10, FontStyle: 0 });
                        printBox.Lines.push({ StartX: left_space + 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                        count = count + 1;
                        offset = offset + 30;
                    });

                    offset = offset;
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                    offset = offset;
                    printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                    printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                    if (billDetails.state_text == "Return") { }
                    else {
                        printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: left_space+35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: left_space+90, StartY: offset + 60, Text: "SGST:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                        printBox.Lines.push({ StartX: left_space + 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    }
                    printBox.Lines.push({ StartX: left_space+0, StartY: offset + 65, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                    printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 80, Text: "TOTAL QTY:", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 80, Text: total_qty, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+15, StartY: offset + 100, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+170, StartY: offset + 100, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 115, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 0 });

                    printBox.Lines.push({ StartX: left_space + 30, StartY: offset + 130, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space+35, StartY: offset + 150, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                    PrintService.PrintReceipt(printBox);

                //});
            });
        }
        page.events.btnPrintReceiptTemplateSeventh = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                    total_qty = billItems.length;
                    var length = (billItems.length * 30) + parseInt(550);
                    var printBox = {
                        PrinterName: "TVS MSP 240 Classic Plus",//"CITIZEN CT-S310II",
                        Width: 280,
                        Height: length,
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
                    (t1 > 22) ? t1 = 22 : t1 = t1;
                    var t2 = t1 / 2;
                    var t3 = t2 * 12.72;
                    var com_start = parseInt(140 - t3);
                    var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                    (t4 > 22) ? t4 = 22 : t4 = t4;
                    var t5 = t4 / 2;
                    var t6 = t5 * 12;
                    var add_start = parseInt(140 - t6);
                    if (billDetails.state_text == "Sale" || billDetails.state_text == "Return") {
                        page.billAmount = parseFloat(billDetails.total) - parseFloat(billDetails.bill_discount);
                        if (rec_amount) {
                            confirmAmount().then(function (answer) {
                                if (answer == "Ok") {
                                    printBox.Lines.push({ StartX: 35, StartY: 35, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 18, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO  :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 45, StartY: 80, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 160, StartY: 80, Text: "Date :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 190, StartY: 80, Text: billDetails.bill_date, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 0, StartY: 100, Text: "Cashier :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 45, StartY: 100, Text: CONTEXT.user_name, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 160, StartY: 100, Text: "Time :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 190, StartY: 100, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 0, StartY: 115, Text: "----------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                                    //Header
                                    printBox.Lines.push({ StartX: 0, StartY: 128, Text: "S.No", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 50, StartY: 128, Text: "BillNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 200, StartY: 128, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 0, StartY: 140, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 0, StartY: 155, Text: "1", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 50, StartY: 155, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 200, StartY: 155, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 0, StartY: 170, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 100, StartY: 185, Text: "Total(Rs) :", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 160, StartY: 185, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 0, StartY: 200, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 0, StartY: 210, Text: "CASH AMOUNT", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 200, StartY: 210, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 15, StartY: 230, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 170, StartY: 230, Text: page.cashAmount, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 15, StartY: 250, Text: "Refund", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 170, StartY: 250, Text: parseFloat(page.cashAmount) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                                    printBox.Lines.push({ StartX: 0, StartY: 265, Text: "--------------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 0 });

                                    printBox.Lines.push({ StartX: 50, StartY: 280, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                                    PrintService.PrintReceipt(printBox);
                                }
                            });
                        }
                        else {
                            //confirmAmount().then(function (answer) {
                            //    if (answer == "Ok") {
                            printBox.Lines.push({ StartX: 35, StartY: 35, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 18, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO  :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 45, StartY: 80, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 160, StartY: 80, Text: "Date :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 190, StartY: 80, Text: billDetails.bill_date, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 0, StartY: 100, Text: "Cashier :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 45, StartY: 100, Text: CONTEXT.user_name, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 160, StartY: 100, Text: "Time :", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 190, StartY: 100, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 0, StartY: 115, Text: "----------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                            //Header
                            printBox.Lines.push({ StartX: 0, StartY: 128, Text: "S.No", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 50, StartY: 128, Text: "BillNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 200, StartY: 128, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 0, StartY: 140, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 0, StartY: 155, Text: "1", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 50, StartY: 155, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 200, StartY: 155, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 0, StartY: 170, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 100, StartY: 185, Text: "Total(Rs) :", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 160, StartY: 185, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 0, StartY: 200, Text: "----------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 0, StartY: 210, Text: "CASH AMOUNT", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 200, StartY: 210, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 15, StartY: 230, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 170, StartY: 230, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                            printBox.Lines.push({ StartX: 0, StartY: 265, Text: "--------------------------------------------------------------------------------------------------", FontFamily: "Agency FB", FontSize: 8, FontStyle: 0 });

                            printBox.Lines.push({ StartX: 50, StartY: 280, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                            PrintService.PrintReceipt(printBox);
                            //    }
                            //});
                        }
                    }

                    else {
                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: "CASH BILL", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //Header
                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        // printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        //  printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 140, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 190, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                        var offset = 185;
                        var count = 1;
                        $(billItems).each(function (i, row) {
                            var kgm = "";
                            if (row.unit == "Kilogram") {
                                kgm = row.qty.substring(0, 5);
                            }
                            var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            //printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 50, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 140, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                            count = count + 1;
                            offset = offset + 30;
                        });

                        offset = offset;
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        offset = offset;
                        printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                        if (billDetails.state_text == "Return") { }
                        else {
                            printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        }
                        printBox.Lines.push({ StartX: 0, StartY: offset + 57, Text: "___________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 15, StartY: offset + 80, Text: "TOTAL QTY:", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 80, Text: total_qty, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 15, StartY: offset + 100, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 100, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 0, StartY: offset + 105, Text: "__________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //printBox.Lines.push({ StartX: 20, StartY: offset + 105, Text: "Credit:", FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                        //printBox.Lines.push({ StartX: 100, StartY: offset + 105, Text: pending_balance, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 60, StartY: offset + 130, BarcodeText: billDetails.bill_barcode, FontFamily: "Courier New", FontSize: 28, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 10, StartY: offset + 180, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 20, StartY: offset + 210, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                        for (var i = 0; i < 2;i++)
                            PrintService.PrintReceipt(printBox);
                    }
                //});
            });
        }
        page.events.btnPrintReceiptTemplateEight = function (bill_no, rec_amount) {
            var currentBillNo = bill_no;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                if (rec_amount) {
                    page.billAmount = parseFloat(billDetails.total) - parseFloat(billDetails.bill_discount);
                    confirmAmount().then(function (answer) {
                        if (answer == "Ok") {
                            var tot_mrp = 0;
                                var repInput = {
                                    viewMode: "Standard",
                                    fromDate: "",
                                    toDate: "",
                                    cust_no: data.cust_no,
                                    item_no: "",
                                    bill_type: ""
                                }
                                page.dynaReportService.getSalesReport(repInput, function (data) {
                                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                                    var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                                    $(data).each(function (i, item) {
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

                                    //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                                        var length = (billItems.length * 30) + parseInt(550);
                                        var printBox = {

                                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                            Width: 280,
                                            Height: length,
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
                                        (t1 > 22) ? t1 = 22 : t1 = t1;
                                        var t2 = t1 / 2;
                                        var t3 = t2 * 12.72;
                                        var com_start = parseInt(140 - t3);
                                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                                        (t4 > 22) ? t4 = 22 : t4 = t4;
                                        var t5 = t4 / 2;
                                        var t6 = t5 * 12;
                                        var add_start = parseInt(140 - t6);
                                        var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        //Header
                                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        //printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                                        var offset = 185;
                                        var count = 1;
                                        $(billItems).each(function (i, row) {
                                            row.qty = row.qty + " " + row.unit;
                                            if (row.mrp == "" || typeof row.mrp == "undefined" || row.mrp == null) {
                                                row.mrp = row.price;
                                            }
                                            tot_mrp = tot_mrp + (parseFloat(row.qty) * parseFloat(row.mrp));
                                            var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                            printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                                            count = count + 1;
                                            offset = offset + 30;
                                        });

                                        offset = offset;
                                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        offset = offset;
                                        printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                                        printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                                        printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 65, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 15, StartY: offset + 75, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 75, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 90, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 15, StartY: offset + 100, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 100, Text: page.cashAmount, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 15, StartY: offset + 115, Text: "Refund", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 115, Text: parseFloat(page.cashAmount) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 15, StartY: offset + 130, Text: "Savings", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 130, Text: parseFloat(tot_mrp) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 140, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 20, StartY: offset + 155, Text: "Credit(Rs):", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 100, StartY: offset + 155, Text: pending_balance, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 170, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 10, StartY: offset + 185, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 20, StartY: offset + 205, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                                        PrintService.PrintReceipt(printBox);
                                    //});
                                });
                            
                        }
                    });
                }
                else {
                    var tot_mrp = 0;
                                var repInput = {
                                    viewMode: "Standard",
                                    fromDate: "",
                                    toDate: "",
                                    cust_no: data.cust_no,
                                    item_no: "",
                                    bill_type: ""
                                }
                                page.dynaReportService.getSalesReport(repInput, function (data) {
                                    var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                                    var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                                    $(data).each(function (i, item) {
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

                                    //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                                        var length = (billItems.length * 30) + parseInt(550);
                                        var printBox = {
                                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                            Width: 280,
                                            Height: length,
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
                                        (t1 > 22) ? t1 = 22 : t1 = t1;
                                        var t2 = t1 / 2;
                                        var t3 = t2 * 12.72;
                                        var com_start = parseInt(140 - t3);
                                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                                        (t4 > 22) ? t4 = 22 : t4 = t4;
                                        var t5 = t4 / 2;
                                        var t6 = t5 * 12;
                                        var add_start = parseInt(140 - t6);
                                        var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                                        printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                                        printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        //Header
                                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                        printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        //printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 125, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                                        var offset = 185;
                                        var count = 1;
                                        $(billItems).each(function (i, row) {
                                            row.qty = row.qty + " " + row.unit;
                                            if (row.mrp == "" || typeof row.mrp == "undefined" || row.mrp == null) {
                                                row.mrp = row.price;
                                            }
                                            tot_mrp = tot_mrp + (parseFloat(row.qty) * parseFloat(row.mrp));
                                            var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                            printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 125, StartY: offset + 15, Text: row.qty, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                            printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                                            count = count + 1;
                                            offset = offset + 30;
                                        });

                                        offset = offset;
                                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        offset = offset;
                                        printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                                        printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                                        printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                        
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 65, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 15, StartY: offset + 75, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 75, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 90, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 15, StartY: offset + 100, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 100, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                                        printBox.Lines.push({ StartX: 15, StartY: offset + 115, Text: "Savings", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 170, StartY: offset + 115, Text: parseFloat(tot_mrp) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 125, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 20, StartY: offset + 140, Text: "Credit(Rs):", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 100, StartY: offset + 140, Text: pending_balance, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 0, StartY: offset + 155, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                        printBox.Lines.push({ StartX: 10, StartY: offset + 170, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                        printBox.Lines.push({ StartX: 20, StartY: offset + 190, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                                        PrintService.PrintReceipt(printBox);
                                    //});
                                });
                            
                }
            });
        }
        page.events.btnPrintReceiptTemplateNinth = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            if (rec_amount) {
                page.billAmount = parseFloat(billDetails.total) - parseFloat(billDetails.bill_discount);
                confirmAmount().then(function (answer) {
                    if (answer == "Ok") {
                        //page.stockAPI.getSalesBill(currentBillNo, function (data) {
                        page.billAPI.getValue(currentBillNo, function (data) {
                            var billDetails = data;
                            var billItems = data.bill_items;
                            //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                                var length = (billItems.length * 30) + parseInt(550);
                                var printBox = {

                                    PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                    Width: 280,
                                    Height: length,
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
                                (t1 > 22) ? t1 = 22 : t1 = t1;
                                var t2 = t1 / 2;
                                var t3 = t2 * 12.72;
                                var com_start = parseInt(140 - t3);
                                var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                                (t4 > 22) ? t4 = 22 : t4 = t4;
                                var t5 = t4 / 2;
                                var t6 = t5 * 12;
                                var add_start = parseInt(140 - t6);
                                var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                                printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                                printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                                printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                printBox.Lines.push({ StartX: 0, StartY: 100, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 50, StartY: 100, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                printBox.Lines.push({ StartX: 160, StartY: 100, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 200, StartY: 100, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                                printBox.Lines.push({ StartX: 0, StartY: 110, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                //Header
                                printBox.Lines.push({ StartX: 0, StartY: 125, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 30, StartY: 125, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                printBox.Lines.push({ StartX: 50, StartY: 140, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 140, StartY: 140, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 190, StartY: 140, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                printBox.Lines.push({ StartX: 0, StartY: 145, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                                var offset = 165;
                                var count = 1;
                                $(billItems).each(function (i, row) {
                                    var kgm = "";
                                    if (row.unit == "Kilogram") {
                                        kgm = row.qty.substring(0, 5);
                                    }
                                    var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                                    printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                    printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                    printBox.Lines.push({ StartX: 50, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                    printBox.Lines.push({ StartX: 140, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                    printBox.Lines.push({ StartX: 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                                    count = count + 1;
                                    offset = offset + 30;
                                });

                                offset = offset;
                                printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                offset = offset;
                                if (billDetails.state_text == "Return") { }
                                else {
                                    printBox.Lines.push({ StartX: 0, StartY: offset + 15, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 35, StartY: offset + 15, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 90, StartY: offset + 15, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 125, StartY: offset + 15, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                }

                                printBox.Lines.push({ StartX: 0, StartY: offset + 17, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                printBox.Lines.push({ StartX: 15, StartY: offset + 27, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 170, StartY: offset + 27, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 0, StartY: offset + 45, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                printBox.Lines.push({ StartX: 15, StartY: offset + 55, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 170, StartY: offset + 55, Text: page.cashAmount, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 15, StartY: offset + 70, Text: "Refund", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 170, StartY: offset + 70, Text: parseFloat(page.cashAmount) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 0, StartY: offset + 80, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                printBox.Lines.push({ StartX: 10, StartY: offset + 100, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                printBox.Lines.push({ StartX: 20, StartY: offset + 130, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                                PrintService.PrintReceipt(printBox);
                            //});
                        });
                    }
                });
            }
            else {
                //confirmAmount().then(function (answer) {
                //    if (answer == "Ok") {
                //page.stockAPI.getSalesBill(currentBillNo, function (data) {
                page.billAPI.getValue(currentBillNo, function (data) {
                    var billDetails = data;
                    var billItems = data.bill_items;
                    //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                        var length = (billItems.length * 30) + parseInt(550);
                        var printBox = {
                            PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                            Width: 280,
                            Height: length,
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
                        (t1 > 22) ? t1 = 22 : t1 = t1;
                        var t2 = t1 / 2;
                        var t3 = t2 * 12.72;
                        var com_start = parseInt(140 - t3);
                        var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                        (t4 > 22) ? t4 = 22 : t4 = t4;
                        var t5 = t4 / 2;
                        var t6 = t5 * 12;
                        var add_start = parseInt(140 - t6);
                        var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                        printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 0, StartY: 100, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 50, StartY: 100, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 160, StartY: 100, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 200, StartY: 100, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                        printBox.Lines.push({ StartX: 0, StartY: 110, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        //Header
                        printBox.Lines.push({ StartX: 0, StartY: 125, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 30, StartY: 125, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 50, StartY: 140, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 140, StartY: 140, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 190, StartY: 140, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        printBox.Lines.push({ StartX: 0, StartY: 145, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                        var offset = 165;
                        var count = 1;
                        $(billItems).each(function (i, row) {
                            var kgm = "";
                            if (row.unit == "Kilogram") {
                                kgm = row.qty.substring(0, 5);
                            }
                            var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 50, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 140, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                            count = count + 1;
                            offset = offset + 30;
                        });

                        offset = offset;
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        offset = offset;
                        if (billDetails.state_text == "Return") { }
                        else {
                            printBox.Lines.push({ StartX: 0, StartY: offset + 15, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 35, StartY: offset + 15, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 90, StartY: offset + 15, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 125, StartY: offset + 15, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        }

                        printBox.Lines.push({ StartX: 0, StartY: offset + 17, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 15, StartY: offset + 27, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 27, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 0, StartY: offset + 45, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 15, StartY: offset + 55, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 170, StartY: offset + 55, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                        printBox.Lines.push({ StartX: 0, StartY: offset + 80, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                        printBox.Lines.push({ StartX: 10, StartY: offset + 100, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                        printBox.Lines.push({ StartX: 20, StartY: offset + 130, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                        PrintService.PrintReceipt(printBox);
                    //});
                });
                //    }
                //});
            }
        }
        page.events.btnPrintReceiptTemplateTenth = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                    var length = (billItems.length * 30) + parseInt(550);
                    var printBox = {

                        PrinterName: "TVS MSP 240 Classic Plus",//"CITIZEN CT-S310II",
                        Width: 600,
                        Height: length,
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
                    (t1 > 22) ? t1 = 22 : t1 = t1;
                    var t2 = t1 / 2;
                    var t3 = t2 * 12.72;
                    var com_start = parseInt(140 - t3);
                    var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                    (t4 > 22) ? t4 = 22 : t4 = t4;
                    var t5 = t4 / 2;
                    var t6 = t5 * 12;
                    var add_start = parseInt(140 - t6);
                    var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                    printBox.Lines.push({ StartX: parseInt(com_start)+100, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 230, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 250, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 260, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 180, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 248, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 180, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 245, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 370, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 430, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                    printBox.Lines.push({ StartX: 180, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 230, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 340, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 380, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 180, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    //Header
                    printBox.Lines.push({ StartX: 180, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                    printBox.Lines.push({ StartX: 210, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 210, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 250, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                    printBox.Lines.push({ StartX: 310, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 350, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 390, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 180, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                    var offset = 185;
                    var count = 1;
                    $(billItems).each(function (i, row) {
                        var kgm = "";
                        if (row.unit == "Kilogram") {
                            kgm = row.qty.substring(0, 5);
                        }
                        var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                        printBox.Lines.push({ StartX: 180, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 210, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 250, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 310, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 350, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 390, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                        count = count + 1;
                        offset = offset + 30;
                    });

                    offset = offset;
                    printBox.Lines.push({ StartX: 180, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    offset = offset;
                    printBox.Lines.push({ StartX: 240, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 350, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                    printBox.Lines.push({ StartX: 240, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 350, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                    printBox.Lines.push({ StartX: 180, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 215, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 270, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 305, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                        
                    printBox.Lines.push({ StartX: 180, StartY: offset + 57, Text: "___________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    printBox.Lines.push({ StartX: 195, StartY: offset + 80, Text: "TOTAL AMT(Rs):", FontFamily: "Courier New", FontSize: 12, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 350, StartY: offset + 80, Text: billDetails.total, FontFamily: "Courier New", FontSize: 12, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 180, StartY: offset + 82, Text: "__________________________________", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    printBox.Lines.push({ StartX: 190, StartY: offset + 120, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 190, StartY: offset + 150, Text: "", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                    PrintService.PrintReceipt(printBox);

                //});
            });
        }
        page.events.btnPrintReceiptTemplateEleven = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            var left_side = 10;
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                    var length = (billItems.length * 30) + parseInt(550);
                    var printBox = {

                        PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"TVS Printer",
                        Width: 480,
                        Height: length,
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
                    (t1 > 22) ? t1 = 22 : t1 = t1;
                    var t2 = t1 / 2;
                    var t3 = t2 * 15;
                    var com_start = parseInt(500 - t3);
                    var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                    (t4 > 22) ? t4 = 22 : t4 = t4;
                    var t5 = t4 / 2;
                    var t6 = t5 * 12;
                    var add_start = parseInt(140 - t6);
                    var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                    printBox.Lines.push({ StartX: 170, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 160, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE1.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 200, StartY: 40, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 180, StartY: 60, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 180, StartY: 80, Text: "GST No:" + CONTEXT.COMPANY_GST_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 180, StartY: 100, Text: "DL No:" + CONTEXT.COMPANY_DL_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 220, StartY: 120, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 30, StartY: 140, Text: "Doctor:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 110, StartY: 140, Text: billDetails.sale_executive_name, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 30, StartY: 160, Text: "Name:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 110, StartY: 160, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 250, StartY: 140, Text: "Bill No:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 350, StartY: 140, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                    printBox.Lines.push({ StartX: 250, StartY: 160, Text: "Date:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 300, StartY: 160, Text: billDetails.bill_date+" "+currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                    printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    //Header
                    //printBox.Lines.push({ StartX: 0, StartY: 180, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                    printBox.Lines.push({ StartX: 0, StartY: 180, Text: "Particulars", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 150, StartY: 180, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 195, StartY: 180, Text: "Ex.Date", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                    printBox.Lines.push({ StartX: 265, StartY: 180, Text: "GST%", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                    printBox.Lines.push({ StartX: 320, StartY: 180, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 390, StartY: 180, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 0, StartY: 190, Text: "----------------------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                    var offset = 215;
                    var count = 1;
                    $(billItems).each(function (i, row) {
                        var monthex;
                        var yearex
                        var ex_date = row.expiry_date;
                        if (row.expiry_date != null && row.expiry_date != undefined && row.expiry_date != "") {
                            monthex = row.expiry_date.substring(3, 5);
                            yearex = row.expiry_date.substring(6, 10);
                            ex_date = monthex + "-" + yearex;
                        }
                        var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                        //printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: itemName.substring(0, 18), FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 150, StartY: offset, Text: parseInt(row.qty), FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 195, StartY: offset, Text: ex_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                        printBox.Lines.push({ StartX: 265, StartY: offset, Text: row.gst, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 320, StartY: offset, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                        printBox.Lines.push({ StartX: 390, StartY: offset, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                        count = count + 1;
                        offset = offset + 20;
                    });

                    offset = offset;
                    printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    offset = offset;
                    printBox.Lines.push({ StartX: 200, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 300, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 12, FontStyle: 16 });

                    printBox.Lines.push({ StartX: 200, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 12, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 300, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 16 });
                    
                    printBox.Lines.push({ StartX: 100, StartY: offset + 65, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 135, StartY: offset + 65, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 190, StartY: offset + 65, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    printBox.Lines.push({ StartX: 225, StartY: offset + 65, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                    

                    printBox.Lines.push({ StartX: 0, StartY: offset + 70, Text: "----------------------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    printBox.Lines.push({ StartX: 40, StartY: offset + 85, Text: "TOTAL AMT(Rs):", FontFamily: "Courier New", FontSize: 16, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 250, StartY: offset + 85, Text: billDetails.total, FontFamily: "Courier New", FontSize: 16, FontStyle: 16 });
                    printBox.Lines.push({ StartX: 0, StartY: offset + 105, Text: "----------------------------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                    printBox.Lines.push({ StartX: 120, StartY: offset + 120, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                    PrintService.PrintReceipt(printBox);
                //});
            });
                
        }
        page.events.btnPrintReceiptTemplateTwelve = function (bill_no, rec_amount) {
            var currentBillNo = bill_no;
            //page.stockAPI.getSalesBill(currentBillNo, function (data) {
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                if (rec_amount) {
                    page.billAmount = parseFloat(billDetails.total) - parseFloat(billDetails.bill_discount);
                    confirmAmount().then(function (answer) {
                        if (answer == "Ok") {
                            var tot_mrp = 0;
                            var repInput = {
                                viewMode: "Standard",
                                fromDate: "",
                                toDate: "",
                                cust_no: data.cust_no,
                                item_no: "",
                                bill_type: ""
                            }
                            page.dynaReportService.getSalesReport(repInput, function (data) {
                                var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                                var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                                $(data).each(function (i, item) {
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

                                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                                    var length = (billItems.length * 30) + parseInt(550);
                                    var printBox = {

                                        PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                        Width: 280,
                                        Height: length,
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
                                    (t1 > 22) ? t1 = 22 : t1 = t1;
                                    var t2 = t1 / 2;
                                    var t3 = t2 * 12.72;
                                    var com_start = parseInt(140 - t3);
                                    var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                                    (t4 > 22) ? t4 = 22 : t4 = t4;
                                    var t5 = t4 / 2;
                                    var t6 = t5 * 12;
                                    var add_start = parseInt(140 - t6);
                                    var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                                    printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                    printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                                    printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                                    printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                                    printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                                    printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                    //Header
                                    printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                    printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                    //printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                    //printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                                    var offset = 185;
                                    var count = 1;
                                    $(billItems).each(function (i, row) {
                                        row.qty = row.qty + " " + row.unit;
                                        if (row.mrp == "" || typeof row.mrp == "undefined" || row.mrp == null) {
                                            row.mrp = row.price;
                                        }
                                        tot_mrp = tot_mrp + (parseFloat(row.qty) * parseFloat(row.mrp));
                                        var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                                        printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                        //printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: row.qty.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                        printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                                        count = count + 1;
                                        offset = offset + 30;
                                    });

                                    offset = offset;
                                    printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                    offset = offset;
                                    printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                                    printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                                    printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                                    printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                                    printBox.Lines.push({ StartX: 0, StartY: offset + 65, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                    printBox.Lines.push({ StartX: 15, StartY: offset + 75, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 170, StartY: offset + 75, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 0, StartY: offset + 90, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                    printBox.Lines.push({ StartX: 15, StartY: offset + 110, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 170, StartY: offset + 110, Text: page.cashAmount, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    var pandingText;
                                    pandingText = (billDetails.pay_mode == "EMI") ? "Pending Due" : "Refund";
                                    var refundAmt = 0;
                                    if (billDetails.pay_mode == "EMI") {
                                        refundAmt = parseFloat(billDetails.total) - parseFloat(page.cashAmount);
                                    }
                                    else {
                                        refundAmt=parseFloat(page.cashAmount) - parseFloat(billDetails.total)
                                    }
                                    printBox.Lines.push({ StartX: 15, StartY: offset + 128, Text: pandingText, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 170, StartY: offset + 128, Text: refundAmt, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    //printBox.Lines.push({ StartX: 15, StartY: offset + 130, Text: "Savings", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    //printBox.Lines.push({ StartX: 170, StartY: offset + 130, Text: parseFloat(tot_mrp) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    printBox.Lines.push({ StartX: 0, StartY: offset + 140, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                    if (billDetails.pay_mode != "EMI") {
                                        printBox.Lines.push({ StartX: 20, StartY: offset + 155, Text: "Credit(Rs):", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                        printBox.Lines.push({ StartX: 100, StartY: offset + 155, Text: pending_balance, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                    }
                                    printBox.Lines.push({ StartX: 0, StartY: offset + 170, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                                    printBox.Lines.push({ StartX: 10, StartY: offset + 185, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                                    printBox.Lines.push({ StartX: 20, StartY: offset + 205, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                                    PrintService.PrintReceipt(printBox);
                                //});
                            });

                        }
                    });
                }
                else {
                    var tot_mrp = 0;
                    var repInput = {
                        viewMode: "Standard",
                        fromDate: "",
                        toDate: "",
                        cust_no: data.cust_no,
                        item_no: "",
                        bill_type: ""
                    }
                    page.dynaReportService.getSalesReport(repInput, function (data) {
                        var salSummary = { tot_sale: 0, tot_pay: 0, tot_ret: 0, tot_ret_pay: 0 };
                        var poSummary = { tot_ret: 0, tot_ret_pay: 0, tot_ret_bal: 0 }
                        $(data).each(function (i, item) {
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

                        //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                            var length = (billItems.length * 30) + parseInt(550);
                            var printBox = {
                                PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                                Width: 280,
                                Height: length,
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
                            (t1 > 22) ? t1 = 22 : t1 = t1;
                            var t2 = t1 / 2;
                            var t3 = t2 * 12.72;
                            var com_start = parseInt(140 - t3);
                            var t4 = (CONTEXT.COMPANY_ADDRESS_LINE2).length;
                            (t4 > 22) ? t4 = 22 : t4 = t4;
                            var t5 = t4 / 2;
                            var t6 = t5 * 12;
                            var add_start = parseInt(140 - t6);
                            var bill_title = (billDetails.state_text == "Return") ? "RETURN BILL" : "CASH BILL";

                            printBox.Lines.push({ StartX: com_start, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Courier New", FontSize: 14, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 80, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 60, StartY: 40, Text: "Ph.No:" + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });
                            printBox.Lines.push({ StartX: 90, StartY: 60, Text: bill_title, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 0, StartY: 80, Text: "BILL NO:", FontFamily: "Courier New", FontSize: 10, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 65, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 190, StartY: 100, Text: "Cus Id:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 240, StartY: 100, Text: billDetails.cust_no, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                            printBox.Lines.push({ StartX: 0, StartY: 120, Text: "DATE:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 160, StartY: 120, Text: "TIME:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 200, StartY: 120, Text: currentDate, FontFamily: "Courier New", FontSize: 8, FontStyle: 1 });

                            printBox.Lines.push({ StartX: 0, StartY: 130, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            //Header
                            printBox.Lines.push({ StartX: 0, StartY: 145, Text: "SNo", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 30, StartY: 145, Text: "Product", FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                            //printBox.Lines.push({ StartX: 30, StartY: 160, Text: "MRP", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 80, StartY: 160, Text: "Rate", FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                            //printBox.Lines.push({ StartX: 130, StartY: 160, Text: "Kgs", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 125, StartY: 160, Text: "Qty", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 210, StartY: 160, Text: "Amount", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 0, StartY: 165, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                            var offset = 185;
                            var count = 1;
                            $(billItems).each(function (i, row) {
                                row.qty = row.qty + " " + row.unit;
                                
                                if (row.mrp == "" || typeof row.mrp == "undefined" || row.mrp == null) {
                                    row.mrp = row.price;
                                }
                                tot_mrp = tot_mrp + (parseFloat(row.qty) * parseFloat(row.mrp));
                                var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                                printBox.Lines.push({ StartX: 0, StartY: offset, Text: count, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 30, StartY: offset, Text: itemName, FontFamily: "Courier New", FontSize: 8, FontStyle: 3 });
                                //printBox.Lines.push({ StartX: 30, StartY: offset + 15, Text: (row.mrp == null) ? 0 : row.mrp.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 80, StartY: offset + 15, Text: (row.price == null) ? 0 : row.price.substring(0, 5), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                //printBox.Lines.push({ StartX: 130, StartY: offset + 15, Text: kgm, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 125, StartY: offset + 15, Text: row.qty, FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });
                                printBox.Lines.push({ StartX: 210, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Courier New", FontSize: 8, FontStyle: 0 });

                                count = count + 1;
                                offset = offset + 30;
                            });

                            offset = offset;
                            printBox.Lines.push({ StartX: 0, StartY: offset, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            offset = offset;
                            printBox.Lines.push({ StartX: 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                            printBox.Lines.push({ StartX: 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Courier New", FontSize: 10, FontStyle: 3 });

                            printBox.Lines.push({ StartX: 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });
                            printBox.Lines.push({ StartX: 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Courier New", FontSize: 8, FontStyle: 2 });

                            printBox.Lines.push({ StartX: 0, StartY: offset + 65, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            printBox.Lines.push({ StartX: 15, StartY: offset + 75, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 75, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 0, StartY: offset + 90, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });

                            printBox.Lines.push({ StartX: 15, StartY: offset + 100, Text: "Received", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 100, Text: billDetails.total_paid_amount, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                            var pandingText;
                            pandingText = (billDetails.pay_mode == "EMI") ? "Pending Due" : "Balance";
                            printBox.Lines.push({ StartX: 15, StartY: offset + 115, Text: pandingText, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 115, Text: billDetails.balance, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                            /*printBox.Lines.push({ StartX: 15, StartY: offset + 115, Text: "Savings", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 170, StartY: offset + 115, Text: parseFloat(tot_mrp) - parseFloat(billDetails.total), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            printBox.Lines.push({ StartX: 0, StartY: offset + 125, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });*/

                            if (billDetails.pay_mode != "EMI") {
                                printBox.Lines.push({ StartX: 20, StartY: offset + 140, Text: "Credit(Rs):", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                                printBox.Lines.push({ StartX: 100, StartY: offset + 140, Text: pending_balance, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                            }
                            printBox.Lines.push({ StartX: 0, StartY: offset + 155, Text: "----------------------", FontFamily: "Courier New", FontSize: 14, FontStyle: 0 });
                            printBox.Lines.push({ StartX: 10, StartY: offset + 170, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Courier New", FontSize: 10, FontStyle: 1 });
                            printBox.Lines.push({ StartX: 20, StartY: offset + 190, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Courier New", FontSize: 6, FontStyle: 1 });

                            PrintService.PrintReceipt(printBox);
                        //});
                    });

                }
            });
        }
        page.events.btnPrintReceiptTemplateThirteen = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            var left_space = 15;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data){
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                total_qty = billItems.length;
                var length = (billItems.length * 30) + parseInt(550);
                var printBox = {

                    PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                    Width: 280,
                    Height: length,
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
                printBox.Lines.push({ StartX: left_space + 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 14, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 100, Text: "Cus Id:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 100, Text: billDetails.cust_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 120, Text: "DATE:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 120, Text: "TIME:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 120, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 130, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                //Header
                printBox.Lines.push({ StartX: left_space + 0, StartY: 150, Text: "SNo", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 30, StartY: 150, Text: "Product", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 80, StartY: 160, Text: "Rate", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 125, StartY: 160, Text: "Qty", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 190, StartY: 160, Text: "Amount", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 165, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                var offset = 185;
                var count = 1;
                var tot_qty = 0;
                $(billItems).each(function (i, row) {
                    var kgm = "";
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
                    var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                    if (billDetails.state_text != "Return")
                        if (row.tax_inclusive == "1")
                            row.price = parseFloat(row.price) / parseFloat((parseFloat(row.tax_per) / 100) + 1);

                    (row.unit_identity == "0") ? row.unit = row.unit : row.unit = row.alter_unit;
                    (row.unit == "") ? row.unit = "" : row.unit = row.unit;
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: count, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 30, StartY: offset, Text: itemName, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 80, StartY: offset + 15, Text: (row.price == null) ? 0 : parseFloat(row.price).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 125, StartY: offset + 15, Text: row.qty, FontFamily: "Agency FB", FontSize: 10, FontStyle: 0 });
                    printBox.Lines.push({ StartX: left_space + 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                    count = count + 1;
                    offset = offset + 30;
                });

                offset = offset;
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                offset = offset;
                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 20, Text: "Sub Total:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                //printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 20, Text: parseFloat(parseFloat(billDetails.sub_total)+parseFloat(billDetails.discount)).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 20, Text: parseFloat(billDetails.sub_total).toFixed(2), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 40, Text: "Discount:", FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                //if (billDetails.state_text == "Return") { }
                //else {
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 60, Text: "CGST:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 35, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 90, StartY: offset + 60, Text: "SGST:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 125, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                //}
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 65, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 80, Text: "TOTAL QTY:", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 80, Text: tot_qty, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 100, Text: "TOTAL AMT(Rs):", FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 100, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 115, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 0 });

                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 130, BarcodeText: billDetails.bill_id, FontFamily: "Courier New", FontSize: 28, FontStyle: 1 });

                printBox.Lines.push({ StartX: left_space + 30, StartY: offset + 185, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 35, StartY: offset + 215, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                //PrintService.PrintReceiptCallback(printBox, function (data) {
                PrintService.PrintReceipt(printBox);
                setTimeout(function () {
                    PrintService.PrintReceipt(printBox);
                }, 100);
                //});
                //});
            });
        }
        page.events.btnPrintReceiptTemplateFourteen = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            var left_space = 15;
            //page.billService.getBill(currentBillNo, function (data) {
            //page.stockAPI.getSalesBill(currentBillNo, function (data){
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                //page.billService.getBillItem(billDetails.bill_id, function (billItems) {
                total_qty = billItems.length;
                var length = (billItems.length * 30) + parseInt(550);
                var printBox = {

                    PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                    Width: 280,
                    Height: length,
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

                printBox.Lines.push({ StartX: com_start - 20, StartY: 0, Text: CONTEXT.COMPANY_NAME.substring(0, 22), FontFamily: "Agency FB", FontSize: 14, FontStyle: 1 });
                printBox.Lines.push({ StartX: add_start, StartY: 20, Text: CONTEXT.COMPANY_ADDRESS_LINE2.substring(0, 22), FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: 80, StartY: 40, Text: "Ph.No: " + CONTEXT.COMPANY_PHONE_NO, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });
                printBox.Lines.push({ StartX: cashbill_start, StartY: 60, Text: bill_title, FontFamily: "Agency FB", FontSize: 12, FontStyle: 1 });
                //WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Bill No:"]
                printBox.Lines.push({ StartX: left_space + 0, StartY: 80, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Bill No:"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 68, StartY: 80, Text: billDetails.bill_id, FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 100, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Customer:"], FontFamily: "Agency FB", FontSize: 6, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 100, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Cus Id:"], FontFamily: "Agency FB", FontSize: 6, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 100, Text: billDetails.cust_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 120, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["DATE:"], FontFamily: "Agency FB", FontSize: 6, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 120, Text: billDetails.bill_date, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 120, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["TIME:"], FontFamily: "Agency FB", FontSize: 6, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 120, Text: currentDate, FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 135, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                //Header
                printBox.Lines.push({ StartX: left_space + 0, StartY: 150, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["SNo"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 150, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Product"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 80, StartY: 165, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Rate"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 125, StartY: 165, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Qty"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 190, StartY: 165, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Amount"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 170, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });
                var offset = 190;
                var count = 1;
                $(billItems).each(function (i, row) {
                    var kgm = "";
                    if (row.unit == "Kilogram") {
                        kgm = row.qty.substring(0, 5);
                    }
                    var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
                    (row.unit_identity == "0") ? row.unit = row.unit : row.unit = row.alter_unit;
                    (row.unit == "") ? row.unit = "" : row.unit = row.unit;
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: count, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 50, StartY: offset, Text: itemName, FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 80, StartY: offset + 15, Text: (row.price == null) ? 0 : parseFloat(row.price).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 125, StartY: offset + 15, Text: parseFloat(row.qty).toFixed(2) + " " + row.unit, FontFamily: "Agency FB", FontSize: 10, FontStyle: 0 });
                    printBox.Lines.push({ StartX: left_space + 190, StartY: offset + 15, Text: parseFloat(parseFloat(row.price) * parseFloat(row.qty)).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                    count = count + 1;
                    offset = offset + 30;
                });

                offset = offset;
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                offset = offset;
                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 20, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Sub Total:"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 20, Text: billDetails.sub_total, FontFamily: "Agency FB", FontSize: 12, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 60, StartY: offset + 40, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["Discount:"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 40, Text: billDetails.discount, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                if (billDetails.state_text == "Return") { }
                else {
                    printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 60, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["CGST:"], FontFamily: "Agency FB", FontSize: 6, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 55, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 90, StartY: offset + 60, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["SGST:"], FontFamily: "Agency FB", FontSize: 6, FontStyle: 16 });
                    printBox.Lines.push({ StartX: left_space + 155, StartY: offset + 60, Text: parseFloat(billDetails.tax) / 2, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                }
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 65, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 85, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["TOTAL QTY:"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 85, Text: total_qty, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 15, StartY: offset + 105, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["TOTAL AMT(Rs):"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 105, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 120, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 0 });

                printBox.Lines.push({ StartX: left_space + 40, StartY: offset + 140, Text: WEBUI.LANG[CONTEXT.CurrentSecondaryLanguage]["**  THANK YOU VISIT AGAIN  **"], FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 35, StartY: offset + 160, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                PrintService.PrintReceipt(printBox);
                //});
            });
        }
        page.events.btnPrintReceiptTemplateFifteen = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            var currentBillNo = bill_no;
            var total_qty = 0;
            var left_space = 15;
            page.billAPI.getValue(currentBillNo, function (data) {
                var billDetails = data;
                var billItems = data.bill_items;
                total_qty = billItems.length;
                var length = (billItems.length * 40) + parseInt(550);
                var printBox = {

                    PrinterName: CONTEXT.RECEIPT_PRINTER_NAME,//"CITIZEN CT-S310II",
                    Width: 280,
                    Height: length,
                    Copies: 1,
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
                printBox.Lines.push({ StartX: left_space + 68, StartY: 80, Text: bill_no, FontFamily: "Agency FB", FontSize: 14, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: 100, Text: "CUSTOMER:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 100, Text: billDetails.cust_name == null ? "" : billDetails.cust_name.substring(0, 15), FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space + 160, StartY: 100, Text: "Cus Id:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 200, StartY: 100, Text: billDetails.cust_no, FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space + 0, StartY: 120, Text: "DATE:", FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 50, StartY: 120, Text: billDetails.bill_date.split("-")[1] + "-" + billDetails.bill_date.split("-")[0] + "-" + billDetails.bill_date.split("-")[2], FontFamily: "Agency FB", FontSize: 10, FontStyle: 1 });
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
                    var itemName = (row.item_name_tr != null) ? row.item_name_tr : row.item_name;
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
                    printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 40, Text: parseFloat(billDetails.discount).toFixed(2), FontFamily: "Agency FB", FontSize: 10, FontStyle: 16 });
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
                printBox.Lines.push({ StartX: left_space + 170, StartY: offset + 100, Text: billDetails.total, FontFamily: "Agency FB", FontSize: 16, FontStyle: 16 });
                printBox.Lines.push({ StartX: left_space + 0, StartY: offset + 115, Text: "--------------------------------------------", FontFamily: "Agency FB", FontSize: 14, FontStyle: 0 });

                //if (parseInt(billDetails.bill_id) < 1000) {
                //    billDetails.bill_id = "00" + billDetails.bill_id;
                //}
                printBox.Lines.push({ StartX: left_space + 40, StartY: offset + 135, BarcodeText: getBitByZero(bill_no, 20), FontFamily: "Courier New", FontSize: 28, FontStyle: 1, TextHeight: 20, TextWidth: 130 });

                printBox.Lines.push({ StartX: left_space + 30, StartY: offset + 165, Text: "**  THANK YOU VISIT AGAIN  **", FontFamily: "Agency FB", FontSize: 14, FontStyle: 16 });

                printBox.Lines.push({ StartX: left_space, StartY: offset + 185, Text: "குறிப்புகள்", FontFamily: "Agency FB", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space, StartY: offset + 200, Text: "1. பொருட்களை 3 நாட்களுக்குள் மாற்றிக் கொள்ளலாம்", FontFamily: "Agency FB", FontSize: 6, FontStyle: 1 });
                printBox.Lines.push({ StartX: left_space, StartY: offset + 215, Text: "2. ரசீது இன்றி மாற்ற இயலாது", FontFamily: "Agency FB", FontSize: 6, FontStyle: 1 });

                //printBox.Lines.push({ StartX: left_space + 35, StartY: offset + 255, Text: "Software By WOTO TECH Visit www.wototech.com", FontFamily: "Agency FB", FontSize: 8, FontStyle: 16 });

                //PrintService.PrintReceiptCallback(printBox, function (data) {
                    PrintService.PrintReceipt(printBox);
                //});
                
            });
        }
        page.events.btnPrintReceiptTemplateSixteen = function (bill_no, rec_amount) {
            $$("msgPanel").flash("Printing the selected Bill.Please wait.");
            
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
            
            page.billAPI.getValue(bill_no, function (data) {
                var bill_title = (data.state_text == "Return") ? "RETURN BILL" : "CASH BILL";
                var subTotal = 0;
                $(data.bill_items).each(function (i, item) {
                    var temp_qty = item.qty;
                    var temp_price = item.price;
                    subTotal =subTotal + parseFloat(temp_price) * parseFloat(temp_qty);
                    if (parseInt(item.free_qty) != 0) {
                        tot_qty = tot_qty + parseFloat(item.qty) + parseFloat(item.free_qty);
                        item.qty = item.qty + " + " + item.free_qty + " " + item.unit;
                    }
                    else {
                        tot_qty = tot_qty + parseFloat(item.qty);
                        item.qty = item.qty + " " + item.unit;
                    }
                    if (data.state_text != "Return")
                        if (item.tax_inclusive == "1")
                            item.price = parseFloat(parseFloat(item.price) / parseFloat((parseFloat(item.tax_per) / 100) + 1)).toFixed(2);
                    billData.push({
                        SlNo: i + 1,
                        ItemName: item.item_name,
                        Rate: convertBitString(temp_price.toString(), 6) + " ",
                        Price: convertBitString(item.price.toString(), 6),
                        Qty: convertBitString(item.qty, 12),
                        Amount: parseFloat(item.total_price).toFixed(2),//parseFloat(parseFloat(item.price) * parseFloat(temp_qty)).toFixed(2),
                        Discount: convertBitString(item.discount, 9)
                    });
                });
                if (data.state_text == "Return") {
                    subTotal = subTotal + parseFloat(data.tax);
                }
                //var billSummary = "Sale:" + parseFloat(subTotal).toFixed(2) + " | GST:" + parseFloat(data.tax).toFixed(2) + " | Dis:" + parseFloat(data.discount).toFixed(2);
                var billSummary = "Sale + GST:" + parseFloat(subTotal).toFixed(2) + " | Dis:" + parseFloat(data.discount).toFixed(2);
                var printData = {
                    CompanyName: CONTEXT.COMPANY_NAME,
                    Address: CONTEXT.COMPANY_ADDRESS_LINE1.substring(0, 15),
                    PhoneNo: CONTEXT.COMPANY_PHONE_NO,
                    Copies: 1,
                    BillType: bill_title,
                    BillNo: bill_no,
                    Customer: (data.cust_name == null) ? "" : data.cust_name,
                    CustId: (data.cust_no == null) ? "" : data.cust_no,
                    BillDate: data.bill_date.split("-")[1] + "-" + data.bill_date.split("-")[0] + "-" + data.bill_date.split("-")[2],
                    BillTime: currentDate,
                    SubTotal: billSummary,//parseFloat(data.sub_total).toFixed(2),
                    Discount: parseFloat(data.discount).toFixed(2),
                    Tax: parseFloat(data.tax).toFixed(2),
                    TotalQty: tot_qty,
                    TotalAmount: parseFloat(data.total).toFixed(2),
                    BarCodeText: getBitByZero(bill_no, 10),
                    Template:"Template2",
                    BillItems: billData
                }
                PrintService.PrintPOSReceipt(printData);
            });
        }
        page.events.btnDeleteBill_click = function () {

            if (confirm("Are you sure want to delete the bill!")) {
                //Get Selected Bill
                var bill = page.controls.grdSales.selectedData()[0];
                if (bill == undefined || bill == '') {
                    $$("msgPanel").show("Select data first which you want to delete");
                } else {
                    //Delete the bill
                    page.billService.deleteBill(bill.bill_no, function (data) {
                        //alert("Bill is removed");
                        ShowDialogBox('Message', 'Bill is removed successfully...!', 'Ok', '', null);
                        //Reload Sales
                        page.loadSales();
                    });
                }
            }

        }

        page.view = {
            salesList: function (data) {
                $$("grdSales").dataBind(data);
            },
            selectedPendingPayment: function (data) {
                $$("lblTotalAmount").value("0");
                $$("lblTotalPendingAmount").value(parseFloat(0));
                $$("txtReceivedAmount").value("0");

                $$("grdPendingPayment").width("100%");
                $$("grdPendingPayment").height("220px");
                $$("grdPendingPayment").setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "80px", 'dataField': "bill_no" },
                        //{ 'name': "Bill No", 'rlabel': 'Bill No', 'width': "80px", 'dataField': "bill_id",visible:false },
                        { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                        { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "100px", 'dataField': "bill_type" },
                        { 'name': "Bill Month", 'rlabel': 'Bill Month', 'width': "90px", 'dataField': "sch_id", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                        { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                        { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "130px", 'dataField': "total" },
                        { 'name': "Payment Date", 'rlabel': 'Payment Date', 'width': "130px", 'dataField': "pay_date", visible: ($$("ddlBillView").selectedValue() == "Payment View") },
                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "total_paid_amount" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance", visible: ($$("ddlBillView").selectedValue() != "Payment View") },
                        { 'name': "", 'width': "0px", 'dataField': "expense_amt" },
                        { 'name': "Amount Pay", 'rlabel': 'Amount Pay', 'width': "120px", 'dataField': "amount_pay", editable: true },
                        { 'name': "", 'width': "50px", 'dataField': "pay_type", itemTemplate: "<input type='button' class='grid-button' value='' action='Delete' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />", visible: ($$("ddlBillView").selectedValue() == "Bill View") }
                    ]
                });
                //Handle Row Command
                page.controls.grdPendingPayment.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    var amount = 0;
                    //To Handle removing an item from list.
                    if (action == "Delete") {
                        page.controls.grdPendingPayment.deleteRow(rowId);
                        var amount = 0;
                        var payAmount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if (item.bill_type == "Sale") {
                                amount = parseFloat(amount) + parseFloat(item.balance);
                                payAmount = parseFloat(payAmount) + parseFloat(item.amount_pay);
                            }
                            else if (item.bill_type == "SaleReturn") {
                                amount = parseFloat(amount) - parseFloat(item.balance);
                                payAmount = parseFloat(payAmount) - parseFloat(item.amount_pay);
                            }
                        });
                        $$("lblTotalPendingAmount").value(parseFloat(amount));
                        $$("lblTotalAmount").value(parseFloat(parseFloat(amount) - parseFloat($$("txtPendingPaymentDiscount").value())).toFixed(2));
                        $$("txtReceivedAmount").value(parseFloat(payAmount).toFixed(2));
                        $$("lblPaymentBalance").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat($$("lblTotalAmount").value())).toFixed(2));
                    }
                }
                $$("grdPendingPayment").rowBound = function (row, item) {
                    item.amount_pay = parseFloat(item.balance);
                    if (item.bill_type == "Sale") {
                        $$("lblTotalAmount").value(parseFloat(parseFloat($$("lblTotalAmount").value()) + parseFloat(item.balance)).toFixed(2));
                        $$("lblTotalPendingAmount").value(parseFloat($$("lblTotalAmount").value()).toFixed(2));
                        $$("txtReceivedAmount").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) + parseFloat(item.amount_pay)).toFixed(2));
                    }
                    else if (item.bill_type == "SaleReturn") {
                        $$("lblTotalAmount").value(parseFloat(parseFloat($$("lblTotalAmount").value()) - parseFloat(item.balance)).toFixed(2));
                        $$("lblTotalPendingAmount").value(parseFloat($$("lblTotalAmount").value()).toFixed(2));
                        $$("txtReceivedAmount").value(parseFloat(parseFloat($$("txtReceivedAmount").value()) - parseFloat(item.amount_pay)).toFixed(2));
                    }

                    row.on("change", "input[datafield=amount_pay]", function () {
                        var amount = 0;
                        $(page.controls.grdPendingPayment.allData()).each(function (i, item) {
                            if(item.bill_type == "Sale")
                                amount = parseFloat(amount) + parseFloat(item.amount_pay);
                            else if(item.bill_type == "SaleReturn")
                                amount = parseFloat(amount) - parseFloat(item.amount_pay);
                        });
                        $$("txtReceivedAmount").value(parseFloat(amount));
                    });
                }

                page.controls.grdPendingPayment.dataBind(data);
                page.controls.grdPendingPayment.edit(true);
            },
            selectedPendingEMIPayment: function (data) {
                var emiBalance = 0;
                $$("grdEMIBill").width("100%");
                $$("grdEMIBill").height("220px");
                $$("grdEMIBill").setTemplate({
                    selection: "none",
                    columns: [
                        { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                        { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_id" },
                        { 'name': "Sch Id", 'rlabel': 'Sch Id', 'width': "70px", 'dataField': "temp_schedule_id" },
                        { 'name': "", 'width': "0px", 'dataField': "schedule_id" },
                        { 'name': "Sch Date", 'rlabel': 'Sch Id', 'width': "130px", 'dataField': "schedule_date" },
                        { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "130px", 'dataField': "due_date" },
                        { 'name': "Due Amount", 'rlabel': 'Due Amount', 'width': "150px", 'dataField': "amount" },
                        { 'name': "Paid", 'rlabel': 'Paid', 'width': "70px", 'dataField': "paid" },
                        { 'name': "Balance", 'rlabel': 'Balance', 'width': "70px", 'dataField': "balance" },
                        { 'name': "Pay Amt", 'rlabel': 'Pay Amt', 'width': "100px", 'dataField': "pay_amount" },
                        { 'name': "Status", 'rlabel': 'Status', 'width': "130px", 'dataField': "status" },
                    ]
                });
                page.controls.grdEMIBill.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    
                }
                page.controls.grdEMIBill.rowBound = function (row, item) {
                    //item.pay_amount = parseFloat(item.balance);
                    
                    if (item.status == "Open") {
                        row[0].style.color = "red";
                    }
                    if (item.status == "Paid") {
                        row[0].style.color = "green";
                        row.find("div[datafield=pay_amount]").css("visibility", "hidden");
                    }
                    //page.controls.lblEMIBalance.html(emiBalance);
                    //$(row).find("[datafield=temp_schedule_id]").find("div").html(page.controls.grdEMIBill.allData().length);
                }
                page.controls.grdEMIBill.dataBind(data);
                page.controls.grdEMIBill.edit(true);
            },
            viewPrintBill: function (billNo) {
                page.currentBillNo = billNo;
                page.billService.getBill(page.currentBillNo, function (data) {
                    var bill = data[0];
                    var openBill = data;
                    //var openBill = {
                    //    cust_no: bill.cust_no,
                    //    cust_name: bill.cust_name,
                    //    email: bill.email,

                    //    phone_no: bill.phone_no,
                    //    address: bill.address,
                    //    sales_tax_no: bill.sales_tax_no == null ? -1 : bill.sales_tax_no,

                    //    sub_total: bill.sub_total,
                    //    total: bill.total,
                    //    discount: bill.discount,
                    //    tax: bill.tax,
                    //    //billItems: [],
                    //    //discounts: [],
                    //    bill_no: bill.bill_no,
                    //    state_text: bill.state_text   //Can be Sale,Return,Saved  [other :NewSale,NewReturn]
                    //};
                    //page.loadSalesTaxClasses = function (sales_tax_no, callback) {
                    //    if (sales_tax_no == -1) {
                    //        callback([]);
                    //    } else {
                    //        page.billService.getSalesTaxClass(sales_tax_no, function (sales_tax_class) {
                    //            callback(sales_tax_class);
                    //        });
                    //    }
                    //}

                    //page.loadSalesTaxClasses(openBill.sales_tax_no, function (sales_tax_class) {
                    //    openBill.sales_tax_class = sales_tax_class;

                    //    page.billService.getBillItem(openBill.bill_no, function (billItems) {
                    //        openBill.billItems = billItems;

                    //       // page.msgPanel.show("Getting Bill Discounts...");
                    //        page.billService.getAllBillDiscount(openBill.bill_no, function (discounts) {
                    //            openBill.discounts = [];
                    //            $(discounts).each(function (i, item) {
                    //                openBill.discounts.push({
                    //                    disc_no: item.disc_no,
                    //                    disc_type: item.value_type,
                    //                    disc_name: item.disc_name,
                    //                    disc_value: item.value,
                    //                    item_no: item.item_no
                    //                });
                    //            });


                    //        });

                    //    });
                    //});
                    page.billService.getBillPrintPOS(page.currentBillNo, function (data) {
                        PrintingOD(data, openBill);
                    });
                });


            }
        }


        page.addTray = function (bill,bill_no) {
            try {
                var trayItems = [];
                $(page.controls.grdReturnPOSItems.allData()).each(function (i, item) {

                    if (parseFloat(item.tray_received) > 0)
                        if (item.tray_id != null && item.tray_id != "-1" && typeof item.tray_id != "undefined")
                            trayItems.push({
                                tray_id: item.tray_id,
                                tray_count: parseInt(item.tray_received),
                                trans_type: "Customer Return",
                                trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                cust_id: bill.cust_no,
                                bill_id: bill_no,
                                store_no: localStorage.getItem("user_store_no")
                            });
                });
                page.eggtraytransAPI.postAllValues(0, trayItems, function (data) {
                });

            } catch (e) {
                page.msgPanel.flash(e);
            }

        }

        page.events.btnAdvancedSearch_click = function () {
        }
        // Search Bill by BillNo
        page.events.btnSearch_click = function () {
            if ($$("txtSearch").val() == '') {
                $$("grdSales").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        //page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            var totalRecord = page.bill_count;
                            page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                callback(data, totalRecord);
                            });
                        //});
                    },
                    update: function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });
            }
            else {
                var temp_search = $$("txtSearch").val();
                if (temp_search.startsWith("00")) {
                    temp_search = (temp_search.substring(0, temp_search.length - 1));
                }
                page.billAPI.searchValues("", "", "(bill_no= '" + temp_search + "' or bill_barcode='" + temp_search + "' or ifnull(cust_name,'') like concat('" + temp_search + "','%') or ifnull(DATE_FORMAT(bill_date, '%d-%m-%Y'),'') like '"+temp_search+"')", "", function (data) {
                    $$("grdSales").dataBind(data);
                });
            }
        }

        page.events.page_load = function () {
            
                //page.billService.getAllDeliveyBoy(function (data) {
            page.salesexecutiveAPI.searchValues(0, "", "", "", function (data) {
                page.controls.ddlDeliveryBy.dataBind(data, "sale_executive_no", "sale_executive_name", "Select");
            });

            $$("tabBills").selectionChanged = function (tag, obj) {
                page.currentTabId = parseInt($(obj).closest("li").attr("index"));
            };

                if (window.mobile) {
                    page.controls.grdSales.width("100%");
                    page.controls.grdSales.height("400px");
                    page.controls.grdSales.setTemplate({
                        selection: "Single", paging: true, pageSize: 100,
                        columns: [
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "20%", 'dataField': "bill_no" },
                            { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "25%", 'dataField': "state_text" },
                            { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "30%", 'dataField': "bill_date" },
                            { 'name': "Customer", 'rlabel': 'Customer', 'width': "30%", 'dataField': "cust_name" },
                            { 'name': "Amount", 'rlabel': 'Amount', 'width': "25%", 'dataField': "total" },
                            { 'name': "Paid", 'rlabel': 'Paid Amt', 'width': "25%", 'dataField': "paid" },
                            { 'name': "", 'width': "100%", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />  <input type='button' title='Receipt Print'  class='grid-button' value='' action='Print' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px;' id='receiptPrint' />  <input type='button' title='Return Bill'  class='grid-button' value='' action='Return' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Return-Purchase-icon.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' />  <input type='button'  title='Send E-mail' class='grid-button' value='' action='sendMail' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/mail-envelope.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' id='sendMail' /><input type='button'  title='Send SMS' class='grid-button' value='' action='sendSMS' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/sms-icon.png);    background-size: contain;    width: 25px;    height: 28px;margin-right:10px;' id='sendSms' /> <input type='button'  title='Print Jasper' class='grid-button' value='' action='printJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='jasperPrint' />" }
                        ]
                    });
                }
                else {
                    page.controls.grdSales.width("2000px");
                    page.controls.grdSales.height("500px");
                    page.controls.grdSales.setTemplate({
                        selection: "Single", paging: true, pageSize: 50,
                        columns: [
                            { 'name': "",  'width': "0px", 'dataField': "bill_no",visible:false },
                            //{ 'name': "Bill No", 'rlabel': 'Bill No', 'width': "60px", 'dataField': "bill_id" },
                            { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "60px", 'dataField': "bill_no" },
                            { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type" },
                            { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "140px", 'dataField': "bill_date" },
                            { 'name': "Bill Month", 'rlabel': 'Bill Month', 'width': "120px", 'dataField': "sch_id", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                            { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date", visible: CONTEXT.ENABLE_SUBSCRIPTION },
                            { 'name': "Customer", 'rlabel': 'Customer', 'width': "150px", 'dataField': "cust_name" },
                            { 'name': "Total Amount", 'rlabel': 'Amount', 'width': "135px", 'dataField': "total" },
                            { 'name': "Paid", 'rlabel': 'Tot Paid', 'width': "100px", 'dataField': "paid" },
                            //{ 'name': "Pay Mode", 'width': "145px", 'dataField': "pay_mode" },
                            { 'name': "Balance", 'rlabel': 'Balance', 'width': "110px", 'dataField': "balance" },
                            { 'name': "Advance(Rs)", 'rlabel': 'Advance Amt', 'width': "125px", 'dataField': "adv_sec_amt", visible: CONTEXT.ENABLE_BILL_ADVANCE },
                            { 'name': "Status", 'rlabel': 'Status', 'width': "125px", 'dataField': "adv_sec_status", visible: CONTEXT.ENABLE_BILL_ADVANCE },
                            { 'name': "End Date", 'rlabel': 'End Date', 'width': "125px", 'dataField': "adv_end_date", visible: CONTEXT.ENABLE_BILL_ADVANCE },
                            { 'name': "", 'width': "350px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />  <input type='button' title='Receipt Print'  class='grid-button' value='' action='Print' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px;' id='receiptPrint' />  <input type='button' title='Return Bill'  class='grid-button' value='' action='Return' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Return-Purchase-icon.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' id='Return' /><input type='button' title='Bill Adjustment'  class='grid-button' value='' action='Adjustment' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/bills.png);    background-size: contain;    width: 22px;    height: 25px;;margin-right:10px' id='billAdjustment' />  <input type='button'  title='Send E-mail' class='grid-button' value='' action='sendMail' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/mail-envelope.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' id='sendMail' /><input type='button'  title='Send SMS' class='grid-button' value='' action='sendSMS' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/sms-icon.png);    background-size: contain;    width: 25px;    height: 28px;margin-right:10px;' id='sendSms' /> <input type='button'  title='Print Jasper' class='grid-button' value='' action='printJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='jasperPrint' /><input type='button'  title='Cancel Bill' class='grid-button' value='' action='cancelBill' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/cancel.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='cancelBill' /><input type='button'  title='Advance Return' class='grid-button' value='' action='advanceReturn' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Advance-Return-icon.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='returnAdvance' /><input type='button'  title='Bill Edit' class='grid-button' value='' action='billEdit' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/edit.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' id='billEdit' /><input type='button'  title='Credit Debit Note' class='grid-button' value='' action='creditDebitNote' style='border: none;background-color: transparent;background-image: url(BackgroundImage/credit-debit-note.png); background-size: contain;width: 25px;height: 25px;margin-right:10px' id='creditDebitNote' />" }
                            //{ 'name': "", 'width': "230px", 'dataField': "bill_no", editable: false, itemTemplate: "<input type='button' title='Open Bill'  class='grid-button' value='' action='Open' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Open_file.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />  <input type='button' title='Return Bill'  class='grid-button' value='' action='Return' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/Return-Purchase-icon.png);    background-size: contain;    width: 25px;    height: 25px;;margin-right:10px' />   <input type='button'  title='Print Jasper' class='grid-button' value='' action='printJasper' style='    border: none;    background-color: transparent;    background-image: url(BackgroundImage/print.png);    background-size: contain;    width: 25px;    height: 25px;margin-right:10px' />" }

                        ]
                    });
                }

                page.controls.grdSales.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "Open") {
                        page.events.btnOpenBill_click(rowData);
                    }
                    if (action == "Return") {
                        try{
                            if (rowData.bill_type == "SaleReturn" || rowData.bill_type == "Return") {
                                throw"Bill Already Returned";
                            }
                            if (rowData.so_no == null || rowData.so_no == "" || typeof rowData.so_no == "undefined") {
                                //BILL RETURN IN NEW POPUP
                                page.currentCust_no = rowData.cust_no;
                                page.currentBillNo = rowData.bill_no;
                                page.events.btnReturnPOS_click(rowData);
                            }
                            else {
                                throw "Sales Order Bill Is Not Return";
                            }
                        }
                        catch (e) {
                            alert(e);
                        }
                    }
                    if (action == "Adjustment") {
                        page.events.btnAdjustmentBill_click(rowData, true);
                    }
                    if (action == "Print") {
                        page.events.btnPrintBill_click(rowData.bill_no,false);
                    }
                    if (action == "sendMail") {
                        page.events.btnSendMailGrid_click(rowData);
                    }
                    if (action == "sendSMS") {
                        page.events.btnSendSMS_click(rowData);
                    }
                    if (action == "printInvoice") {
                        page.events.btnPrintInvoice_click(rowData.bill_no);
                    }
                    //printInvoiceJson
                    if (action == "printJasper") {
                        page.PrintBillType = rowData.state_text;
                        page.printBillNo = rowData.bill_no;
                        page.controls.pnlPrintingPopup.open();
                        page.controls.pnlPrintingPopup.title("Select Export Type");
                        page.controls.pnlPrintingPopup.width("500");
                        page.controls.pnlPrintingPopup.height("200");
                        //page.events.btnprintJasper_click(rowData.bill_no);
                        //var str = inWords(1552);
                        //alert(str);
                    }
                    if (action == "cancelBill") {
                        if (CONTEXT.ADMIN) {
                            if (rowData.so_no == null || rowData.so_no == "" || typeof rowData.so_no == "undefined") {
                                if (confirm("Are You Sure Want To Cancel This Bill")) {
                                    //page.billService.getReturnBillByBill(rowData.bill_no, function (data) {
                                    page.billAPI.searchValues("", "", "b.bill_no_par=" + rowData.bill_no, "", function (data) {
                                        if (data.length != 0) {
                                            alert("This Bill Can Have Return Bill");
                                        }
                                        else {
                                            page.events.btnCancelBill_click(rowData);
                                        }
                                    });
                                }
                            }
                            else {
                                alert("Slaes Order Bill Is Not Canceled");
                            }
                        }
                        else {
                            alert("Sorry You Don't Have Privilages To Cancel This Bill");
                        }
                    }
                    if (action == "advanceReturn") {
                        if (rowData.so_no == null || rowData.so_no == "" || typeof rowData.so_no == "undefined") {
                            if (confirm("Are You Sure Want To Pay This Bill Advance")) {
                                $$("msgPanel").show("Updating Payments...");
                                //page.billService.getBill(rowData.bill_no, function (data) {
                                //page.stockAPI.getSalesBill(bill.bill_no, function (data) {
                                page.billAPI.getValue(rowData.bill_no, function (data) {
                                    if (data.adv_sec_status == "Paid") {
                                        ShowDialogBox('Message', 'This Bill Advance Is Already Paid...!', 'Ok', '', null);
                                        $$("msgPanel").hide();
                                    }
                                    else if (parseInt(data.total_paid_amount) == 0) {
                                        ShowDialogBox('Message', 'Sorry This Bill Payment Cannot Have Any Paymant...!', 'Ok', '', null);
                                        $$("msgPanel").hide();
                                    }
                                        //else if (parseInt(data[0].adv_sec_amt) == 0) {
                                        //    ShowDialogBox('Message', 'Sorry Bill Advance Amount Is Zero...!', 'Ok', '', null);
                                        //    $$("msgPanel").hide();
                                        //}
                                    else {
                                        var item = [];
                                        page.billService.getBillItem(rowData.bill_no, function (billData) {
                                            $(billData).each(function (i, billItem) {
                                                item.push({
                                                    var_no: billItem.var_no,
                                                    trans_type: "SaleReturn",
                                                    qty: billItem.qty,
                                                    trans_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                                    key1: "0",
                                                    key2: "0",
                                                    invent_type: "SaleReturn",
                                                    finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                    jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                                    amount: 0
                                                })
                                            });
                                            var newBill = {
                                                bill_type: "Sale"
                                            }
                                            newBill.bill_items = item;
                                            //page.stockService.insertReturnAdvanceItems(0, item, function (response) {
                                            page.stockAPI.insertStock(newBill, function (response) {
                                                var data = {
                                                    bill_no: rowData.bill_no,
                                                    adv_sec_status: "Paid"
                                                }
                                                //page.billService.updateBillAdvance(rowData.bill_no, function (data1) {
                                                page.billAPI.putValue(rowData.bill_no, data, function (data1) {
                                                    if (CONTEXT.ENABLE_BILL_ADVANCE) {
                                                        var advance_data = {
                                                            comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                                            per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                                            paid_amount: rowData.adv_sec_amt,
                                                            description: "POS Advance Return Pay-" + rowData.bill_no,
                                                            jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                                            key_1: rowData.bill_no,
                                                        }
                                                        //page.finfactsEntry.salesAdvanceReturnPayment(advance_data, function (response) {
                                                        page.finfactsEntryAPI.salesAdvanceReturnPayment(advance_data, function (response) {
                                                            alert("Advance Paid Successfully...");
                                                            $$("msgPanel").hide();
                                                            page.events.btnSearch_click();
                                                        });
                                                    }
                                                });
                                            })
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            alert("Cannot Return Advance In Sales Order Bill");
                        }
                    }
                    //Bill Edit
                    if (action == "billEdit") {
                        if (CONTEXT.EDIT_BILL) {
                            if (CONTEXT.ADMIN) {
                                try {
                                    if (rowData.state_text == "Return") {
                                        throw "Return Bill Is Not Editable";
                                    }
                                    if (rowData.state_text == "Saved") {
                                        throw "Saved Bill Is Not Editable";
                                    }
                                    if (parseInt(rowData.paid) != 0) {
                                        throw "Paid Bill Is Not Editable";
                                    }
                                    if (rowData.so_no == null || rowData.so_no == "" || typeof rowData.so_no == "undefined") {
                                        if (confirm("Are You Sure Want To Edit This Bill")) {
                                            //page.billService.getReturnBillByBill(rowData.bill_no, function (data) {
                                            page.billAPI.searchValues("", "", "b.bill_no_par=" + rowData.bill_no, "", function (data) {
                                                if (data.length != 0) {
                                                    alert("This Bill Can Have Return Bill");
                                                }
                                                else {
                                                    page.events.btnBillEdit_click(rowData);
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        throw "Sales Order Bill Is Not Editable";
                                    }
                                }
                                catch (e) {
                                    alert(e);
                                }
                            }
                            else {
                                alert("Sorry You Don't Have Privilages To Edit This Bill");
                            }
                        }
                        else {
                            alert("Sorry You Don't Have Privilages To Edit This Bill");
                        }
                    }
                    //Credit Debit Note
                    if (action == "creditDebitNote") {
                        try {
                            //if (rowData.state_text == "Return") {
                            //    throw "Return Bill Is Not Editable";
                            //}
                            if (rowData.state_text == "Saved") {
                                throw "Saved Bill Is Not Editable";
                            }
                            if (rowData.bill_type == "SalesCredit" || rowData.bill_type == "SalesDebit") {
                                throw "Credit Or Debit Bill Is Not Again Edited";
                            }
                            if (rowData.so_no == null || rowData.so_no == "" || typeof rowData.so_no == "undefined") {
                                if (confirm("Are You Sure Want To Edit This Bill")) {
                                    //page.billAPI.searchValues("", "", "b.bill_no_par=" + rowData.bill_no, "", function (data) {
                                        //if (data.length != 0) {
                                        //    alert("This Bill Can Have Return Bill");
                                        //}
                                        //else {
                                            page.events.btncreditBill_click(rowData);
                                        //}
                                    //});
                                }
                            }
                            else {
                                throw "Sales Order Bill Is Not Editable";
                            }
                        }
                        catch (e) {
                            alert(e);
                        }
                    }
                }

                page.controls.grdSales.beforeRowBound = function (row, item) {
                    if (CONTEXT.ENABLE_RECEIPT_PRINT)
                        $('#receiptPrint').show();
                    else
                        $('#receiptPrint').hide();
                    if (CONTEXT.ENABLE_JASPER)
                        $('#jasperPrint').show();
                    else
                        $('#jasperPrint').hide();
                    if (CONTEXT.ENABLE_EMAIL == "true")
                        $('#sendMail').show();
                    else
                        $('#sendMail').hide();
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true")
                        $('#sendSms').show();
                    else
                        $('#sendSms').hide();
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true")
                        $(row).find("[id=sendSms]").show();
                    else
                        $(row).find("[id=sendSms]").hide();
                    if (CONTEXT.ENABLE_BILL_ADJUSTMENT)
                        $('#billAdjustment').show();
                    else
                        $('#billAdjustment').hide();
                    if (CONTEXT.ENABLE_BILL_ADVANCE) {
                        $(row).find("[id=returnAdvance]").show();
                    } else {
                        $(row).find("[id=returnAdvance]").hide();
                    }
                    if (CONTEXT.ENABLE_SALES_BILL_EDIT) {
                        $(row).find("[id=billEdit]").show();
                    }
                    else {
                        $(row).find("[id=billEdit]").hide();
                    }
                }
                page.controls.grdSales.rowBound = function (row, item) {
                    if (CONTEXT.ENABLE_RECEIPT_PRINT){
                        $(row).find("[id=receiptPrint]").show();
                    }
                    else
                        $(row).find("[id=receiptPrint]").hide();
                    if (CONTEXT.ENABLE_JASPER)
                        $(row).find("[id=jasperPrint]").show();
                    else
                        $(row).find("[id=jasperPrint]").hide();
                    if (CONTEXT.ENABLE_EMAIL == "true")
                        $(row).find("[id=sendMail]").show();
                    else
                        $(row).find("[id=sendMail]").hide();
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true")
                        $(row).find("[id=sendSms]").show();
                    else
                        $(row).find("[id=sendSms]").hide();
                    if (CONTEXT.ENABLE_BILL_ADJUSTMENT)
                        $(row).find("[id=billAdjustment]").show();
                    else
                        $(row).find("[id=billAdjustment]").hide();
                    if (CONTEXT.ENABLE_CANCEL_BILL){
                        if (CONTEXT.ADMIN)
                            $(row).find("[id=cancelBill]").show();
                        else
                            $(row).find("[id=cancelBill]").hide();
                    }
                    else
                        $(row).find("[id=cancelBill]").hide();
                    if (CONTEXT.ENABLE_BILL_ADVANCE) {
                        $(row).find("[id=returnAdvance]").show();
                    }else {
                        $(row).find("[id=returnAdvance]").hide();
                    }
                    if (CONTEXT.ENABLE_SALES_BILL_EDIT) {
                        if (CONTEXT.ADMIN) {
                            $(row).find("[id=billEdit]").show();
                        }
                        else
                            $(row).find("[id=billEdit]").hide();
                    }
                    else {
                        $(row).find("[id=billEdit]").hide();
                    }
                    if ($$("ddlSearchViews").selectedValue() == "10") {
                        $(row).find("[id=returnAdvance]").hide();
                        $(row).find("[id=cancelBill]").hide();
                        $(row).find("[id=Return]").hide();
                    }
                }
                $$("grdSales").dataBind({
                    getData: function (start, end, sortExpression, filterExpression, callback) {
                        //page.billService.getAllBill("","",function (data) {
                        page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                            var totalRecord = data.length;
                            page.bill_count = data.length;
                            //page.billService.getAllBill(start, end, function (data) {
                            page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                callback(data, totalRecord);
                            });
                        });
                    },
                    update: function (item, updatedItem) {
                        for (var prop in updatedItem) {
                            if (!updatedItem.hasOwnProperty(prop)) continue;
                            item[prop] = updatedItem[prop];
                        }
                    }
                });
                var searchViewData = [];
                searchViewData.push({ view_no: "1", view_name: "Today's Sales" }, { view_no: "2", view_name: "Week's Sales" }, { view_no: "3", view_name: "Month's Sales" }, { view_no: "4", view_name: "Saved Sales" }, { view_no: "5", view_name: "Cash Sales" }, { view_no: "6", view_name: "Card Sales" })
                if (CONTEXT.ENABLE_COUPON_MODULE == "true")
                    searchViewData.push({ view_no: "7", view_name: "Coupon Sales" })
                if (CONTEXT.ENABLE_REWARD_MODULE == true)
                    searchViewData.push({ view_no: "8", view_name: "Points Sales" })
                searchViewData.push({ view_no: "9", view_name: "Month's Return" });
                if (CONTEXT.ENABLE_EMI_PAYMENT) {
                    searchViewData.push({ view_no: "10", view_name: "EMI Sales" })
                }
                if (false) {
                    searchViewData.push({ view_no: "11", view_name: "Advanced Search" })
                }
            
                if (CONTEXT.ENABLE_SALES_EXECUTIVE == "true") {
                    $$("ddlDeliveryBy").show();
                    $$("lblSalesExe").show();
                }
                else {
                    $$("ddlDeliveryBy").hide();
                    $$("lblSalesExe").hide();
                }
                $$("ddlSearchViews").dataBind(searchViewData, "view_no", "view_name");
                $$("ddlSearchPrintViews").dataBind(searchViewData, "view_no", "view_name","Select");

                $$("ddlSearchViews").selectionChange(function () {
                    if ($$("ddlSearchViews").selectedValue() == "1") {
                        //page.billService.getAllBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                //page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                var totalRecord = page.bill_count;
                                page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 1 DAY)", "bill_no desc", function (data) {
                                    callback(data, totalRecord);
                                });
                                //});
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "2") {
                        //page.billService.getAllOneWeekBill(function (data) {
                        //    page.view.salesList(data);
                        //});
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 7 DAY)", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "3") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "state_no=200 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "4") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "bill_type='SaleSaved' and state_no=100", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "bill_type='SaleSaved' and state_no=100", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "5") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "b.pay_mode='Cash' and b.state_no=200 ", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "b.pay_mode='Cash' and b.state_no=200 ", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "6") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "b.pay_mode='Card' and b.state_no=200 ", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "b.pay_mode='Card' and b.state_no=200 ", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "7") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "b.pay_mode='Coupon' and b.state_no=200 ", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "b.pay_mode='Coupon' and b.state_no=200 ", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "8") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "b.pay_mode='Points' and b.state_no=200 ", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "b.pay_mode='Points' and b.state_no=200 ", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "9") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "state_no=300 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "state_no=300 and  bill_date>=DATE_SUB(sysdate(),INTERVAL 28 DAY)", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                    if ($$("ddlSearchViews").selectedValue() == "10") {
                        $$("grdSales").dataBind({
                            getData: function (start, end, sortExpression, filterExpression, callback) {
                                page.billAPI.searchValues("", "", "b.pay_mode='EMI' and b.state_no=200 ", "bill_no desc", function (data) {
                                    var totalRecord = data.length;
                                    page.billAPI.searchValues(start, end, "b.pay_mode='EMI' and b.state_no=200 ", "bill_no desc", function (data) {
                                        callback(data, totalRecord);
                                    });
                                });
                            },
                            update: function (item, updatedItem) {
                                for (var prop in updatedItem) {
                                    if (!updatedItem.hasOwnProperty(prop)) continue;
                                    item[prop] = updatedItem[prop];
                                }
                            }
                        });
                    }
                });

                if (CONTEXT.ENABLE_SALES_RECEIPT) {
                    $$("btnReceipt").show();
                    $("#pendingPrint").show();
                }
                else {
                    $$("btnReceipt").hide();
                    $("#pendingPrint").hide();
                }
                if (CONTEXT.ENABLE_EMI_PAYMENT) {
                    $("#payemi").show();
                    $$("btnPayEMI").show();
                }
                else {
                    $$("btnPayEMI").hide();
                    $("#payemi").hide();
                }
            
                if (CONTEXT.ENABLE_DUE_DATE_ALERT) {
                    var user_ids = [];
                    $(CONTEXT.USERIDACCESS).each(function (i, item) {
                        user_ids.push(item.user_id);
                    });
                    var filter = {};
                    filter.viewMode = "Standard";
                    filter.fromDate = "";
                    filter.toDate = "";
                    filter.cust_no = "";
                    filter.bill_type = "";
                    filter.item_no = "";
                    filter.status = "";
                    filter.bill_filter = "Due Date Bill"
                    filter.area = "";
                    filter.store_no = localStorage.getItem("user_store_no");
                    filter.reg_no = localStorage.getItem("user_register_id");
                    filter.user_no = user_ids.join(",");
                    filter.sales_executive = "";
                    filter.bill_advance = "";
                    filter.bill_cashier = "";
                    filter.bill_payment_mode = "";
                    filter.item_sales_man = "";
                    filter.comp_id = localStorage.getItem("user_company_id");
                    filter.itemFromDate = "";
                    filter.itemToDate = "";
                    page.reportAPI.salesReport(filter, function (data) {
                        if (data.length != 0) {
                            if (!("Notification" in window)) {
                                alert("This browser does not support desktop notification");
                            }
                            else if (Notification.permission === "granted") {
                                var notification = new Notification(data.length + "Bills Have Today Due Date Please Verify Sales Report");
                                notification.onclick = function () {
                                    window.location.href = "/" + appConfig.root + "/shopon/view/sales-report/sales-report.html";
                                };
                            }
                            else if (Notification.permission === "denied") {
                                Notification.requestPermission(function (permission) {
                                    if (permission === "granted") {
                                        var notification = new Notification(data.length + "Bills Have Today Due Date Please Verify Sales Report");
                                        notification.onclick = function () {
                                            window.location.href = "/" + appConfig.root + "/shopon/view/sales-report/sales-report.html";
                                        };
                                    }
                                });
                            }
                        }
                    });
                }

                $.pageController.unLoadUserControl(page, "currentUC1");
                $.pageController.loadUserControl(page, page.controls.pnlBillPaymentPage1.children("div"), "currentUC1", "salesPayment")
                page.controls.currentUC1.createPending();

                $.pageController.unLoadUserControl(page, "currentUC2");
                $.pageController.loadUserControl(page, page.controls.pnlBillPaymentPage2.children("div"), "currentUC2", "salesPayment")
                page.controls.currentUC2.createPending();

                $.pageController.unLoadUserControl(page, "currentUC3");
                $.pageController.loadUserControl(page, page.controls.pnlBillPaymentPage3.children("div"), "currentUC3", "salesPayment")
                page.controls.currentUC3.createPending();

                $.pageController.unLoadUserControl(page, "currentUC4");
                $.pageController.loadUserControl(page, page.controls.pnlBillPaymentPage4.children("div"), "currentUC4", "salesPayment")
                page.controls.currentUC4.createPending();
        }

        //Print Controls
        page.printReturnBill = function (currentBillNo) {
            if (CONTEXT.ENABLE_RECEIPT_PRINT) {
                page.events.btnPrintBill_click(currentBillNo, false);
            }
            if (CONTEXT.ENABLE_JASPER) {
                if (global_page != null)
                    global_page.printJasper(currentBillNo, "PDF");
            }
        }

        //Auto Bill Generate
        page.events.btnAutoBill_click = function () {
            if (confirm("Are You Sure Want To Generate The Bill")) {
                var data = {
                    sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                }
                page.SubscriptionPlanAPI.getAutoBillItems(data, function (data) {
                    //page.insertAutoBill(data, function (data) {
                        alert("Bill Generated Successfully!!");
                        page.events.btnBack_click();
                    //});
                });
            }
        }
        page.insertAutoBill = function (data, callback) {
            if (data.length == 0) {
                callback(0);
            }
            else {
                $(data).each(function (i, items) {
                try {
                    var result = "";
                    var buying_cost = 0;
                    var cus_name = items.cust_name;
                    if (items.tax_inclusive == "1") {
                        items.price = parseFloat(parseFloat(items.price)) / parseFloat((parseFloat(items.tax_per) / 100) + 1);
                    }
                    var tax_amount = (items.price * items.tax_per / 100);
                    var newBill = {
                        bill_no: "0",
                        bill_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        store_no: getCookie("user_store_id"),
                        user_no: localStorage.getItem("user_register_id"),

                        sub_total: items.price,
                        round_off: "0",
                        total: parseFloat(items.price) + parseFloat(tax_amount),
                        discount: "0",
                        tax: tax_amount,

                        bill_type: "Sale",
                        state_no: "200",
                        sales_tax_no: CONTEXT.DEFAULT_SALES_TAX,
                        delivered_by: "-1",
                        expense: "",
                        cust_no: items.cust_id,
                        cust_name: cus_name,
                        mobile_no: items.phone_no,
                        email_id: items.email,
                        cust_address: items.address,
                        gst_no: items.gst_no,
                        tot_qty_words: result,
                        bill_no_par:"",
                        pay_mode: "Cash",
                        bill_barcode: "",
                        sales_executive: "-1",
                        //FINFACTS ENTRY DATA
                        invent_type: "SaleCredit",
                        finfacts_comp_id: localStorage.getItem("user_finfacts_comp_id"),
                        per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                        jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        advance_amount: "",
                        advance_status: "",
                        adv_end_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                        bill_discount: "",
                        sub_id: items.sub_id,
                        sch_id: "-1",
                        sub_plan_id: items.sub_plan_id
                        //fulfill: true,
                    };
                    var rbillItems = [];
                    var executivePoints = [];
                    rbillItems.push({
                        var_no: items.var_no,
                        qty: "1",
                        free_qty: 0,
                        unit_identity: "0",
                        price: items.price,
                        discount: "0",
                        taxable_value: tax_amount,
                        tax_per: items.tax_per,
                        total_price: items.price,
                        price_no: items.price_no,
                        bill_type: "Sale",
                        tax_class_no: items.tax_class_no,
                        sub_total: parseFloat(items.price),

                        hsn_code: items.hsn_code,
                        cgst: parseFloat(items.tax_per)/2,
                        sgst: parseFloat(items.tax_per) / 2,
                        igst: "0",
                        tray_received: "",
                        cost: items.cost,
                        amount: parseFloat(items.cost),

                        executive_id: "-1"
                    });
                    buying_cost = buying_cost + (parseFloat(items.cost));

                    newBill.bill_items = rbillItems;
                    newBill.executivePoints = executivePoints;
                    var billSO = [];
                    var billShedule = [];
                    var rewardSo = [];
                    newBill.payments = billSO;
                    newBill.billschedule = billShedule;
                    newBill.reward = rewardSo;
                    newBill.discounts = [];
                    var expense = [];
                    newBill.expenses = expense;
                    //Insert Bill
                    page.stockAPI.insertBill(newBill, function (data) {
                        var currentBillNo = data;
                        if (CONTEXT.ENABLE_FINFACTS_MODULES == true) {
                            var s_with_tax = (items.price);
                            var data1 = {
                                comp_id: localStorage.getItem("user_finfacts_comp_id"),
                                per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                                jrn_date: dbDateTime($.datepicker.formatDate("dd-mm-yy", new Date())),
                                description: "POS-" + currentBillNo,
                                target_acc_id: CONTEXT.FINFACTS_SALES_DEF_CASH_ACCOUNT,
                                sales_with_out_tax: parseFloat(s_with_tax).toFixed(5),
                                tax_amt: parseFloat(tax_amount).toFixed(5),
                                buying_cost: buying_cost,
                                round_off: "0",

                                key_1: currentBillNo,
                                key_2: items.cust_id,
                            };
                            page.finfactsEntryAPI.creditSales(data1, function (response) {
                                callback(currentBillNo);
                            });
                        }
                        else {
                            callback(currentBillNo);
                        }
                    });
                } catch (e) {
                    alert(e);
                    page.msgPanel.hide();;
                }
            });
            }
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
        //    str += (n[5] != 0) ? ((str != '') ? 'And ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
        //    return str + " Only";
        //}

        function getUnique(data) {
            var result = [];
            for (var i = 0; i < data.length-1; i++) {
                if (i == 0) {
                    result.push(data[i]);
                }
                if (data[i].var_no != data[i + 1].var_no) {
                    result.push(data[i + 1]);
                }
            }
            return result;
        }
    });
}

var t = {

    PrinterName: "Microsoft Print to PDF",
    Width: 200,
    Height: 300,
    Lines: [

        { StartX: 10, StartY: 10, Text: "THANGAMALAR", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 90, StartY: 10, Text: "THANGAMALAR", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 170, StartY: 10, Text: "THANGAMALAR", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },

        { StartX: 10, StartY: 20, BarCodeText: "142", FontSize: 12 },
        { StartX: 90, StartY: 20, BarCodeText: "142", FontSize: 12 },
        { StartX: 170, StartY: 20, BarCodeText: "142", FontSize: 12 },


        { StartX: 10, StartY: 30, Text: "7Dates Dry Dates - 500gm", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 90, StartY: 30, Text: "7Dates Dry Dates - 500gm", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },
        { StartX: 170, StartY: 30, Text: "7Dates Dry Dates - 500gm", FontFamily: "Courier New", FontSize: 12, FontStyle: 0 },

        { StartX: 10, StartY: 40, Text: "Rs 325.00", FontFamily: "Courier New", FontSize: 14, FontStyle: 1 },
        { StartX: 90, StartY: 40, Text: "Rs 325.00", FontFamily: "Courier New", FontSize: 14, FontStyle: 1 },
        { StartX: 170, StartY: 40, Text: "Rs 325.00", FontFamily: "Courier New", FontSize: 14, FontStyle: 1 },




    ]





}

function PrintingOD(data, openBill) {
    var r = window.open("", "blank");
    var doc = r.document;
    var head = false;
    var openBill = openBill[0];
    //   doc.write("<html><title>AVM Whole Sale Dealer Sales Order</title><style>.col{padding:5px}.hcol{padding:5px}</style><body>");
    //   doc.write("<header align='center'> <h1>AVM Wholesale Dealer</h1></header>");
    doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; } #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td  {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;} </style><div class='col-lg-12'>");
    doc.write("<span style='float:right;font-size:17px;'>ORIGINAL</span><br>");
    doc.write("<div><h1><center>" + CONTEXT.COMPANY_NAME.toUpperCase() + "</center></h1></div>");
    doc.write("<center><div style='width:600px;'>" + '' + CONTEXT.COMPANY_ADDRESS_LINE1 + '' + "</center>");
    doc.write("<center>PH :" + CONTEXT.COMPANY_PHONE_NO + "</center></div>");
    doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
    doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + '' + CONTEXT.COMPANY_TIN_NO + '' + "</span></div><br>");
    doc.write("<div><span class='col-lg-12' style='float:right'>GST : " + CONTEXT.COMPANY_GST_NO + " </span></div>");

    doc.write("<br><br><table style='width:100%;' cellpadding='0' cellspacing='0' border='1';>");//font-size:10px;//

    var txt_ph_no = (openBill.phone_no == null || openBill.phone_no == "null" || openBill.phone_no == undefined) ? "" : openBill.phone_no;

    doc.write("<tr><td style='width:350px;' >");
    doc.write("<br><div style='font-weight:bold'>" + openBill.company.toUpperCase() + "</div><br>");
    doc.write("<div>" + openBill.address + "<br>");
    doc.write("PH:" + txt_ph_no + "");

    var txt_dl_no = (openBill.license_no == null || openBill.license_no == "null" || openBill.license_no == undefined) ? "" : openBill.license_no;
    var txt_tin_no = (openBill.tin_no == null || openBill.tin_no == "null" || openBill.tin_no == undefined) ? "" : openBill.tin_no;
    var txt_gst_no = (openBill.gst_no == null || openBill.gst_no == "null" || openBill.gst_no == undefined) ? "" : openBill.gst_no;

    doc.write("<br>DL.No : " + txt_dl_no + "");
    doc.write("<br>GST : " + txt_gst_no + "");
    doc.write("<br>TIN : " + txt_tin_no + "</div></td>");
    doc.write("<td><div>INVOICE CREDIT BILL</div><br>");
    doc.write("BILL NO : " + openBill.bill_no + "<br>");
    doc.write("BILL DATE : " + openBill.bill_date + "</div><br>");
    //doc.write("<div>DUE ON : " +  + "</div><br>");
    doc.write("</td><td><div>Sales Executive : " + data[0].sales_exe_name + "<br>");
    doc.write("Area :" + data[0].sales_exe_area + " </div><br>");
    doc.write("</td></tr>");


    doc.write("</table><br>");

    doc.write("<table  id='orgTblItem' style='width:100%;' cellpadding='0'; cellspacing='0'; border='0'; >");
    doc.write("<tr style='font-weight:bold;'>");
    doc.write("<th class='col' style=' width: 5px; height: 30px;'>S.No</th>");
    doc.write("<th class='col' style=' width: 110px; height: 30px;'>Product Name</th>");
    doc.write("<th class='col' style=' width: 80px; height: auto;'>Pack</th>");
    //doc.write("<th class='col' style=' width: 50px; height: auto;'>Bill No</th>");
    doc.write("<th class='col' style=' width: 60px; height: 30px;'>Batch</th>");
    doc.write("<th class='col' style=' width: 10px; height: 30px;'>Exp</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>Qty</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>Free</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>PTR</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>PDis</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>MRP</th>");
    //doc.write("<th class='col' style=' width: 50px; height: auto;'>Tax</th>");
    doc.write("<th class='col' style=' width: 90px; height: 30px;'>CGST</th>");
    doc.write("<th class='col' style=' width: 90px; height: 30px;'>SGST</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>G Value</th>");
    doc.write("</tr>");
    var no_of_prd = 0;
    var tot_Qty = 0;
    var tot_tax_cgst = 0;
    var tot_tax_sgst = 0;
    //var tot_tax_cgst_perct = 0;
    //var tot_tax_sgst_perct = 0;
    var s_no = 1;
    $(data).each(function (i, item) {
        var tax_cgst = 0;
        var tax_sgst = 0;
        var tax_cgst_percent = 0;
        var tax_sgst_percent = 0;

        tax_cgst = parseFloat(item.tax_amt) / parseFloat(2);
        tax_sgst = parseFloat(item.tax_amt) / parseFloat(2);
        tax_cgst_percent = parseInt(item.tax_per) / parseInt(2);
        tax_sgst_percent = parseInt(item.tax_per) / parseInt(2);

        var txt_Batch = (item.batch_no == null || item.batch_no == "null" || item.batch_no == undefined || item.batch_no == "") ? "" : item.batch_no;
        var txt_exp_date = (item.expiry_date == null || item.expiry_date == "null" || item.expiry_date == undefined || item.expiry_date == "") ? "" : item.expiry_date;
        var txt_Qnty = (item.qty == null || item.qty == "null" || item.qty == undefined || item.qty == "") ? "0" : item.qty;
        var txt_FQnty = (item.free_qty == null || item.free_qty == "null" || item.free_qty == undefined || item.free_qty == "") ? "0" : item.free_qty;
        var txt_Price = (item.price == null || item.price == "null" || item.price == undefined || item.price == "") ? "0" : item.price;
        var txt_Disc = (item.discount == null || item.discount == "null" || item.discount == undefined || item.discount == "") ? "0" : item.discount;
        var txt_Mrp = (item.mrp == null || item.mrp == "null" || item.mrp == undefined || item.mrp == "") ? "0" : item.mrp;
        var txt_Tot_Price = (item.total_price == null || item.total_price == "null" || item.total_price == undefined || item.total_price == "") ? "0" : item.total_price;

        doc.write("<tr  style='text-align: center;border:1px'>");
        doc.write("<td  class='col' style=' width: 5px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + s_no + "</td>");
        doc.write("<td  class='col' style=' width: 110px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + item.item_name + "</td>");
        doc.write("<td  class='col' style=' width: 80px; height: auto;'>" + item.packing + "</td>");
        doc.write("<td  class='col' style=' width: 60px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Batch + "</td>");
        doc.write("<td  class='col' style=' width: 10px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_exp_date + "</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Qnty + "</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_FQnty + "</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Price).toFixed(5) + "</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Disc).toFixed(5) + "</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Mrp).toFixed(5) + "</td>");
        //doc.write("<td  class='col' style=' width: 90px; height: auto;'>" + parseFloat(item.tax_per) + "%</td>");
        doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_cgst).toFixed(5) + " @ " + tax_cgst_percent + "%</td>");
        doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_sgst).toFixed(5) + " @ " + tax_sgst_percent + "%</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Tot_Price).toFixed(5) + "</td>");
        doc.write("</tr>");
        no_of_prd = no_of_prd + 1;
        s_no = s_no + 1;
        tot_Qty = parseInt(tot_Qty) + parseInt(item.qty);
        tot_tax_cgst = parseFloat(tot_tax_cgst) + parseFloat(tax_cgst);
        tot_tax_sgst = parseFloat(tot_tax_sgst) + parseFloat(tax_sgst);
        //tot_tax_sgst_perct = parseFloat(tot_tax_sgst_perct) + parseFloat(tax_sgst_percent);
        //tot_tax_cgst_perct = parseFloat(tot_tax_cgst_perct) + parseFloat(tax_cgst_percent);
    });
    doc.write("<tr><td colspan='9' style=''><div> No.of.Items : " + no_of_prd + "</div></td><td colspan='4'> <div ><b>Sub Total: </b><span style='float:right'>" + parseFloat(openBill.sub_total).toFixed(5) + "</span> </div></td> </tr>");
    doc.write("<tr><td colspan='9' style=''><div> Quantity : " + tot_Qty + "</div></td><td colspan='4'> <div ><b>Discount Amount: </b><span style='float:right'>" + parseFloat(openBill.discount).toFixed(5) + "</span> </div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>CGST: </b><span style='float:right'>" + parseFloat(tot_tax_cgst).toFixed(5) + " </span></div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>SGST: </b><span style='float:right'>" + parseFloat(tot_tax_sgst).toFixed(5) + "</span> </div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Tax Amount: </b><span style='float:right'>" + parseFloat(openBill.tax).toFixed(5) + " </span></div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Round off: </b><span style='float:right'>" + parseFloat(openBill.round_off).toFixed(5) + " </span></div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>BILL AMOUNT: </b><span style='float:right'>" + parseFloat(openBill.total).toFixed(5) + "</span> </div> </td></tr>");
    doc.write("</tr>");
    doc.write("</table>");

    //doc.write("<div> No.of.Item " + no_of_prd + "</div>");
    //doc.write("<br><div> Qty " + tot_Qty + "</div>");

    //doc.write(" <div align='right'><b>Gross Value: </b>" + page.controls.lblSubTotal.value() + " </div>");
    //doc.write(" <div align='right'><b>Discount Amount: </b>" + page.controls.lblDiscount.value() + " </div>");
    //doc.write(" <div align='right'><b>CGST: </b>" + tot_tax_cgst + " </div>");
    //doc.write(" <div align='right'><b>SGST: </b>" + tot_tax_sgst + " </div>");
    //doc.write(" <div align='right'><b>Tax Amount: </b>" + page.controls.lblTax.value() + " </div>");
    //doc.write(" <div align='right'><b>Bill Amount: </b>" + page.controls.lblTotal.value() + " </div>");

    doc.write("<div align='right'><h5>For " + CONTEXT.COMPANY_NAME + "</h5>");

    //discount: page.controls.lblDiscount.value(),
    // doc.write("<footer> <h2 align='center'></h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a></div><p></div></body></html>");

    doc.write("</div></div></body></html>");
    doc.write("</div>");

    //DUPLICATE

    doc.write("<p style='page-break-after:always;'></p><div class='col-lg-12'>");
    doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style><div class='col-lg-12'>");
    doc.write("<span style='float:right;font-size:17px;'>DUPLICATE</span><br>");
    doc.write("<div><h1><center>" + CONTEXT.COMPANY_NAME.toUpperCase() + "</center></h1></div>");
    doc.write("<center><div style='width:600px;'>" + '' + CONTEXT.COMPANY_ADDRESS_LINE1 + '' + "</center>");
    doc.write("<center>PH :" + CONTEXT.COMPANY_PHONE_NO + "</center></div>");
    doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
    doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + '' + CONTEXT.COMPANY_TIN_NO + '' + "</span></div><br>");
    doc.write("<div><span class='col-lg-12' style='float:right'>GST : " + CONTEXT.COMPANY_GST_NO + " </span></div>");

    doc.write("<br><br><table style='width:100%;' cellpadding='0' cellspacing='0' border='1';>");//font-size:10px;
    var txt_ph_no = (openBill.phone_no == null || openBill.phone_no == "null" || openBill.phone_no == undefined) ? "" : openBill.phone_no;

    doc.write("<tr><td style='width:350px;' >");
    doc.write("<br><div style='font-weight:bold'>" + openBill.company.toUpperCase() + "</div><br>");
    doc.write("<div>" + openBill.address + "<br>");
    doc.write("PH:" + txt_ph_no + "");

    var txt_dl_no = (openBill.license_no == null || openBill.license_no == "null" || openBill.license_no == undefined) ? "" : openBill.license_no;
    var txt_tin_no = (openBill.tin_no == null || openBill.tin_no == "null" || openBill.tin_no == undefined) ? "" : openBill.tin_no;

    doc.write("<br>DL.No : " + txt_dl_no + "");
    doc.write("<br>TIN : " + txt_tin_no + "</div></td>");
    doc.write("<td><div>INVOICE CREDIT BILL</div><br>");
    doc.write("BILL NO : " + openBill.bill_no + "<br>");
    doc.write("BILL DATE : " + openBill.bill_date + "</div><br>");
    //doc.write("<div>DUE ON : " +  + "</div><br>");
    doc.write("</td><td><div>Sales Executive : " + data[0].sales_exe_name + "<br>");
    doc.write("Area :" + data[0].sales_exe_area + " </div><br>");
    doc.write("</td></tr>");


    doc.write("</table><br>");

    doc.write("<table id='dupTblItem'  style='width:100%;' cellpadding='0'; cellspacing='0'; border='0'; >");
    doc.write("<tr style='font-weight:bold;'>");
    doc.write("<th class='col' style=' width: 5px; height: 30px;'>S.No</th>");
    doc.write("<th class='col' style=' width: 110px; height: 30px;'>Product Name</th>");
    doc.write("<th class='col' style=' width: 80px; height: auto;'>Pack</th>");
    //doc.write("<th class='col' style=' width: 50px; height: auto;'>Bill No</th>");
    doc.write("<th class='col' style=' width: 60px; height: 30px;'>Batch</th>");
    doc.write("<th class='col' style=' width: 10px; height: 30px;'>Exp</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>Qty</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>Free</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>PTR</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>PDis</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>MRP</th>");
    //doc.write("<th class='col' style=' width: 50px; height: auto;'>Tax</th>");
    doc.write("<th class='col' style=' width: 90px; height: 30px;'>CGST</th>");
    doc.write("<th class='col' style=' width: 90px; height: 30px;'>SGST</th>");
    doc.write("<th class='col' style=' width: 50px; height: 30px;'>G Value</th>");
    doc.write("</tr>");
    var no_of_prd = 0;
    var tot_Qty = 0;
    var tot_tax_cgst = 0;
    var tot_tax_sgst = 0;
    //var tot_tax_cgst_perct = 0;
    //var tot_tax_sgst_perct = 0;
    var s_no = 1;
    $(data).each(function (i, item) {
        var tax_cgst = 0;
        var tax_sgst = 0;
        var tax_cgst_percent = 0;
        var tax_sgst_percent = 0;

        tax_cgst = parseFloat(item.tax_amt) / parseFloat(2);
        tax_sgst = parseFloat(item.tax_amt) / parseFloat(2);
        tax_cgst_percent = parseInt(item.tax_per) / parseInt(2);
        tax_sgst_percent = parseInt(item.tax_per) / parseInt(2);

        var txt_Batch = (item.batch_no == null || item.batch_no == "null" || item.batch_no == undefined || item.batch_no == "") ? "" : item.batch_no;
        var txt_exp_date = (item.expiry_date == null || item.expiry_date == "null" || item.expiry_date == undefined || item.expiry_date == "") ? "" : item.expiry_date;
        var txt_Qnty = (item.qty == null || item.qty == "null" || item.qty == undefined || item.qty == "") ? "0" : item.qty;
        var txt_FQnty = (item.free_qty == null || item.free_qty == "null" || item.free_qty == undefined || item.free_qty == "") ? "0" : item.free_qty;
        var txt_Price = (item.price == null || item.price == "null" || item.price == undefined || item.price == "") ? "0" : item.price;
        var txt_Disc = (item.discount == null || item.discount == "null" || item.discount == undefined || item.discount == "") ? "0" : item.discount;
        var txt_Mrp = (item.mrp == null || item.mrp == "null" || item.mrp == undefined || item.mrp == "") ? "0" : item.mrp;
        var txt_Tot_Price = (item.total_price == null || item.total_price == "null" || item.total_price == undefined || item.total_price == "") ? "0" : item.total_price;

        doc.write("<tr  style='text-align: center;border:1px'>");
        doc.write("<td  class='col' style=' width: 5px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + s_no + "</td>");
        doc.write("<td  class='col' style=' width: 110px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + item.item_name + "</td>");
        doc.write("<td  class='col' style=' width: 80px; height: auto;'>" + item.packing + "</td>");
        doc.write("<td  class='col' style=' width: 80px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Batch + "</td>");
        doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_exp_date + "</td>");
        doc.write("<td  class='col' style=' width: 30px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_Qnty + "</td>");
        doc.write("<td  class='col' style=' width: 30px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + txt_FQnty + "</td>");
        doc.write("<td  class='col' style=' width: 40px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Price).toFixed(5) + "</td>");
        doc.write("<td  class='col' style=' width: 40px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Disc).toFixed(5) + "</td>");
        doc.write("<td  class='col' style=' width: 40px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Mrp).toFixed(5) + "</td>");
        //doc.write("<td  class='col' style=' width: 90px; height: auto;'>" + parseFloat(item.tax_per) + "%</td>");
        doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_cgst).toFixed(5) + " @ " + tax_cgst_percent + "%</td>");
        doc.write("<td  class='col' style=' width: 90px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(tax_sgst).toFixed(5) + " @ " + tax_sgst_percent + "%</td>");
        doc.write("<td  class='col' style=' width: 50px; height: 30px;border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;'>" + parseFloat(txt_Tot_Price).toFixed(5) + "</td>");
        doc.write("</tr>");

        no_of_prd = no_of_prd + 1;
        s_no = s_no + 1;
        tot_Qty = parseInt(tot_Qty) + parseInt(item.qty);
        tot_tax_cgst = parseFloat(tot_tax_cgst) + parseFloat(tax_cgst);
        tot_tax_sgst = parseFloat(tot_tax_sgst) + parseFloat(tax_sgst);
        //tot_tax_sgst_perct = parseFloat(tot_tax_sgst_perct) + parseFloat(tax_sgst_percent);
        //tot_tax_cgst_perct = parseFloat(tot_tax_cgst_perct) + parseFloat(tax_cgst_percent);
    });
    doc.write("<tr><td colspan='9' style=''><div> No.of.Items : " + no_of_prd + "</div></td><td colspan='4'> <div ><b>Sub Total: </b><span style='float:right'>" + parseFloat(openBill.sub_total).toFixed(5) + "</span> </div></td> </tr>");
    doc.write("<tr><td colspan='9' style=''><div> Quantity : " + tot_Qty + "</div></td><td colspan='4'> <div ><b>Discount Amount: </b><span style='float:right'>" + parseFloat(openBill.discount).toFixed(5) + "</span> </div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>CGST: </b><span style='float:right'>" + parseFloat(tot_tax_cgst).toFixed(5) + " </span></div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>SGST: </b><span style='float:right'>" + parseFloat(tot_tax_sgst).toFixed(5) + "</span> </div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Tax Amount: </b><span style='float:right'>" + parseFloat(openBill.tax).toFixed(5) + " </span></div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>Round off: </b><span style='float:right'>" + parseFloat(openBill.round_off).toFixed(5) + " </span></div></td> </tr>");
    doc.write("<tr><td colspan='9' style='border:0px'></td><td colspan='4'> <div ><b>BILL AMOUNT: </b><span style='float:right'>" + parseFloat(openBill.total).toFixed(5) + "</span> </div> </td></tr>");
    doc.write("</tr>");
    doc.write("</table>");

    //doc.write("<div> No.of.Item " + no_of_prd + "</div>");
    //doc.write("<br><div> Qty " + tot_Qty + "</div>");

    //doc.write(" <div align='right'><b>Gross Value: </b>" + page.controls.lblSubTotal.value() + " </div>");
    //doc.write(" <div align='right'><b>Discount Amount: </b>" + page.controls.lblDiscount.value() + " </div>");
    //doc.write(" <div align='right'><b>CGST: </b>" + tot_tax_cgst + " </div>");
    //doc.write(" <div align='right'><b>SGST: </b>" + tot_tax_sgst + " </div>");
    //doc.write(" <div align='right'><b>Tax Amount: </b>" + page.controls.lblTax.value() + " </div>");
    //doc.write(" <div align='right'><b>Bill Amount: </b>" + page.controls.lblTotal.value() + " </div>");

    doc.write("<div align='right'><h5>For " + CONTEXT.COMPANY_NAME + "</h5>");


    //TODO://code to use jspdf
    //var pdf = new jsPDF();
    // pdf.text(30, 30, 'Hello world!');

    // pdf.save('hello_world.pdf');

    doc.write("</div></body></html>");

    //doc.write("<center>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a></center></div></body></html>");

    doc.close();
    r.focus();
    r.print();
}
