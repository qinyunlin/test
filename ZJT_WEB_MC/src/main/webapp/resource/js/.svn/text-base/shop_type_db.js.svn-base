//商厂类型
var shop_type=[
	['1', '厂商'], 
	['2', '经销商'], 
	['3', '代理商']
];

//得到商厂类型(包括所有)
function getAllShop_type(){
	var array = [];
 	array.push(['', '所有']);
 	for(var i = 0; i < shop_type.length; i++)
 		array.push([shop_type[i][0],shop_type[i][1]]);
 	return array;
};
//得到商厂类型(不包括所有)
function getShop_type(){
 	var array = [];
 	for(var i = 0; i < shop_type.length; i++)
 		array.push([shop_type[i][0],shop_type[i][1]]);
 	return array;
};
//得到商厂类型名称
function getShop_type_name(v){
	if(!v)
	  return "";
	v=v.replace(/[\s]/g,"");
	for(var i in shop_type){
		if(v == shop_type[i][0])
			return shop_type[i][1];
	}
};