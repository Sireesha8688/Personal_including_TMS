package cps.hospitalclaims;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication
public class HospitalClaimsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalClaimsApplication.class, args);
	}

}
