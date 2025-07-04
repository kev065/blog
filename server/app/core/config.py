from pydantic import field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str = "your-secret-key-please-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str

    SQLALCHEMY_DATABASE_URI: str | None = None 

    model_config = SettingsConfigDict(env_file=".env")

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_uri(cls, v, info: ValidationInfo):
        if isinstance(v, str):
            return v

        data = info.data
        return (
            f"postgresql://{data['POSTGRES_USER']}:{data['POSTGRES_PASSWORD']}@"
            f"{data['POSTGRES_SERVER']}:{data['POSTGRES_PORT']}/{data['POSTGRES_DB']}"
        )


settings = Settings()
