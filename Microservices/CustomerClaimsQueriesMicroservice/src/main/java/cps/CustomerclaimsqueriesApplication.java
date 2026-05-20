package cps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class CustomerclaimsqueriesApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomerclaimsqueriesApplication.class, args);
	}

}
