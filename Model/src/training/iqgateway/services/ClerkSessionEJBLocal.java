package training.iqgateway.services;

import java.util.List;

import javax.ejb.Local;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmRegdetails;
import training.iqgateway.entities.TmUsermaster;
import training.iqgateway.entities.TmVehicledetails;

@Local
public interface ClerkSessionEJBLocal {
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
    
    TmOffence findTmOffenceById(Long offenceId);
    TmRegdetails findVehicleByNumber(String vehicleNo);
    TmRegdetails findByVehicleNumber(String vehicleNo);
    
    
    TmOwnerdetails findTmOwnerdetailsById(Long ownerId);
    void removeTmOwnerdetails(TmOwnerdetails owner);
    
    TmVehicledetails findTmVehicledetailsById(Long vehId);
    void removeTmVehicledetails(TmVehicledetails vehicle);
    
    TmUsermaster findTmUsermasterByUsername(String username);
    
    List<TmOffenceDetails> findPendingOffencesByVehicleNo(String vehicleNo);

}
