var wenProvince_sel;
var currUser_mc;
var base_config = {};
var version = "1.0.1";
Ext.onReady(function() {
			init();
			getPersonInfo();
			getAuthCode();
			getPersonConfig_Base(true);
			
		});
function init() {
	buildView();
	buildTree();
};
function buildView() {
	var north = new Ext.Panel({
		region : 'north',
		height : 32,
		// el:"header",
		items : [new Ext.Toolbar({
			height : 30,
			items : [{
				html : '<font style="font-weight:bold;padding-left:16px;">中建普联数据管理系统</font>',
				xtype : 'label'
			}, "->","技术中心服务支持QQ：",{xtype:'label',html:'<a style="font-size: 13px;" href="tencent://message/?uin=1119635616&Site=造价通&" target="_blank">'
+'<img style="border: medium none ;float: right;" src="http://wpa.qq.com/pa?p=1:1119635616:14" title="技术中心服务支持QQ"/>'+
'</a>'},"-", "当前登陆用户：", {
				xtype : "label",
				id : 'cur_user'
			}, {
				html : '&nbsp;&nbsp;&nbsp;&nbsp;',
				xtype : 'label'
			}, {
				text : "退出",
				height : 30,
				width : 30,
				icon : '/resource/images/door_out.png',
				handler : function() {
					exitsys();
				}
			}]
		})]
	});
	var bottom = new Ext.Toolbar({
		id : "bottom",
		border : false,
		frame : true,
		region : "south",
		height : 25,
		items : [

				'->',
				"©2009-2012 <a href='http://www.gdzjt.com'><font color=blue>Zjtcn.com</font></a>　版权所有"
						+ "   &nbsp;&nbsp;内部版本：" + version]

	});
	var center = new Ext.TabPanel({
				id : "center",
				region : 'center',
				deferredRender : false,
				activeTab : 0,
				tabWidth:140,
				resizeTabs : true,
				enableTabScroll : true,
				defaults : {
					autoScroll : true
				},
				plugins : new Ext.ux.TabCloseMenu(),
				items : []
			});
	var west = new Ext.Panel({
				region : 'west',
				id : 'west-panel',
				title : '系统菜单',
				contentEl : "west",
				autoScroll : true,
				split : true,
				width : 160,
				minSize : 175,
				maxSize : 400,
				collapsible : true,
				margins : '0 0 0 5',
				layout : {
					type : 'accordion',
					animate : true
				}
			});
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [north, west, bottom, center]
			});
};