package com.smartrostering.model.entity;

import java.time.LocalDate;

public class Roster {
	private String businessRegNumber; // [Composite Key]
    private LocalDate weekStartDate;  // [Composite Key]
    private RosterStatus status;
    private double totalLabourCost;
    
    public void addAssignment() {}
    public void calculateCost() {}
}
