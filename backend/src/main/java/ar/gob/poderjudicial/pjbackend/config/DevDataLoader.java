package ar.gob.poderjudicial.pjbackend.config;

import ar.gob.poderjudicial.pjbackend.model.*;
import ar.gob.poderjudicial.pjbackend.repo.*;
import ar.gob.poderjudicial.pjbackend.service.EmployeeAssignmentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@Configuration
@Profile("dev")
public class DevDataLoader {

  @Bean
  CommandLineRunner seed(
      BuildingRepository buildingRepo,
      DepartmentRepository departmentRepo,
      EmployeeRepository employeeRepo,
      EmployeeAssignmentService assignmentService
  ) {
    return args -> load(buildingRepo, departmentRepo, employeeRepo, assignmentService);
  }

  @Transactional
  void load(
      BuildingRepository buildingRepo,
      DepartmentRepository departmentRepo,
      EmployeeRepository employeeRepo,
      EmployeeAssignmentService assignmentService
  ) {
    if (buildingRepo.count() > 0 || departmentRepo.count() > 0 || employeeRepo.count() > 0) {
    
      return;
    }

    var b1 = buildingRepo.save(Building.builder()
        .name("EDIFICIO YRIGOYEN 175")
        .street("YRIGOYEN").number("175").floor("PB").build());
    var b2 = buildingRepo.save(Building.builder()
        .name("EDIFICIO LELOIR 686")
        .street("LELOIR").number("686").floor("PB").build());
    var b3 = buildingRepo.save(Building.builder()
        .name("EDIFICIO ALBERDI 52")
        .street("ALBERDI").number("52").floor("PB").build());    

    var d11 = departmentRepo.save(Department.builder()
        .name("Oficina de Mandamientos y Notificaciones.").officeNumber("101").building(b1).build());
    var d21 = departmentRepo.save(Department.builder()
        .name("Gabinete Técnico Contable").officeNumber("201").building(b2).build());
    var d22 = departmentRepo.save(Department.builder()
        .name("Cuerpo Médico Forense - Unidad de Servicios Periciales").officeNumber("202").building(b2).build());
    var d31 = departmentRepo.save(Department.builder()
        .name("SECRETARÍA DE SUPERINTENDENCIA").officeNumber("301").building(b3).build());

    
    var e1 = employeeRepo.save(Employee.builder().legajo("L001").firstName("Raúl").lastName("Garcia").dni("30111222").build());
    var e2 = employeeRepo.save(Employee.builder().legajo("L002").firstName("Roberto").lastName("Gómez").dni("30222333").build());
    var e3 = employeeRepo.save(Employee.builder().legajo("L003").firstName("Maria").lastName("Díaz").dni("29333444").build());
    var e4 = employeeRepo.save(Employee.builder().legajo("L004").firstName("Nancy").lastName("Suárez").dni("28555666").build());

    assignmentService.assign(e1, d11); 
    assignmentService.assign(e3, d21); 
    assignmentService.assign(e4, d22);   
    assignmentService.assign(e2, d31); 
    
    assignmentService.assign(e2, d21);
    assignmentService.assign(e2, d22);
  }
}
