package training.iqgateway.entities;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import javax.persistence.*;

@Entity
@NamedQueries({
    @NamedQuery(name = "TmRegdetails.findAll", query = "select o from TmRegdetails o")
})
@Table(name = "TM_REGDETAILS")
public class TmRegdetails implements Serializable {
    @Column(name="APP_NO", nullable = false)
    private Long appNo;
    @Column(name="DATE_OF_PURCHASE", nullable = false)
    private Timestamp dateOfPurchase;
    @Column(name="DISTRUBUTER_NAME", nullable = false, length = 200)
    private String distrubuterName;
    @Id
    @Column(name="VEH_NO", nullable = false, length = 20)
    private String vehNo;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "OWNER_ID")
    private TmOwnerdetails tmOwnerdetails;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "VEH_ID")
    private TmVehicledetails tmVehicledetails;
    @OneToMany(mappedBy = "tmRegdetails", fetch = FetchType.EAGER)
    private List<TmOffenceDetails> tmOffenceDetailsList;

    public TmRegdetails() {
    }

    public TmRegdetails(Long appNo, Timestamp dateOfPurchase,
                        String distrubuterName, TmOwnerdetails tmOwnerdetails,
                        TmVehicledetails tmVehicledetails,
                        String vehNo) {
        this.appNo = appNo;
        this.dateOfPurchase = dateOfPurchase;
        this.distrubuterName = distrubuterName;
        this.tmOwnerdetails = tmOwnerdetails;
        this.tmVehicledetails = tmVehicledetails;
        this.vehNo = vehNo;
    }

    public Long getAppNo() {
        return appNo;
    }

    public void setAppNo(Long appNo) {
        this.appNo = appNo;
    }

    public Timestamp getDateOfPurchase() {
        return dateOfPurchase;
    }

    public void setDateOfPurchase(Timestamp dateOfPurchase) {
        this.dateOfPurchase = dateOfPurchase;
    }

    public String getDistrubuterName() {
        return distrubuterName;
    }

    public void setDistrubuterName(String distrubuterName) {
        this.distrubuterName = distrubuterName;
    }

    public String getVehNo() {
        return vehNo;
    }

    public void setVehNo(String vehNo) {
        this.vehNo = vehNo;
    }

    public TmOwnerdetails getTmOwnerdetails() {
        return tmOwnerdetails;
    }

    public void setTmOwnerdetails(TmOwnerdetails tmOwnerdetails) {
        this.tmOwnerdetails = tmOwnerdetails;
    }

    public TmVehicledetails getTmVehicledetails() {
        return tmVehicledetails;
    }

    public void setTmVehicledetails(TmVehicledetails tmVehicledetails) {
        this.tmVehicledetails = tmVehicledetails;
    }

    public List<TmOffenceDetails> getTmOffenceDetailsList() {
        return tmOffenceDetailsList;
    }

    public void setTmOffenceDetailsList(List<TmOffenceDetails> tmOffenceDetailsList) {
        this.tmOffenceDetailsList = tmOffenceDetailsList;
    }

    public TmOffenceDetails addTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        getTmOffenceDetailsList().add(tmOffenceDetails);
        tmOffenceDetails.setTmRegdetails(this);
        return tmOffenceDetails;
    }

    public TmOffenceDetails removeTmOffenceDetails(TmOffenceDetails tmOffenceDetails) {
        getTmOffenceDetailsList().remove(tmOffenceDetails);
        tmOffenceDetails.setTmRegdetails(null);
        return tmOffenceDetails;
    }
}
