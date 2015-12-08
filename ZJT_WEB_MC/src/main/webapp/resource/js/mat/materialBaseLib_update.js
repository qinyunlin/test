var sunshineForm, guestUnitFieldSet, sunshineWin;
var guestUnitId = 0;
var guestUnitNum = 0;
var matBaseLibObj = null;

var cid, subcid;

var itemType = [];

var unitsStore = new Ext.data.ArrayStore({
	data : [],
	fields : [ 'value', 'text' ],
	proxy : new Ext.data.MemoryProxy(itemType)
});

guestUnitFieldSet = new Ext.form.FieldSet({
	id : 'guestUnit',
	name : 'guestUnit',
	title : '特征项',
	layout : 'column',
	width : 785,
	items : []
});

Ext.onReady(function() {
	Ext.QuickTips.init();
	buildForm();
});

var nameMap = new Map();
function buildForm() {
	// 读取二级分类
	subcid = getCurArgs("subcid");
	Ext.Ajax
			.request({
				url : '/servlet/RationLibServlet',
				params : {
					type : 15,
					code : subcid
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						// 单位
						var units = data.result.units;
						if (units != null && units != "") {
							var unitsArr = units.split(";");
							for ( var i = 0; i < unitsArr.length; i++) {
								var name = [ unitsArr[i], unitsArr[i] ];
								itemType.push(name);
							}
							unitsStore.load(itemType.toString());
							itemType = [];
						}
						id = data.result.id;
						// 特征项
						Ext.Ajax
								.request({
									url : '/servlet/RationLibServlet',
									params : {
										type : 12,
										id : id
									},
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state,
												commonResultFunc, data.result)) {
											for ( var i = 0; i < data.result.length; i++) {
												var name = data.result[i].name;
												var nameshow = name;
												var code = data.result[i].code;
												var value = data.result[i].value;
												var isMain = data.result[i].isMain;
												var reg = new RegExp(";", "g"); // 创建正则RegExp对象
												nameMap.put(code, name);
												if (value != null
														&& value != "") {
													value = value.replace(reg,
															"  ");
												}
												if (isMain == "1") {
													name = "*&nbsp;"
															+ name + "：";
												} else {
													name = "&nbsp;&nbsp;&nbsp;"
															+ name + "：";
												}
												
												var GuestInput = new Ext.form.FieldSet(
														{
															columnWidth : 1,
															layout : 'column',
															border : false,
															bodyStyle : 'margin-left:40px;margin-bottom:10px;text-align:right;',
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
																		readOnly:true,
																		width : 130//**,
																		/*allowBlank : isMain == "1" ? false
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
												guestUnitFieldSet
														.add(GuestInput);
											}
											guestUnitFieldSet.doLayout();
										}
									}
								});

						id = getCurArgs("id");
						Ext.Ajax
								.request({
									url : '/servlet/MaterialBaseLibServlet',
									params : {
										type : 10,
										id : id
									},
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state,
												commonResultFunc, data.result)) {
											var info = data.result;

											sunshineForm = new Ext.form.FormPanel(
													{

														id : 'materialBaseLibAdd',
														frame : true,
														layout : 'form',
														width : 820,
														border : false,
														buttonAlign : "left",
														labelWidth : 120,
														labelAlign : 'right',
														items : [
																{
																	layout : 'column',
																	items : [
																			{
																				columnWidth : .5,
																				xtype : 'fieldset',
																				layout : 'form',
																				title : '基本信息',
																				bodyStyle : 'min-height:150px;padding-left:25px;',
																				items : [
																						{
																							xtype : 'textfield',
																							fieldLabel : '<span style="color:red;">*</span>&nbsp;&nbsp;编码',
																							id : 'code',
																							name : 'code',
																							width : 200,
																							allowBlank : false,
																							blankText : "不能为空，请正确填写",
																							value : info["code"],
																						},
																						{
																							xtype : 'textfield',
																							fieldLabel : '<span style="color:red;">*</span>&nbsp;&nbsp;名称',
																							id : 'name',
																							name : 'name',
																							width : 200,
																							allowBlank : false,
																							blankText : "不能为空，请正确填写",
																							value : info["name"]
																						},
																						{
																							xtype : 'textfield',
																							fieldLabel : '&nbsp;&nbsp;规格',
																							id : 'spec',
																							name : 'spec',
																							width : 200,
																							value : info["spec"]
																						},
																						new Ext.form.ComboBox(
																								{
																									id : 'unit',
																									name : 'unit',
																									mode : 'local',
																									triggerAction : 'all',
																									fieldLabel : '单位',
																									width : 200,
																									valueField : 'value',
																									displayField : 'text',
																									store : unitsStore
																								}) ]
																			},
																			{
																				columnWidth : .02,
																				html : '&nbsp;'
																			},
																			{
																				columnWidth : .45,
																				title : '标题图片',
																				xtype : 'fieldset',
																				width : 260,
																				height : 188,
																				layout : 'form',
																				items : [ {
																					layout : 'form',
																					items : [
																							{
																								html : '<img id="image" src="" width="200px" height="120px" />'
																							},
																							{
																								layout : 'table',
																								items : [
																										{
																											xtype : "button",
																											text : '上传',
																											handler : function() {
																												showUploadIWin();
																											}
																										},
																										{
																											xtype : "button",
																											text : '取消',
																											handler : function() {
																												Ext
																														.fly("image").dom.src = "";

																											}
																										} ]
																							} ]
																				} ]
																			} ]
																},
																guestUnitFieldSet ],
														buttons : [ {
															text : '保存',
															handler : updateMaterialBaseLib
														} ]
													});

											sunshineWin = new Ext.Panel(
													{
														frame : true,
														layout : "table",
														width : true,
														autoHeight : true,
														renderTo : "materialBaseLib_update",
														items : [ sunshineForm ]
													});

											// set value
											var image = info["image"];
											Ext.fly("image").dom.src = "http://ftp.zjtcn.com"
													+ image;
											if(info["unit"] == undefined){
												info["unit"] = "";
											}
											Ext.fly("unit").dom.value = info["unit"];

											Ext.select("input[name=hidden_code]").each(function(el) {
												var hid = Ext.getDom(el).value;
												var valId = hid.substring(hid.length - 2);
												var value = info["t"+ valId];
												if(value == undefined){
													value = "";
												}
												Ext.fly("value_"+ hid).dom.value = value;
											});
											matBaseLibObj = info;
											//填充特征项的值
											setFeatures();
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
	// 验证编码是否存在
	var code = Ext.getCmp("code").getValue();
	if (code == null || code == "") {
		Ext.MessageBox.alert("提示", "请填写编码。");
		return;
	}
	Ext.Ajax.request({
		url : '/servlet/MaterialBaseLibServlet',
		method : 'POST',
		params : {
			type : 15,
			code : code
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				var re = json.result;
				if (getCurArgs("id") == re.id) {
					// 不存在,修改
					if (!sunshineForm.form.isValid()) {
						Ext.MessageBox.alert("提示", "请填写必要的内容");
						return;
					}

					var name = Ext.getCmp("name").getValue();
					var unit = Ext.getCmp("unit").getValue();
					var spec = Ext.getCmp("spec").getValue();

					var image = Ext.fly("image").dom.src.split('/');
					image = "/" + image.slice(3).toString().replace(/,/g, "/");
					if (image.indexOf(".jsp") != -1 || image.indexOf(".") == -1) {
						image = "";
					}
					var contents = "code~" + code + ";name~" + name + ";unit~"
							+ unit + ";spec~" + spec + ";image~" + image;

					// 添加特征值
					var tcontents = "";
					var features = "";
					Ext.select("input[name=hidden_code]").each(function(el) {
						var val = Ext.getDom(el).value;
						var valId = val.substring(val.length - 2);
						var va = Ext.getDom("value_" + val).value;
						if(va == null){
							va == "";
						}
						tcontents += ";f" + valId + "~"+ va;
						if (va != null && "" != va){
							features += nameMap.get(val) + ":" + va + ";";
						}
					});
					if (features != null && "" != features){
						features = features.substring(0, features.lastIndexOf(";"));
					}
					//暂时屏蔽特征项值的更新
					contents += tcontents;
					Ext.Ajax.request({
						url : '/servlet/MaterialBaseLibServlet',
						method : 'POST',
						params : {
							type : 5,
							content : contents,
							features : features,
							ids : getCurArgs("id")
						},
						success : function(response) {
							var json = eval("(" + response.responseText + ")");
							if (getState(json.state, commonResultFunc,
									json.result)) {
								parent.tab_0404_iframe.ds.reload();
								Ext.MessageBox.alert("提示", "主材修改成功", closeWin);
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});

				} else {
					// 存在
					Ext.MessageBox.alert("提示", "编码已存在，请重新输入。");
					return;
				}
			}
		}
	});
}

// 关闭
function closeWin() {
	window.parent.Ext.getCmp('center').remove("materialBaseLib_update");
};

// 上传图片
function showUploadIWin() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_MATERIALBASELIB";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
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

function setFeatures(){
	if (matBaseLibObj != null){
		for (var i = 1, j = 15; i <= j; i ++){
			var index = i;
			if (i < 10){
				index = "0" + i;
			}
			var f_obj = Ext.getCmp("value_" + subcid + index);
			if (f_obj != null && typeof(f_obj) != "undefined"){
				f_obj.setValue(matBaseLibObj["f" + index]);
			}
		}
	}
}
