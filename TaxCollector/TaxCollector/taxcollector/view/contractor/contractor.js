/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.contractorPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        
        page.contratorServiceAPI = new ContratorServiceAPI();
        document.title = "TaxCollector - Contractor";
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
                page.contratorServiceAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
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
                $$("txtMobileNo").value("");
                $$("txtAddress").value("");
                $$("txtAadharNo").value("");
                $$("txtAlterMobileNo").value("");
                $$("txtEmail").value("");
                $$("txtPanNo").value("");
                $$("txtBankName").value("");
                $$("txtAccountNo").value("");
                $("#fileUpload").val("");
                $$("txtDlNo").value("");
                $$("txtTinNo").value("");
                $$("txtGstNo").value("");
                $("#output").attr("src", "");
                $$("txtName").focus();
                //Set the curent mainproduct no to null
                page.id = null;
            },
            btnSave_click: function () {
                try{
                    var files = $("#fileUpload").get(0).files;
                    var fileName = "";
                    if (files.length > 0) {
                        fileName = files[0];
                    }
                    var data = {
                        name: $$("txtName").value(),
                        address: $$("txtAddress").value(),
                        comp_id: localStorage.getItem("user_company_id"),
                        aadhar_no: $$("txtAadharNo").value(),
                        mobile_no: $$("txtMobileNo").value(),
                        alternate_mobile_no: $$("txtAlterMobileNo").value(),
                        email_id: $$("txtEmail").value(),
                        pan_no: $$("txtPanNo").value(),
                        bank_name: $$("txtBankName").value(),
                        account_no: $$("txtAccountNo").value(),
                        dl_no: $$("txtDlNo").value(),
                        tin_no: $$("txtTinNo").value(),
                        gst_no: $$("txtGstNo").value(),
                        image: fileName.name,
                    };
                    if (data.name == "" || data.name == null || typeof data.name == "undefined") {
                        $$("txtName").focus();
                        throw WEBUI.LANG[CONTEXT.CurrentLanguage]["Contractor name is mandatory ...!"];
                    }
                    if (data.mobile_no == "" || data.mobile_no == null || typeof data.mobile_no == "undefined") {
                        $$("txtMobileNo").focus();
                        throw WEBUI.LANG[CONTEXT.CurrentLanguage]["Mobile no is mandatory ...!"];
                    }
                    if (page.id == null || page.id == '') {
                        $$("msgPanel").show("Inserting new contractor...");
                        page.contratorServiceAPI.postValue(data, function (data) {
                            $$("msgPanel").show("New Contractor saved successfully...!");
                            //Get the updated data
                            var data1 = {
                                id: data[0].key_value
                            }
                            page.contratorServiceAPI.getValue(data1, function (data) {
                                $$("grdSearchResult").dataBind(data);
                                $$("grdSearchResult").getAllRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtName").focus();
                            });
                        });
                    }
                    else {
                        $$("msgPanel").show("Updating new contractor...");
                        data.id = page.id;
                        page.contratorServiceAPI.putValue(data.id, data, function (data1) {
                            $$("msgPanel").show("Contractor updated successfully...!");
                            var data = {
                                id: page.id
                            }
                            page.contratorServiceAPI.getValue(data, function (data) {
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
                    $$("msgPanel").show("Select a contractor first...!");
                else {
                    if (confirm(WEBUI.LANG[CONTEXT.CurrentLanguage]["Are You Sure Want To Remove This Contractor If You Delete This Contractor The Details Cannot Be Retrived"])) {
                        $$("msgPanel").show("Removing contractor...");
                        var data = {
                            id: page.id
                        }
                        page.contratorServiceAPI.deleteValue(page.id, data, function (data) {
                            $$("msgPanel").show("Contractor removed successfully...!");
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
            btnUploadImage_click: function () {
                var data = new FormData();
                var files = $("#fileUpload").get(0).files;
                // Add the uploaded image content to the form data collection
                if (files.length > 0) {
                    data.append("file", files[0]);
                    var ajaxRequest = $.ajax({
                        type: "POST",
                        url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                        headers: {
                            'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + page.id + '\\'
                        },
                        contentType: false,
                        processData: false,
                        data: data
                    });

                    ajaxRequest.done(function (xhr, textStatus) {
                        $$("msgPanel").show("Picture uploaded successfully...!");
                    });
                }
                else {
                    $$("msgPanel").show("Please select only the images before uploading it");
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
                    $$("txtMobileNo").value(item.mobile_no);
                    $$("txtAddress").value(item.address);
                    $$("txtAadharNo").value(item.aadhar_no);
                    $$("txtAlterMobileNo").value(item.alternate_mobile_no);
                    $$("txtEmail").value(item.email_id);
                    $$("txtPanNo").value(item.pan_no);
                    $$("txtBankName").value(item.bank_name);
                    $$("txtAccountNo").value(item.account_no);
                    $$("txtDlNo").value(item.dl_no);
                    $$("txtTinNo").value(item.tin_no);
                    $$("txtGstNo").value(item.gst_no);
                    if (item.image != undefined && item.image != null && item.image != '')
                        $("#output").attr("src", CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + page.id + '/' + item.image);
                    else {
                        $("#fileUpload").val("");
                        $("#output").attr("src", "");
                    }
                    $$("txtName").focus();

                    //$$("msgPanel").show("Details of the Main Product...");
                };
                $$("grdSearchResult").dataBind(data);
            }
        }
    });
};
