package com.concom.soa.infrastructure.persist.wcw.ask;

import java.util.List;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;

/**
 * 
 * @author zhengreat
 *
 */
public interface WCWAskPriceRepository {

	AskPrice getById(String id);
	Page<AskPrice> queryPageForWcwSJB(Page<AskPrice> page);

	List<String> getCidsForWcwSJB(Page<AskPrice> page);
	
	int queryForWcwSJBCount(Page<AskPrice> page);

	List<AskPrice> getAskPriceByIds(List<String> ids);
	
	void revNumIncrement(String pid);
}
