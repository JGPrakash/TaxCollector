$.fn.shopOnMenu = function () {
    $(this).find("img").attr("src", "/" + appConfig.root + "/ui/ui/images/menu_grid-128.png");

    $(this).mousemove(function () {
        $(".menu-shopon").css("width", "100%");
        $(".menu-shopon").css("height", "auto");
        $(".menu-shopon").css("display", "");
    });
    $(this).hover(function () {
        $(this).css("background-color", "darkgray");
        $(".menu-shopon").css("width", "100%");
        $(".menu-shopon").css("height", "auto");
        $(".menu-shopon").css("display", "");
    }, function () {
        $(this).css("background-color", "");
        //$(".menu-shopon").css("width", "30px");
        setTimeout(function () {
            if ($(".menu-shopon").attr("hover") != "true") {
                $(".menu-shopon").css("display", "none");
            }
        }, 1000);
    });
    $(".menu-shopon").hover(function () {
        $(this).css("width", "100%");
        $(".menu-shopon").css("height", "auto");
        $(".menu-shopon").attr("hover", "true");
        $(".menu-shopon").css("display", "");
    }, function () {
        //$(this).css("width", "30px");
        $(".menu-shopon").attr("hover", "false");
        $(".menu-shopon").css("display", "none");
    });

    $(".menu-shopon>div:first>div").hover(function () {
        $(this).find("span").css("border-bottom", "solid 3px gray");
        //   $(this).css("background-color", "gray");
    }, function () {
        $(this).find("span").css("border-bottom", "");
    });

    $(".menu-shopon>div:first>div").click(function () {
        $(".menu-shopon").css("width", "30px");
    });

    //if (window.mobile) {
       // $(".menu-shopon").css("height", "100px");
    //    $(".menu-shopon").delay(000).fadeOut();
    //}
}

var CONTEXT = {};
//CONTEXT.CurrentLanguage = "ta";
CONTEXT.CurrentLanguage = "en";
CONTEXT.CurrentSecondaryLanguage = "en";
CONTEXT.SEARCH_GRID_HEIGHT = "530px";
CONTEXT.printServerURL = "localhost";
CONTEXT.FSSAI_NO = "121416029000298";

$.fn.masterPage = function () {
    return $.pageController.getPage(this, function (page, $$) {
        page.template("/" + appConfig.root + "/login/view/master-page/master-page.html");
        page.userService = new UserService();
        page.userpermissionAPI = new UserPermissionAPI();
        page.settingsAPI = new SettingsAPI();
        page.menuAPI = new MenuAPI();
        page.storeAPI = new StoreAPI();
        page.userAPI = new UserAPI();
        page.userGroupAPI = new UserGroupAPI();
        page.controlName = "masterPage";
        page.view = {}
        page.events = {
            lblAppName_click: function () {
                document.cookie = "app_user_id="
                window.location.href = "/" + appConfig.root + "/login/view/home-page/home-page.html";
            },
            btnLogout_click: function () {
                document.cookie = "app_user_id=";
                localStorage.setItem("user_comp_id", "");
                window.location.href = "/" + appConfig.root + "/login/view/login-page/login-page.html";
            },
            page_load: function () {
                $($.parseJSON(localStorage.getItem("company_settings"))).each(function (i, item) {
                    CONTEXT[item.sett_key] = item.value_1;
                });
                //if (CONTEXT.CurrentLanguage == "ta") {
                //    document.documentElement.style.setProperty('--input-font', "400 14px bamini");
                //    document.documentElement.style.setProperty('--input-text-font', "400 14px bamini");
                //}
                //document.documentElement.style.setProperty('--english-font', "Calibri");
            },
        }
        //page.alert = function () {
            //page.userService.getExpiryAlertItems(function (data) {
            //    if (data.length != 0) {
            //        if (!("Notification" in window)) {
            //            alert("This browser does not support desktop notification");
            //        }
            //        else if (Notification.permission === "granted") {
            //            var notification = new Notification(data.length + "Items Are Going To Expired, Please Verify The Stock Report");
            //            notification.onclick = function () {
            //                window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
            //            };
            //        }
            //        else if (Notification.permission !== "denied") {
            //            Notification.requestPermission(function (permission) {
            //                if (permission === "granted") {
            //                    var notification = new Notification(data.length + "Items Are Going To Expired, Please Verify The Stock Report");
            //                    notification.onclick = function () {
            //                        window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
            //                    };
            //                }
            //            });
            //        }
            //    }
            //});
        //}

        //STOCK ALERT
        //page.stockAlert = function () {
        //    page.userService.getStockAlert(function (data) {
        //        if (data.length != 0) {
        //            if (!("Notification" in window)) {
        //                alert("This browser does not support desktop notification");
        //            }
        //            else if (Notification.permission === "granted") {
        //                var notification = new Notification(data.length + "Items Qty Is Lesser Than The Reorder Level Please Verify Stock Report");
        //                notification.onclick = function () {
        //                    window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
        //                };
        //            }
        //            else if (Notification.permission !== "denied") {
        //                Notification.requestPermission(function (permission) {
        //                    if (permission === "granted") {
        //                        var notification = new Notification(data.length + "Items Qty Is Lesser Than The Reorder Level Please Verify Stock Report");
        //                        notification.onclick = function () {
        //                           window.location.href = "/" + appConfig.root + "/shopon/view/stock-report/stock-report.html";
        //                        };
        //                    }
        //                });
        //            }
        //        }
        //    });
        //}
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}