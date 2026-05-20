package training.iqgateway.dto;

import java.util.Date;

public class RegistrationDto {
    private Long appNo;
    private String vehNo;
    private Date dateOfPurchase;
    private String distributerName;
    private VehicleDto vehicle;
    private OwnerDto owner;
    // Getters and setters
    public Long getAppNo() { return appNo; }
    public void setAppNo(Long appNo) { this.appNo = appNo; }
    public String getVehNo() { return vehNo; }
    public void setVehNo(String vehNo) { this.vehNo = vehNo; }
    public Date getDateOfPurchase() { return dateOfPurchase; }
    public void setDateOfPurchase(Date dateOfPurchase) { this.dateOfPurchase = dateOfPurchase; }
    public String getDistributerName() { return distributerName; }
    public void setDistributerName(String distributerName) { this.distributerName = distributerName; }
    public VehicleDto getVehicle() { return vehicle; }
    public void setVehicle(VehicleDto vehicle) { this.vehicle = vehicle; }
    public OwnerDto getOwner() { return owner; }
    public void setOwner(OwnerDto owner) { this.owner = owner; }
}
