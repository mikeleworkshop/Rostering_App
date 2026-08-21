package com.smartrostering.model.entity;

import java.time.LocalDate;
import java.util.UUID;

public class Availability {
	 private String employeeEmail; // [Composite Key]
	 private LocalDate date;       // [Composite Key]
	 private String shiftCode;     // [Composite Key]
	 private AvailabilityStatus status;
	
}
