package com.rosteroptimizer.model.dto;

import java.time.LocalDate;

public class RosterGenerationRequest {
    private LocalDate weekStartDate;
    private boolean considerFairness;
    private boolean prioritizeLowCost;
}
