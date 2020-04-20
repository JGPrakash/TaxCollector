/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.accountsReportPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.accaccountService = new AccAccountService();
        page.companyService = new CompanyService();
        page.busService = new BusinessService();

        page.accountGroupAPI = new AccountGroupAPI();
        page.accountAPI = new AccountAPI();
        page.accountReportAPI = new AccountReportAPI();
        document.title = "ShopOn - Accounts Report";
        page.events.page_load = function () {

            $("#pnlTransaction").hide();
            $$("msgPanel").show("Loading...");
            //page.accaccountService.getAccountGroup(function (data) {
            page.accountGroupAPI.searchValues("","","","",function(data){
                $$("ddlAccountGroup").dataBind(data, "acc_group_id", "acc_group_name", "All");
                //page.accaccountService.getAccountbyGroup("", function (data) {
                page.accountAPI.searchValues("","","","",function(data){
                    $$("ddlAccountName").dataBind(data, "acc_id", "acc_name", "All");
                    $$("msgPanel").hide();
                });
            });
            
            $$("ddlAccountGroup").selectionChange(function () {
                if ($$("ddlAccountGroup").selectedValue() != "All") {
                    $$("msgPanel").show("Loading...");
                    //var data = {
                    //    acc_group_id: $$("ddlAccountGroup").selectedValue(),
                    //}
                    //page.accaccountService.getAccountbyGroup(data, function (data) {
                    page.accountAPI.searchValues("", "", "acc_group_id=" + $$("ddlAccountGroup").selectedValue(), "", function (data) {
                        $$("ddlAccountName").dataBind(data, "acc_id", "acc_name", "All");
                        $$("msgPanel").hide();
                    });
                }
                else {
                    //page.accaccountService.getAccountbyGroup("", function (data) {
                    page.accountAPI.searchValues("", "", "", "", function (data) {
                        $$("msgPanel").show("Loading...");
                        $$("ddlAccountName").dataBind(data, "acc_id", "acc_name", "All");
                        $$("msgPanel").hide();
                    });
                }

            })
        };
        page.events.btnPrint_click = function () {
            page.controls.pnlPrintingPopup.open();
            page.controls.pnlPrintingPopup.title("Report Type");
            page.controls.pnlPrintingPopup.width(500);
            page.controls.pnlPrintingPopup.height(200);
        }
        page.events.btnPrintJasperBill_click = function () {
            var Items = [];
            $(page.controls.grdAccountsTrans.allData()).each(function (i, data) {
                Items.push({
                    "Date": data.trans_date,
                    "Description": data.description,
                    "Type": data.trans_type,
                    "Amount": data.amount,
                    "BillNo": data.key_1,
                    "acc_name": data.acc_name,
                    "sub_total": data.subtotal,
                    "custorVend": data.key_2,
                    
                });
            });
            var accountInfo = {

                "CompName": CONTEXT.COMPANY_NAME,
                "ReportName": "Accounts Report",
                "CompanyAdd1": CONTEXT.COMPANY_ADDRESS_LINE1,
                "CompanyAdd2": CONTEXT.COMPANY_ADDRESS_LINE2,
                "Details": Items
               
            };
            GeneratePrint(CONTEXT.JASPER_COMPANY_NAME, "AccountsReport/accounts-report-main-report.jrxml", accountInfo, $$("ddlExportType").selectedValue());
        }
        page.events.btnView_click = function () {
            $("#pnlTransaction").show();
            $$("msgPanel").show("Loading...");
            var reportData = {
                acc_id: $$("ddlAccountName").selectedValue(),
                key_1:$$("txtKey1").val(),
                key_2:$$("txtKey2").val(),
                acc_group_id: $$("ddlAccountGroup").selectedValue(),
                fromDate: $$("dsFromDate").getDate(),
                toDate: $$("dsToDate").getDate(),
                trans_type: $$("ddlTypeFilter").selectedValue(),
                comp_id: localStorage.getItem("user_finfacts_comp_id")
            }
            $$("grdAccountsTrans").width("100%");
            $$("grdAccountsTrans").height("400px");
            $$("grdAccountsTrans").setTemplate({
                selection: "Single", paging: true, pageSize: 100,
                columns: [
                    
                    { 'name': "", 'width': "100%", 'dataField': "group_sub_total" },
                    { 'name': "", 'width': "100%", 'dataField': "group_acc_name" },
                    { 'name': "", 'width': "0px", 'dataField': "trans_id" },
                    { 'name': "Date", 'width': "120px", 'dataField': "trans_date" },
                    { 'name': "", 'width': "0px", 'dataField': "acc_name" },
                    { 'name': "Description", 'width': "210px", 'dataField': "description" },
                    { 'name': "Type", 'width': "130px", 'dataField': "trans_type" },
                    { 'name': "Amount", 'width': "130px", 'dataField': "amount" },
                    { 'name': "Bill No", 'width': "130px", 'dataField': "key_1" },
                    { 'name': "Customer/Vendor No", 'width': "180px", 'dataField': "key_2" },
                    { 'name': "", 'width': "0px", 'dataField': "balance" },
                    { 'name': "", 'width': "100%", 'dataField': "group_last_sub_total" },
                
                ]
            });
            $$("grdAccountsTrans").dataBind([]);
            $$("lblTotal").value(0);
            var tot_amount = 0;
            var sub_tot_amount = 0;
            var lastAcntNo = "";
            var lastAcntNoForSubtot = "";
            var rowIndex = 0;
            $$("grdAccountsTrans").rowBound = function (row, item) {
                rowIndex = parseInt(rowIndex)+1;
                row.find("[datafield=group_acc_name]").css("font-weight", "bold");
                row.find("[datafield=group_acc_name]").css("font-size", "24px");
                row.find("[datafield=group_acc_name]").css("text-align", "center");
                row.find("[datafield=group_acc_name]").css("color", "red");

                row.find("[datafield=group_sub_total]").css("text-align", "justify");
                row.find("[datafield=group_sub_total]").css("font-size", "24px");
                row.find("[datafield=group_sub_total]").css("font-weight", "bold");
                row.find("[datafield=group_sub_total]").css("color", "white");
                row.find("[datafield=group_sub_total]").css("background", "rgb(55, 185, 46)");


                
                if (lastAcntNoForSubtot == "") {
                    lastAcntNoForSubtot = item.acc_id;
                }
                if (lastAcntNoForSubtot == item.acc_id) {
                    if (item.trans_type == "Debit") {
                        var amount = row.find("[datafield=amount]").find("div").html();
                        sub_tot_amount = parseFloat(sub_tot_amount) + parseFloat(amount);
                        item.subtotal = sub_tot_amount;
                    }
                    else if (item.trans_type == "Credit") {
                        var amount = row.find("[datafield=amount]").find("div").html();
                        sub_tot_amount = parseFloat(sub_tot_amount) - parseFloat(amount);
                        item.subtotal = sub_tot_amount;
                    }
                }

                else {
                    row.find("[datafield=group_sub_total]").html("Sub Total : " + sub_tot_amount);
                    item.subtotal = sub_tot_amount;
                    sub_tot_amount = 0;
                    if (item.trans_type == "Debit") {
                        var amount = row.find("[datafield=amount]").find("div").html();
                        sub_tot_amount = parseFloat(sub_tot_amount) + parseFloat(amount);
                        item.subtotal = sub_tot_amount;
                    }
                    else if (item.trans_type == "Credit") {
                        var amount = row.find("[datafield=amount]").find("div").html();
                        sub_tot_amount = parseFloat(sub_tot_amount) - parseFloat(amount);
                        item.subtotal = sub_tot_amount;
                    }
                }
                if (item.trans_type == "Debit") {
                        var amount = row.find("[datafield=amount]").find("div").html();
                        tot_amount = parseFloat(parseFloat(tot_amount) + parseFloat(amount)).toFixed(2);
                }
                else if (item.trans_type == "Credit") {
                    var amount = row.find("[datafield=amount]").find("div").html();
                    tot_amount = parseFloat(parseFloat(tot_amount) - parseFloat(amount)).toFixed(2);
                }
                if (lastAcntNo != item.acc_id) {
                    row.find("[datafield=group_acc_name]").html(item.acc_name + "_" + item.acc_id );
                }
                if (rowIndex >= page.dataLength) {
                    row.find("[datafield=group_last_sub_total]").css("text-align", "justify");
                    row.find("[datafield=group_last_sub_total]").css("font-size", "24px");
                    row.find("[datafield=group_last_sub_total]").css("font-weight", "bold");
                    row.find("[datafield=group_last_sub_total]").css("background", "#dc6868");
                    row.find("[datafield=group_last_sub_total]").css("color", "white");
                    row.find("[datafield=group_last_sub_total]").css("background", "rgb(55, 185, 46)");
                    //row.find("[datafield=group_sub_total]").css("width", "0");
                        row.find("[datafield=group_last_sub_total]").html("Sub Total : " + sub_tot_amount);
                        //row.find("[datafield=group_sub_total]").html("Sub Total : " + sub_tot_amount);
                        item.subtotal = sub_tot_amount;
                        sub_tot_amount = 0;
                        if (item.trans_type == "Debit") {
                            var amount = row.find("[datafield=amount]").find("div").html();
                            sub_tot_amount = parseFloat(sub_tot_amount) + parseFloat(amount);
                            item.subtotal = sub_tot_amount;
                        }
                        else if (item.trans_type == "Credit") {
                            var amount = row.find("[datafield=amount]").find("div").html();
                            sub_tot_amount = parseFloat(sub_tot_amount) - parseFloat(amount);
                            item.subtotal = sub_tot_amount;
                        }


                }
                $$("lblTotal").value(tot_amount);
                lastAcntNo = item.acc_id;
                lastAcntNoForSubtot = item.acc_id;
            }
            //page.accaccountService.getAccountReport(reportData, function (data) {
            page.accountReportAPI.accountReportAPI(reportData, function (data) {
                page.dataLength = data.length;
                $$("grdAccountsTrans").dataBind(data);
                $$("msgPanel").hide();
            });
        }

    });
};

