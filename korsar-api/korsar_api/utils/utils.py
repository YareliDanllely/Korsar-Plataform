from uuid import UUID



def is_valid_uuid(value):
    """
    Verifica si un valor es un UUID válido.
    """
    try:
        UUID(str(value))
        return True
    except ValueError:
        return False

