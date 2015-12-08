Ext.onReady(init);
var id, form, win, ds;
function init() {
	id = getCurArgs("id");
	buildForm();
};
function buildForm() {
	new Ext.Panel({
				autoWidth : true,
				autoHeight : true,
				frame : true,
				border : true,
				renderTo : 'form',
				items : form = new Ext.FormPanel({
							width : 860,
							height : parent.Ext
									.get("tab_enterprise_vip_sup_look_iframe")
									.getHeight()
									- 10,
							frame : true,
							layout : 'column',
							// border : true,
							labelWidth : 60,
							bodyStyle : 'padding:6px;',
							labelAlign : 'right',
							buttonAlign : 'right',
							items : [{
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'name',
													name : 'name',
													fieldLabel : '单位名称',
													width : 240,
													allowBlank : false
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
											xtype : 'combo',
											id : 'degree',
											store : ["高等", "中高等", "中等", "中低等",
													"低等"],
											triggerAction : 'all',
											name : 'degree',
											fieldLabel : '级别',
											width : 240
										}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'code',
													name : 'code',
													fieldLabel : '编号',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'brand',
													name : 'brand',
													fieldLabel : '品牌',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'fax',
													name : 'fax',
													fieldLabel : '传真号码',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'area',
													name : 'area',
													fieldLabel : '地区',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'linkman',
													name : 'linkman',
													fieldLabel : '联系人1',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'position',
													name : 'position',
													fieldLabel : '职位1',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'mobile',
													name : 'mobile',
													fieldLabel : '手机1',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'phone',
													name : 'phone',
													fieldLabel : '固定电话1',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'linkman1',
													name : 'linkman1',
													fieldLabel : '联系人2',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'position1',
													name : 'position1',
													fieldLabel : '职位2',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'mobile1',
													name : 'mobile1',
													fieldLabel : '手机2',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'phone1',
													name : 'phone1',
													fieldLabel : '固定电话2',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'linkman2',
													name : 'linkman2',
													fieldLabel : '联系人3',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'position2',
													name : 'position2',
													fieldLabel : '职位3',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'mobile2',
													name : 'mobile2',
													fieldLabel : '手机3',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'phone2',
													name : 'phone2',
													fieldLabel : '固定电话3',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'homepage',
													name : 'homepage',
													fieldLabel : '网址',
													width : 240,
													vtype : 'url'
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'addr',
													name : 'addr',
													fieldLabel : '地址',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'numberfield',
													id : 'postCode',
													name : 'postCode',
													fieldLabel : '邮编',
													width : 240,
													allowNegative : true,
													minLength : 6,
													maxLength : 6
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textfield',
													id : 'serviceScore',
													name : 'serviceScore',
													fieldLabel : '服务评价',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'combo',
													id : 'businessType',
													name : 'businessType',
													fieldLabel : '经营形式',
													fieldLabel : '经营性质',
													store : ["生产", "销售", "总代理"],
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
											xtype : 'combo',
											id : 'businessNature',
											name : 'businessNature',
											fieldLabel : '经营性质',
											store : ["国营", "合资", "外资", "民营",
													"个体"],
											triggerAction : 'all',
											width : 240
										}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textarea',
													id : 'mainMaterial',
													name : 'mainMaterial',
													fieldLabel : '主营材料',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.5,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'textarea',
													id : 'notes',
													name : 'notes',
													fieldLabel : '备注',
													width : 240
												}]
									}, {
										layout : 'form',
										columnWidth : 0.3,
										bodyStyle : 'border:none;',
										items : [{
													xtype : 'checkbox',
													id : 'isGuide',
													name : 'isGuide',
													fieldLabel : '指导价',
													inputValue : '1',
													width : 240
												}]
									}],
							buttons : [{
										text : '修改',
										handler : saveEdit,
										hidden : compareAuth('VIP_SUP_SUP')
									}, {
										text : '关闭',
										handler : function() {
											parent.Ext
													.getCmp("center")
													.remove("enterprise_vip_sup_look");
										}
									}]
						})
			});

	getSupplierInfo();
};

// 获得供应商信息
function getSupplierInfo() {
	Ext.Ajax.request({
				url : '/ep/EpTempSupplierServlet',
				params : {
					type : 4,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						form.getForm().setValues(data.result);
						if (data.result["isGuide"] == "1") {

							Ext.get("isGuide").dom.checked = "checked";
						}
					}
				},
				failure : function() {
					Warn_Tip();
				}

			});
};

// 保存修改信息
function saveEdit() {
	Ext.Msg.confirm("确认操作", "您确认要保存修改的信息吗？", function(op) {
		if (op == "yes") {
			if (form.getForm().isValid()) {
				var content = [];

				var len = form.getForm().items.length;
				for (var i = 0; i < len; i++) {
					if (form.getForm().items.map[form.getForm().items.keys[i]]
							.getValue() != ""
							&& form.getForm().items.map[form.getForm().items.keys[i]]
									.getValue() != null)
						if (form.getForm().items.keys[i] != "isGuide") {
							content
									.push(form.getForm().items.keys[i]
											+ "~"
											+ form.getForm().items.map[form
													.getForm().items.keys[i]]
													.getValue());
						}
				}
				content = content.toString().replace(/,/g, ";");
				if (Ext.get("isGuide").dom.checked == true)
					content += ";isGuide~1";
				Ext.Ajax.request({
					url : '/ep/EpTempSupplierServlet',
					params : {
						type : 2,
						id : id,
						content : content
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("修改成功", function() {
										parent.Ext
												.getCmp("center")
												.remove("enterprise_vip_sup_look");
									});
						}
					},
					failure : function() {
						Warn_Tip();
					}

				});
			} else {
				Info_Tip();
			}
		}
	})

};