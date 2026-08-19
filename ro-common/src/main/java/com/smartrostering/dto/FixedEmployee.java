package com.smartrostering.dto;

import java.util.List;

public record FixedEmployee(
		Long employeeId,
		String employeeName,
		List<Long> fixedShiftTemplateIds) {
}
