package cps.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;

import cps.entities.InsurersEO;

public interface InsurerService {
    InsurersEO addInsurer(InsurersEO insurer);
    List<InsurersEO> getAllInsurers();
    Optional<InsurersEO> getInsurerById(ObjectId id);
    InsurersEO updateInsurer(ObjectId id, InsurersEO insurer);
    void deleteInsurer(ObjectId id);
}
