package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.EpEnterpriseAskPrice;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.EpEnterpriseAskPriceDao;

@Repository
public class EpEnterpriseAskPriceDaoImpl extends MybatisOperations<String, EpEnterpriseAskPrice> implements EpEnterpriseAskPriceDao{
	
}
