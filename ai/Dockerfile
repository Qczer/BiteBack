FROM python:3.13

WORKDIR /biteback/ai

COPY requirements.txt /biteback/ai/

RUN pip install --no-cache-dir --upgrade -r /biteback/ai/requirements.txt

COPY ./app /biteback/ai/app

EXPOSE 8001

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /biteback/ai/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
