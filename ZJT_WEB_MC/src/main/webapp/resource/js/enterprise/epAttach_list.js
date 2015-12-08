Ext.onReady(init);
var ds, grid;
var win, keepWin, form;
var zhcn = new Zhcn_Select();

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
	ds.load();
};

var query_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["tEpAttach.filename", "标题"], ["tEpAttach.eid", "企业ID"]]
});

function buildGrid() {
	var rightClick = new Ext.menu.Menu({
				id : 'rightClick',
				items : [{
							text : '查看/修改',
							hidden : compareAuth('CORP_SHOP_EPATTACH_VIEW') && compareAuth('CORP_SHOP_EPATTACH_EDIT'),
							handler : showDetail
						}]
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpAttachServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', "eid", "filename", "description",
								"createOn", "createBy", "updateOn","ename"]),
				baseParams : {
					pageNo : 1,
					type : 7,
					pageSize : 20,
					cid : 1
				},
				countUrl : '/ep/EpAttachServlet',
				countParams : {
					type : 8
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm,{
							header : 'ID',
							sortable : true,
							width : 60,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '标题',
							sortable : true,
							width : 200,
							dataIndex : 'filename'
						}, {
							header : '企业ID',
							sortable : true,
							width : 80,
							dataIndex : 'eid'
						}, {
							header : '企业名称',
							sortable : true,
							width : 200,
							dataIndex : 'ename'
						}, {
							header : '文件描述',
							sortable : false,
							width : 200,
							dataIndex : 'description'
						},{
							header : '创建人',
							sortable : true,
							width : 50,
							dataIndex : "createBy"
						},{
							header : '创建时间',
							sortable : false,
							width : 120,
							dataIndex : 'createOn'
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [{
							id : 'rMenu1',
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('CORP_SHOP_EPATTACH_VIEW') && compareAuth('CORP_SHOP_EPATTACH_EDIT'),
							handler : showDetail
						},{
							id : 'suc_upload',
							text : '上传',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("CORP_SHOP_EPATTACH_UPLOAD"),
							handler : uploadSucCase
						}]
			});
			
	
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
					xtype : "combo",
					id : 'query_key',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 100,
					editable : false,
					store : query_ds,
					value : "tEpAttach.filename"
				}, {
					xtype : "textfield",
					id : "query_input",
					fieldLabel : "关键字",
					width : 100,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-", {
					text : "查询",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	
};

// 搜索
function searchlist() {
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.getCmp("query_input").getValue();
	var content = query_key + "~" + query_value + ";";
	ds.baseParams['content'] = content;
	ds.load();
};


/**
 * 上传图片回调函数
 */
function up_file_back(){
	checkEid(FileUpload_Ext.callbackMsg);
}

/**
 * 校验eid是否存在，不存在，则需要删除对应的图片
 * @param eid
 */
function checkEid(eids){
	Ext.Ajax.request({
		url:'/InfoContent.do?type=29',
		method:'POST',
		params:{
			type:'23',
			eids:eids
		},
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				if ("suc" == data.result){
					//企业id校验成功，则批量增加成功案例
					addInfo(eids);
				}else{
					var pics = data.result;
					var picPaths = pics.split("-")[0];
					var existEids = pics.split("-")[1];
					deletePic(picPaths,existEids);
				}
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}


var curr_existEids = '';
/**
 * 删除无效企业
 * @param pics
 */
function deletePic(picPaths,existEids){
	curr_existEids = existEids;
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestId = picPaths;
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.requestMethod = "/file/DeleteFile";
	FileUpload_Ext.fileType = /./;
	FileUpload_Ext.callbackFn = "deleteResult";
	FileUpload_Ext.showFlag = false;
	//FileUpload_Ext.initComponent();
	//FileUpload_Ext.upload_win.hide();//只需要删除服务器无效图片，无需用到上传控件，这里隐藏
	FileUpload_Ext.submitAction();//自动提交
}

/**
 * 删除图片回调函数
 */
function deleteResult(){
	Info_Tip(curr_existEids + "对应的供应商不存在！");
}

/**
 * 添加荣誉资质信息
 * @param msg
 */
function addInfo(msg){
	Ext.Ajax.request({
		url:'/InfoContent.do?type=30',
		method:'POST',
		params:{
			eids:msg,
			nodePath : "epAttach"
		},
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				Info_Tip("上传成功！");
				FileUpload_Ext.upload_win.close();
				ds.load();
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}


/**
 * 上传荣誉资质(zip格式的图片压缩包)
 */
function uploadSucCase(){
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.requestMethod = "/file/AjaxUpload";
	FileUpload_Ext.fileType = /zip/;
	FileUpload_Ext.callbackFn = "up_file_back";
	FileUpload_Ext.showFlag = false;
	FileUpload_Ext.initComponent("&nbsp;&nbsp;&nbsp;(上传格式为zip压缩包格式，所含图片类型：JPG,JPEG,PNG,GIF格式，尺寸400*200像素；图片命名规则\"案例名称-企业ID\"，例：帝王体育馆成功案例-CCF0034452)");
}

function showDetail(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个商铺");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("epAttach_detail", '查看/修改',
			'/module/enterprise/epAttach_detail.jsp?id=' + row.get("id") + "&eid=" + row.get("eid"));
}