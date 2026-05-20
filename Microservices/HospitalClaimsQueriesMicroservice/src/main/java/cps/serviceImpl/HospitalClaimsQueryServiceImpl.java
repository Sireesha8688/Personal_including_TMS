package cps.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cps.entities.HospitalClaimsQuery;
import cps.repository.HospitalClaimsQueryRepository;
import cps.service.HospitalClaimsQueryService;

@Service
public class HospitalClaimsQueryServiceImpl implements HospitalClaimsQueryService {

    @Autowired
    private HospitalClaimsQueryRepository repository;

    @Override
    public List<HospitalClaimsQuery> getAllQueries() {
        return repository.findAll();
    }

    @Override
    public Optional<HospitalClaimsQuery> getQueryById(String id) {
        if (!ObjectId.isValid(id)) {
            return Optional.empty();
        }
        return repository.findById(new ObjectId(id));
    }

    @Override
    public HospitalClaimsQuery createQuery(HospitalClaimsQuery hospitalClaimsQuery) {
        hospitalClaimsQuery.set_id(null); // Let Mongo generate new ObjectId on insert
        return repository.save(hospitalClaimsQuery);
    }

    @Override
    public Optional<HospitalClaimsQuery> updateQuery(String id, HospitalClaimsQuery hospitalClaimsQuery) {
        if (!ObjectId.isValid(id)) {
            return Optional.empty();
        }

        Optional<HospitalClaimsQuery> existing = repository.findById(new ObjectId(id));

        if (existing.isPresent()) {
            HospitalClaimsQuery existingQuery = existing.get();

           
            existingQuery.setClaimRaisedId(hospitalClaimsQuery.getClaimRaisedId());
            existingQuery.setRaisedByInsurerId(hospitalClaimsQuery.getRaisedByInsurerId());
            existingQuery.setQueryStatus(hospitalClaimsQuery.getQueryStatus());
            existingQuery.setQuery(hospitalClaimsQuery.getQuery());
            existingQuery.setCreatedAt(hospitalClaimsQuery.getCreatedAt());
            existingQuery.setUpdatedAt(hospitalClaimsQuery.getUpdatedAt());

            HospitalClaimsQuery updated = repository.save(existingQuery);
            return Optional.of(updated);
        }
        return Optional.empty();
    }

    @Override
    public boolean deleteQuery(String id) {
        if (!ObjectId.isValid(id)) {
            return false;
        }
        if (repository.existsById(new ObjectId(id))) {
            repository.deleteById(new ObjectId(id));
            return true;
        }
        return false;
    }
    
    @Override
    public List<HospitalClaimsQuery> getQueriesByClaimRaisedId(String claimRaisedId) {
        return repository.findByClaimRaisedId(claimRaisedId);
    }

}
