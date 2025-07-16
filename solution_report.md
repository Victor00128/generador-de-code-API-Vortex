# Informe de Solución: Error "502 Bad Gateway"

## 1. Problema Identificado

El usuario reportó un error "502 Bad Gateway" al intentar acceder a la aplicación web. Este error, específicamente "502 Puerta de enlace no válida" con `nginx/1.27.0`, indica que el servidor proxy (nginx) no pudo obtener una respuesta válida del servidor de origen. En el contexto de este proyecto, el servidor de origen es el backend de Flask.

## 2. Diagnóstico del Problema

Se realizaron los siguientes pasos para diagnosticar la causa raíz del error:

1.  **Verificación del estado del backend Flask:** Se intentó iniciar el backend de Flask (`python src/main.py`) en el entorno de desarrollo. La ejecución reveló un `ModuleNotFoundError: No module named 'flask_cors'`.

    *   **Causa:** La dependencia `flask-cors` no estaba instalada en el entorno virtual del backend. Esta librería es crucial para permitir las solicitudes de origen cruzado (CORS) desde el frontend de React al backend de Flask, y su ausencia impedía que el servidor Flask se iniciara correctamente, lo que a su vez provocaba que el proxy Nginx no recibiera respuesta.

2.  **Revisión de la configuración del proxy (Vite):** Se confirmó que la configuración del proxy en `vite.config.ts` era correcta y apuntaba a `http://localhost:5000` para las solicitudes `/api`, lo que descartó un problema de configuración del proxy en el frontend.

## 3. Solución Implementada

Para resolver el error "502 Bad Gateway", se llevaron a cabo las siguientes acciones:

1.  **Instalación de `flask-cors`:** Se instaló la dependencia `flask-cors` en el entorno virtual del backend de Flask utilizando `pip`:
    ```bash
    cd /home/ubuntu/project/api-key-backend
    source venv/bin/activate
    pip install flask-cors
    pip freeze > requirements.txt
    ```

2.  **Reiniciar el Backend de Flask:** Una vez instalada la dependencia, se reinició el servidor de Flask para asegurar que los cambios surtieran efecto y que el backend pudiera iniciarse sin errores.
    ```bash
    cd /home/ubuntu/project/api-key-backend
    nohup python src/main.py > flask_output.log 2>&1 &
    ```

3.  **Reiniciar el Frontend de React:** Se reinició el servidor de desarrollo del frontend para asegurar una conexión limpia con el backend recién iniciado.
    ```bash
    cd /home/ubuntu/project/home/ubuntu/api-key-generator
    npm run dev
    ```

## 4. Verificación de la Solución

Después de implementar la solución, se realizaron pruebas exhaustivas para confirmar que la aplicación funcionaba correctamente y que el error "502 Bad Gateway" había sido resuelto. Los pasos de verificación incluyeron:

1.  **Acceso a la aplicación:** Se navegó a la URL proporcionada (`http://localhost:5173/`). La interfaz de usuario se cargó correctamente, indicando que la comunicación entre el frontend y el backend se había restablecido.

2.  **Generación de claves API:** Se hizo clic en el botón "Generate New API Key". Se generaron nuevas claves API y se mostraron en la interfaz, lo que confirmó que el frontend se comunicaba exitosamente con el endpoint `/api/keys` del backend para crear nuevas claves.

3.  **Copia de claves:** Se probó la funcionalidad de copiar claves al portapapeles, la cual funcionó como se esperaba.

4.  **Límite de claves:** Se intentó generar una tercera clave API (el límite configurado es de 2). La aplicación mostró correctamente el mensaje de error "API limit reached", lo que verificó que la lógica de negocio del backend estaba funcionando y que el frontend recibía y mostraba los mensajes de error del servidor.

5.  **Eliminación de claves:** Se probó la funcionalidad de eliminar una clave API. La clave se revocó exitosamente de la lista, confirmando la comunicación con el endpoint `DELETE /api/keys/{id}`.

## 5. Conclusión

El error "502 Bad Gateway" fue causado por la falta de la dependencia `flask-cors` en el entorno del backend de Flask, lo que impedía que el servidor se iniciara correctamente. La instalación de esta dependencia y el reinicio de ambos servicios (backend y frontend) resolvieron el problema por completo.

La aplicación ahora es completamente funcional, con la interfaz de usuario intacta y todas las funcionalidades operativas, demostrando una comunicación exitosa entre el frontend de React y el backend de Flask.

