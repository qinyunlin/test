package com.concom.soa.application.app.shop;

import com.concom.entity.dto.xunjia.app.shop.Shop;


public interface ShopService {

	Shop getShopByMemberId(String memberId);
	
	Shop save(Shop shop);
	
	int update(Shop shop);

	void updateCompanyName(String companyName, String memberId);

	void registerShopByMember(String memberId);
}
