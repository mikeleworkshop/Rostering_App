package com.rosteroptimizer.common.enums;

public enum Role {
	MANAGER,
	EMPLOYEE;
	
    public static Role fromString(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                "Role cannot be null or blank"
            );
        }

        String cleaned = value.trim().toUpperCase();

        for (Role role : Role.values()) {
            if (role.name().equals(cleaned)) {
                return role;
            }
        }

        throw new IllegalArgumentException(
            "Unknown Role: '" + value + "'. Allowed values: MANAGER, EMPLOYEE"
        );
    }
}
