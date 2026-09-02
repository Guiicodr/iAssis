import os
from datetime import datetime, timedelta
from urllib.request import urlopen
import json

from dotenv import load_dotenv
from jose import jwt, JWTError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL", "")

# Valida que SECRET_KEY é forte
def _validar_secret_key():
    key = SECRET_KEY
    if not key or key in (
        "iassis_super_secret_key_2026",
        "change-me",
        "secret",
        "",
    ):
        import warnings
        warnings.warn(
            "SECRET_KEY está fraca ou ausente. "
            "Gere uma chave forte com: python -c \"import secrets; print(secrets.token_hex(32))\""
        )

_validar_secret_key()


def get_jwks_key():
    """Busca a chave pública do Supabase para validar tokens JWT."""
    if not SUPABASE_URL:
        return None
    try:
        jwks_url = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"
        with urlopen(jwks_url, timeout=5) as resp:
            jwks = json.loads(resp.read())
        if "keys" in jwks and len(jwks["keys"]) > 0:
            from jose import jwk
            return jwk.construct(jwks["keys"][0])
    except Exception:
        pass
    return None


def criar_token(data: dict):
    dados = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    dados.update({"exp": expire})
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)


def validar_token_supabase(token: str):
    """Tenta validar o token como um JWT emitido pelo Supabase (RS256 com JWKS)."""
    key = get_jwks_key()
    if key is None:
        return None
    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        return payload
    except JWTError:
        return None


def validar_token_local(token: str):
    """Tenta validar o token como um JWT emitido localmente (HS256)."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None