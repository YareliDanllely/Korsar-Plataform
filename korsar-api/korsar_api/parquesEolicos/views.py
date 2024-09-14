from django.shortcuts import render

from rest_framework import viewsets
from .models import ParqueEolico
from .serializers import ParqueEolicoSerializer
from rest_framework.permissions import IsAuthenticated

class ParqueEolicoViewSet(viewsets.ModelViewSet):
    """
    Definimos las acciones que se pueden realizar en el API para la entidad ParqueEolico
    """

    queryset = ParqueEolico.objects.all()
    serializer_class = ParqueEolicoSerializer
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder
