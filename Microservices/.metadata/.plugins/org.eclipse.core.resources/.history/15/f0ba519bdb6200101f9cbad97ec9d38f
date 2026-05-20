package cps.hospitalclaimqueries.service;

import java.util.List;
import java.util.Optional;

import cps.hospitalclaimqueries.entities.HospitalClaimsQuery;

public interface HospitalClaimsQueryService {

    List<HospitalClaimsQuery> getAllQueries();

    Optional<HospitalClaimsQuery> getQueryById(String id);

    HospitalClaimsQuery createQuery(HospitalClaimsQuery hospitalClaimsQuery);

    Optional<HospitalClaimsQuery> updateQuery(String id, HospitalClaimsQuery hospitalClaimsQuery);

    boolean deleteQuery(String id);
    
    List<HospitalClaimsQuery> getQueriesByClaimRaisedId(String claimRaisedId);
}
