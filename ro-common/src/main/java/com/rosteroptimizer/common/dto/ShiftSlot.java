package com.rosteroptimizer.common.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.rosteroptimizer.common.enums.DayOfWeek;

public record ShiftSlot(
		Long id,
		Long businessId,
		Long shiftTemplateId,
		String shiftName,
		DayOfWeek dayOfWeek,
		LocalDate shiftDate,
		LocalTime startTime,
		LocalTime endTime,
		List<StaffInNeed> staff) {

}
