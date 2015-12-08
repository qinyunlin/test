var guestUnitFieldSet, stuff_form;
var guestUnitId = 0;
var guestUnitNum = 0;

var cid, subcid;

var itemType = [];

var eid = "";

var unitsStore = new Ext.data.ArrayStore({
	data : [],
	fields : [ 'value', 'text' ],
	proxy : new Ext.data.MemoryProxy(itemType)
});

var cidStore = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data:getCidNameArray()
});

var subcidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : []
});

var cgCidStore = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data:getCgCidNameArray()
});

var cgSubcidStore = new Ext.data.ArrayStore({
	fields : [ 'value', 'text' ],
	data : []
});

var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);

guestUnitFieldSet = new Ext.form.FieldSet({
	id : 'guestUnit',
	name : 'guestUnit',
	title : '特征项',
	layout : 'column',
	width : 781,
	items : []
});

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
	allowBlank : false,
	bodyStyle:'float:left;margin-left:5px;',
	readOnly : true,
	fieldLabel : '省',
	listeners : {
		select : function(combo, record, index) {
			comboCities.reset();
			var province = combo.getValue();
			city = zhcn.getCity(province);
			comboCities.store.loadData(city);
			comboCities.enable();
		}
	}
})

var city = [];
var comboCities = new Ext.form.ComboBox({
	id : 'comboCities',
	store : city,
	width : 80,
	valueField : "value",
	displayField : "text",
	mode : 'local',
	forceSelection : true,
	emptyText : '请选择',
	hiddenName : 'region',
	editable : false,
	triggerAction : 'all',
	bodyStyle:'float:left;',
	allowBlank : false,
	readOnly : true,
	fieldLabel : '市',
	name : 'city'

});

Ext.onReady(function() {
	Ext.QuickTips.init();
	buildForm();
});

function buildForm() {
	var id = getCurArgs("id");
	// 查询报价记录
	Ext.Ajax
			.request({
				url : '/FacMaterial.do',
				params : {
					type : 22,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						var info = data.result;
						var picPath = info["topPhoto"]?FileSite+info["topPhoto"]:"";
						stuff_form = new Ext.form.FormPanel(
								{
									id : 'materialBaseLibUpdate',
									frame : true,
									layout : 'form',
									width : 900,
									border : false,
									buttonAlign : "left",
									labelAlign : 'right',
									renderTo : 'materialBaseLib_update',
									items : [
											{
												layout : 'column',
												bodyStyle : 'border:none;margin-right:15px;',
												items : [ {
													layout : 'table',
													bodyStyle : 'border:none;',
													layoutConfig : {
														columns : 2
													},
													width : 800,
													xtype : 'fieldset',
													title : '基本信息',
													items : [
															{
																layout : 'form',
																columnWidth : .5,
																items : [
																		{
																			bodyStyle:'margin-left:48px;margin-bottom:5px;',
																			hidden : info["isAudit"] != 0 ? false : true,
																			items:[{
																				xtype:'label',
																				id: 'lblCode',
																				text:'材料编码:  '
																			},{
																				id : 'code',
																				width : 164,
																				xtype : 'textfield',
																				maxLength : 17,
																				value : info["code"],
																				readOnly : true
																			}]
																		},
																		{
																			id : 'cid',
																			xtype : 'combo',
																			fieldLabel : '造价一级分类',
																			allowBlank : false,
																			store : cidStore,
																			emptyText : "请选择",
																			mode : "local",
																			triggerAction : "all",
																			valueField : "value",
																			displayField : "text",
																			width : 165,
																			readOnly : true,
																			value : info["cid"],
																			listeners : {
																				'select' : function() {
																					var cid = Ext.getCmp("cid").getValue();
																					var subCidArray = getSubCidNameByCid(cid);
																					var subCid1 = subCidArray[0][0];
																					subcidStore.loadData(subCidArray);
																					Ext.getCmp("subcid").setValue(subCid1);
																					if(subCid1 == info["subcid"]){
																						setMaterialAttributeBySubcid(subCid1,info);
																					}else{
																						setMaterialAttributeBySubcid(subCid1,"");
																					}
																				}
																			}
																		},
																		{
																			id : 'subcid',
																			xtype : 'combo',
																			fieldLabel : '造价二级分类',
																			allowBlank : false,
																			store : subcidStore,
																			width : 165,
																			emptyText : "请选择",
																			mode : "local",
																			triggerAction : "all",
																			valueField : "value",
																			displayField : "text",
																			readOnly : true,
																			listeners : {
																				'select' : function() {
																					//加载特征项
																					var subcid = Ext.getCmp("subcid").getValue();
																					if(subcid == info["subcid"]){
																						setMaterialAttributeBySubcid(subcid,info);
																					}else{
																						setMaterialAttributeBySubcid(subcid,"");
																					}
																				}
																			}
																		},
																		{
																			id : 'cgCid',
																			xtype : 'combo',
																			fieldLabel : '采购一级分类',
																			//allowBlank : false,
																			store : cgCidStore,
																			emptyText : "请选择",
																			mode : "local",
																			triggerAction : "all",
																			valueField : "value",
																			displayField : "text",
																			width : 165,
																			readOnly : true,
																			value : info["cgCid"],
																			listeners : {
																				'select' : function() {
																					var cid = Ext.getCmp("cgCid").getValue();
																					var subCidArray = getCgSubCidNameByCgCid(cid);
																					var subCid1 = subCidArray[0][0];
																					cgSubcidStore.loadData(subCidArray);
																					Ext.getCmp("cgSubcid").setValue(subCid1);
																				}
																			}
																		},
																		{
																			id : 'cgSubcid',
																			xtype : 'combo',
																			fieldLabel : '采购二级分类',
																			//allowBlank : false,
																			store : cgSubcidStore,
																			width : 165,
																			emptyText : "请选择",
																			mode : "local",
																			triggerAction : "all",
																			valueField : "value",
																			displayField : "text",
																			readOnly : true,
																			listeners : {
																				'select' : function() {
																				}
																			}
																		},
																		{
																			fieldLabel : '材料名称',
																			id : 'name',
																			width : 164,
																			xtype : 'textfield',
																			maxLength : 30,
																			value : info["name"]
																		},
																		{
																			fieldLabel : '规格型号',
																			id : 'spec',
																			width : 164,
																			xtype : 'textfield',
																			allowBlank : false,
																			maxLength : 360,
																			value : info["spec"]
																		},
																		{
																			fieldLabel : '单位',
																			id : 'unit',
																			width : 164,
																			xtype : 'textfield',
																			allowBlank : false,
																			maxLength : 32,
																			value : info["unit"]
																		},
																		{
																			fieldLabel : '国际编码',
																			id : 'code2012',
																			width : 164,
																			xtype : 'textfield',
																			maxLength : 10,
																			value : info["code2012"]
																		},
																		{
																			fieldLabel : '品牌',
																			id : 'brand',
																			width : 164,
																			xtype : 'textfield',
																			allowBlank : true,
																			maxLength : 36,
																			value : info["brand"]
																		},
																		{
																			fieldLabel : '材料档次',
																			id : 'grade',
																			xtype : 'combo',
																			allowBlank : false,
																			width : 165,
																			store : Grade_DB,
																			emptyText : "请选择",
																			mode : "local",
																			triggerAction : "all",
																			valueField : "value",
																			displayField : "text",
																			readOnly : true,
																			value : info["grade"]
																		},
																		{
																			fieldLabel : '建议价系数',
																			id : 'quotjyj',
																			width : 164,
																			xtype : 'numberfield',
																			allowBlank : false,
																			regex : /^((0.){1}(\d){0,4})|(1)$/,
																			regexText : '请正确填写系数!必须大于0,小于等于1.',
																			value : info["quotjyj"]
																		},
																		{
																			fieldLabel : '工程价系数',
																			id : 'quotgcj',
																			width : 164,
																			xtype : 'numberfield',
																			allowBlank : false,
																			regex : /^((0.){1}(\d){0,4})|(1)$/,
																			regexText : '请正确填写系数!必须大于0,小于等于1.',
																			value : info["quotgcj"]
																		},
																		{
																			fieldLabel : '面价',
																			id : 'pricem',
																			width : 164,
																			xtype : 'numberfield',
																			allowBlank : false,
																			decimalPrecision:4,
																			value : info["priceM"]
																		},
																		{
																			fieldLabel : '产地',
																			id : 'addr',
																			width : 164,
																			xtype : 'textfield',
																			allowBlank : true,
																			maxLength : 12,
																			value : info["addr"]
																		},
																		]
															},
															{
																layout : 'form',
																bodyStyle : 'border:none;margin-top:20px;',
																columnWidth : .5,
																items : [
																		{
																			bodyStyle : 'border:1px solid #ccc;',
																			width : 200,
																			height : 230,
																			html : "<img id='mat_img' width='230' height='230'  src='" + picPath + "'/>"
																		},
																		{
																			xtype : 'button',
																			text : '更新图片',
																			handler : choose
																		} ]
															},
															{
																layout : 'form',
																bodyStyle : 'border:none;',
																columnWidth : 1,
																items : [ {
																	xtype : "textarea",
																	fieldLabel : '备注',
																	id : "notes",
																	width : 400,
																	value : info["notes"]
																} ]
															} ]
												} // end
												]
											}, guestUnitFieldSet ],
									buttons : [ {
										text : '保存',
										handler : updateMaterialBaseLib
									} ]
								});
						var subcid = info["subcid"];
						
						setMaterialAttributeBySubcid(subcid,info);
						
						eid = info["fid"];
						
						//设置产地，产地格式：省份 城市
						/**var addr = info["addr"];
						var province_addr = "";
						var city_addr = "";
						if(addr != null && addr != ""){
							var addrArr = addr.split(" ");
							province_addr = addrArr[0];
							city_addr = addrArr[1];
							if(province_addr == null || province_addr == "" || city_addr == null || city_addr == ""){
								province_addr = "";
								city_addr = "";
							}
						}
						Ext.getCmp("comboProvinces").setValue(province_addr);
						if(province_addr != ""){
							city = zhcn.getCity(province_addr);
							Ext.getCmp("comboCities").store.loadData(city);
						}
						Ext.getCmp("comboCities").setValue(city_addr);**/
						
						//加载二级分类
						var cid = Ext.getCmp("cid").getValue();
						var subCidArray = getSubCidNameByCid(cid);
						subcidStore.loadData(subCidArray);
						Ext.getCmp("subcid").setValue(info["subcid"]);
						
						var cgCid = Ext.getCmp("cgCid").getValue();
						var cgSubCidArray = getCgSubCidNameByCgCid(cgCid);
						cgSubcidStore.loadData(cgSubCidArray);
						Ext.getCmp("cgSubcid").setValue(info["cgSubcid"]);

						var sunshineWin = new Ext.Panel({
							autoHeight : true,
							renderTo : "materialBaseLib_update",
							items : [ stuff_form ]
						});

					}
				}
			});
}

function setMaterialAttributeBySubcid(subcid1,info){
	//清空原有特征项
	guestUnitFieldSet.removeAll();
	// 特征项
	Ext.Ajax
			.request({
				url : '/servlet/RationLibServlet',
				params : {
					type : 12,
					code : subcid1
				},
				success : function(response) {
					var data = eval("("+ response.responseText + ")");
					if (getState(data.state,commonResultFunc, data.result)) {
						for ( var i = 0; i < data.result.length; i++) {
							
							var name = data.result[i].name;
							var nameshow = name;
							var code = data.result[i].code;
							var isMain = data.result[i].isMain;
							if (isMain == "1") {
								name = "*&nbsp;"+ name + "：";
							} else {
								name = "&nbsp;&nbsp;&nbsp;"+ name + "：";
							}

							var GuestInput = new Ext.form.FieldSet(
									{
										columnWidth : 1,
										layout : 'column',
										border : false,
										bodyStyle : 'margin-bottom:10px;text-align:right;',
										layoutCongif : {
											columns : 2
										},
										items : [
												{
													width : 100,
													autoHeight : true,
													items : [ {
														xtype : "label",
														html : name
													} ]
												},
												{
													xtype : 'textfield',
													id : 'value_'
															+ code,
													name : 'value_'
															+ code,
													width : 130/**,
													allowBlank : isMain == "1" ? false
															: true,
													blankText : "不能为空，请正确填写"**/
												},
												new Ext.form.Hidden(
														{
															id : 'hidden_'
																	+ code,
															name : 'hidden_code',
															value : code
														}),
												{
													bodyStyle : 'margin-left:10px;',
													html : "<a href=\"#\" onclick=\"showMaterialAttribute('"
															+ nameshow
															+ "','"
															+ code
															+ "');\">选择</a>"
												} ]

									});
							guestUnitFieldSet.add(GuestInput);
						}

						guestUnitFieldSet.doLayout();
						
						if(info != "" && info != undefined){
							Ext.select("input[name=hidden_code]").each(function(el) {
								var hid = Ext.getDom(el).value;
								var valId = hid.substring(hid.length - 2);
								var value = info["t"+ valId];
								if(value == undefined){
									value = "";
								}
								Ext.fly("value_"+ hid).dom.value = value;
							});
						}
					}
				}
			});
}


// 显示单条材料图片
var chooser;
function choose() {
	chooser = new ImageDetail({
		url : '/FacMaterialPic.do',
		width : 760,
		height : 470,
		type : 4,
		id : eid,
		mid : getCurArgs("id")
	});

	chooser.show();
};

// 请求当前特征项的值列表
function getSelectItem() {
	var tempObj = [];
	Ext.Ajax.request({
		url : '/servlet/RationLibServlet?code=' + selectCode,
		params : {
			type : 14
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				var values = data.result["values"];
				if (values != null && values != "") {
					values = values.trim();
					var valueArr = values.split(";");
					for ( var i = 0; i < valueArr.length; i++) {
						if (valueArr[i] != null && valueArr[i] != "") {
							tempObj.push({
								columnWidth : .2,
								boxLabel : valueArr[i],
								name : 'val_select',
								inputValue : valueArr[i]
							});
						}
					}
					win_gov = new Ext.Window({
						title : '选择' + selectName + '特征项的值',
						modal : true,
						width : 600,
						autoHeight : true,
						items : [ {
							layout : 'column',
							bodyStyle : 'padding:6px;',
							defaultType : 'radio',
							labelWidth : 15,
							fieldLabel : '特征值',
							items : [ tempObj ]
						} ],
						buttons : [ {
							text : "确定",
							handler : function() {
								saveGov();
							}
						}, {
							text : "取消",
							handler : function() {
								win_gov.close();
							}
						} ]
					});
					win_gov.show();
				} else {
					Info_Tip("该特征项暂时还维护它的值，请输入。");
					return;
				}
			}
		}
	});
}

var selectVal = "";
var selectCode = "";
var selectName = "";
function showMaterialAttribute(name, code) {
	selectCode = code;
	selectName = name;
	getSelectItem();
};

function saveGov() {
	var chkT = false;
	Ext.select("input[name=val_select]").each(function(el) {
		var chk = Ext.getDom(el).checked;
		if (chk) {
			chkT = true;
			selectVal = Ext.getDom(el).value;
		}
	});
	if (chkT == false) {
		Info_Tip("请选择值。");
		return;
	}

	// 设置选中的值
	Ext.get("value_" + selectCode).dom.value = selectVal;
	win_gov.close();
}

// 保存
function updateMaterialBaseLib() {
	if (!stuff_form.form.isValid()) {
		Ext.MessageBox.alert("提示", "请填写必要的内容");
		return;
	}

	var cid = Ext.getCmp("cid").getValue();
	var subcid = Ext.getCmp("subcid").getValue();
	var cgCid = Ext.getCmp("cgCid").getValue();
	var cgSubcid = Ext.getCmp("cgSubcid").getValue();
	var name = Ext.getCmp("name").getValue();
	var unit = Ext.getCmp("unit").getValue();
	var spec = Ext.getCmp("spec").getValue();
	var brand = Ext.getCmp("brand").getValue();
	if (cgCid == null){
		cgCid = "";
	}
	if (cgSubcid == null){
		cgSubcid = "";
	}

	var grade = Ext.getCmp("grade").getValue();
	var quotjyj = Ext.getCmp("quotjyj").getValue();
	var quotgcj = Ext.getCmp("quotgcj").getValue();
	var pricem = Ext.getCmp("pricem").getValue();
	var notes = Ext.getCmp("notes").getValue();
	//var province_addr = Ext.get("comboProvinces").dom.value;
	//var city_addr  = Ext.get("comboCities").dom.value;
	var addr =  Ext.getCmp("addr").getValue();//province_addr + " " + city_addr;
	var image = Ext.fly("mat_img").dom.src.split('/');
	image = "/" + image.slice(3).toString().replace(/,/g, "/");
	if (image.indexOf(".jsp") != -1) {
		image = "";
	}
	
	var contents = "cid~" + cid + ";subcid~" + subcid + ";cgCid~" + cgCid + ";cgSubcid~" + cgSubcid + ";name~" + name
			+ ";unit~" + unit + ";spec~" + spec
			+ ";brand~" + brand + ";grade~" + grade + ";quotjyj~" + quotjyj
			+ ";quotgcj~" + quotgcj + ";pricem~" + pricem + ";notes~" + notes
			+ ";topPhoto~" + image + ";addr~" + addr;

	// 添加特征值
	var tcontents = "";
	Ext.select("input[name=hidden_code]").each(function(el) {
		var val = Ext.getDom(el).value;
		var valId = val.substring(val.length - 2);
		var va = Ext.getDom("value_" + val).value;
		if (va == null) {
			va == "";
		}
		tcontents += ";f" + valId + "~" + va;
	});
	contents += tcontents;

	Ext.Ajax.request({
		url : '/FacMaterial.do',
		method : 'POST',
		params : {
			type : 2,
			content : contents,
			id : getCurArgs("id"),
			fid : eid
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				if(parent.tab_mat_fac_detail_u_iframe != null){
					parent.tab_mat_fac_detail_u_iframe.ds.reload();
				}
				if(parent.tab_mat_fac_detail_iframe != null){
					parent.tab_mat_fac_detail_iframe.ds.reload();
				}
				
				Ext.MessageBox.alert("提示", "报价修改成功", closeWin);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

// 关闭
function closeWin() {
	window.parent.Ext.getCmp('center').remove("matFacUpdate");
};

// 上传图片
function showUploadIWin() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_MATERIALBASELIB";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif|PNG|png/;
	FileUpload_Ext.initComponent();
};
function up_file_back() {
	Ext.fly("url").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
function up_flash_back() {
	Ext.fly("urlF").dom.value = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
function upload_fn() {
	Ext.fly("image").dom.src = FileUpload_Ext.requestURL
			+ FileUpload_Ext.callbackMsg;
};
