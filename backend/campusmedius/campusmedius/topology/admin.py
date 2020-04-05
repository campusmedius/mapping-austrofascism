from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from .models import Experience, Mediation
from .models import Mediator, Relation, Medium
from .models import Time, Space, Value

app_models = apps.get_app_config('topology').get_models()


class MediatorTargetInline(admin.TabularInline):
    model = Relation
    fk_name = 'target'
    extra = 1


class MediatorSourceInline(admin.TabularInline):
    model = Relation
    fk_name = 'source'
    extra = 1


class MediatorAdmin(admin.ModelAdmin):
    inlines = [MediatorSourceInline,
               MediatorTargetInline]

    list_display = (
        'id',
        'name_de',
        'name_en',
        'short_abstract_de',
        'short_abstract_en',
        'medium',
        'information'
    )


admin.site.register(Mediator, MediatorAdmin)


class TimeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name_de',
        'name_en',
    )

admin.site.register(Time, TimeAdmin)


class SpaceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name_de',
        'name_en',
    )

admin.site.register(Space, SpaceAdmin)


class ValueAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name_de',
        'name_en',
    )

admin.site.register(Value, ValueAdmin)


class MediatorInline(admin.TabularInline):
    model = Mediator
    extra = 1


class MediumAdmin(admin.ModelAdmin):
    inlines = [MediatorInline]

    list_display = (
        'id',
        'name_de',
        'name_en',
    )

admin.site.register(Medium, MediumAdmin)


class ExperienceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name_de',
        'name_en',
    )

admin.site.register(Experience, ExperienceAdmin)


class MediationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name_de',
        'name_en',
    )

admin.site.register(Mediation, MediationAdmin)


for model in app_models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass
