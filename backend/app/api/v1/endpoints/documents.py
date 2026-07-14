from typing import Any, List
from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.document import DocumentCreate, DocumentUpdate, Document, ResumeVersionCreate, ResumeVersion
from app.services.document_service import DocumentService
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[Document])
def list_documents(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """List all documents for the current user, newest first."""
    doc_service = DocumentService(db)
    return doc_service.list_documents(user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=Document)
def create_document(
    *,
    db: Session = Depends(deps.get_db),
    doc_in: DocumentCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Create a new document entry (URL-based; no file upload handled here)."""
    doc_service = DocumentService(db)
    return doc_service.create_document(doc_in=doc_in, user_id=current_user.id)

@router.get("/{id}", response_model=Document)
def read_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Get a document by ID."""
    doc_service = DocumentService(db)
    return doc_service.get_document(doc_id=id, user_id=current_user.id)

@router.put("/{id}", response_model=Document)
def update_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    doc_in: DocumentUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Update a document's title or type."""
    doc_service = DocumentService(db)
    return doc_service.update_document(doc_id=id, doc_in=doc_in, user_id=current_user.id)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """Delete a document and all its versions."""
    doc_service = DocumentService(db)
    doc_service.delete_document(doc_id=id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/{id}/versions/", response_model=List[ResumeVersion])
def list_resume_versions(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """List all resume versions for a document."""
    doc_service = DocumentService(db)
    return doc_service.list_resume_versions(doc_id=id, user_id=current_user.id)

@router.post("/{id}/versions/", response_model=ResumeVersion)
def add_resume_version(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    version_in: ResumeVersionCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """Add a new version to a document (provide a file_url)."""
    doc_service = DocumentService(db)
    return doc_service.add_resume_version(doc_id=id, version_in=version_in, user_id=current_user.id)

@router.delete("/{id}/versions/{version_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume_version(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    version_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Response:
    """Delete a specific version of a document."""
    doc_service = DocumentService(db)
    doc_service.delete_resume_version(doc_id=id, version_id=version_id, user_id=current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
