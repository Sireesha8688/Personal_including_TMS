package training.iqgateway.services;

import java.util.List;
import javax.ejb.Local;
import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmVehicledetails;

@Local
public interface RTOSessionEJBLocal {
    Object queryByRange(String jpqlStmt, int firstResult, int maxResults);
    TmOffence persistTmOffence(TmOffence tmOffence);
    TmOffence mergeTmOffence(TmOffence tmOffence);
    void removeTmOffence(TmOffence tmOffence);
    List<TmOffence> getTmOffenceFindAll();
    TmVehicledetails persistTmVehicledetails(TmVehicledetails tmVehicledetails);
    TmVehicledetails mergeTmVehicledetails(TmVehicledetails tmVehicledetails);
    void removeTmVehicledetails(TmVehicledetails tmVehicledetails);
    List<TmVehicledetails> getTmVehicledetailsFindAll();
    TmOffenceDetails persistTmOffenceDetails(TmOffenceDetails tmOffenceDetails);
    TmOffenceDetails mergeTmOffenceDetails(TmOffenceDetails tmOffenceDetails);
    void removeTmOffenceDetails(TmOffenceDetails tmOffenceDetails);
    List<TmOffenceDetails> getTmOffenceDetailsFindAll();
    TmOwnerdetails persistTmOwnerdetails(TmOwnerdetails tmOwnerdetails);
    TmOwnerdetails mergeTmOwnerdetails(TmOwnerdetails tmOwnerdetails);
    void removeTmOwnerdetails(TmOwnerdetails tmOwnerdetails);
    List<TmOwnerdetails> getTmOwnerdetailsFindAll();
    TmRegdetails persistTmRegdetails(TmRegdetails tmRegdetails);
    TmRegdetails mergeTmRegdetails(TmRegdetails tmRegdetails);
    void removeTmRegdetails(TmRegdetails tmRegdetails);
    List<TmRegdetails> getTmRegdetailsFindAll();
    
    
    TmOwnerdetails findTmOwnerdetailsById(Long ownerId);
    TmRegdetails findByVehicleNumber(String vehicleNo);
    List<TmOffenceDetails> getPendingOffencesByVehicleNo(String vehicleNo);
    TmOffenceDetails findTmOffenceDetailsById(Long offenceDetailId);
    public TmOwnerdetails findOwnerByPanCardNo(String pancardNo);

}
