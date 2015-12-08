Ext.onReady(init);
var mid = "", win, mem_degree;
var info_panel, pass_panel, keep_panel, picform;
function init() {
	Ext.QuickTips.init();
	if (!Ext.isEmpty(getCurArgs("id"))) {
		mid = getCurArgs("id");
		buildInfo(getCurArgs("id"));
	}
};
// 创建信息区域
function buildInfo(id) {
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=getMem", {
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var mem_info = jsondata.result;
				var base_info = new Ext.form.FieldSet({
					title : "基本信息",
					layout : "table",
					layoutConfig : {
						columns : 4
					},
					items : [{
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									text : "会员ID："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
									xtype : "label",
									text : mem_info["memberID"]
								}]
					}, {
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									text : "会员级别："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
									xtype : "label",
									text : showDegree(mem_info["degree"])
								}]
					}, {
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									text : "注册时间："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
									xtype : "label",
									width : 160,
									text : trimDate(mem_info["createOn"])
								}]
					}, {
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									text : "更新时间："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
									xtype : "label",
									width : 160,
									text : trimDate(mem_info["updateOn"])
								}]
					}, {
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									width : 120,
									text : "最近登录时间："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
									xtype : "label",
									width : 160,
									text : trimDate(mem_info["lastTime"])
								}]
					}, {
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									text : "有效时间："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
									xtype : "label",
									text : trimDate(mem_info["validDate"])
								}]
					}, {
						width : 120,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px;",
						items : [{
									xtype : "label",
									text : "查询次数："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
						items : [{
							xtype : "label",
							width : 160,
							text : mem_info["searchTimes"] < 0
									? "无限制"
									: mem_info["searchTimes"]
						}]
					}]
				});
				var detail_info = new Ext.form.FieldSet({
					title : "详细信息",
					layout : "table",
					layoutConfig : {
						columns : 4
					},
					items : [new Ext.form.FieldSet({
						title : "个人相片",
						layout : "form",
						items : [{
							width : 80,
							height : 80,
							html : "<img id='picPath' src='/resource/images/def_info.jpg' width='80' height='80' />"
						}, {
							xtype : "tbbutton",
							width : 80,
							text : "修改",
							handler : showPic,
							hidden:compareAuth("MEM_MOD")
						}]
					}), {
						bodyStyle : "border:none",
						width : 20
					}, new Ext.form.FieldSet({
						title : "个人信息",
						layout : "table",
						layoutConfig : {
							columns : 4
						},
						items : [{
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;",
							items : [{
										xtype : "label",
										text : "真实姓名："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "真实姓名",
										id : "truename",
										allowBlank : false,
										maxLength : 50,
										blankText : "请输入真实姓名"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "公司名称："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "公司名称",
										maxLength : 50,
										id : "corpname"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "手机号码："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "手机号码",
										maxLength : 50,
										regex : formMsg.mobilePatrn,
										regexText : formMsg.mobileError,
										id : "mobile"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "固定电话："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "固定电话",
										maxLength : 50,
										id : "phone"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "QQ："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "QQ",
										maxLength : 50,
										id : "qq"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "电子邮件："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "电子邮件",
										maxLength : 50,
										id : "email"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "地址："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "地址",
										maxLength : 80,
										id : "addr"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "邮编："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "邮编",
										maxLength : 6,
										id : "postcode"
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "会员注册区域："
									}]
						}, {
							width : 160,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "label",
										text : mem_info["regProvince"]
									}]
						}, {
							width : 120,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;",
							items : [{
										xtype : "label",
										text : "会员访问区域："
									}]
						}, {
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
							items : [{
										xtype : "label",
										text : mem_info["webProvince"]
									}]
						}, {
							colspan : 2,

							bodyStyle : "border:none;padding-left:200px;",
							items : [{
										xtype : "tbbutton",

										width : 80,
										text : "保存",
										handler : saveInfo,
										hidden:compareAuth("MEM_MOD")
									}]
						}]
					})]
				});
				info_panel = new Ext.Panel({
							title : "会员信息",
							autoWidth : true,
							autoHeight : true,
							renderTo : "fac_info",
							items : [{
										layout : "form",
										width : 800,
										bodyStyle : "padding:10px;margin-bottom:6px;",
										autoHeight : true,
										items : [base_info]
									}, {
										layout : "form",
										width : 800,
										bodyStyle : "padding:10px;margin-bottom:6px;",
										autoHeight : true,
										items : [detail_info]
									}]

						});

				fillInfo(mem_info);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "mid=" + id)

};
// 填充信息
function fillInfo(data) {
	Ext.fly("truename").dom.value = data["trueName"];
	Ext.fly("corpname").dom.value = data["corpName"];
	Ext.fly("mobile").dom.value = data["mobile"];
	Ext.fly("phone").dom.value = data["phone"];
	Ext.fly("qq").dom.value = data["qq"];
	Ext.fly("email").dom.value = data["email"];
	Ext.fly("addr").dom.value = data["addr"];
	Ext.fly("postcode").dom.value = data["postCode"];
	if (!Ext.isEmpty(data["logo"]))
		Ext.fly("picPath").dom.src = data["logo"].replace(/\\/g, "/");
};

// 保存修改信息
function saveInfo() {
	var name = Ext.fly("truename").getValue();
	var corpname = Ext.fly("corpname").getValue();
	var mobile = Ext.fly("mobile").getValue();
	var phone = Ext.fly("phone").getValue();
	var qq = Ext.fly("qq").getValue();
	var email = Ext.fly("email").getValue();
	var addr = Ext.fly("addr").getValue();
	var postcode = Ext.fly("postcode").getValue();
	if (Ext.isEmpty(name)) {
		Info_Tip("请输入会员名称。");
		return;
	}
	var query = "mid=" + mid;
	query += "&content=trueName~" + name + ";corpName~" + corpname + ";mobile~"
			+ mobile + ";phone~" + phone + ";qq~" + qq + ";email~" + email
			+ ";addr~" + addr + ";postCode~" + postcode;
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=modMem", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succedit);
						window.parent.tab_0202_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query)

};

// 显示修改相片区域
function showPic() {

	var picup = new Ext.form.TextField({
				inputType : "file",
				id : "upPic",
				height : 26
			});
	picform = new Ext.form.FormPanel({
				laeblAlign : "right",
				frame : true,
				fileUpload : true,
				items : [picup]
			});
	win = new Ext.Window({
				title : "修改相片",
				width : 360,
				height : 130,
				closable : true,
				draggable : true,
				modal : true,
				border : false,
				plain : true,
				layout : 'fit',
				closeAction : "close",
				buttonAlign : 'center',
				layout : "column",
				items : [picform, {
							xtype : "label",
							text : "图片类型：jpg,jpeg,建议尺寸:80*80,大小不能超过150K。"
						}],
				buttons : [{
							text : "修改",
							handler : uploadPic
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 修改相片
function uploadPic() {
	if (picform.getForm().isValid()) {
		picform.getForm().submit({
					url : '/account/Member.do?method=upLogo&uid=' + mid,
					waitMsg : '上传图片中...',
					success : function(picform, o) {
						// msg('Success', 'Processed file "'+o.result.file+'" on
						// the server');
					}
				});
	}

};

// 上传图片返回信息
function uplogoResult(flag, msg) {
	if (flag) {
		Info_Tip(opMsg.succupload);
		Ext.fly("picPath").dom.src = msg;
		picform.getForm().reset();
		win.close();
	} else {
		Warn_Tip(opMsg.failupload);
	}
};

// 审核audit
function passOp() {
	var query
	var addDays = Ext.fly('day_i').getValue();
	var valdate = Ext.fly('date_i').getValue();
	var degree = Ext.fly("degree_input").getValue();

	if (Ext.isEmpty(degree)) {
		degree = mem_degree;
	}
	if (addDays == "请输入天数") {
		if (valdate == "请选择日期") {
			Info_Tip("请输入日期");
			return;
		}
		query = "degree=" + degree + "&validDate=" + valdate;
	}

	if (valdate == "请选择日期") {
		if (addDays == "请输入天数") {
			Info_Tip("请输入天数");
			return;
		}
		query = "degree=" + degree + "&addDays=" + addDays;
	}
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=audit&mid=" + mid, {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succpass);
						window.parent.tab_0202_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};
// 续期udit
function keepOp() {
	var query
	var addDays = Ext.fly('day_y').getValue();
	var valdate = Ext.fly('date_y').getValue();
	if (addDays == "请输入天数") {
		if (valdate == "请选择日期") {
			Info_Tip("请输入日期");
			return;
		}
		query = "validDate=" + valdate;
	}

	if (valdate == "请选择日期") {
		if (addDays == "请输入天数") {
			Info_Tip("请输入天数");
			return;
		}
		query = "addDays=" + addDays;
	}

	Ext.lib.Ajax.request("post", "/mc/Member.do?method=renewal&mid=" + mid, {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succpass);
						window.parent.tab_0202_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};