Ext.onReady(init);
function init() {
	buildGrid();
};
var ds, grid, query_type, ds2, grid2;

// 右键菜单
//var rightClick = new Ext.menu.Menu({
//			id : 'rightClickCont',
//			shadom : false,
//			items : [{
//						id : 'rMenu1',
//						text : '查看供应商报价',
//						hidden : compareAuth("FAC_VIEW"),
//						handler : function() {
//							openInfo(1);
//						}
//					}, {
//						text : '上传材料',
//						hidden : compareAuth('FAC_UPLOAD'),
//						handler : showUpArea
//					}]
//		});

function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/AdvSearchMaterial.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "fid", "fname", "unit", "pricem", "spec", "addr", "createOn"]),
				baseParams : {
					type : 'all_materials',
					page : 1,
					pageSize : 20,
					content:"",
					by:"createOn DESC"
				},
				countUrl : '/CountMaterial.do',
				countParams : {
					type : "all_materials"
				},
				remoteSort : true
			});
	
	var ds_type = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : [['specialoffer', '特价建材'], ['hot', '热销材料'], ['space', '促销专场']]
			});
	
	
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				sm : cm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : '厂商ID',
							sortable : false,
							dataIndex : 'fid'
						},{
							header : '厂商名称',
							sortable : false,
							dataIndex : 'fname'
						}, {
							header : '材料ID',
							sortable : false,
							dataIndex : 'id'
						}, {
							header : '材料名称',
							sortable : false,
							dataIndex : 'name'
						}, {
							header : '材料价格',
							sortable : false,
							dataIndex : 'pricem'
						}, {
							header : '规格',
							sortable : true,
							dataIndex : 'spec'
						}, {
							header : '产地',
							sortable : false,
							dataIndex : 'addr'
						},{
							header : '发布时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				renderTo : 'mat_grid',
				bbar : pagetool,
				tbar : [{
							text : '删 除',
							hidden : compareAuth('WCW_MATERIALS_DELETE'),
							handler : function(){
								delMaterialFromWcw();
							},
							icon : '/resource/images/delete.gif'
						},'-']
			});
			
			
			
			var bar2 = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [query_type = new Ext.form.ComboBox({
									id : 'query_type',
									store : ds_type,
									mode : "local",
									triggerAction : "all",
									valueField : "value",
									displayField : "text",
									readOnly : true,
									value:'specialoffer'
						}),'-', {
							text : '材料ID：',
							xtype : 'label'
						}, {
							xtype : 'textfield',
							id : 'mat_id',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						},'-',{
							text : '材料名称：',
							xtype : 'label'
						}, {
							xtype : 'textfield',
							id : 'mat_name',
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							text : '查询',
							icon : '/resource/images/zoom.png',
							handler : searchlist
						}]

			});
	
};

function searchlist() {
	var opt = query_type.getValue();
	var id = Ext.fly('mat_id').getValue();
	var name = Ext.fly('mat_name').getValue();
	var content = "";
	
	content += "opt~" + opt + ";";
	if(id.trim() != '' && id.match('[1-9]')){
		content += "id~" + id + ";";
	}
	if(name.trim() != ''){
		content += "name~"+name +";";
	}
	ds.baseParams['content'] = content;
	ds.load();

};

function delMaterialFromWcw(){
	var rows = grid.getSelectionModel().getSelections();
	var opt = query_type.getValue();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	
	if(ids.length <= 0){
		Ext.MessageBox.alert("提示", "请选择至少一条记录。");
		return;
	}
	
	Ext.MessageBox.confirm("提示", "确定将所选材料删除吗？", function(op) {
			if (op == "yes") {
 				Ext.lib.Ajax.request("post", "/FacMaterial.do", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("操作成功。");
							ids = [];
							ds.reload();
						}
					},
					failure : function(response) {
						Warn_Tip();
					}
				}, "type=20&ids=" + ids.toString() + "&opt=" + opt);
			}
		});
}



