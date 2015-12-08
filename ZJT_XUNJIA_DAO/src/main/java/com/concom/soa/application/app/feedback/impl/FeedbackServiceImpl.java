package com.concom.soa.application.app.feedback.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.feedback.Feedback;
import com.concom.soa.application.app.feedback.FeedbackService;
import com.concom.soa.infrastructure.persist.app.feedback.FeedbackRepository;

@Service
public class FeedbackServiceImpl implements FeedbackService {
	
	@Autowired
	FeedbackRepository feedfackRepository;

	@Override
	public void submit(Feedback feedback) {
		
		feedfackRepository.save(feedback);

	}

}
