from app.database.connection import engine, Base

from app.models.paciente import Paciente


Base.metadata.create_all(bind=engine)


print("Tabelas criadas!")