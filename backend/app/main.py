from fastapi import FastAPI

from app.routers import pacientes
from app.routers import profissionais
from app.routers import consultas
from app.routers import ia
from app.routers import auth

from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="IAssis API",
    description="Assistente inteligente para gestão clínica",
    version="1.0.0"
)


def custom_openapi():

    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    openapi_schema["security"] = [
        {
            "BearerAuth": []
        }
    ]

    app.openapi_schema = openapi_schema

    return app.openapi_schema


app.openapi = custom_openapi

app.include_router(pacientes.router)
app.include_router(profissionais.router)
app.include_router(consultas.router)
app.include_router(ia.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return {
        "message": "IAssis API funcionando!"
    }