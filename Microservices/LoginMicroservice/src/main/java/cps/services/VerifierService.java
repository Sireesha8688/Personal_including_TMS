package cps.services;

import cps.entities.VerifierEO;
import reactor.core.publisher.Mono;

public interface VerifierService {
   
	public Mono<VerifierEO> getVerifierByEmail(String email);
	
}
