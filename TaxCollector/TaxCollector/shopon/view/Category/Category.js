/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$.fn.CategoryPage = function () {
    //https://jqueryvalidation.org/required-method/     for validation
    return $.pageController.getPage(this, function (page, $$) {
        //page.CategoryService = new CategoryService();
        page.itemCategoryAPI = new ItemCategoryAPI();
        page.itemAttributeAPI = new ItemAttributeAPI();
        page.cat_no = null;
        document.title = "ShopOn - Category";
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
            //if (keyCode == 13 && e.ctrlKey) {
            //    e.preventDefault();
            //    page.events.btnAddAttributes_click();
            //}
            if (e.keyCode == 82 && e.ctrlKey) {
                e.preventDefault();
                page.events.btnDelete_click();
            }
        });

        page.events.btnNew_click = function () {
            $$("btnSave").show();
            $$("btnDelete").hide();
            $(".detail-info").show();
            var data = '';
            page.cat_no = null;
            page.cat_image = null;
            page.attributes = null;
            $$("txtCategoryName").val('');
            $$("pnlParentCategory").show();
            $$("txtCategoryName").focus();
            $$("ddlParentCategory").selectedValue('-1');
            $$("ddlAttributes").selectedValue('-1');
            $$("grdCatattribute").dataBind([]);
            $$("txtSearchInput").value('');
            $('#fileUpload').val("");
            $("#output").attr("src", "");
            $("#bottom").attr("style", "margin-top: 130px;")
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(cat_no,''),ifnull(cat_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
        };
        
        page.events.page_load = function () {
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $(".detail-info").hide();
            var saveData = (function () {
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                return function (data, fileName) {
                    var json = JSON.stringify(data),
                        blob = new Blob([json], { type: "octet/stream" }),
                        url = window.URL.createObjectURL(blob);
                    a.href = url;
                    a.download = fileName;
                    a.click();
                    window.URL.revokeObjectURL(url);
                };
            }());
            $("#ddlAttributes").keyup(function (event) {
                $$("msgPanel").hide();
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode === 13 && event.ctrlKey) {
                    page.events.btnAddAttributes_click();
                }
            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, "", function (data) {
                $$("ddlAttributes").dataBind(data, "attr_no", "attr_name", "Select");
            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
            //page.itemCategoryAPI.getParentCategory(function (data) {
                //page.CategoryService.getCategory(function (data) {
                $$("ddlParentCategory").dataBind(data, "cat_no", "cat_name", "Select");
            });
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "",
                sort_expression: ""
            }
            page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.CategoryService.getCategory(function (data) {
                $$("grdSearchResult").dataBind(data);
            });
            $$("grdSearchResult").width("100%");
            $$("grdSearchResult").height("500px");
            $$("grdSearchResult").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "No", 'rlabel': 'No', 'width': "100px", 'dataField': "cat_no" },
                    { 'name': "No", 'rlabel': 'No', 'width': "100px", 'dataField': "cat_no" },
                    { 'name': "Category Name", 'rlabel': 'Category Name', 'width': "120px", 'dataField': "cat_name" }
                ]
            });

            $$("grdSearchResult").selectionChanged = function (row, item) {
                $("#bottom").attr("style", "margin-top: 65px;")
                $$("grdCatattribute").dataBind([]);
                $$("btnSave").show();
                $$("btnDelete").show();
                $$("txtCategoryName").focus();
                //$$("btnNew").show();
                $(".detail-info").show();
                page.cat_no = item.cat_no;
                page.selectedRowId = row.attr("row_id");
                if (item.cat_no_par != null) {
                    $$("pnlParentCategory").show();
                } else {
                    $$("pnlParentCategory").show();
                }
                $$("txtCategoryName").value(item.cat_name);
                if (item.cat_no_par != null) {
                    $$("ddlParentCategory").selectedValue(item.cat_no_par);
                } else {
                    $$("ddlParentCategory").selectedValue(-1);
                }
                if (item.cat_image != undefined && item.cat_image != null && item.cat_image != '') {
                    $("#output").attr("src", "http://104.251.218.116:8080/images/upload/shopondev/category/" + 'category_' + item.cat_no + '/' + item.cat_image);
                    page.cat_image = item.cat_image;
                }
                else {
                    $('#fileUpload').val("")
                    $("#output").attr("src", "http://104.251.218.116:8080/images/upload/shopondev/category/" + '/No_Image_Available.png');
                }
                var list = {};
                if (item.attr_nos != null) {
                    $(item.attr_nos.split(",")).each(function (i, items) {
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "attr_no=" + items,
                            sort_expression: ""
                        }
                        page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression,"", function (data) {
                            //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                            $(data).each(function (i, items) {
                                list.attr_no = items.attr_no;
                                list.attr_name = items.attr_name;
                            })
                            page.controls.grdCatattribute.createRow(list);
                        });
                    });
                }
                $$("txtCategoryName").focus();
            };
            $$("grdSearchResult").dataBind([]);
            $$("grdCatattribute").width("100%");
            $$("grdCatattribute").height("250px");
            $$("grdCatattribute").setTemplate({
                selection: "Single", paging: true, pageSize: 50,
                columns: [
                    //{ 'name': "No", 'rlabel': 'No', 'width': "100px", 'dataField': "cat_no" },
                    { 'name': "No", 'rlabel': 'No', 'width': "100px", 'dataField': "attr_no" },
                    { 'name': "Attr Name", 'rlabel': 'Category Name', 'width': "120px", 'dataField': "attr_name" },
                    {
                        'name': "Action",
                        'width': "50px",
                        'dataField': "cust_no",
                        itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                    }
                ]
            });
            $$("grdCatattribute").dataBind([]);
            page.controls.grdCatattribute.rowCommand = function (action, actionElement, rowId, row, rowData) {
                if (action == "delete") {
                    page.controls.grdCatattribute.deleteRow(rowId);
                    //Recalculate after deleting a item
                    //page.calculate();
                }
            }
            $$("ddlAttributes").selectionChange(function () {
            })
            $$("txtSearchInput").keyup(function () {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "concat(ifnull(cat_no,''),ifnull(cat_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                    sort_expression: ""
                }
                page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.CategoryService.getManuByNamePhone($$("txtSearchInput").value(), function (data) {
                    $$("grdSearchResult").dataBind(data);
                    $$("msgPanel").hide();
                });
            });
            page.events.btnSearch_click();
        };
        page.events.btnAddAttributes_click = function () {
            var list = {};
            var flag = false;
            $(page.controls.grdCatattribute.allData()).each(function (i, items) {
                if ($$("ddlAttributes").selectedValue() == items.attr_no) {
                    flag = true;
                }
                else {
                    if (flag != true) {
                        flag = false;
                    }
                }
            })
            if ($$("ddlAttributes").selectedValue() != "-1" && flag == false) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "attr_no=" + $$("ddlAttributes").selectedValue(),
                    sort_expression: ""
                }
                page.itemAttributeAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression,"", function (data) {
                    $(data).each(function (i, items) {
                        list.attr_no = items.attr_no;
                        list.attr_name = items.attr_name;
                    })
                    page.controls.grdCatattribute.createRow(list);
                });
            }
            else if ($$("ddlAttributes").selectedValue() == "-1") {
                $$("msgPanel").show("Please select the category...!");
                $$("ddlAttributes").selectedObject.focus();
            }
            else {
                $$("msgPanel").show("Category is already added...!");
                $$("ddlAttributes").selectedObject.focus();
            }
        }
        page.save = function () {
            var data = {
                cat_name: $$("txtCategoryName").value(),
                struc_code: "ON",
                comp_id: getCookie("user_company_id")
            };
            if ($$("ddlParentCategory").selectedValue() != "-1") {
                data.cat_no_par = $$("ddlParentCategory").selectedValue();
            }
            if (page.controls.grdCatattribute.allData().length > 0) {
                data.attr_nos = page.attributes;
            }
            var files = $("#fileUpload").get(0).files;
            var fileName = "";
            if (files.length > 0) {
                fileName = files[0];
            }
            if (fileName.name != "" || fileName.name != null || fileName.name != undefined) {
                data.cat_image = fileName.name
            }
            $$("msgPanel").show("Inserting new Category...");
            page.itemCategoryAPI.postValue(data, function (data1) {
                if (data1.length > 0) {
                    $$("msgPanel").show("Category inserted successfully...!");
                    var Category = {
                        cat_no: data1[0].key_value
                    }
                    page.cat_no = data1[0].key_value;
                    page.UploadImage(function () {
                        page.itemCategoryAPI.getValue(Category, function (data) {
                            $$("btnSave").disable(false);
                            $$("grdSearchResult").dataBind(data);
                            $$("grdSearchResult").getAllRows()[0].click();
                            $$("msgPanel").hide();
                            $$("txtCategoryName").focus();
                        });
                    })
                }
            });
        }
        page.events.btnSave_click = function () {
            $$("btnSave").disable(true);
            page.attributes = "";
            if ($$("ddlAttributes").selectedValue() !="-1") {
                $(page.controls.grdCatattribute.allData()).each(function (i, items) {
                    if (i == 0) {
                        page.attributes = items.attr_no;
                    } else {
                        page.attributes = page.attributes + "," + items.attr_no;
                    }
                })
            }
            var cat_name = $$("txtCategoryName").value();
            if (cat_name == "") {
                $$("msgPanel").show("Category name is mandatory ...!");
                $$("btnSave").disable(false);
                $$("txtCategoryName").focus();
            }
            else if (cat_name != "" && isInt(cat_name)) {
                $$("msgPanel").show("Category name should only contains characters ...!");
                $$("btnSave").disable(false);
                $$("txtCategoryName").focus();
            }
            else if (cat_name != "" && isInt(cat_name)) {
                $$("msgPanel").show("Category name should only contains characters ...!");
                $$("btnSave").disable(false);
                $$("txtCategoryName").focus();
            }
            else {
                if (page.cat_no == null) {
                    if ($$("ddlParentCategory").selectedValue() == "-1") {
                        if (confirm("Are you sure want to this is the parent category")) {
                            page.save();
                            $$("btnSave").disable(false);
                        } else {
                            $$("Please select the parent category name...");
                            $$("ddlParentCategory").selectedObject.focus();
                            $$("btnSave").disable(false);
                        }
                    }
                    else {
                        page.save();
                        $$("btnSave").disable(false);
                    }
                }
                else {
                    var data = {
                        cat_no:page.cat_no,
                        cat_name: $$("txtCategoryName").value(),
                        struc_code: "ON",
                        comp_id: getCookie("user_company_id")
                    };
                    if ($$("ddlParentCategory").selectedValue() != "-1") {
                        data.cat_no_par = $$("ddlParentCategory").selectedValue();
                    }
                    var files = $("#fileUpload").get(0).files;
                    var fileName = "";
                    if (files.length > 0) {
                        fileName = files[0];
                    }
                    if (fileName.name != "" || fileName.name != null || fileName.name != undefined) {
                        data.cat_image = fileName.name
                    }
                    if (page.controls.grdCatattribute.allData().length > 0) {
                        data.attr_nos = page.attributes;
                    }
                    $$("msgPanel").show("updating category...");
                    page.itemCategoryAPI.putValue(data, function (data1) {
                        $$("msgPanel").show("Category updated successfully...!");
                        page.UploadImage(function () {
                            var Category = {
                                cat_no: page.cat_no
                            }
                            page.itemCategoryAPI.getValue(Category, function (data) {
                                $$("btnSave").disable(false);
                                $$("grdSearchResult").updateRow($$("grdSearchResult").selectedRowIds()[0], data[0]);
                                $$("grdSearchResult").selectedRows()[0].click();
                                $$("msgPanel").hide();
                                $$("txtCategoryName").focus();
                            });
                        });
                    });
                }
                $$("btnSave").show();
                $$("btnDelete").show();
                $$("btnSave").disable(false);
            }
        };
        page.UploadImage = function (callback) {
            var photo_data = new FormData();
            var files = $("#fileUpload").get(0).files;
            // Add the uploaded image content to the form data collection
            if (files.length > 0) {
                photo_data.append("file", files[0]);
                // Make Ajax request with the contentType = false, and procesDate = false
                var ajaxRequest = $.ajax({
                    type: "POST",
                    //url: "http://104.251.212.122:8080/FileUploaderRESTService/rest/image/upload",
                    url: 
                    //CONTEXT.ImageUploadURL,
                    "http://104.251.218.116:8080/FileUploaderRESTService/rest/image/upload",
                    //"http://104.251.212.122:8080/FileUploaderRESTService/rest/image/upload",
                    headers: {
                        //'file-path': '/usr/shopon/upload/images/' + $$("lblItemNo").value() + '/'
                        'file-path': '/opt/tomcat/webapps/images/upload/shopondev/category/' + 'category_' + page.cat_no + '/'
                        //'file-path': '/var/lib/tomcat8/webapps/images/upload/blisstree/' + page.people_id + '/'
                        //CONTEXT.ImageFilePath + $$("lblItemNo").value() + '/'
                        //'file-path': CONTEXT.ImageFilePath + 'patient_' + $$("txtPatientId").value() + '/'

                    },
                    contentType: false,
                    processData: false,
                    data: photo_data
                });

                ajaxRequest.done(function (xhr, textStatus) {
                    if (callback != undefined) {
                        callback();
                    }
                });
            }
            else {
                if (callback != undefined) {
                    callback();
                }
            }
        }
        page.events.btnDelete_click = function () {
            //$(".detail-info").progressBar("show")
            if (page.cat_no == null || page.cat_no == '') {
                $$("msgPanel").show("Select a category first...!");
            }
            else {
                $$("msgPanel").show("Removing category...");
                var data = {
                    cat_no: page.cat_no
                }
                page.itemCategoryAPI.deleteValue(data, function (data) {
                    $$("msgPanel").show("Category removed successfully...!");
                    $$("grdSearchResult").deleteRow($$("grdSearchResult").selectedRowIds()[0]);
                    $$("msgPanel").hide();
                    page.events.btnSearch_click();
                });
            }

        };
        page.events.btnSearch_click = function () {
            $$("btnSave").hide();
            $$("btnDelete").hide();
            $(".detail-info").hide();
            $$("msgPanel").show("Searching...");
            var data = {
                start_record: 0,
                end_record: "",
                filter_expression: "concat(ifnull(cat_no,''),ifnull(cat_name,'')) like '%" + $$("txtSearchInput").value() + "%'",
                sort_expression: ""
            }
            page.itemCategoryAPI.searchValue(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                $$("grdSearchResult").dataBind(data);
                $$("msgPanel").hide();
            });
            $$("txtSearchInput").focus();
            $$("txtSearchInput").selectedObject.focus();
        };

        function selectRow(up) {
            var t = $$("grdSearchResult");
            var count = t.grid.dataCount;
            var selected = t.selectedRowIds()[0];
            if (selected) {
                var index = parseInt(t.selectedRowIds()[0]) - 1;
                index = parseInt(index) + parseInt(up ? -1 : 1);
                if (index < 0) index = 0;
                if (index >= count) index = count - 1;
                t.getAllRows()[index].click();
            } else {
                var index;
                index = parseInt(up ? count - 1 : 0);
                t.getAllRows()[index].click();
            }
        }
        var panel = $("[controlid=grdSearchResult]").attr('tabindex', 0).focus();
        panel.bind('keydown', function (e) {
            switch (e.keyCode) {
                case 38:    // up
                    selectRow(true);
                    return false;
                case 40:    // down
                    selectRow(false);
                    return false;
            }
        });

    });
};

