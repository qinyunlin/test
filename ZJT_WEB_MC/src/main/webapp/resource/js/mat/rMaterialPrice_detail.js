var askds, grid, panel, askinfo, ff, sck, bookTpl, fs;
var id = getCurArgs("id");
var curUser = parent.currUser_mc;
var ids = [];
var win, memid, memname;

var panel, supPanel;

var supStr = "";
var cityCircleId = "";
var mname = "";
var mspec = "";
var munit = "";
var supCount = 0;
var supArrCotent = "";
var initSubcidFlag = true;
var hisCount = 0;
var weights = "";
var curr_calcWeight = "";

var currProvince = "";
var currSubcid = "";
var currBianma = "";
var loadMarsk,loadStore;
var keyFeatures = "";
var curr_rMatPrice = null;

var bodyStyle1 = "border:none;line-height: 20px;float:right;font-size:12px;";
var bodyStyle2 = "border:none;line-height: 20px;margin-right:50px;font-size:12px;";

/**
 * 截取时间：YYYY-MM-DD
 * 
 * @param date
 */
function subDate(date) {
	if (date == null || date == "") {
		return "";
	}
	return date.split(" ")[0];
}

/**
 * 截取时间：YYYY-MM-DD HH:MM:SS
 */
function substringDate(date) {
	if (date == null || date == "") {
		return "";
	}
	return date.substring(0, date.lastIndexOf("."));
}

/**
 * 将null处理为""
 * 
 * @param notes
 * @returns
 */
function returnNull(val) {
	if (val == null) {
		return "";
	}
	return val;
}

/**
 * 特征项
 */
function getFeatures(features) {
	if (features == null || "" == features) {
		return "";
	}
	var featureValArr = features.split(";");
	var featureContent = "";
	for ( var i = 0, j = featureValArr.length; i < j; i++) {
		var feature = featureValArr[i];
		var featureArr = feature.split(":");
		featureContent += featureArr[0] + " : " + featureArr[1]
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	}
	return featureContent;
}

/**
 * 创建参考材价详情显示区域
 */
function buildDetailArea() {
	Ext.lib.Ajax
			.request(
					"post",
					"/material/MaterialServlet.do",
					{
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							rMaterialPrice = data.result;
							curr_rMatPrice = data.result;
							if (rMaterialPrice == null) {
								return false;
							}
							keyFeatures = rMaterialPrice.keyFeatures;
							var subCid = rMaterialPrice.subCid;
							currProvince = rMaterialPrice.province;
							currSubcid = subCid;
							currBianma = rMaterialPrice.bianma;
							munit = rMaterialPrice.unit;
							// 一级分类名称
							var cidName = "";
							// 二级分类名称
							var subcidName = "";
							if (subCid == null || "" == subCid) {
								subCid = null;
							} else {
								cidName = getStuffName(subCid.substring(0, 2));
								/*
								 * subcidName = subCid + "," +
								 * getSubCidNameBySubcid(subCid, false);
								 */
								subcidName = subCid
										+ getSubCidNameBySubcid(subCid, false);
							}
							var cArr = getCidNameArray();
							var subArr = [];
							hisCount = rMaterialPrice.hisCount;
							weights = rMaterialPrice.weights;
							var calcWeight = rMaterialPrice.calcWeight;
							if (calcWeight == null || "" == calcWeight || "0" == calcWeight){
								calcWeight = "无";
							}else{
								calcWeight = calcWeight + "%";
							}
							curr_calcWeight = calcWeight;
							// subArr = getSubCidByCid(rMaterialPrice.subCid ==
							// null ? "" :
							// rMaterialPrice.subCid.substring(0,2));
							var subArrCombo = new Ext.form.ComboBox({
								id : 'subArr_combo',
								store : subArr,
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
								fieldLabel : '二级分类',
								value : subCid == null ? "" : subCid + ","
										+ getSubCidNameBySubcid(subCid, false),
								name : 'region'
							});
							// subArrCombo.store.loadData(subArr);
							var cArrCombo = new Ext.form.ComboBox(
									{
										id : 'cArr_combo',
										store : cArr,
										valueField : "value",
										displayField : "text",
										mode : 'local',
										forceSelection : true,
										emptyText : '请选择',
										editable : false,
										triggerAction : 'all',
										allowBlank : true,
										readOnly : true,
										fieldLabel : '一级分类',
										value : subCid == null ? ""
												: rMaterialPrice.subCid
														.substring(0, 2),
										listeners : {
											select : function(combo, record,
													index) {
												subArrCombo.reset();
												var cid = combo.getValue();
												// subArr = getSubCidByCid(cid);
												subArr = getSubCidArrByCid(cid);
												subArrCombo.store
														.loadData(subArr);
												subArrCombo.enable();
												// 设置默认第一项选中
												subArrCombo
														.setValue(subArr[0][0]
																+ ","
																+ getSubCidNameBySubcid(
																		subArr[0][0],
																		false));
											}
										}

									});

							panel = new Ext.Panel(
									{
										renderTo : "detail_id",
										title : "查看修改材料",
										layout : "table",
										border : false,
										bodyStyle : "padding-left: 15px; padding-top: 10px;color: #333333; font-size:12px; text-decoration: none;",
										layoutConfig : {
											columns : 12
										},
										items : [
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "区域："
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle2,
													items : [ {
														xtype : "label",
														text : rMaterialPrice.province
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "名称："
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle2,
													items : [ {
														xtype : "label",
														text : rMaterialPrice.name
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "分类："
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle2,
													// items : cArrCombo
													items : [ {
														xtype : 'label',
														border : false,
														html : cidName
																+ "&nbsp;&nbsp;&nbsp;"
																+ subcidName
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "规格："
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle2,
													items : [ {
														xtype : "label",
														text : returnNull(rMaterialPrice.spec)
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "单位："
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle2,
													items : [ {
														xtype : "label",
														text : returnNull(rMaterialPrice.unit)
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "来源："
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle2,
													items : [ {
														xtype : "label",
														text : returnNull(rMaterialPrice.fromBy)
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "特征项："
													} ]
												},
												{
													autoHeight : true,
													colspan : 11,
													bodyStyle : bodyStyle2,
													items : [ {
														xtype : "label",
														html : getFeatures(rMaterialPrice.features)
													} ]
												},
												{
													autoHeight : true,
													colspan : 12,
													bodyStyle : "border:none;padding-left: 0px;width;100%;",
													items : [ {
														xtype : "label",
														html : "<hr style='color:#ffffff;' />"
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : bodyStyle1,
													items : [ {
														xtype : 'label',
														border : false,
														html : "最新参考材价："
													} ]
												},
												{
													autoHeight : true,
													colspan : 11,
													bodyStyle : bodyStyle2,
													hidden : compareAuth("HIS_REFERENCEMATERIALPRICE_VIEW"),
													items : [ {
														xtype : "label",
														html : showPriceContent(
																rMaterialPrice.province,
																rMaterialPrice.price,
																rMaterialPrice.isDeleted)
													} ]
												} ]
									});
							mname = rMaterialPrice.name;
							mspec = rMaterialPrice.spec;
							cityCircleId = rMaterialPrice.cityCircleId;
							supStr = rMaterialPrice.suppliers;
							if (rMaterialPrice.suppliers == null
									|| "" == rMaterialPrice.suppliers) {
								supStr = "";
							}
							supArrCotent = supStr;
							var supsArrs = supStr.split(";");
							supCount = supsArrs.length;
							if ("" != supStr && supsArrs.length > 0) {
								supPanel = new Ext.Panel(
										{
											id : "sup_area",
											renderTo : "sups_id",
											layout : "table",
											// border : true,
											bodyStyle : "padding-left: 20px; margin-bottom:10px; color: #333333; font-size:12px; text-decoration: none;",
											width : 750,
											//autoWidth : true,
											layoutConfig : {
												columns : 7
											},
											items : [
													{
														autoHeight : true,
														colspan : 7,
														bodyStyle : 'border:none;padding-top:5px;padding-bottom:5px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "参考材料： "
														} ]
													},
													{
														autoHeight : true,
														bodyStyle : 'border:none;padding-bottom:5px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "编码"
														} ]
													},
													{
														autoHeight : true,
														bodyStyle : 'border:none;padding-bottom:5px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "供应商"
														} ]
													},
													{
														autoHeight : true,
														bodyStyle : 'border:none;padding-bottom:5px;padding-right:20px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "品牌"
														} ]
													},
													{
														autoHeight : true,
														bodyStyle : 'border:none;padding-bottom:5px;float:right;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "最新报价(建议价)"
														} ]
													},
													{
														colspan:2,
														autoHeight : true,
														bodyStyle : 'border:none;padding-bottom:5px;padding-left:10px;float:right;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "权重项（测算权重：" + calcWeight + "）"
														} ]
													},
													{
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:30px;padding-bottom:5px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : ""
														} ]
													} ]
										});
								
								for ( var i = 0; i < supsArrs.length; i++) {
									var supArr = supsArrs[i].split("~");
									var fid = supArr[0];
									var supName = supArr[1];
									var price = supArr[2];
									price = parseFloat(price).toFixed(4);
									var code = supArr[3];
									var brand = supArr[4];
									//var fname = supArr[5];
									var fname = supName;
									var weightFlag = isWeight(code);
									supPanel
											.add(
													{
														id : "bianma" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : code
														} ]
													},
													{
														id : "supName" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:30px;padding-bottom:10px;font-size:12px;',
														hidden : compareAuth("CORP_SHOP_VIEWMAT"),
														items : [ {
															xtype : "label",
															html : "<a href=javascript:viewFacMaterial('"
																	+ fid
																	+ "','"
																	+ fname
																	+ "','"
																	+ code
																	+ "'); style='text-decoration:none;font-size:12px;' >"
																	+ supName
																	+ "<a>"
														} ]
													},
													{
														id : "brand" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;font-size:12px;',
														items : [ {
															xtype : "label",
															html : brand
														} ]
													},
													{
														id : "price" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;float:right;font-size:12px;',
														items : [ {
															xtype : "label",
															html : price
														} ]
													},
													{
														id : "weight" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;padding-left:10px;float:right;font-size:12px;',
														items : [ {
															xtype : "label",
															html : "<div id='div_weight" + i + "'>" + (weightFlag ? "是" : "否") + "</div>"
														} ]
													},
													{
														id : "setWeight" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;float:right;font-size:12px;',
														hidden : (rMaterialPrice.isDeleted == "1" ? true
																: false) && !compareAuth('REFERENCEMATERIALPRICE_SET_WEIGHT'),
														items : [ {
															xtype : "label",
															html : "<div id='div_setWeight" + i + "'><a href='###' onclick=setWeight('"
															+ code
															+ "','" + (weightFlag ? "0" : "1") + "','" + i + "') style='text-decoration:none;cursor: pointer;font-size:12px;'>" + (weightFlag ? "取消权重项" : "设为权重项") + "</a></div>"
														} ]
													},
													{
														id : "cancle" + i,
														autoHeight : true,
														bodyStyle : 'border:none;padding-bottom:10px;font-size:12px;',
														hidden : (rMaterialPrice.isDeleted == "1" ? true
																: false) && !compareAuth('FAC_REFERENCEMATERIALPRICE_SET_OR_CANCLE'),
														items : [ {
															xtype : "label",
															/*html : '<a href=javascript:setRMaterialPrice('
																	+ i
																	+ '); style=text-decoration:none; >取消参考</a>'*/
															html : "<a href='###' onclick=cancleRefMat('" + fid + "','"
																+ code
																+ "','" + i + "') style='text-decoration:none;cursor: pointer;font-size:12px;'>取消参考</a>"		
														} ]
													});
								}
								supPanel.doLayout();
							}
							// panel.add(supPanel);
							/*
							 * panel .add({ colspan : 3, bodyStyle :
							 * "border:none;padding-left:80px;margin-top:25px;float:center;",
							 * hidden : rMaterialPrice.status == "1" ? true :
							 * false, items : [ { xtype : "tbbutton", width :
							 * 90, text : "保存", handler : function() { var
							 * subCidComboVal = Ext.fly( "subArr_combo")
							 * .getValue(); if (subCidComboVal == null || "" ==
							 * subCidComboVal || "请选择" == subCidComboVal) {
							 * Ext.MessageBox.alert("提示", "请选择分类！"); return
							 * false; } var newSubCid = subCidComboVal
							 * .split(",")[0]; if (subCid == newSubCid) {
							 * Ext.MessageBox.alert("提示", "分类没有改变，无需保存！");
							 * return false; } var paramData = {};
							 * paramData["type"] = "6"; paramData["mName"] =
							 * rMaterialPrice.name; paramData["mSpec"] =
							 * rMaterialPrice.spec; paramData["content"] =
							 * "subCid~" + newSubCid; paramData["id"] = id; //
							 * 保存 $ .ajax({ type : 'POST', url :
							 * '/material/MaterialServlet.do', async : false,
							 * data : paramData, complete : function( response) {
							 * var returnData = eval("(" + response.responseText +
							 * ")"); if (returnData.result != null) {
							 * Ext.MessageBox .alert( "提示", returnData.result); }
							 * else { Ext.MessageBox .alert( "提示", "保存设置成功!",
							 * closeWin); } } }); } } ] });
							 */
							panel.doLayout();
							// 初始化二级分类下拉列表
							initSubcidFlag = false;
							if (initSubcidFlag) {
								subArrCombo.reset();
								var cid = Ext.fly("cArr_combo").getValue();
								subArr = getSubCidArrByCid(cid.substring(0, cid
										.indexOf(" ")));
								if (subArr != null) {
									subArrCombo.store.loadData(subArr);
									subArrCombo.enable();
									// 设置二级分类选中
									/*
									 * subArrCombo .setValue(subCid + "," +
									 * getSubCidNameBySubcid(subCid));
									 */
								}
								initSubcidFlag = false;
							}
							
							//只有
							if ("1" != rMaterialPrice.isDeleted && !compareAuth('REFERENCEMATERIALPRICE_EDIT')){
								buildSettingArea();
							}
							//默认精确推荐
							if (!compareAuth('REFERENCEMATERIALPRICE_RECOMMENDED_FAC_MAT')){
								trueRecommendedFacMat();
							}
						},
						failure : function() {
							Ext.MessageBox.alert(data.result);
						}
					}, "type=3&id=" + id);
};

/**
 * 弹出历史参考材价信息
 */
function showHisRMaterialPriceList() {
	showHisWin();
	return false;
	/*
	 * if (hisCount == 0){ Ext.MessageBox.alert("提示", "暂无历史参考材价信息！"); return
	 * false; }
	 */
	var showWin = null;
	var showHisRMaterialPricePanel = new Ext.Panel({
		layout : 'table',
		bodyStyle : 'border:none;background-color:font-size:12px;',
		width : 660,
		layoutConfig : {
			columns : 3
		},
		items : [ {
			bodyStyle : 'border:none;padding-bottom:10px;text-align:center;font-size:12px;',
			width : 300,
			items : [ {
				xtype : "label",
				border : false,
				text : "参考供应商"
			} ]
		}, {
			bodyStyle : 'border:none;padding-bottom:10px;text-align:center;font-size:12px;',
			width : 120,
			items : [ {
				xtype : "label",
				border : false,
				text : "来源"
			} ]
		}, {
			bodyStyle : 'border:none;padding-bottom:10px;text-align:center;font-size:12px;',
			width : 120,
			items : [ {
				xtype : "label",
				border : false,
				text : "历史参考材价"
			} ]
		}, {
			bodyStyle : 'border:none;padding-bottom:10px;text-align:center;font-size:12px;',
			width : 120,
			items : [ {
				xtype : "label",
				border : false,
				text : "更新日期"
			} ]
		} ]
	/*
	 * , buttons : [ { text : '关闭', handler : function() { showWin.close(); } } ]
	 */
	});

	var showWinFlag = true;
	// 获取历史参考价材料信息
	$
			.ajax({
				type : 'POST',
				url : '/material/MaterialServlet.do',
				async : false,
				data : "type=4&id=" + id,
				success : function(response) {
					var data = eval("(" + response + ")");
					var hisList = data.result;
					if (hisList.length == 0) {
						showWinFlag = false;
						Ext.MessageBox.alert("提示", "暂无历史参考材价信息！");
						return false;
					}
					for ( var i = 0; i < hisList.length; i++) {
						var hisSuppliers = hisList[i].suppliers;
						var appSuppliers = "";
						if (hisSuppliers != null && "" != hisSuppliers) {
							var hisArrSups = hisSuppliers.split(";");
							for ( var k = 0; k < hisArrSups.length; k++) {
								var hisArrSup = hisArrSups[k].split("~");
								// appSuppliers += hisArrSup[1] + " " +
								// hisArrSup[2] + ";";
								var supFname = hisArrSup[4];
								if (supFname == null || "" == supFname) {
									appSuppliers += hisArrSup[1] + " "
											+ hisArrSup[2] + ";";
								} else {
									appSuppliers += supFname + " "
											+ hisArrSup[2] + ";";
								}
							}
							if (appSuppliers.lastIndexOf(";") != -1) {
								appSuppliers = appSuppliers.substring(0,
										appSuppliers.lastIndexOf(";"));
							}
						}
						showHisRMaterialPricePanel
								.add(
										{
											bodyStyle : 'border:none;padding-bottom:5px;text-align:center;font-size:12px;',
											width : 350,
											items : [ {
												xtype : "label",
												border : false,
												text : appSuppliers
											} ]
										},
										{
											bodyStyle : 'border:none;padding-bottom:5px;text-align:center;font-size:12px;',
											width : 120,
											items : [ {
												xtype : "label",
												border : false,
												text : hisList[i].hisPrice
											} ]
										},
										{
											bodyStyle : 'border:none;padding-bottom:5px;text-align:center;font-size:12px;',
											width : 150,
											items : [ {
												xtype : "label",
												border : false,
												text : hisList[i].createOn
											} ]
										});
					}
				}
			});
	showHisRMaterialPricePanel.doLayout();
	showHisRMaterialPricePanel.show();
	showWin = new Ext.Window({
		title : '查看历史参考材价',
		closeAction : "close",
		width : 660,
		height : 300,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : false,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ showHisRMaterialPricePanel ],
		buttons : [ {
			text : '关闭',
			handler : function() {
				showWin.close();
			}
		} ]
	});
	if (showWinFlag) {
		showWin.show();
	}
}

/**
 * 取消参考价材料
 */
function setRMaterialPrice(supIndex) {
	var supArr = supStr.split(";");
	if (supArr.length < supIndex) {
		return false;
	}
	var fid = supArr[supIndex].split("~")[0];
	var name = supArr[supIndex].split("~")[1];
	var spec = supArr[supIndex].split("~")[2];
	var mCode = supArr[supIndex].split("~")[3];
	// mspec = mspec.replace("#", "#!");
	/*
	 * var param = "fid=" + fid + "&mName=" + mname +
	 * "&rMaterialStatus=0&cityCircleId=" + cityCircleId + "&mSpec=" + mspec;
	 */
	var data = {};
	data["type"] = "5";
	data["fid"] = fid;
	data["mName"] = mname;
	data["mCode"] = mCode;
	data["rMaterialStatus"] = "0";
	data["cityCircleId"] = cityCircleId;
	data["mSpec"] = mspec;
	data["op"] = "rMaterial";
	data["ids"] = id;
	data["batchOp"] = "1";
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				Ext.MessageBox.show({
					title : '提示',
					msg : data.result + '材料的参考材价将同时取消，确定取消此批参考材料？',
					prompt : false,
					buttons : {
						"ok" : "确定",
						"cancel" : "取消"
					},
					multiline : false,
					fn : function(btn, text) {
						if ("ok" == btn) {
							var newData = {};
							newData["type"] = "5";
							newData["fid"] = fid;
							newData["mName"] = mname;
							newData["mCode"] = mCode;
							newData["rMaterialStatus"] = "0";
							newData["cityCircleId"] = cityCircleId;
							newData["mSpec"] = mspec;
							newData["op"] = "rMaterial";
							newData["ids"] = id;
							newData["batchOp"] = "0";
							$.ajax({
								type : 'POST',
								url : '/material/MaterialServlet.do',
								async : false,
								data : newData,
								complete : function(response) {
									var returnData = eval("("
											+ response.responseText + ")");
									if (returnData.result != null) {
										Ext.MessageBox.alert("提示",
												returnData.result);
									} else {
										Ext.MessageBox.alert("提示", "取消成功");
										hideSupInfo(supIndex, fid, mCode);
									}
								}
							});
						}
					}
				});
			} else {
				Ext.MessageBox.alert("提示", "取消成功");
				hideSupInfo(supIndex, fid, mCode);
			}
		}
	});
}

/**
 * 取消参考价
 * @param supIndex
 */
function cancleRefMat(fid, mCode,lenIndex){
	Ext.MessageBox.show({
		title : '提示',
		msg : '编号为：' + mCode + '的材料将会取消参考材料设置，确定取消该参考材料？',
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(btn, text) {
			if ("ok" == btn) {
				var newData = {};
				newData["type"] = "27";
				newData["bianma"] = currBianma;
				newData["fid"] = fid;
				newData["mCode"] = mCode;
				Ext.Ajax.request({
					url : '/material/MaterialServlet.do',
					params : newData,
					success : function(response) {
						var jsondata = eval("(" + response.responseText + ")");
						if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
							var name = Ext.fly("input_name").getValue();
							var spec = Ext.fly("input_spec").getValue();
							var code = Ext.fly("input_code").getValue();
							if ((name != null && "" != name) || (spec != null && "" != spec)
									|| (code != null && "" != code)) {
								setting_ds.load();
							}
							
							Ext.MessageBox.alert("提示",
									'编号为：' + mCode + '的材料取消参考材料成功！');
							//window.location.reload();
							supPanel.remove("bianma" + lenIndex);
							supPanel.remove("supName" + lenIndex);
							supPanel.remove("brand" + lenIndex);
							supPanel.remove("price" + lenIndex);
							supPanel.remove("cancle" + lenIndex);
							supPanel.remove("weight" + lenIndex);
							supPanel.remove("setWeight" + lenIndex);
							var count = supPanel.items.length;
							if (count <= 6){
								//supPanel.hide();
								supPanel.destroy();
								supPanel = null;
							}
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

/**
 * 显示价格内容
 * 
 * @param status
 */
function showPriceContent(province, price, status) {
	if (parseFloat(price) == 0){
		price = "";
	}else{
		if (parseFloat(price) >= 100){
			price = parseInt(Math.round(price));
		}else{
			price = parseFloat(price).toFixed(2);
		}
	}
	var aHtml = "<a href='#' onclick='showHisRMaterialPriceList();'>查看历史参考材价</a>";
	/*var priceHtml = "<span id='price_span'>" + province + "省  " + price
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "</span>";*/
	var priceHtml = "<span id='price_span'>" + price
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "</span>";
	if ("1" == status) {
		return aHtml;
	}
	return priceHtml + aHtml;
}

// 查看供应商材料
function viewFacMaterial(fid, fname, code) {
	window.parent.createNewWidget("mat_fac_detail", '供应商材价',
			'/module/mat/mat_fac_detail.jsp?eid=' + fid + '&fname=' + fname
					+ '&mName=' + mname + '&mSpec=' + mspec + "&mCode=" + code);
}

/**
 * 关闭、刷新列表
 */
function closeWin() {
	window.parent.tab_0407_iframe.ds.reload();
	window.parent.Ext.getCmp('center').remove("rMaterialPrice_detial");
}

/**
 * 动态伪隐藏实现
 * 
 * @param supIndex
 * @param fid
 * @param code
 */
function hideSupInfo(supIndex, fid, code) {
	if (supCount > 1) {
		supPanel.remove("supName" + supIndex);
		supPanel.remove("price" + supIndex);
		supPanel.remove("cancle" + supIndex);
		// 伪更新当前最新参考价
		var supsArrs = "";
		if (supArrCotent != null && "" != supArrCotent) {
			supsArrs = supArrCotent.split(";");
		}
		var currPrice = parseFloat("0.0000");
		var currCount = parseFloat("0.0000");
		for ( var i = 0; i < supsArrs.length; i++) {
			var sups = supsArrs[i].split("~");
			// if (fid != sups[0]) {
			if (code != sups[3]) {
				currPrice += parseFloat(sups[2]);
				currCount += parseFloat("1.0000");
			}
		}
		var lastPrice = currPrice / currCount;
		document.getElementById("price_span").innerHTML = lastPrice.toFixed(4)
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		// 供应商来源数量-1
		supCount = supCount - 1;
	} else if (supCount == 1) {
		// supPanel.hide();
		supPanel.remove("cancle" + supIndex);
		document.getElementById("price_span").innerHTML = "";
		supCount = supCount - 1;
	}
}

/**
 * 弹出历史参考材价信息
 */
function showHisWin() {
	if (currProvince == null || "" == currProvince) Ext.MessageBox.alert("提示","请选择一个省份！");
	
	var cityList = null;
	var data = {};
	data["type"] = "36";
	data["province"] = currProvince;
	data["bianma"] = currBianma;
	data["isDeleted"] = "0";
	
	var flag = true;
	/*$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			cityList = data.result;
			if (cityList == null || cityList.length == 0) {
				Ext.MessageBox.alert("提示","暂无历史参考材价信息！");
				flag = false;
				return false;
			}
		}
	});*/
	
	if (!flag) return false;
	
	/*var hisColumns = [
		  				new Ext.grid.RowNumberer({
							width : 30
						}),
						//sm,
						{
		  					width : 200,
							//header :  currProvince + "省",
		  					header :  "历史价格",
							sortable : true,
							dataIndex : currProvince,
							renderer : function(value, meta, record) {
								var cprice = record.get(currProvince);
								if (cprice == null || ""== cprice){
									//cprice = "0.00";
									return "";
								}
								var rPrice = cprice;
								if (parseFloat(cprice) >= 100){
									rPrice = parseInt(Math.round(cprice));
								}else{
									rPrice = parseFloat(cprice).toFixed(2);
								}
								return "<span title='" + rPrice + "'>" + rPrice + "</span>";
							}
						}];*/
	
	var hisColumns = [
		  				new Ext.grid.RowNumberer({
							width : 30
						}),
						//sm,
						{
		  					width : 200,
							//header :  currProvince + "省",
		  					header :  "历史价格",
							sortable : true,
							dataIndex : "price",
							renderer : function(value, meta, record) {
								var cprice = record.get("price");
								if (cprice == null || "" == cprice){
									//cprice = "0.00";
									return "";
								}
								var rPrice = cprice;
								if (parseFloat(cprice) >= 100){
									rPrice = parseInt(Math.round(cprice));
								}else{
									rPrice = parseFloat(cprice).toFixed(2);
								}
								return "<span title='" + rPrice + "'>" + rPrice + "</span>";
							}
						}];
	
	//var fieldItems = [currProvince,"createOn"];
	var fieldItems = ["price","createOn"];
	
	/*var map = new Map();
	for (var i = 0, j = cityList.length; i < j; i ++){
		var city = cityList[i];
		var cityName = city["city"];
		if (map.containsKey(cityName)) continue;
		hisColumns.push({
			width : 70,
			header : cityName,
			sortable : false,
			dataIndex : cityName,
			renderer : function(value, meta, record) {
				var cprice = record.get(this.dataIndex);
				if (cprice == null || ""== cprice){
					//cprice = "0.00";
					return "";
				}
				var rPrice = cprice;
				if (parseFloat(cprice) >= 100){
					rPrice = parseInt(Math.round(cprice));
				}else{
					rPrice = parseFloat(cprice).toFixed(2);
				}
				return "<span title='" + rPrice + "'>" + rPrice + "</span>";
			}
		} );
		fieldItems.push(cityName);
		map.put(cityName, cityName);
	}*/
	
	hisColumns.push({
		width : 200,
		header : '时间',
		sortable : true,
		dataIndex : 'createOn',
		renderer : function(value, meta, record) {
			var createOn = record.get("createOn");
			return createOn.split(" ")[0];
		}
	} );
	
	var hisDs = new Ext.data.SelfStore(
			{
				proxy : new Ext.data.HttpProxy({
					url : '/material/MaterialServlet.do'
				}),
				reader : new Ext.data.JsonReader({
					root : 'result'
				}, fieldItems),
				baseParams : {
					type : 34,
					page : 1,
					pageSize : 15,
					province : currProvince,
					bianma : currBianma
				},
				countUrl : '/material/MaterialServlet.do',
				countParams : {
					type : 35
				},
				remoteSort : true
			});
	
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在加载历史参考材料中...",
        disabled : false,
        store : hisDs
      });
	
	loadMarsk.show();
	
	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});

	var pagetool = new Ext.ux.PagingToolbar({
		store : hisDs,
		displayInfo : true,
		//pageSize : 20
		pageSize : 15
	});
	
	var hisGrid = new Ext.grid.GridPanel({
		store : hisDs,
		stripeRows : true,
		loadMask : true,
		height : 450,
		sm : sm,
		columns : hisColumns,
		viewConfig : {
			forceFit : false,
			autoScroll : true
		},
		// renderTo : 'his_grid',
		bbar : pagetool
	});
	
	var hisPanel = new Ext.Panel({
		width : "100%",
		autoScroll : true,
		items : [hisGrid]
	});

	var hisWin = new Ext.Window({
		title : "查看 \"" + mname + "\" 历史参考材价-" + currProvince + "省",
		closeAction : "close",
		//x : "0",
		//y : "0",
		y : 50,
		//autoWidth : true,
		//width : "100%",
		width : 450,
		autoWidth : false,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ hisPanel ],
		buttons : [ {
			text : '关闭',
			handler : function() {
				hisWin.close();
				loadMarsk.hide();
			}
		} ]
	});
	hisDs.load();
	hisWin.show();
	//loadMarsk.hide();
}

var setting_ds, setting_grid;
function buildSettingArea() {
	setting_ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/material/MaterialServlet.do'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ "id", "subcid", "name", "spec", "unit", "issueDate", "notes",
				"quotjyj", "quotgcj", "grade", "cid", "addr", "brand",
				"topPhoto", "pricem", "pricej", "priceg", "code", "code2012", "createOn",
				"createBy", "updateOn", "updateBy", "ename",
				"province", "city", "fname","cbianma","fid" ]),
		baseParams : {
			type : 52,
			page : 1,
			//pageSize : 20,
			pageSize : 15,
			content : "province" + currProvince + ";subcid~" + currSubcid
					+ ";isDeleted~0"
		},
		countUrl : '/material/MaterialServlet.do',
		countParams : {
			type : 53
		},
		remoteSort : true,
		timeout : 2 * 60 * 1000
	});
	setting_ds.setDefaultSort("updateOn", "DESC");

	var pagetool = new Ext.ux.PagingToolbar({
		store : setting_ds,
		displayInfo : true
	});

	var sm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : "id"
	});
	setting_grid = new Ext.grid.EditorGridPanel({
		title : "设置参考材料",
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		autoScroll : true,
		store : setting_ds,
		loadMask : true,
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), sm, {
			header : 'id',
			sortable : false,
			dataIndex : 'id',
			hidden : true
		}, {
			header : '材料编码',
			sortable : true,
			dataIndex : 'code'
		}, {
			header : '地区',
			sortable : true,
			dataIndex : 'city',
			renderer : function(value, meta, record) {
				var province = record.get("province");
				var city = record.get("city");
				return province + "   " + city;
			}
		}, {
			header : '材料名称',
			sortable : false,
			dataIndex : 'name',
			renderer : showName
		}, {
			header : '型号规格',
			sortable : false,
			dataIndex : 'spec'
		}, {
			header : '单位',
			sortable : false,
			dataIndex : 'unit'
		}, {
			header : '品牌',
			sortable : true,
			dataIndex : 'brand'
		}, {
			header : "面价",
			sortable : false,
			dataIndex : 'pricem',
			renderer : function(value, meta, record) {
				var pricem = record.get("pricem");
				var returnPrice = parseFloat(pricem);
				return returnPrice.toFixed(2);
			}
		}, {
			header : '建议价',
			sortable : false,
			dataIndex : 'quotjyj',
			renderer : function(value, meta, record) {
				var quotjyj = record.get("quotjyj");
				var pricem = record.get("pricem");
				if (quotjyj == "" || quotjyj == null) { //es搜索
					return record.get("pricej");
				} else {
					var returnPrice = parseFloat(quotjyj) * parseFloat(pricem);
					return returnPrice.toFixed(2);
				}
			}
		}, {
			header : '工程价',
			sortable : false,
			dataIndex : 'quotgcj',
			renderer : function(value, meta, record) {
				var quotgcj = record.get("quotgcj");
				var pricem = record.get("pricem");
				if (quotgcj == "" || quotgcj == null) { //es搜索
					return record.get("priceg");
				} else {
					var returnPrice = parseFloat(quotgcj) * parseFloat(pricem);
					return returnPrice.toFixed(2);
				}
			}
		}, {
			header : '供应商',
			sortable : true,
			dataIndex : 'ename'
		}, {
			header : '更新时间',
			sortable : true,
			dataIndex : 'updateOn'
		} ],
		renderTo : 'setting_grid',
		bbar : pagetool,
		tbar : [ {
			text : '精确推荐',
			icon : '/resource/images/edit.gif',
			handler : trueRecommendedFacMat,
			hidden : compareAuth('REFERENCEMATERIALPRICE_RECOMMENDED_FAC_MAT')
		},{
			text : '模糊推荐',
			icon : '/resource/images/edit.gif',
			handler : recommendedFacMat,
			hidden : compareAuth('REFERENCEMATERIALPRICE_RECOMMENDED_FAC_MAT')
		},{
			text : '设置为参考材料',
			icon : '/resource/images/edit.gif',
			handler : settingReferenceMaterial,
			hidden : compareAuth('REFERENCEMATERIALPRICE_SET_REFMATPRICE')
		} ]
	});

	function showName(value, p, record) {
		var img = record.data.topPhoto;
		var name = record.data.name;
		var bianma = record.data.cbianma;
		var stName = "";
		if (img != null && img != "") {
			stName = "<div style='float:left;'><image src='/ext/resource/images/img_default.jpg'/></div><div style='float:left;'>"
					+ name + "</div>";
		} else {
			stName = "&nbsp;&nbsp;&nbsp;&nbsp;" + name;
		}
		if (bianma != null && "" != bianma) {
			return "<div style='float:left;'><img src='/resource/images/icon_can.gif' title='参考价材料' /></div>"
					+ stName;
		}
		return stName;
	}

	var bar = new Ext.Toolbar({
		renderTo : setting_grid.tbar,
		items : [ {
			xtype : "label",
			text : "材料名称："
		}, {
			id : 'input_name',
			xtype : 'textfield',
			enableKeyEvents : true,
			value : mname,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, '-', {
			xtype : "label",
			text : "材料规格："
		}, {
			id : 'input_spec',
			xtype : 'textfield',
			value : mspec,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, "-", {
			xtype : "label",
			text : '材料编码：'
		}, {
			id : 'input_code',
			xtype : 'textfield',
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e) {
					if (e.getKey() == e.ENTER) {
						searchlist();
					}
				}
			}
		}, {
			xtype : 'button',
			icon : '/resource/images/zoom.png',
			text : '查询',
			handler : searchlist
		} ]
	});

	// setting_ds.load();
	setting_grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	setting_ds.on("load", function(ds, records, option) {
		var len = records.length;
		var temp = "";
		for ( var i = 0; i < len; i++) {
			temp += records[i].json;
		}
		if (temp == "您的权限不足") {
			Ext.MessageBox.alert("温馨提示", temp, function() {
				window.parent.Ext.getCmp('center').remove(
						"rMaterialPrice_detial");
			});
			return;
		}
	});
}

/**
 * 搜索
 * 
 * @returns {Boolean}
 */
function searchlist() {
	if (currBianma == null || "" == currBianma) {
		Ext.MessageBox.alert("提示", "没有参考材价编码的材价不可查询参考材料!");
		return false;
	}
	var name = Ext.fly("input_name").getValue();
	var spec = Ext.fly("input_spec").getValue();
	var code = Ext.fly("input_code").getValue();
	if ((name == null || "" == name) && (spec == null || "" == spec)
			&& (code == null || "" == code)) {
		Ext.MessageBox.alert("提示", "请输入搜索条件!");
		return false;
	}
	/*var content = "province~" + currProvince + ";subcid~" + currSubcid
			+ ";code~" + code + ";name~" + name + ";spec~" + spec + ";isDeleted~0;settingFlag~1";*/
	var content = "province~" + currProvince + ";code~" + code + ";name~" + name + ";spec~" + spec + ";unit~" + munit + ";isDeleted~0";
	setting_ds.baseParams["content"] = content;
	setting_ds.baseParams["trueRecommended"] = "0";
	setting_ds.baseParams["isSearch"] = "1";
	//setting_ds.baseParams["keyFeatures"] = keyFeatures;
	setting_ds.baseParams["keyFeatures"] = "";
	setting_ds.baseParams["f01"] = "";
	setting_ds.baseParams["f02"] = "";
	setting_ds.baseParams["f03"] = "";
	setting_ds.baseParams["f04"] = "";
	setting_ds.baseParams["f05"] = "";
	setting_ds.baseParams["f06"] = "";
	setting_ds.baseParams["f07"] = "";
	setting_ds.baseParams["f08"] = "";
	setting_ds.baseParams["f09"] = "";
	setting_ds.baseParams["f10"] = "";
	setting_ds.baseParams["f11"] = "";
	setting_ds.baseParams["f12"] = "";
	setting_ds.baseParams["f13"] = "";
	setting_ds.baseParams["f14"] = "";
	setting_ds.baseParams["f15"] = "";
	setting_ds.load();
}

/**
 * 设置参考材价
 */
function settingReferenceMaterial() {
	if (currBianma == null || "" == currBianma){
		Ext.MessageBox.alert("提示", "没有参考材价编码的材价不可设置参考材料!");
		return false;
	}
	var rows = setting_grid.getSelectionModel().getSelections();
	var ids = [];
	var fids = [];
	var usedContent = "";
	for ( var i = 0; i < rows.length; i++) {
		var bianma = rows[i].get("cbianma");
		var id = rows[i].get('id');
		var mCode = rows[i].get('code');
		var fid = rows[i].get("fid");
		if (bianma != null && "" != bianma) {
			usedContent += mCode + ";";
		}
		if (mCode == null || "" == mCode){
			Ext.MessageBox.alert("提示", "材料编码为空的不能设置为参考材料，请重新选择！");
			return false;
		}
		ids.push(id);
		fids.push(fid);
	}
	if (ids.length == 0) {
		Ext.MessageBox.alert("提示", "请勾选一条材料！");
		return false;
	}

	if ("" != usedContent) {
		usedContent = "编号："
				+ usedContent.substring(0, usedContent.lastIndexOf(";"))
				+ " 材料已被其他参考材价使用，请重新确认后再操作！";
		Ext.MessageBox.alert("提示", usedContent);
		return false;
	}

	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在设置参考材价...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.lib.Ajax.request("post", "/material/MaterialServlet.do?type=26&ids="
			+ ids.toString() + "&bianma=" + currBianma + "&fid=" + fids.toString(), {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				setting_ds.load();
				createRefMatArea(rows);
				//Ext.MessageBox.alert("提示", "设置成功！",refresh);
				Ext.MessageBox.alert("提示", "设置成功！");
				loadMarsk.hide();
				loadStore = null;
			}else{
				loadMarsk.hide();
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

function createRefMatArea(rows){
	if ("undefined" == typeof(supPanel) || supPanel == null){
		supPanel = new Ext.Panel(
				{
					id : "sup_area",
					renderTo : "sups_id",
					layout : "table",
					// border : true,
					bodyStyle : "padding-left: 20px; margin-bottom:10px; color: #333333; font-family: 微软雅黑; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: none;",
					width : 650,
					layoutConfig : {
						columns : 7
					},
					items : [
							{
								autoHeight : true,
								colspan : 5,
								bodyStyle : 'border:none;padding-top:5px;padding-bottom:5px;',
								items : [ {
									xtype : "label",
									html : "参考材料： "
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;padding-bottom:5px;',
								items : [ {
									xtype : "label",
									html : "编码"
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;padding-bottom:5px;',
								items : [ {
									xtype : "label",
									html : "供应商"
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;padding-bottom:5px;padding-right:20px;',
								items : [ {
									xtype : "label",
									html : "品牌"
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;padding-bottom:5px;float:right;',
								items : [ {
									xtype : "label",
									html : "最新报价(建议价)"
								} ]
							},
							{
								colspan:2,
								autoHeight : true,
								bodyStyle : 'border:none;padding-bottom:5px;padding-left:10px;float:right;font-size:12px;',
								items : [ {
									xtype : "label",
									html : "权重项（测算权重：" + curr_calcWeight + "）"
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;padding-right:30px;padding-bottom:5px;font-size:12px;',
								items : [ {
									xtype : "label",
									html : ""
								} ]
							}  ]
				});
	}
	var len = supCount + 1;
	var rowLen = rows.length;
	supCount += rowLen;
	for ( var i = 0; i < rowLen; i ++) {
		len += i;
		var fid = rows[i].get("fid");
		var fname = rows[i].get("fname");
		var price = rows[i].get("pricem");
		var supName = rows[i].get("ename");
		var quotjyj = rows[i].get("quotjyj");
		price = (parseFloat(price) * parseFloat(quotjyj)).toFixed(4);
		var code = rows[i].get("code");
		var brand = rows[i].get("brand");
		supPanel
				.add(
						{
							id : "bianma" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;',
							items : [ {
								xtype : "label",
								html : code
							} ]
						},
						{
							id : "supName" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-right:30px;padding-bottom:10px;',
							hidden : compareAuth("CORP_SHOP_VIEWMAT"),
							items : [ {
								xtype : "label",
								html : "<a href=javascript:viewFacMaterial('"
										+ fid
										+ "','"
										+ fname
										+ "','"
										+ code
										+ "'); style=text-decoration:none; >"
										+ supName
										+ "<a>"
							} ]
						},
						{
							id : "brand" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;',
							items : [ {
								xtype : "label",
								html : brand
							} ]
						},
						{
							id : "price" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;float:right;',
							items : [ {
								xtype : "label",
								html : price
							} ]
						},
						{
							id : "weight" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;padding-left:10px;float:right;font-size:12px;',
							items : [ {
								xtype : "label",
								html : "<div id='div_weight" + len + "'>否</div>"
							} ]
						},
						{
							id : "setWeight" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-right:20px;padding-bottom:10px;float:right;font-size:12px;',
							hidden : (rMaterialPrice.isDeleted == "1" ? true
									: false) && !compareAuth('REFERENCEMATERIALPRICE_SET_WEIGHT'),
							items : [ {
								xtype : "label",
								html : "<div id='div_setWeight" + i + "'><a href='###' onclick=setWeight('"
								+ code
								+ "','1','" + len + "') style='text-decoration:none;cursor: pointer;font-size:12px;'>设为权重项</a></div>"
							} ]
						},
						{
							id : "cancle" + len,
							autoHeight : true,
							bodyStyle : 'border:none;padding-bottom:10px;',
							hidden : (rMaterialPrice.isDeleted == "1" ? true
									: false) && !compareAuth('FAC_REFERENCEMATERIALPRICE_SET_OR_CANCLE'),
							items : [ {
								xtype : "label",
								html : "<a href='###' onclick=cancleRefMat('" + fid + "','"
									+ code
									+ "','" + len + "') style='text-decoration:none;cursor: pointer;'>取消参考</a>"		
							} ]
						});
	}
	supPanel.doLayout();
}

/**
 * 判断是否设为权重项
 * @param code
 */
function isWeight(code){
	if (weights == null || "" == weights) return false;
	var weightArr = weights.split(";");
	for (var i = 0, j = weightArr.length; i < j; i ++){
		var curr_code = weightArr[i];
		if (code == curr_code) return true;
	}
	return false;
}

/**
 * 设置/取消 权重项
 * @param code
 * @param flag
 */
function setWeight(code, flag, index){
	if ("1" == flag){ //设置
		weights += code + ";";
	}else{ //取消
		if (weights == null || "" == weights) return;
		var weightArr = weights.split(";");
		var newWeights= "";
		for (var i = 0, j = weightArr.length; i < j; i ++){
			var curr_code = weightArr[i];
			if (code != curr_code && "" != curr_code){
				newWeights += curr_code + ";";
			}
		}
		weights = newWeights;
	}
	//更新权重项
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在设置权重项...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.lib.Ajax.request("post", "/material/MaterialServlet.do?type=61&bianma=" + currBianma + "&weights=" + weights, {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				//更新权重项区域
				$("#div_weight" + index).html(flag == "1" ? "是" : "否");
				$("#div_setWeight" + index).html("<a href='###' onclick=setWeight('"
						+ code
						+ "','" + (flag == "1" ? "0" : "1") + "','" + index + "') style='text-decoration:none;cursor: pointer;font-size:12px;'>" + (flag == "1" ? "取消权重项" : "设为权重项") + "</a>");
				Ext.MessageBox.alert("提示", "设置成功！");
				loadMarsk.hide();
				loadStore = null;
			}else{
				loadMarsk.hide();
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

/**
 * 根据关键特征项集合推荐供应商报价
 */
function recommendedFacMat(){
	if (keyFeatures == null || "" == keyFeatures){
		Ext.MessageBox.alert("提示", "关键特征项为空！无法推荐供应商报价，请手动进行搜索！");
		return;
	}
	var content = "province~" + currProvince + ";subcid~" + currSubcid + ";unit~" + munit + ";isDeleted~0";
	setting_ds.baseParams["content"] = content;
	setting_ds.baseParams["keyFeatures"] = keyFeatures;
	setting_ds.baseParams["stdName"] = "";
	setting_ds.baseParams["trueRecommended"] = "0";
	setting_ds.baseParams["isSearch"] = "0";
	setting_ds.baseParams["f01"] = "";
	setting_ds.baseParams["f02"] = "";
	setting_ds.baseParams["f03"] = "";
	setting_ds.baseParams["f04"] = "";
	setting_ds.baseParams["f05"] = "";
	setting_ds.baseParams["f06"] = "";
	setting_ds.baseParams["f07"] = "";
	setting_ds.baseParams["f08"] = "";
	setting_ds.baseParams["f09"] = "";
	setting_ds.baseParams["f10"] = "";
	setting_ds.baseParams["f11"] = "";
	setting_ds.baseParams["f12"] = "";
	setting_ds.baseParams["f13"] = "";
	setting_ds.baseParams["f14"] = "";
	setting_ds.baseParams["f15"] = "";
	setting_ds.load();
}

function trueRecommendedFacMat(){
	if (keyFeatures == null || "" == keyFeatures){
		Ext.MessageBox.alert("提示", "关键特征项为空！无法推荐供应商报价，请手动进行搜索！");
		return;
	}
	var content = "province~" + currProvince + ";subcid~" + currSubcid + ";unit~" + munit + ";isDeleted~0";
	setting_ds.baseParams["content"] = content;
	setting_ds.baseParams["trueRecommended"] = "1";
	setting_ds.baseParams["isSearch"] = "0";
	setting_ds.baseParams["stdName"] = curr_rMatPrice["stdName"];
	setting_ds.baseParams["f01"] = curr_rMatPrice["f01"];
	setting_ds.baseParams["f02"] = curr_rMatPrice["f02"];
	setting_ds.baseParams["f03"] = curr_rMatPrice["f03"];
	setting_ds.baseParams["f04"] = curr_rMatPrice["f04"];
	setting_ds.baseParams["f05"] = curr_rMatPrice["f05"];
	setting_ds.baseParams["f06"] = curr_rMatPrice["f06"];
	setting_ds.baseParams["f07"] = curr_rMatPrice["f07"];
	setting_ds.baseParams["f08"] = curr_rMatPrice["f08"];
	setting_ds.baseParams["f09"] = curr_rMatPrice["f09"];
	setting_ds.baseParams["f10"] = curr_rMatPrice["f10"];
	setting_ds.baseParams["f11"] = curr_rMatPrice["f11"];
	setting_ds.baseParams["f12"] = curr_rMatPrice["f12"];
	setting_ds.baseParams["f13"] = curr_rMatPrice["f13"];
	setting_ds.baseParams["f14"] = curr_rMatPrice["f14"];
	setting_ds.baseParams["f15"] = curr_rMatPrice["f15"];
	setting_ds.load();
}

function refresh(){
	window.location.reload();
}

function init() {
	buildDetailArea();
};

Ext.onReady(function() {
	init();
	Ext.QuickTips.init();
});
