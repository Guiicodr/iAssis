from app.database.connection import engine, Base

from app.models.paciente import Paciente
from app.models.profissional import Profissional
from app.models.consulta import Consulta

Base.metadata.create_all(bind=engine)

print("Tabelas criadas!")