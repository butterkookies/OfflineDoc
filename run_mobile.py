from pathlib import Path
import asyncio
import socket
import uvicorn
from server import app

def ensure_ssl_certs():
    cert_path = Path("cert.pem")
    key_path = Path("key.pem")
    if not cert_path.exists() or not key_path.exists():
        print("[OfflineDoc] Generating self-signed SSL certificate for mobile HTTPS...")
        try:
            import datetime
            from cryptography import x509
            from cryptography.x509.oid import NameOID
            from cryptography.hazmat.primitives import hashes
            from cryptography.hazmat.primitives.asymmetric import rsa
            from cryptography.hazmat.primitives import serialization

            key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
            name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "OfflineDoc Local")])
            cert = (
                x509.CertificateBuilder()
                .subject_name(name)
                .issuer_name(name)
                .public_key(key.public_key())
                .serial_number(x509.random_serial_number())
                .not_valid_before(datetime.datetime.now(datetime.timezone.utc))
                .not_valid_after(datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=365))
                .sign(key, hashes.SHA256())
            )
            key_path.write_bytes(
                key.private_bytes(
                    encoding=serialization.Encoding.PEM,
                    format=serialization.PrivateFormat.TraditionalOpenSSL,
                    encryption_algorithm=serialization.NoEncryption(),
                )
            )
            cert_path.write_bytes(cert.public_bytes(serialization.Encoding.PEM))
            print("[OfflineDoc] SSL certificates generated successfully.")
        except Exception as e:
            print(f"[OfflineDoc] Warning: Could not auto-generate SSL certificates: {e}")

def get_lan_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "192.168.254.129"

async def main():
    ensure_ssl_certs()
    lan_ip = get_lan_ip()
    print("=" * 70)
    print(" OFFLINEDOC MOBILE & LOCAL NETWORK ACCESS")
    print("=" * 70)
    print(f" Localhost (Laptop):")
    print(f"   -> http://127.0.0.1:8000")
    print(f" Mobile / LAN (Standard HTTP - Quick View & Demo Scenarios):")
    print(f"   -> http://{lan_ip}:8000")
    print(f" Mobile / LAN (Secure HTTPS - Full Mobile Microphone Recording):")
    print(f"   -> https://{lan_ip}:8443")
    print("=" * 70)

    config_http = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
    server_http = uvicorn.Server(config_http)

    config_https = uvicorn.Config(
        app,
        host="0.0.0.0",
        port=8443,
        ssl_keyfile="key.pem",
        ssl_certfile="cert.pem",
        log_level="info"
    )
    server_https = uvicorn.Server(config_https)

    await asyncio.gather(server_http.serve(), server_https.serve())

if __name__ == "__main__":
    asyncio.run(main())
