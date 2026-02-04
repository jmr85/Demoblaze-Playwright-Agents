# Plan de Pruebas - Flujo de Compra de Producto

## Application Overview

Este plan de pruebas describe escenarios de prueba completos para validar el flujo de compra de productos en la tienda DemoBlaze. Incluye la navegación por categorías, selección de productos, gestión del carrito de compras y proceso de checkout.

## Test Scenarios

### 1. Navegación y Exploración de Productos

**Seed:** `tests/seed.spec.ts`

#### 1.1. Navegación por categorías de productos

**File:** `tests/product-navigation/category-navigation.spec.ts`

**Steps:**
  1. Navegar a la página principal de la tienda
    - expect: La página principal debe mostrarse con las categorías: Phones, Laptops, Monitors
  2. Hacer clic en la categoría 'Phones'
    - expect: Debe mostrarse una lista de productos de teléfonos (Samsung galaxy s6, Nokia lumia 1520, Nexus 6, etc.)
  3. Hacer clic en la categoría 'Laptops'
    - expect: Debe mostrarse una lista de productos de laptops (Sony vaio i5, Sony vaio i7, MacBook air, Dell i7 8gb, etc.)
  4. Hacer clic en la categoría 'Monitors'
    - expect: Debe mostrarse una lista de productos de monitores

#### 1.2. Visualización de detalles de producto

**File:** `tests/product-navigation/product-details.spec.ts`

**Steps:**
  1. Navegar a la categoría 'Phones'
    - expect: La lista de teléfonos debe mostrarse
  2. Hacer clic en el producto 'Samsung galaxy s6'
    - expect: Debe mostrarse la página de detalles del producto
    - expect: El título debe ser 'Samsung galaxy s6'
    - expect: El precio debe ser '$360 *includes tax'
    - expect: Debe mostrarse la descripción del producto
    - expect: Debe mostrarse el botón 'Add to cart'

### 2. Gestión del Carrito de Compras

**Seed:** `tests/seed.spec.ts`

#### 2.1. Agregar producto al carrito - Flujo exitoso

**File:** `tests/cart/add-to-cart-success.spec.ts`

**Steps:**
  1. Navegar a la página de detalles del producto 'Samsung galaxy s6'
    - expect: La página de detalles del producto debe mostrarse
  2. Hacer clic en el botón 'Add to cart'
    - expect: Debe aparecer un diálogo de alerta con el mensaje 'Product added'
  3. Aceptar el diálogo de alerta
    - expect: El diálogo debe cerrarse
  4. Navegar al carrito haciendo clic en 'Cart'
    - expect: Debe mostrarse la página del carrito
    - expect: El producto 'Samsung galaxy s6' debe estar en la lista
    - expect: El precio debe ser '360'
    - expect: El total debe ser '360'

#### 2.2. Agregar múltiples productos al carrito

**File:** `tests/cart/add-multiple-products.spec.ts`

**Steps:**
  1. Agregar el producto 'Samsung galaxy s6' ($360) al carrito
    - expect: Debe aparecer alerta de confirmación
  2. Navegar a la categoría 'Laptops' y seleccionar 'MacBook air' ($700)
    - expect: Debe mostrarse la página de detalles del MacBook air
  3. Hacer clic en 'Add to cart'
    - expect: Debe aparecer alerta de confirmación
  4. Navegar al carrito
    - expect: Deben mostrarse ambos productos: Samsung galaxy s6 y MacBook air
    - expect: El total debe ser 1060 (360 + 700)

#### 2.3. Eliminar producto del carrito

**File:** `tests/cart/remove-from-cart.spec.ts`

**Steps:**
  1. Agregar el producto 'Samsung galaxy s6' al carrito y navegar al carrito
    - expect: El producto debe estar visible en el carrito
  2. Hacer clic en el botón 'Delete' del producto
    - expect: El producto debe eliminarse de la lista
    - expect: El total debe actualizarse a 0

#### 2.4. Verificar carrito vacío

**File:** `tests/cart/empty-cart.spec.ts`

**Steps:**
  1. Navegar directamente a la página del carrito sin agregar productos
    - expect: La tabla de productos debe estar vacía
    - expect: El total debe estar vacío o en 0

### 3. Proceso de Checkout

**Seed:** `tests/seed.spec.ts`

#### 3.1. Completar compra con datos válidos

**File:** `tests/checkout/purchase-success.spec.ts`

**Steps:**
  1. Agregar el producto 'Samsung galaxy s6' al carrito y navegar al carrito
    - expect: El producto debe estar en el carrito con total de 360
  2. Hacer clic en el botón 'Place Order'
    - expect: Debe mostrarse un diálogo modal 'Place order'
    - expect: El total debe mostrarse: 'Total: 360'
    - expect: Deben mostrarse los campos: Name, Country, City, Credit card, Month, Year
  3. Completar el formulario con datos válidos (Name: John Doe, Country: United States, City: New York, Credit card: 4111111111111111, Month: 12, Year: 2026)
    - expect: Todos los campos deben llenarse correctamente
  4. Hacer clic en el botón 'Purchase'
    - expect: Debe mostrarse un diálogo de confirmación
    - expect: El mensaje debe ser 'Thank you for your purchase!'
    - expect: Debe mostrarse: ID de compra, Amount: 360 USD, Card Number, Name, Date
  5. Hacer clic en el botón 'OK'
    - expect: El diálogo debe cerrarse
    - expect: Debe redirigir a la página principal
    - expect: El carrito debe quedar vacío

#### 3.2. Intentar checkout con carrito vacío

**File:** `tests/checkout/empty-cart-checkout.spec.ts`

**Steps:**
  1. Navegar al carrito sin agregar productos
    - expect: El carrito debe estar vacío
  2. Hacer clic en el botón 'Place Order'
    - expect: Debe mostrarse el formulario de pedido con total vacío o 0

#### 3.3. Cancelar proceso de checkout

**File:** `tests/checkout/cancel-checkout.spec.ts`

**Steps:**
  1. Agregar un producto al carrito y hacer clic en 'Place Order'
    - expect: Debe mostrarse el formulario de checkout
  2. Hacer clic en el botón 'Close' del diálogo
    - expect: El diálogo debe cerrarse
    - expect: Debe permanecer en la página del carrito
    - expect: El producto debe seguir en el carrito

#### 3.4. Validación de campos obligatorios en checkout

**File:** `tests/checkout/required-fields-validation.spec.ts`

**Steps:**
  1. Agregar un producto al carrito y abrir el formulario de checkout
    - expect: El formulario debe mostrarse
  2. Dejar el campo 'Name' vacío y llenar los demás campos
    - expect: Debe validarse que el campo Name es requerido
  3. Dejar el campo 'Credit card' vacío y llenar los demás campos
    - expect: Debe validarse que el campo Credit card es requerido
  4. Intentar enviar el formulario con todos los campos vacíos
    - expect: Debe mostrarse alerta indicando que todos los campos son requeridos: 'Please fill out Name and Creditcard.'

#### 3.5. Compra de múltiples productos

**File:** `tests/checkout/multiple-products-purchase.spec.ts`

**Steps:**
  1. Agregar 'Samsung galaxy s6' ($360) y 'MacBook air' ($700) al carrito
    - expect: El carrito debe mostrar total de 1060
  2. Completar el proceso de checkout con datos válidos
    - expect: La confirmación debe mostrar 'Amount: 1060 USD'
    - expect: Todos los detalles de la compra deben ser correctos

### 4. Casos Edge y Validaciones

**Seed:** `tests/seed.spec.ts`

#### 4.1. Agregar el mismo producto múltiples veces

**File:** `tests/edge-cases/duplicate-product.spec.ts`

**Steps:**
  1. Agregar 'Samsung galaxy s6' al carrito
    - expect: El producto debe agregarse con total de 360
  2. Volver a la página del producto y agregarlo nuevamente
    - expect: Debe aparecer alerta de confirmación
  3. Verificar el carrito
    - expect: Pueden aparecer dos entradas del mismo producto o incrementarse la cantidad
    - expect: El total debe reflejar ambos productos (720)

#### 4.2. Navegación entre páginas con productos en carrito

**File:** `tests/edge-cases/cart-persistence.spec.ts`

**Steps:**
  1. Agregar un producto al carrito
    - expect: El producto debe estar en el carrito
  2. Navegar a diferentes categorías y páginas del sitio
    - expect: Los productos deben permanecer en el carrito
  3. Volver al carrito
    - expect: El producto debe seguir presente con el total correcto

#### 4.3. Validación de formato de tarjeta de crédito

**File:** `tests/edge-cases/credit-card-validation.spec.ts`

**Steps:**
  1. Intentar checkout con número de tarjeta inválido (menos de 16 dígitos)
    - expect: El sistema debe validar o aceptar según las reglas de negocio
  2. Intentar checkout con caracteres no numéricos en tarjeta
    - expect: El sistema debe validar o aceptar según las reglas de negocio

#### 4.4. Validación de fecha de expiración

**File:** `tests/edge-cases/expiration-date-validation.spec.ts`

**Steps:**
  1. Ingresar mes fuera de rango (13 o mayor)
    - expect: El sistema debe validar según las reglas de negocio
  2. Ingresar año pasado (2023)
    - expect: El sistema debe validar según las reglas de negocio
