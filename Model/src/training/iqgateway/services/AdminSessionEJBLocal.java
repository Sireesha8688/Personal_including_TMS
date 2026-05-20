package training.iqgateway.services;

import java.util.List;

import javax.ejb.Local;

import training.iqgateway.entities.TmRolemaster;
import training.iqgateway.entities.TmUsermaster;

@Local
public interface AdminSessionEJBLocal {
    Object queryByRange(String jpqlStmt, int firstResult, int maxResults);

    TmUsermaster persistTmUsermaster(TmUsermaster tmUsermaster);

    TmUsermaster mergeTmUsermaster(TmUsermaster tmUsermaster);

    void removeTmUsermaster(TmUsermaster tmUsermaster);

    List<TmUsermaster> getTmUsermasterFindAll();

    TmRolemaster persistTmRolemaster(TmRolemaster tmRolemaster);

    TmRolemaster mergeTmRolemaster(TmRolemaster tmRolemaster);

    void removeTmRolemaster(TmRolemaster tmRolemaster);

    List<TmRolemaster> getTmRolemasterFindAll();
}
