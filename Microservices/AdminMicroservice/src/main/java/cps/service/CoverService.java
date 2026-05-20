package cps.service;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import cps.entities.CoversEO;

public interface CoverService {
    CoversEO addCover(CoversEO cover);
    List<CoversEO> getAllCovers();
    Optional<CoversEO> getCoverById(ObjectId id);
    CoversEO updateCover(ObjectId id, CoversEO cover);
    void deleteCover(ObjectId id);
}
