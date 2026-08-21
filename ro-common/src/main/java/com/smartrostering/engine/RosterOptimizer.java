package com.smartrostering.engine;

import java.util.List;

import com.smartrostering.engine.constraint.ConstraintChecker;
import com.smartrostering.engine.scoring.FairnessScorer;
import com.smartrostering.engine.scoring.LabourCostCalculator;
import com.smartrostering.model.dto.RosterGenerationRequest;
import com.smartrostering.model.entity.Employee;
import com.smartrostering.model.entity.Shift;

public class RosterOptimizer {
    private List<ConstraintChecker> hardConstraints;
    private LabourCostCalculator costCalculator;
    private FairnessScorer fairnessScorer;
    
    public void generateOptimalRoster(RosterGenerationRequest request, List<Shift> shifts, List<Employee> employees) {}
    public void addConstraint(ConstraintChecker constraints) {}
}
