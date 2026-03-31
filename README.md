# 🚀 Sistema de Gestión de Inventario Escolar - Interfaz de Usuario

> Proyecto de Grado - Universidad Católica de Pereira

Este repositorio contiene la interfaz moderna y responsiva del sistema, diseñada con un enfoque SaaS para optimizar la gestión de activos escolares a través de una experiencia de usuario fluida y segura.

## 🎨 Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **React.js** | Biblioteca base para la creación de la UI |
| **Tailwind CSS v4** | Estilado dinámico y moderno (vanguardia visual) |
| **Axios** | Cliente HTTP para la comunicación con el Backend (API REST) |
| **React Router Dom v6** | Enrutamiento dinámico y protección de pestañas |
| **Lucide-React** | Sistema de iconografía profesional y vectorizada |

## ✨ Características Destacadas

- **Dashboards Diferenciados por Rol (`RBAC`):** Interfaces que cambian radicalmente según el usuario (ADMIN, COORDINADOR, DOCENTE).
- **Persistencia de Sesión:** Gestión global del estado con `AuthContext` y almacenamiento seguro en `localStorage`.
- **Consumo de Datos en Tiempo Real:** Sincronización total con el backend en el puerto 4000.
- **Diseño tipo SaaS:** Interfaz amigable, interactiva y totalmente responsiva.
- **Control de Flujo:** Implementación de `ProtectedRoutes` para evitar intrusiones.

## 🛠️ Pasos para la Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [URL_REPOSITORIO]
   ```

2. **Instalar los paquetes de Node:**
   ```bash
   npm install
   ```

3. **Iniciar la plataforma en entorno de desarrollo:**
   ```bash
   npm run dev
   ```
   *La plataforma correrá en: `http://localhost:5173`*

## 📓 Estructura del Proyecto

```text
src/
├── services/   # Comunicación API (Axios)
├── context/    # Estado Global (AuthContext)
├── layouts/    # Estructura Lateral y Cabecera
├── components/ # Modales e Interfaces Reutilizables
└── pages/      # Vistas del Sistema (Dashboard, Inventory, Loans, Users)
```

## 👤 Autor
- **Nombre:** Sebastian Patiño
- **Institución:** Universidad Católica de Pereira
