var baseMaterial;
var selectinfo = getCurArgs("id");
var items;
var provinceWin,featureWin,provincePanel,featurePanel,provinceChk,provinceItems,featureItems;
var areasNames = "";
var oldAreas = "";
var unitItems,comboUnit;
var currFeature = "";
var zhcn = new Zhcn_Select();
var changeFlag = false;
var loadMarsk,loadStore;

var cidArr = getCidNameArray();
var subcidArr = [];

var comboCid = new Ext.form.ComboBox({
	id : 'comboCid',
	store : cidArr,
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
	listeners : {
		select : function(combo, record, index) {
			comboSubcid.reset();
			var cid = combo.getValue();
			subcidArr = getSubcidArrayByCid(cid);
			comboSubcid.store.loadData(subcidArr);
			comboSubcid.setValue(null);
			comboSubcid.enable();
			
		}
	}

});
var comboSubcid = new Ext.form.ComboBox({
	id : 'comboSubcid',
	store : subcidArr,
	valueField : "value",
	displayField : "text",
	mode : 'local',
	forceSelection : true,
	emptyText : '请选择',
	//hiddenName : 'region',
	editable : false,
	triggerAction : 'all',
	allowBlank : true,
	readOnly : true,
	name : 'region',
	width : 160
});

var bodyStyle = "border:none;line-height: 20px; padding-top:10px; padding-left:50px;font-size:12px;";
var bodyStyle2 = "border:none;line-height: 20px; margin-top:10px; margin-left:50px; float:right;font-size:12px;";
var bodyStyle3 = "border:none;line-height: 20px;margin-top:10px;font-size:12px;";
var featureStyle = "border:none;margin-left:20px;font-size:12px;";
//var fontStyle = "font-family:微软雅黑;font-size:16px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;";
var fontStyle = "font-size:12px;";

function spanHTML(val,isRed){
	if ("1" == isRed){
		//return "<span style='font-family:微软雅黑;font-size:16px;font-weight:normal;font-style:normal;text-decoration:none;color:#FF0000;'>" + val + "</span>";
		return "<span style='font-size:12px;text-decoration:none;color:#FF0000;'>" + val + "</span>";
	}
	//return "<span style='font-family:微软雅黑;font-size:16px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>" + val + "</span>";
	return "<span style='font-size:12px;text-decoration:none;color:#333333;'>" + val + "</span>";
}

/**
 * 获取单位
 * @param baseMaterial
 */
function getMaterialUnit(baseMaterial){
	if (baseMaterial["subcid"] != null && "" != baseMaterial["subcid"]){
		var currUnit = baseMaterial["unit"];
		var data = {};
		data["type"] = "24";
		data["way"] = "way:rationLib";
		data["subcid"] = baseMaterial["subcid"];
		$.ajax({
			type : 'POST',
			url : '/material/MaterialServlet.do',
			async : false,
			data : data,
			complete : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (data.result != null) {
					var result = data.result;
					var units = result["units"];
					if (units != null && "" != units){
						unitItems = [];
						var unitArr = units.split(";");
						var unitExist = false;
						for (var i = 0, j = unitArr.length; i < j; i ++){
							var unitVal = unitArr[i];
							if (unitVal == currUnit){
								unitExist = true;
							}
							unitItems.push([unitVal, unitVal]);
						}
						if (!unitExist){//不存在单位，则添加到下拉框中
							unitItems.push([currUnit,currUnit]);
						}
					}
				}
			}
		});
		
		comboUnit  = new Ext.form.ComboBox({
			id : 'unit',
			store : unitItems,
			width : 160,
			valueField : "value",
			displayField : "text",
			mode : 'local',
			forceSelection : true,
			//emptyText : '请选择',
			editable : false,
			triggerAction : 'all',
			allowBlank : true,
			readOnly : true,
			fieldLabel : '单位',
			style : fontStyle
		});
		
		Ext.getCmp("unit").setValue(returnNull(baseMaterial["unit"]));
	}else{
		comboUnit  = new Ext.form.ComboBox({
			id : 'unit',
			store : [],
			width : 160,
			valueField : "value",
			displayField : "text",
			mode : 'local',
			forceSelection : true,
			//emptyText : '请选择',
			editable : false,
			triggerAction : 'all',
			allowBlank : true,
			readOnly : true,
			fieldLabel : '单位',
			style : fontStyle
		});
		
		Ext.getCmp("unit").setValue(returnNull(baseMaterial["unit"]));
	}
}

/**
 * 获取特征项
 * @param code
 */
function createFeature(baseMaterial){
	var data = {};
	data["type"] = "24";
	data["way"] = "feature";
	data["subcid"] = baseMaterial["subcid"];
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				var result = data.result;
				if (result.length > 0){
					currFeature = result;
					items.push(
					{
						autoHeight : true,
						bodyStyle : "border:none;line-height: 20px; margin-top:30px; margin-left:50px; float:right;font-size:12px;",
						items : [ {
							xtype : "label",
							html :spanHTML('特征项')
						} ]
					},{
						colspan : 2,
						autoHeight : true,
						bodyStyle : bodyStyle3,
						items : [ {
							xtype : "label",
							html : ""
						} ]
					},{
						colspan:3,
						autoHeight : true,
						bodyStyle : "border:none;line-height: 20px; margin-left:85px;font-size:12px;",
						items : [ {
							xtype : "label",
							html : "<hr/>"
						} ]
					});
				}
				for (var i = 0, j = result.length; i < j; i ++){
					var bm = result[i];
					var featureName = {};
					featureName["autoHeight"] = true;
					featureName["bodyStyle"] = bodyStyle2;
					var featureNameItems = {};
					featureNameItems["xtype"] = "label";
					featureNameItems["html"] = spanHTML('*' + returnNull(bm["name"]) + "：");
					featureName["items"] = featureNameItems;
					
					var featureVal = {};
					featureVal["autoHeight"] = true;
					featureVal["bodyStyle"] = bodyStyle3;
					featureVal["colspan"] = 2;
					var featureValItems = {};
					featureValItems["xtype"] = "label";
					var fid = "f" + bm["code"].substring(baseMaterial["subcid"].length,bm["code"].length);
					var span_html = "<span style='font-size:12px;text-decoration:none;color:#333333;' id='span_" + fid + "'>" + (returnNull(baseMaterial[fid]) == "" ? "无" : baseMaterial[fid]) + "</span>";
					var aHTML = "&nbsp;<a href='#' onclick=\"javascript:createFeatureSelectArea('" + returnNull(bm["name"]) + "','" + fid + "','" + returnNull(bm["values"]) + "')\" style='color: #0000ff; font-size:12px; text-decoration: underline;'>重选</a>";
					if ("" == returnNull(bm["values"])){
						aHTML = "&nbsp;<a href='#' onclick=\"javascript:createFeatureSelectArea('" + returnNull(bm["name"]) + "','" + fid + "','')\" style='color: #0000ff; font-size:12px; text-decoration: underline;'>重选</a>";
					}
					featureValItems["html"] = "<div id='div_" + fid + "'>" + span_html + aHTML + "</div>";
					featureVal["items"] = featureValItems;
					
					items.push(featureName);
					items.push(featureVal);
				}
			}
		}
	});
}

function proCheckAll(){
	var checked = $("#proCheckAll").attr("checked");
	var selectItems = Ext.getCmp('proForm').findById('provinceChk').items;
	var checkGroup = Ext.getCmp('provinceChk');
    for(var i = 0, j = selectItems.length; i < j; i ++){
    	checkGroup.setValue(selectItems.itemAt(i).name,checked);
    }
}

/**
 * 检验省份是否已选
 * @param areas
 * @param province
 * @returns {Boolean}
 */
function checkProExist(areas,province){
	var areaArr = areas.split(";");
	for (var i = 0, j = areaArr.length; i < j; i ++){
		var area = areaArr[i];
		if (province == area){
			return true;
		}
	}
	return false;
}

/**
 * 设置省
 */
function createProvinceSelectArea(areas){
	var provinces = zhcn.getProvince('');
	if (provinces == null || "" == provinces){
		Ext.MessageBox.alert("提示", "目前暂无省份可选择！");
		return false;
	}
	var checkFlag = false;
	if (areas != null && "" != areas) checkFlag = true;
	provinceItems = [];
	var proArr = provinces.split(",");
	var proArrLength = proArr.length;
	for (var i = 0, j = proArrLength; i < j; i ++){
		var pro = proArr[i];
		var isExits = false;
		if (checkFlag) isExits = checkProExist(areas, pro);
		var chkItem = {};
		chkItem["boxLabel"] = pro;
		chkItem["inputValue"] = pro;
		chkItem["name"] = pro;
		chkItem["checked"] = isExits;
		provinceItems.push(chkItem);
	}
	
	provinceChk = new Ext.form.CheckboxGroup({
        xtype: 'checkboxgroup',
        //fieldLabel: '请勾选省份',
        name: 'provinceChk',
        allowBlank: false,
        id: 'provinceChk',
        width: 600,
        columns: 6,
        items: provinceItems
    });
	
	provincePanel = new Ext.Panel(
			{
				layout : "form",
				border : false,
				id : "proForm",
				bodyStyle : 'border:none;padding-left:10px;font-size:12px;',
				layoutConfig : {
					columns : 1
				},
				items : [{
					bodyStyle : 'border:none;line-height: 40px;font-size:12px;',
					autoHeight : true,
					items : [ {
						xtype : "label",
						html : "<input type='checkbox' id='proCheckAll' onclick='proCheckAll()'>&nbsp;全选"
					}, provinceChk]
				}]
			});
	
	provinceWin = new Ext.Window({
		title : '勾选/取消 省：',
		closeAction : "close",
		width : 660,
		height : 300,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ provincePanel ],
		buttons : [ {
			text : '确认',
			handler : function() {
				areasNames = "";
				//获取
			    var selectItems = Ext.getCmp('proForm').findById('provinceChk').items;
			    for(var i = 0, j = selectItems.length; i < j; i ++){
			        if(selectItems.itemAt(i).checked){
			        	areasNames += selectItems.itemAt(i).name + ";";
			        }
			    }
			    if (areasNames != null && "" != areasNames){
			    	areasNames = areasNames.substring(0,areasNames.lastIndexOf(";"));
			    }
			    var span_html = "<span style='font-size:12px;text-decoration:none;color:#333333;' id='span_areas'>" + (returnNull(areasNames) == "" ? "暂无" : areasNames) + "</span>";
			    var updateAreaHTML = span_html + "&nbsp;<a href='###' style='color: #0000ff; font-size:12px; text-decoration: underline;' onclick=\"javascript:createProvinceSelectArea('" + areasNames + "')\" >设置省</a>";
			    $('#areaDiv').html(updateAreaHTML);
			    provinceWin.close();
			}
		} ]
	});
	
	provinceWin.show();
	
	if (areas.split(";").length == proArrLength) $("#proCheckAll").attr("checked",true);
}

/**
 * 确认选中的特征项的值
 * @param fName
 * @param fcode
 * @param fVal
 * @param values
 */
function selectFeature(fName, fcode, fVal, values){
	var aHTML = "&nbsp;<a href='#' onclick=\"javascript:createFeatureSelectArea('" + fName + "','" + fcode + "','" + values + "')\" style='color: #0000ff; font-size:12px; text-decoration: underline;'>重选</a>";
	if ("" == values || values == null){
		aHTML = "&nbsp;<a href='#' onclick=\"javascript:createFeatureSelectArea('" + fName + "','" + fcode + "','')\" style='color: #0000ff; font-size:12px; text-decoration: underline;'>重选</a>";
	}
	
	var span_html = "<span style='font-size:12px;text-decoration:none;color:#333333;' id='span_" + fcode + "'>" + fVal + "</span>";
	$('#div_' + fcode).html(span_html + aHTML);
	changeFlag = true;
	featureWin.close();
}

/**
 * 选择特征项的值
 * @param fcode
 * @param feature
 */
function createFeatureSelectArea(fName,fcode,featureVal){
	if (featureVal == null || "" == featureVal){
		Ext.MessageBox.alert("提示", "目前暂无特征项可选择！");
		return false;
	}
	featureItems = [];
	featureItems.push({
		bodyStyle : featureStyle,
		autoHeight : true,
		items : [ {
			xtype : "label",
			html : "<a href='###' onclick=\"javascript:selectFeature('" + fName + "','" + fcode + "','无','" + featureVal + "')\" style='color: #0000ff; font-size:12px; text-decoration: none;'>无</a>"
		} ]
	});
	var featureValArr = featureVal.split(";");
	for (var i = 0, j = featureValArr.length; i < j; i ++){
		var feature = featureValArr[i];
		featureItems.push({
			bodyStyle : featureStyle,
			autoHeight : true,
			items : [ {
				xtype : "label",
				html : "<a href='###' onclick=\"javascript:selectFeature('" + fName + "','" + fcode + "','" + feature + "','" + featureVal + "')\" style='color: #0000ff; font-size:12px; text-decoration: none;'>" 
						+ feature + "</a>"
			} ]
		});
	}
	
	featurePanel = new Ext.Panel(
			{
				renderTo : "feature_grid",
				layout : "table",
				border : false,
				id : "featureForm",
				bodyStyle : "padding-right:20px;",
				layoutConfig : {
					columns : 10
				},
				items : featureItems
			});
	
	featureWin = new Ext.Window({
		title : '选择 ' + fName,
		closeAction : "close",
		width : 660,
		height : 300,
		x : "450",
		y : "150",
		autoWidth : true,
		autoHeight : true,
		autoScroll : true,
		bodyStyle : 'padding:6px;',
		draggable : true,
		modal : true,
		buttonAlign : 'center',
		items : [ featurePanel ]
	});
	featureWin.show();
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

function buildArea() {
	Ext.Ajax
			.request({
				url : '/material/MaterialServlet.do',
				params : {
					pageSize : 20,
					type : 21,
					id : selectinfo,
					page : 1,
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						baseMaterial = jsondata.result;
						oldAreas = returnNull(baseMaterial["areas"]);
						
						getMaterialUnit(baseMaterial);
						
						arrayCompareTo(baseMaterial,null);
						
						var span_html = "<span style='font-size:12px;text-decoration:none;color:#333333;' id='span_areas'>" + (oldAreas == "" ? "暂无" : oldAreas) + "</span>";
						 
						items = [
									{
										colspan : 3,
										autoHeight : true,
										bodyStyle : bodyStyle,
										items : [ {
											xtype : "label",
											html : spanHTML('注意：*','1') + spanHTML('表示必填；* 表示主要特征项，非必填')
										} ]
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											html : spanHTML('编码：')
										} ]
									},
									{
										colspan : 2,
										autoHeight : true,
										bodyStyle : bodyStyle3,
										items : [ {
											xtype : "label",
											html : spanHTML(returnNull(baseMaterial["bianma"]))
										} ]
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											style : fontStyle,
											html :  spanHTML('国码(2013)：')
										} ]
									},{
										colspan : 2,
										autoHeight : true,
										bodyStyle : bodyStyle3,
										items : [ {
											xtype : "label",
											html : spanHTML(returnNull(baseMaterial["code2013"]))
										} ]
									}
									/*{
										autoHeight : true,
										bodyStyle : bodyStyle3,
										items : [{
											xtype : "textfield",
											fieldLabel : "code2013",
											maxLength : 8,
											//regex : formMsg.qqMsnPatrn,
											//regexText : formMsg.qqMsnMsg,
											id : "code2013",
											value : returnNull(baseMaterial["code2013"]),
											width : 100
										}]
									}*/,
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											html : spanHTML('二级分类：')
										} ]
									},
									{
										autoHeight : true,
										bodyStyle : "border:none;line-height: 20px; margin-top:10px; font-size:12px;",
										width : 320,
										//items : [comboCid]
										items : [
											new Ext.Panel(
													{
														layout : "table",
														border : false,
														id : "panel2",
														layoutConfig : {
															columns : 2
														},
														items : [comboCid,comboSubcid]
													})
										]
										/*items : [ {
											xtype : "label",
											html : returnNull(baseMaterial["subcid"]) == "" ? "" : spanHTML(returnNull(getSubCidNameBySubcid(baseMaterial["subcid"],
													true)))
										} ]*/
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle3,
										//items : [comboSubcid]
										items : []
										/*items : [ {
											xtype : "label",
											html : returnNull(baseMaterial["subcid"]) == "" ? "" : spanHTML(returnNull(getSubCidNameBySubcid(baseMaterial["subcid"],
													true)))
										} ]*/
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											html : spanHTML('*','1') + spanHTML('名称：')
										} ]
									},
									{
										colspan : 2,
										autoHeight : true,
										bodyStyle : bodyStyle3,
										items : [{
											xtype : "textfield",
											fieldLabel : "name",
											maxLength : 64,
											style : fontStyle,
											//regex : formMsg.qqMsnPatrn,
											//regexText : formMsg.qqMsnMsg,
											id : "name",
											value : returnNull(baseMaterial["name"]),
											width : returnNull(baseMaterial["name"]).length * 20 + 200
										}]
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											html : spanHTML('规格：')
										} ]
									},
									{
										colspan : 2,
										autoHeight : true,
										bodyStyle : bodyStyle3,
										items : [{
											enableKeyEvents : true,
											xtype : "textfield",
											fieldLabel : "spec",
											maxLength : 200,
											style : fontStyle,
											//regex : formMsg.qqMsnPatrn,
											//regexText : formMsg.qqMsnMsg,
											id : "spec",
											value : returnNull(baseMaterial["spec"]),
											width : returnNull(baseMaterial["spec"]).length * 20 + 200
										}]
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											html : spanHTML('*','1') + spanHTML('单位：')
										} ]
									},
									{
										colspan : 2,
										autoHeight : true,
										bodyStyle : bodyStyle3,
										items : comboUnit
									},
									{
										autoHeight : true,
										bodyStyle : bodyStyle2,
										items : [ {
											xtype : "label",
											html : spanHTML('区域	：')
										} ]
									},
									{
										colspan : 2,
										autoHeight : true,
										bodyStyle : bodyStyle3,
										width : 600,
										items : [ {
											id : "areas",
											xtype : "label",
											html:"<div id='areaDiv'>" + span_html 
												+ "&nbsp;<a href='###' style='color: #0000ff; font-size:12px; text-decoration: underline;' onclick=\"javascript:createProvinceSelectArea('" + baseMaterial["areas"] + "')\" >设置省</a></div>"
										} ]
									}];
						if (baseMaterial["subcid"] != null && "" != baseMaterial["subcid"]){
							//动态创建特征项
							createFeature(baseMaterial);
							
							comboSubcid.reset();
							Ext.getCmp("comboCid").setValue(baseMaterial["subcid"].substring(0,2));
							subcidArr = getSubcidArrayByCid(baseMaterial["subcid"].substring(0,2));
							comboSubcid.store.loadData(subcidArr);
			                //Ext.getCmp('comboSubcid').store.loadData(subcidArr);
			                Ext.getCmp("comboSubcid").setValue(baseMaterial["subcid"] + getSubCidNameBySubcid(baseMaterial["subcid"],false));
						}
						
						items.push({
							colspan:2,
							autoHeight : true,
							width : 300,
							bodyStyle : 'border:none;line-height: 80px; margin-left:150px; margin-top:20px; float:center;font-size:12px; width : 300px;',
							items : [ {
								xtype : "button",
								text : "提交",
								width : 90,
								hidden : compareAuth("BASE_MATERIAL_EDIT"),
								onClick : function() {
									updateBaseMaterial(baseMaterial);
								}
							} ]
						} );
						
						var panel = new Ext.Panel(
								{
									renderTo : Ext.getBody(),
									title : "查看/修改材料",
									layout : "table",
									border : false,
									id : "panel",
									//defaults : {width : 160},
									layoutConfig : {
										columns : 3
									},
									items : items
								});
					}
				}
			});
}

/**
 * 提交修改
 * @returns {Boolean}
 */
function updateBaseMaterial(baseMaterial){
	/*var code2013 = Ext.getCmp("code2013").getValue();
	if (code2013 == null || "" == code2013){
		Ext.MessageBox.alert("提示", "国码(2013)不能为空！");
		return false;
	}else if (code2013.length != 8){
		Ext.MessageBox.alert("提示", "国码(2013)只能是8位数！");
		return false;
	}*/
	var subcid = Ext.getCmp("comboSubcid").getValue();
	if (subcid == null || "" == subcid){
		Ext.MessageBox.alert("提示", "请选择二级分类！");
		return false;
	}
	subcid = subcid.toString();
	//subcid = subcid.substring(0,subcid.indexOf(","));
	subcid = subcid.substring(0,4);
	var name = Ext.getCmp("name").getValue();
	if (name == null || "" == name){
		Ext.MessageBox.alert("提示", "名称不能为空！");
		return false;
	}
	if (name.length > 64){
		Ext.MessageBox.alert("提示", "名称长度不能超过64位！");
		return false;
	}
	var spec = Ext.getCmp("spec").getValue();
	if (spec != null && "" != spec){
		if (spec.length > 200){
			Ext.MessageBox.alert("提示", "规格长度不能超过200位！");
			return false;
		}
	}
	var unit = Ext.getCmp("unit").getValue();
	if (unit == null || "" == unit){
		Ext.MessageBox.alert("提示", "单位不能为空！");
		return false;
	}
	
	var data = {};
	data["type"] = "22";
	data["ids"] = selectinfo;
	data["namespec"] = name;
	if (spec != null && "" != spec){
		data["namespec"] = name + spec;
	}
	var content = "code2013~" + baseMaterial["code2013"] + ";name~" + name + ";spec~" + spec + ";unit~" + unit;
	content += ";id~" + selectinfo + ";bianma~" + baseMaterial["bianma"] + ";subcid~" + subcid
	         + ";isDeleted~" + baseMaterial["isDeleted"] + ";createOn~" + baseMaterial["createOn"] + ";createBy~" + baseMaterial["createBy"];
	var areas = $("#span_areas").html();
	if ("暂无" == areas){
		areas = "";
	}
	if (baseMaterial["name"] == name && baseMaterial["spec"] == spec 
			&& baseMaterial["unit"] == unit && baseMaterial["areas"] == areas 
			&& !changeFlag && baseMaterial["subcid"] == subcid){
		Ext.MessageBox.alert("提示", "数据没有变化, 无需保存！");
		return false;
	}
	
	if ("" != areas){
		//content += ";areas~" + areas;
		data["areas"] = areas;
	}
	
	var features = "";
	var keyFeatures = "";
	//特征项
	for (var i = 0, j = currFeature.length; i < j; i ++){
		var bm = currFeature[i];
		var isMain = bm["isMain"];
		var unit = bm["unit"];
		if (unit != null && "null" != unit){
			unit = "(" + unit + ")";
		}else{
			unit = "";
		}
		var fcode = "f" + bm["code"].substring(bm["subcid"].length,bm["code"].length);
		var fVal = $("#span_" + fcode).html() == "无" ? "" : $("#span_" + fcode).html();
		if (fVal != "") {
			features += bm["name"] + unit + ":" + fVal + ";";
			if ("1" == isMain){
				keyFeatures += bm["name"] + unit + ":" + fVal + ";";
			}
		}
		content += ";" + fcode + "~" + fVal;
	}
	
	if (currFeature != null && currFeature.length > 0){
		features = features.substring(0,features.lastIndexOf(";"));
		keyFeatures = keyFeatures.substring(0,keyFeatures.lastIndexOf(";"));
	}
	if (baseMaterial["subcid"] != subcid){ //二级分类改变，则清空原有特征项
		features = '';
	}
	data["features"] = features;
	data["keyFeatures"] = features;
	data["content"] = content;
	loadMarsk = new Ext.LoadMask(document.body, {
    	msg : "正在修改基础材料中...",
        disabled : false,
        store : loadStore
      });
	loadMarsk.show();
	loadStore = Ext.Ajax.request({
		url:'/material/MaterialServlet.do',
		method:'POST',
		params:data,
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				loadMarsk.hide();
				loadStore = null;
				Ext.MessageBox.alert("提示", "材料修改成功！",closeCurrWin);
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

function arrayCompareTo(oldArr, newArr){
	for (var i = 0, j = oldArr.length; i < j; i ++){
		var arr = new array();
		arr = oldArr[i];
		for (var m = 0, n = arr.length; m < n; m ++){
			var val = arr[m];
		}
	}
}

/**
 * 关闭当前选项卡页面，重新加载列表数据
 * @param btn
 */
function closeCurrWin() {
	if (window.parent.tab_0408_iframe){
		window.parent.tab_0408_iframe.ds.reload();
		//window.parent.tab_0408_iframe.loadMap();
	}
	//window.parent.Ext.getCmp('center').remove("baseMaterial_detail");
	window.location.reload(true);
}

function init() {
	buildArea();
};

Ext.onReady(function() {
	init();
	Ext.QuickTips.init();
});
