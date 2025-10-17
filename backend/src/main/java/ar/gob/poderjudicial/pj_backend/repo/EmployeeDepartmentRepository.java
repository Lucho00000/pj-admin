package ar.gob.poderjudicial.pjbackend.repo;

import ar.gob.poderjudicial.pjbackend.model.EmployeeDepartment;
import ar.gob.poderjudicial.pjbackend.model.Employee;
import ar.gob.poderjudicial.pjbackend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeDepartmentRepository extends JpaRepository<EmployeeDepartment, Long> {
    Optional<EmployeeDepartment> findFirstByEmployeeAndToTsIsNullOrderByFromTsDesc(Employee employee);
    List<EmployeeDepartment> findByEmployeeOrderByFromTsDesc(Employee employee);
    List<EmployeeDepartment> findByDepartmentAndToTsIsNull(Department department);
}
