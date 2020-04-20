/// <reference path="../sales-pos/sales-pos.html" />

$.fn.homePage = function() {
    return $.pageController.getControl(this, function(page, $$) {
        //Import Services required
        page.userService = new UserService();
        //page.compService = new CompanyService();
        page.userpermissionAPI = new UserPermissionAPI();
        page.menuAPI = new MenuAPI();
        page.events = {
            btnLogin_click: function() {
                page.userService.getUserById(page.controls.txtUserId.val(), function(data) {
                    if (data.length == 1) {
                        if (page.controls.txtUserId.val() == data[0].password) {
                            window.location.href = "view/pages/sales-pos/sales-pos.html";
                        } else {
                            alert("Invalid User Id or Password !");
                        }
                    } else {
                        alert("Invalid User Id or Password !");
                    }
                });

            },
            page_load: function () {
                
            }
        }

    });



}