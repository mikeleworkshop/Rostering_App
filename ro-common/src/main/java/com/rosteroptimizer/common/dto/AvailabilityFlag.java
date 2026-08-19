package com.rosteroptimizer.common.dto;

import com.rosteroptimizer.common.enums.AvailabilityStatus;

public record AvailabilityFlag(
		Long employeeId,
		Long shiftId,
		Long shiftTemplateId,
		AvailabilityStatus status,
		Boolean hasException) {
}
