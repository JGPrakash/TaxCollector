﻿var headHtml = ' <meta name="viewport" content="width=device-width, initial-scale=1"><script src="/' + appConfig.root + '/core/jquery-2.1.3.min.js"></script>'; 
//upgrade to jquery 3.2.1.
//var headHtml = ' <meta name="viewport" content="width=device-width, initial-scale=1"><script src="/' + appConfig.root + '/core/jquery-3.2.1.min.js"></script>';
headHtml = headHtml + '  <script src="/' + appConfig.root + '/ui/ui/bootstrap-3.3.7/js/bootstrap.min.js"></script>';
headHtml = headHtml + '  <link href="/' + appConfig.root + '/ui/ui/bootstrap-3.3.7/css/bootstrap.min.css" rel="stylesheet">';

headHtml = headHtml + '</script> <script src="/' + appConfig.root + '/core/JSON2.js"></script> ';
headHtml = headHtml + '<script src="/' + appConfig.root + '/core/common.js"></script>';


headHtml = headHtml + '<!--testWork in Edge mode.So minimum IE11.-->';
headHtml = headHtml + '<meta http-equiv="X-UA-Compatible" content="IE=Edge">';
headHtml = headHtml + '<meta name="viewport" content="width=device-width, initial-scale=1">';
headHtml = headHtml + '<!--Set application title and icon-->';
headHtml = headHtml + '<!--Work in Edge mode.So minimum IE11.-->';
headHtml = headHtml + '<title>TaxCollector</title>';



headHtml = headHtml + '<link rel="shortcut icon" href="/' + appConfig.root + '/image/test.ico">';



headHtml = headHtml + '  <!--third party ui control-->';
headHtml = headHtml + '  <script src="/' + appConfig.root + '/ui/ui/bootstrap-datetimepicker/js/moment.js"></script>';

headHtml = headHtml + '  <link href="/' + appConfig.root + '/ui/ui/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css" rel="stylesheet">';
headHtml = headHtml + '  <script src="/' + appConfig.root + '/ui/ui/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js"></script>';

headHtml = headHtml + '  <link href="/' + appConfig.root + '/ui/jqueryui/jquery-ui.css" rel="stylesheet">';
headHtml = headHtml + '  <script src="/' + appConfig.root + '/ui/jqueryui/jquery-ui.js"></script>';
headHtml = headHtml + '  <!--ui kit - application specific ui controls like button,tree etc-->';
headHtml = headHtml + '  <link href="/' + appConfig.root + '/ui/ui/ui.css" rel="stylesheet">';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/ui/ui/ui.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/ui/jspdf/jspdf.min.js"></script>';

headHtml = headHtml + ' <script src="/' + appConfig.root + '/ui/ui/print.js"></script>';

headHtml = headHtml + '   <!-- Frashopmework library -->';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/core/core.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/core/en.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/core/ta.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/view/master-page/master-page.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/user/user-service.js"></script>';
headHtml = headHtml + '  <link href="/' + appConfig.root + '/login/view/master-page/master-page.css" rel="stylesheet">';
headHtml = headHtml + ' <link href="/' + appConfig.root + '/ui/ui/font-awesome/css/font-awesome.min.css" rel="stylesheet" />';

headHtml = headHtml + ' <script src="/' + appConfig.root + '/ui/dashboard/js/perfect-scrollbar.jquery.min.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/store-api.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/user-api.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/user-group-api.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/user-permission-api.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/settings-api.js"></script>';
headHtml = headHtml + ' <script src="/' + appConfig.root + '/login/service/menu-api.js"></script>';

headHtml = headHtml + '  <script src="/' + appConfig.root + '/ui/ui/spinner/spin.min.js"></script>';
headHtml = headHtml + '  <script src="/' + appConfig.root + '/ui/ui/spinner/blockUI.js"></script>';

headHtml = headHtml + '  <script src="/' + appConfig.root + '/core/tamil.js"></script>';
headHtml = headHtml + '  <script src="/' + appConfig.root + '/core/tamil-common.js"></script>';


document.write(headHtml);


  
  

 