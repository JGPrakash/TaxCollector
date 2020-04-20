$.fn.allmemberPromotionPage = function () {
    return $.pageController.getPage(this, function (page, $$, e) {
        page.memberPromotion = new MemberPromotionService();
        page.customerPromotion = new CustomerPromotion();
        page.allmemberPromotion = new AllMemberPromotionService();
        page.groupAPI = new GroupAPI();
        page.customergroupAPI = new CustomerGroupAPI();
        page.rewardplanAPI = new RewardPlanAPI();
        page.customerAPI = new CustomerAPI();
        page.rewardService = new RewardService();
        document.title = "ShopOn - Customer Promotion";
        page.select = function (item) {
            $$("txtSenderNumber").val("919003300929");
            if (item.mem_id == 1)
                $$("ddlmymembernames").selectedObject.val(1);
            if (item.mem_id == 2)
                $$("ddlmymembernames").selectedObject.val(2);
            if (item.mem_id == 3)
                $$("ddlmymembernames").selectedObject.val(3);
            if (item.mem_id == 4)
                $$("ddlmymembernames").selectedObject.val(4);
            if (item.mem_id == 5)
                $$("ddlmymembernames").selectedObject.val(5);
            if (item.mem_id == 6)
                $$("ddlmymembernames").selectedObject.val(6);

        };
        page.loadEmailCustomer = function () {
            $$("ddlMemEmailList").dataBind([]);
            if ($$("ddlmychurchtypes").selectedValue() == 0) {
            }
            if ($$("ddlmychurchtypes").selectedValue() == 1) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.customerPromotion.getCustomerByAll(-1, function (item) {
                    page.controls.grdEmailDetails.dataBind(item);

                });
            } else if ($$("ddlmychurchtypes").selectedValue() == 2) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.customerPromotion.getCustomerByAll(-1, function (data) {
                    $$("ddlMemEmailList").dataBind(data, "cust_no", "cust_name");
                });
            } else if ($$("ddlmychurchtypes").selectedValue() == 3) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.allmemberPromotion.getGroupName(function (data) {
                    $$("ddlMemEmailList").dataBind(data, "group_id", "group_name");
                });
            } else if ($$("ddlmychurchtypes").selectedValue() == 4) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.customerPromotion.getRewardByAll("%", function (data) {
                    $$("ddlMemEmailList").dataBind(data, "reward_plan_id", "reward_plan_name");
                });
            }
        }
        page.loadCustomer = function () {
            $$("ddlMemList").dataBind([]);
            if ($$("ddlmychurchtype").selectedValue() == 0) {
            }
            if ($$("ddlmychurchtype").selectedValue() == 1) {
            } else if ($$("ddlmychurchtype").selectedValue() == 2) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.customerPromotion.getCustomerByAll(-1, function (item) {
                    $$("ddlMemList").dataBind(item, "cust_no", "cust_name");
                });
            } else if ($$("ddlmychurchtype").selectedValue() == 3) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.allmemberPromotion.getGroupName(function (data) {
                    $$("ddlMemList").dataBind(data, "group_id", "group_name");
                });
            } else if ($$("ddlmychurchtype").selectedValue() == 4) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.customerPromotion.getRewardByAll("%", function (data) {
                    $$("ddlMemList").dataBind(data, "reward_plan_id", "reward_plan_name");
                });
            }
        }
        page.events = {

            btnClearM_click: function () {
                $$("ddlmychurchtypes").selectedValue('');
                $$("grdListEmailDetails").dataBind([]);
                $$("grdEmailDetails").dataBind([]);
                $$("lblCategoryEmail").value("Name");
                $$("txtMSubject").val('');
                $$("txtMMessage").val('');
                $$("msgPanel").hide();
            },
            btnClear_click: function () {
                $$("ddlmychurchtype").selectedValue('');
                $$("grdListDetails").dataBind([]);
                $$("grdSenderDetails").dataBind([]);
                $$("lblCategoryName").value("Name");
                $$("txtSenderNumber").val('');
                $$("txtMessage").val('');
                $$("msgPanel").hide();
            },
            btnSendSMS_click: function () {
                //ddlmychurchtype
                if ($$("ddlmychurchtype").selectedValue() == null) {
                    $$("msgPanel").show("Please select any category...!");
                }
                //else if ($$("txtSenderNumber").val() == "") {
                //    $$("msgPanel").show("Please enter sender number...!");
                //    $$("txtSenderNumber").focus();
                //}
                //else if (!isInt($$("txtSenderNumber").val())) {
                //    $$("msgPanel").show("Sender number must be a number...!");
                //    $$("txtSenderNumber").focus();
                //}
                //else if($$("txtSenderNumber").val().length <10 )
                //{
                //    $$("msgPanel").show("Sender number must be 10 in length...!");
                //    $$("txtSenderNumber").focus();
                //}
                else if ($$("txtMessage").val() == "") {
                    $$("msgPanel").show("Please type any message before send...!");
                    $$("txtMessage").focus();
                }
                else {
                    $(page.controls.grdSenderDetails.allData()).each(function (i, item) {
                        if (item.phone_no != "" && item.phone_no != " " && item.phone_no != undefined && item.phone_no != null) {
                            var rewardplan = (item.reward_plan_name == undefined) ? "-" : item.reward_plan_name;
                            var rewardplanpoint = (item.total_reward_point == undefined) ? "0" : item.total_reward_point;
                            var accountInfo =
                                {
                                    "appName": CONTEXT.COMPANY_NAME,
                                    "senderNumber": CONTEXT.SMS_SENDER_NO,
                                    "companyId": CONTEXT.SMS_COMPANY_ID,
                                    "message": //"Hai",
                                    "Dear " + item.cust_name + "," + "\n" +
                                        "Your Total Reward Plan is " + rewardplan + ".\n" +
                                    "Your Total Reward Point is " + rewardplanpoint + ".\n" +
                                            $$("txtMessage").val(),
                                    "receiverNumber": "+91" + item.phone_no,
                                };

                            var accountInfoJson = JSON.stringify(accountInfo);

                            $.ajax({
                                type: "POST",
                                //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendSMS/text-message",
                                url: CONTEXT.SMSURL,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfo),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);
                                    //$(".detail-info").progressBar("hide");
                                    $$("msgPanel").flash("SMS sent successfully...!");
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);
                                    //$(".detail-info").progressBar("hide");
                                    $$("msgPanel").show("SMS sent failed...");
                                }
                            });
                        }
                        else {
                            $$("msgPanel").show("SMS Sent Failed Mobile Number is Empty...");
                        }
                    });
                }
            },
            grdSenderDetails_select: function (row, item) {
                $$("ddlmymembername").selectedValue(item.mem_id);
                $$("txtReceiverNumber").val(item.mobile_no1);
                page.select(item);
            },
            grdEmailDetails_select: function (row, item) {
                $$("ddlmymembernames").selectedValue(item.mem_id);
                $$("txtMEmail").val(item.mem_email);
                page.select(item);
            },
            btnSendMail_click: function () {
                if ($$("ddlmychurchtypes").selectedValue() == null) {
                    $$("msgPanel").show("Please select the category...!");
                }
                else if ($$("txtMSubject").val() == "") {
                    $$("msgPanel").show("Fill the subject...!");
                    $$("txtMSubject").focus();
                }
                else if ($$("txtMMessage").val() == "") {
                    $$("msgPanel").show("Fill the message...!");
                    $$("txtMMessage").focus();
                }
                else {
                    $(page.controls.grdEmailDetails.allData()).each(function (i, item) {
                        if (item.email != "" && item.email != undefined && item.email != null) {
                            var accountInfo =
                                {
                                    "appName": CONTEXT.COMPANY_NAME,
                                    "companyId": CONTEXT.FINFACTS_COMPANY,
                                    "clientAddress": CONTEXT.ClientAddress,
                                    "customerNumber": item.cust_no,
                                    //"1111",
                                    "customerName": item.cust_name,
                                    //"Sundar",
                                    "planName": (item.reward_plan_name == undefined) ? "-" : item.reward_plan_name,
                                    //"Gold Reward Plan",
                                    "totalRewardPoint": (item.total_reward_point == undefined) ? "0" : item.total_reward_point,
                                    //"2300",
                                    "subject": $$("txtMSubject").val(),
                                    //"Special Customer of Shopon",
                                    "message": $$("txtMMessage").val(),
                                    //"We have an excellent offer at our store in Tiruchendur this Saturday on  10-May-2017. 
                                    //We will double your reward point for all your purchase and also will provide you an unbelivable gift. 
                                    //Dont miss out this offer.Following are your details",
                                    "emailAddressList": //["vigneshviki50@gmail.com"],
                                    //[$$("txtMEmail").val()],
                                    [item.email],
                                    //["sam.info85@gmail.com"],
                                    //["immanuvel.kalaiarasan@gmail.com"],
                                    //["sundaralingam48@gmail.com", "wototech@outlook.com", "balumanoj85@gmail.com", "ram.vegeta@gmail.com", "sam.info85@gmail.com"]
                                };

                            var accountInfoJson = JSON.stringify(accountInfo);

                            $.ajax({
                                type: "POST",
                                //url: "http://104.251.218.116:8080/woto-utility-rest/rest/sendEmail/promotion-email",
                                url: CONTEXT.ENABLE_EMAIL_URL,
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                crossDomain: false,
                                data: JSON.stringify(accountInfo),
                                dataType: 'json',
                                success: function (responseData, status, xhr) {
                                    console.log(responseData);
                                    //$(".detail-info").progressBar("hide");
                                    $$("msgPanel").flash("E-mail sent successfully...!");
                                },
                                error: function (request, status, error) {
                                    console.log(request.responseText);
                                    //$(".detail-info").progressBar("hide");
                                    $$("msgPanel").show("E-mail sent failed...");
                                }
                            });
                        }
                        else {
                            $$("msgPanel").show("SMS Sent Failed Email ID is Empty...");
                        }
                    });
                    //});


                }
            },
            

            page_load: function () {
                $$("pnlsenderno").hide();
                $$("ddlcommunicationtype").selectedValue("Select");
               /* page.memberPromotion.getMemberByAll("%", function (data) {
                    $$("ddlmyallnames").dataBind(data, "mem_id", "mem_name", "All");
                    $$("ddlmyallname").dataBind(data, "mem_id", "mem_name", "All");
                });

                page.memberPromotion.getMemberByAll("%", function (data) {
                    $$("ddlmymembernames").dataBind(data, "mem_id", "mem_name", "All");
                    $$("ddlmymembername").dataBind(data, "mem_id", "mem_name", "All");
                });
                page.allmemberPromotion.getChurchByAll("%", function (data) {
                    $$("ddlmychurchnames").dataBind(data, "chr_id", "chr_name", "All");
                    $$("ddlmychurchname").dataBind(data, "chr_id", "chr_name", "All");
                });
                page.allmemberPromotion.getPastorateByAll("%", function (data) {
                    $$("ddlmypastoratenames").dataBind(data, "pas_id", "pas_name", "All");
                    $$("ddlmypastoratename").dataBind(data, "pas_id", "pas_name", "All");
                });*/
                /*page.allmemberPromotion.getGroupByAll("%", function (data) {
                    $$("ddlmygroupnames").dataBind(data, "group_id", "group_name", "All");
                    $$("ddlmygroupname").dataBind(data, "group_id", "group_name", "All");
                });*/

                var searchViewData = [];

                setTimeout(function () {
                    if (CONTEXT.ENABLE_INVOCE_SMS == "true") {
                        searchViewData.push({ view_no: "SMS", view_name: "SMS" });
                    }
                    if (CONTEXT.ENABLE_EMAIL == "true") {
                        searchViewData.push({ view_no: "EMAIL", view_name: "EMAIL" });
                    }
                    $$("ddlcommunicationtype").dataBind(searchViewData, "view_no", "view_name","Select");
                }, 10000);
                

                $$("ddlcommunicationtype").selectionChange(function () {
                    var plan = $$("ddlcommunicationtype").selectedValue();
                    switch (plan) {
                        case "SMS":
                            $$("pnlsearch").show();
                            $$("pnlsms").show();
                            $$("pnlall").show();
                            $$("pnlemail").hide();
                            $$("pnlsearchE").hide();
                            $$("ddlmychurchtype").selectedValue('');
                            $$("grdListDetails").dataBind([]);
                            $$("grdSenderDetails").dataBind([]);
                            $$("lblCategoryName").value("Name");
                            $$("txtSenderNumber").val('');
                            $$("txtMessage").val('');
                          //  $$("ddlmychurchtype").focus();
                            break;
                        case "EMAIL":
                            $$("pnlsearch").hide();
                            $$("pnlsms").hide();
                           // $$("epnlall").show();
                            $$("pnlemail").show();
                            $$("pnlsearchE").show();
                            $$("ddlmychurchtypes").selectedValue('');
                            $$("grdListEmailDetails").dataBind([]);
                            $$("grdEmailDetails").dataBind([]);
                            $$("lblCategoryEmail").value("Name");
                            $$("txtMSubject").val('');
                            $$("txtMMessage").val('');
                           // $$("ddlmychurchtypes").focus();
                            break;
                        default:
                            $$("pnlsearch").hide();
                            $$("pnlsms").hide();
                            $$("pnlall").hide();
                            $$("pnlemail").hide();
                            $$("pnlsearchE").hide();
                            $$("epnlall").hide();
                            break;
                    }
                });
                
                $$("ddlmychurchtype").selectionChange(function () {
                    //page.loadCustomer();
                    page.controls.grdListDetails.dataBind([]);
                    page.controls.grdSenderDetails.dataBind([]);
                    if ($$("ddlmychurchtype").selectedValue() == 0) {
                        $$("btnAddCommn").show();
                        $$("btnRemCommn").show();
                    }
                    if ($$("ddlmychurchtype").selectedValue() == 1) {
                        $$("lblCategoryName").value("All Customers");
                        $$("btnAddCommn").hide();
                        $$("btnRemCommn").hide();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                            //page.customerPromotion.getCustomerByAll(-1, function (item) {
                            page.controls.grdSenderDetails.dataBind(item);

                        });
                    } else if ($$("ddlmychurchtype").selectedValue() == 2) {
                        $$("lblCategoryName").value("Customer Name");
                        $$("lblCustomerName").value("Customer");
                        $$("btnAddCommn").show();
                        $$("btnRemCommn").show();
                    } else if ($$("ddlmychurchtype").selectedValue() == 3) {
                        $$("lblCategoryName").value("Group Name");
                        $$("lblCustomerName").value("Group");
                        $$("btnAddCommn").show();
                        $$("btnRemCommn").show();
                    } else if ($$("ddlmychurchtype").selectedValue() == 4) {
                        $$("lblCategoryName").value("Reward Name");
                        $$("lblCustomerName").value("Reward");
                        $$("btnAddCommn").show();
                        $$("btnRemCommn").show();
                    }
                     /*else if ($$("ddlmychurchtype").selectedValue() == 5) {
                        $$("lblCategoryName").value("Group Name");
                        page.allmemberPromotion.getGroupName(function (data) {
                            $$("ddlMemList").dataBind(data, "group_id", "group_name", "Select");
                        });
                    }*/
                });
                $$("ddlmychurchtypes").selectionChange(function () {
                    page.controls.grdListEmailDetails.dataBind([]);
                    page.controls.grdEmailDetails.dataBind([]);
                    if ($$("ddlmychurchtypes").selectedValue() == 0) {
                        $$("btnAddEmailCommn").show();
                        $$("btnRemEmailCommn").show();
                    }
                    if ($$("ddlmychurchtypes").selectedValue() == 1) {
                        $$("lblCategoryEmail").value("All Customers");
                        $$("lblCategoryName").value("All Customers");
                        $$("btnAddEmailCommn").hide();
                        $$("btnRemEmailCommn").hide();
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "",
                            sort_expression: ""
                        }
                        page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                        //page.customerPromotion.getCustomerByAll(-1, function (item) {
                            page.controls.grdEmailDetails.dataBind(item);

                        });
                        $$("btnAddEmailCommn").hide();
                        $$("btnRemEmailCommn").hide();
                    } else if ($$("ddlmychurchtypes").selectedValue() == 2) {
                        $$("lblCategoryEmail").value("Customer Name");
                        $$("lblCustomersName").value("Customer");
                        $$("btnAddEmailCommn").show();
                        $$("btnRemEmailCommn").show();
                        $$("btnAddEmailCommn").show();
                        $$("btnRemEmailCommn").show();
                    } else if ($$("ddlmychurchtypes").selectedValue() == 3) {
                        $$("lblCategoryEmail").value("Group Name");
                        $$("lblCustomersName").value("Group");
                        $$("btnAddEmailCommn").show();
                        $$("btnRemEmailCommn").show();
                    } else if ($$("ddlmychurchtypes").selectedValue() == 4) {
                        $$("lblCategoryEmail").value("Reward Name");
                        $$("lblCustomersName").value("Reward");
                        $$("btnAddEmailCommn").show();
                        $$("btnRemEmailCommn").show();
                    } /*else if ($$("ddlmychurchtypes").selectedValue() == 5) {
                        $$("lblCategoryEmail").value("Group Name");
                        page.allmemberPromotion.getGroupName(function (data) {
                            $$("ddlMemEmailList").dataBind(data, "group_id", "group_name", "Select");
                        });
                        $$("btnAddEmailCommn").show();
                        $$("btnRemEmailCommn").show();
                    }*/
                });
               
                page.controls.grdSenderDetails.width("1300px");
                page.controls.grdSenderDetails.height("300px");
                page.controls.grdSenderDetails.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Customer Name", 'width': "180px", 'dataField': "cust_name" },
                        { 'name': "Email", 'width': "220px", 'dataField': "email" },
                        { 'name': "Mobile No", 'width': "150px", 'dataField': "phone_no" },
                        { 'name': "Address", 'width': "200px", 'dataField': "address" },
                        { 'name': "Reward Plan", 'width': "150px", 'dataField': "reward_plan_name" },
                        { 'name': "Reward Points", 'width': "150px", 'dataField': "total_reward_point" },
                        {
                            'name': "Action",
                            'width': "60px",
                            'dataField': "cust_no",
                            itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        }
                    ]
                });
                page.controls.grdSenderDetails.dataBind([]);
                page.controls.grdSenderDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    //To Handle removing an item from list.
                    if (action == "delete") {
                        page.controls.grdSenderDetails.deleteRow(rowId);

                    }
                }
                page.controls.grdEmailDetails.width("1300px");
                page.controls.grdEmailDetails.height("300px");
                page.controls.grdEmailDetails.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "Cust No", 'width': "80px", 'dataField': "cust_no" },
                        { 'name': "Customer Name", 'width': "180px", 'dataField': "cust_name" },
                        { 'name': "Email", 'width': "180px", 'dataField': "email" },
                        { 'name': "Mobile No", 'width': "150px", 'dataField': "phone_no" },
                        { 'name': "Address", 'width': "180px", 'dataField': "address" },
                        { 'name': "Reward Plan", 'width': "120px", 'dataField': "reward_plan_name" },
                        { 'name': "Reward Points", 'width': "150px", 'dataField': "total_reward_point" },
                        {
                            'name': "Action",
                            'width': "100px",
                            'dataField': "cust_no",
                            itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        }
                    ]
                });
                page.controls.grdEmailDetails.dataBind([]);
                page.controls.grdEmailDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "delete") {
                        page.controls.grdEmailDetails.deleteRow(rowId);

                        //Recalculate after deleting a item
                        //page.calculate();

                    }
                }
                page.controls.grdListDetails.width("320px");
                page.controls.grdListDetails.height("50px");
                page.controls.grdListDetails.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "ID", 'width': "50px", 'dataField': "list_id" },
                        { 'name': "Name", 'width': "150px", 'dataField': "list_name" },
                        {
                            'name': "Action",
                            'width': "50px",
                            'dataField': "cust_no",
                            itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        }
                    ]
                });
                page.controls.grdListDetails.dataBind([]);
                page.controls.grdListDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "delete") {
                        page.controls.grdListDetails.deleteRow(rowId);
                        page.events.getDetOfMem();
                        //Recalculate after deleting a item
                        //page.calculate();

                    }
                }

                page.controls.grdListEmailDetails.width("320px");
                page.controls.grdListEmailDetails.height("50px");
                page.controls.grdListEmailDetails.setTemplate({
                    selection: "Single",
                    columns: [
                        { 'name': "ID", 'width': "50px", 'dataField': "list_id" },
                        { 'name': "Name", 'width': "180px", 'dataField': "list_name" },
                        {
                            'name': "Action",
                            'width': "50px",
                            'dataField': "cust_no",
                            itemTemplate: "<input action='delete' style='padding:0px;font-size: 10px;' type='button' class='buttonSecondary' title ='Remove' value='Remove' /> "
                        }
                    ]
                });
                page.controls.grdListEmailDetails.dataBind([]);
                page.controls.grdListEmailDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    if (action == "delete") {
                        page.controls.grdListEmailDetails.deleteRow(rowId);
                        page.events.getDetOfEmailMem();
                        //Recalculate after deleting a item
                        //page.calculate();

                    }
                }

                $$("lblCategoryName").value("Name");
                $$("lblCategoryEmail").value("Name");

                //var searchViewData = [];
                //if (CONTEXT.ENABLE_EMAIL == "true")
                //    searchViewData({ view_no: "EMAIL", view_name: "EMAIL" })
                //if (CONTEXT.ENABLE_INVOCE_SMS == "true")
                //    searchViewData({ view_no: "SMS", view_name: "SMS" })
                //$$("ddlcommunicationtype").dataBind(searchViewData, "view_no", "view_name");
            }
            
        };


        
        page.events.btnAddCommn_click= function () {
            $$("pnlMemAdd").open();
            $$("pnlMemAdd").title("Add List");
            $$("pnlMemAdd").width(400);
            $$("pnlMemAdd").height(250);
            page.loadCustomer();
        }

        page.events.btnAddEmailCommn_click = function () {
            $$("pnlMemEmailAdd").open();
            $$("pnlMemEmailAdd").title("Add List");
            $$("pnlMemEmailAdd").width(400);
            $$("pnlMemEmailAdd").height(250);
            page.loadEmailCustomer();
        }

        page.events.btnAddMemList_click = function () {
            var data = $$("ddlMemList").selectedValue();
            var list = {};
            if ($$("ddlmychurchtype").selectedValue() == 1) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "",
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.cust_no;
                        list.list_name = items.cust_name;
                    })
                    page.controls.grdListDetails.createRow(list);
                    $$("pnlMemAdd").close();
                    page.events.getDetOfMem();
                });
            }
            else if ($$("ddlmychurchtype").selectedValue() == 2) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "cust_no=" + $$("ddlMemList").selectedValue(),
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.cust_no;
                        list.list_name = items.first_name;
                    })
                    page.controls.grdListDetails.createRow(list);
                    $$("pnlMemAdd").close();
                    page.events.getDetOfMem();
                });

            }
            else if ($$("ddlmychurchtype").selectedValue() == 3) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "group_id=" + $$("ddlMemList").selectedValue(),
                    sort_expression: ""
                }
                page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.allmemberPromotion.getGrpCustById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.group_id;
                        list.list_name = items.group_name;
                    });
                    page.controls.grdListDetails.createRow(list);
                    $$("pnlMemAdd").close();
                    page.events.getDetOfMem();
                });
            }
            else if ($$("ddlmychurchtype").selectedValue() == 4) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "reward_plan_id=" + $$("ddlMemList").selectedValue(),
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.rewardService.getRewardPlanById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.reward_plan_id;
                        list.list_name = items.reward_plan_name;
                    })
                    page.controls.grdListDetails.createRow(list);
                    $$("pnlMemAdd").close();
                    page.events.getDetOfMem();
                });
            }
            else if ($$("ddlmychurchtype").selectedValue() == 5) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "group_id=" + $$("ddlMemList").selectedValue(),
                    sort_expression: ""
                }
                page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.allmemberPromotion.getGrpMemById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.group_id;
                        list.list_name = items.group_name;
                    });
                    page.controls.grdListDetails.createRow(list);
                    $$("pnlMemAdd").close();
                    page.events.getDetOfMem();
                });
                page.events.getDetOfMem();
            }
        }

        page.events.getDetOfMem = function () {
            page.controls.grdSenderDetails.dataBind([]);
            var todate = new Date();
            var id = $$("ddlmychurchtype").selectedValue();
            
            if (id == 1) {
                $(page.controls.grdListDetails.getAllRows()).each(function (i, row) {
                    //var data = {
                    //    cust_no: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                    //    //year: todate.getFullYear()
                    //}
                    //page.customerAPI.getValue(data, function (data) {
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                        page.controls.grdSenderDetails.dataBind(item);
                    });
                });
            }
            if (id == 2) {
                $(page.controls.grdListDetails.getAllRows()).each(function (i, row) {
                    var data = {
                        cust_no: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        //year: todate.getFullYear()
                    }
                    page.customerAPI.getValue(data, function (data) {
                    //page.allmemberPromotion.getCustDet(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.cust_name = items.cust_name;
                            list.cust_no = items.cust_no;
                            list.phone_no = items.phone_no;
                            list.email = items.email;
                            list.address = items.address;
                            list.reward_plan_name = items.reward_plan_name;
                            list.total_reward_point = items.total_reward_point;
                            page.controls.grdSenderDetails.createRow(list);
                        });
                        
                       // page.controls.grdSenderDetails.dataBind(data);
                    });
                });
            }
            if (id == 3) {
                $(page.controls.grdListDetails.getAllRows()).each(function (i, row) {
                    var group = {
                        group_id: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        //year: todate.getFullYear()
                    }
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "grp.group_id=" + group.group_id,
                        sort_expression: ""
                    }
                    page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.allmemberPromotion.getGrpCustByList(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.cust_name = items.cust_name;
                            list.cust_no = items.cust_no;
                            list.phone_no = items.phone_no;
                            list.email = items.email;
                            list.address = items.address;
                            list.reward_plan_name = items.reward_plan_name;
                            list.total_reward_point = items.total_reward_point;
                            page.controls.grdSenderDetails.createRow(list);
                        });
                        //page.controls.grdSenderDetails.dataBind(data);
                    });
                });
            }
            if (id == 4) {
                $(page.controls.grdListDetails.getAllRows()).each(function (i, row) {
                    var reward = {
                        reward_plan_id: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        //year: todate.getFullYear()
                    }
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "reward_plan_id=" + reward.reward_plan_id,
                        sort_expression: ""
                    }
                    page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.allmemberPromotion.getRewardDet(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.cust_name = items.cust_name;
                            list.cust_no = items.cust_no;
                            list.phone_no = items.phone_no;
                            list.email = items.email;
                            list.address = items.address;
                            list.reward_plan_name = items.reward_plan_name;
                            list.total_reward_point = items.total_reward_point;
                            page.controls.grdSenderDetails.createRow(list);
                        });
                        //page.controls.grdSenderDetails.dataBind(data);
                    });
                });
            }
           /* if (id == 5) {
                $(page.controls.grdListDetails.getAllRows()).each(function (i, row) {
                    var data = {
                        group_id: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        year: todate.getFullYear()
                    }
                    page.allmemberPromotion.getGrpMemByList(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.mem_id = items.mem_id;
                            list.mem_name = items.mem_name;
                            list.mem_email = items.mem_email;
                            list.mobile_no1 = items.mobile_no1;
                            page.controls.grdSenderDetails.createRow(list);
                        });
                        //page.controls.grdSenderDetails.dataBind(data);
                    });
                });
            }*/
        }

        page.events.btnRemCommn_click = function () {
            
            //var chrMem = $$("grdListDetails").selectedData()[0];
            var chrMem = $$("grdListDetails").selectedRowIds()[0];
            if (chrMem == undefined) {
                $$("msgPanel").show("Please select a row to delete...!");
            }
            else{
                page.controls.grdListDetails.deleteRow(chrMem);
                page.controls.grdListDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    page.controls.grdListDetails.deleteRow(rowId);
                    page.events.getDetOfMem();
                }
                page.events.getDetOfMem();
                $$("msgPanel").hide();
            }
        }
        page.events.btnRemEmailCommn_click = function () {

            //var chrMem = $$("grdListDetails").selectedData()[0];
            var chrMem = $$("grdListEmailDetails").selectedRowIds()[0];
            if (chrMem == undefined) {
                $$("msgPanel").show("Please select a row to delete...!");
            }
            else {
                page.controls.grdListEmailDetails.deleteRow(chrMem);
                page.controls.grdListEmailDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
                    page.controls.grdListEmailDetails.deleteRow(rowId);
                    page.events.getDetOfEmailMem();
                }
                page.events.getDetOfEmailMem();
                $$("msgPanel").hide();
            }
        }


        page.events.btnAddMemEmailList_click = function () {
            var data = $$("ddlMemEmailList").selectedValue();
            var list = {};
            if ($$("ddlmychurchtypes").selectedValue() == 1) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "cust_no=" + $$("ddlMemEmailList").selectedValue(),
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.cust_no;
                        list.list_name = items.first_name;
                    })
                    page.controls.grdListEmailDetails.createRow(list);
                    $$("pnlMemEmailAdd").close();
                    page.events.getDetOfEmailMem();
                });
            }
            else if ($$("ddlmychurchtypes").selectedValue() == 2) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "cust_no=" + $$("ddlMemEmailList").selectedValue(),
                    sort_expression: ""
                }
                page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.cust_no;
                        list.list_name = items.first_name;
                    })
                    page.controls.grdListEmailDetails.createRow(list);
                    $$("pnlMemEmailAdd").close();
                    page.events.getDetOfEmailMem();
                });

            }
            else if ($$("ddlmychurchtypes").selectedValue() == 3) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "group_id=" + $$("ddlMemEmailList").selectedValue(),
                    sort_expression: ""
                }
                page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.allmemberPromotion.getGrpCustById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.group_id;
                        list.list_name = items.group_name;
                    });
                    page.controls.grdListEmailDetails.createRow(list);
                    $$("pnlMemEmailAdd").close();
                    page.events.getDetOfEmailMem();
                });
            }
            else if ($$("ddlmychurchtypes").selectedValue() == 4) {
                //page.allmemberPromotion.getRewardDetById(data, function (data) {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "reward_plan_id=" + $$("ddlMemEmailList").selectedValue(),
                    sort_expression: ""
                }
                page.rewardplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                //page.rewardService.getRewardPlanById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.reward_plan_id;
                        list.list_name = items.reward_plan_name;
                    })
                    page.controls.grdListEmailDetails.createRow(list);
                    $$("pnlMemEmailAdd").close();
                    page.events.getDetOfEmailMem();
                });
            }
            else if ($$("ddlmychurchtypes").selectedValue() == 5) {
                page.allmemberPromotion.getGrpMemById(data, function (data) {
                    $(data).each(function (i, items) {
                        list.list_id = items.group_id;
                        list.list_name = items.group_name;
                    });
                    page.controls.grdListEmailDetails.createRow(list);
                    $$("pnlMemEmailAdd").close();
                    page.events.getDetOfEmailMem();
                });
                page.events.getDetOfEmailMem();
            }
        }

        page.events.getDetOfEmailMem = function () {
            page.controls.grdEmailDetails.dataBind([]);
            var todate = new Date();
            var id = $$("ddlmychurchtypes").selectedValue();

            if (id == 1) {
                $(page.controls.grdListEmailDetails.getAllRows()).each(function (i, row) {
                    //var data = {
                    //    cust_no: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                    //    //year: todate.getFullYear()
                    //}
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "",
                        sort_expression: ""
                    }
                    page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (item) {
                    //page.allmemberPromotion.getCustomerDetById(data, function (data) {
                        page.controls.grdEmailDetails.dataBind(data);
                    });
                });
            }
            if (id == 2) {
                $(page.controls.grdListEmailDetails.getAllRows()).each(function (i, row) {
                    var data = {
                        cust_no: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        //year: todate.getFullYear()
                    }
                    page.customerAPI.getValue(data, function (data) {
                    //page.allmemberPromotion.getCustDet(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.cust_name = items.cust_name;
                            list.cust_no = items.cust_no;
                            list.phone_no = items.phone_no;
                            list.email = items.email;
                            list.address = items.address;
                            list.reward_plan_name = items.reward_plan_name;
                            list.total_reward_point = items.total_reward_point;
                            page.controls.grdEmailDetails.createRow(list);
                        });
                        //page.controls.grdEmailDetails.dataBind(data);
                    });
                });
            }
            if (id == 3) {
                $(page.controls.grdListEmailDetails.getAllRows()).each(function (i, row) {
                    var group = {
                        group_id: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        //year: todate.getFullYear()
                    }
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "grp.group_id=" + group.group_id,
                        sort_expression: ""
                    }
                    page.customergroupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.allmemberPromotion.getGrpCustByList(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.cust_no = items.cust_no;
                            list.cust_name = items.cust_name;
                            list.phone_no = items.phone_no;
                            list.email = items.email;
                            list.address = items.address;
                            list.reward_plan_name = items.reward_plan_name;
                            list.total_reward_point = items.total_reward_point;
                            page.controls.grdEmailDetails.createRow(list);
                        });
                       // page.controls.grdEmailDetails.dataBind(data);
                    });
                });
            }
            if (id == 4) {
                $(page.controls.grdListEmailDetails.getAllRows()).each(function (i, row) {
                    var reward = {
                        reward_plan_id: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        //year: todate.getFullYear()
                    }
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "reward_plan_id=" + reward.reward_plan_id,
                        sort_expression: ""
                    }
                    page.customerAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    //page.allmemberPromotion.getRewardDet(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.cust_name = items.cust_name;
                            list.cust_no = items.cust_no;
                            list.phone_no = items.phone_no;
                            list.email = items.email;
                            list.address = items.address;
                            list.reward_plan_name = items.reward_plan_name;
                            list.total_reward_point = items.total_reward_point;
                            page.controls.grdEmailDetails.createRow(list);
                        });
                        //page.controls.grdEmailDetails.dataBind(data);
                    });
                });
            }
            /*if (id == 5) {
                $(page.controls.grdListEmailDetails.getAllRows()).each(function (i, row) {
                    var data = {
                        group_id: parseFloat($(row).find("[datafield=list_id]").find("div").html()),
                        year: todate.getFullYear()
                    }
                    page.allmemberPromotion.getGrpMemByList(data, function (data) {
                        var list = {};
                        $(data).each(function (i, items) {
                            list.mem_id = items.mem_id;
                            list.mem_name = items.mem_name;
                            list.mem_email = items.mem_email;
                            list.mobile_no1 = items.mobile_no1;
                            page.controls.grdEmailDetails.createRow(list);
                        });
                        //page.controls.grdEmailDetails.dataBind(data);
                    });
                });
            }*/
        }

        //page.events.btnRemEmailCommn_click = function () {
        //    var chrMem = $$("grdListEmailDetails").selectedData()[0];
        //    page.controls.grdListEmailDetails.deleteRow(chrMem);
        //    page.controls.grdListEmailDetails.rowCommand = function (action, actionElement, rowId, row, rowData) {
        //        page.controls.grdListEmailDetails.deleteRow(rowId);
        //        page.events.getDetOfEmailMem();
        //    }
        //    page.events.getDetOfEmailMem();
        //}
        

    });
}