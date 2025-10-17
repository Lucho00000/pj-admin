package ar.gob.poderjudicial.pjbackend.repo;

import ar.gob.poderjudicial.pjbackend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByLegajo(String legajo);
    Optional<Employee> findByDni(String dni);
}
