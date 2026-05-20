package cps.serviceImpl;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cps.entities.PolicyEO;
import cps.repository.PolicyRepository;
import cps.service.PolicyService;

@Service
public class PolicyServiceImpl implements PolicyService {

    @Autowired
    private PolicyRepository policyRepository;

    @Override
    public PolicyEO addPolicy(PolicyEO policy) {
        return policyRepository.save(policy);
    }

    @Override
    public List<PolicyEO> getAllPolicies() {
        return policyRepository.findAll();
    }

    @Override
    public Optional<PolicyEO> getPolicyById(ObjectId id) {
        return policyRepository.findById(id);
    }

    @Override
    public PolicyEO updatePolicy(ObjectId id, PolicyEO policy) {
        Optional<PolicyEO> existing = policyRepository.findById(id);
        if (existing.isPresent()) {
            PolicyEO oldPolicy = existing.get();
            oldPolicy.setName(policy.getName());
            oldPolicy.setDescription(policy.getDescription());
            oldPolicy.setCovers(policy.getCovers());
            oldPolicy.setBaseSumAssured(policy.getBaseSumAssured());
            oldPolicy.setBasePremium(policy.getBasePremium());
            oldPolicy.setAdministrativeFee(policy.getAdministrativeFee());
            oldPolicy.setTaxRate(policy.getTaxRate());
            oldPolicy.setPremium(policy.getPremium());
            oldPolicy.setSumAssured(policy.getSumAssured());
            return policyRepository.save(oldPolicy);
        }
        return null;
    }

    @Override
    public void deletePolicy(ObjectId id) {
        policyRepository.deleteById(id);
    }
}
