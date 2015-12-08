package com.concom.soa.application.app.feedback;

import com.concom.entity.dto.xunjia.app.feedback.Feedback;


public interface FeedbackService {
	/**
	 * 提交意见反馈
	 * @param feedback
	 */
	void submit(Feedback feedback);
}
