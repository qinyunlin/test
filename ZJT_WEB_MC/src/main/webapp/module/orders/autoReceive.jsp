<%@page import="org.yeeda.costexpress.service.orders.model.OrdersMD5Info"%>
<%@page
	import="org.yeeda.costexpress.service.orders.impl.OrdersCodeUtil"%>
<%@page import="org.yeeda.costexpress.order.recharge.dto.AccountDetail"%>
<%@page import="java.text.DecimalFormat"%>
<%@page import="org.yeeda.costexpress.dto.member.Member"%>
<%@page import="java.util.Date"%>
<%@page import="org.yeeda.costexpress.util.DateUtil"%>
<%@page
	import="org.yeeda.costexpress.service.member.impl.MemberServiceImpl"%>
<%@page import="org.yeeda.costexpress.service.member.MemberService"%>
<%@page
	import="org.yeeda.costexpress.order.recharge.service.impl.RechargeOrderServiceImpl"%>
<%@page
	import="org.yeeda.costexpress.order.recharge.service.RechargeOrderService"%>
<%@page import="org.yeeda.costexpress.order.recharge.dto.RechargeOrder"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<%@page import="org.apache.log4j.Logger"%>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<jsp:useBean id="MD5" scope="request" class="beartool.MD5" />
<%
	//****************************************	// MD5密钥要跟订单提交页相同，如Send.asp里的 key = "test" ,修改""号内 test 为您的密钥
	// 如果您还没有设置MD5密钥请登陆我们为您提供商户后台，地址：https://merchant3.chinabank.com.cn/
	//String key = "test"; // 登陆后在上面的导航栏里可能找到“B2C”，在二级导航栏里有“MD5密钥设置”
							// 建议您设置一个16位以上的密钥或更高，密钥最多64位，但设置16位已经足够了
							//****************************************
	String key = OrdersMD5Info.MD5KEY;

	//获取参数
	String v_oid = request.getParameter("v_oid"); // 订单号
	String v_pmode = request.getParameter("v_pmode"); // 支付方式中文说明，如"中行长城信用卡"
	String v_pstatus = request.getParameter("v_pstatus"); // 支付结果，20支付完成；30支付失败；
	String v_pstring = request.getParameter("v_pstring"); // 对支付结果的说明，成功时（v_pstatus=20）为"支付成功"，支付失败时（v_pstatus=30）为"支付失败"
	String v_amount = request.getParameter("v_amount"); // 订单实际支付金额
	String v_moneytype = request.getParameter("v_moneytype"); // 币种
	String v_md5str = request.getParameter("v_md5str"); // MD5校验码
	String remark1 = request.getParameter("remark1"); // 备注1
	String remark2 = request.getParameter("remark2"); // 备注2

	String text = v_oid + v_pstatus + v_amount + v_moneytype + key; //拼凑加密串
	String v_md5text = MD5.getMD5ofStr(text).toUpperCase();

	Logger logger = Logger.getLogger("autoReceive.jsp");
	String resultSucURL = "http://" + request.getServerName()
			+ "/module/payment/recharge_suc.jsp?code=" + v_oid;
	String resultFailURL = "http://" + request.getServerName()
			+ "/module/payment/recharge_fail.jsp?code=" + v_oid;
	String resultURL = resultFailURL;
	// 套餐组业务实现类
	RechargeOrderService rOrderService = new RechargeOrderServiceImpl();
	System.out.println("****************autoReceive***********************");
	if (v_md5text.equals(v_md5str)) {
		out.print("ok"); // 告诉服务器验证通过,停止发送
		if ("20".equals(v_pstatus)) {
			// 会员业务实现类
			MemberService memberService = new MemberServiceImpl();
			// 数字格式化
			DecimalFormat df = new DecimalFormat("#0.00");
			// 检查用户登录
			User user = (User) request.getSession()
					.getAttribute("user");
			if (user == null) {
				logger.error(String.format("钱包[%s]充值失败，用户session获取异常。",
						v_oid));
				resultURL = resultFailURL;
			} else if (ParameterUtil.isEmpty(v_oid)) {
				logger.error(String.format("订单[%s]开通失败，参数中的订单号为空。",
						v_oid));
				resultURL = resultFailURL;
			}

			RechargeOrder rechargeOrder = rOrderService
					.getRechargeOrderByCondition(" tRechargeOrders.code = '"
							+ v_oid + "'");
			if (rechargeOrder == null) {
				logger.error(String.format("订单[%s]无对应的充值记录。", v_oid));
				resultURL = resultFailURL;
			}
			//订单支付成功，则不进行重复进行账户明细插入等操作
			if ("0".equals(rechargeOrder.getOrderStatus())){
				//更新充值订单状态，更新会员余额以及添加对应的账户明细
				String orderStatus = rechargeOrder.getOrderStatus();
				String timeOn = DateUtil.formatDate(new Date(),
						"yyyy-MM-dd HH:mm:ss");
				// 1.更新充值订单状态
				RechargeOrder updateRechargeOrder = new RechargeOrder();
				updateRechargeOrder.setOrderStatus("1");
				updateRechargeOrder.setPaymentOn(timeOn);
				// 更新：付款成功
				rOrderService.updateRechargeOrder(
						updateRechargeOrder,
						" tRechargeOrders.code = '"
								+ rechargeOrder.getCode() + "'");

				// 2.获取当前账户信息,更新账户余额
				Member member = memberService.get(user.getUid());
				if (member == null) {
					logger.error(String.format("无对应[%s]的会员记录。",
							user.getUid()));
				}
				Member updateMember = new Member();
				Double currAccountBalance = Double.parseDouble(member
						.getAccountBalance())
						+ Double.parseDouble(rechargeOrder.getMoney());
				updateMember.setAccountBalance(df
						.format(currAccountBalance) + "");
				updateMember.setUpdateOn(timeOn);
				updateMember.setUpdateBy(user.getUid());
				// 更新会员
				memberService.updateMember(user.getUid(), updateMember);
				// 3.插入账户明细记录
				AccountDetail accountDetail = new AccountDetail();
				String currAutoCode = OrdersCodeUtil
						.generatedOrderCode("ZH");
				accountDetail.setCode(currAutoCode);
				accountDetail.setCreateBy(user.getUid());
				accountDetail.setCreateOn(timeOn);
				accountDetail.setFloatAmount(rechargeOrder.getMoney());
				accountDetail.setAccountBalance(updateMember
						.getAccountBalance());
				accountDetail.setMemberId(user.getUid());
				accountDetail.setNote("充值");
				accountDetail.setStatus("0");
				accountDetail.setType("0");
				// 添加账户明细
				rOrderService.addAccountDetail(accountDetail);
			}
			//跳转到成功提示页面
			//resultURL = resultSucURL;
		} else {
			logger.error(String.format("钱包[%s]充值失败，订单支付不成功。", v_oid));
			resultURL = resultFailURL;
		}
	} else {
		out.print("error");
		logger.error(String.format(
				"钱包[%s]充值失败，银行加密数据[%s]与系统加密数据[%s]不匹配", v_oid, v_md5str,
				v_md5text));
		//resultURL = resultFailURL;
		/* RechargeOrder rechargeOrder = rOrderService
				.getRechargeOrderByCondition(" tRechargeOrders.code = '"
						+ v_oid + "'");
		if (rechargeOrder == null) {
			logger.error(String.format("订单[%s]无对应的充值记录。", v_oid));
		}else{
			RechargeOrder updateRechargeOrder = new RechargeOrder();
			updateRechargeOrder.setOrderStatus("0");
			updateRechargeOrder.setPaymentOn(DateUtil.formatDate(new Date(),
					"yyyy-MM-dd HH:mm:ss"));
			// 更新：未付款
			rOrderService.updateRechargeOrder(
					updateRechargeOrder,
					" tRechargeOrders.code = '"
							+ rechargeOrder.getCode() + "'");
		} */
	}
%>

<!-- 校验完成之后，跳转到结果显示页面 -->
<%
	//System.out.println(resultURL);
	//response.sendRedirect(resultURL);
%>