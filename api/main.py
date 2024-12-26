from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, UUID4
from typing import List
import uvicorn
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 환경에서는 구체적인 origin으로 변경
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic 모델
class Song(BaseModel):
    title: str
    artist: str
    album_cover_url: str
    youtube_id: str

class Recipient(BaseModel):
    id: UUID4
    name: str
    sub_name: str
    decoration: str
    month: int
    letter: str
    keywords: List[str]
    song: Song

class BeforeRecipient(BaseModel):
    id: UUID4
    name: str
    sub_name: str

# 새로운 Pydantic 모델 추가
class CreateSong(BaseModel):
    title: str
    artist: str
    album_cover_url: str
    youtube_id: str

class CreateRecipient(BaseModel):
    name: str
    sub_name: str
    decoration: str
    month: int
    letter: str
    keywords: List[str]
    password: str
    song: CreateSong

# 데이터베이스 연결 설정
async def get_db_pool():
    return await asyncpg.create_pool(
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )

@app.get("/recipients/{uuid}/before", response_model=BeforeRecipient)
async def get_before_recipient(uuid: UUID4):
    pool = await get_db_pool()
    try:
        async with pool.acquire() as conn:
            recipient = await conn.fetchrow("""
                SELECT id, name, sub_name
                FROM recipients
                WHERE id = $1
            """, uuid)
            
            if not recipient:
                raise HTTPException(status_code=404, detail="Recipient not found")
            
            return {
                "id": recipient["id"],
                "name": recipient["name"],
                "sub_name": recipient["sub_name"]
            }
    finally:
        await pool.close()

@app.post("/recipients", response_model=Recipient)
async def create_recipient(recipient: CreateRecipient):
    pool = await get_db_pool()
    try:
        async with pool.acquire() as conn:
            async with conn.transaction():
                recipient_id = await conn.fetchval("""
                    INSERT INTO recipients (
                        name, sub_name, decoration, month, letter, keywords, password
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id
                """, recipient.name, recipient.sub_name, recipient.decoration, 
                    recipient.month, recipient.letter, recipient.keywords,
                    recipient.password)

                await conn.execute("""
                    INSERT INTO songs (
                        recipient_id, title, artist, album_cover_url, youtube_id
                    ) VALUES ($1, $2, $3, $4, $5)
                """, recipient_id, recipient.song.title, recipient.song.artist, 
                    recipient.song.album_cover_url, recipient.song.youtube_id)

                created_recipient = await conn.fetchrow("""
                    SELECT r.*, s.title, s.artist, s.album_cover_url, s.youtube_id
                    FROM recipients r
                    LEFT JOIN songs s ON r.id = s.recipient_id
                    WHERE r.id = $1
                """, recipient_id)

                return {
                    "id": created_recipient["id"],
                    "name": created_recipient["name"],
                    "sub_name": created_recipient["sub_name"],
                    "decoration": created_recipient["decoration"],
                    "month": created_recipient["month"],
                    "letter": created_recipient["letter"],
                    "keywords": created_recipient["keywords"],
                    "song": {
                        "title": created_recipient["title"],
                        "artist": created_recipient["artist"],
                        "album_cover_url": created_recipient["album_cover_url"],
                        "youtube_id": created_recipient["youtube_id"]
                    }
                }
    finally:
        await pool.close()

# 비밀번호 검증을 위한 요청 모델
class PasswordVerification(BaseModel):
    password: str

@app.post("/recipients/{uuid}/password", response_model=Recipient)
async def verify_recipient_password(uuid: UUID4, verification: PasswordVerification):
    pool = await get_db_pool()
    try:
        async with pool.acquire() as conn:
            # 비밀번호 검증
            stored_password = await conn.fetchval("""
                SELECT password
                FROM recipients
                WHERE id = $1
            """, uuid)

            if stored_password != verification.password:
                raise HTTPException(status_code=401, detail="Invalid password")

            # 비밀번호가 일치하면 전체 데이터 조회
            recipient = await conn.fetchrow("""
                SELECT r.*, s.title, s.artist, s.album_cover_url, s.youtube_id
                FROM recipients r
                LEFT JOIN songs s ON r.id = s.recipient_id
                WHERE r.id = $1
            """, uuid)

            return {
                "id": recipient["id"],
                "name": recipient["name"],
                "sub_name": recipient["sub_name"],
                "decoration": recipient["decoration"],
                "month": recipient["month"],
                "letter": recipient["letter"],
                "keywords": recipient["keywords"],
                "song": {
                    "title": recipient["title"],
                    "artist": recipient["artist"],
                    "album_cover_url": recipient["album_cover_url"],
                    "youtube_id": recipient["youtube_id"]
                }
            }
    finally:
        await pool.close()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True)