var tree;
var ds, grid;
var root;

var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
		   id : '0001',
				draggable : false,
				text : '广告分类管理'
					
			});
	tree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/Infoad.do?type=1'
						}),
				root : root,
				renderTo : 'tree',
				border : false,
				animate : true,
				autoScroll : true,
				containerScroll : true
			});

	/* 修改返回的数据 */
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth" || o.state == "nologin") {
				Ext.MessageBox.alert('提示', o.result);
				o = [];
			}
			node.beginUpdate();
			for (var i = 0, len = o.length; i < len; i++) {

				o[i].text = o[i].cname;
				o[i].id = o[i].cata_id;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [node]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	tree.on('click', function(node) {
				node.expand();
				node.select();
				if(node.id == "0001"){
					ds.load();
				}else{
					ds.proxy = new Ext.data.HttpProxy({
									url : '/SearchInfoAd.do?type=6'
								});
					ds.load({
								params:{
									cata_id : node.id
								}
								});
				}
			});

	root.expand();
	root.select();
};
var buildLayout = function() {
	var view = new Ext.Viewport({
				layout : 'border',
				defaults : {
					border : false
				},
				items : [{
							region : 'west',
							width : 180,
							split : true,
							autoScroll : true,
							items : tree
						}, {
							region : 'center',
							layout : 'fit',
							items : grid
						}]
			});
};
var buildGrid = function() {

	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/SearchInfoAd.do?type=1'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'adv_id','cata_id','cname','status','adv_text','weight','add_user','add_time','modify_user','modify_time'])
			});
	ds.load();
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});


	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), cm, {
							header : 'ID',
							sortable : true,
							dataIndex : 'id',
							width : 30
						}, {
							header : '广告ID',
							sortable : true,
							dataIndex : 'adv_id'
						}, {
							header : '广告分类ID',
							sortable : true,
							dataIndex : 'cata_id'
						}, {
							header : '广告名称',
							sortable : true,
							dataIndex : 'cname'
						}, {
							header : '广告状态',
							sortable : true,
							dataIndex : 'status',
							renderer : rederHT
						}, {
							header : '排序权重',
							sortable : true,
							dataIndex : 'weight'
						}, {
							header : '新增人',
							sortable : true,
							width : 100,
							dataIndex : 'add_user'
						}, {
							header : '新增时间',
							sortable : true,
							dataIndex : 'add_time',
							width : 140
							
						}, {
							header : '修改人',
							sortable : true,
							dataIndex : 'modify_user',
							width : 100
							
						}, {
							header : '修改时间',
							width : 140,
							sortable : true,
							dataIndex : 'modify_time'
						}],
				bbar : new Ext.ux.PagingToolbar({
						store : ds,
						displayInfo : true
					}),
				tbar : [],
				renderTo : 'grid'
			});
	
	ds.load({
				params : {
					node : '0'
				}
			});
	var tbar = new Ext.Toolbar({
				id : 'tbar1',
				renderTo : grid.tbar,
				items : [{
							text : '修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								edit();
							}
						} , {
							text : '添加信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								add();
							}
						}, '-', {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : function() {
								del();
							  
							}
						}]
			});
// 右键菜单定义
	grid.addListener('rowcontextmenu', rightClickFn);
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}, {
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : edit
						}, {
							text : '删除',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								del();
							}
						
						}]
			});
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		rightClick1.showAt(e.getXY());
	}
	
	grid.addListener('celldblclick', function(grid, rowIndex, columnIndex, e) {
				if (columnIndex == 7 && !compareAuth("INFO_CONTENT_SORT")) {
					return;
				} else
					edit();
			});
	function rowDblClick(grid, rowIndex, e) {
		edit();
	}

	if (!isEmpty(getCurArgs("link"))) {
		if (!isEmpty(tagsAll)) {
			Ext.fly("tags").dom.value = tagsAll;
			infoStore.baseParams['content'] = 'tags~' + tagsAll;
			infoStore.load();
		}
	}
	
};

function rederHT(value) {
	var html;
	if (value == "1") {
		html = "启动";
	} else {
		html = "关闭";
	}
	return html;
};
//添加广告
function add() {
	var rows = tree.getSelectionModel().getSelectedNode();
	var cataId = rows.attributes.cata_id;	
	if(!cataId||cataId.length<5){
		Ext.Msg.alert("提示", "请选择广告的分类！");
		return;		
	}
	window.parent.createNewWidget("info_Ad_add", '添加信息','/module/info/info_Ad_add.jsp?cataId=' + cataId);
};


//修改
function edit() {
	var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	infoId = rows[0].get("id");
	window.parent.createNewWidget("info_Ad_edit", '修改信息','/module/info/info_Ad_edit.jsp?infoId=' + infoId);
};

var del=function(){
var rows = grid.getSelectionModel().getSelections();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	infoId = rows[0].get("id");
	Ext.Msg.confirm("提示", "您确定要删除该广告吗?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request('post', '/SearchInfoAd.do', {
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,data.result)) {
								Ext.Msg.alert("提示","删除成功!");	
								ds.load();				
							} 
						},
						failure : function() {
							Ext.Msg.alert('警告', '操作失败。');
						}
					}, "id=" + infoId + "&type=3");
		}
		
	});
};
function init() {
	
	buildGrid();
	buildTree();
	buildLayout();
	
	// Ext.TipSelf.msg('提示', '请先选择分类。');
};

Ext.onReady(function() {
			init();
		});



