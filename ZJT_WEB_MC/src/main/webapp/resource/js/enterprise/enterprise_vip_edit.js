Ext.onReady(init);
function init() {
	Ext.QuickTips.init();
	eid = getCurArgs("eid");
	buildForm();
};
var eid = null, oldData;
// 创建form
function buildForm() {
	var form = new Ext.form.FormPanel({
		id : 'form_panel_edit',
		frame : true,
		autoWidth : true,
		height : parent.Ext.fly("tab_enterprise_vip_edit_iframe").getHeight(),
		renderTo : "form",

		items : {
			layout : 'form',
			width : 460,
			// autoWidth:true,
			frame : true,
			layoutConfig : {
				columns : 2
			},
			tbar : [{
						text : '查看企业会员',
						hidden : compareAuth('CORP_MEM_MANAGE'),
						handler : EmpMem,
						icon : '/resource/images/group.png'
					}],
			items : [{
						xtype : 'textfield',
						fieldLabel : 'EID',
						id : 'eid',
						name : 'eid',
						width : 220,
						allowBlank : false,
						readOnly : true
					}, {
						xtype : 'textfield',
						fieldLabel : '企业名称',
						width : 220,
						id : 'ename',
						name : 'ename',
						allowBlank : false
					}, {
						xtype : 'combo',
						id : 'degree',
						width : 220,
						name : 'degree',
						store : [["8", "VIP会员"], ["9", "企业会员"]],
						triggerAction : "all",
						fieldLabel : '企业等级',
						listeners : {
							"select" : function(combo) {
								switch (combo.value) {
									case "8" :
										Ext
												.getCmp("mod_Ask")
												.setValue(parseInt(oldData["mod_Ask"]));
										Ext
												.getCmp("mod_Mat")
												.setValue(parseInt(oldData["mod_Mat"]));
										Ext
												.getCmp("mod_Proj")
												.setValue(parseInt(oldData["mod_Proj"]));
										Ext
												.getCmp("mod_Sup")
												.setValue(parseInt(oldData["mod_Sup"]));
										Ext
												.getCmp("mod_Sup_Cat")
												.setValue(parseInt(oldData["mod_Sup_Cat"]));
										Ext
												.getCmp("mod_Users")
												.setValue(parseInt(oldData["mod_Users"]));
										Ext
												.getCmp("mod_Sys")
												.setValue(parseInt(oldData["mod_Sys"]));
										break;
									case "9" :
										Ext.getCmp("mod_Ask").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Ask")
														.getValue())
														/ 2));
										Ext.getCmp("mod_Mat").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Mat")
														.getValue())
														/ 2));
										Ext.getCmp("mod_Proj").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Proj")
														.getValue())
														/ 2));
										Ext.getCmp("mod_Sup").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Sup")
														.getValue())
														/ 2));
										Ext.getCmp("mod_Sup_Cat").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Sup_Cat")
														.getValue())
														/ 2));
										Ext.getCmp("mod_Users").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Users")
														.getValue())
														/ 2));
										Ext.getCmp("mod_Sys").setValue(Math
												.floor(parseInt(Ext
														.getCmp("mod_Sys")
														.getValue())
														/ 2));
										break;
								}
							}
						}
					}, {
						xtype : 'textfield',
						fieldLabel : '创建人',
						width : 220,
						id : 'createBy',
						name : 'createBy',
						allowBlank : false,
						readOnly : true
					}, {
						xtype : 'numberfield',
						fieldLabel : '询价库询价数量',
						width : 220,
						id : 'mod_Ask',
						name : 'mod_Ask',
						allowBlank : false
					}, {
						xtype : 'numberfield',
						fieldLabel : '材料库收藏材料数',
						width : 220,
						id : 'mod_Mat',
						name : 'mod_Mat',
						allowBlank : false
					}, {
						xtype : 'numberfield',
						fieldLabel : '项目库收藏材料数',
						width : 220,
						id : 'mod_Proj',
						name : 'mod_Proj',
						allowBlank : false
					}, {
						xtype : 'numberfield',
						fieldLabel : '供应商库供应商数',
						width : 220,
						id : 'mod_Sup',
						name : 'mod_Sup',
						allowBlank : false
					}, {
						xtype : 'numberfield',
						fieldLabel : '供应商库层级数量',
						width : 220,
						id : 'mod_Sup_Cat',
						name : 'mod_Sup_Cat',
						allowBlank : false
					}, {
						xtype : 'numberfield',
						fieldLabel : '用户数量',
						width : 220,
						id : 'mod_Sys',
						name : 'mod_Sys',
						allowBlank : false
					}, {
						xtype : 'numberfield',
						fieldLabel : '用户层级数',
						width : 220,
						id : 'mod_Users',
						name : 'mod_Users',
						allowBlank : false
					}, {
						xtype : 'datefield',
						fieldLabel : '开始时间',
						width : 220,
						id : 'startDate',
						name : 'startDate',
						allowBlank : false,
						format : "Y-m-d",
						vtype : 'daterange',
						endDateField : "validDate"
					}, {
						xtype : 'datefield',
						fieldLabel : '有效期',
						width : 220,
						id : 'validDate',
						name : 'validDate',
						allowBlank : false,
						format : "Y-m-d",
						vtype : 'daterange',
						startDateField : 'startDate'
					}]
		},
		buttonAlign : "left",
		labelWidth : 140,
		labelAlign : "right",
		buttons : [{
					text : '修改',
					handler : editEmp
				}]
	});
	getInfo();
};

// 获取信息
function getInfo() {
	Ext.Ajax.request({
				url : '/ep/EpAccountServlet',
				params : {
					type : 11,
					eid : eid
				},
				success : function(response) {
					var json = eval("(" + response.responseText + ")");
					if (getState(json.state, commonResultFunc, json.result)) {
						Ext.getCmp("form_panel_edit").getForm()
								.setValues(json.result);
						oldData = json.result;
						Ext
								.getCmp("startDate")
								.setValue(json.result["startDate"].slice(0, 10));
						Ext
								.getCmp("validDate")
								.setValue(json.result["validDate"].slice(0, 10));
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};
// 查看企业会员
function EmpMem() {

	var thisid = Ext.fly('emp_id').getValue();
	var ename = encodeURI(Ext.fly("emp_name").getValue());
	window.parent.createNewWidget("enterprise_memToemp", '查看企业会员',
			'/module/enterprise/enterprise_mem_add.jsp?eid=' + thisid
					+ "&ename=" + ename);
};

// 修改vip企业信息
function editEmp() {
	Ext.MessageBox.confirm("温馨提示", "您确认要修改该企业的信息吗？", function(op) {
		if (op == "yes") {
			var form = Ext.getCmp("form_panel_edit").getForm();
			if (form.isValid) {
				var content = getDataPack_form(form, "content", false, true);
				Ext.Ajax.request({
					url : '/ep/EpAccountServlet',
					params : {
						type : 10,
						eid : eid,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("更新成功。", function() {
										closeTab("enterprise_vip_edit");
									});
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			} else
				Info_Tip();
		}
	});
};