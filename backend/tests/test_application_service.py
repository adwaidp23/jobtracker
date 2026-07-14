from fastapi import HTTPException
import pytest
from app.services.application_service import ApplicationService
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from app.models.application import ApplicationStatus
from app.models.opportunity import Opportunity

def test_application_lifecycle_and_state_machine(db):
    user_id = 1
    # Mock an opportunity
    opp = Opportunity(company_name="Test Co", role_name="Role", user_id=user_id)
    db.add(opp)
    db.commit()
    db.refresh(opp)

    service = ApplicationService(db)

    # Create application (starts at SAVED usually, but let's say we set it to PREPARING)
    app_in = ApplicationCreate(opportunity_id=opp.id, status=ApplicationStatus.PREPARING)
    app = service.create_application(app_in, user_id=user_id)
    
    assert app.id is not None
    assert app.status == ApplicationStatus.PREPARING
    
    # Check history (should have 1 entry)
    app_detail = service.get_application_detail(app.id, user_id=user_id)
    assert len(app_detail.history) == 1
    assert app_detail.history[0].new_status == ApplicationStatus.PREPARING

    # Valid transition: PREPARING -> APPLIED
    update_in = ApplicationUpdate(status=ApplicationStatus.APPLIED, reason="Submitted online")
    app = service.update_application_status(app.id, update_in, user_id=user_id)
    assert app.status == ApplicationStatus.APPLIED
    
    app_detail = service.get_application_detail(app.id, user_id=user_id)
    assert len(app_detail.history) == 2
    assert app_detail.history[0].old_status == ApplicationStatus.PREPARING  # ordered by desc timestamp
    assert app_detail.history[0].new_status == ApplicationStatus.APPLIED
    assert app_detail.history[0].reason == "Submitted online"

    # Invalid transition: APPLIED -> SAVED (backward)
    with pytest.raises(HTTPException) as excinfo:
        invalid_update = ApplicationUpdate(status=ApplicationStatus.SAVED)
        service.update_application_status(app.id, invalid_update, user_id=user_id)
    assert excinfo.value.status_code == 400
    assert "Invalid state transition" in excinfo.value.detail

    # Terminal state transition: APPLIED -> REJECTED
    reject_update = ApplicationUpdate(status=ApplicationStatus.REJECTED, reason="Did not pass resume screen")
    app = service.update_application_status(app.id, reject_update, user_id=user_id)
    assert app.status == ApplicationStatus.REJECTED

    # Invalid transition: REJECTED -> INTERVIEW (terminal states can't move forward)
    with pytest.raises(HTTPException) as excinfo:
        invalid_terminal = ApplicationUpdate(status=ApplicationStatus.INTERVIEW)
        service.update_application_status(app.id, invalid_terminal, user_id=user_id)
    assert excinfo.value.status_code == 400
