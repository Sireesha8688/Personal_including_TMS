package cps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class CustomerclaimsApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerclaimsApplication.class, args);
	}

}
