Ext.onReady(init);
var mid = "", win;
var info_panel, pass_panel, keep_panel, sh_panel, picform, fs;
var sh_ds;
var detail_info_form;
var sh_type_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [['', '全部'], ['shenhe', '审核'], ['xuqi', '续期']]
		});
function init() {
	Ext.QuickTips.init();

	if (!Ext.isEmpty(getCurArgs("id"))) {
		mid = getCurArgs("id");
		buildInfo(mid);
	}
};

// 创建信息区域
function buildInfo(id) {
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=getMem", {
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var mem_info = jsondata.result;

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
									text : "会员ID："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : mem_info["memberID"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									text : "会员级别："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : showDegree(mem_info["degree"])
								}]
					},{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									//text : "已询价数："
									text : "当前积分："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									//text : mem_info["inquiryNum"]
									text : mem_info["currScore"]
								}]
					}, {
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
									width : 160,
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
									width : 160,
									text : trimDate(mem_info["updateOn"])
								}]
					},{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									//text : "剩余询价数："
									text : "使用积分："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									//text :showAskTotal(mem_info["askTotal"],mem_info["inquiryNum"])
									text :mem_info["useScore"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									width : 90,
									text : "最近登录时间："
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
									text : "最近登录IP："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : mem_info["ipAddr"]
								}]
					},  {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									text : "冻结积分："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : mem_info["frozenScore"]
								}]
					},{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									text : "有效时间："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : trimDate(mem_info["validDate"])
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									text : "查询次数："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
							xtype : "label",
							width : 160,
							text : mem_info["searchTimes"] < 0
									? "无限制"
									: mem_info["searchTimes"]
						}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;color:red;font-size:12px",
						items : [{
									xtype : "label",
									text : "账户余额："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
							xtype : "label",
							width : 160,
							text : mem_info["accountBalance"]
						}]
					}]
				});
                 
                 
                var zhcn = new Zhcn_Select(); 
                
                // 省份城市级联选择
	var pro =  zhcn.getProvince(true);
	var city = [];
	var area=[];
	var comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
				store : pro,
				width : 160,
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
						comboCities.setValue("");
						comboCities.enable();
						
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
			width : 160
			});
			
			
 
                Ext.getCmp("comboProvinces").setValue( mem_info.province);
                city = zhcn.getCity(mem_info.province).concat();
                Ext.getCmp('comboCities').store.loadData(city);
                Ext.getCmp("comboCities").setValue(mem_info.city);
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
							handler : showPic,
							hidden : compareAuth("MEM_MOD")
						}]
					}), {
						bodyStyle : "border:none",
						width : 10
					}, new Ext.form.FieldSet({
						title : "个人信息",
						bodyStyle : "margin-left:10px",
						layout : "table",
						
						layoutConfig : {
							columns : 3
						},
						minHeight : 200,
						width : 600,
						items : [ {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "企业名称："
									}]
						}, {
							width : 190,
							// autoHeight : true,
							height : 28,
							colspan:2,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "企业名称",
										maxLength : 50,
										allowBlank : false,
										id : "corpname",
										value : mem_info["corpName"],
										width : 160
									}, {
										xtype : "label",
										style : "margin-left: 5px;",
										html : "<a href='#'>查看</a>",
										id : "seeE",
										hidden : (mem_info["EID"] == null || mem_info["EID"] == "")
												? true
												: false
									}]
						},{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "联系人："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							colspan:2,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "联系人",
										id : "truename",
										regex : formMsg.truenamePatrn,
										regexText : formMsg.truenameErrMsg,
										allowBlank : false,
										maxLength : 50,
										value : mem_info["trueName"],
										blankText : "请输入联系人",
										width : 160
									}]
						}, {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "联系方式："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							colspan:2,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "联系方式",
										maxLength : 50,
										regex : formMsg.phonePatrn,
										regexText : formMsg.phoneErrMsg,
										id : "phone",
										value : mem_info["phone"],
										width : 160
									}]
						}, {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "电子邮箱："
									}]
						}, {
							width : 200,
							height : 28,
							colspan:2,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "label",
										text : mem_info["email"]
									}]
						}, /*{
							width : 200,
							// autoHeight : true,
							height : 28,
							colspan:2,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "电子邮箱",
										maxLength : 50,
										regex : formMsg.emailPatrn,
										regexText : formMsg.emailErrMsg,
										allowBlank : false,
										id : "email",
										value : mem_info["email"],
										width : 150
									},{
										xtype : "label",
										style : "margin-left: 5px; color:red;",
										html: emailStatus(mem_info["status"]),
										id : "seeE"
									
									}]
						}*/ /*{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "邮编："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "邮编",
										maxLength : 6,
										regex : formMsg.postCodePatern,
										regexText : formMsg.postCodeMsg,
										id : "postcode",
										value : mem_info["postCode"],
										width : 160
									}]
						},*/ {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "所在地："
									}]
						},{
							width : 190,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
							items : [comboProvinces]
						},{
							width : 190,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
							items : [comboCities]
						}, {
							colspan : 2,
							bodyStyle : "border:none;padding-left:200px;",
							items : [{
										xtype : "tbbutton",

										width : 90,
										text : "保存",
										handler : saveInfo,
										hidden : compareAuth("PURCHASE_MEM_MOD")
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
											text : '设置软件',
											icon : "/resource/images/computer_go.png",
											hidden : compareAuth("MEM_MOD"),
											handler : showSoftWare
										}, {
											text : '查看审核记录',
											icon : "/resource/images/book_open.png",
											hidden : compareAuth('MEM_AUDITREC_VIEW'),
											handler : openShLog
										}]
							}, {
								layout : "form",
								width : 800,
								bodyStyle : "padding:10px;",
								autoHeight : true,
								items : [base_info]
							}, {
								layout : "form",
								width : 800,
								bodyStyle : "padding:10px",
								autoHeight : true,
								items : [detail_info_form]
							}]

				});
				fillInfo(mem_info);
				// 查看企业信息
				Ext.fly("seeE").on("click", function() {
					if (mem_info["EID"] == null) {
						Ext.Msg.alert("温馨提示", "该会员并未与厂商进行绑定或该会员所在的公司不存在。");
						return;
					}
					window.parent.createNewWidget('enterprise_edit', '修改企业信息',
							'/module/enterprise/enterprise_edit.jsp?eid='
									+ mem_info["EID"]);
				});
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "mid=" + id)

};

// 填充信息(相片)
function fillInfo(data) {
	if (!Ext.isEmpty(data["logo"])) {
		Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL
				+ data["logo"].replace(/(\\)|(\/\/)/g, "/");
	}
};

// 保存修改信息
function saveInfo() {

	if (!detail_info_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按要求填写内容!");
		return;
	}

	var name = Ext.fly("truename").getValue();
	var corpname = Ext.fly("corpname").getValue();
	var phone = Ext.fly("phone").getValue();
	//var email = Ext.fly("email").getValue();
	//var addr = Ext.fly("addr").getValue();
	var province = Ext.fly("comboProvinces").getValue();
	var city = Ext.fly("comboCities").getValue();
	if(city=="请选择")
	{
		Ext.Msg.alert("提示", "请选择城市!");
		return;
	}
	
	var logo = Ext.fly("picPath").dom.src.split("/");
	logo = "/" + logo.slice(3).toString().replace(/,/g, "/");
	var query = "mid=" + mid;
	query += "&content=trueName~" + name + ";phone~" + phone + ";logo~" + logo+";corpName~"+corpname + ";province~"+province+";city~"+city;
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=modMem", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succedit);
						if (window.parent.tab_0201_iframe)
							window.parent.tab_0201_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);

};

// 显示修改相片区域
function showPic() {
	FileUpload_Ext.requestId = mid;
	FileUpload_Ext.requestType = "RS_MEMBER";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

// 上传图片回调函数2
function upload_fn() {
	Ext.fly("picPath").dom.src = FileUpload_Ext.requestURL + FileUpload_Ext.callbackMsg;
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
						window.parent.tab_0201_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};
// 续期
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
						window.parent.tab_0201_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};

// 显示设置软件
function showSoftWare() {

	fs = new Ext.FormPanel({
				autoWidth : true,
				height : 80,
				bodyStyle : 'padding:6px;',
				layout : 'form',
				labelWidth : 60,
				labelAlign : 'right',
				items : [{
							xtype : 'combo',
							fieldLabel : '软件名称',
							store : soft_Ware,
							triggerAction : 'all',
							id : 'soft_name',
							allowBlank : false
						}]
			});
	win = new Ext.Window({
				title : '设置软件使用权限',
				width : 400,
				autoHeight : true,
				items : fs,
				buttons : [{
							text : '设置',
							handler : function() {
								setSoft();
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 设置软件
function setSoft() {
	if (fs.getForm().isValid()) {
		Ext.Ajax.request({
					url : '/mc/Member.do',
					params : {
						method : 'setAppType',
						appType : Ext.getCmp("soft_name").getValue(),
						mid : mid
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("软件使用设置成功。", parent.Ext.getCmp("center")
											.remove("member_info"));

						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

// 得到日期
function getDate(v) {
	if (v)
		return v.substring(0, 10);
	return "";
};



// 查看会员审核记录
function openShLog() {
	sh_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/MemberAuditServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'memberID', 'lastDegree', 'degree',
								'beforeValidDate', 'afterValidDate',
								'auditTime', 'auditor']),
				baseParams : {
					type : 3,
					mid : mid,
					auditType : ''
				}
			});
	sh_panel = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : sh_ds,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : '审核前等级',
							sortable : false,
							width : 80,
							dataIndex : 'lastDegree',
							renderer : showDegree
						}, {
							header : '审核后等级',
							sortable : false,
							width : 80,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '审核前有效日期',
							sortable : false,
							width : 80,
							dataIndex : 'beforeValidDate',
							renderer : getDate
						}, {
							header : '审核后有效日期',
							sortable : false,
							width : 80,
							dataIndex : 'afterValidDate',
							renderer : getDate
						}, {
							header : '审核人',
							sortable : false,
							width : 80,
							dataIndex : 'auditor'
						}, {
							header : '审核时间',
							sortable : false,
							width : 100,
							dataIndex : 'auditTime'
						}],
				tbar : ['审核类型:', {
							id : 'sh_type',
							xtype : 'combo',
							mode : "local",
							triggerAction : "all",
							allowBlank : false,
							store : sh_type_ds,
							width : 60,
							displayField : 'text',
							valueField : 'value',
							value : '',
							listeners : {
								'select' : function() {
									var sh_type = Ext.getCmp("sh_type")
											.getValue();
									if (sh_type == 'shenhe')
										sh_ds.baseParams['auditType'] = 'a';
									else if (sh_type == 'xuqi')
										sh_ds.baseParams['auditType'] = 'r';
									else
										sh_ds.baseParams['auditType'] = '';
									sh_ds.reload();
								}
							}
						}]
			});
	win = new Ext.Window({
				title : "会员审核记录-" + "<font color='red'>" + mid + "</font>",
				autoScroll : true,
				heigth : 400,
				width : 550,
				closable : true,
				draggable : true,
				modal : true,
				border : false,
				plain : true,
				layout : 'fit',
				closeAction : "close",
				buttonAlign : 'center',
				items : [sh_panel],
				buttons : [{
							text : "关闭",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	sh_ds.load();
};