var fs, win, area,downhide;
var code;
var kick = "";

//通过cookie记住用户名,Ext.state.Manager的初始化一定要放在所有代码的开头，否则不会生效
var cp = new Ext.state.CookieProvider({
	expires:new Date(new Date().getTime()+(1000*60*60*24*30))
});
Ext.state.Manager.setProvider(cp);

var buildWin = function() {
	// var pro= new Ext.data.ArrayStore({
	// fields: ['text', 'value'],
	// data : eval("("+getPro()+")") // from states.js
	// });

	fs = new Ext.form.FormPanel({
				layout : 'form',
				defaultType : 'textfield',
				defaults : {
					width : 120
				},
				bodyStyle : 'padding:50px 0 0',
				labelWidth : 80,
				labelAlign : 'right',
				height : 200,
				frame : true,
				items : [{
							id : 'uid',
							fieldLabel : '登录帐号',
							name : 'uid',
							initEvents : function() {
								var keyPress = function(e) {
									var blockchars = ' ';
									var c = e.getCharCode();
									if (c == 13) {
										if (Ext.fly("uid").getValue() == "") {
											Ext.Msg.alert("提示", "用户名不能为空！",
													function() {
														Ext.fly("uid").focus();
													});
											Ext.fly("uid").focus();
											return;
										}
										Ext.fly("pwd").focus();
									}
								};
								this.el.on("keypress", keyPress, this);
							}
						}, {
							id : 'pwd',
							fieldLabel : '登录密码',
							name : 'pwd',
							inputType : 'password',
							initEvents : function() {
								var keyPress = function(e) {
									var blockchars = ' ';
									var c = e.getCharCode();
									if (c == 13) {
										if (Ext.fly("pwd").getValue() == "") {
											Ext.Msg.alert("提示", "登录密码不能为空！",
													function() {
														Ext.fly("pwd").focus();
													});
											Ext.fly("uid").focus();
											return;
										}
										loginSys();
									}
								};
								this.el.on("keypress", keyPress, this);
							}
						}, {
							id : 'code',
							name : 'code',
							value : Ext.fly("code").dom.value,
							xtype : "hidden"
						}]
			});
	win = new Ext.Window({
				el : 'win',
				width : 380,
				height : 240,
				title : '登录系统',
				layout : 'column',
				defaults : {
					border : false
				},
				closable : false,
				items : [{
							id : "login",
							width : 120,
							// contentEl : 'login'
							items : [{
										id : 'img',
										xtype : 'textfield',
										inputType : 'image',
										width : 124,
										height : 168
									}]
						}, {
							columnWidth : 1,
							items : fs
						}],
				buttons : [{
							text : '推荐您使用火狐浏览器',
							handler : downFF,
							hidden : downhide
						}, {
							text : '登录',
							handler : loginSys
						}, {
							text : '重置',
							handler : function() {
								fs.form.reset();
							}
						}],
				listeners : {
					"show" : function() {
						Ext.fly("img").dom.src = plmm();;
						Ext.fly("uid").focus();
					}
				}
			});
	win.show();

};
var loginSys = function() {
	if (Ext.fly("uid").getValue() == "") {
		Ext.Msg.alert("提示", "用户名不能为空！", function() {
					Ext.fly("uid").focus();
				});
		return;
	}
	if (Ext.fly("pwd").getValue() == "") {
		Ext.Msg.alert("提示", "密码不能为空！", function() {
					Ext.fly("pwd").focus();
				});
		return;
	}
	Ext.MessageBox.wait("正在登录...");
	Ext.lib.Ajax.request('post', '/account/UserLogin.do?method=mclogin&isKick='
					+ kick, {
				success : function(response) {
					var res = Ext.decode(response.responseText);
					if (res.state == "success") {
						
						Ext.state.Manager.set("uid",Ext.fly("uid").getValue());
						
						window.location.href = "/module/mainframe/Main_frame.jsp";
					} else if (res.state == "islogin") {
						Ext.MessageBox.confirm("温馨提示",
								"您的帐户已经被使用，是否要退出之前使用的帐户？", function(op) {
									if (op == "yes") {
										kick = "true";
										loginSys();
									} else
										window.location.reload();
								});
					} else {
						Ext.MessageBox.hide();
						if (res.result == "INVALID") {
							Ext.Msg.alert("提示", "您的帐号已过期，请联系管理员重新审核。");
						} else {
							Ext.Msg.alert('警告', res.result, function() {
										if (res.result == "帐户不存在，请注册会员") {
											Ext.fly("uid").focus();
										} else if (res.result == "密码输入不正确,请重试") {
											Ext.fly("pwd").focus();
										}
									});
						}
					}
				},
				failure : function() {
					Ext.Msg.alert('警告', '操作失败。');
				}
			}, fs.getForm().getValues(true));
};
//判断浏览器，如果不是FF则显示FF下载链接
function down(){
	var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : 0;
        if (Sys.firefox) 
        {
        	downhide = true;// 设置是否显示提示信息
        }else{
        	downhide = false;
        }
}
var init = function() {
	down();
	buildWin();
	Ext.fly("uid").focus();
	
	var uid = Ext.state.Manager.get("uid");
	if(uid && uid!=""){
		Ext.fly("uid").dom.value=uid;
		Ext.fly("pwd").focus();
	}else{
		Ext.fly("uid").focus();
	}
};

Ext.onReady(init);

//随便选一张图片
function plmm(){
	var count=10;
	var no = Math.ceil(Math.random()*count);
	var plmmPic = "/resource/images/loginImg/"+no+".jpg";
	return plmmPic;
}
function downFF(){
	window.open("http://www.firefox.com.cn/","_blank");
}