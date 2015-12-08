package com.concom.soa.application.wcw.reply.impl;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.reply.AskReply;
import com.concom.lang.Page;
import com.concom.soa.application.wcw.reply.AskReplyService;
import com.concom.soa.infrastructure.persist.wcw.ask.WCWAskPriceRepository;
import com.concom.soa.infrastructure.persist.wcw.reply.WCWAskReplyRepository;
import com.ibm.icu.text.SimpleDateFormat;

/**
 * 
 * @author zhengreat
 * 
 */
@Service("WCWAskReplyService")
public class WCWAskReplyServiceImpl implements AskReplyService {

	@Autowired
	private WCWAskReplyRepository askReplyRository;

	@Autowired
	private WCWAskPriceRepository askPriceRepository;

	public void askReplyFromSupplier(AskReply askReply) {
		askReply.setFromType("2");
		askReply.setIssueDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
		askReplyRository.askReplyFromSupplier(askReply);
		askPriceRepository.revNumIncrement(askReply.getPid());
	}

	@Override
	public int update(AskReply askReply) {
		return askReplyRository.update(askReply);
	}

	@Override
	public AskReply get(String id) {

		return askReplyRository.get(id);
	}

	@Override
	public Page<AskReply> queryPage(Page<AskReply> page) {
		
		return askReplyRository.queryPage(page);
	}

	
}
