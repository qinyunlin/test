package com.concom.soa.application.app.push;


public interface MessagePushService {

	
	
	/**
	 * 通用单播通知(即单用户)
	 * @param youcai memberId 会员id
	 * @param title 仅适用于Andorid，不填则默认显示应用名称
	 * @param description 内容
	 * @param messgaeType 消息类型
	 * @param askId 询价id
	 */
	void unicastNotification(String memberId,String title, String description, Integer messgaeType, String askId);
	/**
	 * 通用单播通知(即单用户)
	 * @param youcai memberId 会员id
	 * @param title 仅适用于Andorid，不填则默认显示应用名称
	 * @param description
	 */
	void unicastNotification(String memberId,String title, String description);
	
	/**
	 * 通用全播通知(即所有用户)
	 * @param memberId 会员id
	 * @param title 仅适用于Andorid，不填则默认显示应用名称
	 * @param description
	 */
	void broadcastNotification(String title, String description);

}
