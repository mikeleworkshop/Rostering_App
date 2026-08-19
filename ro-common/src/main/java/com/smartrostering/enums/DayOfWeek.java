package com.smartrostering.enums;

public enum DayOfWeek {
	MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;

    public static DayOfWeek fromString(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                "Select days when you are available to work"
            );
        }

        String cleaned = value.trim().toUpperCase();

        for (DayOfWeek day : DayOfWeek.values()) {
            if (day.name().equals(cleaned)) {
                return day;
            }
        }

        throw new IllegalArgumentException(
            "Unknown DayOfWeek: '" + value
            + "'. Allowed values: MONDAY, TUESDAY, WEDNESDAY, "
            + "THURSDAY, FRIDAY, SATURDAY, SUNDAY"
        );
    }
}
