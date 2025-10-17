package ar.gob.poderjudicial.pjbackend.dto;

import jakarta.validation.constraints.NotBlank;

public record EmployeeDto(
    Long id,
    @NotBlank String legajo,
    @NotBlank String firstName,
    @NotBlank String lastName,
    @NotBlank String dni,
    Long currentDepartmentId 
) {}
