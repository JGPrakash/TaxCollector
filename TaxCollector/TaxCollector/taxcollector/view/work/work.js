/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.workPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        
        page.workServiceAPI = new WorkServiceAPI();
        page.accountServiceAPI = new AccountServiceAPI();
        page.schemeServiceAPI = new SchemeServiceAPI();
        page.periodServiceAPI = new PeriodServiceAPI();
        document.title = "TaxCollector - Work";
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
                page.workServiceAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    page.view.selectedSearch(data);
                    $$("msgPanel").hide();
                });
                page.accountServiceAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlAccount").dataBind(data, "id", "name", "None");
                });
                page.schemeServiceAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlScheme").dataBind(data, "id", "name", "None");
                });
                page.periodServiceAPI.searchValues("", "", "", "", function (data) {
                    $$("ddlPeriod").dataBind(data, "id", "name", "None");
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
                $$("txtAmount").value("");
                $$("ddlScheme").selectedValue("-1");
                $$("ddlAccount").selectedValue("-1");
                $$("ddlPeriod").selectedValue("-1");
                $$("txtStartDate").selectedObject.val("");
                $$("txtEndDate").selectedObject.val("");
                $$("txtNotes").value("");
                $$("txtName").focus();
                //Set the curent mainproduct no to null
                page.id = null;
            },
            btnSave_click: function () {
                try{
                    var data = {
                        name: $$("txtName").value(),
                        amount: $$("txtAmount").value(),
                        scheme_id: $$("ddlScheme").selectedValue(),
                        account_id: $$("ddlAccount").selectedValue(),
                        period_id: $$("ddlPeriod").selectedValue(),
                        starting_period: ($$("txtStartDate").getDate() == "") ? "" : dbDate($$("txtStartDate").getDate()),
                        ending_period: ($$("txtEndDate").getDate() == "") ? "" : dbDate($$("txtEndDate").getDate()),
                        notes: $$("txtNotes").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                    };
                    if (data.name == "" || data.name == null || typeof data.name == "undefined") {
                        $$("txtName").focus();
                        throw WEBUI.LANG[CONTEXT.CurrentLanguage]["Work name is mandatory ...!"];
                    }
                    if (page.id == null || page.id == '') {
                        $$("msgPanel").show("Inserting new work...");
                        page.workServiceAPI.postValue(data, function (data) {
                            $$("msgPanel").show("New Work saved successfully...!");
                            //Get the updated data
                            var data1 = {
                                id: data[0].key_value
                            }
                            page.workServiceAPI.getValue(data1, function (data) {
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtName").focus();
                            });
                        });
                    }
                    else {
                        $$("msgPanel").show("Updating work...");
                        data.id = page.id;
                        page.workServiceAPI.putValue(data.id, data, function (data1) {
                            $$("msgPanel").show("Work updated successfully...!");
                            var data = {
                                id: page.id
                            }
                            page.workServiceAPI.getValue(data, function (data) {
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
                    $$("msgPanel").show("Select a work first...!");
                else {
                    if (confirm(WEBUI.LANG[CONTEXT.CurrentLanguage]["Are You Sure Want To Remove This Work If You Delete This Work The Details Cannot Be Retrived"])) {
                        $$("msgPanel").show("Removing work...");
                        var data = {
                            id: page.id
                        }
                        page.workServiceAPI.deleteValue(page.id, data, function (data) {
                            $$("msgPanel").show("Work removed successfully...!");
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
                page.controls.grdSearchResult.rowBound = function (row, item) {
                    if (item.ending_period != null && item.ending_period != "" && typeof item.ending_period != "undefined") {
                        row.css("font-weight", "500");
                        row.css("color", "green");
                    }
                }
                $$("grdSearchResult").selectionChanged = function (row, item) {
                    $(".detail-info").show();
                    $$("btnSave").show();
                    $$("btnDelete").show();
                    page.id = item.id;
                    //Load the data
                    $$("txtName").value(item.name);
                    $$("ddlScheme").selectedValue(item.scheme_id);
                    $$("ddlAccount").selectedValue(item.account_id);
                    $$("ddlPeriod").selectedValue(item.period_id);
                    if (item.starting_period == "" || item.starting_period == null || typeof item.starting_period == "undefined") {
                        $$("txtStartDate").selectedObject.val("");
                    }
                    else {
                        $$("txtStartDate").setDate(nvl(item.starting_period, ""));
                    }
                    if (item.ending_period == "" || item.ending_period == null || typeof item.ending_period == "undefined") {
                        $$("txtEndDate").selectedObject.val("");
                    }
                    else {
                        $$("txtEndDate").setDate(nvl(item.ending_period, ""));
                    }
                    $$("txtNotes").value(item.notes);
                    $$("txtName").focus();

                };
                $$("grdSearchResult").dataBind(data);
            }
        }
    });
};
