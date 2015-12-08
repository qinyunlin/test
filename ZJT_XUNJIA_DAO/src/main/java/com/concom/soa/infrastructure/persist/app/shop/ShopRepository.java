package com.concom.soa.infrastructure.persist.app.shop;

import com.concom.entity.dto.xunjia.app.shop.Shop;


public interface ShopRepository {

	Shop getShopByMemberId(String memberId);

	Shop save(Shop shop);

	int update(Shop shop);
	
	

}
