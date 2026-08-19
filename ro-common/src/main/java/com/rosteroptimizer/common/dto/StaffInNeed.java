package com.rosteroptimizer.common.dto;

public record StaffInNeed(
		Long id,
		Long skillId,
		String skillName,
		Integer staffCount,
		Boolean isOverride
) 
{}
