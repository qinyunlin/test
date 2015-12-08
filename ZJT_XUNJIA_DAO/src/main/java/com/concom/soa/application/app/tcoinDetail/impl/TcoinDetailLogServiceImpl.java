package com.concom.soa.application.app.tcoinDetail.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.tcoinDetail.TcoinDetailLog;
import com.concom.lang.Page;
import com.concom.soa.application.app.tcoinDetail.TcoinDetailLogService;
import com.concom.soa.infrastructure.persist.app.tcoinDetail.TcoinDetailDao;

@Service
public class TcoinDetailLogServiceImpl  implements TcoinDetailLogService {

	@Autowired
	private TcoinDetailDao tcoinDetailDao;
	@Override
	public Page<Map<String, String>> queryPageMap(
			Page<Map<String, String>> page) {
		// TODO Auto-generated method stub
		return tcoinDetailDao.queryPageMap(page);
	}

	@Override
	public int addTcoinDetail(TcoinDetailLog tcoinDetailLog) {
		// TODO Auto-generated method stub
		return tcoinDetailDao.addTcoinDetail(tcoinDetailLog);
	}

	@Override
	public boolean hasRewardTcoinToday(String today, String memberId) {
		TcoinDetailLog tcoinDetailLog = tcoinDetailDao.getTcoinDetailLogOfReward(today, 0, memberId);
		
		return tcoinDetailLog!=null?true:false;
	}

}
