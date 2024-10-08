
/*CoreUtil*/
var CoreUtil = (function () {
    var coreUtil = {};
    /*ajax*/
    coreUtil.sendAjax = function (url, params, ft, method, headers,noAuthorityFt,contentType, async) {
        var roleSaveLoading = top.layer.msg('Data is being submitted...',{icon: 16,time:false});
        $.ajax({
            url: url,
            cache: false,
            async: async == undefined ? true : async,
            data: params,
            type: "GET",
            contentType: contentType == undefined ? 'application/json; charset=UTF-8': contentType ,
            dataType: "json",
            beforeSend: function(request) {
                if(headers == undefined){

                }else if(headers){
                    request.setRequestHeader("authorization", CoreUtil.getData("access_token"));
                    request.setRequestHeader("refresh_token", CoreUtil.getData("refresh_token"));
                }else {
                    request.setRequestHeader("authorization", CoreUtil.getData("access_token"));
                }

            },
            success: function (res) {
                top.layer.close(roleSaveLoading);
                if (typeof ft == "function") {
                    if(res.error_code == 401001 || res.error_code == 704){ 
                        layer.msg("Sessions have expired, Please log in again.")
                        top.window.location.href="/login.html"
                    }else if(res.error_code==401002){  //
                        /**/
                        var reUrl=url;
                        var reParams=params;
                        var reFt=ft;
                        var reMethod=method;
                        var reHeaders=headers;
                        var reNoAuthorityFt=noAuthorityFt;
                        var reContentType=contentType;
                        var reAsync=async;
                        /* */
                        CoreUtil.sendAjax("/sys/user/token",null,function (res) {
                            if(res.error_code==0){
                                CoreUtil.setData("access_token",res.data);
                                /**/
                                CoreUtil.sendAjax(reUrl,reParams,reFt,reMethod,reHeaders,reNoAuthorityFt,reContentType,reAsync);
                            }else {
                                layer.msg("Sessions have expired, Please log in again.");
                                top.window.location.href="/index/login"
                            }
                        },"GET",true)
                    }else if(res.error_code==0) {
                        if(ft!=null&&ft!=undefined){
                            ft(res);
                        }

                    }else if(res.error_code==401008){//
                        if(ft!=null&&ft!=undefined){
                            noAuthorityFt(res);
                        }

                    } else {
                    	 if (url == '/login')
                         layer.msg('Login failed');
                       else
                       	 layer.msg('erro code:'+ res.error_code);
                    }

                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown) {
                top.layer.close(roleSaveLoading);
                if(XMLHttpRequest.status==404){
                    top.window.location.href="/index/404";
                }else{
                    layer.msg("There seems to be something wrong with the server! Please try later");
                }
            }
        });
    };
    /* json String*/
    coreUtil.formJson = function (frm) {  //frm：
        var o = {};
        var a = $("#"+frm).serializeArray();
        $.each(a, function() {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [ o[this.name] ];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return JSON.stringify(o);
    };
    /**/
    coreUtil.setData = function(token){
    	   if (localStorage){
            localStorage.setItem("token", token);
         };
        /*layui.data('LocalData',{
            key :key,
            value: value
        })*/
    };
    /**/
    coreUtil.getData = function(key){
        var localData = layui.data('LocalData');
        return localData[key];
    };
           
     /**/
    coreUtil.getStok = function(key){
        var stok  = "12345";
        if (localStorage)
            stok = localStorage.getItem("token") ;        
        return stok;
    };
    
    coreUtil.encode_pwd=function (val) { 
    	var str;
    	var enstr;
    	str = '{\"method\":\"set\",\"params\":'+ val + '}'; 
    	enstr = 'data=' + encodeURIComponent(str);    	
    	return enstr;   
    }; 

    coreUtil.encode_str=function (method,val,index) {    	
    	//{"method":"set","params":{"index":0,"old":{"textname":"白名单测试","url":"/hihttps/whitelist28"},"new":{"textname":"白名单测试","url":"/hihttps/whitelist28"},"key":"key-0"}}
    	var str;
    	var enstr;
    	
    	if (method == "page") {    		
    		    str = '{\"method\":\"page\",\"params\":{\"index\":' + index + ',\"old\":\"page\",\"new\":' +  val + '}}';    		
    	}     	
    	else if (method == "add") {    		
    		    str = '{\"method\":\"add\",\"params\":{\"index\":' + index + ',\"old\":\"add\",\"new\":' +  val + '}}';    		
    	}    	
    	else if (method == "set") {    		
    		    str = '{\"method\":\"set\",\"params\":{\"index\":' + index + ',\"old\":\"set\",\"new\":' +  val + '}}';      		
    	}
    	else if (method == "delete") {    		
    		    str = '{\"method\":\"delete\",\"params\":{\"key\":\"key-1\",\"index\":\"' + index + '\"}}';    		
    	}
    	else if (method == "flush") {   
    		    str = '{\"method\":\"flush\"}'; 
    	} 
    	
    	else if (method == "login") {    		
    		    str = '{\"method\":\"login\",\"params\":' + val + '}';      		
    	}
    	   	
    	else {
    		    str = '{\"method\":\"' + method + '\"}'; 
    	}
    	
    	
    	enstr = 'data=' + encodeURIComponent(str);    	
    	return enstr;
    	
    };	
    coreUtil.formattime=function (val) {
        var date=new Date(val);
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        month=month>9?month:('0'+month);
        var day=date.getDate();
        day=day>9?day:('0'+day);
        var hh=date.getHours();
        hh=hh>9?hh:('0'+hh);
        var mm=date.getMinutes();
        mm=mm>9?mm:('0'+mm);
        var ss=date.getSeconds();
        ss=ss>9?ss:('0'+ss);
        var time=year+'-'+month+'-'+day+' '+hh+':'+mm+':'+ss;
        return time;
    };

    coreUtil.formattime1=function (val) {
        var date=new Date(val);
        var year=date.getFullYear();
        var month=date.getMonth()+1;
        month=month>9?month:('0'+month);
        var day=date.getDate();
        day=day>9?day:('0'+day);
        var time=year+'-'+month+'-'+day;
        return time;
    };
    return coreUtil;
})(CoreUtil, window);
