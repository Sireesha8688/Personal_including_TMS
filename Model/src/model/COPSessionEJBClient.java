package model;

import java.util.Hashtable;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;

import javax.naming.NamingException;

import training.iqgateway.entities.TmOffence;
import training.iqgateway.entities.TmOffenceDetails;
import training.iqgateway.entities.TmOwnerdetails;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.services.COPSessionEJB;

public class COPSessionEJBClient {
    public static void main(String [] args) {
        try {
            final Context context = getInitialContext();
            COPSessionEJB cOPSessionEJB = (COPSessionEJB)context.lookup("TMS-Using JEE-Model-COPSessionEJB#training.iqgateway.services.COPSessionEJB");
            for (TmOffence tmoffence : (List<TmOffence>)cOPSessionEJB.getTmOffenceFindAll()) {
                printTmOffence(tmoffence);
            }
            for (TmVehicledetails tmvehicledetails : (List<TmVehicledetails>)cOPSessionEJB.getTmVehicledetailsFindAll()) {
                printTmVehicledetails(tmvehicledetails);
            }
            for (TmOffenceDetails tmoffencedetails : (List<TmOffenceDetails>)cOPSessionEJB.getTmOffenceDetailsFindAll()) {
                printTmOffenceDetails(tmoffencedetails);
            }
            for (TmOwnerdetails tmownerdetails : (List<TmOwnerdetails>)cOPSessionEJB.getTmOwnerdetailsFindAll()) {
                printTmOwnerdetails(tmownerdetails);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private static void printTmOffence(TmOffence tmoffence) {
        System.out.println( "offenceId = " + tmoffence.getOffenceId() );
        System.out.println( "offenceType = " + tmoffence.getOffenceType() );
        System.out.println( "penalty = " + tmoffence.getPenalty() );
        System.out.println( "vehType = " + tmoffence.getVehType() );
        System.out.println( "tmOffenceDetailsList = " + tmoffence.getTmOffenceDetailsList() );
    }

    private static void printTmVehicledetails(TmVehicledetails tmvehicledetails) {
        System.out.println( "cubicCapacity = " + tmvehicledetails.getCubicCapacity() );
        System.out.println( "dateOfManufacture = " + tmvehicledetails.getDateOfManufacture() );
        System.out.println( "engineNo = " + tmvehicledetails.getEngineNo() );
        System.out.println( "fuelUsed = " + tmvehicledetails.getFuelUsed() );
        System.out.println( "manufacturerName = " + tmvehicledetails.getManufacturerName() );
        System.out.println( "modelNo = " + tmvehicledetails.getModelNo() );
        System.out.println( "noOfCylinders = " + tmvehicledetails.getNoOfCylinders() );
        System.out.println( "vehColor = " + tmvehicledetails.getVehColor() );
        System.out.println( "vehId = " + tmvehicledetails.getVehId() );
        System.out.println( "vehName = " + tmvehicledetails.getVehName() );
        System.out.println( "vehType = " + tmvehicledetails.getVehType() );
        System.out.println( "tmRegdetailsList = " + tmvehicledetails.getTmRegdetailsList() );
    }

    private static void printTmOffenceDetails(TmOffenceDetails tmoffencedetails) {
        System.out.println( "image = " + tmoffencedetails.getImage() );
        System.out.println( "offenceDetailId = " + tmoffencedetails.getOffenceDetailId() );
        System.out.println( "offenceStatus = " + tmoffencedetails.getOffenceStatus() );
        System.out.println( "place = " + tmoffencedetails.getPlace() );
        System.out.println( "time = " + tmoffencedetails.getTime() );
        System.out.println( "tmUsermaster = " + tmoffencedetails.getTmUsermaster() );
        System.out.println( "tmOffence = " + tmoffencedetails.getTmOffence() );
        System.out.println( "tmRegdetails = " + tmoffencedetails.getTmRegdetails() );
    }

    private static void printTmOwnerdetails(TmOwnerdetails tmownerdetails) {
        System.out.println( "addProofName = " + tmownerdetails.getAddProofName() );
        System.out.println( "dateofbirth = " + tmownerdetails.getDateofbirth() );
        System.out.println( "fname = " + tmownerdetails.getFname() );
        System.out.println( "gender = " + tmownerdetails.getGender() );
        System.out.println( "landlineNo = " + tmownerdetails.getLandlineNo() );
        System.out.println( "lname = " + tmownerdetails.getLname() );
        System.out.println( "mobileNo = " + tmownerdetails.getMobileNo() );
        System.out.println( "occupation = " + tmownerdetails.getOccupation() );
        System.out.println( "ownerId = " + tmownerdetails.getOwnerId() );
        System.out.println( "pancardNo = " + tmownerdetails.getPancardNo() );
        System.out.println( "permAddr = " + tmownerdetails.getPermAddr() );
        System.out.println( "pincode = " + tmownerdetails.getPincode() );
        System.out.println( "tempAddr = " + tmownerdetails.getTempAddr() );
        System.out.println( "tmRegdetailsList = " + tmownerdetails.getTmRegdetailsList() );
    }

    private static Context getInitialContext() throws NamingException {
        Hashtable env = new Hashtable();
        // WebLogic Server 10.x connection details
        env.put( Context.INITIAL_CONTEXT_FACTORY, "weblogic.jndi.WLInitialContextFactory" );
        env.put(Context.PROVIDER_URL, "t3://localhost:7101");
        return new InitialContext( env );
    }
}
