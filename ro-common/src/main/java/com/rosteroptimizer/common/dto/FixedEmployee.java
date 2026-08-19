package com.rosteroptimizer.common.dto;

import java.util.List;

public record FixedEmployee(
		Long employeeId,
		String employeeName,
		List<Long> fixedShiftTemplateIds) {
}
