package ar.gob.poderjudicial.pjbackend.mapper;

import ar.gob.poderjudicial.pjbackend.dto.EmployeeDto;
import ar.gob.poderjudicial.pjbackend.model.Employee;

public class EmployeeMapper {
  public static EmployeeDto toDto(Employee e, Long currentDeptId) {
    return new EmployeeDto(e.getId(), e.getLegajo(), e.getFirstName(), e.getLastName(), e.getDni(), currentDeptId);
  }
  public static void updateEntity(Employee e, EmployeeDto dto) {
    e.setLegajo(dto.legajo());
    e.setFirstName(dto.firstName());
    e.setLastName(dto.lastName());
    e.setDni(dto.dni());
  }
}
