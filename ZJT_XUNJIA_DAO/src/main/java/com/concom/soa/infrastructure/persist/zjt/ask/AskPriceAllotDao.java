package com.concom.soa.infrastructure.persist.zjt.ask;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.ask.AskPriceAllot;


public interface AskPriceAllotDao {
	/**
	 * 保存询价分配负责人
	 * @param askPriceAllot
	 * @return
	 */
	public void add(AskPriceAllot askPriceAllot);
	
	/**
	 * 根据询价ID查询询价分配负责人
	 * @return
	 */
	public List<AskPriceAllot> queryListByAskPriceId(String askPriceId);
	
	/**
	 * 根据询价ID及分配人查询询价分配详情
	 * @param params
	 * @return
	 */
	public AskPriceAllot queryByAskPriceIdAndUserName(Map<String, String> params);
	
	/**
	 * 删除某条询价的分配人
	 * @param askPriceAllot
	 * @return
	 */
	public int delete(AskPriceAllot askPriceAllot);
	
	
	public AskPriceAllot queryByAskPriceId(Map<String, String> params);
}
