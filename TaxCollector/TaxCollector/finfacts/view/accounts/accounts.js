/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.accaccountPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.accaccountService = new AccAccountService();
        page.revenueService = new RevenueService();
        page.userService = new UserService();
        page.companyService = new CompanyService();
        page.acc_id = null;
        page.group_id = null;
        document.title = "ShopOn - Accounts";
        $("body").keydown(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 112) {
                e.preventDefault();
                page.events.btnNew_click();
            }
            if (keyCode == 113) {
                e.preventDefault();
                page.events.btnSave_click();
            }
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnDelete_click();
            }
        });

        page.events.btnNew_click = function () {
            var data = '';
             
             $$("pnlDetail").show();
             $$("pnlDetailTrans").show();
             
             $$("txtAccountName").val('');
             $$("txtAccountName").focus();
            $$("txtAccountNo").val('');
            $$("ddlGroups").selectedValue('');
            $$("grdTransactions").dataBind([]);
            $("#lblBalance").text('');
            page.acc_id=null;
        };

        page.events.page_load = function () {
              $$("pnlDetail").hide();
              $$("pnlDetailTrans").hide();
              $$("pnlDetailPanel").hide();
              $$("pnlSearch").hide();

              page.companyService.getCompanyById({ comp_id: localStorage.getItem("user_finfacts_comp_id") }, function (data) {
                //page.revenueService.getCompanyName(function (data) {
                //    page.userService.getMyFinfactsCompany(function (res) {
                //        var temp = [];
                //        $(data).each(function (i, item) {
                //            if (res[0].obj_id == item.comp_id) {
                //                temp.push({
                //                    comp_id: item.comp_id,
                //                    comp_name: item.comp_name
                //                })
                //            }
                //        })
                  $$("ddlCompanyName").dataBind(data, "comp_id", "comp_name", "Select");
                  //  });

               });
            $$("ddlCompanyName").selectionChange(function () {
                $$("msgPanel").show("Searching...");
                $$("pnlSearch").show();
                 $$("pnlDetailPanel").show();
                 $$("pnlDetailTrans").hide();
                 $$("pnlDetail").hide();
                page.comp_id = $$("ddlCompanyName").selectedValue();
                page.accaccountService.getAccountByIdName(page.comp_id, "",function (data) {
                    $$("grdAccaccountResult").dataBind(data);
                    $$("msgPanel").hide();
                });

            })
            page.accaccountService.getAccountGroup(function (data) {
                    $$("ddlGroups").dataBind(data, "acc_group_id", "acc_group_name");


             });
             $$("txtSearch").val('');
            $$("grdAccaccountResult").width("100%");
            $$("grdAccaccountResult").height("444px");
            $$("grdAccaccountResult").setTemplate({
                selection: "Single",
                columns: [
                    {'name': "Acc Id", 'width': "15%", 'dataField': "acc_id"},
                    {'name': "Account Name", 'width': "40%", 'dataField': "acc_name"},
                  
                    {'name': "Group", 'width': "30%", 'dataField': "acc_group_name"}
                ]
            });

            $$("grdAccaccountResult").selectionChanged = function (row, item) {
                page.acc_id = item.acc_id;
                page.group_id = item.acc_group_id;
                $$("dsSearchFromDate").setDate("today"),
                $$("dsSearchToDate").setDate("today"),


                $$("pnlDetail").show();
                 $$("pnlDetailTrans").show();

                $$("txtAccountName").value(item.acc_name);
                $$("txtAccountNo").value(item.acc_no);
                $$("ddlGroups").selectedValue(item.acc_group_id);
               
                page.events.btnSearchTransaction_click();
                //page.accaccountService.getTransactions(page.acc_id, function (data) {
                //    page.balance = 0;
                //    for (var i = data.length - 1; i >= 0; i--) {
                //        data[i].trans_date = data[i].trans_date.substring(0, 10);
                //        page.balance = parseInt(page.balance) + (data[i].trans_type == "Credit" ? parseInt(data[i].amount) : -parseInt(data[i].amount));
                //        data[i].balance = page.balance;
                //    }
                //    $$("lblBalance").value(-page.balance);
                //    $$("grdTransactions").dataBind(data);
                //});
            
            };
            $$("grdAccaccountResult").dataBind([]);

            $$("grdTransactions").width("100%");
            $$("grdTransactions").height("220px");
            if (window.mobile) {
                $$("grdTransactions").setTemplate({
                    Selection: "Single",
                    columns: [
                        { 'name': "Date", 'width': "25%", 'dataField': "trans_date" },
                        //{ 'name': "Description", 'width': "210px", 'dataField': "description" },
                        { 'name': "Type", 'width': "25%", 'dataField': "trans_type" },
                        { 'name': "Amount", 'width': "25%", 'dataField': "amount" },
                        //{ 'name': "Balance", 'width': "20%", 'dataField': "balance" }
                    ]
                });
            }
            else {
                $$("grdTransactions").setTemplate({
                    Selection: "Single",
                    columns: [
                        { 'name': "Date", 'width': "120px", 'dataField': "trans_date" },
                        { 'name': "Description", 'width': "210px", 'dataField': "description" },
                        { 'name': "Type", 'width': "130px", 'dataField': "trans_type" },
                        { 'name': "Amount", 'width': "130px", 'dataField': "amount" },
                        { 'name': "Balance", 'width': "130px", 'dataField': "balance" }
                    ]
                });
            }
            $$("grdTransactions").dataBind([]);
           
            $$("grdTransactions").rowBound = function (row, item) {
                //if (item.trans_type == "Debit") {
                //    row.find("[datafield=trans_type]").html("Credit");
                //    row.find("[datafield=balance]").html(-item.balance);
                //}
                //else {
                //    row.find("[datafield=trans_type]").html("Debit");
                //    row.find("[datafield=balance]").html(-item.balance);
                //}
            }
        };
               

       page.events.btnSave_click = function () {
           //$(".detail-info").progressBar("show")
           if ($$("ddlGroups").selectedValue()=='' || $$("ddlGroups").selectedValue()== null)
           {
               $$("msgPanel").show("Please select group...!");
           }
           else{
           $$("msgPanel").show("Inserting accounts...");
            if (page.acc_id == null || page.acc_id == '') {
                var data = {
                    comp_id:page.comp_id,
                acc_name: $$("txtAccountName").value(),
                acc_no: $$("txtAccountNo").value(),
                acc_group_id: $$("ddlGroups").selectedValue()
            

            };
            page.accaccountService.insertAccount(data, page.comp_id, function (data) {
                //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Record added successfully...!");
                var newData = {
                    comp_id: page.comp_id,
                    acc_id: data[0].key_value
                }
                //page.accaccountService.getAccountByIdName(page.comp_id,"", function (data) {
                page.accaccountService.getAccountByAccId(newData, function (data) {
                    $$("grdAccaccountResult").dataBind(data);
                    $$("msgPanel").hide();
                });
            });
            page.events.btnNew_click();
        }
        else  {
                //$(".detail-info").progressBar("show")
           $$("msgPanel").show("Updating accounts...");
                        var data = {
                            acc_id:page.acc_id,
                            acc_name: $$("txtAccountName").value(),
                            acc_no: $$("txtAccountNo").value(),
                            acc_group_id: $$("ddlGroups").selectedValue()
                      
            };
            page.accaccountService.updateAccount(data, function (data1) {
                 //$(".detail-info").progressBar("hide")
                 $$("msgPanel").show("Record updated successfully...!");
                 var newData = {
                     comp_id: page.comp_id,
                     acc_id: data.acc_id
                 }
                page.accaccountService.getAccountByAccId(newData, function (data) {
                    //$$("grdAccaccountResult").dataBind(data);
                    // Update the new data to Grid
                    $$("grdAccaccountResult").updateRow($$("grdAccaccountResult").selectedRowIds()[0], data[0]);
                    $$("grdAccaccountResult").selectedRows()[0].click();
                    $$("msgPanel").hide();
                });
            });
            page.events.btnNew_click();
        }
           }
    };
        page.events.btnDelete_click = function () {
            //$(".detail-info").progressBar("show")
           $$("msgPanel").show("Deleting accounts...");

            page.accaccountService.deleteAccount(page.acc_id, function () {
                 //$(".detail-info").progressBar("hide")
                $$("msgPanel").show("Selected record is deleted successfully...!");
                $$("msgPanel").show("Selected record is deleted successfully...!");
                page.accaccountService.getAccount(page.comp_id, function (data) {
                    $$("grdAccaccountResult").dataBind(data);
                    $$("msgPanel").hide();
                });
                page.events.btnNew_click();
            });

        };
        page.events.btnSearch_click = function () {
            $$("msgPanel").show("Searching...");
            page.accaccountService.getAccountByIdName(page.comp_id, $$("txtSearch").val(), function (data) {
                $$("grdAccaccountResult").dataBind(data);
                $$("msgPanel").hide();
                $$("pnlSearch").show();
                $$("pnlDetailPanel").show();
                $$("pnlDetailTrans").hide();
                $$("pnlDetail").hide();
            });
        };

        page.events.btnSearchTransaction_click = function () {
            $$("msgPanel").show("Searching...");
            var searchCriteria = {
                from_date:$$("dsSearchFromDate").getDate(),
                to_date: $$("dsSearchToDate").getDate(),
                description: $$("txtSearchDescription").value()
            };
           
            page.accaccountService.getTransactionsCount(page.acc_id,page.group_id, function (data) {
                //$$("lblBalance").value(Math.abs(data[0].balance));
                $$("lblBalance").value(data[0].balance);
            });
            page.accaccountService.getTransactions(page.acc_id,searchCriteria, function (data) {
                //page.balance = 0;
                //for (var i = data.length - 1; i >= 0; i--) {
                //    data[i].trans_date = data[i].trans_date.substring(0, 10);
                //    page.balance = parseInt(page.balance) + (data[i].trans_type == "Credit" ? parseInt(data[i].amount) : -parseInt(data[i].amount));
                //    data[i].balance = page.balance;
                //}
                //$$("lblBalance").value(-page.balance);
                $$("grdTransactions").dataBind(data);
                $$("msgPanel").hide();
            });
        };
        
    });
};

