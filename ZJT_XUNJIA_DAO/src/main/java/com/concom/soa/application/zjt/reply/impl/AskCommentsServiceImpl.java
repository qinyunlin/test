package com.concom.soa.application.zjt.reply.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.reply.AskComments;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.reply.AskCommentsService;
import com.concom.soa.infrastructure.persist.zjt.reply.AskCommentsDao;

@Service
public class AskCommentsServiceImpl implements AskCommentsService {

	@Autowired
	private AskCommentsDao askCommentsDao;
	
	
	public void add(AskComments askComments) {
		// TODO Auto-generated method stub
		askCommentsDao.add(askComments);
	}

	
	public List<AskComments> queryList(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askCommentsDao.queryList(params);
	}

	
	public void del(Map<String, String> params) {
		// TODO Auto-generated method stub
		askCommentsDao.del(params);
	}


	@Override
	public Page<AskComments> queryPage(Page<AskComments> page) {
		return askCommentsDao.queryPage(page);
	}


	@Override
	public Page<AskComments> queryPageAskComments(Page<AskComments> page) {
		return askCommentsDao.queryPageAskComments(page);
	}


	@Override
	public int queryCount(Map<String, String> params) {
		return askCommentsDao.queryCount(params);
	}

}
