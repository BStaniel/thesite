from django.db import models


# Create your models here.
class TF2ItemList(models.Model):
    name = models.CharField(max_length=100)
    img_path = models.CharField(max_length=100)

    def __str__(self):
        return self.name
