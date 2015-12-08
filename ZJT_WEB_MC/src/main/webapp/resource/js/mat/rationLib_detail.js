var itSel;
var form;
var dd;
var ds;
var id;
var basic_area1;
var basic_area;
var featurePanel,featureWin,featureItems,featureChk;
var materialPanel,materialWin;
var bulkPanel,bulkWin;
var calcPanel,calcWin;
var updateRemindPanel, updateRemindWin, monthChk;
var currFeature;
var currSubcid = null;
var refreshFlag = false;
var loadMarsk,loadStore;
var remindUpdateFlag = false;
var updateRemindList = null;
var curr_times = "";
var curr_isApp = "";

Ext.onReady(function() {

	// 初始化修改
	initFormValue();
});

function is_zero(number){
	if(number == 0){return ""}
	else return number;
}

function is_int(number) {
    return ! isNaN(parseInt(number));
}

/**
 * 测算权重信息维护
 * @param fcode
 * @param fname
 */
function createCalcWeightManageArea(mcode,mname,calcWeight){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	
	refreshFlag = false;
	
	calcWeightPanel = new Ext.Panel(
			{
				renderTo : "material_grid",
				layout : "table",
				border : false,
				id : "calcWeightForm",
				layoutConfig : {
					columns : 3
				},
				items : [{
					colspan:3,
					bodyStyle : 'border:none;line-height: 20px;margin-left:10px;margin-top:10px;',
					autoHeight : true,
					items : [{
						xtype : "label",
						html : "二级分类 ："+ mcode + " " + mname
					}]
				},{
					colspan:3,
					bodyStyle : 'border:none;line-height: 40px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<hr/>"
					}]
				},{
					bodyStyle : 'border:none;line-height: 40px;float:left;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "测算权重："
					}]
				},{
					bodyStyle : 'border:none;line-height: 40px;',
					autoHeight : true,
					items : [ {
						id : "calcWeight_mcode",
						xtype : "textfield",
						width : 200,
						value : is_zero(calcWeight)
					}]
				},{
					bodyStyle : 'border:none;line-height: 40px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						text : "%（大于50小于100的整数）"
					}]
				},{
					bodyStyle : 'border:none;line-height: 40px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						text : ""
					}]
				},{
					colspan:2,
					bodyStyle : 'border:none;line-height: 30px;float:left;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						text : "（如未设置则参考价测算默认取平均值）"
					}]
				},{
					bodyStyle : 'border:none;line-height: 10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						text : ""
					}]
				},{
					colspan:2,
					bodyStyle : 'border:none;line-height: 30px; margin-bottom:10px;',
					autoHeight : true,
					items : [  {
						xtype : "button",
						text : "保存设置",
						width : 90,
						hidden : compareAuth("BASE_MATERIAL_EDIT"),
						onClick : function() {
							updateCalcWeight(mcode, mname);
						}
					} ]
				}
				]
			});
	
	calcWeightWin = new Ext.Window({
		title : '设置 ' + '参考价测算权重',
		closeAction : "close",
		width : 660,
		//height : 300,

		align:'center',
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ calcWeightPanel ],
		listeners : {
			close : function() {
				if (refreshFlag){
					//window.location.reload();
					reload();
				}
			}
		}
	});
	calcWeightWin.show();
}
/**
 * 批量信息维护
 * @param fcode
 * @param fname
 */
function createBulkManageArea(mcode,mname,bulk){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	
	refreshFlag = false;
	
	bulkPanel = new Ext.Panel(
			{
				renderTo : "material_grid",
				layout : "table",
				border : false,
				id : "materialForm",
				layoutConfig : {
					columns : 3
				},
				items : [{
					colspan:3,
					bodyStyle : 'border:none;line-height: 20px;margin-left:10px;margin-top:10px;',
					autoHeight : true,
					items : [{
						xtype : "label",
						html : "二级分类 ："+ mcode + " " + mname
					}]
				},{
					colspan:3,
					bodyStyle : 'border:none;line-height: 40px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<hr/>"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 40px;float:right;margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "起批量："
				  }]
				},{
					bodyStyle : 'border:none;line-height: 40px;float:left;',
					autoHeight : true,
					width:200,
					items : [ {
						id : "bulk_mcode",
						xtype : "textfield",
						value : is_zero(bulk)
				  }]
				},{
					bodyStyle : 'border:none;line-height: 40px;margin-right:20px;',
					autoHeight : true,
					items : [  {
						xtype : "button",
						text : "保存设置",
						width : 90,
						hidden : compareAuth("BASE_MATERIAL_EDIT"),
						onClick : function() {
							updateBulk(mcode, mname);
						}
					} ]
				}
				]
			});
	
	bulkWin = new Ext.Window({
		title : '设置 ' + '起批量',
		closeAction : "close",
		width : 660,
		//height : 300,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ bulkPanel ],
		listeners : {
			close : function() {
				if (refreshFlag){
					//window.location.reload();
					reload();
				}
			}
		}
	});
	bulkWin.show();
}

/**
 * 特征项管理维护
 * @param fcode
 * @param feature
 */
function createFeatureManageArea(fname, fcode, featureVal){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	
	refreshFlag = false;
	
	featureItems = [];
	if (featureVal != null && "" != featureVal){
		var featureValArr = featureVal.split(";");
		for (var i = 0, j = featureValArr.length; i < j; i ++){
			var feature = featureValArr[i];
			if (feature != null && "" != feature){
				var chkItem = {};
				chkItem["boxLabel"] = feature;
				chkItem["inputValue"] = feature;
				chkItem["name"] = feature;
				featureItems.push(chkItem);
			}
		}
	}
	
	if (featureItems.length > 0){
		featureChk = new Ext.form.CheckboxGroup({
		    xtype: 'checkboxgroup',
		    //fieldLabel: '请勾选省份',
		    name: 'featureChk',
		    allowBlank: false,
		    id: 'featureChk',
		    width: 600,
		    columns: 4,
		    items: featureItems
		});
	}else{
		featureChk = [];
	}
	
	
	
	featurePanel = new Ext.Panel(
			{
				renderTo : "feature_grid",
				layout : "table",
				border : false,
				id : "featureForm",
				layoutConfig : {
					columns : 3
				},
				items : [{
						colspan:3,
						bodyStyle : 'border:none;line-height: 20px;margin-left:10px;margin-top:10px;',
						autoHeight : true,
						items : [{
							xtype : "label",
							html : "<a href='#' onclick=\"javascript:delSelected('" + fcode + "')\" style='color: #0000ff; font-family: 微软雅黑; font-size: 13px; font-style: normal; font-weight: normal; text-decoration: underline;'>删除所选</a>"
						}]
					},{
						id : "item-featureChk",
						colspan:3,
						bodyStyle : 'border:none;line-height: 40px;margin-left:10px;margin-top:10px;',
						autoHeight : true,
						items : featureChk
					},{
						colspan:3,
						bodyStyle : 'border:none;line-height: 40px;',
						autoHeight : true,
						items : [ {
							xtype : "label",
							html : "<hr/>"
					  }]
					},{
						bodyStyle : 'border:none;line-height: 40px;float:right;',
						autoHeight : true,
						items : [ {
							xtype : "label",
							html : "新增："
					  }]
					},{
						bodyStyle : 'border:none;line-height: 40px;float:left;',
						autoHeight : true,
						width:450,
						items : [ {
							xtype : "label",
							html : "<input id='input_" + fcode + "' style='width:400px;height:25px;' />"
					  }]
					},{
						bodyStyle : 'border:none;line-height: 40px;float:left;',
						autoHeight : true,
						items : [  {
							xtype : "button",
							text : "提交",
							width : 90,
							hidden : compareAuth("BASE_MATERIAL_EDIT"),
							onClick : function() {
								updateFeature(fname, fcode);
							}
						} ]
					},{
						bodyStyle : 'border:none;line-height: 40px;float:right;',
						autoHeight : true,
						items : [ {
							xtype : "label",
							html : ''
					  }]
					},{
						bodyStyle : 'border:none;line-height: 40px;float:left;',
						autoHeight : true,
						width:450,
						items : [ {
							xtype : "label",
							html : '多个请用\";\"隔开'
					  }]
					}
					]
			});
	
	featureWin = new Ext.Window({
		title : '编辑 ' + fname,
		closeAction : "close",
		width : 660,
		//height : 300,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ featurePanel ],
		listeners : {
			close : function() {
				if (refreshFlag){
					//window.location.reload();
					reload();
				}
			}
		}
	});
	featureWin.show();
}

// 初始化修改值
function initFormValue() {
	id = getCurArgs("id");
	if (id == null || id == "") {
		Ext.Msg.alert("请求的数据不存在");
		return;
	}
	// Ajax取得记录
	Ext.Ajax
			.request({
				url : '/servlet/RationLibServlet',
				params : {
					type : 11,
					id : id
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						createFormPanel(data);

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
											currFeature = data.result; 
											createFormPanel1();
											var feature_item = [];
											for ( var i = 0; i < data.result.length; i++) {
												var name = data.result[i].name;
												var unit = data.result[i].unit;
												var value = data.result[i].values;
												var isMain = data.result[i].isMain;
												var isAsk = data.result[i].isAsk;
												var code = data.result[i].code;
												var featureValues = value;
												if (featureValues == null){
													featureValues = "";
												}
												//var reg = new RegExp(";", "g"); // 创建正则RegExp对象
												var featureHTML = "";
												if (value != null
														&& value != "") {
													/*value = value.replace(reg,
															"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");*/
													var displayFeatureArr = featureValues.split(";");
													var count = 0;
											    	for(var m = 0,n = displayFeatureArr.length; m < n; m ++){
											    		var fVal = displayFeatureArr[m];
											    		count += 1;
											    		if (count % 18 == 0){
											    			featureHTML += fVal + "</br>";
											    		}else{
											    			featureHTML += fVal + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
											    		}
											    	}
												}
												
												var editHTML = "";
												if (!compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
													if (featureValues == null || "" == featureValues){
														editHTML = "<a onclick=\"javascript:createFeatureManageArea('" + name + "','" + code + "','')\" style='cursor:pointer;color: #0000ff; font-family: 微软雅黑; font-size: 14px; font-style: normal; font-weight: normal; text-decoration: underline;'>编辑</a>";
													}else{
														editHTML = "<a onclick=\"javascript:createFeatureManageArea('" + name + "','" + code + "','" + featureValues +"')\" style='cursor:pointer;color: #0000ff; font-family: 微软雅黑; font-size: 14px; font-style: normal; font-weight: normal; text-decoration: underline;'>编辑</a>";
													}
												}

												var tag = "";
												if (isMain == "1") {
													//tag = "*";/resource/images/add.gif
													tag = "<img src=\"/resource/images/guan.png\"/>&nbsp;";
												}
												if(isAsk == "1") {
													tag = tag + "&nbsp;<img src=\"/resource/images/xun.png\"/>&nbsp;";
												}
												if(tag.length == 0){
													tag = "&nbsp;&nbsp;&nbsp;&nbsp;";
												}
												name = tag + name + (unit != null && "" != unit ? "(" + unit + ")" : "" ) + ":";
												/*var GuestInput = new Ext.form.FieldSet(
														{
															columnWidth : 1,
															layout : 'column',
															border : false,
															bodyStyle : 'margin-right:10px;',
															layoutCongif : {
																columns : 2
															},
															items : [
																	{
																		autoHeight : true,
																		items : [ {
																			xtype : "label",
																			html : name
																		} ]
																	},
																	{
																		bodyStyle:'margin-left:10px;',
																		autoHeight : true,
																		items : [ {
																			html : "<div id='div_" + code + "'>" + featureHTML + editHTML + "</div>"
																		} ]
																	} ]

														});
												basic_area1.add(GuestInput);*/
												if (featureHTML == null){
													featureHTML = "";
												}
												feature_item.push({
														width:90,
														bodyStyle:'text-align:right;line-height: 40px;',
														html : name
													}, {
														bodyStyle:'margin-left:10px;text-align:left;',
														html : "<div id='div_e_" + code + "'>" + editHTML + "</div>"
													},{
														width:90,
														html : ''
													},{
														bodyStyle:'margin-left:10px;text-align:left;',
														html : "" == featureHTML ? "" : "<div id='div_" + code + "' style=\"border:1px solid black;padding:10px;background:#ffffff; font-color:black;\">" + featureHTML + "</div>"
													});
											}
											var featureSet = new Ext.form.FieldSet(
													{
														layout : "table",
														border:false,
														layoutConfig : {
															columns : 2
														},
														items : [feature_item]
													});
											
											basic_area1.add(featureSet);
											basic_area1.doLayout();
											initPanel();
										}
									},
									failure : function() {
										Warn_Tip();
									}
								});
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});

}

// 创建表单
function createFormPanel(data) {
	var editHTML = "";
	if (!compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		editHTML = "<a onclick=\"javascript:createMaterialManageArea('" + data.result["code"] + "','" + data.result["name"] +"')\" style='cursor:pointer;color: #0000ff; font-family: 微软雅黑; font-size: 14px; font-style: normal; font-weight: normal; text-decoration: underline;'>编辑</a>";
	}
	currSubcid = data.result["code"];
	
	var remindHTML = getUpdateRemind(data.result["code"],data.result["name"]);
	var bulk = data.result["bulk"];
	if (bulk == null || "" == bulk || "0" == bulk){
		bulk = "无";
	}
	var calcWeight = data.result["calcWeight"];
	if (calcWeight == null || "" == calcWeight || "0" == calcWeight){
		calcWeight = "无";
	}else{
		calcWeight = calcWeight + "%";
	}
	
	basic_area = new Ext.form.FieldSet(
			{
				columnWidth : .8,
				title : '基本信息',
				layout : "table",
				layoutConfig : {
					columns : 8
				},
				bodyStyle : 'text-align:right;background-color:#DFE8F6;margin-left:10px;padding:10px;min-width:700px;',
				items : [
						{
							width : 102,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "编码:"
							} ]
						},
						{
							autoHeight : true,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:5px;margin-left:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "编码",
								id : "code",
								name : "code",
								text : data.result["code"]
							} ]
						},
						{
							width : 102,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "分类名称:"
							} ]
						},
						{
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;margin-left:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "分类名称",
								id : "name",
								name : 'name',
								text : data.result["name"]
							} ]
						},
						{
							width : 102,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "单位:"
							} ]
						},
						{
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;margin-left:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "单位",
								id : "units",
								name : 'units',
								html : renderUnits(data.result["units"])
							} ]
						},
						{
							width : 300,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;margin_left:50px;",
							items : [ {
								xtype : "label",
								html : '图片:'
							} ]
						},
						
						{
							rowspan : 3,
							width:300,
							bodyStyle:'margin-left:10px;text-align:left;',
							html : '<div><img id="picPath" src="http://ftp.zjtcn.com'+data.result["image"]+'" width="200px" height="150px" /></div>'
						},
						{
							width : 102,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "起批量:"
							} ]
						},
						{
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;margin-left:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "起批量",
								id : "bulk",
								name : 'bulk',
								html : bulk +"&nbsp;&nbsp;&nbsp;<a onclick=\"javascript:createBulkManageArea('" + data.result["code"] + "','" + data.result["name"] + "','" + data.result["bulk"] +"')\" style='cursor:pointer;color: #0000ff; font-family: 微软雅黑; font-size: 14px; font-style: normal; font-weight: normal; text-decoration: underline;'>编辑</a>"
							} ]
						},
						{
							width : 102,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "测算权重:"
							} ]
						},
						{
							colspan : 5,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;margin-left:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "测算权重",
								id : "calcWeight",
								name : 'calcWeight',
								html : calcWeight + "&nbsp;&nbsp;&nbsp;<a onclick=\"javascript:createCalcWeightManageArea('" + data.result["code"] + "','" + data.result["name"] + "','" + data.result["calcWeight"] +"')\" style='cursor:pointer;color: #0000ff; font-family: 微软雅黑; font-size: 14px; font-style: normal; font-weight: normal; text-decoration: underline;'>编辑</a>"
							} ]
						},
						{
							width : 102,
							bodyStyle : "min-height:30px;_height:30px;text-align:right;margin-top:5px;",
							items : [ {
								xtype : "label",
								text : "报价更新周期:"
							} ]
						},
						{
							colspan:7,
							bodyStyle : "min-height:30px;_height:30px;text-align:left;margin-top:3px;margin-top:5px;margin-left:10px;",
							items : [ {
								xtype : "label",
								fieldLabel : "报价更新周期",
								id : "updateRemind",
								html : remindHTML
							} ]
						}]
			});

}

/**
 * 测算权重
 * @param subcid
 * @returns
 */
function getUpdateRemind(subcid,mname){
	var returnVal = "";
	curr_times = "";
	curr_isApp = "0";
	var isApp = "0";
	$.ajax({
		type : "post",
		url : '/servlet/RationLibServlet?type=21&code=' + subcid,
		async : false, //默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
					   //注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行
		complete : function(json) {
			var data = eval("(" + json.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				var result = data.result;
				if (result != null && "" != result){
					for (var i = 0, j = result.length; i < j; i ++){
						var curr_time = result[i].time;
						isApp = result[i].isApp;
						if (curr_time != null && "" != curr_time){
							var curr_time_arr = curr_time.split(" ")[0];
							returnVal += parseInt(curr_time_arr.split("-")[1],10) + "月;";
							curr_times += parseInt(curr_time_arr.split("-")[1],10) + ";";
						}
					}
					//true表示报价更新提醒周期为更新，false新增
					remindUpdateFlag = true;
					curr_isApp = isApp;
				}
				updateRemindList = result;
			}
		}
	});
	if (updateRemindList == null || "" == updateRemindList){
		returnVal = "无";
		updateRemindList = null;
	}
	return returnVal + "&nbsp;&nbsp;&nbsp;<a style='cursor:pointer;color: #0000ff; font-family: 微软雅黑; font-size: 14px; font-style: normal; font-weight: normal; text-decoration: underline;' href=\"javascript:setUpdateRemindPanel('" + subcid + "','" + mname + "','" + isApp + "')\">编辑</a>";
}

/**
 * 提醒更新周期设置
 * @param calcWeight
 */
function setUpdateRemindPanel(mcode,mname,isApp){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	
	var monthItems = [];
	for (var i = 1, j = 12; i <= j; i ++){
		var chkItem = {};
		chkItem["boxLabel"] = i;
		chkItem["inputValue"] = i;
		chkItem["name"] = i;
		chkItem["id"] = "chk_" + i;
		monthItems.push(chkItem);
	}
	
	monthChk = new Ext.form.CheckboxGroup({
        xtype: 'checkboxgroup',
        //fieldLabel: '请勾选省份',
        name: 'monthChk',
        allowBlank: false,
        id: 'monthChk',
        width: 600,
        columns: 12,
        items: monthItems
    });
	
	updateReminPanel = new Ext.Panel(
			{
				id : "updateReminPanel",
				layout : "table",
				border : false,
				layoutConfig : {
					columns : 3
				},
				items : [{
					colspan:3,
					bodyStyle : 'border:none;line-height: 20px;margin-left:10px;margin-top:10px;',
					autoHeight : true,
					items : [{
						xtype : "label",
						html : "二级分类 ："+ mcode + " " + mname
					}]
				},{
					colspan:3,
					bodyStyle : 'border:none;line-height: 20px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<hr/>"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 20px;margin-left:10px;',
					autoHeight : true,
					items : [{
						xtype : "label",
						text : "测算月份："
					}]
				},{
					bodyStyle : 'border:none;line-height: 40px;font-size:12px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<input type='checkbox' id='monthCheckAll' onclick='monthCheckAll()'>&nbsp;全选"
					}]
				}, {
					bodyStyle : 'border:none;line-height: 20px;margin-left:10px; margin-top:10px;',
					autoHeight : true,
					items : monthChk
				},{
					colspan:3,
					bodyStyle : 'border:none;line-height: 20px; margin-left:10px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<input type='checkbox' id='isApp' name='isApp'> 应用到所属一级分类下的其他二级分类"
				  }]
				},{
					bodyStyle : 'border:none;line-height: 20px;margin-left:10px;',
					autoHeight : true,
					items : [{
						xtype : "label",
						text : ""
					}]
				}, {
					colspan:2,
					bodyStyle : 'border:none;line-height: 20px;margin-right:20px;margin-top:10px;margin-bottom:10px;',
					autoHeight : true,
					items : [  {
						xtype : "button",
						text : "保存设置",
						width : 90,
						hidden : compareAuth("BASE_MATERIAL_EDIT"),
						onClick : function() {
							saveUpdateRemind(mcode);
						}
					} ]
				}
				]
			});
	
	updateRemindWin = new Ext.Window({
		title : '设置 报价更新提醒周期',
		closeAction : "close",
		width : 750,
		autoHeight:true,
		plain : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ updateReminPanel ],
		listeners : {
			close : function() {
				updateRemindWin.close();
			}
		}
	});
	updateRemindWin.show();
	//设置选中项
	if (updateRemindList != null && "" != updateRemindList){
		var checkGroup = Ext.getCmp('monthChk');
		for (var i = 0, j = updateRemindList.length; i < j; i ++){
			var curr_time = updateRemindList[i].time;
			if (curr_time != null && "" != curr_time){
				var curr_time_arr = curr_time.split(" ")[0];
				checkGroup.setValue(parseInt(curr_time_arr.split("-")[1],10), true);
			}
		}
	}
	//应用到所属一级分类下的其他二级分类（1是）
	if ("1" == isApp){
		$("#isApp").attr("checked", true);
	}
}
		
/**
 * 月份全选
 */
function monthCheckAll(){
	var checked = $("#monthCheckAll").attr("checked");
	var selectItems = Ext.getCmp('updateReminPanel').findById('monthChk').items;
	var checkGroup = Ext.getCmp('monthChk');
    for(var i = 0, j = selectItems.length; i < j; i ++){
    	checkGroup.setValue(selectItems.itemAt(i).name,checked);
    }
}

/**
 * 保存更新提醒周期设置
 */
function saveUpdateRemind(subcid){
	var times = "";
	var selectItems = Ext.getCmp('updateReminPanel').findById('monthChk').items;
    for(var i = 0, j = selectItems.length; i < j; i ++){
    	if (selectItems.itemAt(i).checked){
    		times += selectItems.itemAt(i).name + ";";
    	}
    }
    var isApp = "0";
    if ($("#isApp").attr("checked"))
    	isApp = "1";
    
    var type = "17";//新增
    if (remindUpdateFlag || "1" == isApp){
    	type = "18";//更新
    }
    
    if (times == curr_times && isApp == curr_isApp){
    	Ext.MessageBox.alert("提示", "没有更新，无需保存！");
    	return false;
    }
    
    var data = {};
	data["type"] = type;
	data["subcid"] = subcid;
	data["isApp"] = isApp;
	data["times"] = times;
    loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在更新报价更新提醒周期中...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url:'/servlet/RationLibServlet',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				loadMarsk.hide();
				loadStore = null;
				Ext.MessageBox.alert("提示", "报价提醒周期更新成功！",reload);
			}else{
				loadMarsk.hide();
			}
		},
		failure : function(response) {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}

function reload(){
	if (window.parent.tab_0404_iframe){
		window.parent.tab_0404_iframe.ds.reload();
	}
	window.location.reload();
	//window.parent.Ext.getCmp('center').remove("orders_detail");
}

//显示单位
function renderUnits(units){
	var reg = new RegExp(";", "g"); // 创建正则RegExp对象
	if (units != null && units != "") {
		units = units.replace(reg,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
	}
	return units;
}

function createFormPanel1() {
	basic_area1 = new Ext.form.FieldSet({
		columnWidth : .8,
		title : '特征项',
		layout : "table",
		layoutConfig : {
			columns : 1
		},
		bodyStyle : 'background-color:#DFE8F6;margin-left:10px;padding:10px;',
		items : []
	});
}
function initPanel() {
	var panel = new Ext.Panel({
		border : false,
		frame : true,
		layout : "column",
		//width : '1000',
		bodyStyle : "margin-left:10px;min-height:500px;",
		layoutConfig : {
			columns : 1
		},
		renderTo : 'detail',
		items : [ basic_area, basic_area1 ]
	});
}

function delSelected(fcode){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	var featureForm = Ext.getCmp('featureForm');
	var updateFeatures = "";
	var selectLength = 0;
	var updateArr = new Array();
	var featureChk = featureForm.findById('featureChk');
	if (featureChk != null){
		var selectItems = featureChk.items;
	    for(var i = 0, j = selectItems.length; i < j; i ++){
	    	if (!selectItems.itemAt(i).checked){
	    		updateFeatures += selectItems.itemAt(i).name + ";";
	    		updateArr.push(selectItems.itemAt(i).name);
	    		continue;
	    	}
	    	selectLength += 1;
	    }
	}
    if (selectLength == 0){
    	Ext.MessageBox.alert("提示", "请选择您要删除的特征项！");
    	return false;
    }
    updateArr.sort(function(x,y){return x > y ? 1 : -1});//从小到大排序
    var upFeature = "";
    for (var i = 0, j = updateArr.length; i < j; i ++){
    	var f = updateArr[i];
    	upFeature += f + ";";
    }
	Ext.MessageBox
	.show({
		title : '提示',
		msg : "确认要删除所选特征项？",
		prompt : false,
		buttons : {
			"ok" : "确定",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text){
			if ("ok" == btn){
			    var data = {};
			    data["type"] = "16";
			    data["fcode"] = fcode;
				data["features"] = upFeature;
				data["featureFlag"] = "1"; //修改特征项标识
				Ext.Ajax.request({
					url:'/servlet/RationLibServlet',
					method:'POST',
					params:data,
					success:function(o){
						var data = eval("(" + o.responseText + ")");
						if (getState(data.state, commonResultFunc,
								data.result)) {
							Ext.MessageBox.alert("提示", "删除成功！");
							var items = featureChk.items;
							var length = items.length;
							for ( var i = 0; i < length; i++) {
								var delItems = items.items[0];
								delItems.destroy();
								items.remove(delItems);
							}
							featureChk.panel.doLayout();
							updateFeatures = updateFeatures.substring(0,updateFeatures.lastIndexOf(";"));
							var fItems = [];
							if ("" != updateFeatures){
								var featureArr = updateFeatures.split(";");
								for (var i = 0, j = featureArr.length; i < j; i ++){
									var feature = featureArr[i];
									var chkItem = {};
									chkItem["boxLabel"] = feature;
									chkItem["inputValue"] = feature;
									chkItem["name"] = feature;
									fItems.push(chkItem);
								}
								var fck = new Ext.form.CheckboxGroup({
								    xtype: 'checkboxgroup',
								    //fieldLabel: '请勾选省份',
								    name: 'featureChk',
								    allowBlank: false,
								    id: 'featureChk',
								    width: 600,
								    columns: 4,
								    items: fItems
								});
								Ext.getCmp("item-featureChk").add(fck);
							}else{
								featureForm.items.remove("item-featureChk");
							}
							featureForm.doLayout();
							refreshFlag = true;
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				});
			}
		}}
	);
}

/**
 * 修改特征项的值
 * @param fname
 * @param fcode
 * @returns {Boolean}
 */
function updateFeature(fname,fcode){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	var inputFeatures = $('#input_' + fcode).val() == null ? "" : $('#input_' + fcode).val();
	if (inputFeatures == ""){
		Ext.MessageBox.alert("提示", "请输入您要添加的特征项！");
		return false;
	}
	var selectObj = Ext.getCmp('featureForm').findById('featureChk');
	var map = new Map();
	var features = "";
	var updateArr = new Array();
	if (selectObj != null){ 
		var selectItems = selectObj.items;
	    for(var i = 0, j = selectItems.length; i < j; i ++){
			map.put(selectItems.itemAt(i).name, selectItems.itemAt(i).name);
			features += selectItems.itemAt(i).name + ";";
			updateArr.push(selectItems.itemAt(i).name);
	    }
	}
	var addFeatures = "";
	var existFeature = "";
	var featureArr = inputFeatures.split(";");
	for (var i = 0,j = featureArr.length; i < j; i ++){
		var feature = featureArr[i];
		if (feature != null && "" != feature){
			if (map.containsKey(feature)){
				existFeature += feature + ";";
				continue;
			}
			addFeatures += feature + ";";
			updateArr.push(feature);
			map.put(feature, feature);
		}
	}
	
	if ("" != existFeature){
		Ext.MessageBox.alert("提示", existFeature + " 存在重复！");
		return false;
	}
	
    addFeatures = features + addFeatures;
    
    updateArr.sort(function(x,y){return x > y ? 1 : -1});//从小到大排序
    
    var upFeature = "";
    for (var i = 0, j = updateArr.length; i < j; i ++){
    	var f = updateArr[i];
    	upFeature += f + ";";
    }
    var data = {};
    data["type"] = "16";
    data["fcode"] = fcode;
	data["features"] = upFeature;
	data["featureFlag"] = "1"; //修改特征项标识
	Ext.Ajax.request({
		url:'/servlet/RationLibServlet',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				Ext.MessageBox.alert("提示", "修改成功！",function(){
					/*var displayFeature = "";
			    	var displayFeatureArr = addFeatures.split(";");
			    	for(var i = 0,j = displayFeatureArr.length; i < j; i ++){
			    		var fVal = displayFeatureArr[i];
			    		displayFeature += fVal + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			    	}
				 	var editHTML = "<a href='#' onclick=createFeatureManageArea('" + name + "','" + fcode + "','" + features +"') style='color: #0000ff; font-family: 微软雅黑; font-size: 16px; font-style: normal; font-weight: normal; text-decoration: underline;'>编辑</a>";
				    $("#div_" + fcode).html(displayFeature + editHTML);*/
					//window.location.reload();
				    featureWin.close();
				    reload();
				});
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}

/**
 * 修改起批量的值
 * @param fname
 * @param fcode
 * @returns {Boolean}
 */
function updateBulk(mcode, mname){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	var inputBulk = $('#bulk_mcode').val() == null ? "" : $('#bulk_mcode').val();
	if (inputBulk == "" || inputBulk == 0){
		inputBulk = 0;
	} else {
		if(!is_int(inputBulk) || !(inputBulk >= 0)){
			Ext.MessageBox.alert("提示", "请输入正整数！");//
			return false;
		}
	}
	
    var data = {};
    data["type"] = "19";
    data["bulk"] = inputBulk;
    data["code"] = mcode;
	
	Ext.Ajax.request({
		url:'/servlet/RationLibServlet',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				Ext.MessageBox.alert("提示", "起批量保存成功！",function(){
					//window.location.reload();
				    bulkWin.close();
				    reload();
				});
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}
/**
 * 修改测算权重的值
 * @param fname
 * @param fcode
 * @returns {Boolean}
 */
function updateCalcWeight(mcode, mname){
	if (compareAuth("MATERIALBASE_LIB_SET_FEATURES")){
		Ext.MessageBox.alert("提示", "对不起，您没有权限！");
		return false;
	}
	var calcWeight = $('#calcWeight_mcode').val() == null ? "" : $('#calcWeight_mcode').val();
	if (calcWeight == "" || calcWeight==0){
		calcWeight = 0;
	}else{
		if(!is_int(calcWeight) || !(calcWeight<100 && calcWeight>50)){
			Ext.MessageBox.alert("提示", "请输入大于50小于100的整数！");
			return false;
		}
	}
	
	var data = {};
	data["type"] = "20";
	data["calcWeight"] = calcWeight;
	data["code"] = mcode;
	
	Ext.Ajax.request({
		url:'/servlet/RationLibServlet',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				Ext.MessageBox.alert("提示", "测算权重保存成功！",function(){
					//window.location.reload();
					calcWeightWin.close();
					reload();
				});
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}