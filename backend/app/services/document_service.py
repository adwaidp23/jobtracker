from typing import List
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.models.document import Document, ResumeVersion
from app.schemas.document import DocumentCreate, DocumentUpdate, ResumeVersionCreate


class DocumentService:
    def __init__(self, db: Session):
        self.db = db

    # --- Documents ---

    def get_document(self, doc_id: int, user_id: int) -> Document:
        doc = self.db.query(Document).filter(Document.id == doc_id, Document.user_id == user_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        return doc

    def list_documents(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Document]:
        return (
            self.db.query(Document)
            .filter(Document.user_id == user_id)
            .options(joinedload(Document.resume_versions))
            .order_by(Document.upload_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_document(self, doc_in: DocumentCreate, user_id: int) -> Document:
        db_doc = Document(**doc_in.model_dump(), user_id=user_id)
        self.db.add(db_doc)
        self.db.commit()
        self.db.refresh(db_doc)
        return db_doc

    def update_document(self, doc_id: int, doc_in: DocumentUpdate, user_id: int) -> Document:
        db_doc = self.get_document(doc_id, user_id)
        update_data = doc_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_doc, field, value)
        self.db.commit()
        self.db.refresh(db_doc)
        return db_doc

    def delete_document(self, doc_id: int, user_id: int) -> None:
        db_doc = self.get_document(doc_id, user_id)
        self.db.delete(db_doc)
        self.db.commit()

    # --- Resume Versions ---

    def list_resume_versions(self, doc_id: int, user_id: int) -> List[ResumeVersion]:
        self.get_document(doc_id, user_id)  # Verifies ownership
        return (
            self.db.query(ResumeVersion)
            .filter(ResumeVersion.document_id == doc_id)
            .order_by(ResumeVersion.version_number.desc())
            .all()
        )

    def add_resume_version(self, doc_id: int, version_in: ResumeVersionCreate, user_id: int) -> ResumeVersion:
        self.get_document(doc_id, user_id)  # Verifies ownership
        db_version = ResumeVersion(**version_in.model_dump(), document_id=doc_id)
        self.db.add(db_version)
        self.db.commit()
        self.db.refresh(db_version)
        return db_version

    def delete_resume_version(self, doc_id: int, version_id: int, user_id: int) -> None:
        self.get_document(doc_id, user_id)  # Verifies ownership
        version = self.db.query(ResumeVersion).filter(
            ResumeVersion.id == version_id, ResumeVersion.document_id == doc_id
        ).first()
        if not version:
            raise HTTPException(status_code=404, detail="Resume version not found")
        self.db.delete(version)
        self.db.commit()
