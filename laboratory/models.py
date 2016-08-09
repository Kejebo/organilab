from __future__ import unicode_literals
from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _


@python_2_unicode_compatible
class LaboratoryRoom(models.Model):
    name = models.CharField(_('Name'), max_length=255)

    class Meta:
        verbose_name = _('Laboratory Room')
        verbose_name_plural = _('Laboratory Rooms')

    def __str__(self):
        return '%s' % (self.name,)


@python_2_unicode_compatible
class Furniture(models.Model):
    FURNITURE = 'F'
    DRAWER = 'D'
    TYPE_CHOICES = (
        (FURNITURE, _('Furniture')),
        (DRAWER, _('Drawer'))
    )
    labroom = models.ForeignKey('LaboratoryRoom')
    name = models.CharField(_('Name'), max_length=255)
    type = models.CharField(_('Type'), max_length=2, choices=TYPE_CHOICES)
    dataconfig = models.TextField(_('Data configuration'))

    class Meta:
        verbose_name = _('Piece of furniture')
        verbose_name_plural = _('Furniture')

    def __str__(self):
        return '%s' % (self.name,)


@python_2_unicode_compatible
class Shelf(models.Model):
    CRATE = 'C'
    DRAWER = 'D'
    TYPE_CHOICES = (
        (CRATE, _('Crate')),
        (DRAWER, _('Drawer'))
    )
    furniture = models.ForeignKey('Furniture')
    container_shelf = models.ForeignKey('Shelf', null=True, blank=True)
    type = models.CharField(_('Type'), max_length=2, choices=TYPE_CHOICES)

    class Meta:
        verbose_name = _('Shelf')
        verbose_name_plural = _('Shelves')

    def __str__(self):
        return '%s' % (self.furniture,)


@python_2_unicode_compatible
class ObjectFeatures(models.Model):
    GENERAL_USE = "0"
    SECURITY_EQUIPMENT = "1"
    ANALYTIC_CHEMISTRY = "2"
    ORGANIC_CHEMISTRY = "3"
    PHYSICAL_CHEMISTRY = "4"
    CHEMICAL_BIOLOGICAL_PROCESS = "5"
    INDUSTRIAL_BIOTECHNOLOGY = "6"
    BIOCHEMISTRY = "7"
    WATER_CHEMISTRY = "8"
    OTHER = "9"
    CHOICES = (
        (GENERAL_USE, _('General use')),
        (SECURITY_EQUIPMENT, _('Security equipment')),
        (ANALYTIC_CHEMISTRY, _('Analytic Chemistry')),
        (ORGANIC_CHEMISTRY, _('Organic Chemistry')),
        (PHYSICAL_CHEMISTRY, _('Physical Chemistry')),
        (CHEMICAL_BIOLOGICAL_PROCESS, _('Chemical and Biological process')),
        (INDUSTRIAL_BIOTECHNOLOGY, _('Industrial Biotechnology')),
        (BIOCHEMISTRY, _('Biochemistry')),
        (WATER_CHEMISTRY, _('Water Chemistry')),
        (OTHER, _('Other'))
    )

    name = models.CharField(_('Name'), max_length=2, choices=CHOICES)
    description = models.TextField(_('Description'))

    class Meta:
        verbose_name = _('Object feature')
        verbose_name_plural = _('Object features')

    def __str__(self):
        return '%s' % (self.CHOICES[int(self.name)][1],)


class Object(models.Model):
    REACTIVE = '0'
    MATERIAL = '1'
    EQUIPMENT = '2'
    TYPE_CHOICES = (
        (REACTIVE, _('Reactive')),
        (MATERIAL, _('Material')),
        (EQUIPMENT, _('Equipment'))
    )
    shelf = models.ForeignKey('Shelf')
    type = models.CharField(_('Type'), max_length=2, choices=TYPE_CHOICES)
    code = models.CharField(_('Code'), max_length=255)
    description = models.TextField(_('Description'))
    name = models.CharField(_('Name'), max_length=255)
    features = models.ManyToManyField(ObjectFeatures)

    class Meta:
        verbose_name = _('Object')
        verbose_name_plural = _('Objects')

    def __str__(self):
        return '%s' % (self.name,)


class ShelfObject(models.Model):
    M = '0'
    MM = '1'
    CM = '2'
    L = '3'
    ML = '4'
    CHOICES = (
        (M, _('Meters')),
        (MM, _('Milimeters')),
        (CM, _('Centimeters')),
        (L, _('Liters')),
        (ML, _('Mililiters'))
    )
    object = models.ForeignKey('Object')
    quantity = models.FloatField(_('Material quantity'))
    measurement_unit = models.CharField(_('Measurement unit'), max_length=2, choices=CHOICES)

    class Meta:
        verbose_name = _('Shelf object')
        verbose_name_plural = _('Shelf objects')

    def __str__(self):
        return '%s - %s %s' % (self.object, self.quantity, self.CHOICES[int(self.measurement_unit)][1])