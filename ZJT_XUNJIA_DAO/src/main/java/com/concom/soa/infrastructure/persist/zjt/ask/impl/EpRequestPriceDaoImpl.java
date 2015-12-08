package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.EpRequestPrice;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.EpRequestPriceDao;

@Repository
public class EpRequestPriceDaoImpl extends MybatisOperations<String, EpRequestPrice> implements EpRequestPriceDao{
	
}
