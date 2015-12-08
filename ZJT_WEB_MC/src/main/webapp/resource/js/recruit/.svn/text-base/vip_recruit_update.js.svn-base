
var itSel;
var form;
var dd;
var ds;
var id;
var ddArr = [];
var dsArr = [];

Ext.onReady(function(){

    $.fck.config = {
        path: '/resource/plugins/FCKeditor/',
        height: 300,
        width: 750,
        toolbar: 'MCZJTCN'
    };
    
    //创建表单
    createFormPanel();
    
    $('#procurementdetail').fck();
    
    //初始化修改
    initFormValue();
    
});

//初始化修改值
function initFormValue(){
    id = getCurArgs("id");
    if (id == null || id == "") {
        Ext.Msg.alert("请求的数据不存在");
        return;
    }
    
    //Ajax取得记录
    Ext.Ajax.request({
        url: '/mc/RecruitServlet',
        params: {
            type: 5,
            id: id
        },
        success: function(response){
            var json = eval("(" + response.responseText + ")");
            if (getState(json.state, commonResultFunc, json.result)) {
                var re = json.result;
                form1.form.setValues(re);
                Ext.get("title").dom.value = re.title;
                Ext.get("startTime").dom.value = re.startTime.slice(0, 10);
                Ext.get("endTime").dom.value = re.endTime.slice(0, 10);
                Ext.get("orderCode").dom.value = re.orderCode;
                Ext.getCmp("requirement").setValue(re.requirement);
                Ext.getCmp("areas").setValue(re.areas);
                //设置采购范围(可选与已选中)
                var procurementrange = re.cgcid;
                var arr_cgCid_db = cgCid_db;
                if(procurementrange != null && procurementrange.length > 0){
                	itemsArrSelected = procurementrange.split(new RegExp("\\,"));//已选
                    var arr;
                    //设置已选
                    for (var i = 0; i < itemsArrSelected.length; i++) {
                        var id = itemsArrSelected[i];
                        var v_pid = getPidByCgCid(id);
                        var v_cgCids = arr_cgCid_db[v_pid];
                        for(var j=0; j<v_cgCids.length; j++){
                        	if(v_cgCids[j][0] == id){
                        		arr = new Array();
                        		arr.push(id);
                        		arr.push(v_cgCids[j][1]);
                        		ddArr.push(arr);
                        	}
                        }
                      //过滤已选
                        for (var j = 1; j <= 5; j++) {
                        	for(var k = 0; k < arr_cgCid_db[j].length; k++){
                        		if (id == arr_cgCid_db[j][k][0]) {
                        			arr_cgCid_db[j].splice(k, 1);
                        			break;
                        		}
                            }
                        }
                    }
                }
                //设置可选
                var arrSelected = "";
                for(var i=1; i<=5; i++){
                	for(var j=0; j<arr_cgCid_db[i].length; j++){
                		arrSelected = new Array();
                        arrSelected.push(arr_cgCid_db[i][j][0]);
                        arrSelected.push(arr_cgCid_db[i][j][1]);
                        dsArr.push(arrSelected);
                	}
            	}
                ds.load(dsArr);
                dd.load(ddArr);
            }
        },
        failure: function(){
            Warn_Tip();
        }
    });
    
}




//创建表单
function createFormPanel(){

    var title = new Ext.form.TextField({
        id: 'title',
        fieldLabel: '招募主题',
        allowBlank: false,
        maxLength: 200,
        minLength: 2,
        width: 300
    });
    var startTime = new Ext.form.DateField({
        id: 'startTime',
        fieldLabel: '开始时间',
        width: 130,
        format: 'Y-m-d'
    });
    var endTime = new Ext.form.DateField({
        id: 'endTime',
        fieldLabel: '结束时间',
        width: 130,
        format: 'Y-m-d'
    });
    var orderCode = new Ext.form.TextField({
		id:'orderCode',
		fieldLabel:'序列号',
		maxLength:100,
		minLength:0,
		width:130,
	});
    
    //设置可选范围
    ds = new Ext.data.ArrayStore({
        data: [],
        fields: ['value', 'text'],
        proxy: new Ext.data.MemoryProxy(dsArr)//必须定义代理,用于赋值
    });
    
    dd = new Ext.data.ArrayStore({
        data: [],
        fields: ['value', 'text'],
        proxy: new Ext.data.MemoryProxy(ddArr)//必须定义代理,用于赋值
    });
    
    
    
    itSel = new Ext.ux.ItemSelector({
        xtype: 'itemselector',
        name: 'itemselector',
        fieldLabel: '采购范围',
        imagePath: 'http://mc.zjtcn.com/ext/resource/images/default/multiselect/',//图片位置
        multiselects: [{
            width: 250,
            height: 200,
            store: ds,
            displayField: 'text',
            valueField: 'value',
            legend: '可选择范围',
            allowBlank: false
        }, {
            id: 'selectedTypes',
            width: 250,
            height: 200,
            store: dd,
            displayField: 'text',
            valueField: 'value',
            legend: '已选择范围',
            allowBlank: false
        }]
    });
    
    
    var requirement = new Ext.form.TextArea({
        id: 'requirement',
        width: 750,
        height: 200,
        fieldLabel: '招募要求',
        allowBlank: false
    });
    
    var areas = new Ext.form.TextArea({
        id: 'areas',
        width: 750,
        height: 200,
        fieldLabel: '招募地区',
        allowBlank: false
    });
    
    var producementDetail = new Ext.form.TextArea({
        id: 'procurementdetail',
        fieldLabel: '采购清单',
        allowBlank: false,
        width: 750,
        height: 300
    });
    
    Ext.QuickTips.init();
    
    //创建表单，添加元素
    form1 = new Ext.form.FormPanel({
        defaultType: 'textfield',
        labelAlign: 'right',
        labelWidth: 80,
        frame: true,
        width: 800,
        buttonAlign: 'left',
        items: [{
            xtype: 'fieldset',
            width: 750,
            layout: 'form',
            title: '名称与有效日期',
            items: [title, startTime, endTime,orderCode]
        }, {
            xtype: 'fieldset',
            width: 750,
            layout: 'table',
            title: '采购范围',
            items: [itSel]
        }, {
            xtype: 'fieldset',
            width: 750,
            layout: 'table',
            title: '招募要求',
            items: [requirement]
        },{
            xtype: 'fieldset',
            width: 750,
            layout: 'table',
            title: '招募地区',
            items: [areas]
        }, {
            xtype: 'fieldset',
            width: 750,
            layout: 'table',
            title: '采购分类',
            items: [producementDetail]
        }],
        buttons: [{
//            text: '修改并审核',
            text: '修改',
            handler: auditRecruit
        }]
    });
    var panel = new Ext.Panel({
        border: false,
        frame: true,
        layout: 'form',
        renderTo: 'form',
        items: form1
    });
}


//修改并审核
function auditRecruit(){
    if (!form1.getForm().isValid()) {
        Ext.Msg.alert("提示", "请按照要求填写内容");
        return;
    }
//    Ext.Msg.confirm("修改并审核提交", "提交后会审核该招募，是否确认要提交?", function(info){
    Ext.Msg.confirm("修改提交", "是否确认要提交?", function(info){
        if (info == "yes") {
            var recruitId = id;
            var title = Ext.fly("title").getValue();
            var startTime = Ext.fly("startTime").getValue();
            var endTime = Ext.fly("endTime").getValue();
            var requirement = Ext.fly("requirement").getValue();
            var procurementdetail = $.fck.content('procurementdetail', '');
            var procurementrange = itSel.getValue();
			var code = Ext.fly("orderCode").getValue();
			var areas = Ext.fly("areas").getValue();
            var data = [];
            data["content"] = "id~" + recruitId + ";title~" + title + ";startTime~" +
            startTime +
            ";endTime~" +
            endTime +";orderCode~"+code;
            Ext.Ajax.request({
                url: '/mc/RecruitServlet',
                params: {
                    type: 7,
                    id: id,
                    content: data["content"],
					procurementdetail:procurementdetail,
					requirement:requirement,
					areas:areas,
					cgcid:procurementrange
                },
                success: function(response){
                    var json = eval("(" + response.responseText + ")");
                    if (getState(json.state, commonResultFunc, json.result)) {
                    	
                    	Ext.Ajax.request({
                			method : 'post',
                			url : "/TemplateHtml.do?type=10",
                			params : {
                				id : id.toString(),
                				regType : 1
                			},
                			success : function(response) {
                				var data = eval("(" + response.responseText + ")");
                				if (getState(data.state, commonResultFunc, data.result)) {
                					Info_Tip("修改成功！");
//                					 Ext.Ajax.request({
//                    					method : 'post',
//                    					url : "/TemplateHtml.do?type=13",
//                    					params : {
//                    						regType : 1
//                    					},
//                    					success : function(response) {
//                    						var data = eval("(" + response.responseText + ")");
//                    						if (getState(data.state, commonResultFunc, data.result)) {
//                    							Info_Tip("修改审核成功并生成对应供应商招募专题页面和列表页面");
//                    							 closeWin();
//                    						} else {
//                    							 Info_Tip("修改审核成功并生成对应供应商招募专题页面和列表页面失败！");
//                    						}
//                    					}
//                    				});	
                					
                				} else {
//                					 Info_Tip("修改审核成功但生成供应商招募页面失败！");
                					Info_Tip("修改失败！");
                				}
                				
                				
                			}
                		});	
                    }
                },
                failure: function(){
                    Warn_Tip();
                }
            });
        }
    });
}

function closeWin(){
    window.parent.Ext.getCmp('center').remove("vip_recruit_update")
}

