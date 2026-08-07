from pydantic import BaseModel


class ResumoRequest(BaseModel):
    texto: str


class ResumoResponse(BaseModel):
    resumo: str