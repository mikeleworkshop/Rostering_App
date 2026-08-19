package com.smartrostering.dto;

import java.math.BigDecimal;
import java.util.List;

import com.smartrostering.enums.Status;

public record EmployeeProfile(
		Long id,
		Long businessId,
		String name,
		BigDecimal hourlyRate,
		Integer maxWeeklyHours,
		Integer schedulingPriority,
		Boolean isFixed,
		Status status,
		List<String> skills
) {}
