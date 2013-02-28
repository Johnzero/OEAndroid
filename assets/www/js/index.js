/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    dbname :"V7",
    
    initialize: function() {
        //$.support.cors=true;
        //$.mobile.allowCrossDomainPages= true;
        this.bindEvents();
    },
    
    configpage: function () {
        $.mobile.changePage($("#config"), "pop",true,true);    
    },
    
    mainpage: function () {
        $.mobile.changePage($("#main"), "pop");    
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.exitapp, false);
        //document.addEventListener("online",this.onDeviceReady, false);
        document.addEventListener("offline",this.onDeviceOffline, false)
    },
    
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    
    exitapp: function () {
        
        navigator.app.exitApp();
        
    },
        
    onDeviceOffline :function () {
        $.mobile.loading('show', {
            text: '',
            textVisible: true,
            theme: 'a',
            html: "<h1><b>没有可用的网络</b></h1>"
        });
        setTimeout(function () {
            navigator.app.exitApp();
        },2000);
    },
    
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        //$.mobile.changePage($("#config"), "slideup");
        //setTimeout(function(){self.location="spec.html"},2000);
    },

    //Connect to Opnerp server
    connect: function (url) {
        var url = $("#url").val();
        var username = $("#username").val();
        var passwd = $("#passwd").val();
        if (!(username && passwd && url)) {
            $.mobile.loading('show', {
            text: '',
            textVisible: true,
            theme: 'a',
            html: "<h1><b>请输入用户名和密码</b></h1>"
            });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
            },1000);
            return true;
        };
        app.instance = openerp.init(["web"]); // get a new instance
        app.instance.session.session_bind(url); // bind it to the right hostname
        app.connected = app.instance.session.session_authenticate(app.dbname, username, passwd, false);//set_cookie
    },
    
    checkconnect: function () {
        if (!app.connected) {
            $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html: "<h1><b>请先连接。</b></h1>"
                });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
                },1000);
            return false;
        }
        else if (app.connected.state() == "rejected") {
            $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html: "<h1>请输入正确的用户名和密码</h1>"
                });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
                },1000);
            return false;
            
        }
        else if (app.connected.state() == "pending") {
            $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html:"<h1><b>请等待,连接中...</b></h1>"
                });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
                },1000);
            return false;
            
        }
        else if (app.connected.state() == "resolved") {
            return true;
        }
        else {
            $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html: "<h1><b>错误。</b></h1>"
                });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
                },1000);
            return false;
        }
    },
    
    loadingmsg: function () {
        $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html: "<h1><b>读取中...</b></h1>"
        });
    },
    
    read: function () {
        if (!app.checkconnect()) {
            return true;  
        };
        app.loadingmsg();
        $('#module').empty().append( $("<option value=''>选择模块...</option>")); 
        $('#module-menu').empty().append( $("<option value=''>选择模块...</option>")); 
        app.connected.then(function() {
            var ds = new app.instance.web.DataSetSearch(null, "ir.model");
            ds.read_slice(['name','model'], {})
            .then(function(models){
                _.each(models,function(m,i){
                    $("#module").append("<option name="+m.name+"value="+ i + ">" + m.model + "</option>");
                    //$("#module").append("<option value="+ m.state + ">" + m.name + "</option>");
                    //<option value="m.model">m.name</option>
                });
            })
            .done(function () {
                $.mobile.hidePageLoadingMsg();
                $("#module").selectmenu("refresh");
            });
        });
    },
    
    test: function () {
        var model =new app.instance.web.Model("res.users");
        var func = new app.instance.web.Model("scrapy").get_func("write");
        func([2],{"name":"111111"}).done(function (res) {

            console.log(res);

        });
    },
    
    write: function () {
        
        var func = new app.instance.web.Model("res.users").get_func("write");
        func([1],{"name":"111111"}).done(function (res) {
            console.log(res);
        });
        
    },
    perm_read: function () {
        
        var func = new app.instance.web.Model("res.users").get_func("perm_read");
        func([1]).then(function (res) {

            console.log(res);

        });
    },
        
    handlevent: function () {
        if (!app.checkconnect()) {
          return true;  
        };
        app.connected.then(function() {
            var ds = new app.instance.web.DataSetSearch(null, "ir.model");
            ds.read_slice(['name','model'], {}).then(function(models){
                _.each(models,function(m,i){
                    $("#result").append("<li value="+ m.model + ">" + m.name + "</li>");
                    var myselect = $("#result");
                    myselect.listview("refresh");
                    //<option value="m.model">m.name</option>
                });
            });
            var myselect = $("#result");
            myselect.listview("refresh");
        });
    },
    
    addresult:function () {
        $("#result").empty();
        if (!$('option:selected').val()) {
            $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html:"<h1><b>选择模块</b></h1>"
                });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
                },1000);
            return false;            
        };
    },
    
    create: function () {
        if (!app.checkconnect()) {
            return true;  
        };
        //app.addresult();
        app.loadingmsg();
        var module = $("#module-button").text().replace("_",".").replace(" ",'');
        var func = new app.instance.web.Model("scrapys").get_func("create");
        console.log(func({"name":'asdfasdfaa111'}));
        func({"name":'asdfasdfaa111'})
        .done(function (res) {
            $("#result").append("<li>" + res + "</li>");
            var myselect = $("#result");
            myselect.listview("refresh");
            $.mobile.hidePageLoadingMsg();
        })
        .fail(function (res) {
            $.mobile.loading('show', {
                text: '',
                textVisible: true,
                theme: 'a',
                html:"<h1><b>错误！</b></h1>"
                });
            setTimeout(function () {
                $.mobile.hidePageLoadingMsg();
                },1000);
            return false;
        });
    },
    
    fields: function () {
        if (!app.checkconnect()) {
            return true;  
        };
        app.addresult();
        app.loadingmsg();
        var module = $('option:selected').text().replace("_",".").replace(" ",'');
        
        var func = new app.instance.web.Model("res.users").get_func("read");
        //var id = $('option:selected').val();
        //var Users = new app.instance.web.Model("res.users");
        //var ds = new app.instance.web.DataSet(null,module);
        
    },

    demo:function () {
        
        var func = new app.instance.web.Model("res.users").get_func("read");
        
        func(3, ["name", "company_id"]).then(function(res) {
            console.log(res);
            $("#result").append("<li>" + res.name + "</li>");
            var myselect = $("#result");
            myselect.listview("refresh");
            $.mobile.hidePageLoadingMsg();
        ;});
        
        Users.get_func("read")(Users.uid, ["name", "company_id"]).then(function (users) {
            cosole.log(users);
            $("#result").append("<li>" + users.name + "</li>");
            var myselect = $("#result");
            myselect.listview("refresh");
        });
        
        
        Users.query(['name']).all()
        .then(function (users) {
            _.each(users,function(m,i){
            $("#result").append("<li>" + m.name + "</li>");
            })
            // do work with users records
        }).done(function () {
            var myselect = $("#result");
            myselect.listview("refresh");
            $.mobile.hidePageLoadingMsg();
            });
    }
};
