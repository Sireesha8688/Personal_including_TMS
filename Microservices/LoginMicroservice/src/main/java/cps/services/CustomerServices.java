package cps.services;

import cps.entities.CustomerEO;
import reactor.core.publisher.Mono;

public interface CustomerServices {
	
	public Mono<CustomerEO> getCustomerByEmail(String email);

}
