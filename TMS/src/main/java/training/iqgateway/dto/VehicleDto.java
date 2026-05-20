package training.iqgateway.dto;

import java.util.Date;

public class VehicleDto {
    private Long vehId;
    private String vehName;
    private String engineNo;
    private String modelNo;
    private String vehType;
    private String manufacturerName;
    private Date dateOfManufacture;

    // Getters and setters
    public Long getVehId() { return vehId; }
    public void setVehId(Long vehId) { this.vehId = vehId; }
    public String getVehName() { return vehName; }
    public void setVehName(String vehName) { this.vehName = vehName; }
    public String getEngineNo() { return engineNo; }
    public void setEngineNo(String engineNo) { this.engineNo = engineNo; }
    public String getModelNo() { return modelNo; }
    public void setModelNo(String modelNo) { this.modelNo = modelNo; }
    public String getVehType() { return vehType; }
    public void setVehType(String vehType) { this.vehType = vehType; }
    public String getManufacturerName() { return manufacturerName; }
    public void setManufacturerName(String manufacturerName) { this.manufacturerName = manufacturerName; }
    public Date getDateOfManufacture() { return dateOfManufacture; }
    public void setDateOfManufacture(Date dateOfManufacture) { this.dateOfManufacture = dateOfManufacture; }
}
