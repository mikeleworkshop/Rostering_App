package com.smartrostering.model.entity;

import java.math.BigDecimal;
import java.util.Set;

public class Employee extends User{
	private BigDecimal hourlyRate;
	private int maxWeeklyHours;
	private Set<String> skillNames;
	private int schedulingPriority;
	
	public void updateAvailability() {}
}
