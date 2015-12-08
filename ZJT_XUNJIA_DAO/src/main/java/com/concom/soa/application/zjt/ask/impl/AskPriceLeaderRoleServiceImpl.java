package com.concom.soa.application.zjt.ask.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPriceLeaderRole;
import com.concom.soa.application.zjt.ask.AskPriceLeaderRoleService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceLeaderRoleDao;

@Service
public class AskPriceLeaderRoleServiceImpl implements AskPriceLeaderRoleService{
	
	@Autowired
	public AskPriceLeaderRoleDao askPriceLeaderRoleDao;
	public List<AskPriceLeaderRole> queryList(){
		return askPriceLeaderRoleDao.queryList();
	}
	@Override
	public int add(AskPriceLeaderRole askPriceLeaderRole) {
		// TODO Auto-generated method stub
		return askPriceLeaderRoleDao.add(askPriceLeaderRole);
	}
	@Override
	public List<String> get() {
		// TODO Auto-generated method stub
		return askPriceLeaderRoleDao.get();
	}
	@Override
	public void del() {
		// TODO Auto-generated method stub
		askPriceLeaderRoleDao.del();
	}
}
