Ext.onReady(init);
var bar1,bar2;
var provinceItems, comboProvince, cityItems, townItems, comboTown, comboCity;
var grid, ds, area, win, up_fs;
var ra_season, ra_month;
var zhcn = new Zhcn_Select();
var pro = zhcn_pro_db;
var pro_code_array = zhcn.getProvince(true);
var cityArr = [];
var townArr = [];

/**
 * 初始化
 */
function init() {
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '请先选择地区。');
	buildGrid();
};


//主要材料列表
function buildGrid() {
	ds = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/GovMatTitle.do?type=16'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'province', 'city', 'town', 'dateYear', 'monthVal', 'quarterVal', 'halfYear',
				'oneYear'])
	});
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	grid = new Ext.grid.GridPanel({
		store : ds,
		sm : sm,
		stripeRows : true,
		loadMask : true,
		autoWidth : true,
		autoScroll: true,
		//autoHeight : true,
		//height : 600,
		height : parseInt(parent.Ext.get("tab_0401_iframe").getHeight())
		- 4,
		viewConfig : {
			forceFit : true
		},
		columns : [ new Ext.grid.RowNumberer({width : 30}), cm, 
		 {
			header : '地区',
			sortable : true,
			dataIndex : 'city',
			width:15
		}, {
			header : '区县',
			sortable : true,
			dataIndex : 'town',
			width:15
		}, {
			header : '年份',
			sortable : true,
			dataIndex : 'dateYear',
			width:15
		}, {
			header : '月',
			sortable : false,
			dataIndex : 'monthVal',
			width:40,
			renderer : function showCode(value, p, record) {
				var monthVal = record.get("monthVal");
				if (monthVal != null && "" != monthVal){
					var returnHTML = "";
					var monthArr = monthVal.split(",");
					var province = record.get("province");
					var city = record.get("city");
					var town = record.get("town");
					var year = record.get("dateYear");
					var title = (city == town ? city : city + town) + year + "年";
					for (var i = 0, j = monthArr.length; i < j; i ++){
						var currMonth = monthArr[i];
						if (currMonth != null && "" != currMonth){
							var currDate = year + "-" + currMonth + "-05";
							if (parseInt(currMonth,10) < 10){
								currDate = year + "-" + "0" + currMonth + "-05";
							}
							var currTitle = title + parseInt(currMonth,10) + "信息价";
							returnHTML += "<a href=\"javascript:showList('" + province + "','" + city + "','" + town + "','" + currDate + "','" + currTitle + "')\">" + currMonth + "</a>&nbsp;&nbsp;&nbsp;";
						}
					}
					return returnHTML;
				}
				return "";
			}
		}, {
			header : '季度',
			sortable : false,
			width:30,
			dataIndex : 'quarterVal',
			renderer : function showCode(value, p, record) {
				var quarterVal = record.get("quarterVal");
				if (quarterVal != null && "" != quarterVal){
					var returnHTML = "";
					var monthArr = quarterVal.split(",");
					var province = record.get("province");
					var city = record.get("city");
					var town = record.get("town");
					var year = record.get("dateYear");
					var title = (city == town ? city : city + town) + year + "年";
					for (var i = 0, j = monthArr.length; i < j; i ++){
						var currMonth = monthArr[i];
						if (currMonth != null && "" != currMonth){
							var currDate = year + "-" + currMonth + "-15";
							if (parseInt(currMonth,10) < 10){
								currDate = year + "-" + "0" + currMonth + "-15";
							}
							var quarterName = "";
							if (3 == parseInt(currMonth,10)){
								quarterName = "1季度";
							}else if (6 == parseInt(currMonth,10)){
								quarterName = "2季度";
							}else if (9 == parseInt(currMonth,10)){
								quarterName = "3季度";
							}else if (12 == parseInt(currMonth,10)){
								quarterName = "4季度";
							}
							var currTitle = title + quarterName+ "信息价";
							returnHTML += "<a href=\"javascript:showList('" + province + "','" + city + "','" + town + "','" + currDate + "','" + currTitle + "')\">" + quarterName + "</a>&nbsp;&nbsp;&nbsp;";
						}
					}
					return returnHTML;
				}
				return "";
			
			}
		}, {
			header : '半年/全年',
			sortable : false,
			dataIndex : 'halfYear',
			renderer : function showCode(value, p, record) {
				var halfYear = record.get("halfYear");
				var oneYear = record.get("oneYear");
				var returnHTML = "";
				if (halfYear != null && "" != halfYear){
					var monthArr = halfYear.split(",");
					var province = record.get("province");
					var city = record.get("city");
					var town = record.get("town");
					var year = record.get("dateYear");
					var title = (city == town ? city : city + town) + year + "年";
					for (var i = 0, j = monthArr.length; i < j; i ++){
						var currMonth = monthArr[i];
						if (currMonth != null && "" != currMonth){
							var currDate = year + "-" + currMonth + "-25";
							if (parseInt(currMonth,10) < 10){
								currDate = year + "-" + "0" + currMonth + "-25";
							}
							var yearName = "";
							if (6 == parseInt(currMonth,10)){
								yearName = "上半年";
							}else if (12 == parseInt(currMonth,10)){
								yearName = "下半年";
							}
							var currTitle = title + yearName + "信息价";
							returnHTML += "<a href=\"javascript:showList('" + province + "','" + city + "','" + town + "','" + currDate + "','" + currTitle + "')\">" + yearName + "</a>&nbsp;&nbsp;&nbsp;";
						}
					}
				}
				if (oneYear != null && "" != oneYear){
					var monthArr = oneYear.split(",");
					var province = record.get("province");
					var city = record.get("city");
					var town = record.get("town");
					var year = record.get("dateYear");
					var title = (city == town ? city : city + town) + year + "年";
					for (var i = 0, j = monthArr.length; i < j; i ++){
						var currMonth = monthArr[i];
						if (currMonth != null && "" != currMonth){
							var currDate = year + "-" + currMonth + "-30";
							if (parseInt(currMonth,10) < 10){
								currDate = year + "-" + "0" + currMonth + "-30";
							}
							var yearName = "";
							if (12 == parseInt(currMonth,10)){
								yearName = "全年";
							}
							var currTitle = title + yearName + "信息价";
							returnHTML += "<a href=\"javascript:showList('" + province + "','" + city + "','" + town + "','" + currDate + "','" + currTitle + "')\">" + yearName + "</a>&nbsp;&nbsp;&nbsp;";
						}
					}
				}
				return returnHTML;
			}
		} ],
		tbar : [{
			text : "上传信息价",
			hidden : compareAuth("GOV_UPLOAD"),
			handler : uploadExcel,
			icon : "/resource/images/page_add.png"
		},{
			text : "信息价更新历史",
			hidden : compareAuth("GOV_OP_LIST"),
			handler : govHis,
			icon : "/resource/images/ruby_gear.png"
		}],
		renderTo : 'grid',
		border : false,
		selModel : new Ext.grid.RowSelectionModel()
	});
	
	comboTown = new Ext.form.ComboBox({
		id : 'comboTown',
		store : townArr,
		valueField : "value",
		displayField : "text",
		mode : 'local',
		forceSelection : true,
		emptyText : '请选择',
		hiddenName : 'region',
		editable : false,
		triggerAction : 'all',
		value : "全部区县",
		allowBlank : true,
		readOnly : true,
		fieldLabel : '区',
		name : 'region',
		width : 160
	});
	
	comboCity = new Ext.form.ComboBox({
		id : 'comboCity',
		store : cityArr,
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
		value : "全部城市",
		fieldLabel : '市',
		name : 'region',
		width : 160,
		listeners : {
			select : function(combo) {
				var currProCode = combo.getValue();
				
				Ext.getCmp('comboTown').reset();
				townArr = [];
				townArr = zhcn.getArea(currProCode).concat();
				townArr.unshift("全部区县");
				Ext.getCmp('comboTown').store.loadData(townArr);
				Ext.getCmp('comboTown').enable();
			}
		}
	});
	
	comboProvince  = new Ext.form.ComboBox({
		id : 'province',
		store : pro_code_array,
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
			select : function(combo) {
				//ds.baseParams["province"] = combo.getValue();
				//ds.load();
				var currProCode = combo.getValue();

				Ext.getCmp('comboTown').reset();
				Ext.getCmp('comboCity').reset();
				cityArr = [];
				cityArr = zhcn.getCity(currProCode).concat();
				cityArr.unshift("全部城市");
				Ext.getCmp('comboCity').store.loadData(cityArr);
				Ext.getCmp('comboCity').enable();
			}
		}
	});
	
	//默认加载广东省
	comboProvince.setValue("广东");
	ds.baseParams["province"] = "广东";
	ds.load();
	
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
					text : "区域选择："
				}, comboProvince,comboCity,comboTown,
				 {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	
	comboCity.reset();
	cityArr = zhcn.getCity("广东").concat();
	cityArr.unshift("全部城市");
	comboCity.store.loadData(cityArr);
	Ext.getCmp('comboCity').setValue("全部城市");
	Ext.getCmp('comboTown').setValue("全部区县");
	comboCity.enable();
};

/**
 * 查询
 */
function searchlist(){
	var province = comboProvince.getValue();
	var city = comboCity.getValue();
	var town = comboTown.getValue();
	if (city == "全部城市") city = "";
	if (town == "全部区县") town = "";
	ds.baseParams["province"] = province;
	ds.baseParams["city"] = city;
	ds.baseParams["town"] = town;
	ds.load();
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
	if (upload_form.getForm().isValid()) {
		upload_form
				.getForm()
				.submit(
						{
							url : '/GovMaterialUpload.do?doExecl=1',
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

var loadMarsk,loadStore;
var borderStyle = "border:none;font-size:12px;";
function msgTips(msg){
	var msgArr = msg.split("~");
	var filepath = msgArr[0];//服务器临时文件路径
	var title = msgArr[1]; //信息价标题
	var sucNum = msgArr[2]; //导入数量
	if (parseInt(sucNum,10) == 0){
		Info_Tip("文件里无信息价数据，请检查文件！");
		return false;
	}
	var msgApp = "<center><table width='600'><th>信息价标题</th><th>材料条数</th>" 
		+ "<tr style='border-top-width:1px;border-top-style:solid;border-top-color:black;'><td>" +  title + "</td><td>" + sucNum + "</td></tr>"
		+ "</table></center>";
	
	var showPanel = new Ext.Panel(
			{
				layout : "table",
				border : false,
				id : "showPanel",
				bodyStyle : 'border:none;padding-left:10px;font-size:12px;',
				layoutConfig : {
					columns : 2
				},
				items : [{
							bodyStyle : borderStyle + "margin-top:20px;",
							autoHeight : true,
							items : [ {
								xtype : "label",
								html : "<font color='black'><B>信息价标题</B></font>"
							}]
						},{
							bodyStyle : borderStyle + "margin-top:20px;",
							autoHeight : true,
							items : [ {
								xtype : "label",
								html : "<font color='black'><B>材料条数</B></font>"
							}]
						},{
							colspan : 2,
							bodyStyle : borderStyle + "margin-right:20px;",
							autoHeight : true,
							items : [ {
								xtype : "label",
								html : "<hr width='300'>"
							}]
						},{
							bodyStyle : borderStyle + "margin-bottom:20px;",
							autoHeight : true,
							items : [ {
								xtype : "label",
								html : title
							}]
						},{
							bodyStyle : borderStyle + "margin-bottom:20px;",
							autoHeight : true,
							items : [ {
								xtype : "label",
								html : sucNum
							}]
						}]
			});
	
	var showWin = new Ext.Window({
		title : '信息价上传',
		closeAction : "close",
		id : "showWin",
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
		items : [ showPanel ],
		buttons : [ {
			text : '确认上传',
			handler : function() {
				loadMarsk = new Ext.LoadMask("showWin", {
			    	msg : "正在上传信息价...",
			        disabled : false,
			        store : loadStore
			      });
				loadMarsk.show();
				loadStore = Ext.lib.Ajax
						.request(
								"post",
								"/GovMaterialUpload.do?doExecl=1&uploadFlag=1&filePath=" + encodeURI(encodeURI(filepath)),
								{
									success : function(
											response) {
										var data = eval("("
												+ response.responseText
												+ ")");
										loadMarsk.hide();
										loadStore = null;
										if (getState(
												data.state,
												commonResultFunc,
												data.result)) {
											var sucNum = data.result;
											var r = /^\+?[1-9][0-9]*$/; //正整数
											if (r.test(sucNum)){
												Info_Tip("信息价上传成功！");
												showWin.close();
												win.close();
												var selectPro = Ext.getCmp("province").getValue();
												if (selectPro != null && "" != selectPro){
													ds.reload();
												}
											}else{
												showErrorWin(sucNum);
											}
										}else{
											showErrorWin(sucNum);
										}
									}
								});
			}
		},{
			text : '取消',
			handler : function() {
				showWin.close();
				win.close();
			}
		} ]
	});
	showWin.show();
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
					autoHeight : true
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

/**
 * 信息价更新历史
 */
function govHis(){
	window.parent.createNewWidget("gov_op_list", '信息价更新历史',
			'/module/mat/gov_op_list.jsp');
}

function showList(province,city,town,date,title){
	showGovDetail(province,city,town,date,title);
	/*window.parent.createNewWidget("mat_gov_list", '信息价列表',
	'/module/mat/mat_gov_list.jsp?province=' + province + "&city=" + city + "&town=" + town + "&date=" + date);*/
}

/**
 * 信息价列表
 */
function showGovDetail(province,city,town,date,title){
	var addr = city + town;
	if (city == town) addr = city;
	window.parent.createNewWidget("mat_gov_detail", '信息价详情',
			'/module/mat/mat_gov_detail.jsp?date=' + date
					+ "&province=" + province + "&city=" + city + "&town=" + town
					+ "&addr=" + addr + "&title=" + title);
}