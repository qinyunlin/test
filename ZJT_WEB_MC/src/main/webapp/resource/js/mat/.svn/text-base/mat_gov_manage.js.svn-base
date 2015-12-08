Ext.onReady(init);
var bar1,bar2;
var provinceItems, comboProvince;
var grid, ds, area, win, up_fs;
var ra_season, ra_month;
var provinceList,cityList,townList,yearList;
var mat_gov_panel,panelItems;
var govTitleList;
var currList, currPro,currProCode;
var cityMap,townMap,issueDateMap;

/**
 * 初始化
 */
function init() {
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '请先选择地区。');
	loadProvinceList();
	createBar();
};

/**
 * 创建菜单栏
 */
function createBar(){
	bar1 = new Ext.Toolbar({
		renderTo : "mat_gov_bar1",
		items : [{
			text : "上传信息价",
			hidden : compareAuth("GOV_UPLOAD"),
			handler : uploadExcel,
			icon : "/resource/images/page_add.png"
		},{
			text : "信息价更新历史",
			handler : govHis,
			icon : "/resource/images/ruby_gear.png"
		}]
	});
	
	bar2 = new Ext.Toolbar({
		renderTo : "mat_gov_bar2",
		items : [{
					text : "区域选择："
				}, comboProvince]
	});
}

/**
 * 加载当前省份下所有的城市、区县
 * @param pro
 */
function loadList(pro){
	currList = null;
	var data = {};
	data["type"] = "58";
	data["province"] = pro;
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				currList = data.result;
				//分别封装cityMap、townMap
				cityMap = new Map();
				townMap = new Map();
				for (var i = 0, j = currList.length; i < j; i ++){
					var currObj = currList[i];
					var currCode = currObj["regionCode"];
					if (currCode.length == 4){
						cityMap.put(currCode, currObj);
					}else if (currCode.length == 6){
						townMap.put(currCode, currObj);
					}
				}
			}
		}
	});
}

/**
 * 加载信息价
 */
function loadGovTitleList(pro){
	cityList = null;
	var data = {};
	data["type"] = "57";
	data["province"] = pro;
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				govTitleList = data.result;
			}
		}
	});
}

/**
 * 加载信息价
 */
function loadGovYearList(pro){
	cityList = null;
	var data = {};
	data["type"] = "57";
	data["province"] = pro;
	data["content"] = "flag~1";
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				yearList = data.result;
			}
		}
	});
}

/**
 * 加载省份
 */
function loadProvinceList(){
	provinceItems = [];
	provinceList = null;
	var data = {};
	data["type"] = "54";
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				provinceList = data.result;
				for (var i = 0, j = provinceList.length; i < j; i ++){
					//provinceItems.push([provinceList[i]["name"],provinceList[i]["name"]]);
					provinceItems.push([provinceList[i]["regionCode"],provinceList[i]["name"]]);
				}
			}
		}
	});
	
	comboProvince  = new Ext.form.ComboBox({
		id : 'province',
		store : provinceItems,
		width : 160,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择区域',
		editable : false,
		triggerAction : 'all',
		allowBlank : true,
		readOnly : true,
		fieldLabel : '区域',
		listeners : {
			"select" : function(combo) {
				currProCode = combo.getValue();
				currPro = combo.getRawValue();
				createArea(currPro,currProCode);
			}
		}
	});
	currPro = "广东";
	currProCode = "44";
	//默认加载广东信息价
	Ext.getCmp("province").setValue("广东");
	createArea(currPro,currProCode);
}

/**
 * 加载城市
 */
function loadCityList(pro){
	cityList = null;
	var data = {};
	data["type"] = "55";
	data["province"] = pro;
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				cityList = data.result;
			}
		}
	});
}

/**
 * 加载区县
 */
function loadTownList(pro,city){
	townList = null;
	var data = {};
	data["type"] = "56";
	data["province"] = pro;
	//data["city"] = city;
	$.ajax({
		type : 'POST',
		url : '/material/MaterialServlet.do',
		async : false,
		data : data,
		complete : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (data.result != null) {
				townList = data.result;
			}
		}
	});
}

/**
 * 获取当前区县的信息价年份期刊
 * @param townName
 * @returns
 */
function getIssueYearByTown(townName){
	var yearMap = new Map();
	var yearArr = [];
	if (townName == null || "" == townName || yearList == null || yearList.length == 0) return yearArr;
	
	for (var i = 0, j = yearList.length; i < j; i ++){
		var currObj = yearList[i];
		if (townName == currObj["webCounty"]){
			var cIssueDate = currObj["issueDate"];
			var cYear = cIssueDate;
			if (!yearMap.containsValue(cYear)){
				yearMap.put(townName, cYear);
				yearArr.push(cYear);
				continue;
			}
		}
	}
	return yearArr;
}

/**
 * 创建当前区县的信息价年份期刊
 * @param townName
 * @returns
 */
function createIssueYearByTown(tag, townName){
	var yearMap = new Map();
	var yearArr = [];
	if (townName == null || "" == townName || yearList == null || yearList.length == 0) return yearArr;
	
	for (var i = 0, j = yearList.length; i < j; i ++){
		var currObj = yearList[i];
		if (townName == currObj["webCounty"]){
			var cIssueDate = currObj["issueDate"];
			var cYear = cIssueDate.split("-")[0];
			if (!yearMap.containsValue(cYear)){
				yearMap.put(townName, cYear);
				yearArr.push(cYear);
				continue;
			}
		}
	}
	return yearArr;
}

/**
 * 获取省份下的所有城市
 */
function getCityListByCode(proCode){
	if (currList == null || currList.length == 0 || proCode == null || "" == proCode) return null;
	cityList = [];
	for (var i = 0, j = currList.length; i < j; i ++){
		if (currList[i]["regionCode"].length != 4) continue;
		if (currList[i]["regionCode"].substring(0,2) == proCode){
			cityList.push(currList[i]);
		}
	}
}

/**
 * 获取当前城市下的区县
 */
function getTownListByCityId(cityName,cityId){
	var townArr = [];
	if (cityId == null || "" == cityId || townList == null || townList.length == 0) return townArr;
	
	for (var i = 0, j = townList.length; i < j; i ++){
		var currTown = townList[i];
		var currPid = currTown["pid"];
		
		if (currPid == cityId){
			townArr.push(currTown);
		}
	}
	return townArr;
}

/**
 * 加载选择区域信息价列表
 */
function createArea(pro,proCode){
	//加载当前省份下的信息价
	window.console.log("加载信息价标题：" + new Date());
	loadGovTitleList(pro);
	window.console.log("加载信息价标题结束：" + new Date());
	loadGovYearList(pro);
	window.console.log("统计信息价年份结束：" + new Date());
	//加载当前省份下的城市
	loadCityList(pro);
	window.console.log("加载城市结束：" + new Date());
	//加载当前省份下的区县
	loadTownList(pro,null);
	window.console.log("加载区县结束：" + new Date());
	//加载当前省份下所有的城市、区县
	//loadList(pro);
	window.console.log("开始动态创建DOM对象：" + new Date());
	//清空
	$("#titleName").html('');
	var h1 = $("<h1></h1>");
	$(h1).html(pro + " 信息价");
	$(h1).appendTo($("#titleName"));
	$(h1).css("font-size","16px");
	$("#mat_gov_panel").html('');
	
	//ext创建动态表格比较复杂，采用jquery简单实现，显示信息价列表
	var table = $("<table></table>");
	$(table).attr("cellpadding","0");
	$(table).attr("cellspacing","0");
	$(table).attr("border","0");
	$(table).attr("align","center");
	tdToAddCss(table);
	
	$(table).css("font-size","16px");
	$(table).appendTo($("#mat_gov_panel"));
	
	var count = 0;
	//getCityListByCode(proCode);
	if (cityList != null && cityList.length > 0){
		for (var i = 0; i < cityList.length; i ++) {
			var currCity = cityList[i];
			var cityName = currCity["name"];
			//var cityCode = currCity["regionCode"];
			var cityId = currCity["id"];
			window.console.log("开始获取" + cityName + "下的区县:" + new Date());
			var townArr = getTownListByCityId(cityName,cityId);
			window.console.log("结束获取" + cityName + "下的区县:" + new Date());
			if (townArr == null || townArr.length == 0) continue;
			
			var len = townArr.length;
			for (var k = 0,l = len; k < l; k ++){
				var townName = townArr[k]["name"];
				var townCode = townArr[k]["regionCode"];
				var tr = $("<tr></tr>");
				if (k == 0){
					var cityTd = $("<td></td>");
					tdToAddCss(cityTd);
					$(cityTd).attr("rowspan",len);
					var citySpan = $("<span></span>");
					$(citySpan).html("<B>" + cityName + "</B>");
					tagToAddMarginPxCss(citySpan);
					$(citySpan).appendTo($(cityTd));
					$(cityTd).appendTo($(tr));
				}
				
				var townTd = $("<td></td>");
				tdToAddCss(townTd);
				var townSpan = $("<span></span>");
				$(townSpan).html(townName);
				tagToAddMarginPxCss(townSpan);
				$(townSpan).appendTo($(townTd));
				$(townTd).appendTo($(tr));
				
				var yearArr = getIssueYearByTown(townName);
				var yearTd = $("<td></td>");
				$(yearTd).css("text-align","left");
				tdToAddCss(yearTd);
				var yearDiv = $("<div></div>");
				//tagToAddPxCss(yearDiv);
				//createIssueYearByTown(yearDiv, townName);
				for (var m = 0, n = yearArr.length; m < n; m ++) {
					var currYearDiv = $("<div></div>");
					var yearSpan = $("<span></span>");
					var currYear = yearArr[m];
					tagToAddPaddingPxCss(yearSpan);
					tagToAddPaddingPxCss(currYearDiv);
					//设置div背景颜色:单双行颜色渐变
					$(currYearDiv).css("background-color","#00ff99");
					if (count % 2 == 0){
						$(currYearDiv).css("background-color","#ffffcc");
					}
					$(yearSpan).html(currYear);
					$(yearSpan).appendTo($(currYearDiv));
					$(currYearDiv).appendTo($(yearDiv));
					
					getMagazineHTML(currYearDiv,cityName, townName, townCode,currYear);
					count += 1;
				}
				$(yearDiv).appendTo($(yearTd));
				$(yearTd).appendTo($(tr));
				$(tr).appendTo($(table));
			}
			window.console.log(cityName + "下的DOM创建完成" + new Date());
		}
		showMagazine();
		window.console.log("结束动态创建DOM对象：" + new Date());
	}
}

function tdToAddCss(td){
	//表格边框中上右下左的边框宽度
	$(td).css("border-top-width","1px");
	$(td).css("border-right-width","1px");
	$(td).css("border-bottom-width","1px");
	$(td).css("border-left-width","1px");
	//设置边框的表现样式，solid为实线
	$(td).css("border-top-style","solid");
	$(td).css("border-right-style","solid");
	$(td).css("border-bottom-style","solid");
	$(td).css("border-left-style","solid");
	//设置边框的颜色
	$(td).css("border-top-color"," black");
	$(td).css("border-right-color"," black");
	$(td).css("border-bottom-color"," black");
	$(td).css("border-left-color"," black");
}

function tagToAddMarginPxCss(tag){
	$(tag).css("margin-left",marginPx);
	$(tag).css("margin-right",marginPx);
	$(tag).css("margin-top",marginPx);
	$(tag).css("margin-bottom",marginPx);
}

function tagToAddPaddingPxCss(tag){
	$(tag).css("padding-left",marginPx);
	$(tag).css("padding-right",marginPx);
	$(tag).css("padding-top",marginPx);
	$(tag).css("padding-bottom",marginPx);
}

//更新分类统计数
function updateTypeCount(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	
	var id = row.get("id");
	if(id == "" || id == null){
		Info_Tip("请选择一条信息。");
		return;
	}
    
    Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=7", {
        success: function(response){
            Info_Tip("更新分类统计数成功.");
        },
        failure: function(){
            Warn_Tip();
        }
    }, "id=" + id);
	
}

// edit op
function editGov() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var title = row.get("title");
	var reMark = row.get("reMark");
	var panel = new Ext.Panel({
				layout : "form",
				border : false,
				labelWidth : 80,
				labelAlign : 'right',
				items : [{
							xtype : 'textfield',
							fieldLabel : "信息价标题",
							id : "title_edit",
							width : 220,
							value : title
						},{
							id:'note',
							xtype : 'textarea',
							fieldLabel:'信息价备注',
							name : 'note',
							width : 280,
							height:120,
							value:reMark,
							maxLength : 800
						}]
			});
	// 上传PDF暂时屏蔽
	up_fs = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none',
				fileUpload : true,
				items : {
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : "PDF文件"

				},
				buttons : [{
							text : '上传',
							handler : function() {
								uploadPDF(row.get("id"))
							}
						}]
			});
	win = new Ext.Window({
				title : "修改信息价",
				closeAction : "close",
				bodyStyle : 'padding:6px',
				layout : 'fit',
				items : [panel],
				draggable : true,
				modal : true,
				width : 400,
				height : 250,
				buttons : [{
							text : "修改",
							handler : function() {
								saveEdit(row.get("id"))
							}
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]

			});
	win.show();
};

// save edit info
function saveEdit(id) {
	var title = Ext.fly("title_edit").getValue();
	var reMark = Ext.fly("note").getValue();
	
	if (!validateInput["t"](title, 100, "标题"))
		return;
	Ext.Msg.confirm("提示", "您确定要修改该信息价?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=3", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("信息价修改成功.");
										ds.reload();
										win.close();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + id + "&content=title~" + title + ";reMark~" + reMark);
				}
			});

};

// upload PDF
function uploadPDF(id) {
	if (up_fs.getForm().isValid()) {
		up_fs.getForm().submit({
					url : '/GovMaterialPDFServlet?type=1&id=' + id,
					waitMsg : '上传文件中...',
					success : function(up_fs, response) {
						var json = eval("(" + response.response.responseText
								+ ")")
						if (json.result == "success")
							Info_Tip("上传成功。");
						win.close();
					},
					failure : function(up_fs, response) {
						var json = eval("(" + response.response.responseText
								+ ")")
						if (json.result == "failed")
							Info_Tip("上传失败。");

					}
				});
	}
};

// del op
function delGov() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.Msg.confirm("提示", "您确定要删除该信息价?", function(op) {
		if (op == "yes") {
			Ext.MessageBox.confirm("确认操作", "您确认要删除所选择的信息吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/GovMatTitle.do?type=2", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("信息价删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "id=" + row.get("id") + "&province=" + Ext.fly("province_combo").getValue());
				}
			});
		}
	});

};

// down excel area
function downExcel() {
	up_fs = new Ext.form.FormPanel({
				layout : 'form',
				autoWidth : true,
				height : 110,
				bodyStyle : 'padding:6px;',
				items : [{
					fieldLabel : "请选择信息价地区(省、市、区)",
					bodyStyle : 'border:none',
					items : [{
								layout : "column",
								bodyStyle : "border:none;margin:6px auto;",
								items : [area3 = new Ext.form.ComboBox({
													fieldLabel : "省",
													id : 'province_combo_1',
													store : pro,
													emptyText : "请选择",
													mode : "local",
													triggerAction : "all",
													valueField : "value",
													readOnly : true,
													allowBlank : false,
													displayField : "text"
												}),
										area4 = new Ext.form.ComboBox({
													fieldLabel : "市",
													id : 'city_combo_1',
													store : city,
													emptyText : "请选择",
													mode : "local",
													triggerAction : "all",
													valueField : "value",
													readOnly : true,
													disabled : true,
													allowBlank : false,
													displayField : "text"
												}),
										area5 = new Ext.form.ComboBox({
													fieldLabel : "区",
													store : city_area,
													id : 'area_combo_1',
													emptyText : "请选择",
													mode : "local",
													triggerAction : "all",
													valueField : "value",
													readOnly : true,
													disabled : true,
													allowBlank : false,
													displayField : "text"
												})]
							}]
				}, {
					fieldLabel : "选择时间",
					bodyStyle : 'border:none',
					items : [{
						layout : 'column',
						bodyStyle : 'border:none',
						items : [ra_season = new Ext.form.Radio({
											xtype : 'radio',
											inputValue : '1',
											name : 'ra_type',
											boxLabel : '季度',
											id : 'ra_season',
											listeners : {
												"check" : function(ra_season,
														checked) {
													if (checked) {
														showEl("date_area");
														hideEl("month_input");
														showEl("year_input");
														showEl("season_input");
													}
												}
											}
										}), ra_month = new Ext.form.Radio({
											xtype : 'radio',
											inputValue : '2',
											name : 'ra_type',
											boxLabel : '月份',
											id : 'ra_month',
											listeners : {
												"check" : function(ra_month,
														checked) {
													if (checked) {
														showEl("date_area");
														hideEl("season_input");
														showEl("year_input");
														showEl("month_input");
													}
												}
											}
										}), {
									id : 'date_area',
									bodyStyle : 'border:none',
									layout : 'column',
									items : [{
												id : "year_input",
												xtype : 'combo',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : year_array
											}, {
												xtype : 'combo',
												id : 'season_input',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : season_array

											}, {
												id : 'month_input',
												xtype : 'combo',
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : month_array
											}]
								}]
					}]
				}]
			});
	win = new Ext.Window({
				title : '下载信息价',
				width : 660,
				draggable : true,
				modal : true,
				height : 180,
				items : [up_fs],
				buttons : [{
							text : '下载',
							handler : downExcel_submit
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	area3.on("select", function(combobox) {
				var province = combobox.getValue();
				city = zhcn.getCity(province);
				area4.store.loadData(city);
				area5.reset();
				area4.reset();
				area5.enable();

			})
	area4.on("select", function(combobox) {
				var ci = combobox.getValue();
				city_area = zhcn.getArea(ci)
				area5.store.loadData(city_area);
				area5.reset();
				area5.enable();

			})
	hideEl("date_area");
};
// down Excel /MaterialDownload.do
function downExcel_submit() {
	var issuDate;

	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var up_fs = new Ext.FormPanel();
	issuDate = row.get('issueDate').slice(0, 10);
	var addr = "";
	if (Ext.fly("city_combo").getValue() == Ext.fly("area_combo").getValue())
		addr = Ext.fly("city_combo").getValue();
	else
		addr = Ext.fly("city_combo").getValue()
				+ Ext.fly("area_combo").getValue();
	var condition = "?type=gov";
	condition += "&province=" + encodeURI(encodeURI(Ext.fly("province_combo").getValue()));
	condition += "&diff=issuedate~" + issuDate + "~" + issuDate
			+ "~DIFF_BETWEEN&content=isGov~1;addr~" + encodeURI(encodeURI(addr));
	document.uplogoform.action = '/MaterialDownload.do' + condition;
	document.uplogoform.submit();

};

// down form
function downForm() {
	window.location.href = FileSite + '/doc/gov_price_sample.xls';
};

// upload excel
function uploadExcel() {
	var msgHTML = "<font color=red>信息价文件命名标准格式“省_市_区_期数”，如下所示：</font></br>"
		+ "<font color=red>月份信息价（日期数为05）：例＂广东_广州市_花都区_20130105＂</font></br>"
		+ "<font color=red>第一季度信息价（日期数为15）：例＂广东_广州市_花都区_20130315＂</font></br>"
		+ "<font color=red>第二季度信息价（日期数为15）：例＂广东_广州市_花都区_20130615＂</font></br>"
		+ "<font color=red>第三季度信息价（日期数为15）：例＂广东_广州市_花都区_20130915＂</font></br>"
		+ "<font color=red>第四季度信息价（日期数为15）：例＂广东_广州市_花都区_20131215＂</font></br>"
		+ "<font color=red>上半年信息价（日期数为25）：例＂广东_广州市_花都区_20130625＂</font></br>"
		+ "<font color=red>下半年信息价（日期数为25）：例＂广东_广州市_花都区_20131225＂</font></br>"
		+ "<font color=red>全年信息价（日期数为30）：例＂广东_广州市_花都区_20131230＂</font></br>";
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [ {
				layout : 'form',
				bodyStyle : 'border:none;',
				items : [{
					xtype : 'textfield',
					inputType : 'file',
					fieldLabel : '选择文件',
					allowBlank : false
				},
				{
					columnWidth : 0.5,
					layout : 'form',
					bodyStyle : 'border:none;',
					items : {
						bodyStyle : 'border:none;',
						html : "<a href='" + FileSite + "/doc/mat_gov.xls"
								+ "' >信息价标准文档下载</a>" + "</br></p>" + msgHTML
					}
				} ]
			} ]
		} ]
	});
	win = new Ext.Window({
		title : '信息价上传',
		closeable : true,
		width : 600,
		//height : 400,
		autoHeight:true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : function() {
				uploadFile();
			}
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();

};


function uploadFile(isPrice) {
	var condition = "?province=" + province + "&area=" + city + "&county="
	+ area + "&issueDate=" + issuDate + "&title=" + title+"&mark="+desc;
	if (upload_form.getForm().isValid()) {
		upload_form
				.getForm()
				.submit(
						{
							url : '/GovMaterialUpload.do'+condition,
							waitMsg : '上传文件中...',
							success : function(upload_form, o) {
								var returnInfo = o.result;
								if (getState(returnInfo.state,
										commonResultFunc, returnInfo.result)) {
									var sucNum = returnInfo.result;
									var r = /^\+?[1-9][0-9]*$/; //正整数
									if (r.test(sucNum)){
										Info_Tip("信息价成功上传" + sucNum + "条！");
										win.close();
										ds.reload();
									}else{
										if (sucNum.indexOf("~") != -1){//信息确认
											msgTips(sucNum);
										}else{ //错误信息
											showErrorWin(sucNum);
										}
									}
								} 
							},
							failure : function() {
								showErrorWin("信息价上传失败，具体请联系技术人员！");
							}
						});
	} else
		Info_Tip("请正确填写信息。");
}

function msgTips(msg){
	var msgArr = msg.split("~");
	var filepath = msgArr[0];//服务器临时文件路径
	var title = msgArr[1]; //信息价标题
	var sucNum = msgArr[2]; //导入数量
	var msgApp = "<table border='0'><th>信息价标题</th><th>材料条数</th>" 
		+ "<tr><td>" +  title + "</td><td>" + sucNum + "</td></tr>"
		+ "</table>";
	Ext.MessageBox
	.show({
		title : '上传信息价',
		msg : msgApp,
		width : 800,
		prompt : false,
		buttons : {
			"ok" : "提交",
			"cancel" : "取消"
		},
		multiline : false,
		fn : function(
				btn,
				text) {
			if ("ok" == btn) {
				Ext.lib.Ajax
						.request(
								"post",
								"/GovMaterialUpload.do?uploadFlag=1&filePath=" + filepath,
								{
									success : function(
											response) {
										var data = eval("("
												+ response.responseText
												+ ")");
										if (getState(
												data.state,
												commonResultFunc,
												data.result)) {
											var sucNum = data.result;
											var r = /^\+?[1-9][0-9]*$/; //正整数
											if (r.test(sucNum)){
												Info_Tip("VIP订单成功导入" + sucNum + "条！");
												win.close();
												ds.reload();
											}else{
												showErrorWin(sucNum);
											}
										}else{
											showErrorWin(sucNum);
										}
									}
								});
			}
		}
	});
}

function showErrorWin(errorMsg){
	Ext.MessageBox.hide();
	//win.close();
	var exceptionMsg = new Ext.form.FormPanel(
			{
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [ {
					xtype : 'textarea',
					width : 380,
					value : errorMsg,
					style : "min-height:300px;",
					allowBlank : false,
					autoHeight : true,

				} ],
				buttons : [ {
					text : '确定',
					handler : function() {
						win1.close();
					}
				} ]
			});
	var win1 = new Ext.Window({
		title : '错误提示',
		closeAction : "close",
		width : 500,
		autoHeight : true,
		bodyStyle : 'padding:6px',
		draggable : true,
		modal : true,
		items : [ exceptionMsg ]
	});
	win1.show();

}

var getResult = function(flag, msg) {
	if (flag) {
		alert("上传成功");
		Ext.MessageBox.hide();
		ds.baseParams["province"] = Ext.fly("province_combo_1").getValue();
		ds.baseParams["area"] = Ext.fly("area_combo_1").getValue();
		Ext.fly('province_combo').dom.value = (Ext.fly("province_combo_1").getValue());
		Ext.fly("city_combo").dom.value = (Ext.fly("city_combo_1").getValue());
		Ext.fly("area_combo").dom.value = (Ext.fly("area_combo_1").getValue());
		ds.load();
		win.close();
	} else {
		up_fs.getForm().reset();
		Ext.MessageBox.hide();
		if(msg.indexOf("downloadPath:") != -1){
			Ext.MessageBox.alert("分类检查","上传信息价中存在二级分类无法匹配的材料！请导出查看！", function(){
				window.open(msg.replace("downloadPath:", ""));
			});
		}else{
			alert(msg);
		}
	}
};

var marginPx = "10px";
/**
 * 获取当前区县对应年份的期刊
 * @param tagObj
 * @param townCode
 * @param year
 */
function getMagazineHTML(tagObj, cityName, townName, townCode, year){
	townCode = codefans_net_CC2PY(townName);
	//月份
	for (var i = 1; i <= 12; i ++){
		var a = $("<a></a>");
		$(a).attr("id","m" + i + "_" + year + "_" + townCode);
		tagToAddPaddingPxCss(a);
		$(a).css("display","inline");
		var month = parseInt(i);
		var mStr = i;
		if (month < 10){
			mStr = "0" + i;
		}
		var date = year + "-" + mStr + "-05";
		$(a).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + date + "');");
		$(a).html(i + "月");
		$(a).hide();
		
		$(a).appendTo(tagObj);
	}
	
	var quarter1 = $("<a>1季度</a>");
	$(quarter1).attr("id","q1_" + year + "_" + townCode);
	$(quarter1).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-03-15');");
	tagToAddPaddingPxCss(quarter1);
	var quarter2 = $("<a>2季度</a>");
	$(quarter2).attr("id","q2_" + year + "_" + townCode);
	$(quarter2).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-06-15');");
	tagToAddPaddingPxCss(quarter2);
	var quarter3 = $("<a>3季度</a>");
	$(quarter3).attr("id","q3_" + year + "_" + townCode);
	$(quarter3).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-09-15');");
	tagToAddPaddingPxCss(quarter3);
	var quarter4 = $("<a>4季度</a>");
	$(quarter4).attr("id","q4_" + year + "_" + townCode);
	$(quarter4).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-12-15');");
	tagToAddPaddingPxCss(quarter4);
	
	var halfYear = $("<a>上半年</a>");
	$(halfYear).attr("id","halfYear_" + year + "_" + townCode);
	$(halfYear).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-06-25');");
	tagToAddPaddingPxCss(halfYear);
	var lastHalfYear = $("<a>下半年</a>");
	$(lastHalfYear).attr("id","lastHalfYear_" + year + "_" + townCode);
	$(lastHalfYear).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-12-25');");
	tagToAddPaddingPxCss(lastHalfYear);
	var oneYear = $("<a>全年</a>");
	$(oneYear).attr("id","year_" + year + "_" + townCode);
	tagToAddPaddingPxCss(oneYear);
	$(oneYear).attr("href","javascript:showList('" + currPro + "','" + cityName + "','" + townName + "','" + year + "-12-30');");
	
	$(quarter1).appendTo(tagObj);
	$(quarter1).hide();
	$(quarter2).appendTo(tagObj);
	$(quarter2).hide();
	$(quarter3).appendTo(tagObj);
	$(quarter3).hide();
	$(quarter4).appendTo(tagObj);
	$(quarter4).hide();
	$(halfYear).appendTo(tagObj);
	$(halfYear).hide();
	$(lastHalfYear).appendTo(tagObj);
	$(lastHalfYear).hide();
	$(oneYear).appendTo(tagObj);
	$(oneYear).hide();
	
	/*var br = $("</br>");
	$(br).appendTo($(tagObj));
	var p = $("</p>");
	$(p).appendTo($(tagObj));*/
}

function showMagazine(){
	for (var i = 0, j = govTitleList.length; i < j; i ++){
		var currObj = govTitleList[i];
		var currName = currObj["webCounty"];
		var currIssueDate = currObj["issueDate"];
		var currYear =currIssueDate.split("-")[0];
		var year = currYear;
		var townCode = codefans_net_CC2PY(currName);
		var month = parseInt(currIssueDate.split("-")[1],10);
		var day = parseInt(currIssueDate.split("-")[2],10);
		if (5 == day){ //月刊
			$("#m" + month + "_" + year + "_" + townCode).show();
		}else if (15 == day){ //季度刊
			var qVal = 1;
			if (month == 6){
				qVal = 2;
			}else if (month == 9){
				qVal = 3;
			}else if (month == 12){
				qVal = 4;
			}
			$("#q" + qVal + "_" + year + "_" + townCode).show();
		}else if (25 == day){ //年刊
			var yVal = "halfYear";//上半年
			if (month = 12){ //下半年
				yVal = "lastHalfYear";
			}
			$("#" + yVal + "_" + year + "_" + townCode).show();
		}else if (30 == day){ //全年
			if (month = 12){
				$("#year_" + year + "_" + townCode).show();
			}
		}
	}
}

/**
 * 信息价更新历史
 */
function govHis(){
	
}

function showList(province,city,town,date){
	showGovDetail(province,city,town,date);
	/*window.parent.createNewWidget("mat_gov_list", '信息价列表',
	'/module/mat/mat_gov_list.jsp?province=' + province + "&city=" + city + "&town=" + town + "&date=" + date);*/
}

/**
 * 信息价列表
 */
function showGovDetail(province,city,town,date){
	var addr = city + town;
	if (city == town) addr = city;
	window.parent.createNewWidget("mat_gov_detail", '信息价详情',
			'/module/mat/mat_gov_detail.jsp?date=' + date
					+ "&province=" + province
					+ "&addr=" + addr);
}
