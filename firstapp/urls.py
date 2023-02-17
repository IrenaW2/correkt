from django.urls import path
from django.conf import settings
#from django.conf.urls.static import static

from . import views

app_name = 'firstapp'
urlpatterns = [
    path('', views.home, name='home'),
    path('second', views.second, name='second'),
    path('results', views.results, name='results'),
    path('get_data', views.get_data, name = 'get_data')
    # path('data', views.data, name = 'data')
]# + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
