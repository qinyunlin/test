package com.concom.soa.application.app.member;

import java.util.Map;

import com.concom.entity.dto.xunjia.app.member.AppMember;
import com.concom.lang.Page;

public interface AppMemberService  {

AppMember member(String memberId);
	
	AppMember getMemberByMobile(String mobile);

	boolean isExist(String memberId);

	boolean isMobileExist(String mobileNumber);
	
	int registerUser(Map<String, Object> params);
	
	int update(AppMember member);
	
	/**
	 * 查询app会员列表
	 * @param page
	 * @return
	 */
	Page<Map<String, Object>> queryPage(Page<Map<String, Object>> page);


	/**
	 * 
	 * 根据会员报价数或者T币数查询排行榜
	 * @param page
	 * @return
	 */
	Page<Map<String, Object>> queryPageMapForBillboard(
			Page<Map<String, Object>> page);

	/**
	 * 单个用户的排名信息
	 * @param memberId
	 * @return
	 */
	Map<String, Object> rankingWithMe(String memberId);

	/**
	 * 计数用户登录次数，时间等
	 * @param username 
	 */
	void loginLog(String username);
	
}
