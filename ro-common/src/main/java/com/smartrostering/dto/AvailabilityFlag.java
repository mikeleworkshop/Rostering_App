package com.smartrostering.dto;

import com.smartrostering.enums.AvailabilityStatus;

public record AvailabilityFlag(
		Long employeeId,
		Long shiftId,
		Long shiftTemplateId,
		AvailabilityStatus status,
		Boolean hasException) {
}
