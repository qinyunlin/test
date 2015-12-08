package com.concom.soa.application.app.member.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.commission.Commission;
import com.concom.soa.application.app.member.CommissionService;
import com.concom.soa.infrastructure.persist.app.member.CommissionRepository;

@Service
public class CommissionServiceImpl implements CommissionService {

	@Autowired
	private CommissionRepository commissionRepository;
	
	@Override
	public int add(Commission commission) {
		// TODO Auto-generated method stub
		return commissionRepository.add(commission);
	}

	@Override
	public int update(Commission commission) {
		// TODO Auto-generated method stub
		return commissionRepository.update(commission);
	}

	@Override
	public List<Commission> queryList(Map<String, String> params) {
		// TODO Auto-generated method stub
		return commissionRepository.queryList(params);
	}

}
