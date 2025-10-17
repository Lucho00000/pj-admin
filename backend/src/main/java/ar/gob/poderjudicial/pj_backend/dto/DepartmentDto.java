package ar.gob.poderjudicial.pjbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DepartmentDto(
    Long id,
    @NotBlank String name,
    @NotBlank String officeNumber,
    @NotNull Long buildingId
) {}
