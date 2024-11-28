
from utils.utils import is_valid_uuid
from rest_framework.exceptions import ValidationError


class ValidarAcceso:
    """
    Clase para valir parametros y el acceso del usuario a recursos especificos.
    """

    def __init__(self, user):
        self.user = user


    def validar_recurso(self, pk, metodo_validacion=None):
        """
        Valida si el `pk` es válido y, opcionalmente, si el recurso pertenece al usuario.

        params:
        :pk: Clave primaria del recurso.
        :metodo_validacion: Método estático del modelo para validar la relación con el usuario.
        :return: El recurso si es válido.
        :raises ValidationError: Si el recurso no es válido o no pertenece al usuario.
        """
        # Validar si el pk es un UUID válido
        if not is_valid_uuid(pk):
            raise ValidationError("Clave primaria inválida.")

        # Si el usuario es técnico, tiene acceso completo
        if self.user.is_tecnico:
            print(f"Acceso permitido para el técnico: {self.user.username}")
            return pk

        # Validar si el recurso pertenece al usuario con el método de validación
        if metodo_validacion and not metodo_validacion(pk, self.user):
            raise ValidationError("No tiene acceso a este recurso.")

        return pk



    def validar_query_params(self, parametros, request_data, validaciones_por_parametro=None):
        """
        Valida la presencia y validez de parámetros en query_params.

        :param parametros: Diccionario de {nombre_parametro: es_uuid}.
        :param request_data: Datos de la solicitud (query_params o request.data).
        :return: Diccionario con los parámetros validados.
        :param validaciones_por_parametro: Diccionario de {nombre_parametro: metodo_validacion}.
                                           - metodo_validacion: Método estático para validar pertenencia.
        :raises ValidationError: Si falta algún parámetro o no es válido.
        """
        errores = {}
        valores_validos = {}

        for nombre, es_uuid in parametros.items():
            valor = request_data.get(nombre)
            print(f'Validando {nombre} con valor {valor}')

            # Validar presencia del parámetro
            if not valor:
                errores[nombre] = f'El parámetro {nombre} es requerido.'
                continue # Saltar a la siguiente iteración

            # Validar formato UUID si es requerido
            if es_uuid and not is_valid_uuid(valor):
                errores[nombre] = f'El parámetro {nombre} debe ser un UUID válido.'
                continue # Saltar a la siguiente iteración

            # Validar pertenencia del recurso al usuario
            if self.user.is_cliente and validaciones_por_parametro and nombre in validaciones_por_parametro:
                metodo_validacion = validaciones_por_parametro[nombre]
                if not metodo_validacion(valor, self.user):
                    errores[nombre] = f'No tienes acceso al recurso asociado al parámetro {nombre}.'
                    continue # Saltar a la siguiente iteración

            # Agregar el valor validado
            valores_validos[nombre] = valor


        # Si hay errores, lanzar excepcion
        if errores:
            raise ValidationError(errores)

        # En caso de no haber errores, retornar los valores
        return valores_validos
