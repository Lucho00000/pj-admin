package ar.gob.poderjudicial.pjbackend.mapper;

import ar.gob.poderjudicial.pjbackend.dto.DepartmentDto;
import ar.gob.poderjudicial.pjbackend.model.Department;

public class DepartmentMapper {
  public static DepartmentDto toDto(Department d) {
    Long buildingId = (d.getBuilding() != null ? d.getBuilding().getId() : null);
    return new DepartmentDto(d.getId(), d.getName(), d.getOfficeNumber(), buildingId);
  }
  public static void updateEntity(Department d, DepartmentDto dto) {
    d.setName(dto.name());
    d.setOfficeNumber(dto.officeNumber());
  }
}
