package training.iqgatewaty.backing;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import training.iqgateway.entities.TmVehicledetails;
import training.iqgateway.services.RTOSessionEJBLocal;

public class VehicleRegistrationBean implements Serializable {

    private Long cubicCapacity;
    private Date dateOfManufacture;
    private String engineNo;
    private String fuelUsed;
    private String manufacturerName;
    private String modelNo;
    private Long noOfCylinders;
    private String vehColor;
    private String vehName;
    private String vehType;
    private String message;

    // Getters and setters for all fields except vehId
    public Long getCubicCapacity() { return cubicCapacity; }
    public void setCubicCapacity(Long cubicCapacity) { this.cubicCapacity = cubicCapacity; }

    public Date getDateOfManufacture() { return dateOfManufacture; }
    public void setDateOfManufacture(Date dateOfManufacture) { this.dateOfManufacture = dateOfManufacture; }

    public String getEngineNo() { return engineNo; }
    public void setEngineNo(String engineNo) { this.engineNo = engineNo; }

    public String getFuelUsed() { return fuelUsed; }
    public void setFuelUsed(String fuelUsed) { this.fuelUsed = fuelUsed; }

    public String getManufacturerName() { return manufacturerName; }
    public void setManufacturerName(String manufacturerName) { this.manufacturerName = manufacturerName; }

    public String getModelNo() { return modelNo; }
    public void setModelNo(String modelNo) { this.modelNo = modelNo; }

    public Long getNoOfCylinders() { return noOfCylinders; }
    public void setNoOfCylinders(Long noOfCylinders) { this.noOfCylinders = noOfCylinders; }

    public String getVehColor() { return vehColor; }
    public void setVehColor(String vehColor) { this.vehColor = vehColor; }

    public String getVehName() { return vehName; }
    public void setVehName(String vehName) { this.vehName = vehName; }

    public String getVehType() { return vehType; }
    public void setVehType(String vehType) { this.vehType = vehType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    private RTOSessionEJBLocal getSessionBean() throws NamingException {
        InitialContext ic = new InitialContext();
        return (RTOSessionEJBLocal) ic.lookup("java:comp/env/ejb/local/RTOSessionEJB");
    }

    public String registerVehicle() {
        try {
            RTOSessionEJBLocal sessionBean = getSessionBean();

            TmVehicledetails vehicle = new TmVehicledetails();

            // Do NOT set vehId here; DB sequence will generate it
            vehicle.setVehName(vehName);
            vehicle.setVehType(vehType);
            vehicle.setManufacturerName(manufacturerName);
            vehicle.setModelNo(modelNo);
            vehicle.setEngineNo(engineNo);
            vehicle.setDateOfManufacture(new Timestamp(dateOfManufacture.getTime()));
            vehicle.setFuelUsed(fuelUsed);
            vehicle.setCubicCapacity(cubicCapacity);
            vehicle.setNoOfCylinders(noOfCylinders);
            vehicle.setVehColor(vehColor);

            sessionBean.persistTmVehicledetails(vehicle);

            // After persist, vehId should be populated by JPA
            //Long generatedVehId = vehicle.getVehId();

            message = "Vehicle registered successfully";
            clearFields();

        } catch (Exception e) {
            message = "Error registering vehicle: " + e.getMessage();
            e.printStackTrace();
        }
        return null;
    }

    private void clearFields() {
        vehName = null;
        vehType = null;
        manufacturerName = null;
        modelNo = null;
        engineNo = null;
        dateOfManufacture = null;
        fuelUsed = null;
        cubicCapacity = null;
        noOfCylinders = null;
        vehColor = null;
    }
}
