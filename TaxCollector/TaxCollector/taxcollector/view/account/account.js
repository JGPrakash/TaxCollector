/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.accountPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        
        page.accountServiceAPI = new AccountServiceAPI();
        document.title = "TaxCollector - Account";
        page.id = null;
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
        
        page.events = {
            page_load: function () {
                page.view.selectedSearch([]);
                page.events.btnSearch_click();
            },
            btnSearch_click: function () {
                $(".detail-info").hide();
                $$("btnSave").hide();
                $$("btnDelete").hide();
                $$("msgPanel").show("Searching");
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(ifnull(no,''),ifnull(name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                    sort_expression: ""
                }
                page.accountServiceAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.view.selectedSearch(data);
                    $$("msgPanel").hide();
                });
            },
            btnNew_click: function () {
                //Show the panel
                $(".detail-info").show();
                //Show the Save button and hide delete button
                $$("btnSave").show();
                $$("btnDelete").hide();


                //Clear all textbox
                $$("txtName").value("");
                $$("txtBankName").value("");
                $$("txtAccountNo").value("");
                $$("txtIfscCode").value("");
                $$("txtNotes").value("");
                $$("txtName").focus();
                //Set the curent mainproduct no to null
                page.id = null;
            },
            btnSave_click: function () {
                try{
                    var data = {
                        name: $$("txtName").value(),
                        bank_name: $$("txtBankName").value(),
                        account_no: $$("txtAccountNo").value(),
                        ifsc_code: $$("txtIfscCode").value(),
                        notes: $$("txtNotes").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                    };
                    if (data.name == "" || data.name == null || typeof data.name == "undefined") {
                        $$("txtName").focus();
                        throw WEBUI.LANG[CONTEXT.CurrentLanguage]["Account name is mandatory ...!"];
                    }
                    if (data.account_no == "" || data.account_no == null || typeof data.account_no == "undefined") {
                        $$("txtAccountNo").focus();
                        throw WEBUI.LANG[CONTEXT.CurrentLanguage]["Account no is mandatory ...!"];
                    }
                    if (page.id == null || page.id == '') {
                        $$("msgPanel").show("Inserting new account...");
                        page.accountServiceAPI.postValue(data, function (data) {
                            $$("msgPanel").show("New Account saved successfully...!");
                            //Get the updated data
                            var data1 = {
                                id: data[0].key_value
                            }
                            page.accountServiceAPI.getValue(data1, function (data) {
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtName").focus();
                            });
                        });
                    }
                    else {
                        $$("msgPanel").show("Updating new account...");
                        data.id = page.id;
                        page.accountServiceAPI.putValue(data.id, data, function (data1) {
                            $$("msgPanel").show("Account updated successfully...!");
                            var data = {
                                id: page.id
                            }
                            page.accountServiceAPI.getValue(data, function (data) {
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtName").focus();
                            });
                        });
                    }
                    $$("btnDelete").show();
                }
                catch (e) {
                    alert(e);
                }
            },
            btnDelete_click: function () {
                if (page.id == null || page.id == '')
                    $$("msgPanel").show("Select a account first...!");
                else {
                    if (confirm(WEBUI.LANG[CONTEXT.CurrentLanguage]["Are You Sure Want To Remove This Account If You Delete This Account The Details Cannot Be Retrived"])) {
                        $$("msgPanel").show("Removing account...");
                        var data = {
                            id: page.id
                        }
                        page.accountServiceAPI.deleteValue(page.id, data, function (data) {
                            $$("msgPanel").show("Account removed successfully...!");
                            $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                            $(".detail-info").hide();
                            $$("btnSave").hide();
                            $$("btnDelete").hide();
                            $$("msgPanel").hide();
                            page.events.btnSearch_click();
                        });
                    }
                }
            },
        }

        page.view = {
            selectedSearch: function (data) {
                $$("txtSearchInput").focus();
                $$("grdSearchResult").width("100%");
                $$("grdSearchResult").height("350px");
                $$("grdSearchResult").setTemplate({
                    selection: "Single", paging: true, pageSize: 50,
                    columns: [
                        { 'name': "ID", 'rlabel': 'ID', 'width': "0px", 'dataField': "id",visible:false },
                        { 'name': "ID", 'rlabel': 'ID', 'width': "80px", 'dataField': "no" },
                        { 'name': "Main Product Name", 'rlabel': 'Name', 'width': "180px", 'dataField': "name" },
                    ]
                });
                $$("grdSearchResult").selectionChanged = function (row, item) {
                    $(".detail-info").show();
                    $$("btnSave").show();
                    $$("btnDelete").show();
                    page.id = item.id;
                    //Load the data
                    $$("txtName").value(item.name);
                    $$("txtBankName").value(item.bank_name);
                    $$("txtAccountNo").value(item.account_no);
                    $$("txtIfscCode").value(item.ifsc_code);
                    $$("txtNotes").value(item.notes);
                    $$("txtName").focus();

                };
                $$("grdSearchResult").dataBind(data);
            }
        }
    });
};
