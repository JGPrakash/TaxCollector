$.fn.salesReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.registerAPI = new RegisterAPI();
        page.shopOnStatesAPI = new ShopOnStatesAPI();
        page.customerAPI = new CustomerAPI();
        page.itemAPI = new ItemAPI();
        page.variationAPI = new VariationAPI();
        page.storeAPI = new StoreAPI();
        page.salesexecutiveAPI = new SalesExecutiveAPI();
        page.userAPI = new UserAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.salesReportAPI = new SalesReportAPI();
        page.stockAPI = new StockAPI();
        page.accAccountService = new AccAccountService();
        page.reportAPI = new ReportAPI();
        var menu_ids = [];
        var reg_ids = [];
        var user_ids = [];
        var item_list = [];
        var variation_list = [];
        document.title = "ShopOn - Sales Report";
        $("body").keydown(function (e) {
            //well you need keep on mind that your browser use some keys 
            //to call some function, so we'll prevent this
            //now we caught the key code
            var keyCode = e.keyCode || e.which;
            //your keyCode contains the key code, F1 to F2 
            //is among 112 and 123. Just it.
            //console.log(keyCode);
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnGenerate_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnReport_click();
            }
        });
        page.events = {
            btnGenerate_click: function () {
                var filter = {};
                var totalSales = 0;
                var totalSalesPayment = 0;
                var balanceSales = 0;
                var totalReturns = 0;
                var totalReturnsPayment = 0;
                var balanceReturns = 0;
                var salestotalTax = 0;
                var returntotalTax = 0;
                var totalTax = 0;
                var executive_sales_points = 0;
                var executive_return_points = 0;
                var executive_net_points = 0;
                var tot_bills=0;
                var total_cash_amount = 0;
                var total_card_amount = 0;
                var total_cheque_amount = 0;
                var total_bill_amount = 0;
                var tot_qty = 0;
                var sales_tot_qty = 0;
                var return_tot_qty = 0;
                var tot_amount = 0;
                var item_profit = 0;
                var item_cost = 0;
                var item_price = 0;
                var temp_cost;
                var temp_price;
                var customer_sales_points = 0;
                var customer_return_points = 0;
                var sales_order = 0;
                var sales_order_return = 0;
                var sales_pos = 0;
                var sales_pos_return = 0;
                //var executive_sales_points = 0;
                //var executive_return_points = 0;
                var net_sales = 0;
                var net_profit = 0;
                var sales_profit = 0;
                var return_profit = 0;
                var totalPaymentDiscount = 0;
                var tot_net_balance = 0;
                //var lastCustNo = "";
                $$("lblTotalSales").value(parseFloat(0).toFixed(2));
                $$("lblTotalPayment").value(parseFloat(0).toFixed(2));
                $$("lblSalesBal").value(parseFloat(0).toFixed(2));
                $$("lblTotalSalesPoint").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturns").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturnsPayment").value(parseFloat(0).toFixed(2));
                $$("lblReturnBal").value(parseFloat(0).toFixed(2));
                $$("lblTotalReturnsPoint").value(parseFloat(0).toFixed(2));
                $$("lblTotalTax").value(parseFloat(0).toFixed(2));
                $$("lblNetPoint").value(parseFloat(0).toFixed(2));
                $$("lblPaymentDiscount").value(parseFloat(0).toFixed(2));
                $$("lblTotalBills").value(parseFloat(0).toFixed(2));
                $$("lblNetSales").value(parseFloat(0).toFixed(2));
                $$("lblNetAmt").value(parseFloat(0).toFixed(2));
                $$("lblProfitAndTax").value(parseFloat(0).toFixed(2));
                $$("lblProfit").value(parseFloat(0).toFixed(2));
                $$("lblAmountFromPOS").value(parseFloat(0).toFixed(2));
                $$("lblAmountFromOrder").value(parseFloat(0).toFixed(2));
                $$("lblTotalPaymentAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCashAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCardAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalChequeAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalCollectedAmt").value(parseFloat(0).toFixed(2));
                $$("lblTotalBalance").value(parseFloat(0).toFixed(2));
                $$("lblTotalSalesQty").value(parseFloat(0).toFixed(2));
                $$("lblTotalAmount").value(parseFloat(0).toFixed(2));
                $$("lblTotalPoints").value(parseFloat(0).toFixed(2));
                $$("lblTotalQty").value(parseFloat(0).toFixed(2));
                $$("lblTotalBuyingCost").value(parseFloat(0).toFixed(2));
                $$("lblSellingCost").value(parseFloat(0).toFixed(2));
                $$("lblTotalProfit").value(parseFloat(0).toFixed(2));
                $$("msgPanel").show("Loading...!");
                if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2000px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "50px", 'dataField': "bill_no" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Customer", 'rlabel': 'Customer', 'width': "160px", 'dataField': "cust_name" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': 'Payment Type', 'rlabel': 'Payment Mode', 'width': "100px", 'dataField': "payment_mode" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "90px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "90px", 'dataField': "round_off" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "70px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "70px", 'dataField': "balance" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "70px", 'dataField': "profit" },
                                //{ 'name': "Cash Received", 'rlabel': 'Cash Received', 'width': "100px", 'dataField': "total_paid_amount" },
                                //{ 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "total_balance" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                                "viewMode":$$("ddlViewMode").selectedData().view_name,
                                "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                                "from_bill": $$("txtFromBill").value(),
                                "to_bill": $$("txtToBill").value(),
                                "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Sale") {
                                    sales_profit = parseFloat(item.profit) + parseFloat(sales_profit);
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    return_profit = parseFloat(item.profit) + parseFloat(return_profit);
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                }
                                if (item.order_type == "Order" && item.bill_type == "Sale") {
                                    sales_order = parseFloat(sales_order) + parseFloat(item.total);
                                }
                                if (item.order_type == "POS" && item.bill_type == "Sale") {
                                    sales_pos = parseFloat(sales_pos) + parseFloat(item.total);
                                }
                                if (item.order_type == "Order" && item.bill_type == "SaleReturn") {
                                    sales_order_return = parseFloat(sales_order_return) + parseFloat(item.total);
                                }
                                if (item.order_type == "POS" && item.bill_type == "SaleReturn") {
                                    sales_pos_return = parseFloat(sales_pos_return) + parseFloat(item.total);
                                }
                            });

                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            $$("lblProfitAndTax").value((parseFloat(parseFloat(sales_profit) - parseFloat(return_profit)) + parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax))).toFixed(2));
                            //$$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblProfit").value(parseFloat(parseFloat(sales_profit).toFixed(2) - parseFloat(return_profit).toFixed(2)).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblAmountFromOrder").value(parseFloat(parseFloat(sales_order) - parseFloat(sales_order_return)).toFixed(2));
                            $$("lblAmountFromPOS").value(parseFloat(parseFloat(sales_pos) - parseFloat(sales_pos_return)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("msgPanel").hide();
                            var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_company_id") + "))"
                            if ($$("txtStartDate").getDate() != "") {
                                finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                            }
                            if ($$("txtEndDate").getDate() != "") {
                                finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                            }
                            page.accAccountService.searchValues(0, "", finfacts_data, "", function (data) {
                                $$("lblFinfactsExpenses").value(-(data[0].balance));
                                var cash = parseFloat($$("lblTotalPayment").value()) - parseFloat($$("lblTotalReturnsPayment").value()) - parseFloat($$("lblFinfactsExpenses").value());
                                $$("lblCashInHand").value(cash.toFixed(2));
                            });
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                        });
                        var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =1 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (select per_id from acc_comp_period_t where comp_id = " + localStorage.getItem("user_company_id") + "))"

                        if ($$("txtStartDate").getDate() != "") {
                            finfacts_data = finfacts_data + " and date(trans_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                        }
                        if ($$("txtEndDate").getDate() != "") {
                            finfacts_data = finfacts_data + " and date(trans_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                        }

                        var fin_data = "acc_id = " + CONTEXT.MISCELLANEOUS_ACNT

                        if ($$("txtStartDate").getDate() != "") {
                            fin_data = fin_data + " and date(jrn_date) >= '" + dbDate($$("txtStartDate").getDate()) + "'";
                        }
                        if ($$("txtEndDate").getDate() != "") {
                            fin_data = fin_data + " and date(jrn_date) <= '" + dbDate($$("txtEndDate").getDate()) + "'";
                        }
                }
                if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("1955px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "90px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "110px", 'dataField': "bill_no" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "110px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "110px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "100px", 'dataField': "round_off" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "110px", 'dataField': "balance" },
                                //{ 'name': "Cash Received", 'rlabel': 'Cash Received', 'width': "100px", 'dataField': "total_paid_amount" },
                                //{ 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "total_balance" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "70px", 'dataField': "points" },
                            ]
                        });
                        var last_cust_no = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_cust_no != item.cust_no && item.cust_no != undefined && item.cust_no != null && item.cust_no!="") {
                                $(row).find(".header").show();
                                item.cust_no = item.cust_no == null ? "" : item.cust_no;
                                item.cust_name = item.cust_name == null ? "" : item.cust_name;
                                item.gst_no = item.gst_no == null ? "" : item.gst_no;
                                item.cust_address = item.cust_address == null ? "" : item.cust_address;
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Cust No : </span><span style='color:green'>" + item.cust_no + "</span>,  <span style='color:red'>Customer Name : </span><span style='color:green'>" + item.cust_name + "</span>,<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>Place Of Supply : </span><span style='color:green'>" + item.cust_address + "</span> </b> <span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_cust_no = item.cust_no;
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                }
                            });

                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("msgPanel").hide();
                        });
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("1830px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "", 'width': "99%", itemTemplate: "<div class='header'></div>" },
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "90px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "110px", 'dataField': "bill_date" },
                                { 'name': "Total Bills", 'rlabel': "Total Bills", 'width': "110px", 'dataField': "bills" },
                                { 'name': "Sub Total", 'rlabel': 'Sub Total', 'width': "120px", 'dataField': "sub_total" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                { 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_rate", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "100px", 'dataField': "discount" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "100px", 'dataField': "round_off" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "120px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "120px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "balance" },
                                { 'name': "Cash Received", 'rlabel': 'Cash Received', 'width': "100px", 'dataField': "total_paid_amount" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "100px", 'dataField': "total_balance" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "70px", 'dataField': "points" },
                            ]
                        });
                        var last_cust_no = "";
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            if (last_cust_no != item.cust_no && item.cust_no != undefined && item.cust_no != null && item.cust_no != "") {
                                $(row).find(".header").show();
                                item.cust_no = item.cust_no == null ? "" : item.cust_no;
                                item.cust_name = item.cust_name == null ? "" : item.cust_name;
                                item.gst_no = item.gst_no == null ? "" : item.gst_no;
                                item.cust_address = item.cust_address == null ? "" : item.cust_address;
                                $(row).find(".header").html("<span style='font-size 30px;'><b> <span style='color:red'>Cust No : </span><span style='color:green'>" + item.cust_no + "</span>,  <span style='color:red'>Customer Name : </span><span style='color:green'>" + item.cust_name + "</span>,<span style='color:red'> GST : </span><span style='color:green'>" + item.gst_no + "</span>, <span style='color:red'>Place Of Supply : </span><span style='color:green'>" + item.cust_address + "</span> </b> <span>");
                            }
                            else
                                $(row).find(".header").hide();
                            last_cust_no = item.cust_no;
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            var tot_bills = 0;
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills)
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    if (item.paid != null && item.paid != undefined && item.paid != "") {
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                }
                            });

                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value((parseFloat(totalSales) - parseFloat(totalSalesPayment)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("msgPanel").hide();
                        });
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "VariationWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Variation', 'rlabel': 'Variation', 'width': "180px", 'dataField': "variation_name" },
                                { 'name': "Item", 'rlabel': 'Item', 'width': "110px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Purchase Amount", 'rlabel': 'Purchase Amount', 'width': "200px", 'dataField': "cost" },
                                { 'name': "Sales Amount", 'rlabel': 'Sales Amount', 'width': "200px", 'dataField': "price" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "120px", 'dataField': "profit" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "var_no": ($$("txtVariation").selectedValue() == "-1" || $$("txtVariation").selectedValue() == null) ? "" : $$("txtVariation").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            $$("grdTransactions").dataBind(data);
                            $$("msgPanel").hide();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    cost = (item.cost == null) ? "0" : item.cost;
                                    totalSales = parseFloat(totalSales) + parseFloat(cost);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.cost);
                                }
                            });
                            //$$("lblItemSales").value(parseFloat(totalSales).toFixed(2));
                            //$$("lblItemReturn").value(parseFloat(totalReturns).toFixed(2));
                            //$$("lblItemNetProfit").value(parseFloat(totalSales.toFixed(2) - totalReturns.toFixed(2)).toFixed(2));

                        });
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "trans_date" },
                                { 'name': 'Variation', 'rlabel': 'Variation', 'width': "150px", 'dataField': "variation_name" },
                                { 'name': "Item", 'rlabel': 'Item', 'width': "110px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Purchase Amount", 'rlabel': 'Purchase Amount', 'width': "200px", 'dataField': "cost" },
                                { 'name': "Sales Amount", 'rlabel': 'Sales Amount', 'width': "200px", 'dataField': "price" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "120px", 'dataField': "profit" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                            "var_no": ($$("txtVariation").selectedValue() == "-1" || $$("txtVariation").selectedValue() == null) ? "" : $$("txtVariation").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $$("msgPanel").hide();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    cost = (item.cost == null) ? "0" : item.cost;
                                    totalSales = parseFloat(totalSales) + parseFloat(cost);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.cost);
                                }
                            });
                            //$$("lblItemSales").value(parseFloat(totalSales).toFixed(2));
                            //$$("lblItemReturn").value(parseFloat(totalReturns).toFixed(2));
                            //$$("lblItemNetProfit").value(parseFloat(totalSales.toFixed(2) - totalReturns.toFixed(2)).toFixed(2));
                        });
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "SummaryDay" || $$("ddlViewMode").selectedData().view_name == "SummaryMonth" || $$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                    if ($$("ddlViewMode").selectedData().view_name == "SummaryDay") {
                        var day = "Date";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryMonth") {
                        var day = "Month";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                        var day = "Year";
                    }
                    else {
                        var day = "Date";
                    }
                    $$("grdTransactions").height("350px");
                    $$("grdTransactions").width("120%");
                    $$("grdTransactions").setTemplate({
                        selection: "Single", paging: true, pageSize: 250,
                        columns: [
                            { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                            { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "bill_date" },
                            { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                            { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                            { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment" },
                            { 'name': "Sales Balance", 'rlabel': 'Sales Balance', 'width': "110px", 'dataField': "sales_balance" },
                            { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "150px", 'dataField': "total_return" },
                            { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment" },
                            { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                            { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "150px", 'dataField': "discount" },
                            { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "100px", 'dataField': "tax" },
                            { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "150px", 'dataField': "net_sales" },
                            { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit" },
                        ]
                    });
                    $$("grdTransactions").rowBound = function (row, item) {
                        $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                    }
                    var reportdata = {
                        "viewMode": $$("ddlViewMode").selectedData().view_name,
                        "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                        "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                        "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                    }
                    page.salesReportAPI.salesReport(reportdata, function (data) {
                        if (data.length > 0) {
                            page.resultFound();
                        }
                        else {
                            page.noResultFound();
                        }
                        $$("grdTransactions").dataBind(data);
                        $$("pnlGridFilter").show();
                        $(data).each(function (i, item) {
                            totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                            totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                            tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                            net_sales = parseFloat(item.net_sales) + parseFloat(net_sales);
                            totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                            balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                            totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                            totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                            balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                            if (item.profit != null && item.profit != undefined && item.profit != "") {
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            }
                        });

                        $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                        $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                        $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                        $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                        $$("lblNetSales").value(parseFloat(net_sales).toFixed(2));
                        $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                        $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                        $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                        $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                        $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                        $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                        $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                        $$("msgPanel").hide();
                    })
                }
                if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                    if ($$("ddlPaymentType").selectedData().mode_type == "All" && $$("ddlSummaryFilter").selectedValue() == "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "100px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Pay Mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else if ($$("ddlPaymentType").selectedData().mode_type != "All" && $$("ddlSummaryFilter").selectedValue() == "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "100px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Date', 'rlabel': 'Date', 'width': "100px", 'dataField': "bill_date" },
                                { 'name': 'Pay mode', 'rlabel': 'Pay Mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "100px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "100px", 'dataField': "bill_date" },
                                { 'name': 'Pay mode', 'rlabel': 'Pay mode', 'width': "100px", 'dataField': "pay_mode" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "paymode": ($$("ddlPaymentType").selectedValue() == "All") ? "" : $$("ddlPaymentType").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.pay_mode == "Cash") {
                                    total_cash_amount = parseFloat(total_cash_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Card") {
                                    total_card_amount = parseFloat(total_card_amount) + parseFloat(item.bill_amount);
                                }
                                if (item.pay_mode == "Cheque") {
                                    total_cheque_amount = parseFloat(total_cheque_amount) + parseFloat(item.bill_amount);
                                }
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.bill_amount);
                            });
                            $$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalCashAmount").value(parseFloat(total_cash_amount).toFixed(2));
                            $$("lblTotalCardAmount").value(parseFloat(total_card_amount).toFixed(2));
                            $$("lblTotalChequeAmount").value(parseFloat(total_cheque_amount).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("2000px");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "50px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Order Id', 'rlabel': 'Order Id', 'width': "70px", 'dataField': "order_id" },
                                { 'name': 'State', 'rlabel': 'Order State', 'width': "150px", 'dataField': "state_name", filterType: "Text" },
                                { 'name': 'Customer', 'rlabel': 'Customer', 'width': "150px", 'dataField': "cust_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "sub_total", filterType: "Text" },
                                { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst", filterType: "Text" },
                                { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst", filterType: "Text" },
                                { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst", filterType: "Text" },
                                //{ 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per", filterType: "Text" },
                                { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_per", filterType: "Text", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                { 'name': "Discount", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Round Off", 'rlabel': 'Round Off', 'width': "120px", 'dataField': "round_off", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid", filterType: "Text" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "status": ($$("ddlState").selectedValue() == "-1") ? "" : $$("ddlState").selectedValue(),
                            "cust_no": ($$("ddlCustomer").selectedValue()=="-1") ? "" : $$("ddlCustomer").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                if (item.bill_type == "Sale") {
                                    salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                }
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                            });
                            $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                            //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("1800px");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': 'Orders', 'rlabel': 'Orders', 'width': "70px", 'dataField': "orders" },
                                    { 'name': 'State', 'rlabel': 'Order State', 'width': "150px", 'dataField': "state_name" },
                                    { 'name': 'Customer', 'rlabel': 'Customer', 'width': "70px", 'dataField': "cust_name" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "ordered_date" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "sub_total", filterType: "Text" },
                                    { 'name': "GST", 'rlabel': 'GST', 'width': "50px", 'dataField': "tax" },
                                    { 'name': "CGST", 'rlabel': 'CGST', 'width': "50px", 'dataField': "cgst" },
                                    { 'name': "SGST", 'rlabel': 'SGST', 'width': "50px", 'dataField': "sgst" },
                                    { 'name': "IGST", 'rlabel': 'IGST', 'width': "50px", 'dataField': "igst" },
                                    //{ 'name': "CESS PER", 'rlabel': 'CESS PER', 'width': "70px", 'dataField': "cess_per" },
                                    { 'name': "CESS RATE", 'rlabel': 'CESS RATE', 'width': "70px", 'dataField': "cess_val", visible: CONTEXT.ENABLE_ADDITIONAL_TAX },
                                    { 'name': "Discount ", 'rlabel': 'Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Round off", 'rlabel': 'Round Off', 'width': "90px", 'dataField': "round_off", filterType: "Text" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                    { 'name': "Paid", 'rlabel': 'Paid', 'width': "90px", 'dataField': "paid", filterType: "Text" },
                                    { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance", filterType: "Text" },
                                    { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "status": ($$("ddlState").selectedValue()) ? "" : $$("ddlState").selectedValue(),
                                "cust_no": ($$("ddlCustomer").selectedValue() == "-1") ? "" : $$("ddlCustomer").selectedValue(),
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                var tot_orders = 0;
                                $(data).each(function (i, item) {
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    tot_orders = parseFloat(tot_orders) + parseFloat(item.orders);
                                    if (item.bill_type == "Sale") {
                                        salestotalTax = parseFloat(item.tax) + parseFloat(salestotalTax);
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        balanceSales = parseFloat(balanceSales) + parseFloat(item.balance);
                                        totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.paid);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        returntotalTax = parseFloat(item.tax) + parseFloat(returntotalTax);
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        balanceReturns = parseFloat(balanceReturns) + parseFloat(item.balance);
                                        totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.paid);
                                    }
                                });
                                $$("lblNetSales").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblSalesBal").value(parseFloat(totalSales.toFixed(2) - totalSalesPayment.toFixed(2)).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(parseFloat(salestotalTax) - parseFloat(returntotalTax)).toFixed(2));
                                //$$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(parseFloat(totalReturns) - parseFloat(totalReturnsPayment)).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_orders).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                    if ($$("ddlDeliveryBy").selectedValue() == "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'SE Barcode', 'rlabel': 'SE Barcode', 'width': "150px", 'dataField': "sales_executive_barcode" },
                                { 'name': 'Sales Executve', 'rlabel': 'Sales Executve', 'width': "150px", 'dataField': "sale_executive_name" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "tot_qty", filterType: "Text" },
                                { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "100px", 'dataField': "tot_amount", filterType: "Text" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "100px", 'dataField': "points", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "comp_id": localStorage.getItem("user_company_id"),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                            "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                        }
                        if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                            reportdata.bill_type = $$("ddlBillType").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $$("msgPanel").hide();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                    sales_tot_qty = parseFloat(sales_tot_qty) + parseFloat(item.tot_qty);

                                    tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                    tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                    executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                    return_tot_qty = parseFloat(return_tot_qty) + parseFloat(item.tot_qty);

                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                    tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                    executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                }
                            });
                            $$("pnlSalesSummary").hide();
                            $$("pnlSalesReturnSummary").hide();
                            $$("pnlTotalSalesPoint").hide();
                            $$("pnlTotalReturnsPoint").hide();
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(executive_net_points).toFixed(2));
                            //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblTotalSalesQty").value((parseFloat(sales_tot_qty) - parseFloat(return_tot_qty)).toFixed(2));
                            $$("lblTotalAmount").value(parseFloat(tot_amount).toFixed(2));
                            $$("lblTotalPoints").value(parseFloat(executive_net_points).toFixed(2));
                        })
                    }
                    else if ($$("ddlDeliveryBy").selectedValue() != "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'SE Barcode', 'rlabel': 'SE Barcode', 'width': "150px", 'dataField': "sales_executive_barcode", filterType: "Text" },
                                { 'name': 'Sales Executve', 'rlabel': 'Sales Executve', 'width': "150px", 'dataField': "sale_executive_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "tot_qty", filterType: "Text" },
                                { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "90px", 'dataField': "tot_amount", filterType: "Text" },
                                { 'name': "Points", 'rlabel': 'Points', 'width': "90px", 'dataField': "points", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "comp_id": localStorage.getItem("user_company_id"),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                            "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                        }
                        if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                            reportdata.bill_type = $$("ddlBillType").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                
                                if (item.bill_type == "Sale") {
                                    executive_sales_points = parseFloat(executive_sales_points) + parseFloat(item.points);
                                    tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                    tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                    executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    executive_return_points = parseFloat(totalReturnsPayment) + parseFloat(item.points);
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                    tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                    executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                }
                                if (item.bill_type == "Sale") {
                                    customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                }
                            });
                            $$("pnlSalesSummary").show();
                            $$("pnlSalesReturnSummary").show();
                            $$("pnlTotalSalesPoint").show();
                            $$("pnlTotalReturnsPoint").show();
                            $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                            $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                            $$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                            $$("lblTotalSalesQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalAmount").value(parseFloat(tot_amount).toFixed(2));
                            $$("lblTotalPoints").value(parseFloat(executive_net_points).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "trans_date", filterType: "Text" },
                                    { 'name': 'SE Barcode', 'rlabel': 'SE Barcode', 'width': "150px", 'dataField': "sales_executive_barcode", filterType: "Text" },
                                    { 'name': 'Sales Executve', 'rlabel': 'Sales Executve', 'width': "150px", 'dataField': "sale_executive_name", filterType: "Text" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                    { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                    { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "tot_qty", filterType: "Text" },
                                    { 'name': "Total Amount", 'rlabel': 'Total Amount', 'width': "100px", 'dataField': "tot_amount", filterType: "Text" },
                                    { 'name': "Points", 'rlabel': 'Points', 'width': "90px", 'dataField': "points", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "comp_id": localStorage.getItem("user_company_id"),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "trans_type": ($$("ddlTransType").selectedValue() == "All" || $$("ddlTransType").selectedValue() == "-1") ? "" : $$("ddlTransType").selectedValue(),
                                "sales_executive_no": ($$("ddlDeliveryBy").selectedValue() == "-1") ? "" : $$("ddlDeliveryBy").selectedValue(),
                            }
                            if ($$("ddlBillType").selectedValue() != "All" && $$("ddlBillType").selectedValue() != "-1") {
                                reportdata.bill_type = $$("ddlBillType").selectedValue();
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    if (item.bill_type == "Sale") {
                                        customer_sales_points = parseFloat(customer_sales_points) + parseFloat(item.points);
                                        tot_qty = parseFloat(item.tot_qty) + parseFloat(tot_qty);
                                        tot_amount = parseFloat(item.tot_amount) + parseFloat(tot_amount);
                                        executive_net_points = parseFloat(item.points) + parseFloat(executive_net_points);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        customer_return_points = parseFloat(customer_return_points) + parseFloat(item.points);
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.tot_qty);
                                        tot_amount = parseFloat(tot_amount) - parseFloat(item.tot_amount);
                                        executive_net_points = parseFloat(executive_net_points) - parseFloat(item.points);
                                    }
                                });
                                $$("pnlSalesSummary").hide();
                                $$("pnlSalesReturnSummary").hide();
                                $$("pnlTotalSalesPoint").hide();
                                $$("pnlTotalReturnsPoint").hide();
                                $$("lblTotalSalesPoint").value(parseFloat(customer_sales_points).toFixed(2));
                                $$("lblTotalReturnsPoint").value(parseFloat(customer_return_points).toFixed(2));
                                //$$("lblNetPoint").value(parseFloat(parseFloat(customer_sales_points) - parseFloat(customer_return_points)).toFixed(2));
                                $$("lblNetPoint").value(parseFloat(executive_net_points).toFixed(2));
                                $$("lblTotalSalesQty").value(parseFloat(tot_qty).toFixed(2));
                                $$("lblTotalAmount").value(parseFloat(tot_amount).toFixed(2));
                                $$("lblTotalPoints").value(parseFloat(executive_net_points).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no", filterType: "Text" },
                                { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "70px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "90px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "cost", filterType: "Text" },
                                { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "90px", 'dataField': "price", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                //{ 'name': "Profit %", 'rlabel': 'Profit %', 'width': "90px", 'dataField': "profit_per", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item.cost) + parseFloat(item_cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item.price) + parseFloat(item_price);
                                    } if (item.profit != null && item.profit != undefined && item.profit != "") {
                                        item_profit = parseFloat(item.profit) + parseFloat(item_profit);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    if (item.cost != null && item.cost != undefined && item.cost != "") {
                                        item_cost = parseFloat(item_cost) - parseFloat(item.cost);
                                    }
                                    if (item.price != null && item.price != undefined && item.price != "") {
                                        item_price = parseFloat(item_price) - parseFloat(item.price);
                                    }
                                    if (item.profit != null && item.profit != undefined && item.profit != "") {
                                        item_profit = parseFloat(item_profit) - parseFloat(item.profit);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                            $$("lblSellingCost").value(parseFloat(item_price).toFixed(2));
                            $$("lblTotalProfit").value(parseFloat(item_profit).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Item No', 'rlabel': 'Item No', 'width': "70px", 'dataField': "item_no", filterType: "Text" },
                                { 'name': 'Item Name', 'rlabel': 'Item Name', 'width': "150px", 'dataField': "item_name", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Buying Cost", 'rlabel': 'Buying Cost', 'width': "90px", 'dataField': "cost", filterType: "Text" },
                                { 'name': "Selling Cost", 'rlabel': 'Selling Cost', 'width': "90px", 'dataField': "price", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                { 'name': "Bill Type", 'rlabel': 'Bill Type', 'width': "90px", 'dataField': "bill_type", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "item_no": ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                if (item.bill_type == "Sale") {
                                    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item.cost)) + parseFloat(item_cost);
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item.price)) + parseFloat(item_price);
                                    item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item.profit)) + parseFloat(item_profit);
                                }
                                else {
                                    tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    item_cost = parseFloat((item.cost == null) ? parseFloat(0) : parseFloat(item_cost) - parseFloat(item.cost));
                                    item_price = parseFloat((item.price == null) ? parseFloat(0) : parseFloat(item_price) - parseFloat(item.price));
                                    item_profit = parseFloat((item.profit == null) ? parseFloat(0) : parseFloat(item_profit) - parseFloat(item.profit));
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBuyingCost").value(parseFloat(item_cost).toFixed(2));
                            $$("lblSellingCost").value(parseFloat(item_price).toFixed(2));
                            $$("lblTotalProfit").value(parseFloat(item_profit).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0" && $$("ddlRegister").selectedValue() == "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Register', 'rlabel': 'Register', 'width': "70px", 'dataField': "reg_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "70px", 'dataField': "user_name", filterType: "Text" },
                                { 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                //{ 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "to_bill": $$("txtToBill").value(),
                        }
                        if ($$("ddlRegister").selectedValue() != "-1") {
                            reportdata.reg_no = $$("ddlRegister").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            //$$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else if ($$("ddlSummaryFilter").selectedValue() == "0" && $$("ddlRegister").selectedValue() != "-1") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Register', 'rlabel': 'Register', 'width': "70px", 'dataField': "reg_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "70px", 'dataField': "user_name", filterType: "Text" },
                                //{ 'name': "Total Bills", 'rlabel': 'Total Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                { 'name': 'Bill No', 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                            //"reg_no": ($$("ddlRegister").selectedValue() == "-1") ? "" : $$("ddlRegister").selectedValue(),
                            "from_bill": $$("txtFromBill").value(),
                            "end_bill": $$("txtToBill").value(),
                        }
                        if ($$("ddlRegister").selectedValue() != "-1") {
                            reportdata.reg_no = $$("ddlRegister").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                //if (item.qty != undefined) {
                                //    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                //}
                                //tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    }
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    if (item.qty != undefined) {
                                        tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                    }
                                }
                            });
                            $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            //$$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': 'Machine', 'rlabel': 'Machine', 'width': "70px", 'dataField': "reg_name", filterType: "Text" },
                                    { 'name': 'User', 'rlabel': 'User', 'width': "70px", 'dataField': "user_name", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date", filterType: "Text" },
                                    { 'name': "Bills", 'rlabel': 'Bills', 'width': "90px", 'dataField': "bills", filterType: "Text" },
                                    { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type", filterType: "Text" },
                                    { 'name': "Qty", 'rlabel': 'Qty', 'width': "50px", 'dataField': "qty", filterType: "Text" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                    { 'name': "Profit", 'rlabel': 'Profit', 'width': "100px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                                "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "bill_type": ($$("ddlBillType").selectedValue() == "All" || $$("ddlBillType").selectedValue() == "-1") ? "" : $$("ddlBillType").selectedValue(),
                                //"reg_no": ($$("ddlRegister").selectedValue() == "-1") ? "" : $$("ddlRegister").selectedValue(),
                                "from_bill": $$("txtFromBill").value(),
                                "end_bill": $$("txtToBill").value(),
                            }
                            if ($$("ddlRegister").selectedValue() != "-1") {
                                reportdata.reg_no = $$("ddlRegister").selectedValue();
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    //if (item.qty != undefined) {
                                    //    tot_qty = parseFloat(item.qty) + parseFloat(tot_qty);
                                    //}
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    //total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                    if (item.bill_type == "Sale") {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) + parseFloat(item.qty);
                                        }
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                        if (item.qty != undefined) {
                                            tot_qty = parseFloat(tot_qty) - parseFloat(item.qty);
                                        }
                                    }
                                });
                                $$("lblTotalQty").value(parseFloat(tot_qty).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                //$$("lblTotalPaymentAmount").value(parseFloat(total_bill_amount).toFixed(2));
                                $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "CollectorWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Collector No', 'rlabel': 'Collector No', 'width': "130px", 'dataField': "collector_no" },
                                { 'name': 'Collector', 'rlabel': 'Collector', 'width': "70px", 'dataField': "collector_name" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                                { 'name': "Collected Amount", 'rlabel': 'Collected Amount', 'width': "130px", 'dataField': "collected_amount", filterType: "Text" },
                                { 'name': "Balance Amount", 'rlabel': 'Balance Amount', 'width': "130px", 'dataField': "balance_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        $$("grdTransactions").dataBind([]);
                        $$("msgPanel").hide();
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() == "1") {
                            var day = "Date";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                            var day = "Month";
                        }
                        else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                            var day = "Year";
                        }
                        else {
                            var day = "Date";
                        }
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "dat", filterType: "Text" },
                                { 'name': 'Collector No', 'rlabel': 'Collector No', 'width': "130px", 'dataField': "collector_no", filterType: "Text" },
                                { 'name': 'Collector', 'rlabel': 'Collector', 'width': "70px", 'dataField': "collector_name", filterType: "Text" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "100px", 'dataField': "bill_amount", filterType: "Text" },
                                { 'name': "Collected Amount", 'rlabel': 'Collected Amount', 'width': "130px", 'dataField': "collected_amount", filterType: "Text" },
                                { 'name': "Balance Amount", 'rlabel': 'Balance Amount', 'width': "130px", 'dataField': "balance_amount", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        $$("grdTransactions").dataBind([]);
                        $$("msgPanel").hide();
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                    if ($$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("110%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills", filterType: "Text" },
                                { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                                { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment", filterType: "Text" },
                                { 'name': "Sales Balance", 'rlabel': 'Sales Balance', 'width': "110px", 'dataField': "sales_balance" },
                                { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                { 'name': "Return Balance", 'rlabel': 'Return Balance', 'width': "110px", 'dataField': "return_balance" },
                                { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_sales", filterType: "Text" },
                                { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                                totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                                totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                                balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                            });
                            $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                            $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                            $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                            $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                            $$("lblNetAmt").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                            $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                            $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                            $$("lblSalesBal").value(parseFloat(balanceSales).toFixed(2));
                            $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                            $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            else if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            else {
                                var day = "Date";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                    { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name" },
                                    { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                    { 'name': "Total Sales", 'rlabel': 'Total Sales', 'width': "90px", 'dataField': "total_sales", filterType: "Text" },
                                    { 'name': "Total Sales Payment", 'rlabel': 'Total Sales Payment', 'width': "150px", 'dataField': "total_sales_payment", filterType: "Text" },
                                    { 'name': "Total Return", 'rlabel': 'Total Return', 'width': "90px", 'dataField': "total_return", filterType: "Text" },
                                    { 'name': "Total Return Payment", 'rlabel': 'Total Return Payment', 'width': "150px", 'dataField': "total_return_payment", filterType: "Text" },
                                    { 'name': "Total Discount", 'rlabel': 'Total Discount', 'width': "90px", 'dataField': "discount", filterType: "Text" },
                                    { 'name': "Total Tax", 'rlabel': 'Total Tax', 'width': "90px", 'dataField': "tax", filterType: "Text" },
                                    { 'name': "Net Amount", 'rlabel': 'Net Amount', 'width': "90px", 'dataField': "net_sales", filterType: "Text" },
                                    { 'name': "Profit", 'rlabel': 'Profit', 'width': "90px", 'dataField': "profit", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    totalPaymentDiscount = parseFloat(item.discount) + parseFloat(totalPaymentDiscount);
                                    totalTax = parseFloat(item.tax) + parseFloat(totalTax);
                                    net_profit = parseFloat(item.profit) + parseFloat(net_profit);
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total_sales);
                                    totalSalesPayment = parseFloat(totalSalesPayment) + parseFloat(item.total_sales_payment);
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total_return);
                                    totalReturnsPayment = parseFloat(totalReturnsPayment) + parseFloat(item.total_return_payment);
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    balanceSales = parseFloat(balanceSales) + parseFloat(item.sales_balance);
                                    balanceReturns = parseFloat(balanceReturns) + parseFloat(item.return_balance);
                                });
                                $$("lblTotalSales").value(parseFloat(totalSales).toFixed(2));
                                $$("lblTotalPayment").value(parseFloat(totalSalesPayment).toFixed(2));
                                $$("lblTotalReturns").value(parseFloat(totalReturns).toFixed(2));
                                $$("lblTotalReturnsPayment").value(parseFloat(totalReturnsPayment).toFixed(2));
                                $$("lblNetAmt").value(parseFloat(parseFloat(totalSales).toFixed(2) - parseFloat(totalReturns).toFixed(2)).toFixed(2));
                                $$("lblPaymentDiscount").value(parseFloat(totalPaymentDiscount).toFixed(2));
                                $$("lblTotalTax").value(parseFloat(totalTax).toFixed(2));
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                $$("lblProfit").value(parseFloat(net_profit).toFixed(2));
                                $$("lblSalesBal").value(parseFloat(balanceSales).toFixed(2));
                                $$("lblReturnBal").value(parseFloat(balanceReturns).toFixed(2));
                                $$("lblNetBalance").value(parseFloat(parseFloat($$("lblSalesBal").value()) - parseFloat($$("lblReturnBal").value())).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                    if ($$("ddlLoginUser").selectedValue() == "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "150px", 'dataField': "user_name" },
                                { 'name': 'Machine', 'rlabel': 'Machine', 'width': "150px", 'dataField': "reg_name" },
                                //{ 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type" },
                                { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                //{ 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "-1" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "store_no": $$("ddlStore").selectedValue() == "-1" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        }
                        if ($$("ddlRegister").selectedValue() != "-1") {
                            reportdata.reg_no = $$("ddlRegister").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                }
                            });
                            $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else if ($$("ddlLoginUser").selectedValue() != "-1" && $$("ddlSummaryFilter").selectedValue() == "0") {
                        $$("grdTransactions").height("350px");
                        $$("grdTransactions").width("100%");
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 250,
                            columns: [
                                { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                { 'name': 'User', 'rlabel': 'User', 'width': "150px", 'dataField': "user_name" },
                                { 'name': 'Machine', 'rlabel': 'Machine', 'width': "150px", 'dataField': "reg_name" },
                                //{ 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "total_bill" },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "90px", 'dataField': "bill_no", filterType: "Text" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date", filterType: "Text" },
                                { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type" },
                                { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                            ]
                        });
                        $$("grdTransactions").rowBound = function (row, item) {
                            $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                        }
                        var reportdata = {
                            "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                            "viewMode": $$("ddlViewMode").selectedData().view_name,
                            "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                            "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                            "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                            "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                        }
                        if ($$("ddlRegister").selectedValue() != "-1") {
                            reportdata.reg_no = $$("ddlRegister").selectedValue();
                        }
                        page.salesReportAPI.salesReport(reportdata, function (data) {
                            if (data.length > 0) {
                                page.resultFound();
                            }
                            else {
                                page.noResultFound();
                            }
                            $$("grdTransactions").dataBind(data);
                            $$("pnlGridFilter").show();
                            $(data).each(function (i, item) {
                                total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                if (item.bill_type == "Sale") {
                                    totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                }
                                if (item.bill_type == "SaleReturn") {
                                    totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                }
                            });
                            $$("lblTotalBills").value(parseFloat(data.length).toFixed(2));
                            $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                            $$("msgPanel").hide();
                        })
                    }
                    else {
                        if ($$("ddlSummaryFilter").selectedValue() != "0") {
                            if ($$("ddlSummaryFilter").selectedValue() == "1") {
                                var day = "Date";
                            }
                            if ($$("ddlSummaryFilter").selectedValue() == "2") {
                                var day = "Month";
                            }
                            if ($$("ddlSummaryFilter").selectedValue() == "3") {
                                var day = "Year";
                            }
                            $$("grdTransactions").height("350px");
                            $$("grdTransactions").width("100%");
                            $$("grdTransactions").setTemplate({
                                selection: "Single", paging: true, pageSize: 250,
                                columns: [
                                    { 'name': "Sl No", 'rlabel': 'Sl No', 'width': "70px", 'dataField': "sl_no", filterType: "Text" },
                                    { 'name': 'Store', 'rlabel': 'Store', 'width': "70px", 'dataField': "store_name", filterType: "Text" },
                                    { 'name': day, 'rlabel': day, 'width': "70px", 'dataField': "bill_date" },
                                    { 'name': 'User', 'rlabel': 'User', 'width': "150px", 'dataField': "user_name" },
                                    { 'name': 'Machine', 'rlabel': 'Machine', 'width': "150px", 'dataField': "reg_name" },
                                    { 'name': 'Bill Type', 'rlabel': 'Bill Type', 'width': "70px", 'dataField': "bill_type" },
                                    { 'name': 'Total Bills', 'rlabel': 'Total Bills', 'width': "70px", 'dataField': "bills" },
                                    { 'name': "Bill Amount", 'rlabel': 'Bill Amount', 'width': "90px", 'dataField': "total", filterType: "Text" },
                                ]
                            });
                            $$("grdTransactions").rowBound = function (row, item) {
                                $(row).find("[datafield=sl_no]").find("div").html(page.controls.grdTransactions.allData().length);
                            }
                            var reportdata = {
                                "summary": ($$("ddlSummaryFilter").selectedData() == null) ? "All" : $$("ddlSummaryFilter").selectedData().mode_name,
                                "viewMode": $$("ddlViewMode").selectedData().view_name,
                                "store_no": $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                                "fromDate": ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                                "toDate": ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                                "user_no": ($$("ddlLoginUser").selectedValue() == "-1") ? "" : $$("ddlLoginUser").selectedValue(),
                            }
                            if ($$("ddlRegister").selectedValue() != "-1") {
                                reportdata.reg_no = $$("ddlRegister").selectedValue();
                            }
                            page.salesReportAPI.salesReport(reportdata, function (data) {
                                if (data.length > 0) {
                                    page.resultFound();
                                }
                                else {
                                    page.noResultFound();
                                }
                                $$("grdTransactions").dataBind(data);
                                $$("pnlGridFilter").show();
                                $(data).each(function (i, item) {
                                    tot_bills = parseFloat(tot_bills) + parseFloat(item.bills);
                                    total_bill_amount = parseFloat(total_bill_amount) + parseFloat(item.total);
                                    if (item.bill_type == "Sale") {
                                        totalSales = parseFloat(totalSales) + parseFloat(item.total);
                                    }
                                    if (item.bill_type == "SaleReturn") {
                                        totalReturns = parseFloat(totalReturns) + parseFloat(item.total);
                                    }
                                });
                                $$("lblTotalBills").value(parseFloat(tot_bills).toFixed(2));
                                $$("lblTotalPaymentAmount").value(parseFloat(parseFloat(totalSales) - parseFloat(totalReturns)).toFixed(2));
                                $$("msgPanel").hide();
                            })
                        }
                    }
                }
                if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                    $$("lblSummaryName").value("Standard Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").hide();
                    $$("pnlExpense").show();
                    $$("pnlCashInHand").show();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                    $$("lblSummaryName").value("CustomerWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").show();
                    $$("pnlTotalReturnsPoint").show();
                    $$("pnlNetPoint").show();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "SummaryDay") {
                    $$("lblSummaryName").value("SummaryDay Summary");
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "SummaryMonth") {
                    $$("lblSummaryName").value("SummaryMonth Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "SummaryYear") {
                    $$("lblSummaryName").value("SummaryYear Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name == "VariationWise") {
                    $$("lblSummaryName").value("VariationWise Summary")
                    $$("pnlSummary").hide();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                    $$("lblSummaryName").value("PaymentWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").show();
                    $$("pnlTotalCardAmount").show();
                    $$("pnlTotalChequeAmount").show();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                    $$("lblSummaryName").value("OrderWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").show();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                    $$("lblSummaryName").value("SalesExecutiveWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlNetPoint").show();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").show();
                    $$("pnlTotalAmount").show();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name  == "ItemWise") {
                    $$("lblSummaryName").value("ItemWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").show();
                    $$("pnlTotalBuyingCost").show();
                    $$("pnlSellingCost").show();
                    $$("pnlTotalProfit").show();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                    $$("lblSummaryName").value("MachineWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").show();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "CollectorWise") {
                    $$("lblSummaryName").value("CollectorWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlTotalSales").hide();
                    $$("pnlTotalPayment").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlTotalReturns").hide();
                    $$("pnlTotalReturnsPayment").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalTax").hide();
                    $$("pnlPaymentDiscount").hide();
                    $$("pnlTotalBills").hide();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").show();
                    $$("pnlTotalBalance").show();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                }
                if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                    $$("lblSummaryName").value("StoreWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").show();
                    $$("pnlTotalSales").show();
                    $$("pnlTotalPayment").show();
                    $$("pnlSalesBalance").show();
                    $$("pnlSalesReturnBalance").show();
                    $$("pnlSalesReturnSummary").show();
                    $$("pnlTotalReturns").show();
                    $$("pnlTotalReturnsPayment").show();
                    $$("pnlSalesTaxSummary").show();
                    $$("pnlTotalTax").show();
                    $$("pnlPaymentDiscount").show();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").show();
                    $$("pnlProfit").show();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").hide();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").show();
                }
                if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                    $$("lblSummaryName").value("UserWise Summary")
                    $$("pnlSummary").show();
                    $$("pnlSalesSummary").hide();
                    $$("pnlSalesBalance").hide();
                    $$("pnlSalesReturnBalance").hide();
                    $$("pnlSalesReturnSummary").hide();
                    $$("pnlSalesTaxSummary").hide();
                    $$("pnlTotalBills").show();
                    $$("pnlNetSales").hide();
                    $$("pnlNetAmt").hide();
                    $$("pnlProfit").hide();
                    $$("pnlProfitAndTax").hide();
                    $$("pnlAmountFromOrder").hide();
                    $$("pnlAmountFromPOS").hide();
                    $$("pnlTotalBillAmount").show();
                    $$("pnlTotalSalesPoint").hide();
                    $$("pnlTotalReturnsPoint").hide();
                    $$("pnlNetPoint").hide();
                    $$("pnlTotalCollectedAmt").hide();
                    $$("pnlTotalBalance").hide();
                    $$("pnlTotalCashAmount").hide();
                    $$("pnlTotalCardAmount").hide();
                    $$("pnlTotalChequeAmount").hide();
                    $$("pnlTotalSalesQty").hide();
                    $$("pnlTotalAmount").hide();
                    $$("pnlTotalQty").hide();
                    $$("pnlTotalBuyingCost").hide();
                    $$("pnlSellingCost").hide();
                    $$("pnlTotalProfit").hide();
                    $$("pnlGridFilter").show();
                    $$("pnlExpense").hide();
                    $$("pnlCashInHand").hide();
                    $$("pnlNetBalance").hide();
                }
            },
            page_load: function () {
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
                    });
                });
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                    sort_expression: ""
                }
                page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.controls.ddlRegister.dataBind(data, "reg_no", "reg_name", "All");
                    $(data).each(function (i, item) {
                        reg_ids.push(item.reg_no);
                    })
                });
                page.salesexecutiveAPI.searchValues("", "", "saexe_active='1'", "", function (data) {
                    page.controls.ddlDeliveryBy.dataBind(data, "sale_executive_no", "sale_executive_name", "All");
                    page.controls.ddlItemSalesMan.dataBind(data, "sale_executive_no", "sale_executive_name", "All");
                });
                page.userAPI.getUserDetail(function (data) {
                    page.controls.ddlLoginUser.dataBind(data, "user_id", "user_name", "All");
                });
                var summaryFilterData = [];
                summaryFilterData.push({ mode_no: "0", mode_name: "All" }, { mode_no: "1", mode_name: "SummaryDay" }, { mode_no: "2", mode_name: "SummaryMonth" }, { mode_no: "3", mode_name: "SummaryYear" })
                $$("ddlSummaryFilter").dataBind(summaryFilterData, "mode_no", "mode_name");
                var itemFilterData = [];
                itemFilterData.push({ item_mode_no: "1", item_mode_name: "Overall" }, { item_mode_no: "2", item_mode_name: "Saleswise" })
                $$("ddlItemFilter").dataBind(itemFilterData, "item_mode_no", "item_mode_name", "Select");
                var filterViewData = [];
                filterViewData.push({ view_no: "1", view_name: "Standard" }, { view_no: "2", view_name: "CustomerWise" },
                    //{ view_no: "3", view_name: "VariationWise" },
                    { view_no: "4", view_name: "SummaryDay" }, { view_no: "5", view_name: "SummaryMonth" }, { view_no: "6", view_name: "SummaryYear" }, { view_no: "7", view_name: "PaymentWise" }, { view_no: "8", view_name: "OrderWise" }, { view_no: "9", view_name: "SalesExecutiveWise" }, { view_no: "10", view_name: "ItemWise" }, { view_no: "11", view_name: "MachineWise" },
                    //{ view_no: "12", view_name: "CollectorWise" },
                    { view_no: "13", view_name: "StoreWise" }, { view_no: "14", view_name: "UserWise" })
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");
                page.shopOnStatesAPI.searchValues("", "", "so_t=1", "", function (data) {
                    $$("ddlState").dataBind(data, "state_no", "state_name", "All");
                });
                page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                    $$("ddlCustomer").dataBind(data, "cust_no", "cust_name", "All");
                });
                page.controls.txtItem.dataBind({
                    getData: function (term, callback) {
                        callback(item_list);
                    }
                });
                page.itemAPI.searchValues("", "", "", "", function (data) {
                    item_list = data;
                });
                page.controls.txtVariation.dataBind({
                    getData: function (term, callback) {
                        callback(variations);
                    }
                });
                page.variationAPI.searchValues("", "", "", "", function (data1) {
                    variations = data1;
                });
                page.stockAPI.searchVariationsMain("select item_no from item_t where comp_id =" + localStorage.getItem("user_company_id"), localStorage.getItem("user_store_no"), function (data1) {
                    variation_list = data1;
                });
                $$("lblNetSaleName").click(function () {
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("pnlAmountFromPOS").toggle();
                        $$("pnlAmountFromOrder").toggle();
                    }
                })
                var bill_typedata = [];
                bill_typedata.push({ "bill_type": "Sale" }, { "bill_type": "SaleReturn" });//, { "bill_type": "SaleSaved" }
                $$("ddlBillType").dataBind(bill_typedata, "bill_type", "bill_type", "All");
                var payModeType = [];
                payModeType.push({ mode_type: "All" }, { mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Cheque" });
                //if (CONTEXT.ENABLE_REWARD_MODULE == true)
                //    payModeType.push({ mode_type: "Points" })
                //if (CONTEXT.ENABLE_COUPON_MODULE == "true")
                //    payModeType.push({ mode_type: "Coupon" })
                //payModeType.push({ mode_type: "Mixed" });
                //payModeType.push({ mode_type: "Loan" });
                //if (CONTEXT.ENABLE_EMI_PAYMENT) {
                //    payModeType.push({ mode_type: "EMI" });
                //}
                page.controls.ddlPaymentType.dataBind(payModeType, "mode_type", "mode_type");
                var payMode = [];
                payMode.push({ mode_type: "All" }, { mode_type: "Cash" }, { mode_type: "Card" }, { mode_type: "Cheque" });
                if (CONTEXT.ENABLE_REWARD_MODULE == true)
                    payMode.push({ mode_type: "Points" })
                if (CONTEXT.ENABLE_COUPON_MODULE == "true")
                    payMode.push({ mode_type: "Coupon" })
                payMode.push({ mode_type: "Mixed" });
                payMode.push({ mode_type: "Loan" });
                if (CONTEXT.ENABLE_EMI_PAYMENT) {
                    payMode.push({ mode_type: "EMI" });
                }
                page.controls.ddlPayType.dataBind(payMode, "mode_type", "mode_type");

                $$("ddlViewMode").selectionChange(function (data) {
                    if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").show();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").show();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "VariationWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").show();
                        $$("pnlVariation").show();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("lblNetSaleName").attr("style", "user-select: none;cursor: pointer;");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        $$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        $$("pnlNetBalance").show();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryDay" ||
                        $$("ddlViewMode").selectedData().view_name == "SummaryMonth" || $$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlGridFilter").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "PaymentWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").show();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "OrderWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").show();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").show();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlTransType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").show();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").show();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").show();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "MachineWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").show();
                        $$("pnlToBill").show();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").show();
                        $$("pnlLineman").hide();
                        $$("pnlUser").show();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "CollectorWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").hide();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").show();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "StoreWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").hide();
                        $$("pnlLineman").hide();
                        $$("pnlUser").hide();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "UserWise") {
                        $$("lblNetSaleName").attr("style", "");
                        $$("pnlCustomer").hide();
                        $$("pnlItem").hide();
                        $$("pnlVariation").hide();
                        $$("pnlBillType").hide();
                        $$("pnlFromBill").hide();
                        $$("pnlToBill").hide();
                        $$("pnlStore").show();
                        $$("pnlStatus").hide();
                        $$("pnlSalesExecutive").hide();
                        $$("pnlPayMode").hide();
                        $$("pnlPayment").hide();
                        $$("pnlItemSalesExecutive").hide();
                        $$("pnlRegister").show();
                        $$("pnlLineman").hide();
                        $$("pnlUser").show();
                        $$("pnlItemFilter").hide();
                        $$("pnlSummaryFilter").show();
                        $$("pnlGridFilter").hide();
                        $$("pnlTransType").hide();
                        page.refreshAll();
                    }
                });
                setTimeout(function () {
                    $$("pnlFilterPanel").show();
                    $$("pnlItemSalesExecutive").hide();
                    $$("pnlBillType").show();
                    $$("pnlFromBill").show();
                    $$("pnlToBill").show();
                    $$("pnlStore").show();
                    $$("pnlPayment").show();
                    $$("txtStartDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    $$("txtEndDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
                    $$("lblNetSaleName").attr("style", "user-select: none;cursor: pointer;");
                    $$("ddlViewMode").selectedObject.focus();
                }, 1000);
                //$$("ddlPayType").selectedObject.change(function () {
                //    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                //        $$("btnGenerate").focus();
                //    }
                //});
            },
            btnSTHideFilter_click: function () {
                $$("grdTransactions").clearFilter();
            },
            btnSTShowFilter_click: function () {
                $$("grdTransactions").showFilter();
            },

        }
        page.noResultFound = function () {
            $$("pnlEmptyGrid").show();
            $$("pnlSummary").hide();
            $$("pnlGridTransaction").hide();
        }
        page.resultFound = function () {
            $$("pnlEmptyGrid").hide();
            $$("pnlSummary").show();
            $$("pnlGridTransaction").show();
        }
        page.refreshAll = function () {
            $$("txtStartDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            $$("txtEndDate").setDate($.datepicker.formatDate("dd-mm-yy", new Date()));
            //$$("txtStartDate").selectedObject.val("");
            //$$("txtEndDate").selectedObject.val("");
            $$("ddlCustomer").selectedValue(-1);
            $$("txtItem").selectedObject.val("");
            $$("txtVariation").selectedObject.val("");
            $$("ddlBillType").selectedValue(-1);
            $$("ddlStore").selectedValue(-1);
            $$("txtFromBill").value("");
            $$("txtToBill").value("");
            $$("ddlState").selectedValue(-1);
            $$("ddlDeliveryBy").selectedValue(-1);
            $$("ddlPaymentType").selectedValue("All");
            $$("ddlItemSalesMan").selectedValue(-1);
            $$("ddlRegister").selectedValue(-1);
            //$$("ddlLineman").selectedValue(-1);
            $$("ddlLoginUser").selectedValue(-1);
            $$("ddlItemFilter").selectedValue(-1);
            $$("ddlSummaryFilter").selectedValue(0);
        }
        function jasperReport() {
            var detail_list = [];
            var filter = {};
            var net_profit = 0;
            var totalTax = 0;
            filter.viewMode = $$("ddlViewMode").selectedData().view_name ;
            filter.fromDate = ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate());
            filter.toDate = ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate());
            filter.cust_no = $$("ddlCustomer").selectedValue() == "-1" ? "" : $$("ddlCustomer").selectedValue();
            filter.bill_type = $$("ddlBillType").selectedValue() == "All" ? "" : $$("ddlBillType").selectedValue();
            filter.item_no = ($$("txtItem").selectedValue() == "-1" || $$("txtItem").selectedValue() == null) ? "" : $$("txtItem").selectedValue(),
            filter.status = $$("ddlState").selectedValue() == "-1" ? "" : $$("ddlState").selectedValue();
            //filter.bill_filter = $$("ddlFilter").selectedValue() == "All" ? "" : $$("ddlFilter").selectedValue();
            //filter.area = $$("ddlArea").selectedValue() == "-1" ? "" : $$("ddlArea").selectedValue();
            filter.store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue();
            filter.reg_no = $$("ddlRegister").selectedValue() == "All" || $$("ddlRegister").selectedValue() == "-1" ? reg_ids.join(",") : $$("ddlRegister").selectedValue();
            filter.user_no = $$("ddlLoginUser").selectedValue() == "All" || $$("ddlLoginUser").selectedValue() == "-1" ? user_ids.join(",") : $$("ddlLoginUser").selectedValue();
            filter.sales_executive = $$("ddlDeliveryBy").selectedValue() == "All" || $$("ddlDeliveryBy").selectedValue() == "-1" ? "" : $$("ddlDeliveryBy").selectedValue();
            //filter.bill_advance = $$("ddlBillAdvance").selectedValue() == "All" || $$("ddlBillAdvance").selectedValue() == "-1" ? "" : $$("ddlBillAdvance").selectedValue();
            //filter.bill_cashier = $$("ddlBillCashier").selectedValue() == "All" || $$("ddlBillCashier").selectedValue() == "-1" ? "" : $$("ddlBillCashier").selectedValue();
            filter.bill_payment_mode = $$("ddlPaymentType").selectedValue() == "All" || $$("ddlPaymentType").selectedValue() == "-1" ? "" : $$("ddlPaymentType").selectedValue();
            filter.item_sales_man = $$("ddlItemSalesMan").selectedValue() == "All" || $$("ddlItemSalesMan").selectedValue() == "-1" ? "" : $$("ddlItemSalesMan").selectedValue();
            filter.comp_id = localStorage.getItem("user_company_id");
            //filter.itemFromDate = ($$("txtItemStartDate").getDate() == "") ? "" : dbDate($$("txtItemStartDate").getDate());
            //filter.itemToDate = ($$("txtItemEndDate").getDate() == "") ? "" : dbDate($$("txtItemEndDate").getDate());
            //filter.language = "'"+$$("ddlLanguage").selectedValue()+"'";
            page.reportAPI.salesReport(filter, function (data) {
                var detail = data;
                if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                    $(detail).each(function (i, item) {
                        net_profit = parseFloat(net_profit) - (parseFloat(item.total) - parseFloat(item.bill_buying_cost));
                        totalTax = parseFloat(totalTax) - parseFloat(item.tot_tax);
                        detail_list.push({
                            //"Bill No": (item.bill_no == null) ? "" : item.bill_no,
                            "Bill No": (item.bill_id == null) ? "" : item.bill_id,
                            "Bill Type": (item.bill_type == null) ? "" : item.bill_type,
                            "Bill Date": (item.bill_date == null) ? "" : item.bill_date,
                            "Cust No": (item.cust_no == null) ? "" : item.cust_no,
                            "Cust Name": (item.cust_name == null) ? "" : item.cust_name,
                            "GST No": (item.gst_no == null) ? "" : item.gst_no,
                            "TIN No": (item.tin_no == null) ? "" : item.tin_no,
                            "CGST": (item.tot_tax == null) ? "" : parseFloat(item.tot_tax).toFixed(2),
                            "SGST": (item.tot_tax == null) ? "" : parseFloat(item.tot_tax).toFixed(2),
                            "GST": (item.tot_tax == null) ? "" : parseFloat(item.tot_tax).toFixed(2),
                            "Company": (item.company == null) ? "" : item.company,
                            "AREA": (item.area == null) ? "" : item.area,
                            "Amount": (item.total == null) ? "" : item.total,
                            "Exp Amt": (item.expense_amt == null) ? "" : item.expense_amt,
                            "Sub Total": (item.sub_total == null) ? "" : item.sub_total,
                            "Discount": (item.tot_discount == null) ? "" : item.tot_discount,
                            "Rnd Off": (item.round_off == null) ? "" : item.round_off,
                            "Paid": (item.paid_amount == null) ? "" : item.paid_amount,
                            "Paid Mode": (item.pay_mode == null) ? "" : item.pay_mode,
                            "Total Amount": (item.total_paid_amount == null) ? "" : item.total_paid_amount,
                            "Balance": (item.balance == null) ? "" : item.balance,
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "CompanyCityStreetPincode": " ",
                                    "ReportName": "Sales Report ( Standard )",
                                    "TotalSales": page.controls.lblTotalSales.value(),
                                    "TotalTax": page.controls.lblTotalTax.value(),
                                    "TotalPayment": page.controls.lblTotalPayment.value(),
                                    "TotalReturn": page.controls.lblTotalReturns.value(),
                                    "TotalReturnPayment": page.controls.lblTotalReturnsPayment.value(),
                                    "NetSales": page.controls.lblNetSales.value(),
                                    "ClosingBalance": page.controls.lblClosingBal.value(),
                                    "NetProfitWithTax": parseFloat(net_profit).toFixed(2),
                                    "isNetProfitWithTax": (CONTEXT.NET_PROFIT_WITH_TAX == undefined) ? "true" : CONTEXT.NET_PROFIT_WITH_TAX,
                                    "NetProfitWithoutTax": parseFloat(parseFloat(net_profit) - parseFloat(totalTax)).toFixed(2),
                                    "isNetProfitWithoutTax": (CONTEXT.NET_PROFIT_WITHOUT_TAX == undefined) ? "true" : CONTEXT.NET_PROFIT_WITHOUT_TAX,
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/shopon-sales-report new.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "Sales OrderWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Order No": item.order_id,
                            "Created Date": item.created_date,
                            "Cust No": item.cust_no,
                            "Cust Name": item.cust_name,
                            "Status": item.state_text,
                            "Bill No": item.bill_no,
                            "Return No": item.return_bill_no,
                            "Item No": item.item_no,
                            "Item Name": item.item_name,
                            "Quantity": item.quantity,
                            "Price": item.price,
                            "Discount": item.discount,
                            "Total Price": item.total_price,
                            "Tray Count": item.tray_count,
                            "Paid": item.total_paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                    "ReportName": "Sales Report ( Sales OrderWise )",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/sales-order-wise.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Cust No": item.cust_no,
                            "Cust Name": item.cust_name,
                            "Total Price": item.total_price,
                            "Paid": item.total_paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                    "ReportName": "Sales Report ( CustomerWise )",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/customer-wise-sales.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "SalesExecutiveWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Sale Executive Id": (item.sale_executive_id == null) ? "" : item.sale_executive_id,
                            "Sale Executive Name": item.sale_executive_name,
                            "Total Price": item.total_price,
                            "Paid": item.total_paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "ReportName": "Sales Report(SalesExecutiveWise)",
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/sales-executive-wise-sales.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            //"Item No": item.item_no,
                            "Item No": item.item_code,
                            "Item Name": item.item_name,
                            "Start Date": (item.start_date == null) ? "" : item.start_date,
                            "End Date": (item.end_date == null) ? "" : item.end_date,
                            "isStartEndDate": CONTEXT.ENABLE_SALES_ITEM_DATE,
                            "Quantity": item.qty,
                            "Total Price": item.total_price,
                            "Paid": item.total_paid_amount
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + " , " + CONTEXT.COMPANY_ADDRESS_LINE2,
                                    "ReportName": "Sales Report ( ItemWise )",
                                    "TotalSales": page.controls.lblItemSales.value(),
                                    "TotalReturn": page.controls.lblItemReturn.value(),
                                    "Details": detail_list
                                };

                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/item-wise-sales.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
                else {
                    $(detail).each(function (i, item) {
                        detail_list.push({
                            "Date": item.sum_date,
                            "Total Sale": item.tot_sale,
                            "Total Payment": item.tot_pay,
                            "Total Return": item.tot_ret,
                            "Total Return Payment": item.tot_ret_pay
                        });
                    });
                    var accountInfo =
                                {
                                    "CompName": CONTEXT.COMPANY_NAME,
                                    //"ReportName": "Sales Report ( Summary Day )",
                                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS,
                                    "Details": detail_list
                                };
                    if ($$("ddlViewMode").selectedData().view_name == "SummaryDay") {
                        accountInfo.ReportName = "Sales Report ( Summary Day )";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryMonth") {
                        accountInfo.ReportName = "Sales Report ( Summary Month )";
                    }
                    else if ($$("ddlViewMode").selectedData().view_name == "SummaryYear") {
                        accountInfo.ReportName = "Sales Report ( Summary Year )";
                    }
                    GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report-jasper/sales-report-sum-day.jrxml", accountInfo, $$("ddlExportType").selectedValue());
                }
            });
        }
        page.events.btnReport_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.rlabel("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(200);
        }
        page.events.btnPrintJasperBill_click = function () {
            jasperReport();
        }
        page.events.btnPrint_click = function () {
            PrintDataSR(0);
        }
        function PrintDataSR(dataList) {
            var r = window.open(null, "_blank");
            var doc = r.document;
            var head = false;
            //doc.write("<div><span style='float:right'>ORIGINAL</span></div>");
            doc.write("<div><h2><center>" + '' + CONTEXT.COMPANY_NAME + '' + "</center></h2></div>");
            doc.write("<div><h7><center>" + '' + CONTEXT.COMPANY_ADDRESS + '' + "</center></h7></div>");
            doc.write("<div><h7><center>" + '' + CONTEXT.COMPANY_PHONE_NO + '' + "</center></h7></div>");
            doc.write("<br><header align='center'> <h3>Sales Report</h3></header>");
            doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
            //doc.write("<div><span style='float:left'>DL.No : " + '' + CONTEXT.COMPANY_DL_NO + '' + "</span></div>");
            //doc.write("<div><span class='col-lg-12' style='float:right'>TIN : " + '' + CONTEXT.COMPANY_TIN_NO + '' + "</span></div><br>");
            //doc.write("<div><span class='col-lg-12' style='float:right'>GST : </span></div><br><br><br>");
            if ($$("ddlViewMode").selectedData().view_name  == "Standard") {
                doc.write("<div><h3>Summary:</h3></div>");
                doc.write("<div style='width:500px;'>");
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Sales : </span><span style='width:150px;align-content:right'>" + page.controls.lblTotalSales.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Payment : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalPayment.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Return : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalReturns.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Total Return Payment : </span><span style='width:150px;align-content:center'>" + page.controls.lblTotalReturnsPayment.value() + "</span><br>");
                doc.write("<span style='font-weight:bold;width:150px;'>Net Sales : </span><span style='width:150px;align-content:center'>" + page.controls.lblNetSales.value() + "</span><br></div>");
                doc.write("<span style='font-weight:bold;width:150px;'>Closing Balance : </span><span style='width:150px;align-content:center'>" + page.controls.lblClosingBal.value() + "</span><br></div>");
                doc.write("<div><h3>Details:</h3></div>");
                doc.write("<table align='center' style='width:1000px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white; font-size: 14px;'>");
                doc.write("<th align='left'style=' width: 50px; height: 30px;'>B No</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;'>Bill Type</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;'>Bill Date</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;'>Cust Name</th>");
                doc.write("<th align='left' style=' width: 80px; height: 30px;'>Cust GST</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Sub Total</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>GST</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>CGST</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>SGST</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>IGST</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Exp Amt</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Discount</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Rnd Off</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Amount</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Paid Amt</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>PayMode</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Tot Paid</th>");
                doc.write("<th align='left' style=' width: 50px; height: 30px;'>Balance</th></tr>");
                var lastCustNo = "";
                var lineCount = 0;
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        if (lastCustNo != data.cust_no) {
                            //doc.write("<tr><td colspan='6'><span style='font-size 20px;'><b> CUST NAME : </b>" + data.cust_name.toUpperCase() + "  <span></td></tr>");
                            doc.write("<tr><td colspan='12'><span id='groupbycust' style='font-size 30px;'><b> Cust No : " + data.cust_no + ",  Cust Name : " + data.cust_name + ", GST No : " + data.gst_no + ", TIN : " + data.tin_no + ", Area : " + data.area + " </b> <span></td></tr>");
                            //$(row).find(".header").html("<span id='groupbycust' style='font-size 30px;'><b> Cust No : " + item.cust_no + ",  Cust Name : " + item.cust_name + ", GST No : " + item.gst_no + ", TIN : " + item.tin_no + ", Area : " + item.area + " </b> <span>");
                        }
                        doc.write("<tr><td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.bill_no + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 14px;'>" + data.bill_type + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 14px;'>" + data.bill_date + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 14px;'>" + data.cust_name + "</td>");
                        doc.write("<td style=' width: 80px; height: 30px;font-size: 14px;'>" + data.gst_no + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.sub_total + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.tot_tax + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.cgst + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.sgst + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.igst + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.expense_amt + "</td>");
                        //doc.write("<td>" + data.tot_cgst + "</td>");
                        //doc.write("<td>" + data.tot_sgst + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.tot_discount + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.round_off + "</td>");
                        //doc.write("<td>" + data.cust_no + "</td>");
                        //doc.write("<td>" + data.cust_name + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.total + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.paid_amount + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.pay_mode + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.total_paid_amount + "</td>");
                        doc.write("<td style=' width: 50px; height: 30px;font-size: 14px;'>" + data.balance + "</td>");
                        head = true;
                        lineCount = lineCount + 1;
                        lastCustNo = data.cust_no;
                        if (lineCount > 20) {
                            doc.write("</tr>");
                            //doc.write("<p style='page-break-after:always;'></p><div class='col-lg-12'>");
                            //                            doc.write("<hr/>");
                            doc.write("<div class='page-break'></div>");
                            doc.write("<tr>");
                            //                            doc.write("<hr/>");
                            lineCount = 0;
                        }
                        //doc.write("</tr>");
                    }


                    //if (lineCount > 20) {
                    //    doc.write("</body></html>");
                    //    doc.write("<p style='page-break-after:always;'></p>");
                    //    lineCount = 0;
                    //}

                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "Sales OrderWise") {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:1000px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Order No</th>");
                doc.write("<th align='left'>Created Date</th>");
                doc.write("<th align='left'>Cust No</th>");
                doc.write("<th align='left'>Cust Name</th>");
                doc.write("<th align='left'>Status</th>");
                doc.write("<th align='left'>Bill No</th>");
                doc.write("<th align='left'>Return No</th>");
                doc.write("<th align='left'>Item No</th>");
                doc.write("<th align='left'>Item Name</th>");
                doc.write("<th align='left'>Quantity</th>");
                doc.write("<th align='left'>Price</th>");
                doc.write("<th align='left'>Discount</th>");
                doc.write("<th align='left'>Total Price</th>");
                doc.write("<th align='left'>Tray Count</th>");
                doc.write("<th align='left'>Total Paid</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.order_id + "</td>");
                        doc.write("<td>" + data.created_date + "</td>");
                        doc.write("<td>" + data.cust_no + "</td>");
                        doc.write("<td>" + data.cust_name + "</td>");
                        doc.write("<td>" + data.state_text + "</td>");
                        doc.write("<td>" + data.bill_no + "</td>");
                        doc.write("<td>" + data.return_bill_no + "</td>");
                        doc.write("<td>" + data.item_no + "</td>");
                        doc.write("<td>" + data.item_name + "</td>");
                        doc.write("<td>" + data.quantity + "</td>");
                        doc.write("<td>" + data.price + "</td>");
                        doc.write("<td>" + data.discount + "</td>");
                        doc.write("<td>" + data.total_price + "</td>");
                        doc.write("<td>" + data.tray_count + "</td>");
                        doc.write("<td>" + data.total_paid_amount + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "CustomerWise") {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:1000px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Cust No</th>");
                doc.write("<th align='left'>Cust Name</th>");
                doc.write("<th align='left'>Total Price</th>");
                doc.write("<th align='left'>Total Paid</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.cust_no + "</td>");
                        doc.write("<td>" + data.cust_name + "</td>");
                        doc.write("<td>" + data.total_price + "</td>");
                        doc.write("<td>" + data.total_paid_amount + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            else if ($$("ddlViewMode").selectedData().view_name == "ItemWise") {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:1000px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Bill No</th>");
                doc.write("<th align='left'>Bill Date</th>");
                doc.write("<th align='left'>Item No</th>");
                doc.write("<th align='left'>Item Name</th>");
                doc.write("<th align='left'>HSN Code</th>");
                doc.write("<th align='left'>CGST</th>");
                doc.write("<th align='left'>SGST</th>");
                doc.write("<th align='left'>IGST</th>");
                doc.write("<th align='left'>Quantity</th>");
                doc.write("<th align='left'>Total Price</th>");
                doc.write("<th align='left'>Total Paid</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {

                        doc.write("<tr><td>" + data.bill_no + "</td><td>" + data.bill_date + "</td><td>" + data.item_no + "</td>");
                        doc.write("<td>" + data.item_name + "</td>");
                        doc.write("<td>" + data.hsn_code + "</td>");
                        doc.write("<td>" + data.cgst + "</td>");
                        doc.write("<td>" + data.sgst + "</td>");
                        doc.write("<td>" + data.igst + "</td>");
                        doc.write("<td>" + data.qty + "</td>");
                        doc.write("<td>" + data.total_price + "</td>");
                        doc.write("<td>" + data.total_paid_amount + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            else {
                doc.write("<style>table {border-collapse: collapse; width: 100%; font-size:12px;}td, th { border: 1px solid #dddddd;} tr:nth-child(even) { background-color: #dddddd; }  #orgTblItem{border-collapse: collapse}  #orgTblItem >tbody > tr >td {border-left: 1px solid #dddddd;border-right: 1px solid #dddddd;}</style>");
                doc.write("<table align='center' style='width:1000px;");
                doc.write("<tr style='font-weight:bold;color: black; background-color:white'>");
                doc.write("<th align='left'>Date</th>");
                doc.write("<th align='left'>Total Sale</th>");
                doc.write("<th align='left'>Total Payment</th>");
                doc.write("<th align='left'>Total Return</th>");
                doc.write("<th align='left'>Total Return Payment</th></tr>");
                $(page.controls.grdTransactions.allData()).each(function (i, data) {
                    if (head == false || head == true) {
                        doc.write("<tr><td>" + data.sum_date + "</td>");
                        doc.write("<td>" + data.tot_sale + "</td>");
                        doc.write("<td>" + data.tot_pay + "</td>");
                        doc.write("<td>" + data.tot_ret + "</td>");
                        doc.write("<td>" + data.tot_ret_pay + "</td></tr>");
                        doc.write("</tr>");
                        head = true;
                    }

                    doc.write("<tr>");
                    for (var prop in data) {
                        //  doc.write("<td  class='col'>" + data[prop] + "</td>");
                    }
                    doc.write("</tr>");
                });
            }
            //doc.write("</table><footer> <h1>Woto Technologies,Tiruchendur, Tuticorin district - 628215</h1></footer></body></html>");
            //doc.write("</table><br> <br><br><br><div align='right'><h3>" + CONTEXT.AppName + "</h3></div>");
            //doc.write("<footer> <h2 align='center'></h2></footer><div align='center'><p>&copy; 2017 <a href='http://www.wototech.com'>www.wototech.com</a><p></div></body></html>");

            doc.close();
            r.focus();
            r.print();
        }
    });

}
