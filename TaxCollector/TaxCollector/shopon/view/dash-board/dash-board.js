/// <reference path="../sales-pos/sales-pos.html" />

$.fn.dashBoard = function () {
    return $.pageController.getControl(this, function (page,$$) {
        //Import Services required
        page.salesService = new SalesService();
        page.purchaseService = new PurchaseService();
        page.revenueService = new RevenueService();
        page.dashBoardService = new DashBoardService();
        page.dashBoardAPI = new DashBoardAPI();
        page.userpermissionAPI = new UserPermissionAPI();
        page.accAccountService = new AccAccountService();
        page.revenueService = new RevenueService();
        document.title = "ShopOn - Dashboard";
        var menu_ids = [];
        var reg_ids = [];
        var user_ids = [];
        loadDashBoard = function (data) {
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
                    comp_id: localStorage.getItem("user_company_id"),
                    per_id: CONTEXT.FINFACTS_CURRENT_PERIOD,
                    store_no: menu_ids.join(",")
                }
                page.dashBoardAPI.postValue(data, function (data) {
                    var string = "",last_user_no;
                    $(data).each(function (i, item) {
                        if (item.keyvalue == "Expense" && item.ver_no == "1") {
                            $$("lblExpenseYear").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "Revenue" && item.ver_no == "1") {
                            $$("lblRevenueYear").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "Income" && item.ver_no == "1") {
                            $$("lblOtherIncomeYear").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "CostOfGoods" && item.ver_no == "1") {
                            $$("lblCostOfGoodsYear").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "Profit" && item.ver_no == "1") {
                            $$("lblProfitYear").value("&#8377; " + item.amount);
                        }

                        if (item.keyvalue == "Expense" && item.ver_no == "2") {
                            $$("lblExpenseToday").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "Revenue" && item.ver_no == "2") {
                            $$("lblRevenueToday").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "Income" && item.ver_no == "2") {
                            $$("lblOtherIncomeToday").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "CostOfGoods" && item.ver_no == "2") {
                            $$("lblCostOfGoodsToday").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "Profit" && item.ver_no == "2") {
                            $$("lblProfitToday").value("&#8377; " + item.amount);
                        }
                        if (item.keyvalue == "OpeningCash" && item.ver_no == "3") {
                            item.amount = -parseFloat(item.amount);
                            $$("lblOpeningCash").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "ClosingCash" && item.ver_no == "3") {
                            item.amount = -parseFloat(item.amount);
                            $$("lblClosingCash").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "OpeningBank" && item.ver_no == "3") {
                            item.amount = -parseFloat(item.amount);
                            $$("lblOpeningBank").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "ClosingBank" && item.ver_no == "3") {
                            item.amount = -parseFloat(item.amount);
                            $$("lblClosingBank").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "CurrentAssert" && item.ver_no == "3") {
                            item.amount = -parseFloat(item.amount);
                            $$("lblAmountReceivable").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "CurrentLiablities" && item.ver_no == "3") {
                            //item.amount = -parseFloat(item.amount);
                            $$("lblAmountPayable").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "TotalPurchase" && item.ver_no == "3") {
                            item.amount = -parseFloat(item.amount);
                            $$("lblPurchaseYear").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "TodaySale" && item.ver_no == "4") {
                            $$("lblTodayRevenue").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "WeekSale" && item.ver_no == "4") {
                            $$("lblWeekRevenue").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "MonthSale" && item.ver_no == "4") {
                            $$("lblMonthRevenue").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "TodayPurchase" && item.ver_no == "4") {
                            $$("lblTodayPurchase").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "WeekPurchase" && item.ver_no == "4") {
                            $$("lblWeekPurchase").value(("&#8377; " + item.amount));
                        }
                        if (item.keyvalue == "MonthPurchase" && item.ver_no == "4") {
                            $$("lblMonthPurchase").value(("&#8377; " + item.amount));
                        }
                        
                        if (item.ver_no == "5") {
                            if (last_user_no != item.keyvalue) {
                                item.keyvalue = (item.keyvalue == null) ? "No User" : item.keyvalue;
                                string = string + "<div class='col-xs-12 col-sm-3'><div class='card'><div class='card-block'><div class='col-xs-12 col-sm-4'><img src='Images/sales-dashboard.png' style='width:100px;' /></div><div class='col-xs-12 col-sm-8'><div class='div-head'>" + item.keyvalue + "</div><div class='div-body'>" + item.amount + "</div></div></div></div></div>";
                                $$("lblGrdUser").html(string);
                                last_user_no = item.keyvalue;
                            }
                        }

                        if (item.keyvalue == "outOfStock" && item.ver_no == "6") {
                            $$("lblOutOfStock").value("Qty : " + item.amount);
                        }
                        if (item.keyvalue == "reorderLevel" && item.ver_no == "6") {
                            $$("lblBelowReorderLevel").value("Qty : " + item.amount);
                        }
                        if (item.keyvalue == "oldItems" && item.ver_no == "6") {
                            $$("lblOldItems").value("Qty : " + item.amount);
                        }
                    });
                });
            });
            
            
            /*
            var date = new Date();

            var finfacts_data = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =10 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            var month = (date.getMonth() + 1);
            month = (month.toString().length == 1) ? "0" + month : month;
            finfacts_data = finfacts_data + " and date(trans_date) < '" + date.getFullYear() + "-" + month +"-"+date.getDate()+ "'";
            page.accAccountService.searchValues(0, "", finfacts_data, "", function (data) {
                data[0].balance = -data[0].balance;
                $$("lblOpeningCash").value(("&#8377; " + data[0].balance));
            });

            var finData = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =10 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            page.accAccountService.searchValues(0, "", finData, "", function (data) {
                data[0].balance  = - data[0].balance;
                $$("lblClosingCash").value(("&#8377; " + data[0].balance));
            });

            var purFinData = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =4 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            purFinData = purFinData + " and date(trans_date) < '" + date.getFullYear() + "-" + month + "-" + date.getDate() + "'";
            page.accAccountService.searchValues(0, "", purFinData, "", function (data) {
                data[0].balance = -data[0].balance;
                $$("lblOpeningBank").value(("&#8377; " + data[0].balance));
            });

            var purData = "acc_id in (SELECT acc_id FROM acc_account_t where acc_group_id =4 and comp_id=" + localStorage.getItem("user_company_id") + ") and jrn_id in (select jrn_id from acc_journal_t where per_id in (" + CONTEXT.FINFACTS_CURRENT_PERIOD + "))";
            page.accAccountService.searchValues(0, "", purData, "", function (data) {
                data[0].balance = -data[0].balance;
                $$("lblClosingBank").value(("&#8377; " + data[0].balance));
            });

            page.revenueService.getCurrentAssetsAccount(CONTEXT.FINFACTS_CURRENT_PERIOD, function (data) {
                $(data).each(function (i, item) {
                    if (item.acc_group_id == "20") {
                        item.amount = -item.amount;
                        $$("lblAmountReceivable").value(("&#8377; " + item.amount));
                    }
                });
            });
            page.revenueService.getCurrentLiabilities(CONTEXT.FINFACTS_CURRENT_PERIOD, function (data) {
                $$("lblAmountPayable").value(("&#8377; " + data[0].amount));
            });*/

        }
        page.events = {

            page_load: function () {
                //$(document).ready(function () {
                    
                //});
                //var previlageData = {
                //    obj_type: "Product::CompProd::Store",
                //    obj_id: localStorage.getItem("prod_id"),
                //};
                //page.userpermissionAPI.getValue(previlageData, function (store_data) {
                //    $(store_data).each(function (i, item) {
                //        item.obj_id = item.obj_id.split("::")[2];
                //        menu_ids.push(item.obj_id);
                //    });
                //});
                //    var data = {
                //        start_record: 0,
                //        end_record: "",
                //        filter_expression: "store_no=" + localStorage.getItem("user_store_no"),
                //        sort_expression: ""
                //    }
                //    page.registerAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //        $(data).each(function (i, item) {
                //            reg_ids.push(item.reg_no);
                //        });
                //        $(CONTEXT.USERIDACCESS).each(function (i, item) {
                //            user_ids.push(item.user_id);
                //        });
                //        page.events.btnRefresh_click();
                //    });
                //});
                page.events.btnRefresh_click();

                //page.controls.grdUserSales.width("100%");
                //page.controls.grdUserSales.setTemplate({
                //    selection: "Single",
                //    columns: [
                //            { 'name': "User Name", 'width': "150px", 'dataField': "user_name" },
                //            { 'name': "Bills", 'width': "120px", 'dataField': "total" },
                //            { 'name': "Amount", 'width': "160px", 'dataField': "amount" },
                //    ]
                //});
                //$$("grdUserSales").dataBind([]);
            }
        }
        page.events.btnRefresh_click =function () {
            
            loadDashBoard();

            /*
            page.salesService.getTotalSalesDashBoard(function (data) {
                $(data).each(function (i, item) {
                    if (item.keyvalue == "TodaySale") {
                        item.amount = (item.amount == null || item.amount == "" || typeof item.amount == "undefined") ? "0.00" : item.amount;
                        $$("lblTodayRevenue").value("&#8377; " + item.amount);
                    }
                    if (item.keyvalue == "WeekSale")
                        $$("lblWeekRevenue").value("&#8377; " + item.amount);
                    if (item.keyvalue == "MonthSale")
                        $$("lblMonthRevenue").value("&#8377; " + item.amount);
                    if (item.keyvalue == "TodayPurchase")
                        $$("lblTodayPurchase").value("&#8377; " + item.amount);
                    if (item.keyvalue == "WeekPurchase")
                        $$("lblWeekPurchase").value("&#8377; " + item.amount);
                    if (item.keyvalue == "MonthPurchase")
                        $$("lblMonthPurchase").value("&#8377; " + item.amount);
                });
            });
            page.dashBoardService.getUserBills(function (data) {
                var string = "";
                $(data).each(function (i, item) {
                    item.user_name = (item.user_name == null) ? "No User" : item.user_name;
                    string = string + "<div class='col-xs-12 col-sm-3'><div class='card'><div class='card-block'><div class='col-xs-12 col-sm-4'><img src='Images/sales-dashboard.png' style='width:100px;' /></div><div class='col-xs-12 col-sm-8'><div class='div-head'>" + item.user_name + "</div><div class='div-head'>" + item.amount + " (" + item.total + ")</div></div></div></div></div>";
                });
                $$("lblGrdUser").html(string);
            });
            var previlageData = {
                obj_type: "Product::CompProd::Store",
                obj_id: localStorage.getItem("prod_id"),
            };
            page.userpermissionAPI.getValue(previlageData, function (store_data) {
                $(store_data).each(function (i, item) {
                    item.obj_id = item.obj_id.split("::")[2];
                    menu_ids.push(item.obj_id);
                });
                page.dashBoardAPI.getStockDashboard(menu_ids.join(","), function (data) {
                    $(data).each(function (i, item) {
                        if (item.key1 == "outOfStock")
                            $$("lblOutOfStock").value("Qty : " + item.value1);
                        if (item.key1 == "reorderLevel")
                            $$("lblBelowReorderLevel").value("Qty : " + item.value1);
                        if (item.key1 == "oldItems")
                            $$("lblOldItems").value("Qty : " + item.value1);
                    });
                });
            });
            */
        }
    });



}
