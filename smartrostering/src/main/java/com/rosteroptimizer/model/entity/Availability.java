package com.rosteroptimizer.model.entity;

import java.time.LocalDate;

public class Availability {
	 private String employeeEmail; // [Composite Key]
	 private LocalDate date;       // [Composite Key]
	 private String shiftCode;     // [Composite Key]
	 private AvailabilityStatus status;
	
}
