package com.rosteroptimizer.common.exception;

import java.util.Collections;
import java.util.List;

public record ApiErrorResponse(
    String errorCode,
    String message,
    List<Violation> violations
) {

    public ApiErrorResponse {
        violations = violations != null
            ? List.copyOf(violations)
            : Collections.emptyList();
    }

    public static ApiErrorResponse of(String errorCode, String message) {
        return new ApiErrorResponse(errorCode, message, Collections.emptyList());
    }

    public static ApiErrorResponse of(
            String errorCode,
            String message,
            List<Violation> violations) {
        return new ApiErrorResponse(errorCode, message, violations);
    }

    public boolean hasViolations() {
        return violations != null && !violations.isEmpty();
    }
}