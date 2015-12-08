Ext.onReady(init);
var url = "/mc/appMember.do", goodAt = "", memberId = "", info_panel, detail_info_form;
function init() {
	Ext.QuickTips.init();
	if (!Ext.isEmpty(getCurArgs("memberId"))) {
		memberId = getCurArgs("memberId");
		getAppMemberInfo();
	}
};

function getAppMemberInfo(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 10,
			memberId : memberId
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				goodAt = jsondata.result["goodAt"]+";";
				buildInfo(jsondata.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
// 创建信息区域
function buildInfo(mem_info) {
	var base_info = new Ext.Panel({
		layout : "table",
		frame : true,
		layoutConfig : {
			columns : 6
		},
		items : [{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "注册时间："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : trimDate(mem_info["createOn"])
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "更新时间："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : trimDate(mem_info["updateOn"])
					}]
		},{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "当前T币："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : mem_info["currScore"]
					}]
		},{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "最后登录时间："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						width : 160,
						text : trimDate(mem_info["lastTime"])
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "登录次数："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						width : 160,
						text : mem_info["loginNum"]
					}]
		},{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "提现："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text :mem_info["withdrawal"]
					}]
		},{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : ""
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : ""
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						width : 90,
						text : ""
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						width : 160,
						text : ""
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
			items : [{
						xtype : "label",
						text : "冻结T币："
					}]
		}, {
			width : 160,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : mem_info["frozenScore"]
					}]
		}]
	});
  
	var zhcn = new Zhcn_Select(); 
	 // 省份城市级联选择
	var pro =  zhcn.getProvince(true);
	var city = [];
	var comboProvinces = new Ext.form.ComboBox({
		id : 'comboProvinces',
		store : pro,
		width : 80,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '省',
		listeners : {
			select : function(combo, record, index) {
				comboCities.reset();
				var province = combo.getValue();
				city=zhcn.getCity(province);
				comboCities.store.loadData(city);
				comboCities.enable();
				comboCities.setValue("");
			}
		}
	
	});
	var comboCities = new Ext.form.ComboBox({
		id : 'comboCities',
		store : city,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		hiddenName : 'region',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '市',
		name : 'region',
		width : 80
	});

 Ext.getCmp("comboProvinces").setValue( mem_info.province);
 city = zhcn.getCity(mem_info.province).concat();
 Ext.getCmp('comboCities').store.loadData(city);
 Ext.getCmp("comboCities").setValue(mem_info.city);
 var phoneVerification = mem_info["phoneVerification"];
 var phoneVerificationLb1 = phoneVerification == "0" ? "<a href=\"javascript:void(0);\" onclick=\"editPhoneVerification(1)\">实名认证</a>" : "已认证";
 var phoneVerificationLb2 = phoneVerification == "0" ? "" : "&nbsp;&nbsp;<a href=\"javascript:void(0);\" onclick=\"editPhoneVerification(0)\">取消认证</a>";
 var detail_info = new Ext.Panel({

		frame : true,
		layout : "table",
		layoutConfig : {
			columns : 3
		},
		minHeight : 200,
		items : [new Ext.Panel({
			frame : true,
			width : 132,
			layout : "form",
			height : 166,
			bodyStyle : "margin-right:12px",
			items : [{
				width : 120,
				height : 120,
				items : [{
					width : 120,
					height : 120,
					html : "<img id='picPath' src='/resource/images/def_info.jpg' width='120' height='120' />"
				}]
			}, {
				xtype : "tbbutton",
				width : 120,
				text : "修改",
				handler : showPic
//				hidden : compareAuth("MEM_MOD")
			}]
		}), {
			bodyStyle : "border:none",
			width : 10
		}, new Ext.form.FieldSet({
			title : "个人信息",
			bodyStyle : "margin-left:10px",
			layout : "table",
			
			layoutConfig : {
				columns : 4
			},
			minHeight : 200,
			items : [{
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "手机号："
						}]
			}, {
				width : 160,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textfield",
							fieldLabel : "手机号",
							id : "mobile",
							allowBlank : false,
							maxLength : 50,
							value : mem_info["mobile"],
							width : 160
						}]
			}, {
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "公司名称："
						}]
			}, {
				width : 190,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textfield",
							fieldLabel : "公司名称",
							maxLength : 50,
							allowBlank : false,
							id : "corpname",
							value : mem_info["corpName"],
							width : 160
						}]
			},{
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "会员昵称："
						}]
			}, {
				width : 160,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "textfield",
							fieldLabel : "会员昵称",
							id : "nickname",
							allowBlank : false,
							maxLength : 50,
							value : mem_info["nickName"],
							blankText : "请输入会员昵称",
							width : 160
						}]
			}, {
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "所属城市："
						}]
			}, {
				width : 190,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : new Ext.Panel({
					border : false,
					layout:'column',
					layoutConfig : {
						columns : 2
					},
					items : [comboProvinces,comboCities]
				})
			}, {
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "等级头衔："
						}]
			}, {
				width : 160,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "label",
							text : mem_info["exp"]
						}]
			}, {
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "实名认证："
						}]
			}, {
				width : 160,
				height : 28,
				items : [{
							autoHeight : true,
							layout : 'table',
							layoutConfig : {
								columns : 2
							},
							bodyStyle : "margin:5px 0px 0px 0px;",
							items : [{
								items : [{
											html : phoneVerificationLb1,
											xtype : 'label',
											id : "phoneLb1"
										}]
							}, {
								items : [{
									html : phoneVerificationLb2,
									xtype : 'label',
									id : "phoneLb2"
								}]
							}]
						}]
			}, {
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "擅长材料："
						}]
			}, {
				width : 160,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : mem_info["goodAt_name"]
						},{
							xtype : "label",
							html : "&nbsp;&nbsp;<a href=\"javascript:void(0);\" onclick=\"editGoodAt()\">修改</a>"
						}]
			},  {
				width : 90,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;font-size:12px;line-height:28px;",
				items : [{
							xtype : "label",
							text : "支付宝账户："
						}]
			}, {
				width : 160,
				height : 28,
				bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
				items : [{
							xtype : "label",
							text : mem_info["alipayAccount"]
						}]
			}, {
				colspan : 2,
				bodyStyle : "border:none;padding-left:200px;",
				items : [{
							xtype : "tbbutton",

							width : 90,
							text : "修改",
							handler : saveInfo,
							hidden : compareAuth("MEM_MOD")
						}]
			}]
		})]
	});
	
	detail_info_form = new Ext.FormPanel({
		        id:"myForm",
				layout : "form",
				autoWidth : true,
				autoHeight : true,
				bodyStyle : "border:none",
				items : [detail_info]
			});
	info_panel = new Ext.Panel({
		frame : true,
		autoWidth : true,
		height : "100%",
		align : "center",
		bodyStyle : "background-color:#DFE8F6",
		renderTo : "member_info",
		items : [{
					xtype : 'toolbar',
					items : [{
								text : 'T币明细',
								icon : "/resource/images/book_open.png",
								hidden : compareAuth("MEM_MOD"),
								handler : showTBDetail
							}]
				}, {
					layout : "form",
					width : 900,
					bodyStyle : "padding:10px;",
					autoHeight : true,
					items : [base_info]
				}, {
					layout : "form",
					width : 900,
					bodyStyle : "padding:10px",
					autoHeight : true,
					items : [detail_info_form]
				}]

	});
	fillInfo(mem_info);
}

// 填充信息(相片)
function fillInfo(data) {
	if (!Ext.isEmpty(data["logo"]))
		Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + data["logo"].replace(/(\\)|(\/\/)/g, "/");
}

// 保存修改信息
function saveInfo() {
	if (!detail_info_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按要求填写内容!");
		return;
	}
	var mobile = Ext.fly("mobile").getValue();
	var corpname = Ext.fly("corpname").getValue();
	var nickName = Ext.fly("nickname").getValue();
	var province = Ext.fly("comboProvinces").getValue();
	var city = Ext.fly("comboCities").getValue();
	if(city=="请选择")
		city="";
	var logo = Ext.fly("picPath").dom.src.split("/");
	logo = "/" + logo.slice(3).toString().replace(/,/g, "/");
	var query = "mobile~" + mobile + ";corpName~" + corpname + ";nickName~" + nickName + ";logo~" + logo+";province~"+province+";city~"+city;
	
	Ext.Ajax.request({
		url : url,
		params : {
			type : 11,
			memberId : memberId,
			content : query
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				Info_Tip("修改成功!");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

// 显示修改相片区域
function showPic() {
	FileUpload_Ext.requestId = mid;
	FileUpload_Ext.requestType = "RS_MEMBER";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
}

// 上传图片回调函数2
function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + FileUpload_Ext.callbackMsg;
}

//解除手机绑定
function editPhoneVerification(status){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 12,
			content : "memberId~"+memberId+";status~"+status
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				if(status == 0){
					$("#phoneLb1").html("<a href=\"javascript:void(0);\" onclick=\"editPhoneVerification(1)\">实名认证</a>");
					$("#phoneLb2").html("");
					Info_Tip("取消认证成功!");
				}else{
					$("#phoneLb1").html("已认证");
					$("#phoneLb2").html("&nbsp;&nbsp;<a href=\"javascript:void(0);\" onclick=\"editPhoneVerification(0)\">取消认证</a>");
					Info_Tip("实名认证成功!");
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//显示T币明细
function showTBDetail(){
	window.parent.createNewWidget("member_app_tbDetail", "会员T币明细","/module/member/member_app_tbDetail.jsp?memberId=" + memberId);
}
//修改擅长材料
function editGoodAt(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 13
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)){
				var cgRationJson = jsondata.result;
				showGoodAt(cgRationJson);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function showGoodAt(cgRationJson){
	var checkboxHtml = "";
	for(var i=0; i<cgRationJson.length; i++){
		var checked = "";
		if(i != 0 && i % 5 == 0)
			checkboxHtml += "<br /><br />";
		if(goodAt.indexOf(cgRationJson[i].procureCode + ";") != -1)
			checked = "checked";
		checkboxHtml += "<input type='checkbox' name='goodAt' value='"+cgRationJson[i].procureCode+"' "+checked+" />" + cgRationJson[i].name + "&nbsp;&nbsp;&nbsp;&nbsp;";
	}
	Ext.MessageBox.show({
		title : '修改擅长材料',
		msg : checkboxHtml,
		prompt : false,
		width : 400,
		buttons : {
			"ok" : "修改",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text) {
			if ("ok" == btn) {
				var procureCodes = "";
				$('input[name="goodAt"]:checked').each(function(){
					procureCodes += $(this).val() + ";";
				});
				goodAt = procureCodes;
				procureCodes = procureCodes.substring(0, procureCodes.lastIndexOf(";"));
				Ext.Ajax.request({
					url : url,
					params : {
						type : 14,
						goodAt : procureCodes,
						memberId : memberId
					},
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)){
							Info_Tip("擅长材料修改成功!");
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			}
		}
	});
}