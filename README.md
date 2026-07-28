# ⚡ Kiro PolyGlot Engine

> **AWS Serverless Full-System Semantic Transpiler**  
> Modernización automatizada de monolitos legados en Java Spring Boot hacia arquitecturas Serverless ultraligeras en AWS Rust y TypeScript con Amazon Bedrock.

---

## 🔑 Configuración de Variables de Entorno (`.env`)

El proyecto incluye un archivo de plantilla **`.env.example`**. Para configurar tus credenciales de AWS Bedrock localmente:

1. Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Agrega tus credenciales y configuración de AWS Bedrock:
   ```env
   VITE_AWS_REGION=us-east-1
   VITE_AWS_ACCESS_KEY_ID=tu_access_key_id
   VITE_AWS_SECRET_ACCESS_KEY=tu_secret_access_key
   VITE_AWS_BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
   ```

> 🔒 **Nota de Seguridad**: El archivo `.env` está estrictamente ignorado por `.gitignore` para no subir credenciales privadas al repositorio. Además, las credenciales se pueden configurar dinámicamente desde el botón **"Configurar AWS"** en la interfaz sin necesidad de modificar archivos.

---

## 🚀 Guía de Despliegue en Render (Render Deployment)

Para desplegar este proyecto en **Render (Static Site)**:

1. Conecta este repositorio en tu panel de [Render Dashboard](https://dashboard.render.com).
2. Configura los siguientes parámetros de compilación:
   * **Branch**: `main`
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`
3. Variables de Entorno en Render (Opcional):
   * `VITE_AWS_REGION`: `us-east-1`
   * `VITE_AWS_BEDROCK_MODEL_ID`: `anthropic.claude-3-5-sonnet-20240620-v1:0`

---

## 💻 Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/JorgeMedranoGit/polyglot-engine.git
cd polyglot-engine

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo en vivo
npm run dev
```

Abre tu navegador en `http://localhost:3000/`.

---

## 📁 Ejemplos Incluidos (`examples/`)

El repositorio incluye dos carpetas de ejemplo listas para inspección:

* ☕ **[`examples/original-java-monolith/`](./examples/original-java-monolith/)**: Monolito en Java 17 Spring Boot con bloqueos JDBC y huella de 512MB RAM.
* 🦀 **[`examples/transpiled-rust-aws-serverless/`](./examples/transpiled-rust-aws-serverless/)**: Código objetivo transpilado semánticamente a AWS Lambda Rust + Amazon DynamoDB con 14MB de RAM.

---

## ✨ Características Principales

* 🌐 **Soporte Multilingüe (i18n)**: Alterna entre **Español (`ES`)** e **Inglés (`EN`)** en tiempo real.
* 📁 **Carga de Carpetas Anidadas**: Soporte para soltar carpetas jerárquicas completas (`src/main/java/...`).
* ⚡ **Refactorización Semántica con AWS Bedrock**: Transpilación asíncrona mediante Claude 3.5 Sonnet.
* 🔍 **Editor Lado a Lado & Grafo Topológico**: Visualización interactiva del flujo de funciones e infraestructura AWS.
* 🧪 **Sandbox Diferencial & Cliente HTTP**: Pruebas de equivalencia JSON y simulador estilo Thunder Client.
* 📊 **Telemetría ROI**: Ahorro del 97% en memoria RAM y 14.2x aceleración en latencia.
* 📦 **Exportador ZIP**: Descarga en 1-click de la suite completa en Rust con `Cargo.toml`.
