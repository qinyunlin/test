package com.concom.soa.infrastructure.persist.zjt.ask;

import java.util.List;

import com.concom.entity.dto.xunjia.ask.AskPriceLeaderRole;


public interface AskPriceLeaderRoleDao {
	/**
	 * 查询分配询价任务负责角色列表
	 * @return
	 */
	public List<AskPriceLeaderRole> queryList();
	/**
	 * 保存分配询价任务负责角色
	 * @param askPriceLeaderRole
	 * @return
	 */
	public int add(AskPriceLeaderRole askPriceLeaderRole);
	
	/**
	 *  获取所有角色
	 * @return
	 */
	public List<String> get();
	
	public void del();
}
