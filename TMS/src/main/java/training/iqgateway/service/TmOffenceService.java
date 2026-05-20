package training.iqgateway.service;

import java.util.List;
import training.iqgateway.entities.TmOffence;

public interface TmOffenceService {
    void insert(TmOffence offence);
    TmOffence getByOffenceId(Long offenceId);
    List<TmOffence> getAll();
    void update(TmOffence offence);
    void delete(Long offenceId);
}
