from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from .models import Experience, ExperienceRelation, Mediator
from .models import MediatorRelation, Mediation, Representation, Information
from .models import Time, TimeInterval, Space, Location, Value, Weight

app_models = apps.get_app_config('topology').get_models()


class ExperienceMediatorInline(admin.TabularInline):
    model = Mediator
    extra = 1


class ExperienceIsTargetInline(admin.TabularInline):
    model = ExperienceRelation
    fk_name = 'target'
    extra = 1


class ExperienceIsSourceInline(admin.TabularInline):
    model = ExperienceRelation
    fk_name = 'source'
    extra = 1


class ExperienceAdmin(admin.ModelAdmin):
    inlines = [ExperienceIsSourceInline, ExperienceIsTargetInline,
               ExperienceMediatorInline]


admin.site.register(Experience, ExperienceAdmin)


class MediatorInformationInline(admin.TabularInline):
    model = Information
    extra = 1


class MediatorIsTargetInline(admin.TabularInline):
    model = MediatorRelation
    fk_name = 'target'
    extra = 1


class MediatorIsSourceInline(admin.TabularInline):
    model = MediatorRelation
    fk_name = 'source'
    extra = 1


class MediatorAdmin(admin.ModelAdmin):
    inlines = [MediatorIsSourceInline,
               MediatorIsTargetInline,
               MediatorInformationInline]


admin.site.register(Mediator, MediatorAdmin)


class TimeIntervalInline(admin.TabularInline):
    model = TimeInterval.times.through
    extra = 1


class TimeAdmin(admin.ModelAdmin):
    inlines = [TimeIntervalInline]


admin.site.register(Time, TimeAdmin)


class SpaceLocationInline(admin.TabularInline):
    model = Location.spaces.through
    extra = 1


class SpaceAdmin(admin.ModelAdmin):
    inlines = [SpaceLocationInline]


admin.site.register(Space, SpaceAdmin)


class ValueWeightInline(admin.TabularInline):
    model = Weight.values.through
    extra = 1


class ValueAdmin(admin.ModelAdmin):
    inlines = [ValueWeightInline]


admin.site.register(Value, ValueAdmin)


class MediationRepresentationInline(admin.TabularInline):
    model = Representation.mediations.through
    extra = 1


class MediationAdmin(admin.ModelAdmin):
    inlines = [MediationRepresentationInline]


admin.site.register(Mediation, MediationAdmin)


for model in app_models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass
