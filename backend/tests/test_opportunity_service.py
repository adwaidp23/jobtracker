from fastapi import HTTPException
import pytest
from app.services.opportunity_service import OpportunityService
from app.schemas.opportunity import OpportunityCreate
from app.models.opportunity import Opportunity

def test_create_and_list_opportunities(db):
    user_id = 1
    service = OpportunityService(db)
    
    # Create opportunity
    opp_in = OpportunityCreate(
        company_name="Test Company",
        role_name="Software Engineer",
        source_platform="LinkedIn"
    )
    opp = service.create_opportunity(opp_in, user_id=user_id)
    assert opp.id is not None
    assert opp.company_name == "Test Company"
    assert opp.user_id == user_id

    # List opportunities
    opps = service.list_opportunities(user_id=user_id)
    assert len(opps) == 1
    assert opps[0].id == opp.id

def test_opportunity_ownership(db):
    user_id_1 = 1
    user_id_2 = 2
    service = OpportunityService(db)
    
    # Create opportunity for user 1
    opp_in = OpportunityCreate(company_name="User 1 Company", role_name="Role")
    opp = service.create_opportunity(opp_in, user_id=user_id_1)
    
    # User 2 tries to get the opportunity
    with pytest.raises(HTTPException) as excinfo:
        service.get_opportunity(opp.id, user_id=user_id_2)
    assert excinfo.value.status_code == 404
    
    # User 2 tries to delete the opportunity
    with pytest.raises(HTTPException) as excinfo:
        service.delete_opportunity(opp.id, user_id=user_id_2)
    assert excinfo.value.status_code == 404

    # User 1 successfully deletes the opportunity
    service.delete_opportunity(opp.id, user_id=user_id_1)
    
    # Should not be found anymore
    with pytest.raises(HTTPException) as excinfo:
        service.get_opportunity(opp.id, user_id=user_id_1)
    assert excinfo.value.status_code == 404
