$.fn.registerPage = function () {
    return $.pageController.getControl(this, function (page,$$) {
        //Import Services required
        page.userService = new UserService();
        page.companyService = new CompanyService();
        page.productAPI = new ProductAPI();
        page.priceplanAPI = new PricePlanAPI();
        page.instancesAPI = new InstancesAPI();
        page.companyAPI = new CompanyAPI();
        page.objectPermissionAPI = new ObjectPermissionAPI();
        page.companyproductAPI = new CompanyProductAPI();
        page.cloudIntegrationAPI = new CloudIntegrationAPI();
        page.groupAPI = new GroupAPI();
        page.UserGroupAPI = new UserGroupAPI();

        $("body").css("background-image", "url('/" + appConfig.root + "/login/view/register-page/images/reg_background.png')");

        page.events = {
            page_load: function () {
                var data = {
                    start_record: 0,
                    end_record: "",
                    filter_expression: "prod_id in (6,7,8,9,26,27,28,29,30)",
                    sort_expression: ""
                }
                page.productAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                    $$("ddlProducts").dataBind(data, "prod_id", "prod_name");
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: /*"plan_id=6 and "*/"prod_id=" + $$("ddlProducts").selectedValue(),
                        sort_expression: ""
                    }
                    page.priceplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlPricePlan").dataBind(data, "plan_id", "plan_type");
                    });
                    var data = {
                        start_record: 0,
                        end_record: "",
                        filter_expression: "prod_id=" + $$("ddlProducts").selectedValue() + " and shared_flag=1",
                        sort_expression: ""
                    }
                    page.instancesAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                        $$("ddlInstances").dataBind(data, "instance_id", "instance_name");
                    });
                    $$("ddlProducts").selectionChange(function (item) {
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "prod_id=" + $$("ddlProducts").selectedValue(),
                            sort_expression: ""
                        }
                        page.priceplanAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlPricePlan").dataBind(data, "plan_id", "plan_type");
                        });
                        var data = {
                            start_record: 0,
                            end_record: "",
                            filter_expression: "prod_id=" + $$("ddlProducts").selectedValue() + " and shared_flag=1",
                            sort_expression: ""
                        }
                        page.instancesAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (data) {
                            $$("ddlInstances").dataBind(data, "instance_id", "instance_name");
                        });
                    });
                });
            }
        }
        page.events.btnRegister_click = function () {
            try {
                if (!ValidateUserName($$("txtFullName").value())) {
                    $$("txtFullName").focus();
                    throw "Full Name Is Not Valid";
                }
                if (!ValidateDomainName($$("txtUserName").value())) {
                    $$("txtUserName").focus();
                    throw "Domain Name Is Not Valid";
                }
                if (!ValidateEmail($$("txtEmailId").value())) {
                    $$("txtEmailId").focus();
                    throw "Email Id Is Not Valid";
                }
                if (!ValidateMobileNo($$("txtPhoneNo").value())) {
                    $$("txtPhoneNo").focus();
                    throw "Mobile No Is Not Valid";
                }
                if ($$("txtPassword").value() != $$("txtConfirmPassword").value()) {
                    $$("txtPassword").focus();
                    throw "Password Did Not Matched";
                }
                if (!ValidateUserName($$("txtCompanyName").value())) {
                    $$("txtCompanyName").focus();
                    throw "Company Name Is Not Valid";
                }
                if (!ValidateUserName($$("txtProductName").value())) {
                    $$("txtProductName").focus();
                    throw "Product Name Is Not Valid";
                }
                //if (!ValidateGSTNo($$("txtGstNo").value())) {
                //    $$("txtGstNo").focus();
                //    throw "GST No Is Not Valid";
                //}
                //if ($$("txtAddressLine1").value() == "") {
                //    $$("txtAddressLine1").focus();
                //    throw "Address Line1 Is Not Valid";
                //}
                //if ($$("txtAddressLine2").value() == "") {
                //    $$("txtAddressLine2").focus();
                //    throw "Address Line2 Is Not Valid";
                //}
                var registerData = {
                    full_name: page.controls.txtFullName.value(),
                    comp_name: page.controls.txtCompanyName.value(),
                    user_name: page.controls.txtUserName.value(),
                    email_id: page.controls.txtEmailId.value(),
                    phone_no: page.controls.txtPhoneNo.value(),
                    password: page.controls.txtPassword.value(),
                };
                page.companyAPI.postValue(registerData, function (comp_data) {
                    var user_id = comp_data[0].user_id;
                    var data = {
                        comp_id: comp_data[0].comp_id,
                        prod_id: $$("ddlProducts").selectedValue(),
                        comp_prod_name: page.controls.txtProductName.value(),
                        instance_id: $$("ddlInstances").selectedValue(),
                        price_plan_id: $$("ddlPricePlan").selectedValue(),
                    };
                    page.companyproductAPI.postValue(data, function (data) {
                        var comp_prod_id = data[0].i_comp_prod_id
                        page.instancesAPI.getValue($$("ddlInstances").selectedValue(), function (ins_data) {
                            var finfacts_data = {
                                comp_name: page.controls.txtCompanyName.val(),
                                user_id: comp_prod_id
                            }
                            page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service3, finfacts_data, function (fin_data) {
                                var shopon_data = {
                                    comp_name: page.controls.txtCompanyName.val(),
                                    user_id: comp_prod_id,
                                    finfacts_comp_id: fin_data[0].comp_id,
                                    finfacts_per_id: fin_data[0].comp_per_id,
                                    comp_prod_id: comp_prod_id,
                                    comp_prod_name: $$("ddlProducts").selectedData().prod_name,
                                    price_plan_id: $$("ddlPricePlan").selectedValue(),//check it
                                }
                                page.cloudIntegrationAPI.postValueWithURL(ins_data[0].server + "//" + ins_data[0].service1, shopon_data, function (store) {
                                    if (store.length > 0) {
                                        var Comp_Store = {
                                            perm_id: 1,
                                            obj_type: "Product::CompProd::Store",
                                            obj_id: $$("ddlProducts").selectedValue() + "::" + comp_prod_id + "::" + store[0].store_id,
                                            user_id: user_id,
                                        }
                                        page.objectPermissionAPI.postValue(Comp_Store, function (Object) {
                                            var data = {
                                                start_record: 0,
                                                end_record: "",
                                                filter_expression: "comp_prod_id=" + comp_prod_id,
                                                sort_expression: "",
                                            }
                                            page.groupAPI.searchValues(data.start_record, data.end_record, data.filter_expression, data.sort_expression, function (group_data) {
                                                var member = {
                                                    user_id: user_id,
                                                    comp_prod_id: comp_prod_id,
                                                    group_id: group_data[1].group_id,
                                                };
                                                page.UserGroupAPI.postValue(member, function (data) {
                                                    alert("Registered Successfully Your Id :" + user_id);
                                                    //if (enable_email) {
                                                    //    page.sendRegEmail(user_id, function () {
                                                    //    });
                                                    //}
                                                    //if (enable_sms) {
                                                    //    page.sendRegSMS(user_id, function () {
                                                    //    });
                                                    //}
                                                });
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    });
                }, function () {
                    alert("This Email Id or Phone No Is Already Registered.");
                });
            } catch (e) {
                alert(e);
            }
        }
        page.events.btnNew_click = function () {
            $$("txtName").val('');
            $$("Password").val('');
            $$("txtName").val('');
            $$("txtCompanyName").val('');
            $$("txtPhone").val('');
            $$("txtEmail").val('');
            $$("ddlBusiness").selectedValue("-1");
        }
        page.events.btnBack_click = function () {
            window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
        }

    });



}
