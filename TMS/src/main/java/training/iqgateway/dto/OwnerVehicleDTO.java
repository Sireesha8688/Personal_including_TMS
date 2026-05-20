package training.iqgateway.dto;

import training.iqgateway.entities.TmOwnerDetails;
import training.iqgateway.entities.TmRegDetails;

public class OwnerVehicleDTO {
    private TmOwnerDetails owner;
    private TmRegDetails registration;

    public OwnerVehicleDTO() {}

    public OwnerVehicleDTO(TmOwnerDetails owner, TmRegDetails registration) {
        this.owner = owner;
        this.registration = registration;
    }

    public TmOwnerDetails getOwner() {
        return owner;
    }

    public void setOwner(TmOwnerDetails owner) {
        this.owner = owner;
    }

    public TmRegDetails getRegistration() {
        return registration;
    }

    public void setRegistration(TmRegDetails registration) {
        this.registration = registration;
    }
}
