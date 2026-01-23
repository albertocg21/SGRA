import sys

# Datos de prueba (listas)
recursos_disponibles = [
    {"id": 1, "nombre": "Proyector A", "disponible": True},
    {"id": 2, "nombre": "Sala de Reuniones", "disponible": False},
    {"id": 3, "nombre": "Laptop Dell", "disponible": True}
]

def mostrar_menu():
    """Función para mostrar el menú principal."""
    print("\n--- Sistema de Gestión de Reservas (Módulo Python) ---")
    print("1. Listar recursos disponibles (Bucle/Condicional)")
    print("2. Intentar reservar un recurso (Excepciones/Lógica)")
    print("3. Salir")

def listar_recursos():
    """Recorre la lista de recursos y muestra su estado."""
    print("\n-- Estado de los Recursos --")
    # Uso de bucle for (RA3)
    for recurso in recursos_disponibles:
        # Uso de condicional if/else (RA2)
        estado = "Disponible" if recurso["disponible"] else "Ocupado"
        print(f"ID: {recurso['id']} | {recurso['nombre']} - [{estado}]")

def realizar_reserva():
    """Simula una reserva con validación de datos y manejo de errores."""
    listar_recursos()
    try:
        # Uso de input y conversión de tipos
        id_input = int(input("\nIngrese el ID del recurso a reservar: "))
        
        recurso_seleccionado = None
        
        # Búsqueda del recurso
        for recurso in recursos_disponibles:
            if recurso["id"] == id_input:
                recurso_seleccionado = recurso
                break
        
        if not recurso_seleccionado:
            print("Error: Recurso no encontrado.")
            return

        if not recurso_seleccionado["disponible"]:
            print(f"El recurso '{recurso_seleccionado['nombre']}' no está disponible.")
        else:
            recurso_seleccionado["disponible"] = False
            print(f"¡Reserva confirmada para '{recurso_seleccionado['nombre']}'!")

    except ValueError:
        # Manejo de excepciones (RA5)
        print("Error: Por favor ingrese un número válido para el ID.")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

def main():
    """Función principal que ejecuta el flujo del programa."""
    print("Iniciando sistema...")
    
    # Bucle principal (Estructura de control iterativa)
    while True:
        mostrar_menu()
        opcion = input("Seleccione una opción: ")
        
        if opcion == "1":
            listar_recursos()
        elif opcion == "2":
            realizar_reserva()
        elif opcion == "3":
            print("Saliendo del sistema...")
            break
        else:
            print("Opción no reconocida, intente de nuevo.")

if __name__ == "__main__":
    main()
