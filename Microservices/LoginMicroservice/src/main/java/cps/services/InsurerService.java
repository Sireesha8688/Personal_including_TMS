package cps.services;

import cps.entities.InsurersEO;
import reactor.core.publisher.Mono;

public interface InsurerService {
	
	public Mono<InsurersEO> getInsurerByEmail(String email);
   
}
