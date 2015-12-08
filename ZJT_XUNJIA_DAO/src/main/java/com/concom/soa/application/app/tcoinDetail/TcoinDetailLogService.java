package com.concom.soa.application.app.tcoinDetail;


import java.util.Map;

import com.concom.entity.dto.xunjia.app.tcoinDetail.TcoinDetailLog;
import com.concom.lang.Page;

public interface TcoinDetailLogService {

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
	 * 今天奖励否
	 * @param tcoinDetailLog
	 * @return
	 */
	public boolean hasRewardTcoinToday(String today,String memberId);
}
