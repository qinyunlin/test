<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<link type="text/css" rel="stylesheet"
	href="http://common.zjtcn.com/css/common/common.css" />
<link type="text/css" rel="stylesheet"
	href="http://common.zjtcn.com/css/common/zjtcn.css" />
<script type="text/javascript" src="/resource/js/common/select.js"></script>
<script type="text/javascript" src="http://common.zjtcn.com/js/common/zhcn_select.js"></script>
<script type="text/javascript" src="http://common.zjtcn.com/js/common//js/zjt/commonJS/zhcn_db_gov.js"></script>
<script type="text/javascript" src="http://common.zjtcn.com/js/common/jquery.cookie.js"></script>
<%
	String url = request.getRequestURI();
	String[] arrays;
	arrays = url.split("/");
	String prefix = "/module/";
	String decss = "menu_other1";
	String cucss = "menu_first1";
	String module = "index";
	String from = (String) request.getAttribute("from");
	if(from==null)
		from="";
	if (url.indexOf(prefix + "gov/") != -1
			|| from.indexOf(prefix + "gov/") != -1) {
		module = "gov";
	} else if (url.indexOf(prefix + "news/") != -1
			|| from.indexOf(prefix + "news/") != -1) {
		module = "news";
	} else if (url.indexOf(prefix + "fac/") != -1
			|| from.indexOf(prefix + "fac/") != -1) {
		module = "fac";
	} else if (url.indexOf(prefix + "ration/") != -1
			|| from.indexOf(prefix + "ration/") != -1) {
		module = "ration";
	} else if (url.indexOf(prefix + "ask/") != -1
			|| from.indexOf(prefix + "ask/") != -1) {
		module = "ask";
	} else {
		module = "index";
	}
	
%>

<div style="height: 25px; width: 100%;">
	<div id="zjtcn_user_info">
		<div id="zjtcn_login_area">
			<div id="zjtcn_login_info">
				<div class="not_login">

				</div>
				<div id="user_info"></div>
			</div>
			<div id="zjtcn_login_common">
				<ul>
					<li>
						<a href="/module/help/help_flash/help_flash.html" style="color: #676767;">帮助中心</a>
					</li>
					<li class="line"></li>
					<li>
						<a href="javascript:void(0)" onClick="setFavorite()"
							style="color: #676767;">加入收藏</a>
					</li>
					<!-- <li class="line"></li>
					<li>
						<a href="javascript:void(0)" onClick="setHomepage()"
							style="color: #676767;">设为首页</a>
					</li> -->
				</ul>
				<div class="clearing"></div>
			</div>
			<div class="clearing"></div>
		</div>
	</div>
</div>
<div class="clearing"></div>
<div id="zjtcn_header">
	<div class="main" style="margin: 18px auto 12px;" id="main_head">
		<div id="zjtcn_image">
			<a href="/"> <img height="64" width="198"
					src="http://common.zjtcn.com/images/mc/zjt.jpg"> </a>
		</div>
		<div id="zjtcn_module_index">
			<div id="head" style="height: 25px; left: 0;">
				<div
					style="float: left; overflow: hidden; width: 450px; height: 25px; text-align: left;">
					<div class="head_list">
						<div class="other first" style="float: left;" id="gov">
							<div class="center">
								<div class="left">
									<div class="right strong">
										<span class="gov_gov" style="font-size: 14px;" onclick="showArea()">信息价</span>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="other" style="float: left;" id="ask">
							<div class="center">
								<div class="left1">
									<div class="right strong">
										<span class="ask_ask" style="font-size: 14px;" onclick="hideArea()">材料价格</span>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="other" style="float: left; padding: 0 7px;" id="fac">
							<div class="center">
								<div class="left">
									<div class="right strong">
										<span class="fac_fac" style="position: relative; font-size: 14px;" onclick="hideArea()">材料供应商</span>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>
						<div class="other" style="float: left; padding: 0 7px;"
							id="ration">
							<div class="center">
								<div class="left">
									<div class="right strong">
										<span class="ration_ration" style="position: relative; font-size: 14px;" onclick="hideArea()">定额材机库</span>
									</div>
								</div>
							</div>
						</div>

						<div class="clearing"></div>
					</div>
					<div class="clearing"></div>
				</div>

				<div class="clearing"></div>
			</div>

			<div id="search_area">
				<div class="search_left">
					<div class="search_right">
						<label id="top_label" for="search_key" class="top_label" onClick="clear_label(this)"></label>
						<input type="text" name="lable"	id="search_key" />
						<div class="search_select">
							<div class="area_name">地区：</div>
							<select id="search_gov_area">
							</select>
						</div>
						<div class="search">
							<span class="search_l strong" onClick="search_input()">搜&nbsp;&nbsp;&nbsp;&nbsp;索</span>
						</div>
					</div>
				</div>
			</div>
			<div class="clearing"></div>
		</div>
		<div class="clearing"></div>
	</div>

	<div class="main">


		<div id="menu" style="left: 0;">
			<div class="banner_center">
				<div class="banner_left">
					<div class="banner_right">

						<div
							class='<%=module.equals("index") ? cucss : decss%> menu_module '
							id="index_module">
							<div class="banner_title"
								style="line-height: 35px; position: relative; bottom: 0; height: 35px; _width: 60px;">
								<div class="center">
									<div class="left">
										<div class="right">
											<span class="font strong"
												onClick="window.open('/','_self')">首页</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>

						<div class="<%=module.equals("gov") ? cucss : decss%> menu_module "
							id="gov_module">
							<div class="banner_title"
								style="line-height: 35px; position: relative; bottom: 0; height: 35px; _width: 75px;">
								<div class="center">
									<div class="left">
										<div class="right">
											<span class="font strong"
												onClick="window.open('/module/gov/','_self')">信息价</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>

						<div class="<%=module.equals("fac") ? cucss : decss%> menu_module "
							id="fac_module">
							<div class="banner_title"
								style="line-height: 35px; position: relative; bottom: 0; height: 35px; _width: 105px;">
								<div class="center">
									<div class="left">
										<div class="right">
											<span class="font strong"
												onClick="window.open('/module/fac/','_self')">
												供应商报价</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>

						<div class="<%=module.equals("ask") ? cucss : decss%> menu_module "
							id="ask_module">
							<div class="banner_title"
								style="line-height: 35px; position: relative; bottom: 0; height: 35px; _width: 90px;">
								<div class="center">
									<div class="left">
										<div class="right strong">
											<span class="font strong"
												onClick="window.open('/module/ask/','_self')">询价服务</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>

						<div
							class="<%=module.equals("ration") ? cucss : decss%> menu_module "
							id="ration_module">
							<div class="banner_title"
								style="line-height: 35px; position: relative; bottom: 0; height: 35px; _width: 105px;">
								<div class="center">
									<div class="left">
										<div class="right strong">
											<span class="font strong"
												onClick="window.open('/module/ration/ration_list.html','_self')">定额材机库</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="line"></div>

						<div class="menu_module <%=decss%>" id="acc_module"
							style="display: none">
							<div class="banner_title"
								style="line-height: 35px; position: relative; bottom: 0; height: 35px; _width: 90px;">
								<div class="center">
									<div class="left">
										<div class="right">
											<span class="font strong" onClick="window.open('','_self')">园林专题</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="line" style="display: none"></div>

					</div>
				</div>
			</div>
		</div>



		<div id="gdfz">
			<div class="center">
				<div class="left">
					<div class="right">
						<div class="gdfz_left strong">
							各地分站：
						</div>
						<div class="gdfz_right" style="_z-index: 100;">
							<ul>
								<li class="point">
									<A href="http://gd.zjtcn.com" style="color: #4C4C4C;"
										target="_blank">广东</A>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="http://www.szzjt.com.cn" style="color: #4C4C4C;"
										target="_blank">深圳</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<A href="http://www.gxzjt.com" style="color: #4C4C4C;"
										target="_blank">广西</A>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">福建</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">海南</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">湖南</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">江西</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">湖北</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">河南</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">浙江</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">安徽</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">上海</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">江苏</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">山东</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="http://tj.zjtcn.com" style="color: #4C4C4C;"
										target="_blank">天津</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">河北</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">山西</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">北京</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">内蒙古</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/gov/gov_list.html?webarea=哈尔滨市&webcounty=哈尔滨市&pro=黑龙江" style="color: #4C4C4C;"
										target="_blank">黑龙江</a>
								</li>
								<li class="point"  style="padding-left:73px;padding-left:71px\9;_padding-left:73px;">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">辽宁</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">吉林</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="http://www.sczjt.com" style="color: #4C4C4C;"
										target="_blank">四川</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">重庆</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">云南</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">贵州</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">陕西</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">甘肃</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">宁夏</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">西藏</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">新疆</a>
								</li>
								<li class="line"></li>
								<li class="point">
									<a href="/module/ask/" style="color: #4C4C4C;"
										target="_blank">青海</a>
								</li>
								<li class="line"></li>
								
								
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script>

// 初始化设置menu背景
//function set_menu(type) {
//	$(".menu_first").removeClass("menu_first").add("menu_other");
//	$("#" + type + "_module").removeClass("menu_other").addClass("menu_first");
//};
// 根据url的值来设置白色栏目
//function getTypeUrl() {
//	var type = window.location.href;
//	type = type.split("/")[4];
//	if (type){
//		if(type=="news"){
//			type = "index";
//		}
//		return type;
//	}
//	else
//		return "index";
//};
//set_menu(getTypeUrl());	
</script>
<iframe id="menuframe" src="#"
	style="width: 1px; height: 1px; position: absolute; left: 0; top: 0; display: none; z-index: 99"></iframe>
<div id="menudiv"
	style="width: 1px; height: 1px; position: absolute; left: 0; top: 0; background-color: #FFFFFF; display: none; z-index: 100"></div>
<script type="text/javascript" src="/resource/js/common/header.js"></script>
