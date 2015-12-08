Ext.onReady(init);
var grid, ds, win, date_ds = [], up_fs,batch_up;
var hisGrid,hisDs,hisPage,hisWin;
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
var city = [];

var startYear = '2011';

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/MainMaterial'
						}),
				reader : new Ext.data.JsonReader({
							id:id,
							root : 'result'
						}, ["id","code","codegb","name","spec","issueDate","price","changePrice","unit","note"]),
				baseParams : {
					type : 7,
					page : 1,
					pageSize : 20
				},
				countUrl : '/MainMaterial',
				countParams : {
					type : 8
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true,
				pageSize : 20
			});
	grid = new Ext.grid.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '地方编码',
							sortable : false,
							dataIndex : 'code'
						}, {
							header : '国标编码',
							sortable : false,
							dataIndex : 'codegb'
						}, {
							header : '材料名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '型号规格',
							sortable : false,
							dataIndex : 'spec'
						}, {
							header : '单位',
							sortable : false,
							dataIndex : 'unit'
						}, {
							header : '价格',
							sortable : false,
							dataIndex : 'price'
						}, {
							header : '价格浮动',
							sortable : false,
							dataIndex : 'changePrice'
						}, {
							header : '发布日期',
							sortable : false,
							dataIndex : 'issueDate',
							renderer : trimDate
						},{
							header : '备注',
							sortable : false,
							dataIndex : 'note',
							renderer : function(data, metadata, record, rowIndex, columnIndex, store){
								metadata.attr = "ext:qtitle=" + "''" + " ext:qtip='" + data + "'";
								return data;
							}
						}],
				viewConfig : {
					forceFit : true
				},
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [{
							text : '删除当前日期的材料价格',
							icon : "/resource/images/delete.gif",
							handler : delthisDateMat,
							hidden : compareAuth("GOV_MAIN_DEL"),
							tooltip : '删除当前日期所有材料的价格'
						},'-',{
							text : '查看主材历史价格',
							icon : "/resource/images/book_open.png",
							handler : buildHisGrid,
							hidden : compareAuth("GOV_MAIN_HIS"),
							tooltip : '查看主材历史价格'
						},'-',{
							text : '上传主材走势',
							hidden : compareAuth("GOV_MAIN_UPLOAD"),
							icon : "/resource/images/page_add.png",
							handler : showUploadArea
						},'-' ,{
							text : '下载标准文档',
							icon : "/resource/images/page_link.png",
							handler : downTemplate
						},'-',{
							text : '以省份为单位批量上传主材走势',
							hidden : compareAuth("GOV_MAIN_UPLOAD"),
							icon : "/resource/images/page_add.png",
							handler : batchUploadProvince
						}]
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [{
							xtype : "label",
							text : "区域选择："
						},{
							xtype : 'combo',
							id : 'area_sel',
							store : pro,
							triggerAction : 'all',
							emptyText : '请选择省',
							readOnly : true,
							listeners : {
								select : function(combo, record, index) {
									var province = combo.getValue();
									city = zhcn.getCity(province);
									Ext.getCmp('area_city').store.loadData(city);
									Ext.getCmp('area_city').enable();
								}
							}
						}, 
							{
							xtype : 'combo',
							id : 'area_city',
							store : city,
							triggerAction : 'all',
							emptyText : '请选择城市',
							readOnly : true,
							disabled : true
						},'-',{
							xtype : "label",
							text : "发布日期："
						},{
							xtype : 'datefield',
							id : 'date_sel',
							format : 'Y-m-d',
							fieldLabel : '日期选择',
							width : 150,
							emptyText : '请选择发布日期',
							allowBlank : false,
							maxValue : new Date(),
							readOnly : true
						},'-',{
							xtype : "label",
							text : "主材名称："
						},{
							xtype : 'textfield',
							fieldLabel : '主材名称',
							id : 'materialName',
							width:140
						},{
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});

};

function buildHisGrid(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var mid = row.get("id");
	var area = Ext.getCmp("area_sel").getValue();
	var city = Ext.getCmp("area_city").getValue(); 
	var issuedate = Ext.fly("date_sel").getValue();
	
	hisDs = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/MainMaterial'
						}),
				reader : new Ext.data.JsonReader({
							id:id,
							root : 'result'
						}, ["id","code","codegb","name","spec","issueDate","price","changePrice","unit","note"]),
				baseParams : {
					id : mid,
					area : area,
					city : city,
					issuedate : issuedate,
					type : 4,
					page : 1,
					pageSize : 20
				},
				countUrl : '/MainMaterial',
				countParams : {
					type : 12
				},
				remoteSort : true
			});
	hisPage = new Ext.ux.PagingToolbar({
				store : hisDs,
				displayInfo : true,
				pageSize : 20
			});
	hisGrid = new Ext.grid.GridPanel({
				store : hisDs,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '地方编码',
							sortable : false,
							dataIndex : 'code'
						}, {
							header : '国标编码',
							sortable : false,
							dataIndex : 'codegb'
						}, {
							header : '材料名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '型号规格',
							sortable : false,
							dataIndex : 'spec'
						}, {
							header : '单位',
							sortable : false,
							dataIndex : 'unit'
						}, {
							header : '价格',
							sortable : false,
							dataIndex : 'price'
						}, {
							header : '价格浮动',
							sortable : false,
							dataIndex : 'changePrice'
						}, {
							header : '发布日期',
							sortable : false,
							dataIndex : 'issueDate',
							renderer : trimDate
						},{
							header : '备注',
							sortable : false,
							dataIndex : 'note',
							renderer : function(data, metadata, record, rowIndex, columnIndex, store){
								metadata.attr = "ext:qtitle=" + "''" + " ext:qtip='" + data + "'";
								return data;
							}
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							xtype : "label",
							text : "历史年份："
						},{
							xtype : 'combo',
							id : 'his_sel',
							store : date_ds,
							triggerAction : 'all',
							width:100,
							readOnly : true
						},'-',{
							text : '查询',
							icon : "/resource/images/zoom.png",
							handler : searchHistoryList
						}],
				bbar : hisPage
		});
		hisWin = new Ext.Window({
				title : '上传主材走势',
				closeAction : "close",
				width : 800,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [hisGrid]
			});
		hisWin.show();
		var thisYear = getDate();
		hisDs.baseParams["issuedate"] = thisYear;
		hisDs.load();
}

function searchHistoryList(){
	hisDs.baseParams["issuedate"] = Ext.getCmp("his_sel").getValue();
	hisDs.reload();
}

// 获取日期
function getDate() {
	var now = new Date();
	var thisYear = now.getFullYear();
	var year = [];
	if(thisYear == startYear){
		date_ds.push(thisYear);
	}else{
		for(var i=0;i<=(thisYear-startYear);i++){
			date_ds.push(thisYear - i);
		}
	}
	Ext.getCmp('his_sel').store.loadData(date_ds);
	Ext.getCmp('his_sel').setValue(thisYear);
	return thisYear;
	/*
	Ext.Ajax.request({
				url : '/MainMaterial',
				params : {
					type : 11,
					id : mid,
					issuedate : issuedate
				},
				success : function(response) {
					date_ds = [];
					Ext.getCmp('his_sel').reset();
					Ext.getCmp('his_sel').enable();
					var data = eval("(" + response.responseText + ")");
					data = data.result;
					
					//拿到最新的日期，然后加载今年
					var newDate = data[0].toString();
					hisDs.baseParams["issuedate"] = newDate;
					hisDs.load();
					
					var len = data.length;
					for (var i = 0; i < len; i++) {
						date_ds.push(data[i].toString().slice(0, 10));
					}
					Ext.getCmp('his_sel').store.loadData(date_ds);
					Ext.getCmp('his_sel').setValue(newDate);
				},
				failure : function() {
					Warn_Tip();
				}
			});
	*/
};

// download Template
function downTemplate() {
	window.location.href=FileSite+'/doc/main_price_sample.xls';
};

// 删除当前日期价格
function delthisDateMat() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	Ext.MessageBox.confirm("确认操作", "您确认要删除当天的材料价格吗？", function(op) {
				if (op == "yes") {
					Ext.MessageBox.wait("正在删除中，请耐心等待...");
					Ext.Ajax.request({
								url : '/MainMaterial',
								params : {
									type : 5,
									area : Ext.getCmp('area_sel').getValue(),
									city:Ext.getCmp("area_city").getValue(),
									issuedate : Ext.fly("date_sel").getValue()
								},
								success : function(response) {
									Info_Tip("删除成功。");
									delMainMaterialType();
									ds.reload();
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};

//清理没有价格行业数据的分类
function delMainMaterialType(){
	Ext.Ajax.request({
		url : '/MainMaterial',
		params : {
			type : 18,
			area : Ext.getCmp('area_sel').getValue(),
			city:Ext.getCmp("area_city").getValue(),
			issuedate : Ext.fly("date_sel").getValue()
		}
	});
}

// 查询列表
function searchlist() {
	var area = Ext.getCmp("area_sel").getValue();
	var city = Ext.getCmp("area_city").getValue();
	var issuedate = Ext.fly("date_sel").getValue();
	if(area == ''){
		Ext.MessageBox.alert("提示","请选择查询省份！");
		return;
	}
	if(city == ''){
		Ext.MessageBox.alert("提示","请选择查询城市！");
		return;
	}
	if(issuedate == '请选择发布日期'){
		Ext.MessageBox.alert("提示","请选择查询日期！");
		return;
	}
	
	ds.baseParams["area"] = area;
	ds.baseParams["city"] = city;
	ds.baseParams["issuedate"] = issuedate;
	ds.baseParams["name"] = Ext.getCmp("materialName").getValue().trim();
	ds.load();
};

// 上传主材走势
function uploadFile() {

	if (up_fs.getForm().isValid()) {
		var condition = "?type=1&area=" + encodeURI(encodeURI(Ext.fly("province").getValue()))
				+ "&issuedate=" + Ext.fly("date_input").getValue()+"&city="+encodeURI(encodeURI(Ext.fly("city").getValue()));
		up_fs.getForm().getEl().dom["accept-charset"] = "UTF-8";
		up_fs.getForm().getEl().dom["accept-charset"] = "UTF-8";
		up_fs.getForm().submit({
					url : '/MainMaterialUpload' + condition,
					method:'POST',
					waitMsg : '上传文件中...',
					success : function(up_fs, o) {
						// msg('Success', 'Processed file "'+o.result.file+'" on
						// the server');
					},
					failure : function() {

					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
};




//批量上传主材走势
function uploadProvinceFile() {

	if (batch_up.getForm().isValid()) {
		var condition ="?issuedate=" + Ext.fly("date_input").getValue()+"&type=2&area="+encodeURI(encodeURI(Ext.fly("province").getValue()));
		batch_up.getForm().getEl().dom["accept-charset"] = "UTF-8";
		batch_up.getForm().getEl().dom["accept-charset"] = "UTF-8";
		batch_up.getForm().submit({
					url : '/MainMaterialUpload' + condition,
					method:'POST',
					waitMsg : '上传文件中...',
					success : function(batch_up, o) {
						// msg('Success', 'Processed file "'+o.result.file+'" on
						// the server');
					},
					failure : function() {

					}
				});
	} else {
		Info_Tip("请填写必要信息。");
	}
};

// 返回信息
function getResult(flag, msg) {
	if (flag) {
		Ext.MessageBox.hide();
		//getDate(Ext.fly("main_area").getValue());
		/*ds.baseParams["area"] = Ext.fly("province").getValue();
		ds.baseParams["city"] = Ext.fly("city").getValue();
		ds.baseParams["issuedate"] = Ext.fly("date_input").getValue();*/
		//ds.load();
		Info_Tip("上传成功。");
	/*	Ext.getCmp("area_sel").setValue(Ext.fly("province").getValue());
	    Ext.getCmp("area_city").setValue(Ext.fly("city").getValue());
		Ext.getCmp("date_sel").setValue(Ext.fly("date_input").getValue());*/
		setTimeout(function(){win.close();},600);
		
		
	} else {
		Info_Tip(msg);
	}
};

// 显示上传区域
function showUploadArea() {
	up_fs = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none;background-color:',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [{
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : "上传文件",
							width : 190,
							allowBlank : false

						},{
							xtype : 'combo',
							id : 'province',
							store : pro,
							triggerAction : 'all',
							fieldLabel : '请选择省',
							readOnly : true,
							allowBlank : false,
							listeners : {
								select : function(combo, record, index) {
									var province = combo.getValue();
									city = zhcn.getCity(province);
									Ext.getCmp('city').store.loadData(city);
									Ext.getCmp('city').enable();
								}
							}
						}, 
							{
							xtype : 'combo',
							id : 'city',
							store : city,
							triggerAction : 'all',
							fieldLabel : '请选择市',
							readOnly : true,
							allowBlank : false,
							disabled : true
							
							
						}, {
							xtype : 'datefield',
							id : 'date_input',
							format : 'Y-m-d',
							fieldLabel : '日期选择',
							width : 190,
							allowBlank : false,
							maxValue : new Date(),
							readOnly : true
						}],
				buttons : [{
							text : '上传',
							handler : function() {
								uploadFile();
							}
						}]
			});
	win = new Ext.Window({
				title : '上传主材走势',
				closeAction : "close",
				width : 300,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [up_fs]
			});
	win.show();
};




//显示批量上传省份材料
function batchUploadProvince() {
	batch_up = new Ext.form.FormPanel({
				layout : 'form',
				bodyStyle : 'border:none;background-color:',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [{
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : "上传文件",
							width : 190,
							allowBlank : false

						},{
							xtype : 'combo',
							id : 'province',
							store : pro,
							triggerAction : 'all',
							fieldLabel : '请选择省',
							readOnly : true,
							allowBlank : false
						},{
							xtype : 'datefield',
							id : 'date_input',
							format : 'Y-m-d',
							fieldLabel : '日期选择',
							width : 190,
							allowBlank : false,
							maxValue : new Date(),
							readOnly : true
						}],
				buttons : [{
							text : '上传',
							handler : function() {
								uploadProvinceFile();
							}
						}]
			});
	win = new Ext.Window({
				title : '批量上传同一省份各地区主材走势',
				closeAction : "close",
				width : 300,
				autoHeight : true,
				bodyStyle : 'padding:6px',
				draggable : true,
				modal : true,
				items : [batch_up]
			});
	win.show();
};

