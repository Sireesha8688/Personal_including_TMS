package cps.entities;

import lombok.Data;

@Data
public class PreAuthorization {
    private String responseDateTime;
    private Integer approvedAmount;
    private String insurerComments;
}