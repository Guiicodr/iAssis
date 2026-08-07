import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def gerar_resumo(texto: str):

    resposta = client.chat.completions.create(

        model="gpt-4.1-mini",

        messages=[
            {
                "role": "system",
                "content": (
                    "Você é um assistente especializado em resumir "
                    "atendimentos clínicos de psicologia. "
                    "Seja objetivo e profissional."
                )
            },
            {
                "role": "user",
                "content": texto
            }
        ]
    )

    return resposta.choices[0].message.content