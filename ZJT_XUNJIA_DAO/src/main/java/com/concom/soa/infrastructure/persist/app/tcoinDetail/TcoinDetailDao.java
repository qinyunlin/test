package com.concom.soa.infrastructure.persist.app.tcoinDetail;

import java.util.Map;

import com.concom.entity.dto.xunjia.app.tcoinDetail.TcoinDetailLog;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisRepository;

public interface TcoinDetailDao  extends MybatisRepository<String, TcoinDetailLog>{

	/**
	 * 根据条件查询通币列表
	 * @param page
	 * @return
	 */
	public Page<Map<String, String>> queryPageMap(Page<Map<String, String>> page);
	
	/**
	 * 根据条件添加通币详情纪录
	 * @param tcoinDetailLog
	 * @return
	 */
	public int addTcoinDetail(TcoinDetailLog tcoinDetailLog);
	
	/**
	 * 查找用户今日是否奖励5T币
	 * @param today
	 * @param type
	 * @param memberId
	 * @return
	 */
	TcoinDetailLog getTcoinDetailLogOfReward(String today, int type, String memberId);
}
