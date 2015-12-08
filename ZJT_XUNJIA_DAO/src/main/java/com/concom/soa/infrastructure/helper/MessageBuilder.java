package com.concom.soa.infrastructure.helper;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import com.concom.lang.helper.JsonHelper;

public class MessageBuilder {

	private Map<String,Object> messages = new HashMap<String,Object>();

	public MessageBuilder title(String title){
		messages.put("title", title);
		return this;
	}
	public MessageBuilder description(String description){
		messages.put("description", description);
		return this;
	}
	public MessageBuilder iosAps(String alert){
		Map<String, String> aps = new HashMap<String, String>();
		aps.put("alert", alert);
		aps.put("sound", "");
		aps.put("badge", "");
		messages.put("aps",aps);
		return this;
	}
	public MessageBuilder iosAps(String alert, String sound, String badge){
		Map<String, Object> aps = new HashMap<String, Object>();
		aps.put("alert", alert);
		aps.put("sound", sound);
		aps.put("badge", badge);
		messages.put("aps",aps);
		return this;
	}
	public MessageBuilder iosCustomKeyValue(String key, Object value){
		messages.put(key,value);
		return this;
	}
	public MessageBuilder iosCustomContent(Map<String, Object> customContent){
		for(Entry<String, Object> entry : customContent.entrySet()){
			iosCustomKeyValue(entry.getKey(),entry.getValue());
		}
		return this;
	}
	public MessageBuilder androidCustomContent(Map<String, Object> customContent){
		messages.put("custom_content",customContent);
		return this;
	}

	public String createMessages() {
		return JsonHelper.toJsonString(messages);
	}
	
	public static void main(String[] args){
		Map<String, Object> custom_content= new HashMap<String,Object>();
		custom_content.put("android附加字段", "roid");
		String msg = new MessageBuilder().title("标题").description("内容")
		.iosAps("这是iosAps弹出内容！").androidCustomContent(custom_content)
		.iosCustomKeyValue("ios", "7.1")
		.createMessages();
		System.out.println(msg);
	}
}
