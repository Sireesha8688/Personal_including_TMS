package training.iqgateway.services;

import java.util.List;

import javax.ejb.Remote;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmVehicledetails;

@Remote
public interface OwnerSessionEJB {
    Object queryByRange(String jpqlStmt, int firstResult, int maxResults);

    TmOffence persistTmOffence(TmOffence tmOffence);

    TmOffence mergeTmOffence(TmOffence tmOffence);

    void removeTmOffence(TmOffence tmOffence);

    List<TmOffence> getTmOffenceFindAll();

    List<TmVehicledetails> getTmVehicledetailsFindAll();

    TmOffenceDetails persistTmOffenceDetails(TmOffenceDetails tmOffenceDetails);

    TmOffenceDetails mergeTmOffenceDetails(TmOffenceDetails tmOffenceDetails);

    void removeTmOffenceDetails(TmOffenceDetails tmOffenceDetails);

    List<TmOffenceDetails> getTmOffenceDetailsFindAll();

    List<TmOwnerdetails> getTmOwnerdetailsFindAll();

    List<TmRegdetails> getTmRegdetailsFindAll();
}
