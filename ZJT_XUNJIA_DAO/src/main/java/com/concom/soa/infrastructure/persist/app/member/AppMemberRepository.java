package com.concom.soa.infrastructure.persist.app.member;

import java.util.Map;

import com.concom.entity.dto.xunjia.app.member.AppMember;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisRepository;

public interface AppMemberRepository extends MybatisRepository<String, AppMember> {

	/**
	 * 根据memberId串获取用户信息
	 * @param memberId
	 * @return
	 */
	public AppMember getMemberInfoById(String memberId);

	/**
	 * 
	 * @param map 字段参数
	 * @return
	 */
	public int registerUser(Map<String, Object> map);
	
	
	/**
	 * 查询app会员列表
	 * @param page
	 * @return
	 */
	public Page<Map<String, Object>> queryPageMap(Page<Map<String, Object>> page);
	
	/**
	 * 根据会员id或手机号判断会员是否存在
	 * @param memberid
	 * @return
	 */
	public boolean isExist(Map<String,Object> params);

	public AppMember getByMobile(String mobile);

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
	 * @param param
	 * @return
	 */
	public Map<String, Object> rankingWithMe(Map<String, Object> param);
}
