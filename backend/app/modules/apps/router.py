from fastapi import APIRouter

from app.modules.apps.sample.router import sample_router
from app.modules.apps.myfeature.router import myfeature_router

apps_router = APIRouter()

# Add app routers here
apps_router.include_router(sample_router)
apps_router.include_router(myfeature_router)
