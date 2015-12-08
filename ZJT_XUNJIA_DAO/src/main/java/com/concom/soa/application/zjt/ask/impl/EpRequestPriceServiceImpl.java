package com.concom.soa.application.zjt.ask.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.EpRequestPrice;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.ask.EpRequestPriceService;
import com.concom.soa.infrastructure.persist.zjt.ask.EpRequestPriceDao;

@Service
public class EpRequestPriceServiceImpl implements EpRequestPriceService {
	@Autowired
	private EpRequestPriceDao epRequestPriceDao;
	
	public Page<EpRequestPrice> queryPage(Page<EpRequestPrice> page) {
		return epRequestPriceDao.queryPage(page);
	}
}
