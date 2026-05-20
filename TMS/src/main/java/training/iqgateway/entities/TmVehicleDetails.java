package training.iqgateway.entities;

import java.util.Date;
import java.util.List;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "TM_VEHICLEDETAILS")
public class TmVehicleDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "veh_seq")
    @SequenceGenerator(name = "veh_seq", sequenceName = "TM_VEH_ID_SEQ", allocationSize = 1)
    @Column(name = "VEH_ID")
    private Long vehId;

    @Column(name = "VEH_TYPE", nullable = false)
    private String vehType;

    @Column(name = "ENGINE_NO", nullable = false, unique = true)
    private String engineNo;

    @Column(name = "MODEL_NO", nullable = false)
    private String modelNo;

    @Column(name = "VEH_NAME", nullable = false)
    private String vehName;

    @Column(name = "VEH_COLOR")
    private String vehColor;

    @Column(name = "MANUFACTURER_NAME", nullable = false)
    private String manufacturerName;

    @Column(name = "DATE_OF_MANUFACTURE", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dateOfManufacture;

    @Column(name = "NO_OF_CYLINDERS")
    private Integer noOfCylinders;

    @Column(name = "CUBIC_CAPACITY")
    private Integer cubicCapacity;

    @Column(name = "FUEL_USED")
    private String fuelUsed;

    @OneToMany(mappedBy = "vehicle")
    @JsonManagedReference(value = "vehicle-registrations")
    private List<TmRegDetails> registrations;

    public TmVehicleDetails() { super(); }

    public TmVehicleDetails(Long vehId, String vehType, String engineNo, String modelNo,
                            String vehName, String vehColor, String manufacturerName, Date dateOfManufacture,
                            Integer noOfCylinders, Integer cubicCapacity, String fuelUsed) {
        this.vehId = vehId;
        this.vehType = vehType;
        this.engineNo = engineNo;
        this.modelNo = modelNo;
        this.vehName = vehName;
        this.vehColor = vehColor;
        this.manufacturerName = manufacturerName;
        this.dateOfManufacture = dateOfManufacture;
        this.noOfCylinders = noOfCylinders;
        this.cubicCapacity = cubicCapacity;
        this.fuelUsed = fuelUsed;
    }

    public TmVehicleDetails(String vehType, String engineNo, String modelNo,
                            String vehName, String vehColor, String manufacturerName, Date dateOfManufacture,
                            Integer noOfCylinders, Integer cubicCapacity, String fuelUsed) {
        this.vehType = vehType;
        this.engineNo = engineNo;
        this.modelNo = modelNo;
        this.vehName = vehName;
        this.vehColor = vehColor;
        this.manufacturerName = manufacturerName;
        this.dateOfManufacture = dateOfManufacture;
        this.noOfCylinders = noOfCylinders;
        this.cubicCapacity = cubicCapacity;
        this.fuelUsed = fuelUsed;
    }

    public Long getVehId() { return vehId; }
    public void setVehId(Long vehId) { this.vehId = vehId; }
    public String getVehType() { return vehType; }
    public void setVehType(String vehType) { this.vehType = vehType; }
    public String getEngineNo() { return engineNo; }
    public void setEngineNo(String engineNo) { this.engineNo = engineNo; }
    public String getModelNo() { return modelNo; }
    public void setModelNo(String modelNo) { this.modelNo = modelNo; }
    public String getVehName() { return vehName; }
    public void setVehName(String vehName) { this.vehName = vehName; }
    public String getVehColor() { return vehColor; }
    public void setVehColor(String vehColor) { this.vehColor = vehColor; }
    public String getManufacturerName() { return manufacturerName; }
    public void setManufacturerName(String manufacturerName) { this.manufacturerName = manufacturerName; }
    public Date getDateOfManufacture() { return dateOfManufacture; }
    public void setDateOfManufacture(Date dateOfManufacture) { this.dateOfManufacture = dateOfManufacture; }
    public Integer getNoOfCylinders() { return noOfCylinders; }
    public void setNoOfCylinders(Integer noOfCylinders) { this.noOfCylinders = noOfCylinders; }
    public Integer getCubicCapacity() { return cubicCapacity; }
    public void setCubicCapacity(Integer cubicCapacity) { this.cubicCapacity = cubicCapacity; }
    public String getFuelUsed() { return fuelUsed; }
    public void setFuelUsed(String fuelUsed) { this.fuelUsed = fuelUsed; }
    public List<TmRegDetails> getRegistrations() { return registrations; }
    public void setRegistrations(List<TmRegDetails> registrations) { this.registrations = registrations; }

    @Override
    public String toString() {
        return "TmVehicleDetails [vehId=" + vehId + ", vehType=" + vehType + ", engineNo=" + engineNo +
                ", modelNo=" + modelNo + ", vehName=" + vehName + ", vehColor=" + vehColor +
                ", manufacturerName=" + manufacturerName + ", dateOfManufacture=" + dateOfManufacture +
                ", noOfCylinders=" + noOfCylinders + ", cubicCapacity=" + cubicCapacity +
                ", fuelUsed=" + fuelUsed + "]";
    }
}
