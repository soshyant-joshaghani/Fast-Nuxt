from fastapi import APIRouter

from app.modules.base.schemas import Message

myfeature_router = APIRouter(prefix="/myfeature", tags=["[APPS] Myfeature"])


@myfeature_router.get("/", response_model=Message)
def myfeature_root() -> Message:
    return Message(message="Myfeature module")
