from pydantic import BaseModel, Field


class ResumoRequest(BaseModel):
    texto: str = Field(
        ...,
        min_length=10,
        max_length=20000,
        description="Texto do atendimento clínico (10 a 20.000 caracteres)"
    )


class ResumoResponse(BaseModel):
    resumo: str