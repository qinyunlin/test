package com.concom.soa.infrastructure.persist.zjt.ask;

import java.util.Map;

import com.concom.entity.dto.xunjia.ask.AskPriceHelp;
import com.concom.lang.Page;

public interface AskPriceHelpDao {
	
	/**
	 * 查询向我询价信息
	 * @param page
	 * @return
	 */
	public Page<AskPriceHelp> queryPage(Page<AskPriceHelp> page);
	/**
	 * 查询向我询价的总数
	 * @param page
	 * @return
	 */
	public int queryAskPriceHelpCount(Page<AskPriceHelp> page);
	/**
	 * 删除向我询价
	 * @param map
	 */
	public void delete(Map<String,String> map);
	
	/**
	 * 添加向他询价信息
	 * @param askPriceHelp
	 */
	public void add(AskPriceHelp askPriceHelp);

}
