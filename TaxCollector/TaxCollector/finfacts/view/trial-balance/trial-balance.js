/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.triaBalance = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.revenueService = new RevenueService();
        page.accountService = new AccountingService();
        page.userService = new UserService();
        page.companyService = new CompanyService();

        document.title = "ShopOn - Trial Balance";

        page.events.btnMoveClosing_click = function () {
            //updatw with key_1=0  and key_2=0. Dont move income and expense and sales purchase to next year
            var data = [];
            $($$("grdTrialBalance").allData()).each(function (i, items) {
                data.push({
                    //acc_group_id: items.acc_group_id,
                    //acc_group_name: items.acc_group_name,
                    //acc_id: items.acc_id,
                    //acc_name: items.acc_name,
                    //closing_balance: items.closing_balance_1,
                    //opening_balance: items.opening_balance_1,
                    //per_id: items.per_id_1,
                    //closing_period: $$("ddlPeriod1").selectedValue(),
                    //opening_period: $$("ddlPeriod2").selectedValue(),
                    per_id: $$("ddlPeriod2").selectedValue(),
                    jrn_date: $.datepicker.formatDate("dd-mm-yy", new Date()),
                    description: items.acc_group_name,
                    key_1: 0,
                    key_2: 0,
                    amount: items.closing_balance_1,
                    acc_id: items.acc_id,
                    acc_group_id: items.acc_group_id,
                });
                //page.revenueService.getMovingBalance(data, function (data1) {
                //    //if (data1.length == 0) {
                //    //    page.revenueService.insertMovingBalance(data, function (data1) {
                //    //        alert("Moving Successfully");
                //    //    })
                //    //}
                //    //else {
                //    //    data.jrn_id = data1[0].jrn_id;
                //    //    page.revenueService.updateMovingBalance(data, function (data1) {
                //    //        alert("Moving Successfully");
                //    //    })
                //    //}
                //})
            });
            page.revenueService.getAllMovingBalance(0,data, function (data1) {
                alert("Success");
            })
        }
        page.events.page_load = function () {

            page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                $$("ddlCompanyName").dataBind(data, "comp_id", "comp_name", "Select");

                $$("msgPanel").hide();
            });

            $$("ddlCompanyName").selectionChange(function () {
                $$("msgPanel").show("Loading period for company...");
                page.revenueService.getPeriod($$("ddlCompanyName").selectedValue(), function (data) {
                    $$("ddlPeriod1").dataBind(data, "per_id", "per_name", "Select");
                    $$("msgPanel").hide();
                });
            });

            $$("ddlPeriod1").selectionChange(function () {
                var val = $$("ddlPeriod1").selectedValue();
                var push = [];
                page.revenueService.getPeriod($$("ddlCompanyName").selectedValue(), function (data) {
                    $(data).each(function (i, items) {
                        if (items.per_id > val) {
                            push.push({
                                per_id: items.per_id,
                                per_name: items.per_name,
                            })
                        }
                    })
                    $$("ddlPeriod2").dataBind(push, "per_id", "per_name", "Select");
                });
                
            });

            $$("ddlPeriod2").selectionChange(function () {

                $$("grdTrialBalance").setTemplate({
                    Selection: "Single",
                    columns: [
                        { 'name': "Accounts", 'width': "15%", 'dataField': "acc_name" },
                        { 'name': $$("ddlPeriod1").selectedValue() + "Opening", 'width': "25%", 'dataField': "opening_balance_1" },
                        { 'name': $$("ddlPeriod1").selectedValue() + "Closing", 'width': "15%", 'dataField': "closing_balance_1" },
                        { 'name': $$("ddlPeriod2").selectedValue() + "Opening", 'width': "15%", 'dataField': "opening_balance_2" },
                        { 'name': $$("ddlPeriod2").selectedValue() + "Closing", 'width': "15%", 'dataField': "closing_balance_2" },
                    ]
                });

                page.revenueService.getTrialBalance($$("ddlPeriod1").selectedValue(), $$("ddlPeriod2").selectedValue(), function (data) {
                    var newObject = {};
                    $(data).each(function (i, item) {

                        if (item.acc_group_id == "20" || item.acc_group_id == "19" || item.acc_group_id == "4" || item.acc_group_id == "10" || item.acc_group_id == "18" || item.acc_group_id == "9" || item.acc_group_id == "11" || item.acc_group_id == "12" || item.acc_group_id == "14" || item.acc_group_id == "17" || item.acc_group_id == "8") {
                            if (typeof (newObject[item.acc_id]) == "undefined")
                                newObject[item.acc_id] = { acc_id: item.acc_id, acc_name: item.acc_name, acc_group_id: item.acc_group_id, acc_group_name: item.acc_group_name };
                            if (item.per_id == $$("ddlPeriod1").selectedValue()) {
                                newObject[item.acc_id].per_id_1 = item.per_id;
                                newObject[item.acc_id].opening_balance_1 = item.opening_balance;
                                newObject[item.acc_id].closing_balance_1 = item.closing_balance;
                            }
                            if (item.per_id == $$("ddlPeriod2").selectedValue()) {
                                newObject[item.acc_id].per_id_2 = item.per_id;
                                newObject[item.acc_id].opening_balance_2 = item.opening_balance;
                                newObject[item.acc_id].closing_balance_2 = item.closing_balance;
                            }
                        }
                    });

                    var newArray = [];
                    for (var prop in newObject)
                        newArray.push(newObject[prop]);


                    $$("grdTrialBalance").dataBind(newArray);
                });

                
            });
        };
      
      
    });
};