package com.concom.soa.application.app.shop.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.shop.Shop;
import com.concom.soa.application.app.shop.ShopService;
import com.concom.soa.infrastructure.persist.app.shop.ShopRepository;

@Service
public class ShopServiceImpl implements ShopService {

	@Autowired
	ShopRepository supplierRepository;

	@Override
	public Shop getShopByMemberId(String memberId) {
		return supplierRepository.getShopByMemberId(memberId);
	}

	@Override
	public Shop save(Shop shop) {
		return supplierRepository.save(shop);
	}

	@Override
	public int update(Shop shop) {
		return supplierRepository.update(shop);
	}

	@Override
	public void updateCompanyName(String companyName, String memberId) {
		Shop shop = new Shop();
		shop.setCompanyName(companyName);
		shop.setMemberId(memberId);
		update(shop);
		
	}

	@Override
	public void registerShopByMember(String memberId) {
		Shop shop = new Shop();
		shop.setMemberId(memberId);
		save(shop);
	}
}
