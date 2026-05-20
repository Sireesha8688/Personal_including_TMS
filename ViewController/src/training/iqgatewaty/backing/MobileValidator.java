package training.iqgateway.backing;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.validator.ValidatorException;

public class MobileValidator implements javax.faces.validator.Validator {
    public void validate(FacesContext context, UIComponent component, Object value) throws ValidatorException {
        String mobile = value == null ? null : value.toString();
        if (mobile == null || !mobile.matches("\\d{10}")) {
            throw new ValidatorException(new FacesMessage("Mobile number must be 10 digits."));
        }
    }
}
