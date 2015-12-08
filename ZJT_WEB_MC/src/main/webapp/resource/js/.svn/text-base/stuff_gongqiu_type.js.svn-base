//供求类型
var stuff_type = [
	['1', '建材产品'],
	['2', '二手产品'],
	['3', '机械租赁'],
	['4', '周转材料'],
	['5', '其它']
];

//ext-store-data用到(包括所有) 数据格式['value','text']
function getAllStuff_type(){
	var array = [];
	array.push(['', '所有']);
	if (stuff_type != null) {
		for (i = 0; i < stuff_type.length; i++) {
			array.push(stuff_type[i]);
		}
	}
	return array;
};

//根据编码得到名称
function getStuff_type_name(v){
	if(!v)
	  return "";
	v=v.replace(/[\s]/g,"");
	for(var i in stuff_type){
		if(v == stuff_type[i][0])
			return stuff_type[i][1];
	}
};