$.fn.dueReport = function () {
    return $.pageController.getPage(this, function (page, $$) {
        //   page.memberService = new MemberService();
        //  page.paymentService = new PaymentService();
        //page.userService = new UserService();
        page.customerService = new CustomerService();
        page.itemService = new ItemService();
        page.dynaReportService = new DynaReportService();
        page.purchaseService = new PurchaseService();
        page.reportService = new ReportService();
        page.billService = new BillService();

        page.reportAPI = new ReportAPI();
        page.customerAPI = new CustomerAPI();
        page.storeAPI = new StoreAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        var menu_ids = [];
        document.title = "ShopOn - Due Report";
        page.events = {
            btnGenerate_click: function () {
                $$("lblTotalDue").value(0);
                $$("lblTotalDuePayment").value(0);
                $$("lblTotalDuePending").value(0);
                var filter = {};

                filter.viewMode = $$("ddlViewMode").selectedData().view_name;
                filter.fromDate = ($$("txtStartDate").getDate()=="") ? "" : dbDate($$("txtStartDate").getDate());
                filter.toDate = ($$("txtEndDate").getDate()=="") ? "" : dbDate($$("txtEndDate").getDate());
                filter.cust_no = $$("ddlCustomer").selectedValue() == -1 ? "" : $$("ddlCustomer").selectedValue();
                filter.bill_type = $$("ddlBillType").selectedValue() == "All" ? "" : $$("ddlBillType").selectedValue();
                filter.status = $$("ddlState").selectedValue() == "All" ? "" : $$("ddlState").selectedValue();
                filter.store_no = $$("ddlStore").selectedValue() == "All" || $$("ddlStore").selectedValue() == "-1" ? menu_ids.join(",") : $$("ddlStore").selectedValue(),
                filter.comp_id = localStorage.getItem("user_company_id");
                filter.report_filter = $$("ddlReportFilter").selectedValue();
                filter.tax = $$("ddlTax").selectedValue();
                $$("msgPanel").show("Loading...!");
                //page.dynaReportService.getDueReport(filter, function (data) {
                page.reportAPI.dueReport(filter, function (data) {
                    $$("grdTransactions").height("400px");
                    $$("grdTransactions").width("100%");
                    if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                        $$("grdTransactions").setTemplate({
                            selection: "Single", paging: true, pageSize: 100,
                            columns: [
                                { 'name': "", 'width': "0px", 'dataField': "bill_no",visible:false },
                                { 'name': "Bill No", 'rlabel': 'Bill No', 'width': "70px", 'dataField': "bill_id" },
                                { 'name': "Bill Date", 'rlabel': 'Bill Date', 'width': "90px", 'dataField': "bill_date" },
                                { 'name': "Amount", 'rlabel': 'Amount', 'width': "90px", 'dataField': "total" },
                                { 'name': "Paid", 'rlabel': 'Paid Amt', 'width': "90px", 'dataField': "paid" },
                                { 'name': "Balance", 'rlabel': 'Balance', 'width': "90px", 'dataField': "balance" },
                                { 'name': "Customer", 'rlabel': 'Customer', 'width': "90px", 'dataField': "cust_name" },
                                { 'name': "Mobile No", 'rlabel': 'Mobile No', 'width': "90px", 'dataField': "mobile_no" },
                                { 'name': "Address", 'rlabel': 'Address', 'width': "90px", 'dataField': "cust_address" },
                                { 'name': "Sch Id", 'rlabel': 'Sch Id', 'width': "90px", 'dataField': "temp_schedule_id", visible: $$("ddlReportFilter").selectedValue() != "2" },
                                { 'name': "Sch Date", 'rlabel': 'Sch Date', 'width': "90px", 'dataField': "schedule_date", visible: $$("ddlReportFilter").selectedValue() != "2" },
                                { 'name': "Due Date", 'rlabel': 'Due Date', 'width': "90px", 'dataField': "due_date", visible: $$("ddlReportFilter").selectedValue() != "2" },
                                
                                { 'name': "Status", 'rlabel': 'Status', 'width': "90px", 'dataField': "status" },
                            ]
                        });
                        var totalDueAmount = 0;
                        var totalDuePayment = 0;
                        var totalDuePending = 0;
                        $$("grdTransactions").rowBound = function (row, item) {
                            //if (item.status == "Open") {
                                totalDuePending = parseFloat(totalDuePending) + parseFloat(item.balance);
                           // }
                            //if (item.status == "Paid") {
                                totalDuePayment = parseFloat(totalDuePayment) + parseFloat(item.paid);
                           // }
                            totalDueAmount = parseFloat(totalDueAmount) + parseFloat(item.balance) + parseFloat(item.paid);
                            $$("lblTotalDue").value(parseFloat(totalDueAmount).toFixed(2));
                            $$("lblTotalDuePayment").value(parseFloat(totalDuePayment).toFixed(2));
                            $$("lblTotalDuePending").value(parseFloat(totalDuePending).toFixed(2));
                        }
                        $$("grdTransactions").dataBind([]);
                        $(data).each(function (i, item) {
                            var data1 = {
                                bill_id:item.bill_id,
                                bill_no: item.bill_no,
                                bill_date: item.bill_date,
                                total: item.total,
                                paid: item.paid,
                                balance: item.balance,
                                cust_name: item.cust_name,
                                mobile_no: item.mobile_no,
                                cust_address: item.cust_address,
                                temp_schedule_id: item.temp_schedule_id,
                                schedule_date: item.schedule_date,
                                due_date: item.due_date,
                                status: item.status
                            }
                            $$("grdTransactions").createRow(data1);
                        })
                        $$("msgPanel").hide();
                    }
                });
                if ($$("ddlReportFilter").selectedValue() != "2") {
                    $$("pnlSummary").show();
                }
                else{
                    $$("pnlSummary").hide();
                }
            },
            btnPrintSalesReport_click: function () {
                page.itemService.getItemStockByItemNo(page.item_no, function (data) {
                    PrintData(data);
                });

            },
            page_load: function () {
                var filterViewData = [];
                filterViewData.push({ view_no: "1", view_name: "Standard" })
                
                $$("ddlViewMode").dataBind(filterViewData, "view_no", "view_name");

                //page.customerService.getActiveCustomer("", function (data) {
                page.customerAPI.searchValues("", "", "cus_active=1", "", function (data) {
                    $$("ddlCustomer").dataBind(data, "cust_no", "cust_name", "");
                });
                var previlageData = {
                    obj_type: "Product::CompProd::Store",
                    obj_id: localStorage.getItem("prod_id"),
                };
                page.userpermissionAPI.getValue(previlageData, function (store_data) {
                    $(store_data).each(function (i, item) {
                        if (item.obj_id.startsWith("6"))
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
                var searchViewData = [];
                if (CONTEXT.ENABLE_EMI_PAYMENT) {
                    searchViewData.push({ view_no: "1", view_name: "EMI" });
                }
                if (CONTEXT.ENABLE_SUBSCRIPTION) {
                    searchViewData.push({ view_no: "2", view_name: "Subscription" });
                }
                $$("ddlReportFilter").dataBind(searchViewData, "view_no", "view_name");
                $$("pnlSummary").hide();
                $$("pnlTax").hide();
                $$("ddlReportFilter").selectionChange(function () {
                    if ($$("ddlReportFilter").selectedValue() == "2") {
                        $$("pnlTax").show();
                    }
                    else {
                        $$("pnlTax").hide();
                    }
                })
            }

        }
        
        
        page.events.btnReport_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.rlabel("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(200);
            //PrintDataPR(0);
        }
        page.events.btnPrintJasperBill_click = function () {
            jasperReport();
            //PrintTestDueJasper();
        }
        function jasperReport() {
            var detail_list = [];
            var detail = page.controls.grdTransactions.allData();
            if ($$("ddlViewMode").selectedData().view_name == "Standard") {
                $(detail).each(function (i, item) {
                    detail_list.push({
                        //"Bill No": (item.bill_no == null) ? "" : item.bill_no,
                        "Bill No": (item.bill_id == null) ? "" : item.bill_id,
                        "Bill Date": (item.bill_date == null) ? "" : item.bill_date,
                        "Total": (item.total == null) ? "" : item.total,
                        "Paid": (item.paid == null) ? "" : item.paid,
                        "Cust Name": (item.cust_name == null) ? "" : item.cust_name,
                        "Mobile No": (item.mobile_no == null) ? "" : item.mobile_no,
                        "Address": (item.cust_address == null) ? "" : item.cust_address,
                        "Sch Id": (item.schedule_id == null) ? "" : item.schedule_id,
                        "Sch Date": (item.schedule_date == null) ? "" : item.schedule_date,
                        "Due Date": (item.due_date == null) ? "" : item.due_date,
                        "Amount": (item.amount == null) ? "" : item.amount,
                        "Status": (item.status == null) ? "" : item.status
                    });
                });
                var accountInfo =
                {
                    "CompName": CONTEXT.COMPANY_NAME,
                    "CompanyAddress": CONTEXT.COMPANY_ADDRESS_LINE1 + "" + CONTEXT.COMPANY_ADDRESS_LINE2,
                    "ReportName": "Due Report",
                    "Details": detail_list
                };
                GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report/main-due-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
            }

        }
        function PrintTestDueJasper() {
            var accountInfo =
            {
                "CompName": "Shop On Dev",
                "CompanyAddress": "NO.102G/32/4 POLPETTAI",
                "ReportName": "Due Report",
                "Details": [
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  },
                  {
                      "Bill No": "6",
                      "Bill Date": "10-10-2018",
                      "Total": "1000",
                      "Paid": "16800.00",
                      "Cust Name": "AJITH KUMAR",
                      "Mobile No": "8888888888",
                      "Address": "Tiruchendur",
                      "Sch Id": "1",
                      "Sch Date": "10-10-2018",
                      "Due Date": "10-10-2018",
                      "Amount": "1000",
                      "Status": "Delivered"
                  }
                ]
            };

            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "sales-report/main-due-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }
        
    });

}
