from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Aerogenerador
from .serializers import AerogeneradorSerializer

class AerogeneradorViewSet(viewsets.ModelViewSet):
    """
    Definir las acciones que se pueden realizar en el API para la entidad Aerogenerador
    """

    queryset = Aerogenerador.objects.all()
    serializer_class = AerogeneradorSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder
