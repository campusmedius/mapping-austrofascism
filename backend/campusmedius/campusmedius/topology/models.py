from django.db import models


class Time(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class TimeInterval(models.Model):
    start = models.DateTimeField()
    end = models.DateTimeField()
    times = models.ManyToManyField(Time, related_name='time_intervals')


class Space(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Value(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Location(models.Model):
    lat = models.FloatField()
    lng = models.FloatField()
    spaces = models.ManyToManyField(Space, related_name='locations')


class Weight(models.Model):
    cost = models.DecimalField(default=1, max_digits=3, decimal_places=2)
    values = models.ManyToManyField(Value, related_name='weights')


class Mediation(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Representation(models.Model):
    name = models.CharField(max_length=200)
    mediations = models.ManyToManyField(Mediation,
                                        related_name='representations')

    def __str__(self):
        return self.name


class Experience(models.Model):
    name = models.CharField(max_length=200)
    time = models.ForeignKey(Time, on_delete=models.CASCADE)
    space = models.ForeignKey(Space, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class ExperienceRelation(models.Model):
    source = models.ForeignKey(Experience, related_name='sources', on_delete=models.CASCADE)
    target = models.ForeignKey(Experience, related_name='targets', on_delete=models.CASCADE)
    value = models.ForeignKey(Value, on_delete=models.CASCADE)
    mediation = models.ForeignKey(Mediation, on_delete=models.CASCADE)


class MediatorType(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Mediator(models.Model):
    name = models.CharField(max_length=200)
    type = models.ForeignKey(MediatorType, on_delete=models.CASCADE)
    time = models.ForeignKey(Time, null=True, blank=True, on_delete=models.CASCADE)
    space = models.ForeignKey(Space, null=True, blank=True, on_delete=models.CASCADE)

    experience = models.ForeignKey(Experience, related_name='mediators', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class MediatorRelation(models.Model):
    source = models.ForeignKey(Mediator, related_name='sources', on_delete=models.CASCADE)
    target = models.ForeignKey(Mediator, related_name='targets', on_delete=models.CASCADE)
    value = models.ForeignKey(Value, on_delete=models.CASCADE)
    mediation = models.ForeignKey(Mediation, on_delete=models.CASCADE)


class Information(models.Model):
    name = models.CharField(max_length=200)
    mediator = models.ForeignKey(Mediator, related_name='informations', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Text(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    informations = models.ManyToManyField(Information, related_name='texts')

    def __str__(self):
        return self.title


class Image(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
    description = models.TextField()
    informations = models.ManyToManyField(Information, related_name='images')

    def __str__(self):
        return self.title


class Audio(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
    description = models.TextField()
    informations = models.ManyToManyField(Information, related_name='audios')

    def __str__(self):
        return self.title


class Video(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField()
    description = models.TextField()
    informations = models.ManyToManyField(Information, related_name='videos')

    def __str__(self):
        return self.title
