from fastapi import FastAPI

from app.routers import pacientes


app = FastAPI(
    title="IAssis API",
    description="Assistente inteligente para gestão clínica",
    version="1.0.0"
)


app.include_router(
    pacientes.router
)


@app.get("/")
def home():
    return {
        "message": "IAssis API funcionando!"
    }