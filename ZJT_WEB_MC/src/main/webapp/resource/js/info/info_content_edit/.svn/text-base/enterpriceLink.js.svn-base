
var emp_query_key_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["eid", "企业ID"], ["name", "企业名称"], ["fname", "企业简称"],
					["area", "所在地区"]]
		});
/* 打开关联企业窗口 */
var openEmpWin = function() {
	emp_ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					content : "islock~0",
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					type : 9
				},
				remoteSort : true
			});
	emp_ds.setDefaultSort('createOn', 'DESC');
	var cm = new Ext.grid.CheckboxSelectionModel({});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : emp_ds,
				displayInfo : true
			});
	emp_grid = new Ext.grid.GridPanel({
				store : emp_ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				height : 300,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 100,
							dataIndex : 'name'
						}, {
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [new Ext.form.ComboBox({
									id : 'emp_type',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : emp_type_ds,
									width : 80,
									valueField : "value",
									displayField : "text",
									readOnly : true,
									value : '0'
								}), "-", new Ext.form.ComboBox({
									id : 'emp_query_key',
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : emp_query_key_ds,
									width : 80,
									valueField : "value",
									displayField : 'text',
									readOnly : true,
									value : 'eid'
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchKey",
							width : 150,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchEmpList();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchEmpList
						}],
				bbar : pagetool
			});
	empWin = new Ext.Window({
				title : '企业列表',
				layout : 'fit',
				width : 600,
				height : 360,
				border : false,
				modal : true,
				frame : true,
				labelAlign : 'right',
				closeAction : 'close',
				items : [emp_grid],
				buttons : [{
							text : '确定',
							handler : function() {
								setLinkEmp();
							}
						}, {
							text : '取消',
							handler : function() {
								empWin.close();
							}
						}]
			});
	empWin.show();
	emp_ds.load();
};

/* 设置关联企业 */
var setLinkEmp = function() {
	var row = emp_grid.getSelectionModel().getSelected();
	if (isEmpty(row)) {
		Ext.Msg.alert("提示", "请选择企业");
		return;
	}
	Ext.fly("eid").dom.value = row.get("eid");
	Ext.fly("ename").dom.value = row.get("name");
	empWin.close();
};
/* 搜索企业 */
var searchEmpList = function() {
	var query = Ext.getCmp("emp_query_key").getValue() + "~"
			+ Ext.fly("searchKey").getValue() + ";islock~0";
	if (parseInt(Ext.getCmp("emp_type").getValue()) != 0)
		query += ";type~" + Ext.getCmp("emp_type").getValue();
	emp_ds.baseParams["content"] = query;
	emp_ds.load();
};


// 查看关联企业
function see_eid_link() {
	var tid = Ext.fly("tid").getValue();
	if (tid != "404") {
		Ext.Msg.alert("提示", "只有<font color='red'>企业公告类型</font>的信息才有关联企业!");
		return;
	}

	var info_title = encodeURI(Ext.get("title").dom.value);
	window.parent.createNewWidget("eid_link", '查看关联企业',
			'/module/info/eid_link.jsp?id=' + infoId + '&info_title='
					+ info_title);
}

