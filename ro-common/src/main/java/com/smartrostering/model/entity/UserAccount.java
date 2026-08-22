package com.smartrostering.model.entity;

import com.smartrostering.model.enums.UserRole;

public class UserAccount {
	private String email;
	private String fullName;
	private String password;
	private UserRole role;
	private String businessRegNumber;
	
	public void login(String password) {}
	
	public void logout() {}
}
