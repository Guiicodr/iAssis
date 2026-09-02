import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    import warnings
    warnings.warn("OPENAI_API_KEY não definida. O módulo de IA não funcionará.")

client = OpenAI(api_key=OPENAI_API_KEY)


def _anonymize(texto: str) -> str:
    """Remove identificadores pessoais antes de enviar à OpenAI."""
    import re
    texto = re.sub(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b', '[CPF]', texto)       # CPF
    texto = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL]', texto)             # E-mail
    texto = re.sub(r'\(\d{2}\)\s?\d{4,5}-?\d{4}', '[TELEFONE]', texto)      # Telefone Brasil
    texto = re.sub(r'\b\d{2}/\d{2}/\d{4}\b', '[DATA]', texto)              # Datas
    texto = re.sub(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', '[NOME]', texto)  # Nomes simples (2 palavras)
    return texto


def gerar_resumo(texto: str):

    # Anonimiza dados sensíveis antes de enviar à API
    texto_anonimizado = _anonymize(texto)

    resposta = client.chat.completions.create(

        model="gpt-4.1-mini",

        messages=[
            {
                "role": "system",
                "content": (
                    "Você é um assistente especializado em resumir "
                    "atendimentos clínicos de psicologia. "
                    "Seja objetivo e profissional.\n"
                    "ATENÇÃO: NÃO inclua nomes de pacientes, CPFs, "
                    "telefones ou dados pessoais no resumo."
                )
            },
            {
                "role": "user",
                "content": texto_anonimizado
            }
        ]
    )

    return resposta.choices[0].message.content