Mi experiencia probando Playwright Agents y qué aportan realmente en un contexto de automatización E2E.

Playwright Agents no se trata solo de “usar IA para escribir tests”, sino de trabajar con distintos agentes, cada uno con un rol concreto dentro del proceso de automatización. En lugar de escribir prompts sueltos, la idea es dividir responsabilidades y darle a cada agente una función clara, logrando más intención, contexto y consistencia.

Por ejemplo, hay agentes enfocados en planificar escenarios, que entienden el flujo funcional y definen qué se debería probar; otros que se encargan de generar los tests, transformando esos escenarios en acciones concretas sobre el navegador; y agentes orientados a ejecutar y validar, que recorren los flujos E2E respetando reglas y buenas prácticas. Esta separación ayuda a mantener el automation más ordenado y fácil de mantener.

- El agente **planner** explora la aplicación y produce un plan de pruebas en formato Markdown.
- El agente **generator** transforma el plan de pruebas de Markdown en scripts en Javascript/TypeScript (por ahora solo disponible en esos lenguajes) archivos de prueba de Playwright
- El agente **healer** ejecuta el script del conjunto de pruebas y repara automáticamente las pruebas fallidas.

Detrás de todo esto aparece MCP (Model Context Protocol), que es lo que permite que cada agente interactúe con Playwright de forma controlada. MCP define qué acciones puede ejecutar cada agente y cómo, evitando comportamientos impredecibles y asegurando que todos operen dentro de límites claros. Gracias a esto, los agentes no actúan “libremente”, sino alineados con criterios de calidad y testing reales.

## Instalación

Simplemente con el comando desde el proyecto raiz de Playwright

`npx playwright init-agents --loop=vscode`
 
> El parámetro `--loop=vscode` se utiliza cuando los Playwright Agents van a ser controlados desde Visual Studio Code, usando su entorno de chat/IA (por ejemplo, GitHub Copilot Chat u otras extensiones compatibles).


Se genera los archivos markdowns de los agentes, la configuracion de MCP, la carpeta specs donde iran los planes de prueba generados por planner agent y el un archivo seed que sirve para indicarle la URL desde donde comienza la inspeccion el agente **planner**


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z1ygibwfnfhvzn3vttz6.png)

## Planner Agent

Se va automatizar con https://www.demoblaze.com/ que es un sitio web de ecommerce simulado.

```ts
// tests\seed.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
    test('seed', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/');
    });
});
```

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fqfvnw9xi35utdabtdmx.png)

```markdown
<!-- specs\product_purchase_test_plan.md -->
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
```
[Ejemplo del plan de pruebas completo](https://github.com/jmr85/Demoblaze-Playwright-Agents/blob/main/specs/product_purchase_test_plan.md)


## Generator Agent

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5l0sfk68gdwc568s50qu.png)


```ts
// spec: specs/product_purchase_test_plan.md
// seed: tests/seed.spec.ts
// tests\checkout\purchase-success.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Proceso de Checkout', () => {
    test('Completar compra con datos válidos', async ({ page }) => {
        await page.goto('https://www.demoblaze.com/');

        // 1. Agregar el producto 'Samsung galaxy s6' al carrito y navegar al carrito
        await page.getByRole('link', { name: 'Phones' }).click();
        await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

        // Accept product added confirmation dialog
        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        await page.getByRole('link', { name: 'Add to cart' }).click();

        await page.getByRole('link', { name: 'Cart', exact: true }).click();

        // Wait for cart items to load
        await new Promise(f => setTimeout(f, 3 * 1000));

        // Verify Samsung galaxy s6 is in cart
        await expect(page.getByText('Samsung galaxy s6')).toBeVisible();

        // 2. Hacer clic en el botón 'Place Order'
        await page.getByRole('button', { name: 'Place Order' }).click();

        // Verify the checkout modal appears by checking form fields are visible
        await expect(page.locator('#name')).toBeVisible();

        // 3. Completar el formulario con datos válidos
        await page.locator('#name').fill('John Doe');
        await page.locator('#country').fill('United States');
        await page.locator('#city').fill('New York');
        await page.locator('#card').fill('4111111111111111');
        await page.locator('#month').fill('12');
        await page.locator('#year').fill('2026');
        // 4. Hacer clic en el botón 'Purchase'
        await page.getByRole('button', { name: 'Purchase' }).click();

        // Verify confirmation dialog appears
        await expect(page.getByText('Thank you for your purchase!')).toBeVisible();
        await expect(page.getByText('Name: John Doe')).toBeVisible();

        // Verify purchase details contain required information
        await expect(page.locator('text=Amount:')).toBeVisible();
        await expect(page.locator('text=Id:')).toBeVisible();

        // 5. Cerrar el cuadro de diálogo de confirmación
        await page.getByRole('button', { name: 'OK' }).click();

        // Verify cart is empty after successful purchase
        await page.getByRole('link', { name: 'Cart' }).click();

        // Verify cart is empty - no product rows should exist
        await expect(page.locator('table tbody tr').first()).not.toBeVisible();
    });
});
```

Si en el futuro es necesario editar el código de los tests generados, lo más conveniente es ajustar el prompt del Generator Agent para que genere el código teniendo en cuenta el patrón de diseño POM (Page Object Model). De esta forma se mejora la reutilización de código y se facilita el mantenimiento, tanto manual como automatizado.
[Adjunto un ejemplo de edición del **Generator Agent**](https://github.com/jmr85/Demoblaze-Playwright-Agents/blob/main/.github/agents/playwright-test-generator.agent.md) 

## Healer Agent

Si el test no fue exitoso porque el agent generator omitió un paso o una linea de codigo o hubo algun cambio en el DOM hay que seleccionar el healer agent y el archivo typescript especifico del test

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dgbh4lv8he0blrwssrbo.png)


A veces itera muchas veces gerando codigo innecesario y tal vez era sola agregar una linea de codigo para una acción específica que se omitió antes.

## Lo que me gustó

Usándolos en la práctica, hay cosas que claramente suman:

- Ayudan a **reducir trabajo repetitivo**, sobre todo al generar flujos E2E comunes
- Obligan a **pensar mejor la estructura** del automation
- Mantienen cierto **orden y coherencia** si el agente está bien definido
- Son útiles para **explorar escenarios** o armar bases de tests más rápido
- El plan de pruebas que genera sirve como borrador incluso para el tester manual.

No reemplazan el criterio del QA, pero sí **aceleran etapas mecánicas**.

## Los límites que encontré

- Si el agente no tiene reglas claras, **puede generar automatización mediocre**. 
- No siempre entiende el contexto funcional como lo haría alguien del negocio. Me pasó que al agente **Generator** omitió un paso que era simplemente hacer click en un boton para luego hacer otra accion encadenada. Luego el agente "Healer" estuvo iterando varias veces sin encontrar la solución y la tuve que revisar manualmente.
- Requieren **tiempo de setup y ajuste**, no es “plug & play”
- Si quieres aplicar POM (Page Object Model) y convenciones lo tienes que especificar en el agente **generator**. 
- Tener en cuenta que el agente **Generator** va generar siempre el code TypeScript dentro de la carpeta tests. Como en el ejemplo anterior el POM lo va a generar dentro de carpeta tests.

## Mi sensación general

Mi conclusión es bastante clara:  
**Playwright Agents no vienen a reemplazar al QA Automation**, pero sí pueden ser una buena herramienta si ya tenés bases sólidas y criterios claros.

Bien usados, ayudan a **ordenar, acelerar y estandarizar**.  
Mal usados, solo automatizan el caos más rápido.

Hoy los veo como un **complemento interesante**, no como una solución mágica. Y como casi todo en testing, el valor no está en la herramienta, sino en **cómo y cuándo la usás**.

Para quien quiera profundizar un poco más, dejo la documentación oficial de [Playwright Agents](https://playwright.dev/docs/test-agents)
Mi [repositorio en GitHub](https://github.com/jmr85/Demoblaze-Playwright-Agents), donde se pueden ver ejemplo del uso de Playwright Agents.