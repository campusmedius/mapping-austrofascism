# Use an official Python runtime as a parent image
FROM python:3.8

# Set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /usr/src/app

# Install dependencies
COPY requirements.txt /usr/src/app/
RUN pip3 install --no-cache-dir -r requirements.txt

# Install uwsgi
RUN pip3 install uwsgi

# Copy project
COPY ./campusmedius /usr/src/app/

ENV DB_PATH /data/db/db.sqlite3

EXPOSE 8000

# uwsgi configuration and run command
CMD ["uwsgi", "--chdir", "/usr/src/app", "--mount", "/api=campusmedius.wsgi:application", "--manage-script-name", "--master", "--http-socket", "0.0.0.0:8000", "--processes", "4", "--harakiri", "20", "--max-requests", "5000", "--vacuum"]
