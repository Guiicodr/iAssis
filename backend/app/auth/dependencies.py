from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.auth.auth import validar_token_supabase, validar_token_local

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    # 1. Tenta validar como token do Supabase (RS256 via JWKS)
    payload = validar_token_supabase(token)
    if payload:
        return payload

    # 2. Fallback: tenta validar como token local (HS256)
    payload = validar_token_local(token)
    if payload:
        return payload

    # 3. Nenhum válido
    raise HTTPException(
        status_code=401,
        detail="Token inválido ou expirado"
    )