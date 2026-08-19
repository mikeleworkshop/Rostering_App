package com.smartrostering.enums;

public enum AvailabilityStatus {
	AVAILABLE,
	UNAVAILABLE;
	
	public static AvailabilityStatus fromString(String value) {
		if (value == null || value.isBlank()) {
			throw new IllegalArgumentException(
					"Availability Status cannot be left blank");
		}
		
		String cleaned = value.trim().toUpperCase();
		
		for (AvailabilityStatus status : AvailabilityStatus.values()) {
			if (status.name().equals(cleaned)) {
				return status;
			}
		}
		
		throw new IllegalArgumentException(
				"Unknown Availability Status: '" + value
				+ "'. Allowed values: AVAILABLE, UNAVAILABLE");
	}
}
