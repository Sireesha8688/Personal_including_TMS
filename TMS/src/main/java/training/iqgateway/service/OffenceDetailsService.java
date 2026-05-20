package training.iqgateway.service;

import java.util.List;

import training.iqgateway.entities.TmOffenceDetails;

public interface OffenceDetailsService {
	void insert(TmOffenceDetails offenceDetails);
    TmOffenceDetails getByOffenceDetailId(Long offenceDetailId);
    List<TmOffenceDetails> getAll();
    void update(TmOffenceDetails offenceDetails);
    void delete(Long offenceDetailId);
    List<TmOffenceDetails> getByVehNo(String vehNo);
}
