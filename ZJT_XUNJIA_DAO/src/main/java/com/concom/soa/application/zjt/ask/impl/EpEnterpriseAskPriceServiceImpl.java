package com.concom.soa.application.zjt.ask.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.EpEnterpriseAskPrice;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.ask.EpEnterpriseAskPriceService;
import com.concom.soa.infrastructure.persist.zjt.ask.EpEnterpriseAskPriceDao;

@Service
public class EpEnterpriseAskPriceServiceImpl implements EpEnterpriseAskPriceService {
	@Autowired
	private EpEnterpriseAskPriceDao epEnterpriseAskPriceDao;
	
	public Page<EpEnterpriseAskPrice> queryPage(Page<EpEnterpriseAskPrice> page) {
		return epEnterpriseAskPriceDao.queryPage(page);
	}

	public EpEnterpriseAskPrice get(String id) {
		return epEnterpriseAskPriceDao.get(id);
	}

	public int delete(EpEnterpriseAskPrice epEnterpriseAskPrice) {
		return epEnterpriseAskPriceDao.delete(epEnterpriseAskPrice);
	}
}