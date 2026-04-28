# Prueba Técnica — Daniel Guamán

Aplicación móvil en React Native (Expo) que consume la API pública [randomuser.me](https://randomuser.me) para listar usuarios, marcarlos como favoritos y editar información local.

---

## Requisitos previos

| Herramienta | Versión mínima | Notas |
|---|---|---|
| Node.js | 18+ | |
| pnpm | 9+ | `npm i -g pnpm` |
| Java (JDK) | 17+ | Android Studio incluye el JBR en `C:\Program Files\Android\Android Studio\jbr` |
| Android Studio | Ladybug+ | SDK Platform 36, Build-Tools 36, NDK 27.1 |
| Dispositivo/Emulador | Android API 24+ | |

> **JAVA_HOME** debe apuntar al JDK. Si usas el JBR de Android Studio:
> ```powershell
> [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
> ```
> Luego cierra y vuelve a abrir la terminal.

---

## Instalación

# Instalar dependencias
pnpm install
```

---

## Correr en Android

```bash
# Primera vez — genera la carpeta /android y compila el APK (tarda ~5 min)
pnpm android

# Veces siguientes — solo recarga JS (mucho más rápido)
pnpm start
```

> Si el build falla por un file lock en Windows, detén los daemons de Gradle y limpia:
> ```powershell
> ./android/gradlew.bat --stop
> Remove-Item -Recurse -Force node_modules\react-native-screens\android\build
> Remove-Item -Recurse -Force android\.gradle
> ```
> Luego vuelve a correr `pnpm android`.

---

## Estructura del proyecto

```
src/
├── api/
│   ├── config.ts           # Instancia de Axios + interceptor de errores (Toast)
│   └── usuarios.ts         # Endpoint GET /api/?results=30&seed=sip&page=N
│
├── components/
│   └── Usuarios/
│       ├── UserCard.tsx     # Tarjeta de usuario con checkbox, favorito y detalle
│       ├── FavoritesList.tsx# Carrusel horizontal de favoritos
│       ├── FavoriteCard.tsx # Tarjeta compacta para el carrusel
│       ├── LoadingState.tsx # Pantalla de carga
│       ├── ErrorState.tsx   # Pantalla de error con botón retry
│       └── EmptyState.tsx   # Pantalla de lista vacía
│
├── context/
│   └── UserContext.tsx      # Estado global con useReducer: favoritos, selección, teléfonos
│
├── navigation/
│   └── RootNavigator.tsx    # Stack: Home → Detail
│
├── screens/
│   ├── HomeScreen.tsx       # Lista paginada + buscador + selección múltiple
│   └── DetailScreen.tsx     # Perfil de usuario + edición de teléfono local
│
├── services/
│   └── usuario/
│       ├── useUsuariosListado.ts  # useInfiniteQuery — paginación infinita
│       └── usuarioKeys.ts         # Query keys de React Query
│
├── ts/
│   └── IUsuario.ts          # Interfaces: IUsuario, IUsuarioListado, IUsuarioParams, etc.
│
└── utils/
    ├── ICommonTypes.ts      # Tipo AxiosErrorType
    └── navigation.ts        # Tipos del stack de navegación
```

---

## Funcionalidades

### Pantalla principal (HomeScreen)

- **Lista paginada**: carga 30 usuarios por página, hace scroll infinito al llegar al final.
- **Ordenamiento**: lista ordenada por apellido de forma ascendente.
- **Buscador**: filtra en tiempo real por apellido.
- **Selección múltiple con regla de orden**: solo se puede seleccionar un usuario si el anterior en la lista ya está seleccionado (selección secuencial). Se puede deseleccionar solo si no hay usuarios seleccionados por debajo.
- **Seleccionar todos**: checkbox en el header de la lista.
- **Agregar a favoritos**: botón que aparece al seleccionar uno o más usuarios; los agrega todos a favoritos y limpia la selección.
- **Carrusel de favoritos**: aparece en la parte superior de la lista cuando hay al menos un favorito.
- **Pull-to-refresh**: deslizar hacia abajo recarga desde la página 1.

### Pantalla de detalle (DetailScreen)

- Foto, nombre completo, edad, email, teléfono, ubicación y dirección.
- Toggle de favorito (corazón) en el header.
- **Teléfono local editable**: campo de texto para guardar/actualizar un número propio; validación mínima de 7 caracteres. El valor se guarda en el contexto global y persiste mientras la app esté abierta.

---

## Stack técnico

| Librería | Uso |
|---|---|
| React Native 0.81 + Expo 54 | Framework base |
| React 19 | UI |
| TypeScript 5.9 | Tipado estático |
| @tanstack/react-query v5 | Fetching, caché y paginación (`useInfiniteQuery`) |
| Axios | Cliente HTTP |
| @react-navigation/native-stack | Navegación entre pantallas |
| react-native-safe-area-context | Manejo de safe areas (compatible con `edgeToEdgeEnabled`) |
| lucide-react-native | Iconografía |
| react-native-toast-message | Notificaciones de error de red |

---

## Decisiones técnicas relevantes

- **`newArchEnabled: false`** en `app.json`: la New Architecture de RN 0.81 tiene conflictos de tipado con `react-native-toast-message` v2 en Android. Se deshabilita para mantener la estabilidad.
- **`SafeAreaView` de `react-native-safe-area-context`** en lugar del nativo: necesario con `edgeToEdgeEnabled: true` en Android para que el header y los botones no queden detrás de la barra de estado.
- **Seed fijo (`seed=sip`)** en la URL: garantiza que la paginación sea consistente — la página 2 siempre devuelve los mismos 30 usuarios que siguen a los de la página 1.
- **Estado global con `useReducer`**: la lógica de selección secuencial es suficientemente compleja como para centralizar en un reducer en vez de estado local disperso.
