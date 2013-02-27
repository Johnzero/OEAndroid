

//$.support.cors=true;
//$.mobile.allowCrossDomainPages= true;

$(document).bind("mobileinit", function(){
    $.mobile.selectmenu.prototype.options.nativeMenu = false;
    $.extend(  $.mobile , {  
     defaultPageTransition: 'none'  
    });
});