/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.fn.mainproductPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        page.itemService = new ItemService();
        page.mainproducttypeAPI = new MainProductTypeAPI();
        page.coreproducttypeAPI = new CoreProductTypeAPI();
        page.mpt_no = null;
        document.title = "Blackcurrant - Main Product Type";
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
        //To search the mpt_name
        page.events.btnSearch_click = function () {
            //Hide the right side panel
            $(".detail-info").hide();
            //Hide Save and Delete button
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $$("msgPanel").show("Searching...");

            //Load the search result in grid
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(mpt_no,''),ifnull(mpt_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.mainproducttypeAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.itemService.getMainProductByName($$("txtSearchInput").value(), function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
            page.coreproducttypeAPI.searchValues("","","","", function (data) {
                $$("ddlcoreproduct").dataBind(data, "core_product_type_id", "core_product_type_name", "Select");
            });
        };

        //To create a new mpt_name
        page.events.btnNew_click = function () {
            //Show the panel
            $(".detail-info").show();
            //Show the Save button and hide delete button
            $$("btnSave").show();
            $$("btnDelete").hide();
          

            //Clear all textbox
            //$$("msgPanel").show("Clearing all fields to get new mpt_name data..");
            $$("txtMainProductName").val('');
            $$("txtMainProductName").focus();
            

            //Set the curent mainproduct no to null
            page.mpt_no = null;
           
            
        };

        //To insert or update a mainproduct
        page.events.btnSave_click = function () {
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                fileName = files[0];
            }
            var mainproduct = {
                mpt_name: $$("txtMainProductName").value(),
                mpt_desc: "Main Product",
                comp_id: localStorage.getItem("user_company_id"),
                mpt_image: fileName.name,
                core_product_type_id: $$("ddlcoreproduct").selectedValue()
            };
            //mainproduct.desc = "Main Product";
            //mainproduct.comp_id = localStorage.getItem("user_company_id");
            if (mainproduct.mpt_name == "" || mainproduct.mpt_name == null || mainproduct.mpt_name == undefined) {
                $$("msgPanel").show("Main product name is mandatory ...!");
                $$("txtMainProductName").focus();
                //alert("Vendor Name is Mantatory");
            }
            else if (mainproduct.mpt_name != "" && isInt(mainproduct.mpt_name)) {
                $$("msgPanel").show("Main product name should only contains characters ...!");
                $$("txtMainProductName").focus();
            }
            else {

                $$("msgPanel").show("Inserting new main product...");
                if (page.mpt_no == null || page.mpt_no == '') {

                    //insert data
                    page.mainproducttypeAPI.postValue(mainproduct, function (data) {
                    //page.itemService.insertMainProduct(mainproduct, function (data) {

                        $$("msgPanel").show("Main product saved successfully...!");

                        //Get the updated data
                        var data1 = {
                            mpt_no: data[0].key_value
                        }
                        page.mainproducttypeAPI.getValue(data1, function (data) {
                        //page.itemService.getMainProductByNo(data[0].key_value, function (data) {

                            // Add the new data to Grid
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtMainProductName").focus();
                        });
                    });

                } else {

                    $$("msgPanel").show("Updating main product...");
                    mainproduct.mpt_no = page.mpt_no;
                    page.mainproducttypeAPI.putValue(mainproduct.mpt_no, mainproduct, function (data1) {
                    //page.itemService.updateMainProduct(mainproduct, function (data) {
                        $$("msgPanel").show("Main product updated successfully...!");
                        var data = {
                            mpt_no: mainproduct.mpt_no
                        }
                        page.mainproducttypeAPI.getValue(data, function (data) {
                        //page.itemService.getMainProductByNo(mainproduct.mpt_no, function (data) {

                            // Update the new data to Grid
                            $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                            $$("grdSearchResult").selectedRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtMainProductName").focus();
                        });
                    });


                }
            }
            $$("btnDelete").show();
        };

        //To Remove a mainproduct
        page.events.btnDelete_click = function () {

            if (page.mpt_no == null || page.mpt_no == '')
                $$("msgPanel").show("Select a main product first...!");
            else{
                $$("msgPanel").show("Removing main product...");
                var data = {
                    mpt_no: page.mpt_no
                }
                page.mainproducttypeAPI.deleteValue(page.mpt_no, data, function (data) {
            //page.itemService.deleteMainProduct(page.mpt_no, function () {
                //Delete from grid
                $$("msgPanel").show("Main product removed successfully...!");
                $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                $(".detail-info").hide();

                $$("btnSave").hide();
                $$("btnDelete").hide();
                $$("msgPanel").hide();
                page.events.btnSearch_click();
            });
            }
        };
             
        page.events.page_load = function () {

           
            $$("txtSearchInput").focus();
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("350px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "mpt_no" },
                    { 'name': "ID", 'rlabel': 'No', 'width': "80px", 'dataField': "mpt_id" },
                    { 'name': "Main Product Name", 'rlabel': 'Name', 'width': "180px", 'dataField': "mpt_name" },
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {

                //Show the right pael
                $(".detail-info").show();

                //When selected show save and delete button
                $$("btnSave").show();
                $$("btnDelete").show();
              
                //Set the current Main Product
                page.mpt_no = item.mpt_no;

              
                //Load the data
                $$("txtMainProductName").value(item.mpt_name);
                $$("ddlcoreproduct").selectedValue(item.core_product_type_id);
                if (item.mpt_image != undefined && item.mpt_image != null && item.mpt_image != '')
                    $("#output").attr("src", CONTEXT.ENABLE_IMAGE_DOWNLOAD_PATH + page.mpt_no + '/' + item.mpt_image);
                $$("txtMainProductName").focus();
                
                //$$("msgPanel").show("Details of the Main Product...");
            };
            $$("grdSearchResult").dataBind([]);
            page.events.btnSearch_click();

        };

        page.events.btnUploadImage_click = function () {
            var data = new FormData();

            var files = $("#fileUpload").get(0).files;

            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                data.append("file", files[0]);

                var ajaxRequest = $.ajax({
                    type: "POST",
                    url: CONTEXT.ENABLE_IMAGE_UPLOAD_URL,
                    headers: {
                        'file-path': CONTEXT.ENABLE_IMAGE_FILE_PATH + page.mpt_no + '\\'
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
        }
    });
};
