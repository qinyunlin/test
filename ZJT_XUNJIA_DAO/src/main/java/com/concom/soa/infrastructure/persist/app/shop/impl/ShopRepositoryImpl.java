package com.concom.soa.infrastructure.persist.app.shop.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.shop.Shop;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.shop.ShopRepository;

@Repository
public class ShopRepositoryImpl extends MybatisOperations<String, Shop> implements
		ShopRepository {

	@Override
	public Shop getShopByMemberId(String memberId) {
		
		return getSqlSession().selectOne(getNamespace().concat(".getByMemberId"),memberId);
	}

	
}
