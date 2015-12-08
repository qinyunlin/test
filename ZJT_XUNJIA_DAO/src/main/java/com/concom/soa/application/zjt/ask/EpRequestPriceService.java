package com.concom.soa.application.zjt.ask;

import com.concom.entity.dto.xunjia.ask.EpRequestPrice;
import com.concom.lang.Page;

public interface EpRequestPriceService {
	
	/**
	 * 企业询价
	 * @param page
	 * @return
	 */
	public Page<EpRequestPrice> queryPage(Page<EpRequestPrice> page);
	
}
