var url = "/mc/lampManageServlet.do", grid_info, addLampArea_win, areaId, lampAreaJson = "";
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	getLampAreaList();

};
var tbar = [{
			text : '添加展区',
			icon : "/resource/images/add.gif",
			hidden : compareAuth("LAMP_AREA_ADD"),
			handler : function(){
				showAddLampArea("add");
			}
		}, {
			text : '查看/修改',
			icon : "/resource/images/edit.gif", 
			hidden : compareAuth("LAMP_AREA_EDIT"),
			handler : showUpdateLampArea
		},{
			text : "管理展位",
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("LAMP_BOOTH_LIST"),
			handler : openLampBooth
		},{
			text : "删除",
			icon : "/resource/images/delete.gif",
			hidden : compareAuth("LAMP_AREA_DEL"),
			handler : delLampArea
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id",type:'int'},{name:"name"},{name:"usedNum"},{name:"num"},{name:"createBy"},{name:"createOn"},{name:"updateBy"}]	
			}),
	baseParams : {
		type : 1,
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 2
	},
	remoteSort : true
});
pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "id",
	singleSelect : true
});
//获取活动列表
function getLampAreaList(){
	grid_info = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_info,
		viewConfig : {
			forceFit : true
		},
		tbar : tbar,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : '展区',
					sortable : false,
					dataIndex : 'name'
				}, {
					header : '展位情况',
					sortable : false,
					renderer:function(v,meta,record){
						return record.get("usedNum") + "/" + record.get("num");
					}
				}, {
					header : '添加日期',
					sortable : false,
					dataIndex : 'createOn'
				}, {
					header : '添加人ID',
					sortable : false,
					dataIndex : 'createBy'
				}, {
					header : '更新人ID',
					sortable : false,
					dataIndex : 'updateBy'
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list_info"
	});
	ds_info.load();
}
//显示添加活动弹出窗口
function showAddLampArea(type){
	if(type == "add")
		lampAreaJson = "";
	var fs = new Ext.form.FormPanel({
		labelAlign : 'left',
		labelWidth : 90,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : 150,
		layoutConfig : {
			columns : 1
		},
		bodyStyle : 'padding:6px',
		items : [{
			layout : 'table',
			bodyStyle : 'border:none;width:500;padding:5px;',
			layoutConfig : {
				columns : 4
			},
			items : [{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "上传图片："
						}]
			},{
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "textfield",
							id : "photo",
							value : lampAreaJson == "" ? "" : lampAreaJson.result["photo"]
						}]
			},{
				width : 50,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "button",
							text : "浏览",
							handler : function(){
								showPic();
							}
						}]
			},{
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							html : "<span style='color:red;'>图片大小：500x180像素</span>"
						}]
			}]
		},{
			layout : 'table',
			bodyStyle : 'border:none;width:500;padding:5px;',
			layoutConfig : {
				columns : 2
			},
			items : [{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "展区名称："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "textfield",
							id : "name",
							name : "name",
							allowBlank : false,
							blankText : "请输入展区名称",
							maxLength : 50,
							value : lampAreaJson == "" ? "" : lampAreaJson.result["name"]
						}]
			},{
				width : 80,
				autoHeight : true,
				bodyStyle : "border:none;text-align:right;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "label",
							text : "展位数量："
						}]
			}, {
				width : 150,
				autoHeight : true,
				bodyStyle : "border:none;text-align:left;font-size:12px;min-height:28px;_height:28px",
				items : [{
							xtype : "numberfield",
							id : "num",
							name : "num",
							minValue : 1,
							allowNegative : false,
							allowBlank : false,
							value : lampAreaJson == "" ? "" : lampAreaJson.result["num"]
						}]
			}]
		}]
	});
	addLampArea_win = new Ext.Window({
		title : (type == "add" ? "添加" : "修改") + "展区",
		modal : true,
		width : 480,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs],
		buttons : [{
					text : type == "add" ? "添加" : "修改",
					handler : addOrUpdateLampArea
				}, {
					text : '取消',
					handler : function() {
						addLampArea_win.close();
					}
				}]
	});
	addLampArea_win.show();
}
function showUpdateLampArea(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	Ext.Ajax.request({
		url : url,
		params : {
			type : 5,
			areaId : id
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				areaId = jsondata.result["id"];
				lampAreaJson = jsondata;
				showAddLampArea("update");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//添加或修改活动
function addOrUpdateLampArea(){
	var type = 3;
	var query = "";
	var tips = "添加成功！";
	if(areaId != null && areaId != ""){
		type = 4;
		query += "id~" + areaId +";";
		tips = "修改成功！";
	}
	var photo = Ext.fly("photo").getValue();
	if(photo == ""){
		Ext.MessageBox.alert("提示", "请上传图片。");
		return;
	}
	var name = Ext.fly("name").getValue();
	if(name == ""){
		Ext.MessageBox.alert("提示", "展区名称不能为空。");
		return;
	}
	var num = Ext.fly("num").getValue();
	if(num == ""){
		Ext.MessageBox.alert("提示", "展位数量不能为空。");
		return;
	}
	query += "photo~" + photo + ";";
	query += "name~" + name + ";";
	query += "num~" + num;
	Ext.Ajax.request({
		url : url,
		params : {
			type : type,
			content : query
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				areaId = "";
				Info_Tip(tips);
				addLampArea_win.close();
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//管理展位
function openLampBooth(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	window.parent.createNewWidget("lamp_booth_list", '管理展位', '/module/lamp/lamp_booth_list.jsp?areaId=' + row.get("id") + '&boothNum='+ row.get("num"));
}
//显示修改相片区域
function showPic() {
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.callbackFn = 'upload_callback';
	FileUpload_Ext.initComponent();
}
//上传图片回调函数
function upload_callback() {
	var photo = FileUpload_Ext.callbackMsg;
	Ext.get("photo").dom.value = photo;
}
//删除展区
function delLampArea(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	var id = row.get("id");
	Ext.Msg.confirm("提示", "确定删除该展区吗？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 16,
					content : "areaId~"+id+";isDeleted~1"
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Info_Tip("删除成功。");
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}