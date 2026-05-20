package training.iqgateway.entities;

import java.io.Serializable;

import java.sql.Timestamp;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@NamedQueries({
  @NamedQuery(name = "TmVehicledetails.findAll", query = "select o from TmVehicledetails o")
})
@Table(name = "TM_VEHICLEDETAILS")
public class TmVehicledetails implements Serializable {
    @Column(name="CUBIC_CAPACITY")
    private Long cubicCapacity;
    @Column(name="DATE_OF_MANUFACTURE", nullable = false)
    private Timestamp dateOfManufacture;
    @Column(name="ENGINE_NO", nullable = false, unique = true, length = 50)
    private String engineNo;
    @Column(name="FUEL_USED", length = 20)
    private String fuelUsed;
    @Column(name="MANUFACTURER_NAME", nullable = false, length = 50)
    private String manufacturerName;
    @Column(name="MODEL_NO", nullable = false, length = 50)
    private String modelNo;
    @Column(name="NO_OF_CYLINDERS")
    private Long noOfCylinders;
    @Column(name="VEH_COLOR", length = 50)
    private String vehColor;
    @Id
    @Column(name="VEH_ID", nullable = false)
    private Long vehId;
    @Column(name="VEH_NAME", nullable = false, length = 50)
    private String vehName;
    @Column(name="VEH_TYPE", nullable = false, length = 50)
    private String vehType;
    @OneToMany(mappedBy = "tmVehicledetails")
    private List<TmRegdetails> tmRegdetailsList;

    public TmVehicledetails() {
    }

    public TmVehicledetails(Long cubicCapacity, Timestamp dateOfManufacture,
                            String engineNo, String fuelUsed,
                            String manufacturerName, String modelNo,
                            Long noOfCylinders, String vehColor, Long vehId,
                            String vehName, String vehType) {
        this.cubicCapacity = cubicCapacity;
        this.dateOfManufacture = dateOfManufacture;
        this.engineNo = engineNo;
        this.fuelUsed = fuelUsed;
        this.manufacturerName = manufacturerName;
        this.modelNo = modelNo;
        this.noOfCylinders = noOfCylinders;
        this.vehColor = vehColor;
        this.vehId = vehId;
        this.vehName = vehName;
        this.vehType = vehType;
    }

    public Long getCubicCapacity() {
        return cubicCapacity;
    }

    public void setCubicCapacity(Long cubicCapacity) {
        this.cubicCapacity = cubicCapacity;
    }

    public Timestamp getDateOfManufacture() {
        return dateOfManufacture;
    }

    public void setDateOfManufacture(Timestamp dateOfManufacture) {
        this.dateOfManufacture = dateOfManufacture;
    }

    public String getEngineNo() {
        return engineNo;
    }

    public void setEngineNo(String engineNo) {
        this.engineNo = engineNo;
    }

    public String getFuelUsed() {
        return fuelUsed;
    }

    public void setFuelUsed(String fuelUsed) {
        this.fuelUsed = fuelUsed;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    public String getModelNo() {
        return modelNo;
    }

    public void setModelNo(String modelNo) {
        this.modelNo = modelNo;
    }

    public Long getNoOfCylinders() {
        return noOfCylinders;
    }

    public void setNoOfCylinders(Long noOfCylinders) {
        this.noOfCylinders = noOfCylinders;
    }

    public String getVehColor() {
        return vehColor;
    }

    public void setVehColor(String vehColor) {
        this.vehColor = vehColor;
    }

    public Long getVehId() {
        return vehId;
    }

    public void setVehId(Long vehId) {
        this.vehId = vehId;
    }

    public String getVehName() {
        return vehName;
    }

    public void setVehName(String vehName) {
        this.vehName = vehName;
    }

    public String getVehType() {
        return vehType;
    }

    public void setVehType(String vehType) {
        this.vehType = vehType;
    }

    public List<TmRegdetails> getTmRegdetailsList() {
        return tmRegdetailsList;
    }

    public void setTmRegdetailsList(List<TmRegdetails> tmRegdetailsList) {
        this.tmRegdetailsList = tmRegdetailsList;
    }

    public TmRegdetails addTmRegdetails(TmRegdetails tmRegdetails) {
        getTmRegdetailsList().add(tmRegdetails);
        tmRegdetails.setTmVehicledetails(this);
        return tmRegdetails;
    }

    public TmRegdetails removeTmRegdetails(TmRegdetails tmRegdetails) {
        getTmRegdetailsList().remove(tmRegdetails);
        tmRegdetails.setTmVehicledetails(null);
        return tmRegdetails;
    }
}
