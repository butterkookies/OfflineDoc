import os
from pathlib import Path
import tomllib
from dataclasses import dataclass

BASE_DIR = Path(__file__).resolve().parent.parent

@dataclass
class ServerConfig:
    host: str = "127.0.0.1"
    port: int = 8000

@dataclass
class ModelConfig:
    whisper_bin: Path = BASE_DIR / "bin" / "whisper-cli.exe"
    whisper_model: Path = BASE_DIR / "models" / "ggml-base.bin"
    whisper_initial_prompt: str = (
        "Magandang araw. Pasyente, barangay, sitio, lagnat, ubo, sipon, "
        "masakit ang ulo, BP, blood pressure, reseta, gamot, paracetamol, "
        "amoxicillin, follow-up, referral sa health center, RHU."
    )
    llama_server_url: str = "http://127.0.0.1:8081"
    llama_model: Path = BASE_DIR / "models" / "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf"

@dataclass
class StorageConfig:
    data_dir: Path = BASE_DIR / "data" / "visits"
    exports_dir: Path = BASE_DIR / "data" / "exports"
    keep_audio: bool = False

@dataclass
class AppConfig:
    server: ServerConfig
    models: ModelConfig
    storage: StorageConfig

def load_config() -> AppConfig:
    config_file = BASE_DIR / "config.toml"
    if not config_file.exists():
        config_file = BASE_DIR / "config.example.toml"

    data = {}
    if config_file.exists():
        try:
            with open(config_file, "rb") as f:
                data = tomllib.load(f)
        except Exception:
            data = {}

    server_data = data.get("server", {})
    models_data = data.get("models", {})
    storage_data = data.get("storage", {})

    server = ServerConfig(
        host=server_data.get("host", "127.0.0.1"),
        port=server_data.get("port", 8000),
    )

    default_whisper_model = (
        BASE_DIR / "models" / "ggml-small.bin"
        if (BASE_DIR / "models" / "ggml-small.bin").exists()
        else BASE_DIR / "models" / "ggml-base.bin"
    )

    models = ModelConfig(
        whisper_bin=Path(models_data.get("whisper_bin", BASE_DIR / "bin" / "whisper-cli.exe")),
        whisper_model=Path(models_data.get("whisper_model", default_whisper_model)),
        whisper_initial_prompt=models_data.get(
            "whisper_initial_prompt",
            "Ito ay konsultasyon sa Barangay Health Station. Si Tatay, Nanay, pasyente, "
            "mataas ang BP, blood pressure, lagnat, temperatura, ubo, sipon, "
            "masakit ang batok, nahihilo, uminom ng gamot, paracetamol, amoxicillin, "
            "follow-up sa Biyernes, referral sa RHU doktor.",
        ),
        llama_server_url=models_data.get("llama_server_url", "http://127.0.0.1:8081"),
        llama_model=Path(models_data.get("llama_model", BASE_DIR / "models" / "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf")),
    )

    storage = StorageConfig(
        data_dir=Path(storage_data.get("data_dir", BASE_DIR / "data" / "visits")),
        exports_dir=Path(storage_data.get("exports_dir", BASE_DIR / "data" / "exports")),
        keep_audio=storage_data.get("keep_audio", False),
    )

    # Ensure storage directories exist
    storage.data_dir.mkdir(parents=True, exist_ok=True)
    storage.exports_dir.mkdir(parents=True, exist_ok=True)

    return AppConfig(server=server, models=models, storage=storage)

config = load_config()
