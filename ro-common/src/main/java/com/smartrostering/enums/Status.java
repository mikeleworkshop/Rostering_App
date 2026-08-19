package com.smartrostering.enums;

public enum Status {
	ACTIVE,
	INACTIVE;
	
	public static Status fromString(String value) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(
					"Status cannot be left blank");
		}
		
		String cleaned = value.trim().toUpperCase();
		
		for (Status status : Status.values()) {
			if (status.name().equals(cleaned)) {
				return status;
			}
		}
		
		throw new IllegalArgumentException(
				"Unknown Status: '" + value
				+ "'. Allowed values: ACTIVE, INACTIVE");
	}
}	
