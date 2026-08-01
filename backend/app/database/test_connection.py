from app.database.connection import engine


try:
    connection = engine.connect()

    print("Banco conectado com sucesso!")

    connection.close()

except Exception as error:
    print("Erro ao conectar:")
    print(error)