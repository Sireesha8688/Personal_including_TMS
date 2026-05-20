package cps.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cps.entities.LoginEO;
import cps.repositories.AdminRepository;
import cps.services.impl.AdminServiceImpl;
import cps.services.impl.CustomerServicesImpl;
import cps.services.impl.HospitalServicesImpl;
import cps.services.impl.InsurerServiceImpl;
import cps.services.impl.VerifierServiceImpl;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final AdminRepository adminRepository;

	@Autowired
	private AdminServiceImpl adminServiceImplRef;

	@Autowired
	private CustomerServicesImpl customerServicesImplRef;

	@Autowired
	private HospitalServicesImpl hospitalServicesImplRef;

	@Autowired
	private InsurerServiceImpl insurerServiceImplRef;

	@Autowired
	private VerifierServiceImpl verifierServiceImplRef;

    LoginController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

	@PostMapping
    public Mono<ResponseEntity<Object>> login(@RequestBody LoginEO loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        if (email.contains(".admin")) {
            return adminServiceImplRef.getAdminByEmail(email)
                .filter(admin -> admin.getPassword().equals(password)) 
                .map(admin -> ResponseEntity.ok((Object) admin))
                .defaultIfEmpty(ResponseEntity.status(401).body("Invalid credentials"));
        } else if (email.contains(".user")) {
            return customerServicesImplRef.getCustomerByEmail(email)
                .filter(customer -> customer.getPassword().equals(password)) 
                .map(customer -> ResponseEntity.ok((Object) customer))
                .defaultIfEmpty(ResponseEntity.status(401).body("Invalid credentials"));
        } else if (email.contains(".ver")) {
            return verifierServiceImplRef.getVerifierByEmail(email)
                .filter(verifier -> verifier.getPassword().equals(password))
                .map(verifier -> ResponseEntity.ok((Object) verifier))
                .defaultIfEmpty(ResponseEntity.status(401).body("Invalid credentials"));
        } else if (email.contains(".ins")) {
            return insurerServiceImplRef.getInsurerByEmail(email)
                .filter(insurer -> insurer.getPassword().equals(password)) 
                .map(insurer -> ResponseEntity.ok((Object) insurer))
                .defaultIfEmpty(ResponseEntity.status(401).body("Invalid credentials"));
        } else if (email.contains(".htl")) {
        	
            return hospitalServicesImplRef.getHospitalByEmail(email)
                .filter(hospital -> hospital.getPassword().equals(password)) 
                .map(hospital -> ResponseEntity.ok((Object) hospital))
                .defaultIfEmpty(ResponseEntity.status(401).body("Invalid credentials"));
        } else {
            return Mono.just(ResponseEntity.badRequest().body("Invalid email format for role detection."));
        }
	}
}