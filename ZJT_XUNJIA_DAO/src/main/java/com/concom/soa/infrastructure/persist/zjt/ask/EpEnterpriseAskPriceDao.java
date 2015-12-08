package com.concom.soa.infrastructure.persist.zjt.ask;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.EpEnterpriseAskPrice;
import com.concom.lang.Page;

 
public interface EpEnterpriseAskPriceDao {
	/**
	 * 企业询价
	 * @param page
	 * @return
	 */
	public Page<EpEnterpriseAskPrice> queryPage(Page<EpEnterpriseAskPrice> page);
	
	/**
	 * 企业询价详情
	 * @param id
	 * @return
	 */
	public EpEnterpriseAskPrice get(String id);
	
	/**
	 * 删除企业询价
	 * @param epEnterpriseAskPrice
	 * @return
	 */
	public int delete(EpEnterpriseAskPrice epEnterpriseAskPrice);
}
