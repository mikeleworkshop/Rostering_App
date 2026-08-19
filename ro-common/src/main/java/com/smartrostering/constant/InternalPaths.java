package com.smartrostering.constant;

public final class InternalPaths {

    private InternalPaths() {
    }

    // Auth Service
    public static final String AUTH_BASE              = "/internal/auth";
    public static final String AUTH_VERIFY            = AUTH_BASE + "/verify";
    public static final String AUTH_BUSINESS_BY_ID    = AUTH_BASE + "/businesses/{id}";
    public static final String AUTH_USER_BY_ID        = AUTH_BASE + "/users/{id}";

    // Employee Service
    public static final String EMPLOYEE_BASE          = "/internal/employees";
    public static final String EMPLOYEE_BY_ID         = EMPLOYEE_BASE + "/{id}";
    public static final String EMPLOYEE_FIXED         = EMPLOYEE_BASE + "/fixed";
    public static final String SKILL_BASE             = "/internal/skills";

    // Shift Service
    public static final String SHIFT_TEMPLATE_BASE    = "/internal/shift-templates";
    public static final String SHIFT_TEMPLATE_BY_ID   = SHIFT_TEMPLATE_BASE + "/{id}";
    public static final String SHIFT_BASE             = "/internal/shifts";
    public static final String SHIFT_BY_ID            = SHIFT_BASE + "/{id}";
    public static final String SHIFT_GENERATE_WEEK    = SHIFT_BASE + "/generate-week";

    // Availability Service
    public static final String AVAILABILITY_BASE      = "/internal/availability";
    public static final String AVAILABILITY_EFFECTIVE = AVAILABILITY_BASE + "/effective";
    public static final String AVAILABILITY_EXCEPTIONS= AVAILABILITY_BASE + "/exceptions";

    // Optimizer Service
    public static final String OPTIMIZE_BASE          = "/internal/optimize";
    public static final String OPTIMIZE_REGENERATE    = OPTIMIZE_BASE + "/regenerate";
}