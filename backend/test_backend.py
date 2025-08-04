#!/usr/bin/env python3
"""
Script para probar el backend GPT-J
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_health():
    """Probar endpoint de salud"""
    print("🔍 Probando health check...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check exitoso:")
            print(f"   Status: {data['status']}")
            print(f"   Modelo cargado: {data['model_loaded']}")
            print(f"   Dispositivo: {data['device']}")
            print(f"   GPU disponible: {data['gpu_available']}")
            return True
        else:
            print(f"❌ Health check falló: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error conectando al backend: {e}")
        return False

def test_generation():
    """Probar generación de texto"""
    print("\n🤖 Probando generación de texto...")
    
    test_prompts = [
        "Hola, ¿cómo estás?",
        "Explica qué es la inteligencia artificial",
        "¿Puedes ayudarme con programación?"
    ]
    
    for prompt in test_prompts:
        print(f"\n📝 Prompt: {prompt}")
        try:
            start_time = time.time()
            response = requests.post(
                f"{BASE_URL}/generate",
                json={
                    "prompt": prompt,
                    "max_length": 100,
                    "temperature": 0.7
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                elapsed = time.time() - start_time
                print(f"✅ Respuesta generada en {elapsed:.2f}s:")
                print(f"   Texto: {data['generated_text'][:100]}...")
                print(f"   Modelo: {data['model_info']['type']}")
                print(f"   Dispositivo: {data['model_info']['device']}")
            else:
                print(f"❌ Error generando: {response.status_code}")
                print(f"   Detalle: {response.text}")
                
        except Exception as e:
            print(f"❌ Error en request: {e}")

def main():
    print("🧪 Probando Sigma AI GPT-J Backend")
    print("=" * 40)
    
    # Probar health check
    if not test_health():
        print("\n❌ Backend no disponible. Asegúrate de que esté corriendo:")
        print("   ./start.sh")
        return
    
    # Probar generación
    test_generation()
    
    print("\n✅ Pruebas completadas")

if __name__ == "__main__":
    main()